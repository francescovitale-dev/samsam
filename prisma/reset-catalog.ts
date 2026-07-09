// Replace the battery + charger products with the current SEED_CATALOG lineup.
// Work/EMS/option line items are left untouched. Proposals are snapshots, so
// changing the catalog never affects existing offertes.
//   Usage:  DATABASE_URL=<direct-url> tsx prisma/reset-catalog.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SEED_CATALOG } from "../src/lib/content/seed-data";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const items = SEED_CATALOG;
  await prisma.product.deleteMany({});
  for (const p of items) {
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
  const counts = await prisma.product.groupBy({ by: ["category"], _count: true });
  console.log("catalog reset ->", JSON.stringify(counts));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
