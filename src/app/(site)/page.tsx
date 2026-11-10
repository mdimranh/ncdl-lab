import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { gallery, news, positions, researchAreas } from "@/db/schema";
import { getSettings } from "@/lib/content";
import { getDictionary, localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { formatDate, formatDateShort } from "@/lib/utils";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { AreaIcon } from "@/components/site/area-icon";
import { Eyebrow } from "@/components/site/section";

export default async function HomePage() {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const dict = getDictionary(locale);

  const [slides, areas, latestNews, highlights, openPositions] = await Promise.all([
    db
      .select()
      .from(gallery)
      .where(eq(gallery.isActive, true))
      .orderBy(asc(gallery.displayOrder))
      .limit(6),
    db
      .select()
      .from(researchAreas)
      .where(eq(researchAreas.published, true))
      .orderBy(desc(researchAreas.publishedAt), asc(researchAreas.displayOrder))
      .limit(4),
    db
      .select()
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(desc(news.publishedAt))
      .limit(3),
    db
      .select()
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(desc(news.publishedAt))
      .limit(3),
    db
      .select()
      .from(positions)
      .where(eq(positions.isOpen, true))
      .orderBy(asc(positions.displayOrder))
      .limit(4),
  ]);

  return (
    <>
      {/* 2 — Photo carousel */}
      <HeroCarousel
        slides={slides.map((slide) => ({
          imageUrl: slide.imageUrl,
          title: slide.title,
          caption: slide.caption,
        }))}
      />

      {/* 3 — News highlights */}
      {highlights.length > 0 && (
        <section className="border-b border-line bg-white">
          <div className="wrap py-10 lg:py-12">
            <div className="flex items-end justify-between gap-4">
              <Eyebrow>{dict.home.newsHighlights}</Eyebrow>
              <Link
                href="/news"
                className="text-[12px] font-medium text-steel-600 hover:text-steel-700"
              >
                {dict.common.viewAll} →
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group relative block overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ink-800">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="h-full w-full bg-surface-2" />
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-4 pt-10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-300">
                      {formatDateShort(item.publishedAt)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug text-white">
                      {localized(locale, item.title, item.titleKo)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4 — Motto and the four research areas */}
      <section className="bg-surface">
        <div className="wrap py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>{dict.home.mottoKicker}</Eyebrow>
            <p className="display mt-4 text-[2rem] leading-tight text-ink-900 sm:text-[2.9rem]">
              {settings.motto}
            </p>
            <div className="rule mt-7" />
            <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-muted">
              {settings.tagline}
            </p>
          </div>

          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <Eyebrow>{dict.home.researchAreas}</Eyebrow>
              <p className="mt-2 max-w-xl text-[13px] text-muted">
                {dict.home.researchAreasNote}
              </p>
            </div>
            <Link
              href="/research"
              className="hidden shrink-0 text-[12px] font-medium text-steel-600 hover:text-steel-700 sm:block"
            >
              {dict.common.viewAll} →
            </Link>
          </div>

          <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/research/${area.slug}`}
                className="group flex flex-col bg-white p-6 transition-colors hover:bg-brand-50/40"
              >
                <span className="text-steel-600">
                  <AreaIcon name={area.icon} className="h-6 w-6" />
                </span>
                <h3 className="display mt-5 text-[1.15rem] leading-snug text-ink-900">
                  {localized(locale, area.title, area.titleKo)}
                </h3>
                <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-muted">
                  {localized(locale, area.summary, area.summaryKo)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-brand-700">
                  {dict.common.readMore}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Open positions */}
      <section className="bg-ink-900 text-white">
        <div className="grid-tech">
          <div className="wrap grid gap-10 py-16 lg:grid-cols-[1.4fr_0.9fr] lg:py-20">
            <div>
              <Eyebrow tone="light">{dict.home.positions}</Eyebrow>
              <h2 className="display mt-3 text-[1.9rem] text-white sm:text-[2.3rem]">
                {dict.home.positions}
              </h2>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-white/60">
                {dict.home.positionsNote}
              </p>

              <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
                {openPositions.map((position) => (
                  <li
                    key={position.id}
                    className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-[14.5px] font-medium text-white">
                        {position.title}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-3 text-[11.5px] text-white/45">
                        <span className="font-mono uppercase tracking-[0.12em] text-brand-300">
                          {dict.home.positionsKo[position.type]}
                        </span>
                        {position.deadline && (
                          <span>
                            {dict.common.deadline} {formatDate(position.deadline)}
                          </span>
                        )}
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex w-fit items-center gap-1.5 border border-white/20 px-4 py-2 text-[12px] font-medium text-white/80 transition-colors hover:border-brand-400 hover:text-brand-300"
                    >
                      {dict.contact.apply}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
                {openPositions.length === 0 && (
                  <li className="py-5 text-[13px] text-white/50">
                    {dict.contact.noPositions}
                  </li>
                )}
              </ul>
            </div>

            <aside className="border border-white/12 bg-white/[0.04] p-7">
              <p className="display text-xl text-white">{dict.home.joinUs}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                {dict.home.joinBody}
              </p>
              {settings.email && (
                <a
                  href={`mailto:${settings.email}?subject=Application%20enquiry`}
                  className="mt-6 inline-flex items-center gap-2 bg-brand-500 px-5 py-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  <Mail className="h-4 w-4" />
                  {settings.email}
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* 6 — Latest news */}
      <section className="bg-white">
        <div className="wrap py-16 lg:py-20">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <Eyebrow>{dict.home.latestNews}</Eyebrow>
              <p className="mt-2 text-[13px] text-muted">{dict.home.latestNewsNote}</p>
            </div>
            <Link
              href="/news"
              className="shrink-0 text-[12px] font-medium text-steel-600 hover:text-steel-700"
            >
              {dict.common.viewAll} →
            </Link>
          </div>

          <ul className="divide-y divide-line">
            {latestNews.map((item) => (
              <li key={item.id}>
                <div className="grid gap-4 py-6 sm:grid-cols-[120px_1fr] sm:gap-6">
                  <div className="flex items-center gap-2 text-[11.5px] text-muted sm:flex-col sm:items-start sm:gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-600 sm:hidden" />
                    <time dateTime={new Date(item.publishedAt).toISOString()}>
                      {formatDate(item.publishedAt)}
                    </time>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-steel-500 sm:block">
                      {item.authorName}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold leading-snug text-ink-900">
                      {localized(locale, item.title, item.titleKo)}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 max-w-3xl text-[13px] leading-relaxed text-muted">
                      {localized(locale, item.excerpt, item.excerptKo)}
                    </p>
                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-brand-700 hover:text-brand-800"
                    >
                      {dict.common.readMore}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
            {latestNews.length === 0 && (
              <li className="py-8 text-[13px] text-muted">{dict.news.empty}</li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
