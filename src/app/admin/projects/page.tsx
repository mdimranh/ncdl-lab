import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, researchAreas } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { deleteProjectAction } from "../actions";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireUser();
  const params = await searchParams;

  const rows = await db
    .select({ project: projects, areaTitle: researchAreas.title })
    .from(projects)
    .leftJoin(researchAreas, eq(projects.areaId, researchAreas.id))
    .orderBy(asc(projects.displayOrder), asc(projects.title));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research"
        title="Projects"
        description="Ongoing and completed programmes. Featured projects appear on the home page."
        action={{ label: "Add project", href: "/admin/projects/new" }}
      />

      {params.saved && <Notice tone="success">Project saved.</Notice>}
      {params.deleted && <Notice tone="success">Project deleted.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      {rows.length === 0 ? (
        <EmptyState title="No projects yet" hint="Add a project to showcase research activity." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-line bg-surface/60">
                  {["Project", "Area", "Status", "Years", "Featured", "Actions"].map((heading) => (
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
                {rows.map(({ project, areaTitle }) => (
                  <tr key={project.id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-[12.5px] font-medium text-ink-900 hover:text-brand-700"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-0.5 font-mono text-[10px] text-muted">/{project.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">{areaTitle ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          project.status === "ongoing"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-surface-2 text-muted"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">
                      {project.startYear ?? "—"}
                      {project.endYear ? `–${project.endYear}` : ""}
                    </td>
                    <td className="px-4 py-3 text-[11.5px] text-muted">
                      {project.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteProjectAction}
                          id={project.id}
                          label={project.title}
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
