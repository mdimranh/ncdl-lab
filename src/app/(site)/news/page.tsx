import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/section";
import { getDictionary, localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "News",
  description:
    "Tape-outs, awards, field trials and announcements from the Neuromorphic Chip Design Laboratory.",
};

const PAGE_SIZE = 6;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [locale, params, totalRows] = await Promise.all([
    getLocale(),
    searchParams,
    db.select({ value: count() }).from(news).where(eq(news.isPublished, true)),
  ]);
  const dict = getDictionary(locale);

  const total = totalRows[0]?.value ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isNaN(requested) ? 1 : Math.min(Math.max(requested, 1), pages);

  const items = await db
    .select()
    .from(news)
    .where(eq(news.isPublished, true))
    .orderBy(desc(news.publishedAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const hrefFor = (number: number) => (number === 1 ? "/news" : `/news?page=${number}`);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.nav.news}</Eyebrow>
          <h1 className="display mt-3 text-4xl text-ink-900 sm:text-5xl">
            {dict.news.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
            {dict.news.intro}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-10 lg:py-14">
          {items.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-muted">{dict.news.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col border border-line bg-white transition-colors hover:border-steel-300"
                >
                  <Link href={`/news/${item.slug}`} className="block overflow-hidden">
                    <div className="aspect-[4/3] bg-ink-900">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <time
                      dateTime={new Date(item.publishedAt).toISOString()}
                      className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-600"
                    >
                      {formatDate(item.publishedAt)}
                    </time>
                    <h2 className="display mt-2 text-[1.1rem] leading-snug text-ink-900">
                      <Link href={`/news/${item.slug}`} className="hover:text-brand-700">
                        {localized(locale, item.title, item.titleKo)}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-muted">
                      {localized(locale, item.excerpt, item.excerptKo)}
                    </p>
                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-brand-700 hover:text-brand-800"
                    >
                      {dict.common.readMore}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              {Array.from({ length: pages }).map((_, index) => {
                const number = index + 1;
                return (
                  <Link
                    key={number}
                    href={hrefFor(number)}
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
              {page < pages && (
                <Link
                  href={hrefFor(page + 1)}
                  className="ml-1 inline-flex items-center gap-1 border border-line bg-white px-4 py-2 text-[12px] text-ink-700 hover:border-steel-300"
                >
                  {dict.common.next}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
