import type { AppSettings } from "@/lib/settings";
import type { DocSettings } from "@/components/proposal/proposal-document";

/** Map persisted app settings into the presentational DocSettings the renderer needs. */
export function toDocSettings(s: AppSettings): DocSettings {
  return {
    company: {
      name: s.company.name,
      tagline: s.company.tagline,
      web: s.company.web,
      address1: s.company.address1,
      address2: s.company.address2,
      iban: s.company.iban,
      btwNr: s.company.btwNr,
      kvk: s.company.kvk,
      email: s.company.email,
      contact: s.company.contact,
      partner: s.company.partner,
    },
    fixedCopy: s.fixedCopy,
    logoUrl: s.logoUrl || "/brand/logo.png",
    accent: s.accent,
    teal: s.teal,
  };
}
