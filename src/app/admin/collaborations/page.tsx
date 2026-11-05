import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { collaborations } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deleteCollaborationAction } from "../actions";

export default async function AdminCollaborationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await db
    .select()
    .from(collaborations)
    .orderBy(asc(collaborations.displayOrder), asc(collaborations.institution));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Collaborations"
        description="Partner institutions listed in the collaboration section of the members page."
        action={{ label: "Add partner", href: "/admin/collaborations/new" }}
      />

      {params.saved && <Notice tone="success">Collaboration saved.</Notice>}
      {params.deleted && <Notice tone="success">Collaboration deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No partners yet" hint="Add the institutions you work with." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((partner) => (
            <div key={partner.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-ink-900">{partner.institution}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {partner.country || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/collaborations/${partner.id}`}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteCollaborationAction}
                    id={partner.id}
                    label={partner.institution}
                    compact
                  />
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-muted">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
