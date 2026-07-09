// Money is stored as integer euro-cents everywhere. Format nl-NL only at display.
// Ported from the prototype helpers `eur`, `eur2`, `num`.

/** Format cents as "€ 53.400" (no decimals, nl-NL thousands separator). */
export function formatEur(cents: number): string {
  const euros = (isFinite(cents) ? cents : 0) / 100;
  return "€ " + euros.toLocaleString("nl-NL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/** Format cents as "€ 358,86" (2 decimals) — used for price-per-kWh. */
export function formatEur2(cents: number): string {
  const euros = (isFinite(cents) ? cents : 0) / 100;
  return "€ " + euros.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Parse a Dutch-formatted euro string ("53.400" / "1.234,50" / "€ 53.400")
 * into integer cents. Mirrors the prototype's `num()` (thousands '.', decimal ',').
 */
export function parseEurToCents(input: string | number | null | undefined): number {
  if (typeof input === "number") return Math.round(input * 100);
  const cleaned = String(input ?? "")
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const v = parseFloat(cleaned);
  return isFinite(v) ? Math.round(v * 100) : 0;
}

/** Sell price (cents) derived from a cost (cents) + margin percent. */
export function sellCents(costCents: number, marginPct: number): number {
  return Math.round(costCents * (1 + marginPct / 100));
}

/** Given a sell price (cents) and margin percent, back out the implied cost (cents). */
export function costFromSell(sellCents: number, marginPct: number): number {
  return Math.round(sellCents / (1 + marginPct / 100));
}

/**
 * Parse a capacity label like "215kWh" / "261 kWh" into a number of kWh.
 * Uses Dutch number parsing (so "1.569" -> 1569). Returns 0 if unparseable.
 */
export function parseKwh(label: string | number | null | undefined): number {
  if (typeof label === "number") return label;
  const m = String(label ?? "").match(/[\d.,]+/);
  if (!m) return 0;
  const v = parseFloat(m[0].replace(/\./g, "").replace(",", "."));
  return isFinite(v) ? v : 0;
}

/** Render a star rating (e.g. 4.5 -> "★★★★½"). Mirrors prototype `stars`. */
export function stars(value: number | string): string {
  const n = parseFloat(String(value).replace(",", ".")) || 0;
  const full = Math.floor(n);
  const half = n - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
}
