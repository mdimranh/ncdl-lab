import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDateShort } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deleteNewsAction } from "../actions";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireUser();
  const params = await searchParams;

  const rows = await db.select().from(news).orderBy(desc(news.publishedAt));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title="News"
        description="Announcements, achievements and lab updates. Drafts stay hidden until published."
        action={{ label: "New article", href: "/admin/news/new" }}
      />

      {params.saved && <Notice tone="success">Article saved.</Notice>}
      {params.deleted && <Notice tone="success">Article deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No articles yet" hint="Publish the lab's first update." />
      ) : (
        <div className="space-y-2.5">
          {rows.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      item.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {formatDateShort(item.publishedAt)} · {item.authorName}
                  </span>
                </div>
                <Link
                  href={`/admin/news/${item.id}`}
                  className="mt-1.5 block truncate text-[13px] font-medium text-ink-900 hover:text-brand-700"
                >
                  {item.title}
                </Link>
                <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">{item.excerpt}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/news/${item.slug}`}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-muted hover:text-ink-900"
                >
                  View
                </Link>
                <Link
                  href={`/admin/news/${item.id}`}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteNewsAction} id={item.id} label={item.title} compact />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
