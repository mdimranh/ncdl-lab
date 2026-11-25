import Link from "next/link";
import { asc } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deleteGalleryAction } from "../actions";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.displayOrder), asc(gallery.id));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site"
        title="Gallery & carousel"
        description="Photos for the home page carousel, shown in the order below."
        action={{ label: "Add photo", href: "/admin/gallery/new" }}
      />

      {params.saved && <Notice tone="success">Photo saved.</Notice>}
      {params.deleted && <Notice tone="success">Photo removed.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState
          title="Gallery is empty"
          hint="Add your first photo to enable the home page carousel."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white backdrop-blur">
                  #{item.displayOrder}
                </span>
              </div>

              <div className="min-w-0 flex-1 px-4 py-3.5">
                <p className="truncate text-[12.5px] font-medium text-ink-900">
                  {item.title || "Untitled photo"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                  {item.caption || "No caption"}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-2.5">
                <DeleteButton
                  action={deleteGalleryAction}
                  id={item.id}
                  label={item.title || "photo"}
                />
                <Link
                  href={`/admin/gallery/${item.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-1.5 text-[11.5px] font-medium text-white transition-colors hover:bg-ink-800"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
