import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { memberCategoryLabels } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deleteMemberAction } from "../actions";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await db
    .select()
    .from(members)
    .orderBy(asc(members.category), asc(members.displayOrder), asc(members.name));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Members"
        description="Faculty, doctoral researchers, master's students and alumni shown on the public members page."
        action={{ label: "Add member", href: "/admin/members/new" }}
      />

      {params.saved && <Notice tone="success">Member saved.</Notice>}
      {params.deleted && <Notice tone="success">Member deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No members yet" hint="Add the first member to populate the public directory." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line bg-surface/60">
                  <th className="px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                    Category
                  </th>
                  <th className="px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                    Email
                  </th>
                  <th className="px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                    Joined
                  </th>
                  <th className="px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((member) => (
                  <tr key={member.id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-[12.5px] font-medium text-ink-900 hover:text-brand-700"
                      >
                        {member.name}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">
                        {member.designation}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-ink-700">
                      {memberCategoryLabels[member.category]}
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">
                      {member.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">
                      {member.joinedYear ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          member.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-surface-2 text-muted"
                        }`}
                      >
                        {member.published ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/members/${member.slug}`}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-muted hover:text-ink-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/members/${member.id}`}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteMemberAction}
                          id={member.id}
                          label={member.name}
                          compact
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted">
        Last updated {formatDateShort(new Date())} · {rows.length} records
      </p>
    </div>
  );
}
