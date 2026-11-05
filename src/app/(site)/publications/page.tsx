import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Award,
  Cpu,
  FileText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { publicationTypeLabels } from "@/lib/content";
import { Eyebrow, Tag } from "@/components/site/section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Journal articles, conference papers, test chips, workshops and awards from the Neuromorphic Chip Design Laboratory.",
};

const typeOrder = ["journal", "conference", "chip", "workshop", "certificate"] as const;

function typeIcon(type: string) {
  if (type === "chip") return Cpu;
  if (type === "certificate") return Award;
  return FileText;
}

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; year?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const type = typeOrder.includes((params.type ?? "") as (typeof typeOrder)[number])
    ? (params.type as string)
    : "";
  const year = /^\d{4}$/.test(params.year ?? "") ? Number(params.year) : null;

  const filters: SQL[] = [];
  if (query) {
    const pattern = `%${query}%`;
    const search = or(
      ilike(publications.title, pattern),
      ilike(publications.authors, pattern),
      ilike(publications.venue, pattern),
    );
    if (search) filters.push(search);
  }
  if (type) filters.push(eq(publications.type, type as "journal"));
  if (year) filters.push(eq(publications.year, year));

  const where = filters.length > 0 ? and(...filters) : undefined;

  const [rows, yearRows, totals] = await Promise.all([
    db
      .select()
      .from(publications)
      .where(where)
      .orderBy(desc(publications.year), desc(publications.id)),
    db
      .select({ year: publications.year, value: sql<number>`count(*)::int` })
      .from(publications)
      .groupBy(publications.year)
      .orderBy(desc(publications.year)),
    db
      .select({ type: publications.type, value: sql<number>`count(*)::int` })
      .from(publications)
      .groupBy(publications.type),
  ]);

  const totalFor = (key: string) => totals.find((row) => row.type === key)?.value ?? 0;
  const grandTotal = totals.reduce((sum, row) => sum + row.value, 0);

  const grouped = yearRows
    .map((row) => ({
      year: row.year,
      items: rows.filter((item) => item.year === row.year),
    }))
    .filter((group) => group.items.length > 0);

  const activeFilters = Boolean(query || type || year);

  const buildHref = (next: { type?: string; year?: string }) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    const nextType = next.type ?? type;
    const nextYear = next.year ?? (year ? String(year) : "");
    if (nextType) search.set("type", nextType);
    if (nextYear) search.set("year", nextYear);
    const suffix = search.toString();
    return suffix ? `/publications?${suffix}` : "/publications";
  };

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 lg:py-20">
          <Eyebrow>Publications</Eyebrow>
          <h1 className="display mt-4 max-w-3xl text-4xl text-ink-900 sm:text-5xl">
            Everything we have put on record.
          </h1>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            Journal articles, conference papers, fabricated chips, workshops and
            awards — organised by year, searchable by title, author or venue.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <span>{grandTotal} records</span>
            {typeOrder.map((key) => (
              <span key={key}>
                {publicationTypeLabels[key]} · {totalFor(key)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-10 lg:py-14">
          <form
            action="/publications"
            method="get"
            className="rounded-2xl border border-line bg-surface p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Search publications</span>
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search by title, author or venue…"
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-[13.5px] text-ink-900 placeholder:text-muted/70 focus:border-brand-400 focus:outline-none"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative">
                  <span className="sr-only">Publication type</span>
                  <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  <select
                    name="type"
                    defaultValue={type}
                    className="w-full appearance-none rounded-xl border border-line bg-white py-2.5 pl-9 pr-8 text-[13px] text-ink-900 focus:border-brand-400 focus:outline-none sm:w-44"
                  >
                    <option value="">All types</option>
                    {typeOrder.map((key) => (
                      <option key={key} value={key}>
                        {publicationTypeLabels[key]}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="sr-only">Publication year</span>
                  <select
                    name="year"
                    defaultValue={year ? String(year) : ""}
                    className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] text-ink-900 focus:border-brand-400 focus:outline-none sm:w-32"
                  >
                    <option value="">All years</option>
                    {yearRows.map((row) => (
                      <option key={row.year} value={row.year}>
                        {row.year}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="rounded-xl bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-800"
                >
                  Apply
                </button>

                {activeFilters && (
                  <Link
                    href="/publications"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] text-muted transition-colors hover:text-ink-900"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Link
                href={buildHref({ type: "" })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  !type
                    ? "bg-ink-950 text-white"
                    : "bg-white text-muted hover:text-ink-900",
                )}
              >
                All
              </Link>
              {typeOrder.map((key) => (
                <Link
                  key={key}
                  href={buildHref({ type: key })}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                    type === key
                      ? "bg-ink-950 text-white"
                      : "bg-white text-muted hover:text-ink-900",
                  )}
                >
                  {publicationTypeLabels[key]}
                </Link>
              ))}
            </div>
          </form>

          {rows.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-line-strong py-20 text-center">
              <p className="display text-xl text-ink-900">No matching records</p>
              <p className="mt-2 text-[13px] text-muted">
                Try a different keyword, or clear the filters to see the full archive.
              </p>
              <Link
                href="/publications"
                className="mt-5 inline-flex rounded-full bg-ink-950 px-5 py-2.5 text-[12.5px] font-medium text-white"
              >
                Reset search
              </Link>
            </div>
          ) : (
            <div className="mt-12 space-y-14">
              {grouped.map((group) => (
                <section key={group.year}>
                  <div className="flex items-center gap-4">
                    <h2 className="font-display text-2xl font-medium tracking-tight text-ink-900">
                      {group.year}
                    </h2>
                    <span className="h-px flex-1 bg-line" />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                      {group.items.length} record{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <ul className="mt-2 divide-y divide-line">
                    {group.items.map((paper) => {
                      const Icon = typeIcon(paper.type);
                      return (
                        <li key={paper.id} className="group py-5">
                          <div className="flex gap-4">
                            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-brand-700">
                              <Icon className="h-4 w-4" strokeWidth={1.6} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Tag tone={paper.type === "chip" ? "success" : "brand"}>
                                  {publicationTypeLabels[paper.type]}
                                </Tag>
                                {paper.featured && <Tag>Featured</Tag>}
                              </div>
                              <h3 className="mt-2 text-[14.5px] font-semibold leading-snug text-ink-900">
                                {paper.title}
                              </h3>
                              <p className="mt-1 text-[12.5px] text-ink-700">{paper.authors}</p>
                              <p className="mt-0.5 text-[12.5px] italic text-muted">
                                {paper.venue}
                              </p>
                              {paper.abstract && (
                                <p className="mt-2 line-clamp-2 max-w-3xl text-[12.5px] leading-relaxed text-muted">
                                  {paper.abstract}
                                </p>
                              )}
                              <div className="mt-2.5 flex flex-wrap items-center gap-4">
                                {paper.doi && (
                                  <a
                                    href={paper.url ?? `https://doi.org/${paper.doi}`}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-brand-700 hover:text-brand-800"
                                  >
                                    DOI {paper.doi}
                                    <ArrowUpRight className="h-3 w-3" />
                                  </a>
                                )}
                                {paper.url && !paper.doi && (
                                  <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-1 text-[11.5px] font-medium text-brand-700 hover:text-brand-800"
                                  >
                                    View publication
                                    <ArrowUpRight className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
