"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { getSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  address1: z.string(),
  address2: z.string(),
  kvk: z.string(),
  btwNr: z.string(),
  iban: z.string(),
  contact: z.string(),
  email: z.string(),
  phone: z.string(),
  web: z.string(),
  partner: z.string(),
  accent: z.string(),
  teal: z.string(),
  defaultMargin: z.coerce.number().min(0).max(100),
  btwRate: z.coerce.number().min(0).max(100),
  letter: z.string(),
});

export async function updateSettings(formData: FormData) {
  await requireUser();
  const parsed = schema.parse(Object.fromEntries(formData));
  const current = await getSettings();

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {
      company: {
        name: parsed.name,
        tagline: parsed.tagline,
        address1: parsed.address1,
        address2: parsed.address2,
        kvk: parsed.kvk,
        btwNr: parsed.btwNr,
        iban: parsed.iban,
        contact: parsed.contact,
        email: parsed.email,
        phone: parsed.phone,
        web: parsed.web,
        partner: parsed.partner,
      },
      accent: parsed.accent,
      teal: parsed.teal,
      defaultMargin: parsed.defaultMargin,
      btwRate: parsed.btwRate,
      fixedCopy: { ...current.fixedCopy, letter: parsed.letter },
    },
    create: {
      id: 1,
      company: {
        name: parsed.name,
        tagline: parsed.tagline,
        address1: parsed.address1,
        address2: parsed.address2,
        kvk: parsed.kvk,
        btwNr: parsed.btwNr,
        iban: parsed.iban,
        contact: parsed.contact,
        email: parsed.email,
        phone: parsed.phone,
        web: parsed.web,
        partner: parsed.partner,
      },
      accent: parsed.accent,
      teal: parsed.teal,
      defaultMargin: parsed.defaultMargin,
      btwRate: parsed.btwRate,
      fixedCopy: { ...current.fixedCopy, letter: parsed.letter },
    },
  });

  revalidatePath("/instellingen");
  redirect("/instellingen?saved=1");
}
