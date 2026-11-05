import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/site/section";

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

  const more = await db
    .select()
    .from(news)
    .where(and(eq(news.isPublished, true), ne(news.id, article.id)))
    .orderBy(desc(news.publishedAt))
    .limit(3);

  const paragraphs = article.content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <article>
        <header className="border-b border-line bg-surface">
          <div className="wrap py-10 lg:py-14">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted transition-colors hover:text-ink-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All news
            </Link>

            <div className="mt-7 max-w-3xl">
              <Tag tone="brand">News</Tag>
              <h1 className="display mt-4 text-3xl leading-tight text-ink-900 sm:text-[2.7rem]">
                {article.title}
              </h1>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
                {article.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-600" />
                  <time dateTime={new Date(article.publishedAt).toISOString()}>
                    {formatDate(article.publishedAt)}
                  </time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5 text-brand-600" />
                  {article.authorName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {article.imageUrl && (
          <div className="border-b border-line bg-ink-950">
            <div className="wrap py-6">
              <div className="overflow-hidden rounded-2xl border border-white/10">
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
          <div className="wrap py-12 lg:py-16">
            <div className="article-body max-w-3xl text-[14.5px]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <p className="text-[12.5px] text-muted">
                Published by {article.authorName}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-800 hover:text-brand-700"
              >
                Media enquiries
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="wrap py-14">
            <h2 className="eyebrow text-brand-600">More from the lab</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {more.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group rounded-2xl border border-line bg-white p-5 transition-colors hover:border-brand-300"
                >
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                    {formatDate(item.publishedAt)}
                  </p>
                  <p className="mt-2.5 text-[13.5px] font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
