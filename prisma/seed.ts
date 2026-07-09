import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { COMPANY, FIX } from "../src/lib/content/fix";
import {
  SEED_CATALOG,
  SEED_CUSTOMER,
  DEFAULT_MARGIN,
  buildExampleProposalData,
} from "../src/lib/content/seed-data";
import { computeTotals } from "../src/lib/proposal/compute";
import { costFromSell } from "../src/lib/money";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // ---- Setting (singleton) ----
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      company: {
        name: COMPANY.name,
        tagline: COMPANY.tagline,
        address1: COMPANY.address1,
        address2: COMPANY.address2,
        kvk: COMPANY.kvk,
        btwNr: COMPANY.btwNr,
        iban: COMPANY.iban,
        contact: COMPANY.contact,
        email: COMPANY.email,
        phone: COMPANY.phone,
        web: COMPANY.web,
        partner: COMPANY.partner,
      },
      logoUrl: "/brand/logo.png",
      accent: "#9EC63F",
      teal: "#5BA99B",
      defaultMargin: DEFAULT_MARGIN,
      btwRate: 21,
      fixedCopy: FIX as unknown as object,
    },
  });
  console.log("✓ Setting seeded");

  // ---- Catalog products ----
  const existing = await prisma.product.count();
  if (existing === 0) {
    for (const p of SEED_CATALOG) {
      await prisma.product.create({
        data: {
          name: p.name,
          category: p.category,
          costPrice: p.costPrice,
          margin: p.margin,
          unit: p.unit,
          specs: p.specs ? (p.specs as unknown as object) : undefined,
          photoUrl: p.photoUrl,
        },
      });
    }
    console.log(`✓ ${SEED_CATALOG.length} catalog products seeded`);
  } else {
    console.log(`• Catalog already has ${existing} products, skipping`);
  }

  // ---- Example customer + proposal ----
  const customer = await prisma.customer.upsert({
    where: { id: "seed-visscher" },
    update: {},
    create: {
      id: "seed-visscher",
      company: SEED_CUSTOMER.naam,
      contact: SEED_CUSTOMER.contact,
      email: SEED_CUSTOMER.email,
      address: { adres1: SEED_CUSTOMER.adres1, adres2: SEED_CUSTOMER.adres2 },
    },
  });
  console.log("✓ Example customer seeded");

  const data = buildExampleProposalData();
  const batteryInvestCost = data.batteries
    .slice(0, data.cols)
    .map((b) => costFromSell(b.prijsInvest, DEFAULT_MARGIN));
  const shared = computeTotals(data).sharedExclBTW;
  const totals = computeTotals(data, {
    batteryInvestCost,
    sharedCost: costFromSell(shared, DEFAULT_MARGIN),
  });

  const existingProposal = await prisma.proposal.findUnique({ where: { number: "OF2026-0001" } });
  if (!existingProposal) {
    await prisma.proposal.create({
      data: {
        number: "OF2026-0001",
        customerId: customer.id,
        status: "draft",
        templateType: "battery",
        design: "modern",
        validityDays: 14,
        data: data as unknown as object,
        totals: totals as unknown as object,
        events: { create: { type: "created", meta: { by: "seed" } } },
      },
    });
    console.log("✓ Example proposal OF2026-0001 seeded");
  } else {
    console.log("• Example proposal already exists, skipping");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
