import { prisma } from "@/lib/prisma";
import { getItemsForDashboard, type DashboardItem } from "@/lib/db/items";

export type { DashboardItem };

const DEMO_EMAIL = "demo@devstash.io";

export interface TypeSummary {
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface CollectionWithTypes {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: string;
  itemCount: number;
  types: TypeSummary[];
  dominantColor: string;
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getDashboardData(): Promise<{
  collections: CollectionWithTypes[];
  stats: DashboardStats;
  pinnedItems: DashboardItem[];
  recentItems: DashboardItem[];
}> {
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (!user) {
    return {
      collections: [],
      stats: { totalItems: 0, totalCollections: 0, favoriteItems: 0, favoriteCollections: 0 },
      pinnedItems: [],
      recentItems: [],
    };
  }

  const [rawCollections, totalItems, favoriteItems, itemsForDashboard] = await Promise.all([
    prisma.collection.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { items: true } },
        items: {
          select: { type: { select: { name: true, icon: true, color: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.item.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
    getItemsForDashboard(user.id),
  ]);

  const collections: CollectionWithTypes[] = rawCollections.map((c) => {
    const typeCounts = new Map<string, TypeSummary>();
    for (const item of c.items) {
      const { name, icon, color } = item.type;
      const existing = typeCounts.get(name);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(name, { name, icon: icon ?? "", color: color ?? "#6b7280", count: 1 });
      }
    }
    const types = Array.from(typeCounts.values()).sort((a, b) => b.count - a.count);
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      isFavorite: c.isFavorite,
      updatedAt: c.updatedAt.toISOString(),
      itemCount: c._count.items,
      types,
      dominantColor: types[0]?.color ?? "#6b7280",
    };
  });

  const favoriteCollections = collections.filter((c) => c.isFavorite).length;

  return {
    collections,
    stats: {
      totalItems,
      totalCollections: collections.length,
      favoriteItems,
      favoriteCollections,
    },
    pinnedItems: itemsForDashboard.pinned,
    recentItems: itemsForDashboard.recent,
  };
}
