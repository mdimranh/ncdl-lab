import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { researchAreas } from "@/db/schema";
import { AreaIcon } from "@/components/site/area-icon";
import { Eyebrow, Tag } from "@/components/site/section";
import { cn } from "@/lib/utils";
import { getDictionary, localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Four research areas at NCDL: neuromorphic circuit design, RF and analog circuits, FPGA-based image analysis and robotics control hardware.",
};

const PAGE_SIZE = 6;

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [locale, params, totalRows] = await Promise.all([
    getLocale(),
    searchParams,
    db
      .select({ value: count() })
      .from(researchAreas)
      .where(eq(researchAreas.published, true)),
  ]);
  const dict = getDictionary(locale);

  const total = totalRows[0]?.value ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), pages);

  const areas = await db
    .select()
    .from(researchAreas)
    .where(eq(researchAreas.published, true))
    .orderBy(asc(researchAreas.publishedAt), asc(researchAreas.displayOrder))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  // Latest first: the most recently published area is listed first.
  const ordered = [...areas].sort((a, b) => {
    const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return right - left;
  });

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.nav.research}</Eyebrow>
          <h1 className="display mt-3 text-4xl text-ink-900 sm:text-5xl">
            {dict.research.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
            {dict.research.intro}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-10 lg:py-14">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 text-[11.5px] text-muted">
            <span className="font-mono uppercase tracking-[0.12em]">
              {dict.common.page} {page} / {pages}
            </span>
            <span className="font-mono uppercase tracking-[0.12em]">
              {dict.common.sortLatest}
            </span>
          </div>

          {ordered.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-muted">
              {dict.research.empty}
            </p>
          ) : (
            <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
              {ordered.map((area, index) => {
                const isLatest = page === 1 && index === 0;
                return (
                  <article
                    key={area.id}
                    className="group flex flex-col bg-white p-7 transition-colors hover:bg-brand-50/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center border border-line bg-surface text-steel-600">
                        <AreaIcon name={area.icon} className="h-5 w-5" />
                      </span>
                      <div className="flex items-center gap-2">
                        {isLatest && <Tag tone="brand">{dict.common.latest}</Tag>}
                        {area.publishedAt && (
                          <span className="font-mono text-[10.5px] text-muted">
                            {dict.research.publishedOn}{" "}
                            {area.publishedAt.replace(/-/g, ".")}
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="display mt-5 text-[1.5rem] leading-snug text-ink-900">
                      {localized(locale, area.title, area.titleKo)}
                    </h2>
                    <p className="mt-1.5 text-[12px] font-medium text-brand-700">
                      {localized(locale, area.tagline, area.taglineKo)}
                    </p>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">
                      {localized(locale, area.summary, area.summaryKo)}
                    </p>

                    <Link
                      href={`/research/${area.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-800 transition-colors group-hover:text-brand-700"
                    >
                      {dict.common.readMore}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-8 flex items-center gap-1.5">
              {Array.from({ length: pages }).map((_, index) => {
                const number = index + 1;
                return (
                  <Link
                    key={number}
                    href={number === 1 ? "/research" : `/research?page=${number}`}
                    aria-current={number === page ? "page" : undefined}
                    className={cn(
                      "grid h-9 w-9 place-items-center border text-[12.5px]",
                      number === page
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-line bg-white text-muted hover:border-steel-300",
                    )}
                  >
                    {number}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
