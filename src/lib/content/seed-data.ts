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
  // standaard
  transport: 1200,
  roef: 2950,
  keuring: 1100,
  // optioneel
  hekwerk: 2145,
  grondwerk: 2750,
  ac: 9500,
  ems: 4000,
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
  specs?: Record<string, string | number>;
  photoUrl?: string;
}

// Real SamSam product lineup. Prices start at € 0 — set them in Catalogus.
function catalogSpecs(merk: string, type: string, vermogen: string, capaciteit: string) {
  return {
    merk,
    type,
    cooling: "",
    capaciteit,
    dod: "",
    vermogen,
    crate: "",
    cycli: "",
    eol: "",
    totaalkwh: "",
    rte: "",
    garantieCellen: "",
    garantiePCS: "",
    garantieOverige: "",
    balans: "",
    levensduur: "",
    bouwkwaliteit: "",
    sterren: 0,
  };
}

const REAL_BATTERIES = [
  { merk: "Huawei", vermogen: "108", capaciteit: "215kWh" },
  { merk: "Huawei", vermogen: "108", capaciteit: "241kWh" },
  { merk: "FoxEss", vermogen: "100", capaciteit: "215kWh" },
  { merk: "Mars", vermogen: "30", capaciteit: "100kWh" },
  { merk: "Mars", vermogen: "50", capaciteit: "100kWh" },
  { merk: "Mars", vermogen: "125", capaciteit: "261kWh" },
  { merk: "Mars", vermogen: "250", capaciteit: "1023kWh" },
  { merk: "Mars", vermogen: "500", capaciteit: "1013kWh" },
];

const REAL_CHARGERS = [
  { merk: "Autel", vermogen: "240" },
  { merk: "Autel", vermogen: "480" },
];

export const SEED_CATALOG: SeedProduct[] = [
  ...REAL_BATTERIES.map((b) => ({
    name: `${b.merk} ${b.vermogen}kW - ${b.capaciteit}`,
    category: "battery" as const,
    costPrice: 0,
    margin: DEFAULT_MARGIN,
    unit: "st",
    specs: catalogSpecs(b.merk, `${b.vermogen}kW - ${b.capaciteit}`, b.vermogen, b.capaciteit),
  })),
  { name: "Transportkosten en afval", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.transport), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "ROEF verhogingsbalken", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.roef), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Keuring NEN-1010", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.keuring), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Hekwerk / brandvertragende betonwering", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.hekwerk), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "Grondwerk (stelpost)", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.grondwerk), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "AC Werkzaamheden (stelpost)", category: "work", costPrice: costFromSell(eur(SEED_INVESTERING.ac), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  { name: "EMS – SmartBox Power", category: "ems", costPrice: costFromSell(eur(SEED_INVESTERING.ems), DEFAULT_MARGIN), margin: DEFAULT_MARGIN, unit: "st" },
  ...REAL_CHARGERS.map((c) => ({
    name: `${c.merk} ${c.vermogen}kW`,
    category: "charger" as const,
    costPrice: 0,
    margin: DEFAULT_MARGIN,
    unit: "st",
    specs: catalogSpecs(c.merk, `${c.vermogen}kW`, `${c.vermogen} kW`, ""),
  })),
];

// ---- Example proposal (the prototype's "Voorbeeld") ------------------------

export function buildExampleProposalData(): ProposalData {
  return {
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
    chargers: [],
    cols: 3,
    investering: {
      transport: eur(SEED_INVESTERING.transport),
      roef: eur(SEED_INVESTERING.roef),
      keuring: eur(SEED_INVESTERING.keuring),
      hekwerk: eur(SEED_INVESTERING.hekwerk),
      grondwerk: eur(SEED_INVESTERING.grondwerk),
      ac: eur(SEED_INVESTERING.ac),
      ems: eur(SEED_INVESTERING.ems),
    },
    jaarlijks: {
      ems: eur(SEED_JAARLIJKS.ems),
      onderhoudBss: eur(SEED_JAARLIJKS.onderhoud),
      bssConfig: "1",
      onderhoudLader: 0,
      laderType: "single",
      laderCount: "1",
    },
    btwRate: 21,
  };
}
