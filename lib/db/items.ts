import { prisma } from "@/lib/prisma";

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: string;
  type: { name: string; icon: string; color: string };
  tags: string[];
}

const ITEM_INCLUDE = {
  type: { select: { name: true, icon: true, color: true } },
  tags: { include: { tag: { select: { name: true } } } },
} as const;

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: Date;
  type: { name: string; icon: string | null; color: string | null };
  tags: { tag: { name: string } }[];
}): DashboardItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isPinned: item.isPinned,
    isFavorite: item.isFavorite,
    updatedAt: item.updatedAt.toISOString(),
    type: {
      name: item.type.name,
      icon: item.type.icon ?? "",
      color: item.type.color ?? "#6b7280",
    },
    tags: item.tags.map((t) => t.tag.name),
  };
}

export async function getItemsForDashboard(userId: string): Promise<{
  pinned: DashboardItem[];
  recent: DashboardItem[];
}> {
  const [pinned, recent] = await Promise.all([
    prisma.item.findMany({
      where: { userId, isPinned: true },
      include: ITEM_INCLUDE,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.item.findMany({
      where: { userId },
      include: ITEM_INCLUDE,
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    pinned: pinned.map(mapItem),
    recent: recent.map(mapItem),
  };
}
