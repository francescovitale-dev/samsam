import { parseKwh } from "@/lib/money";
import type {
  ProposalData,
  ProposalTotals,
  ColumnTotals,
  CostInputs,
  CostLines,
} from "./types";

/** Sum of the shared cost lines (everything except the battery price). */
export function sharedInvestering(inv: CostLines): number {
  return (
    inv.transport +
    inv.roef +
    inv.keuring +
    inv.hekwerk +
    inv.grondwerk +
    inv.ac +
    inv.ems
  );
}

/**
 * The single source of truth for proposal math. Pure function of the snapshot.
 * Every design theme and template MUST derive totals from here so they never diverge.
 *
 * Mirrors the prototype exactly:
 *   columnTotalExclBTW = prijsInvest + transport + grondwerk + hekwerk + pgs
 *                        + keuring + ac + bpm + ems
 *   btw = round(total * btwRate/100)
 *   pricePerKwh = columnTotalExclBTW / capacityKwh
 */
export function computeTotals(data: ProposalData, costs?: CostInputs): ProposalTotals {
  const shared = sharedInvestering(data.investering);
  // Laders are included add-ons, summed into every battery column.
  const chargerPrice = (data.chargers ?? []).reduce((sum, c) => sum + c.prijs, 0);
  const cols = data.batteries.slice(0, data.cols);

  const columns: ColumnTotals[] = cols.map((b, i) => {
    const exclBTW = b.prijsInvest + shared + chargerPrice;
    const btw = Math.round((exclBTW * data.btwRate) / 100);
    const inclBTW = exclBTW + btw;
    const capacityKwh = parseKwh(b.specs.capaciteit);
    const pricePerKwhCents = capacityKwh > 0 ? Math.round(exclBTW / capacityKwh) : 0;

    const col: ColumnTotals = { exclBTW, btw, inclBTW, capacityKwh, pricePerKwhCents };

    if (costs) {
      const cost = (costs.batteryInvestCost[i] ?? 0) + costs.sharedCost;
      col.cost = cost;
      col.grossMargin = exclBTW - cost;
      col.grossMarginPct = cost > 0 ? ((exclBTW - cost) / cost) * 100 : 0;
    }
    return col;
  });

  return { columns, sharedExclBTW: shared };
}
