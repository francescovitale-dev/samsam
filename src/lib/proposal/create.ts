import { sellCents, costFromSell, parseKwh } from "@/lib/money";
import { SEED_JAARLIJKS, SEED_INVESTERING } from "@/lib/content/seed-data";
import type { BatteryOption, BatterySpecs, CostInputs, ProposalData } from "./types";
import { sharedInvestering } from "./compute";

const eur = (n: number) => Math.round(n * 100);

/**
 * Offer presets shown in "Nieuwe offerte". The two battery lines preload
 * catalog batteries by capacity; the charger line preloads a DC-lader.
 */
export type OfferPreset = "battery_large" | "battery_small" | "battery_charger";

/** kWh threshold splitting the large (241/261 kWh) line from the small (100 kWh) line. */
const LARGE_KWH_THRESHOLD = 150;

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
  return {
    merk,
    type,
    specs,
    photoUrl: p.photoUrl ?? undefined,
    inkoop: p.costPrice,
    margin: p.margin,
    prijs: sell,
    prijsInvest: sell,
  };
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
  preset: OfferPreset,
  design: string,
  btwRate: number,
  plaatsdatum: string,
): { data: ProposalData; costInputs: CostInputs } {
  const templateType = preset === "battery_charger" ? "battery_charger" : "battery";

  // Preload batteries by capacity line (falls back to all if the bucket is empty).
  const allBatteries = catalog.filter((p) => p.category === "battery");
  const isLarge = (p: CatalogProduct) =>
    parseKwh(specsFromProduct(p).specs.capaciteit) >= LARGE_KWH_THRESHOLD;
  let batteryProducts =
    preset === "battery_small"
      ? allBatteries.filter((p) => !isLarge(p))
      : preset === "battery_large"
        ? allBatteries.filter(isLarge)
        : allBatteries;
  if (batteryProducts.length === 0) batteryProducts = allBatteries;
  batteryProducts = batteryProducts.slice(0, 3);

  const batteries = batteryProducts.map(productToBattery);
  const cols = (Math.min(Math.max(batteries.length, 1), 3) || 1) as 1 | 2 | 3;

  const address = (customer.address as { adres1?: string; adres2?: string } | null) ?? {};

  const investering = {
    // standaard
    transport: invValue(catalog, /transport/i, SEED_INVESTERING.transport),
    roef: invValue(catalog, /roef/i, SEED_INVESTERING.roef),
    keuring: invValue(catalog, /keuring/i, SEED_INVESTERING.keuring),
    // optioneel
    hekwerk: invValue(catalog, /hekwerk/i, SEED_INVESTERING.hekwerk),
    grondwerk: invValue(catalog, /grondwerk|fundatie/i, SEED_INVESTERING.grondwerk),
    ac: invValue(catalog, /ac werkzaamheden|^ac/i, SEED_INVESTERING.ac),
    ems: invValue(catalog, /smartbox|ems/i, SEED_INVESTERING.ems),
  };

  const charger =
    templateType === "battery_charger"
      ? (() => {
          const c = catalog.find((p) => p.category === "charger");
          if (!c) return { merk: "DC", type: "Lader", prijs: 0 };
          const { merk, type, specs } = specsFromProduct(c);
          return {
            merk,
            type,
            vermogen: specs.vermogen || undefined,
            prijs: sellCents(c.costPrice, c.margin),
            photoUrl: c.photoUrl ?? undefined,
          };
        })()
      : undefined;

  const data: ProposalData = {
    templateType,
    design,
    customer: {
      naam: customer.company,
      adres1: address.adres1 ?? "",
      adres2: address.adres2 ?? "",
      plaatsdatum,
      referentie: customer.company,
      contact: customer.contact ?? "",
      email: customer.email ?? "",
      onderwerp: "Aanbieding energieopslag",
      geldigheid: "14 dagen",
      aanhef: "Geachte heer/mevrouw,",
    },
    batteries,
    charger,
    cols,
    investering,
    jaarlijks: {
      ems: eur(SEED_JAARLIJKS.ems),
      onderhoudBss: eur(SEED_JAARLIJKS.onderhoud),
      bssConfig: "1",
      onderhoudLader: 0,
      laderType: "single",
      laderCount: "1",
    },
    btwRate,
  };

  // Cost inputs for the internal margin view (real catalog costs).
  const batteryInvestCost = batteryProducts.map((p) => p.costPrice);
  const chargerCost = charger ? costFromSell(charger.prijs, 15) : 0;
  const sharedCost = sharedInvestering(deriveSharedCosts(catalog, investering)) + chargerCost;

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
    roef: cost(/roef/i, inv.roef),
    keuring: cost(/keuring/i, inv.keuring),
    hekwerk: cost(/hekwerk/i, inv.hekwerk),
    grondwerk: cost(/grondwerk|fundatie/i, inv.grondwerk),
    ac: cost(/ac werkzaamheden|^ac/i, inv.ac),
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
  // Prefer the per-battery purchase price (inkoop); fall back to prior snapshot or back-derivation.
  const batteryInvestCost = cols.map((b, i) =>
    b.inkoop != null
      ? b.inkoop
      : prior?.batteryInvestCost[i] ?? costFromSell(b.prijsInvest, defaultMargin),
  );
  const sharedCost = prior?.sharedCost ?? costFromSell(sharedInvestering(data.investering), defaultMargin);
  return { batteryInvestCost, sharedCost };
}
