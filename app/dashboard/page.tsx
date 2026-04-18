import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <Button>New Item</Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-border p-4">
          <h2>Sidebar</h2>
        </aside>

        <main className="flex-1 p-4">
          <h2>Main</h2>
        </main>
      </div>
    </div>
  );
}