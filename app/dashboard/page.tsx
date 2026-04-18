import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { itemTypes, collections, items } from "@/lib/mock-data";

function ItemTypeIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    "All Items": "📁",
    Snippet: "💻",
    Prompt: "💬",
    Command: "⌨️",
    Note: "📝",
    File: "📎",
    Image: "🖼️",
    Link: "🔗",
  };
  return <span>{icons[name] || "📄"}</span>;
}

export default function DashboardPage() {
  const pinnedItems = items.filter((item) => item.isPinned);
  const totalItems = itemTypes.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-foreground">DevStash</h1>
            <div className="relative w-80">
              <Input
                type="search"
                placeholder="Search items..."
                className="w-full bg-muted border-0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ⌘K
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">New Collection</Button>
            <Button>+ New Item</Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-border h-[calc(100vh-57px)]">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  ITEM TYPES
                </h3>
                {[
                  { name: "All Items", count: totalItems },
                  ...itemTypes,
                ].map((type) => (
                  <button
                    key={type.name}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <ItemTypeIcon name={type.name} />
                      <span>{type.name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  COLLECTIONS
                </h3>
                <div className="space-y-1">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                      Favorites
                    </p>
                    {collections
                      .filter((c) => c.isFavorite)
                      .map((collection) => (
                        <button
                          key={collection.id}
                          className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
                        >
                          <span>{collection.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {collection.itemCount}
                          </span>
                        </button>
                      ))}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                      All Collections
                    </p>
                    {collections.map((collection) => (
                      <button
                        key={collection.id}
                        className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
                      >
                        <span>{collection.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {collection.itemCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Your developer knowledge hub
            </h1>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">
                        {collection.name}
                      </h3>
                      {collection.isFavorite && (
                        <span className="text-yellow-500">★</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {collection.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {collection.itemCount} items
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-4">
              Pinned Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedItems.map((item) => {
                const type = itemTypes.find((t) => t.id === item.typeId);
                return (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {item.title}
                          </h3>
                          {item.isFavorite && (
                            <span className="text-yellow-500 text-sm">★</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {type?.name}
                        </Badge>
                        {item.language && (
                          <Badge variant="outline" className="text-xs">
                            {item.language}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}