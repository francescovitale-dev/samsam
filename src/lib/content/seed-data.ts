// Seed catalog + example proposal, ported from the prototype's defaults().
// Prices below are in EUROS for readability; helpers convert to integer cents.
// Costs are derived so that sell = cost * (1 + 15%) reproduces the prototype figures
// (per acceptance criterion: seed data + 15% margins -> Huawei column € 77.155).

import type { BatterySpecs, ProposalData } from "@/lib/proposal/types";
import { costFromSell } from "@/lib/money";

export const DEFAULT_MARGIN = 15;
const eur = (n: number) => Math.round(n * 100); // euros -> cents

// ---- Batteries (real specs from prototype) ---------------------------------

interface SeedBattery {
  merk: string;
  type: string;
  prijs: number; // euros, headline "Prijs per Unit"
  prijsInvest: number; // euros, value in investering table
  photoUrl: string;
  specs: BatterySpecs;
}

export const SEED_BATTERIES: SeedBattery[] = [
  {
    merk: "Huawei",
    type: "LUNA 215",
    prijs: 53400,
    prijsInvest: 53400,
    photoUrl: "/brand/bat-huawei.png",
    specs: {
      cooling: "Liquid",
      capaciteit: "215kWh",
      dod: "100%",
      vermogen: "108",
      crate: "0,5C",
      cycli: "7300",
      eol: "60%",
      totaalkwh: "1.569 MWh",
      rte: "91.3%",
      garantieCellen: "10 jaar",
      garantiePCS: "10 jaar",
      garantieOverige: "10 jaar",
      balans: "Actief",
      levensduur: "20 jaar",
      bouwkwaliteit: "Zeer goed",
      sterren: 5,
    },
  },
  {
    merk: "MARS",
    type: "ARISTOTLE",
    prijs: 42094,
    prijsInvest: 42094,
    photoUrl: "/brand/bat-mars.png",
    specs: {
      cooling: "Liquid",
      capaciteit: "261kWh",
      dod: "100%",
      vermogen: "125",
      crate: "0,5C",
      cycli: "7000",
      eol: "60%",
      totaalkwh: "1.736 MWh",
      rte: "90,8%",
      garantieCellen: "10 jaar",
      garantiePCS: "5 jaar",
      garantieOverige: "2 jaar",
      balans: "Passief",
      levensduur: "15 jaar",
      bouwkwaliteit: "Goed",
      sterren: 4.5,
    },
  },
  {
    merk: "Fox",
    type: "Fox G-Max 215",
    prijs: 37950,
    prijsInvest: 38350,
    photoUrl: "/brand/bat-fox.png",
    specs: {
      cooling: "Liquid",
      capaciteit: "215kWh",
      dod: "100%",
      vermogen: "100",
      crate: "0,5C",
      cycli: "8000",
      eol: "70%",
      totaalkwh: "1.492 MWh",
      rte: "89.6%",
      garantieCellen: "10 jaar",
      garantiePCS: "5 jaar",
      garantieOverige: "3 jaar",
      balans: "Passief",
      levensduur: "15 jaar",
      bouwkwaliteit: "Goed",
      sterren: 4,
    },
  },
];

// ---- Shared line items (euros) ---------------------------------------------

export const SEED_INVESTERING = {
  transport: 1200,
  grondwerk: 2950,
  hekwerk: 2145,
  pgs: 1650,
  keuring: 1100,
  ac: 9500,
  bpm: 1210, // optioneel
  ems: 4000,
};

export const SEED_WERK = {
  grondwerk: 2750,
  hekwerk: 2700,
  pgs: 1650,
  keuring: 1100,
  ac: 9500,
  onderhoud: 1000,
  emsEenmalig: 4000,
  emsPerMaand: 80,
};

export const SEED_JAARLIJKS = { ems: 960, onderhoud: 1000 };

