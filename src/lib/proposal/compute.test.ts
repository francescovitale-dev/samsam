import { describe, it, expect } from "vitest";
import { computeTotals } from "./compute";
import { formatEur, formatEur2, costFromSell } from "@/lib/money";
import { buildExampleProposalData, DEFAULT_MARGIN } from "@/lib/content/seed-data";

describe("computeTotals — acceptance criteria (§13)", () => {
  const data = buildExampleProposalData();
  const totals = computeTotals(data);

  it("Huawei column total excl. BTW is € 77.155 with seed data + 15% margins", () => {
    expect(formatEur(totals.columns[0].exclBTW)).toBe("€ 77.155");
    expect(totals.columns[0].exclBTW).toBe(7_715_500); // exact cents
  });

  it("computes 21% BTW and incl. BTW for the Huawei column", () => {
    const c = totals.columns[0];
    expect(c.btw).toBe(Math.round((7_715_500 * 21) / 100));
    expect(c.inclBTW).toBe(c.exclBTW + c.btw);
  });

  it("renders three columns (Huawei / MARS / Fox)", () => {
    expect(totals.columns).toHaveLength(3);
    // MARS: 42.094 + 23.755 shared = 65.849 ; Fox invest 38.350 + 23.755 = 62.105
    expect(formatEur(totals.columns[1].exclBTW)).toBe("€ 65.849");
    expect(formatEur(totals.columns[2].exclBTW)).toBe("€ 62.105");
  });

  it("computes price per kWh (Huawei 215 kWh)", () => {
    const c = totals.columns[0];
    expect(c.capacityKwh).toBe(215);
    expect(c.pricePerKwhCents).toBe(Math.round(7_715_500 / 215));
    // sanity: formatted, ~€ 358,86
    expect(formatEur2(c.pricePerKwhCents)).toBe("€ 358,86");
  });

  it("adds the DC-lader price to the total for the battery_charger template", () => {
    const charged = buildExampleProposalData();
    charged.templateType = "battery_charger";
    charged.charger = { merk: "Alfen", type: "DC 60kW", prijs: 1_000_000 }; // € 10.000
    charged.cols = 1;
    const t = computeTotals(charged);
    // € 77.155 + € 10.000 = € 87.155
    expect(formatEur(t.columns[0].exclBTW)).toBe("€ 87.155");
    expect(t.columns[0].exclBTW).toBe(8_715_500);
  });

  it("derives internal gross margin when cost inputs are supplied", () => {
    const batteryInvestCost = data.batteries
      .slice(0, data.cols)
      .map((b) => costFromSell(b.prijsInvest, DEFAULT_MARGIN));
    const shared = totals.sharedExclBTW;
    const sharedCost = costFromSell(shared, DEFAULT_MARGIN);
    const withCost = computeTotals(data, { batteryInvestCost, sharedCost });
    const c = withCost.columns[0];
    expect(c.cost).toBeGreaterThan(0);
    expect(c.grossMargin).toBe(c.exclBTW - (c.cost ?? 0));
    // ~15% margin back-derived (within rounding)
    expect(Math.round(c.grossMarginPct ?? 0)).toBe(15);
  });
});
