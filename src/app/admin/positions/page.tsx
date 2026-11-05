import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { positions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { positionTypeLabels } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deletePositionAction } from "../actions";

export default async function AdminPositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await db
    .select()
    .from(positions)
    .orderBy(asc(positions.displayOrder), asc(positions.title));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title="Open positions"
        description="Vacancies appear on the home page and on the contact page while marked open."
        action={{ label: "Add position", href: "/admin/positions/new" }}
      />

      {params.saved && <Notice tone="success">Position saved.</Notice>}
      {params.deleted && <Notice tone="success">Position deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No positions" hint="Add an opening to advertise it on the site." />
      ) : (
        <div className="space-y-2.5">
          {rows.map((position) => (
            <div
              key={position.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                    {positionTypeLabels[position.type]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      position.isOpen
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-surface-2 text-muted"
                    }`}
                  >
                    {position.isOpen ? "Open" : "Closed"}
                  </span>
                  {position.deadline && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      Deadline {formatDateShort(position.deadline)}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] font-medium text-ink-900">{position.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">
                  {position.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/positions/${position.id}`}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deletePositionAction}
                  id={position.id}
                  label={position.title}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
