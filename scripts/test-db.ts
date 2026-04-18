import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
  console.log("Connected! Server time:", result[0].now, "\n");

  // ─── User ──────────────────────────────────────────────────────────────────

  const users = await prisma.user.findMany({
    select: { email: true, emailVerified: true, isPro: true },
  });
  console.log(`Users (${users.length}):`);
  for (const u of users) {
    console.log(`  · ${u.email} | verified: ${u.emailVerified ? "yes" : "no"} | pro: ${u.isPro}`);
  }

  // ─── Item Types ────────────────────────────────────────────────────────────

  const types = await prisma.itemType.findMany({
    orderBy: { name: "asc" },
  });
  console.log(`\nItem types (${types.length}):`);
  for (const t of types) {
    console.log(`  · ${t.name.padEnd(10)} icon: ${t.icon?.padEnd(12)} color: ${t.color}  system: ${t.isSystem}`);
  }

  // ─── Collections ───────────────────────────────────────────────────────────

  const collections = await prisma.collection.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  console.log(`\nCollections (${collections.length}):`);
  for (const c of collections) {
    console.log(`  · ${c.name.padEnd(22)} items: ${c._count.items}  ${c.description}`);
  }

  // ─── Items by collection ───────────────────────────────────────────────────

  const items = await prisma.item.findMany({
    include: {
      type: { select: { name: true } },
      collection: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: [{ collection: { name: "asc" } }, { title: "asc" }],
  });

  console.log(`\nItems (${items.length}):`);
  for (const item of items) {
    const tags = item.tags.map((t) => t.tag.name).join(", ");
    const col = item.collection?.name ?? "(no collection)";
    console.log(`  · [${item.type.name.padEnd(8)}] ${item.title}`);
    console.log(`             collection: ${col}  tags: ${tags}`);
  }

  // ─── Tags ──────────────────────────────────────────────────────────────────

  const tags = await prisma.tag.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  console.log(`\nTags (${tags.length}):`);
  console.log("  " + tags.map((t) => `${t.name}(${t._count.items})`).join(", "));

  console.log("\nAll checks passed.");
}

main()
  .catch((err) => {
    console.error("Database test failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
