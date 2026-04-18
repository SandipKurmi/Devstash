import { getDashboardData } from "@/lib/db/collections";
import DashboardShell from "./DashboardShell";

export default async function DashboardPage() {
  const { collections, stats } = await getDashboardData();
  return <DashboardShell collections={collections} stats={stats} />;
}
