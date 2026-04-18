import { getDashboardData } from "@/lib/db/collections";
import DashboardShell from "./DashboardShell";

export default async function DashboardPage() {
  const { collections, stats, pinnedItems, recentItems } = await getDashboardData();
  return (
    <DashboardShell
      collections={collections}
      stats={stats}
      pinnedItems={pinnedItems}
      recentItems={recentItems}
    />
  );
}