export const SEED_CUSTOMER = {
  naam: "Pluimveebedrijf Visscher",
  adres1: "Hessenweg 91",
  adres2: "7722 SX",
  plaatsdatum: "Utrecht, maandag 27 oktober 2025",
  referentie: "Pluimveebedrijf Visscher",
  contact: "Jimmy Lindeman",
  email: "jimmy@samsam.nu",
  onderwerp: "Aanbieding energieopslag",
  geldigheid: "14 dagen",
  aanhef: "Geachte heer Visscher,",
};

// ---- Catalog products for the Prisma seed ----------------------------------

export interface SeedProduct {
  name: string;
  category: "battery" | "work" | "ems" | "option" | "charger";
  costPrice: number; // cents
  margin: number;
  unit: string;
  specs?: BatterySpecs;
  photoUrl?: string;
}

export const SEED_CATALOG: SeedProduct[] = [
  ...SEED_BATTERIES.map((b) => ({
    name: `${b.merk} ${b.type}`,
    category: "battery" as const,
    costPrice: costFromSell(eur(b.prijs), DEFAULT_MARGIN),
    margin: DEFAULT_MARGIN,
    unit: "st",
    specs: b.specs,
    photoUrl: b.photoUrl,
  })),
  { name: "Transportkosten en afval", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.transport), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Fundatie / Grondwerk (stelpost)", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.grondwerk), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Hekwerk / Brandmuur", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.hekwerk), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "PGS 37-1 Documenten", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.pgs), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Keuring NEN-1010", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.keuring), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "AC Werkzaamheden (stelpost)", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.ac), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Extra BPM t.b.v. batterij (optioneel)", category: "option", costPrice: costFromSell(eur(SEED_INVESTERING.bpm), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "EMS – SmartBox Power", category: "ems", costPrice: costFromSell(eur(SEED_INVESTERING.ems), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  {
    name: "Alfen DC 60kW",
    category: "charger",
    costPrice: costFromSell(eur(10000), DEFAULT_MARGIN),
    margin: DEFAULT_MARGIN,
    unit: "st",
    specs: {
      cooling: "", capaciteit: "", dod: "", vermogen: "60 kW", crate: "", cycli: "", eol: "",
      totaalkwh: "", rte: "", garantieCellen: "", garantiePCS: "", garantieOverige: "",
      balans: "", levensduur: "", bouwkwaliteit: "", sterren: 0,
    },
  },
];

// ---- Example proposal (the prototype's "Voorbeeld") ------------------------

export function buildExampleProposalData(): ProposalData {
  return {
    templateType: "battery",
    design: "modern",
    customer: { ...SEED_CUSTOMER },
    batteries: SEED_BATTERIES.map((b) => ({
      merk: b.merk,
      type: b.type,
      specs: { ...b.specs },
      photoUrl: b.photoUrl,
      prijs: eur(b.prijs),
      prijsInvest: eur(b.prijsInvest),
    })),
    cols: 3,
    investering: {
      transport: eur(SEED_INVESTERING.transport),
      grondwerk: eur(SEED_INVESTERING.grondwerk),
      hekwerk: eur(SEED_INVESTERING.hekwerk),
      pgs: eur(SEED_INVESTERING.pgs),
      keuring: eur(SEED_INVESTERING.keuring),
      ac: eur(SEED_INVESTERING.ac),
      bpm: eur(SEED_INVESTERING.bpm),
      ems: eur(SEED_INVESTERING.ems),
    },
    werkzaamheden: {
      grondwerk: eur(SEED_WERK.grondwerk),
      hekwerk: eur(SEED_WERK.hekwerk),
      pgs: eur(SEED_WERK.pgs),
      keuring: eur(SEED_WERK.keuring),
      ac: eur(SEED_WERK.ac),
      onderhoud: eur(SEED_WERK.onderhoud),
      emsEenmalig: eur(SEED_WERK.emsEenmalig),
      emsPerMaand: eur(SEED_WERK.emsPerMaand),
    },
    jaarlijks: { ems: eur(SEED_JAARLIJKS.ems), onderhoud: eur(SEED_JAARLIJKS.onderhoud) },
    btwRate: 21,
  };
}
