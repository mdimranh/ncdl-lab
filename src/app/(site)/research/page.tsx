import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CircleDot, Layers } from "lucide-react";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, researchAreas } from "@/db/schema";
import { AreaIcon } from "@/components/site/area-icon";
import { Eyebrow, Tag } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Four research areas at NCDL: neuromorphic circuit design, RF and analog circuits, FPGA-based image analysis and robotics control hardware.",
};

export default async function ResearchPage() {
  const [areas, projectRows] = await Promise.all([
    db
      .select()
      .from(researchAreas)
      .where(eq(researchAreas.published, true))
      .orderBy(asc(researchAreas.displayOrder)),
    db
      .select({ areaId: projects.areaId, status: projects.status, value: count() })
      .from(projects)
      .where(eq(projects.published, true))
      .groupBy(projects.areaId, projects.status),
  ]);

  const statsFor = (areaId: number) => {
    const ongoing =
      projectRows.find((row) => row.areaId === areaId && row.status === "ongoing")?.value ?? 0;
    const completed =
      projectRows.find((row) => row.areaId === areaId && row.status === "completed")?.value ?? 0;
    return { ongoing, completed };
  };

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 lg:py-20">
          <Eyebrow>Research</Eyebrow>
          <h1 className="display mt-4 max-w-3xl text-4xl text-ink-900 sm:text-5xl">
            From device physics to a working system.
          </h1>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            Four research areas share one design flow and one measurement
            culture. Each area has dedicated objectives, methods and open
            projects — and each one ships silicon, not just simulations.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-brand-600" />
              {areas.length} research areas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleDot className="h-3.5 w-3.5 text-brand-600" />
              {projectRows.reduce((total, row) => total + row.value, 0)} projects
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-5 lg:grid-cols-2">
            {areas.map((area, index) => {
              const stats = statsFor(area.id);
              return (
                <article
                  key={area.id}
                  className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:border-brand-300 hover:shadow-[0_24px_60px_-32px_rgba(12,27,48,0.32)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface text-ink-800 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700">
                      <AreaIcon name={area.icon} className="h-5.5 w-5.5" />
                    </span>
                    <span className="font-mono text-[11px] text-line-strong">
                      AREA {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="display mt-6 text-2xl text-ink-900">{area.title}</h2>
                  <p className="mt-1.5 text-[12.5px] font-medium text-brand-700">
                    {area.tagline}
                  </p>
                  <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-muted">
                    {area.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {area.keywords.map((keyword) => (
                      <Tag key={keyword}>{keyword}</Tag>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    <div className="flex gap-5 text-[11.5px] text-muted">
                      <span>
                        <span className="font-mono text-ink-900">{stats.ongoing}</span> ongoing
                      </span>
                      <span>
                        <span className="font-mono text-ink-900">{stats.completed}</span> completed
                      </span>
                    </div>
                    <Link
                      href={`/research/${area.slug}`}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-800 transition-colors group-hover:text-brand-700"
                    >
                      Explore area
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
