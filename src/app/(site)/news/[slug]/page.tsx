import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { Eyebrow, Tag } from "@/components/site/section";
import { getDictionary, localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

async function getArticle(slug: string) {
  const [article] = await db
    .select()
    .from(news)
    .where(and(eq(news.slug, slug), eq(news.isPublished, true)))
    .limit(1);
  return article ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const more = await db
    .select()
    .from(news)
    .where(and(eq(news.isPublished, true), ne(news.id, article.id)))
    .orderBy(desc(news.publishedAt))
    .limit(3);

  const paragraphs = localized(locale, article.content, article.contentKo)
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <article>
        <header className="border-b border-line bg-surface">
          <div className="wrap py-9 lg:py-12">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[12px] font-medium text-muted hover:text-ink-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {dict.news.title}
            </Link>

            <div className="mt-6 max-w-3xl">
              <Tag tone="brand">{dict.nav.news}</Tag>
              <h1 className="display mt-3 text-[2rem] leading-tight text-ink-900 sm:text-[2.6rem]">
                {localized(locale, article.title, article.titleKo)}
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {localized(locale, article.excerpt, article.excerptKo)}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-steel-500" />
                  <time dateTime={new Date(article.publishedAt).toISOString()}>
                    {formatDate(article.publishedAt)}
                  </time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5 text-steel-500" />
                  {article.authorName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {article.imageUrl && (
          <div className="bg-ink-900">
            <div className="wrap py-6">
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="aspect-[16/8] w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white">
          <div className="wrap grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr] lg:py-14">
            <div className="article-body max-w-3xl text-[14px]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            {article.images.length > 0 && (
              <aside>
                <Eyebrow>{dict.news.gallery}</Eyebrow>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {article.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="aspect-square overflow-hidden bg-surface-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="wrap py-10 lg:py-14">
            <h2 className="display text-[1.5rem] text-ink-900">{dict.news.more}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {more.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group border border-line bg-white p-5 transition-colors hover:border-steel-300"
                >
                  <time
                    dateTime={new Date(item.publishedAt).toISOString()}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-brand-600"
                  >
                    {formatDate(item.publishedAt)}
                  </time>
                  <p className="mt-2 text-[13px] font-medium leading-snug text-ink-900 group-hover:text-brand-700">
                    {localized(locale, item.title, item.titleKo)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-steel-600">
                    {dict.common.readMore}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
