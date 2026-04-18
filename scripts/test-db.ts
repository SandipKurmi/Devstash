import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...");

  // Run a raw query to confirm connectivity
  const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
  console.log("Connected! Server time:", result[0].now);

  // Verify all tables exist by counting rows in each
  const [users, itemTypes, collections, items, tags] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);

  console.log("Table row counts:");
  console.log("  users:", users);
  console.log("  itemTypes:", itemTypes);
  console.log("  collections:", collections);
  console.log("  items:", items);
  console.log("  tags:", tags);

  console.log("\nAll checks passed.");
}

main()
  .catch((err) => {
    console.error("Database test failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
