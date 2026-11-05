import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publications, researchAreas } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { publicationTypeLabels } from "@/lib/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deletePublicationAction } from "../actions";

export default async function AdminPublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireUser();
  const params = await searchParams;

  const rows = await db
    .select({ paper: publications, areaTitle: researchAreas.title })
    .from(publications)
    .leftJoin(researchAreas, eq(publications.areaId, researchAreas.id))
    .orderBy(desc(publications.year), desc(publications.id));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title="Publications"
        description="Journal and conference papers, fabricated chips, workshops and certificates."
        action={{ label: "Add publication", href: "/admin/publications/new" }}
      />

      {params.saved && <Notice tone="success">Publication saved.</Notice>}
      {params.deleted && <Notice tone="success">Publication deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No publications yet" hint="Add the lab's first record." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-line bg-surface/60">
                  {["Title", "Type", "Year", "Area", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className={`px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted ${
                        heading === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map(({ paper, areaTitle }) => (
                  <tr key={paper.id} className="hover:bg-surface/50">
                    <td className="max-w-md px-4 py-3">
                      <Link
                        href={`/admin/publications/${paper.id}`}
                        className="line-clamp-2 text-[12.5px] font-medium text-ink-900 hover:text-brand-700"
                      >
                        {paper.title}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{paper.authors}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                        {publicationTypeLabels[paper.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11.5px] text-muted">{paper.year}</td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">{areaTitle ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/publications/${paper.id}`}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deletePublicationAction}
                          id={paper.id}
                          label={paper.title}
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
    </div>
  );
}
