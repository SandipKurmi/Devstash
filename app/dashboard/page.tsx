"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  User,
  Star,
  Clock,
} from "lucide-react";
import { itemTypes, collections, items, currentUser } from "@/lib/mock-data";

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

// Helper to convert type name to plural form for URL
function singularToPlural(name: string): string {
  if (name === "All Items") return "items";
  // Simple pluralization rules
  if (name.endsWith("y")) return name.slice(0, -1) + "ies";
  if (name.endsWith("s")) return name + "es";
  return name + "s";
}

function SidebarContent({
  collapsed,
  isMobile = false,
}: {
  collapsed: boolean;
  isMobile?: boolean;
}) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = [...collections]
    .sort((a, b) => b.itemCount - a.itemCount)
    .slice(0, 3);

  return (
    <div className={`flex flex-col h-full ${collapsed ? "px-2" : "p-4"}`}>
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">
          ITEM TYPES
        </h3>
        {[
          {
            name: "All Items",
            count: itemTypes.reduce((sum, t) => sum + t.count, 0),
          },
          ...itemTypes,
        ].map((type) => (
          <Link
            key={type.name}
            href={`/items/${singularToPlural(type.name)}`}
            className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
          >
            <div className="flex items-center gap-2">
              <ItemTypeIcon name={type.name} />
              {!collapsed && <span>{type.name}</span>}
            </div>
            {!collapsed && (
              <span className="text-muted-foreground text-xs">
                {type.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-1 flex-1 overflow-y-auto">
        <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">
          COLLECTIONS
        </h3>

        {!collapsed && (
          <div>
            <p className="text-xs font-medium text-muted-foreground px-2 mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> Favorites
            </p>
            {favoriteCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
              >
                <span>{collection.name}</span>
                <span className="text-muted-foreground text-xs">
                  {collection.itemCount}
                </span>
              </Link>
            ))}
          </div>
        )}

        {!collapsed && (
          <div className="mt-3">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recent
            </p>
            {recentCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
              >
                <span>{collection.name}</span>
                <span className="text-muted-foreground text-xs">
                  {collection.itemCount}
                </span>
              </Link>
            ))}
          </div>
        )}

        {collapsed
          ? favoriteCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="flex items-center justify-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground mb-1"
                title={collection.name}
              >
                <Star className="w-4 h-4 text-yellow-500" />
              </Link>
            ))
          : null}
      </div>

      {!isMobile && (
        <>
          <Separator className="my-4" />
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pinnedItems = items.filter((item) => item.isPinned);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <SheetTrigger>
                <span className="inline-flex lg:hidden items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aspect-square w-9 px-0 py-2">
                  <Menu className="w-5 h-5" />
                </span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <ScrollArea className="h-full">
                  <SidebarContent collapsed={false} isMobile />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </Button>
            <h1 className="text-xl font-bold text-foreground">DevStash</h1>
            <div className="relative w-80 hidden md:block">
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
        <aside
          className={`
            hidden lg:block border-r border-border h-[calc(100vh-57px)]
            ${sidebarCollapsed ? "w-16" : "w-64"}
          `}
        >
          <ScrollArea className="h-full">
            <SidebarContent collapsed={sidebarCollapsed} />
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
                        Updated {new Date(item.updatedAt).toLocaleDateString("en-US")}
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
