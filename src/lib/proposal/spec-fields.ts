// Metadata for the battery spec sheet, matching BatterySpecs keys (types.ts).
// Ported from the prototype's BATFIELDS. Used by the catalog form and renderer.

export interface SpecField {
  key: string;
  label: string;
  kind?: "text" | "number";
}

export const BATTERY_SPEC_FIELDS: SpecField[] = [
  { key: "cooling", label: "Cooling" },
  { key: "capaciteit", label: "Capaciteit" },
  { key: "dod", label: "DOD" },
  { key: "vermogen", label: "Vermogen (kW)" },
  { key: "crate", label: "C-Rate" },
  { key: "cycli", label: "Cycli" },
  { key: "eol", label: "End Of Life" },
  { key: "totaalkwh", label: "Totaal kWh" },
  { key: "rte", label: "Efficiency (RTE)" },
  { key: "garantieCellen", label: "Garantie Cellen" },
  { key: "garantiePCS", label: "Garantie PCS" },
  { key: "garantieOverige", label: "Garantie Overige" },
  { key: "balans", label: "Cell Balans" },
  { key: "levensduur", label: "Verwachte levensduur" },
  { key: "bouwkwaliteit", label: "Bouwkwaliteit" },
  { key: "sterren", label: "Sterren (0-5)", kind: "number" },
];

export const PRODUCT_CATEGORIES = [
  { value: "battery", label: "Batterij" },
  { value: "work", label: "Werkzaamheden" },
  { value: "ems", label: "EMS" },
  { value: "option", label: "Optie" },
  { value: "charger", label: "Lader" },
] as const;

export function categoryLabel(value: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
