"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { storeUpload } from "@/lib/upload";
import { BATTERY_SPEC_FIELDS } from "@/lib/proposal/spec-fields";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function eurosToCents(v: FormDataEntryValue | null): number {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isFinite(n) ? Math.round(n * 100) : 0;
}

function buildSpecs(fd: FormData): Record<string, string | number> | undefined {
  const category = String(fd.get("category"));
  if (category !== "battery" && category !== "charger") return undefined;
  const specs: Record<string, string | number> = {
    merk: String(fd.get("merk") ?? ""),
    type: String(fd.get("type") ?? ""),
  };
  for (const f of BATTERY_SPEC_FIELDS) {
    const raw = fd.get(`spec_${f.key}`);
    specs[f.key] = f.kind === "number" ? parseFloat(String(raw ?? "0")) || 0 : String(raw ?? "");
  }
  return specs;
}

export async function saveProduct(id: string | null, formData: FormData) {
  await requireUser();

  const category = String(formData.get("category") || "work");
  const merk = String(formData.get("merk") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const nameInput = String(formData.get("name") ?? "").trim();
  const isBatteryLike = category === "battery" || category === "charger";
  const name = isBatteryLike ? `${merk} ${type}`.trim() : nameInput;

  const costPrice = eurosToCents(formData.get("costPrice"));
  const margin = parseFloat(String(formData.get("margin") ?? "0")) || 0;
  const unit = String(formData.get("unit") || "st");
  const active = formData.get("active") != null;
  const specs = buildSpecs(formData);

  const photo = formData.get("photo");
  const uploadedUrl = await storeUpload(photo instanceof File ? photo : null, "products");
  const existingPhotoUrl = String(formData.get("existingPhotoUrl") ?? "") || null;
  const photoUrl = uploadedUrl ?? existingPhotoUrl;

  const data = {
    name: name || "Naamloos",
    category,
    costPrice,
    margin,
    unit,
    active,
    specs: specs ?? undefined,
    photoUrl,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/catalogus");
  redirect("/catalogus?saved=1");
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireUser();
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/catalogus");
}

export async function deleteProduct(id: string) {
  await requireUser();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/catalogus");
  redirect("/catalogus?deleted=1");
}
