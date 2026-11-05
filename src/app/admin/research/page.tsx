import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { researchAreas } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AreaIcon } from "@/components/site/area-icon";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deleteAreaAction } from "../actions";

export default async function AdminResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireUser();
  const params = await searchParams;

  const rows = await db
    .select()
    .from(researchAreas)
    .orderBy(asc(researchAreas.displayOrder), asc(researchAreas.title));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research"
        title="Research areas"
        description="Each area gets its own public page with objectives, methodologies, projects and related papers."
        action={{ label: "Add area", href: "/admin/research/new" }}
      />

      {params.saved && <Notice tone="success">Research area saved.</Notice>}
      {params.deleted && <Notice tone="success">Research area deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No research areas" hint="Create the first area to populate the research section." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((area) => (
            <div key={area.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface text-ink-800">
                    <AreaIcon name={area.icon} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink-900">{area.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted">/{area.slug}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    area.published ? "bg-emerald-50 text-emerald-700" : "bg-surface-2 text-muted"
                  }`}
                >
                  {area.published ? "Live" : "Hidden"}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-muted">
                {area.summary}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <div className="flex gap-3 text-[10.5px] text-muted">
                  <span>{area.objectives.length} objectives</span>
                  <span>{area.keywords.length} keywords</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/research/${area.slug}`}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-muted hover:text-ink-900"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/research/${area.id}`}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteAreaAction} id={area.id} label={area.title} compact />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
