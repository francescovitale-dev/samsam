import { sellCents, costFromSell } from "@/lib/money";
import {
  SEED_WERK,
  SEED_JAARLIJKS,
  SEED_INVESTERING,
} from "@/lib/content/seed-data";
import type { BatteryOption, BatterySpecs, CostInputs, ProposalData, TemplateType } from "./types";
import { sharedInvestering } from "./compute";

const eur = (n: number) => Math.round(n * 100);

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  margin: number;
  specs: unknown;
  photoUrl: string | null;
}

interface CustomerLike {
  company: string;
  contact: string | null;
  email: string | null;
  address: unknown;
}

function specsFromProduct(p: CatalogProduct): { merk: string; type: string; specs: BatterySpecs } {
  const raw = (p.specs as Record<string, unknown> | null) ?? {};
  const merk = typeof raw.merk === "string" ? raw.merk : p.name.split(" ")[0] ?? p.name;
  const type =
    typeof raw.type === "string" ? raw.type : p.name.split(" ").slice(1).join(" ") || p.name;
  const specs: BatterySpecs = {
    cooling: String(raw.cooling ?? ""),
    capaciteit: String(raw.capaciteit ?? ""),
    dod: String(raw.dod ?? ""),
    vermogen: String(raw.vermogen ?? ""),
    crate: String(raw.crate ?? ""),
    cycli: String(raw.cycli ?? ""),
    eol: String(raw.eol ?? ""),
    totaalkwh: String(raw.totaalkwh ?? ""),
    rte: String(raw.rte ?? ""),
    garantieCellen: String(raw.garantieCellen ?? ""),
    garantiePCS: String(raw.garantiePCS ?? ""),
    garantieOverige: String(raw.garantieOverige ?? ""),
    balans: String(raw.balans ?? ""),
    levensduur: String(raw.levensduur ?? ""),
    bouwkwaliteit: String(raw.bouwkwaliteit ?? ""),
    sterren: typeof raw.sterren === "number" ? raw.sterren : parseFloat(String(raw.sterren ?? 0)) || 0,
  };
  return { merk, type, specs };
}

export function productToBattery(p: CatalogProduct): BatteryOption {
  const { merk, type, specs } = specsFromProduct(p);
  const sell = sellCents(p.costPrice, p.margin);
  return { merk, type, specs, photoUrl: p.photoUrl ?? undefined, prijs: sell, prijsInvest: sell };
}

/** Match a catalog product to an investering slot by name (falls back to seed default). */
function invValue(products: CatalogProduct[], match: RegExp, fallbackEuros: number): number {
  const p = products.find((x) => match.test(x.name));
  return p ? sellCents(p.costPrice, p.margin) : eur(fallbackEuros);
}

/**
 * Build the initial proposal snapshot from the LIVE catalog + a customer.
 * Batteries and investering line items reflect current catalog sell prices,
 * so changing a catalog price affects new proposals only (existing snapshots
 * are frozen). Werk-page stelposten + annual costs default from seed values.
 */
export function buildInitialProposalData(
  customer: CustomerLike,
  catalog: CatalogProduct[],
  templateType: TemplateType,
  design: string,
  btwRate: number,
): { data: ProposalData; costInputs: CostInputs } {
  const batteryProducts = catalog.filter((p) => p.category === "battery").slice(0, 3);
  const batteries = batteryProducts.map(productToBattery);
  const cols = (Math.min(Math.max(batteries.length, 1), 3) || 1) as 1 | 2 | 3;

  const address = (customer.address as { adres1?: string; adres2?: string } | null) ?? {};

  const investering = {
    transport: invValue(catalog, /transport/i, SEED_INVESTERING.transport),
    grondwerk: invValue(catalog, /grondwerk|fundatie/i, SEED_INVESTERING.grondwerk),
    hekwerk: invValue(catalog, /hekwerk/i, SEED_INVESTERING.hekwerk),
    pgs: invValue(catalog, /pgs/i, SEED_INVESTERING.pgs),
    keuring: invValue(catalog, /keuring/i, SEED_INVESTERING.keuring),
    ac: invValue(catalog, /ac werkzaamheden|^ac/i, SEED_INVESTERING.ac),
    bpm: invValue(catalog, /bpm/i, SEED_INVESTERING.bpm),
    ems: invValue(catalog, /smartbox|ems/i, SEED_INVESTERING.ems),
  };

  const charger =
    templateType === "battery_charger"
      ? (() => {
          const c = catalog.find((p) => p.category === "charger");
          if (!c) return { merk: "DC", type: "Lader", prijs: 0 };
          const { merk, type } = specsFromProduct(c);
          return { merk, type, prijs: sellCents(c.costPrice, c.margin), photoUrl: c.photoUrl ?? undefined };
        })()
      : undefined;

  const data: ProposalData = {
    templateType,
    design,
    customer: {
      naam: customer.company,
      adres1: address.adres1 ?? "",
      adres2: address.adres2 ?? "",
      plaatsdatum: "",
      referentie: customer.company,
      contact: customer.contact ?? "",
      email: customer.email ?? "",
      onderwerp: "Aanbieding energieopslag",
      geldigheid: "14 dagen",
      aanhef: "",
    },
    batteries,
    charger,
    cols,
    investering,
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
    btwRate,
  };

  // Cost inputs for the internal margin view (real catalog costs).
  const batteryInvestCost = batteryProducts.map((p) => p.costPrice);
  const sharedCost = sharedInvestering(deriveSharedCosts(catalog, investering));

  return { data, costInputs: { batteryInvestCost, sharedCost } };
}

/** Cost side of the shared investering lines, matched from catalog. */
function deriveSharedCosts(catalog: CatalogProduct[], inv: ProposalData["investering"]) {
  const cost = (match: RegExp, sell: number) => {
    const p = catalog.find((x) => match.test(x.name));
    return p ? p.costPrice : costFromSell(sell, 15);
  };
  return {
    transport: cost(/transport/i, inv.transport),
    grondwerk: cost(/grondwerk|fundatie/i, inv.grondwerk),
    hekwerk: cost(/hekwerk/i, inv.hekwerk),
    pgs: cost(/pgs/i, inv.pgs),
    keuring: cost(/keuring/i, inv.keuring),
    ac: cost(/ac werkzaamheden|^ac/i, inv.ac),
    bpm: cost(/bpm/i, inv.bpm),
    ems: cost(/smartbox|ems/i, inv.ems),
  };
}

/**
 * Re-derive cost inputs on save. Batteries: keep prior real costs when the
 * column count is unchanged; otherwise back-derive at the default margin.
 */
export function deriveCostInputsOnSave(
  data: ProposalData,
  prior: CostInputs | undefined,
  defaultMargin: number,
): CostInputs {
  const cols = data.batteries.slice(0, data.cols);
  const batteryInvestCost =
    prior && prior.batteryInvestCost.length === cols.length
      ? prior.batteryInvestCost
      : cols.map((b) => costFromSell(b.prijsInvest, defaultMargin));
  const sharedCost = prior?.sharedCost ?? costFromSell(sharedInvestering(data.investering), defaultMargin);
  return { batteryInvestCost, sharedCost };
}
