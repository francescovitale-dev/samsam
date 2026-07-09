// Canonical proposal data shape. ONE structure, many looks:
// both templateTypes and every design theme render from this exact shape.
// All money fields are integer euro-cents.

export type Money = number; // integer euro-cents

export type TemplateType = "battery" | "battery_charger";

export interface BatterySpecs {
  cooling: string;
  capaciteit: string; // e.g. "215kWh"
  dod: string;
  vermogen: string; // kW as string, e.g. "108"
  crate: string;
  cycli: string;
  eol: string;
  totaalkwh: string;
  rte: string;
  garantieCellen: string;
  garantiePCS: string;
  garantieOverige: string;
  balans: string;
  levensduur: string;
  bouwkwaliteit: string;
  sterren: number; // 0..5, halves allowed
}

export interface BatteryOption {
  merk: string;
  type: string;
  specs: BatterySpecs;
  photoUrl?: string;
  inkoop?: Money; // purchase price per unit (cost)
  margin?: number; // margin percent applied to inkoop
  prijs: Money; // headline "Prijs per Unit" = total (inkoop + margin)
  prijsInvest: Money; // value used in the investering table (kept equal to prijs)
}

export interface ChargerOption {
  merk: string;
  type: string;
  vermogen?: string;
  prijs: Money;
  photoUrl?: string;
}

export interface CustomerBlock {
  naam: string;
  adres1: string;
  adres2: string;
  plaatsdatum: string;
  referentie: string;
  contact: string;
  email: string;
  onderwerp: string;
  geldigheid: string;
  aanhef: string;
}

/**
 * One-time cost lines (client-facing sell prices). Unified: the same values
 * appear in the investering table AND the werkzaamheden pages.
 * Split into standaard (always) and optioneel (may be 0).
 */
export interface CostLines {
  // standaard
  transport: Money;
  roef: Money;
  keuring: Money;
  // optioneel
  hekwerk: Money;
  grondwerk: Money;
  ac: Money;
  ems: Money;
}

export type BssConfig = "1" | "2" | "3" | "4" | "5" | "MW";
export type LaderType = "single" | "double";
export type LaderCount = "1" | "2" | "3";

/** Annual costs. Maintenance is configured (BSS units / lader setup) + a manual amount. */
export interface JaarlijksLines {
  ems: Money; // EMS jaarlijks
  onderhoudBss: Money;
  bssConfig: BssConfig;
  onderhoudLader: Money;
  laderType: LaderType;
  laderCount: LaderCount;
}

export interface ProposalData {
  templateType: TemplateType;
  design: string; // theme id, presentation only
  customer: CustomerBlock;
  batteries: BatteryOption[]; // 1..3
  charger?: ChargerOption; // present iff templateType === 'battery_charger'
  cols: 1 | 2 | 3;
  investering: CostLines;
  jaarlijks: JaarlijksLines;
  btwRate: number; // default 21
  notes?: string;
}

/**
 * Internal-only cost inputs (never client-facing, never part of ProposalData).
 * Passed to computeTotals() to derive gross margin for the internal margin view.
 */
export interface CostInputs {
  batteryInvestCost: Money[]; // cost (cents) matching each battery's prijsInvest
  sharedCost: Money; // total cost (cents) of the shared investering line items
}

export interface ColumnTotals {
  exclBTW: Money;
  btw: Money;
  inclBTW: Money;
  capacityKwh: number;
  pricePerKwhCents: number; // exclBTW / capacityKwh
  /** internal-only, present only when CostInputs supplied */
  cost?: Money;
  grossMargin?: Money;
  grossMarginPct?: number;
}

export interface ProposalTotals {
  columns: ColumnTotals[];
  sharedExclBTW: Money; // sum of shared investering lines (no battery)
}
