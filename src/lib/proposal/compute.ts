import { parseKwh } from "@/lib/money";
import type {
  ProposalData,
  ProposalTotals,
  ColumnTotals,
  CostInputs,
  InvesteringLines,
} from "./types";

/** Sum of the shared investering line items (everything except the battery price). */
export function sharedInvestering(inv: InvesteringLines): number {
  return (
    inv.transport +
    inv.grondwerk +
    inv.hekwerk +
    inv.pgs +
    inv.keuring +
    inv.ac +
    inv.bpm +
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
  // The DC-lader (battery_charger template) is part of the one-time investment.
  const chargerPrice =
    data.templateType === "battery_charger" && data.charger ? data.charger.prijs : 0;
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
