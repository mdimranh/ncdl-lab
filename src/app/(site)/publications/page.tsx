import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Award, Search } from "lucide-react";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { Eyebrow, Tag } from "@/components/site/section";
import { cn } from "@/lib/utils";
import { getDictionary, localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Journal articles, conference papers, chip design records, workshops and certificates from the Neuromorphic Chip Design Laboratory.",
};

const tabs = [
  { key: "journal", labelKey: "journals" },
  { key: "conference", labelKey: "conferences" },
  { key: "chip", labelKey: "chip" },
  { key: "workshop", labelKey: "workshops" },
  { key: "certificate", labelKey: "certificates" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const dict = getDictionary(locale);

  const query = (params.q ?? "").trim();
  const active = (tabs.find((tab) => tab.key === params.type)?.key ?? "journal") as TabKey;

  const filters: SQL[] = [eq(publications.type, active)];
  if (query) {
    const pattern = `%${query}%`;
    const search = or(
      ilike(publications.title, pattern),
      ilike(publications.authors, pattern),
      ilike(publications.venue, pattern),
    );
    if (search) filters.push(search);
  }

  const [rows, counts] = await Promise.all([
    db
      .select()
      .from(publications)
      .where(and(...filters))
      .orderBy(desc(publications.year), desc(publications.id)),
    db
      .select({ type: publications.type, value: sql<number>`count(*)::int` })
      .from(publications)
      .groupBy(publications.type),
  ]);

  const countFor = (key: string) => counts.find((row) => row.type === key)?.value ?? 0;

  const years = Array.from(new Set(rows.map((row) => row.year))).sort((a, b) => b - a);
  const tabLabel = (key: string) =>
    dict.publications[
      (tabs.find((tab) => tab.key === key)?.labelKey ?? "journals") as keyof typeof dict.publications
    ];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.nav.publications}</Eyebrow>
          <h1 className="display mt-3 text-4xl text-ink-900 sm:text-5xl">
            {dict.publications.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
            {dict.publications.intro}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-8 lg:py-12">
          <nav aria-label={dict.nav.publications} className="border-b border-line">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <Link
                    href={tab.key === "journal" ? "/publications" : `/publications?type=${tab.key}`}
                    aria-current={active === tab.key ? "page" : undefined}
                    className={cn(
                      "-mb-px inline-flex items-baseline gap-2 border-b-2 pb-3 text-[13.5px] font-medium transition-colors",
                      active === tab.key
                        ? "border-brand-500 text-ink-900"
                        : "border-transparent text-muted hover:text-ink-800",
                    )}
                  >
                    {dict.publications[tab.labelKey]}
                    <span className="font-mono text-[10.5px] text-muted">
                      {countFor(tab.key)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form action="/publications" method="get" className="mt-5 flex flex-wrap gap-2">
            <input type="hidden" name="type" value={active} />
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">{dict.publications.search}</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder={dict.publications.search}
                className="w-full border border-line bg-white py-2.5 pl-10 pr-4 text-[13px] text-ink-900 placeholder:text-muted/70 focus:border-steel-400 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="bg-ink-900 px-5 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-800"
            >
              {dict.publications.searchAction}
            </button>
            {query && (
              <Link
                href={active === "journal" ? "/publications" : `/publications?type=${active}`}
                className="inline-flex items-center border border-line px-4 py-2.5 text-[12.5px] text-muted hover:text-ink-900"
              >
                {dict.publications.clear}
              </Link>
            )}
          </form>

          {rows.length === 0 ? (
            <div className="mt-14 border border-dashed border-line-strong py-16 text-center">
              <p className="display text-xl text-ink-900">
                {dict.publications.emptyTitle}
              </p>
              <p className="mt-2 text-[13px] text-muted">
                {dict.publications.emptyBody}
              </p>
            </div>
          ) : active === "certificate" ? (
            <div className="mt-8">
              <p className="eyebrow text-brand-600">
                {dict.publications.certificateGallery}
              </p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((record) => (
                  <article key={record.id} className="border border-line bg-white">
                    <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                      {record.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={record.imageUrl}
                          alt={record.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-line-strong">
                          <Award className="h-10 w-10" strokeWidth={1.2} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-brand-600">
                        {record.year} · {localized(locale, record.venue, record.venueKo)}
                      </p>
                      <h2 className="display mt-2 text-[1.05rem] leading-snug text-ink-900">
                        {localized(locale, record.title, record.titleKo)}
                      </h2>
                      <p className="mt-2 text-[12px] text-muted">{record.authors}</p>
                      {record.url && (
                        <a
                          href={record.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-medium text-steel-600 hover:text-steel-700"
                        >
                          {dict.common.seeMore}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              <p className="text-[11.5px] text-muted">{dict.publications.archiveNote}</p>
              {years.map((year, index) => {
                const items = rows.filter((row) => row.year === year);
                return (
                  <details
                    key={year}
                    open={index === 0}
                    className="group border border-line bg-white"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
                      <span className="font-display text-[1.25rem] font-semibold text-ink-900">
                        {year}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                          {items.length}
                        </span>
                        <span className="text-[16px] text-steel-500 group-open:hidden">+</span>
                        <span className="hidden text-[16px] text-steel-500 group-open:inline">
                          −
                        </span>
                      </span>
                    </summary>

                    <ul className="divide-y divide-line border-t border-line px-5">
                      {items.map((paper) => (
                        <li key={paper.id} className="py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Tag tone="steel">{tabLabel(paper.type)}</Tag>
                            {paper.venue && (
                              <span className="text-[11.5px] italic text-muted">
                                {localized(locale, paper.venue, paper.venueKo)}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1.5 text-[13.5px] font-semibold leading-snug text-ink-900">
                            {localized(locale, paper.title, paper.titleKo)}
                          </h3>
                          <p className="mt-1 text-[11.5px] text-ink-700">{paper.authors}</p>

                          <div className="mt-2 flex flex-wrap items-center gap-4">
                            {paper.doi && (
                              <a
                                href={`https://doi.org/${paper.doi}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 font-mono text-[10.5px] text-steel-600 hover:text-steel-700"
                              >
                                {dict.publications.doi} {paper.doi}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            )}
                            {paper.url && (
                              <a
                                href={paper.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:text-brand-800"
                              >
                                {dict.publications.pdf}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
