import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, FolderOpen } from "lucide-react";

const DEMO_EMAIL = "demo@devstash.io";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <h1 className="text-2xl font-semibold mb-4">Collections</h1>
        <p className="text-muted-foreground">No user found. Please sign in.</p>
      </div>
    );
  }

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Collections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organize your items into collections
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No collections yet</p>
          <Link
            href="/dashboard"
            className="mt-4 text-sm text-primary hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-medium text-foreground truncate">
                      {collection.name}
                    </h3>
                    {collection.isFavorite && (
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {collection._count.items} items
                  </p>
                </div>
              </div>
              {collection.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {collection.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}