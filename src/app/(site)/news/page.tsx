import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { Eyebrow } from "@/components/site/section";

export const metadata: Metadata = {
  title: "News",
  description:
    "Tape-outs, awards, field trials and announcements from the Neuromorphic Chip Design Laboratory.",
};

export default async function NewsPage() {
  const items = await db
    .select()
    .from(news)
    .where(eq(news.isPublished, true))
    .orderBy(desc(news.publishedAt));

  const [lead, ...rest] = items;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 lg:py-20">
          <Eyebrow>News & announcements</Eyebrow>
          <h1 className="display mt-4 max-w-3xl text-4xl text-ink-900 sm:text-5xl">
            From the bench.
          </h1>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            Silicon returns, measurement milestones, awards and the occasional
            robot walking across campus.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          {lead && (
            <Link
              href={`/news/${lead.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:border-brand-300 hover:shadow-[0_30px_80px_-48px_rgba(12,27,48,0.45)] lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-900 lg:aspect-auto lg:h-full">
                {lead.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lead.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-7 lg:p-10">
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-700">
                  Latest
                  <span className="h-1 w-1 rounded-full bg-brand-400" />
                  <span className="text-muted">{formatDate(lead.publishedAt)}</span>
                </div>
                <h2 className="display mt-4 text-2xl leading-snug text-ink-900 sm:text-3xl">
                  {lead.title}
                </h2>
                <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                  {lead.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-ink-900">
                  Read the full story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )}

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {rest.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_24px_60px_-36px_rgba(12,27,48,0.35)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-600" />
                    <time dateTime={new Date(item.publishedAt).toISOString()}>
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  <h2 className="mt-3 text-[15px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                    {item.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-muted">
                    {item.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-700">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {items.length === 0 && (
            <p className="py-20 text-center text-sm text-muted">
              No news has been published yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
