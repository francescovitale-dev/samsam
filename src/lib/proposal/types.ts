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
  prijs: Money; // headline "Prijs per Unit"
  prijsInvest: Money; // value used in the investering table
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

/** Line items shown in the "Eenmalige investering" table (client-facing sell prices). */
export interface InvesteringLines {
  transport: Money;
  grondwerk: Money;
  hekwerk: Money;
  pgs: Money;
  keuring: Money;
  ac: Money;
  bpm: Money; // optional item
  ems: Money;
}

/** Amounts shown on the werkzaamheden (stelposten) pages — independent of the investering table. */
export interface WerkzaamhedenLines {
  grondwerk: Money;
  hekwerk: Money;
  pgs: Money;
  keuring: Money;
  ac: Money;
  onderhoud: Money;
  emsEenmalig: Money;
  emsPerMaand: Money;
}

export interface JaarlijksLines {
  ems: Money;
  onderhoud: Money;
}

export interface ProposalData {
  templateType: TemplateType;
  design: string; // theme id, presentation only
  customer: CustomerBlock;
  batteries: BatteryOption[]; // 1..3
  charger?: ChargerOption; // present iff templateType === 'battery_charger'
  cols: 1 | 2 | 3;
  investering: InvesteringLines;
  werkzaamheden: WerkzaamhedenLines;
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
