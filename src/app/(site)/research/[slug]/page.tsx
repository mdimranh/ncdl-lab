import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarRange,
  CircleDot,
  FileText,
  Target,
  Wrench,
} from "lucide-react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, publications, researchAreas } from "@/db/schema";
import { AreaIcon } from "@/components/site/area-icon";
import { publicationTypeLabels } from "@/lib/content";
import { Tag } from "@/components/site/section";

async function getArea(slug: string) {
  const [area] = await db
    .select()
    .from(researchAreas)
    .where(and(eq(researchAreas.slug, slug), eq(researchAreas.published, true)))
    .limit(1);
  return area ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) return { title: "Research area not found" };
  return { title: area.title, description: area.summary };
}

export default async function ResearchAreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) notFound();

  const [areaProjects, areaPublications, allAreas] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(and(eq(projects.areaId, area.id), eq(projects.published, true)))
      .orderBy(asc(projects.displayOrder)),
    db
      .select()
      .from(publications)
      .where(eq(publications.areaId, area.id))
      .orderBy(desc(publications.year))
      .limit(8),
    db
      .select({ slug: researchAreas.slug, title: researchAreas.title })
      .from(researchAreas)
      .where(eq(researchAreas.published, true))
      .orderBy(asc(researchAreas.displayOrder)),
  ]);

  const ongoing = areaProjects.filter((project) => project.status === "ongoing");
  const completed = areaProjects.filter((project) => project.status === "completed");
  const overviewParagraphs = area.overview
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="grid-tech absolute inset-0 opacity-70" />
        <div className="radial-glow absolute inset-0" />
        <div className="wrap relative py-14 lg:py-20">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-[12px] font-medium text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All research
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-brand-300">
              <AreaIcon name={area.icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-brand-300">
                Research area
              </p>
              <h1 className="display mt-2 max-w-3xl text-4xl sm:text-5xl">{area.title}</h1>
              <p className="mt-3 max-w-2xl text-[14.5px] text-white/60">{area.tagline}</p>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-2">
            {area.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/55"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.5fr_1fr] lg:py-20">
          <div>
            <h2 className="eyebrow text-brand-600">Overview</h2>
            <div className="article-body mt-4">
              {overviewParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow flex items-center gap-2 text-brand-600">
                  <Target className="h-3.5 w-3.5" />
                  Objectives
                </h3>
                <ul className="mt-4 space-y-3">
                  {area.objectives.map((objective) => (
                    <li key={objective} className="flex gap-3 text-[13px] leading-relaxed text-ink-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-500" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="eyebrow flex items-center gap-2 text-brand-600">
                  <Wrench className="h-3.5 w-3.5" />
                  Methodologies
                </h3>
                <ul className="mt-4 space-y-3">
                  {area.methodologies.map((method) => (
                    <li key={method} className="flex gap-3 text-[13px] leading-relaxed text-ink-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-500" />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="eyebrow text-muted">At a glance</h2>
              <dl className="mt-5 space-y-4 text-[13px]">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Ongoing projects</dt>
                  <dd className="font-mono text-ink-900">{ongoing.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Completed projects</dt>
                  <dd className="font-mono text-ink-900">{completed.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Related papers</dt>
                  <dd className="font-mono text-ink-900">{areaPublications.length}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="eyebrow text-muted">Other areas</h2>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                {allAreas
                  .filter((item) => item.slug !== area.slug)
                  .map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/research/${item.slug}`}
                        className="group flex items-center justify-between gap-3 text-ink-700 hover:text-brand-700"
                      >
                        <span>{item.title}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-line-strong group-hover:text-brand-600" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="wrap py-14 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <h2 className="eyebrow text-brand-600">Projects</h2>
              <p className="display mt-2 text-2xl text-ink-900">What we are building</p>
            </div>
            <Link
              href="/contact"
              className="text-[12.5px] font-medium text-ink-700 hover:text-brand-700"
            >
              Discuss a collaboration →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {areaProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl border border-line bg-white p-6"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <Tag tone={project.status === "ongoing" ? "brand" : "default"}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {project.status}
                  </Tag>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                    <CalendarRange className="h-3 w-3" />
                    {project.startYear}
                    {project.endYear ? `–${project.endYear}` : "–present"}
                  </span>
                </div>
                <h3 className="display mt-4 text-lg leading-snug text-ink-900">
                  {project.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                  {project.summary}
                </p>
                <dl className="mt-5 grid gap-2 border-t border-line pt-4 text-[12px] sm:grid-cols-2">
                  {project.funding && (
                    <div>
                      <dt className="text-muted">Funding</dt>
                      <dd className="mt-0.5 text-ink-800">{project.funding}</dd>
                    </div>
                  )}
                  {project.collaborators && (
                    <div>
                      <dt className="text-muted">Partners</dt>
                      <dd className="mt-0.5 text-ink-800">{project.collaborators}</dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
            {areaProjects.length === 0 && (
              <p className="text-sm text-muted">
                Projects for this area will be published soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <h2 className="eyebrow text-brand-600">Selected publications</h2>
              <p className="display mt-2 text-2xl text-ink-900">Related papers</p>
            </div>
            <Link
              href={`/publications?q=${encodeURIComponent(area.title)}`}
              className="text-[12.5px] font-medium text-ink-700 hover:text-brand-700"
            >
              Search all publications →
            </Link>
          </div>

          <ul className="mt-6 divide-y divide-line">
            {areaPublications.map((paper) => (
              <li key={paper.id} className="flex gap-4 py-5">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="brand">{publicationTypeLabels[paper.type]}</Tag>
                    <span className="font-mono text-[10.5px] text-muted">{paper.year}</span>
                  </div>
                  <p className="mt-2 text-[13.5px] font-medium leading-snug text-ink-900">
                    {paper.title}
                  </p>
                  <p className="mt-1 text-[12px] text-muted">
                    {paper.authors} · {paper.venue}
                  </p>
                  {paper.doi && (
                    <a
                      href={paper.url ?? `https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10.5px] text-brand-700 hover:text-brand-800"
                    >
                      DOI: {paper.doi}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
            {areaPublications.length === 0 && (
              <li className="py-5 text-sm text-muted">No papers indexed for this area yet.</li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
