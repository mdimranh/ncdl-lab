import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarRange, CircleDot } from "lucide-react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, publications, researchAreas } from "@/db/schema";
import { AreaIcon } from "@/components/site/area-icon";
import { Eyebrow, Tag } from "@/components/site/section";
import { publicationTypeLabels } from "@/lib/content";
import { getDictionary, localized, localizedList } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

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

  const locale = await getLocale();
  const dict = getDictionary(locale);

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
      .select({
        slug: researchAreas.slug,
        title: researchAreas.title,
        titleKo: researchAreas.titleKo,
      })
      .from(researchAreas)
      .where(eq(researchAreas.published, true))
      .orderBy(asc(researchAreas.displayOrder)),
  ]);

  const overviewParagraphs = localized(locale, area.overview, area.overviewKo)
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="grid-tech absolute inset-0 opacity-60" />
        <div className="wrap relative py-12 lg:py-16">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-[12px] font-medium text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {dict.research.allAreas}
          </Link>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="grid h-14 w-14 shrink-0 place-items-center border border-white/15 bg-white/[0.06] text-brand-300">
              <AreaIcon name={area.icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-300">
                {dict.nav.research}
                {area.publishedAt
                  ? ` · ${dict.research.publishedOn} ${area.publishedAt.replace(/-/g, ".")}`
                  : ""}
              </p>
              <h1 className="display mt-2 max-w-3xl text-4xl sm:text-5xl">
                {localized(locale, area.title, area.titleKo)}
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] text-white/60">
                {localized(locale, area.tagline, area.taglineKo)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap grid gap-12 py-12 lg:grid-cols-[1.55fr_1fr] lg:py-16">
          <div>
            <Eyebrow>{dict.research.overview}</Eyebrow>
            <div className="article-body mt-4">
              {overviewParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <Eyebrow>{dict.research.objectives}</Eyebrow>
                <ul className="mt-3 space-y-2.5">
                  {localizedList(locale, area.objectives, area.objectivesKo).map((objective) => (
                    <li
                      key={objective}
                      className="flex gap-3 text-[12.5px] leading-relaxed text-ink-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand-500" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Eyebrow>{dict.research.methodologies}</Eyebrow>
                <ul className="mt-3 space-y-2.5">
                  {localizedList(locale, area.methodologies, area.methodologiesKo).map((method) => (
                    <li
                      key={method}
                      className="flex gap-3 text-[12.5px] leading-relaxed text-ink-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand-500" />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside>
            <div className="border border-line bg-surface p-6">
              <Eyebrow tone="muted">{dict.research.allAreas}</Eyebrow>
              <ul className="mt-4 space-y-2.5 text-[12.5px]">
                {allAreas.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/research/${item.slug}`}
                      className={
                        item.slug === area.slug
                          ? "font-medium text-ink-900"
                          : "text-muted hover:text-steel-600"
                      }
                    >
                      {localized(locale, item.title, item.titleKo)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border border-line bg-white p-6">
              <Eyebrow tone="muted">{dict.common.contact}</Eyebrow>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                {dict.members.collaborateBody}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-steel-600 hover:text-steel-700"
              >
                {dict.research.discuss}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.research.keyProjects}</Eyebrow>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {areaProjects.map((project) => (
              <article key={project.id} className="border border-line bg-white p-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Tag tone={project.status === "ongoing" ? "brand" : "default"}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {project.status}
                  </Tag>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    <CalendarRange className="h-3 w-3" />
                    {project.startYear}
                    {project.endYear ? `–${project.endYear}` : "–present"}
                  </span>
                </div>
                <h3 className="display mt-3 text-[1.15rem] leading-snug text-ink-900">
                  {project.title}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  {project.summary}
                </p>
              </article>
            ))}
            {areaProjects.length === 0 && (
              <p className="text-[13px] text-muted">{dict.research.noProjects}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.research.figures}</Eyebrow>
          {area.figures.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {area.figures.map((figure, index) => (
                <figure key={`${figure.imageUrl}-${index}`} className="border border-line">
                  <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={figure.imageUrl}
                      alt={figure.caption}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {figure.caption && (
                    <figcaption className="border-t border-line px-4 py-3 text-[11.5px] leading-relaxed text-muted">
                      {figure.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[13px] text-muted">{dict.research.noFigures}</p>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.research.relatedPublications}</Eyebrow>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {areaPublications.map((paper) => (
              <li key={paper.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="steel">{publicationTypeLabels[paper.type]}</Tag>
                  <span className="font-mono text-[10.5px] text-muted">{paper.year}</span>
                </div>
                <p className="mt-2 text-[13.5px] font-medium leading-snug text-ink-900">
                  {localized(locale, paper.title, paper.titleKo)}
                </p>
                <p className="mt-1 text-[11.5px] text-muted">
                  {paper.authors} · {localized(locale, paper.venue, paper.venueKo)}
                </p>
                {paper.doi && (
                  <a
                    href={paper.url ?? `https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10.5px] text-steel-600 hover:text-steel-700"
                  >
                    {dict.publications.doi} {paper.doi}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
            {areaPublications.length === 0 && (
              <li className="py-5 text-[13px] text-muted">
                {dict.research.noPublications}
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
