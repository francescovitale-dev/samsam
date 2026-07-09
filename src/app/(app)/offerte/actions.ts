"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { getSettings } from "@/lib/settings";
import { buildInitialProposalData, deriveCostInputsOnSave } from "@/lib/proposal/create";
import { computeTotals } from "@/lib/proposal/compute";
import { hasChargers, type CostInputs, type ProposalData } from "@/lib/proposal/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** "Utrecht, maandag 27 oktober 2025" — the day the offer is made, in Dutch. */
function todayPlaatsdatum(plaats = "Utrecht"): string {
  const date = new Date().toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${plaats}, ${date}`;
}

async function nextProposalNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `OF${year}-`;
  const last = await prisma.proposal.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const lastSeq = last ? parseInt(last.number.slice(prefix.length), 10) || 0 : 0;
  return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
}

export async function createProposal(formData: FormData) {
  await requireUser();
  const customerId = String(formData.get("customerId") || "");
  const design = String(formData.get("design") || "modern");
  if (!customerId) redirect("/offerte/nieuw?error=customer");

  const [customer, catalog, settings] = await Promise.all([
    prisma.customer.findUnique({ where: { id: customerId } }),
    prisma.product.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    getSettings(),
  ]);
  if (!customer) redirect("/offerte/nieuw?error=customer");

  const { data, costInputs } = buildInitialProposalData(
    customer,
    catalog,
    design,
    settings.btwRate,
    todayPlaatsdatum(),
  );

  const totals = { ...computeTotals(data, costInputs), costInputs };
  const number = await nextProposalNumber();

  const created = await prisma.proposal.create({
    data: {
      number,
      customerId,
      templateType: hasChargers(data) ? "battery_charger" : "battery",
      design,
      status: "draft",
      validityDays: 14,
      data: data as unknown as object,
      totals: totals as unknown as object,
      events: { create: { type: "created", meta: { by: "app" } } },
    },
  });

  revalidatePath("/");
  redirect(`/offerte/${created.id}`);
}

export async function saveProposal(id: string, dataJson: string) {
  await requireUser();
  const data = JSON.parse(dataJson) as ProposalData;
  const settings = await getSettings();

  const existing = await prisma.proposal.findUnique({ where: { id }, select: { totals: true } });
  const priorCost = (existing?.totals as { costInputs?: CostInputs } | null)?.costInputs;
  const costInputs = deriveCostInputsOnSave(data, priorCost, settings.defaultMargin);
  const totals = { ...computeTotals(data, costInputs), costInputs };

  await prisma.proposal.update({
    where: { id },
    data: {
      templateType: hasChargers(data) ? "battery_charger" : "battery",
      design: data.design,
      data: data as unknown as object,
      totals: totals as unknown as object,
    },
  });

  revalidatePath(`/offerte/${id}`);
  revalidatePath("/");
  return { ok: true };
}

const ALLOWED_STATUS = ["draft", "accepted", "rejected"];

export async function setProposalStatus(id: string, status: string) {
  await requireUser();
  if (!ALLOWED_STATUS.includes(status)) return { ok: false };
  await prisma.proposal.update({ where: { id }, data: { status } });
  revalidatePath("/");
  revalidatePath(`/offerte/${id}`);
  return { ok: true };
}

export async function duplicateProposal(id: string) {
  await requireUser();
  const src = await prisma.proposal.findUnique({ where: { id } });
  if (!src) redirect("/");
  const number = await nextProposalNumber();
  const copy = await prisma.proposal.create({
    data: {
      number,
      customerId: src.customerId,
      templateType: src.templateType,
      design: src.design,
      status: "draft",
      validityDays: src.validityDays,
      data: src.data as object,
      totals: src.totals as object,
      events: { create: { type: "created", meta: { duplicatedFrom: src.number } } },
    },
  });
  revalidatePath("/");
  redirect(`/offerte/${copy.id}`);
}

export async function deleteProposal(id: string) {
  await requireUser();
  await prisma.proposal.delete({ where: { id } });
  revalidatePath("/");
  redirect("/?deleted=1");
}
