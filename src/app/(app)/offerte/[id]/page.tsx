import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { toDocSettings } from "@/lib/proposal/doc-settings";
import { productToBattery, productToCharger, type CatalogProduct } from "@/lib/proposal/create";
import type { ProposalData } from "@/lib/proposal/types";
import { ProposalBuilder } from "./proposal-builder";

export const dynamic = "force-dynamic";

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;

  const [proposal, settings, catalog] = await Promise.all([
    prisma.proposal.findUnique({ where: { id } }),
    getSettings(),
    prisma.product.findMany({
      where: { active: true, category: { in: ["battery", "charger"] } },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!proposal) notFound();

  const catalogBatteries = catalog
    .filter((p) => p.category === "battery")
    .map((p) => ({ id: p.id, option: productToBattery(p as unknown as CatalogProduct) }));
  const catalogChargers = catalog
    .filter((p) => p.category === "charger")
    .map((p) => ({ id: p.id, option: productToCharger(p as unknown as CatalogProduct) }));

  return (
    <ProposalBuilder
      proposalId={proposal.id}
      number={proposal.number}
      status={proposal.status}
      initialData={proposal.data as unknown as ProposalData}
      settings={toDocSettings(settings)}
      catalogBatteries={catalogBatteries}
      catalogChargers={catalogChargers}
    />
  );
}
