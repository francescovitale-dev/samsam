import { describe, it, expect } from "vitest";
import { computeTotals, sharedInvestering } from "./compute";
import { formatEur, formatEur2, costFromSell } from "@/lib/money";
import { buildExampleProposalData, DEFAULT_MARGIN } from "@/lib/content/seed-data";

describe("computeTotals — unified cost model", () => {
  const data = buildExampleProposalData();
  const totals = computeTotals(data);

  // shared = transport 1200 + roef 2950 + keuring 1100 + hekwerk 2145
  //        + grondwerk 2750 + ac 9500 + ems 4000 = € 23.645
  const shared = sharedInvestering(data.investering);

  it("sums the seven cost lines (standaard + optioneel) to € 23.645", () => {
    expect(shared).toBe(2_364_500);
    expect(formatEur(shared)).toBe("€ 23.645");
  });

  it("Huawei column excl. BTW = battery € 53.400 + shared € 23.645 = € 77.045", () => {
    expect(totals.columns[0].exclBTW).toBe(7_704_500);
    expect(formatEur(totals.columns[0].exclBTW)).toBe("€ 77.045");
  });

  it("computes 21% BTW and incl. BTW", () => {
    const c = totals.columns[0];
    expect(c.btw).toBe(Math.round((7_704_500 * 21) / 100));
    expect(c.inclBTW).toBe(c.exclBTW + c.btw);
  });

  it("renders three columns (Huawei / MARS / Fox)", () => {
    expect(totals.columns).toHaveLength(3);
    expect(formatEur(totals.columns[1].exclBTW)).toBe("€ 65.739"); // MARS 42.094 + 23.645
    expect(formatEur(totals.columns[2].exclBTW)).toBe("€ 61.995"); // Fox 38.350 + 23.645
  });

  it("computes price per kWh (Huawei 215 kWh)", () => {
    const c = totals.columns[0];
    expect(c.capacityKwh).toBe(215);
    expect(formatEur2(c.pricePerKwhCents)).toBe("€ 358,35");
  });

  it("adds all included laders to every battery column total", () => {
    const charged = buildExampleProposalData();
    charged.chargers = [
      { merk: "Autel", type: "240kW", prijs: 1_000_000 }, // € 10.000
      { merk: "Autel", type: "480kW", prijs: 500_000 }, // € 5.000
    ];
    charged.cols = 1;
    const t = computeTotals(charged);
    expect(formatEur(t.columns[0].exclBTW)).toBe("€ 92.045"); // 77.045 + 15.000
  });

  it("derives internal gross margin when cost inputs are supplied", () => {
    const batteryInvestCost = data.batteries
      .slice(0, data.cols)
      .map((b) => costFromSell(b.prijsInvest, DEFAULT_MARGIN));
    const sharedCost = costFromSell(shared, DEFAULT_MARGIN);
    const withCost = computeTotals(data, { batteryInvestCost, sharedCost });
    const c = withCost.columns[0];
    expect(c.grossMargin).toBe(c.exclBTW - (c.cost ?? 0));
    expect(Math.round(c.grossMarginPct ?? 0)).toBe(15);
  });
});
