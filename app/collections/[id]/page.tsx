import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ArrowLeft, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DEMO_EMAIL = "demo@devstash.io";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });

  if (!user) {
    notFound();
  }

  const collection = await prisma.collection.findUnique({
    where: { id, userId: user.id },
    include: {
      items: {
        include: {
          type: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <Link
          href="/collections"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          All Collections
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {collection.name}
              </h1>
              {collection.isFavorite && (
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              )}
            </div>
            {collection.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {collection.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Layers className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No items in this collection</p>
          <Link
            href="/dashboard"
            className="mt-4 text-sm text-primary hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {collection.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${item.type.color ?? "#6b7280"}20` }}
              >
                <span className="text-sm" style={{ color: item.type.color ?? "#6b7280" }}>
                  {item.type.name?.[0]}
                </span>
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
                    <span className="text-xs text-muted-foreground">Pinned</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                    {item.description}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((itemTag) => (
                      <Badge
                        key={itemTag.tag.id}
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
                        {itemTag.tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                {item.updatedAt.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}