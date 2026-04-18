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
  Settings,
  Star,
  User,
  Code,
  MessageSquare,
  Terminal,
  FileText,
  Paperclip,
  Image,
  Link2,
  MoreHorizontal,
  Pin,
  Layers,
  FolderOpen,
  Clock,
  Sparkles,
  StickyNote,
  File as FileIcon,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import type { CollectionWithTypes, DashboardStats, DashboardItem, ItemTypeWithCount } from "@/lib/db/collections";

function ItemTypeIcon({
  icon,
  color,
  size = 14,
}: {
  icon: string;
  color: string;
  size?: number;
}) {
  const props = { size, color };
  const map: Record<string, React.ReactNode> = {
    // Lucide component names stored in DB
    Code: <Code {...props} />,
    Sparkles: <Sparkles {...props} />,
    Terminal: <Terminal {...props} />,
    StickyNote: <StickyNote {...props} />,
    File: <FileIcon {...props} />,
    Image: <Image {...props} />,
    Link: <Link2 {...props} />,
    // Legacy mock-data icon keys (sidebar item types)
    code: <Code {...props} />,
    message: <MessageSquare {...props} />,
    terminal: <Terminal {...props} />,
    "file-text": <FileText {...props} />,
    paperclip: <Paperclip {...props} />,
    image: <Image {...props} />,
    link: <Link2 {...props} />,
  };
  return (
    <span className="flex-shrink-0">
      {map[icon] ?? <FileIcon {...props} />}
    </span>
  );
}

function SidebarContent({
  collapsed,
  isMobile = false,
  collections,
  itemTypes,
}: {
  collapsed: boolean;
  isMobile?: boolean;
  collections: CollectionWithTypes[];
  itemTypes: ItemTypeWithCount[];
}) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const allCollections = collections.filter((c) => !c.isFavorite);

  return (
    <div className={`flex flex-col h-full ${collapsed ? "px-2 py-3" : "p-4"}`}>
      <div className="space-y-0.5">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground mb-2 px-2 tracking-wide">
            Types
          </p>
        )}
        {itemTypes.map((type) => (
          <Link
            key={type.id}
            href={`/items/${type.pluralName.toLowerCase()}`}
            className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
          >
            <div className="flex items-center gap-2">
              <ItemTypeIcon icon={type.icon} color={type.color} />
              {!collapsed && <span>{type.pluralName}</span>}
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

      <div className="space-y-0.5 flex-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground mb-2 px-2 tracking-wide">
            Collections
          </p>
        )}

        {!collapsed && favoriteCollections.length > 0 && (
          <div className="mb-1">
            <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-widest">
              Favorites
            </p>
            {favoriteCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  {collection.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {!collapsed && allCollections.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-widest">
              All Collections
            </p>
            {allCollections.map((collection) => (
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
            <Link
              href="/collections"
              className="flex items-center w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
            >
              View all collections
            </Link>
          </div>
        )}

        {collapsed && favoriteCollections.length > 0 && (
          <div className="mb-1">
            <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-widest">
              Favorites
            </p>
            {favoriteCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="flex items-center justify-center w-full px-2 py-1.5 rounded-md hover:bg-muted mb-1"
                title={collection.name}
              >
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              </Link>
            ))}
          </div>
        )}

        {collapsed && allCollections.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-widest">
              Recent
            </p>
            {allCollections.slice(0, 5).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="flex items-center justify-center w-full px-2 py-1.5 rounded-md hover:bg-muted mb-1"
                title={collection.name}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: collection.dominantColor }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {!isMobile && (
        <>
          <Separator className="my-4" />
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
              <User className="w-4 h-4" />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
                <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface DashboardShellProps {
  collections: CollectionWithTypes[];
  stats: DashboardStats;
  pinnedItems: DashboardItem[];
  recentItems: DashboardItem[];
  itemTypes: ItemTypeWithCount[];
}

export default function DashboardShell({ collections, stats, pinnedItems, recentItems, itemTypes }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const recentCollections = collections.slice(0, 3);

  const statsCards = [
    { label: "Total Items", value: stats.totalItems, icon: Layers, color: "#10b981" },
    { label: "Collections", value: stats.totalCollections, icon: FolderOpen, color: "#3b82f6" },
    { label: "Favorite Items", value: stats.favoriteItems, icon: Star, color: "#f59e0b" },
    { label: "Favorite Collections", value: stats.favoriteCollections, icon: Star, color: "#ec4899" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile drawer trigger */}
          <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <ScrollArea className="h-full">
                <SidebarContent collapsed={false} isMobile collections={collections} itemTypes={itemTypes} />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <span className="text-base font-bold text-foreground hidden sm:block">
            DevStash
          </span>

          <div className="relative w-72 hidden md:block">
            <Input
              type="search"
              placeholder="Search items..."
              className="w-full bg-muted border-0 pl-3 pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted-foreground/10 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            New Collection
          </Button>
          <Button size="sm">+ New Item</Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-49px)]">
        {/* Desktop sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-border transition-all duration-200 ${
            sidebarCollapsed ? "w-14" : "w-56"
          }`}
        >
          <div
            className={`flex ${sidebarCollapsed ? "justify-center" : "justify-end"} p-2 border-b border-border`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-8 h-8"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <SidebarContent collapsed={sidebarCollapsed} collections={collections} itemTypes={itemTypes} />
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your developer knowledge hub
            </p>
          </div>

          {/* Stats cards */}
          <section className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statsCards.map((stat) => (
                <Card key={stat.label} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {stat.label}
                      </span>
                      <stat.icon
                        className="w-4 h-4"
                        style={{ color: stat.color }}
                      />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent collections */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Recent Collections
              </h2>
              <Link
                href="/collections"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentCollections.map((collection) => (
                <Card
                  key={collection.id}
                  className="cursor-pointer hover:bg-muted/40 transition-colors group"
                  style={{ borderColor: collection.dominantColor + "50" }}
                >
                  <CardHeader className="pb-1 pt-4 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-medium text-foreground text-sm truncate">
                            {collection.name}
                          </h3>
                          {collection.isFavorite && (
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {collection.itemCount} items
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 shrink-0"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {collection.description}
                    </p>
                    <div className="flex gap-1.5">
                      {collection.types.map((type) => (
                        <ItemTypeIcon
                          key={type.name}
                          icon={type.icon}
                          color={type.color}
                          size={13}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Pinned items — hidden when empty */}
          {pinnedItems.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pin className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">
                  Pinned
                </h2>
              </div>
              <div className="space-y-2">
                {pinnedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${item.type.color}20` }}
                    >
                      <ItemTypeIcon icon={item.type.icon} color={item.type.color} size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {item.title}
                        </span>
                        {item.isFavorite && (
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        )}
                        <Pin className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent items */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                Recent Items
              </h2>
            </div>
            <div className="space-y-2">
              {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${item.type.color}20` }}
                    >
                      <ItemTypeIcon icon={item.type.icon} color={item.type.color} size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {item.title}
                        </span>
                        {item.isFavorite && (
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        )}
                        {item.isPinned && (
                          <Pin className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 border-0 font-normal"
                        style={{ color: item.type.color }}
                      >
                        {item.type.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.updatedAt)}
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
