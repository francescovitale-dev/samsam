"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  company: z.string().min(1, "Bedrijfsnaam is verplicht"),
  contact: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  adres1: z.string().optional().default(""),
  adres2: z.string().optional().default(""),
});

export async function saveCustomer(id: string | null, formData: FormData) {
  await requireUser();
  const p = schema.parse(Object.fromEntries(formData));
  const data = {
    company: p.company,
    contact: p.contact || null,
    email: p.email || null,
    phone: p.phone || null,
    address: { adres1: p.adres1, adres2: p.adres2 },
  };
  if (id) {
    await prisma.customer.update({ where: { id }, data });
  } else {
    await prisma.customer.create({ data });
  }
  revalidatePath("/klanten");
  redirect("/klanten?saved=1");
}

export async function deleteCustomer(id: string) {
  await requireUser();
  const count = await prisma.proposal.count({ where: { customerId: id } });
  if (count > 0) {
    // Keep referential integrity: don't delete customers with proposals.
    redirect("/klanten?blocked=1");
  }
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/klanten");
  redirect("/klanten?deleted=1");
}
