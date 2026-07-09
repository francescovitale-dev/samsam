import { prisma } from "@/lib/prisma";
import { COMPANY, FIX, type FixedCopy } from "@/lib/content/fix";

export interface CompanyInfo {
  name: string;
  tagline: string;
  address1: string;
  address2: string;
  kvk: string;
  btwNr: string;
  iban: string;
  contact: string;
  email: string;
  phone: string;
  web: string;
  partner: string;
}

export interface AppSettings {
  company: CompanyInfo;
  logoUrl: string | null;
  accent: string;
  teal: string;
  defaultMargin: number;
  btwRate: number;
  fixedCopy: FixedCopy;
}

const DEFAULT_COMPANY: CompanyInfo = {
  name: COMPANY.name,
  tagline: COMPANY.tagline,
  address1: COMPANY.address1,
  address2: COMPANY.address2,
  kvk: COMPANY.kvk,
  btwNr: COMPANY.btwNr,
  iban: COMPANY.iban,
  contact: COMPANY.contact,
  email: COMPANY.email,
  phone: COMPANY.phone,
  web: COMPANY.web,
  partner: COMPANY.partner,
};

/** Load app settings, falling back to ported defaults if the row is missing. */
export async function getSettings(): Promise<AppSettings> {
  const row = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!row) {
    return {
      company: DEFAULT_COMPANY,
      logoUrl: "/brand/logo.png",
      accent: "#9EC63F",
      teal: "#5BA99B",
      defaultMargin: 15,
      btwRate: 21,
      fixedCopy: FIX,
    };
  }
  return {
    company: { ...DEFAULT_COMPANY, ...(row.company as Partial<CompanyInfo>) },
    logoUrl: row.logoUrl,
    accent: row.accent,
    teal: row.teal,
    defaultMargin: row.defaultMargin,
    btwRate: row.btwRate,
    fixedCopy: { ...FIX, ...(row.fixedCopy as Partial<FixedCopy>) },
  };
}
