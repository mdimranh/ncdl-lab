import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FolderKanban,
  Layers,
  Newspaper,
  Users,
} from "lucide-react";
import { and, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  members,
  news,
  positions,
  projects,
  publications,
  researchAreas,
} from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { publicationTypeLabels } from "@/lib/content";
import { formatDateShort } from "@/lib/utils";
import { Card, PageHeader } from "@/components/admin/ui";

export default async function AdminDashboard() {
  const user = await requireUser();

  const [
    memberCount,
    publicationCount,
    projectCount,
    newsCount,
    areaCount,
    openPositionCount,
    recentPublications,
    recentNews,
    recentProjects,
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(members)
      .where(ne(members.category, "alumni")),
    db.select({ value: count() }).from(publications),
    db.select({ value: count() }).from(projects),
    db.select({ value: count() }).from(news),
    db.select({ value: count() }).from(researchAreas),
    db
      .select({ value: count() })
      .from(positions)
      .where(eq(positions.isOpen, true)),
    db.select().from(publications).orderBy(desc(publications.id)).limit(5),
    db.select().from(news).orderBy(desc(news.publishedAt)).limit(4),
    db
      .select()
      .from(projects)
      .where(and(eq(projects.published, true), eq(projects.status, "ongoing")))
      .limit(4),
  ]);

  const stats = [
    { label: "Members", value: memberCount[0]?.value ?? 0, href: "/admin/members", icon: Users },
    {
      label: "Publications",
      value: publicationCount[0]?.value ?? 0,
      href: "/admin/publications",
      icon: BookOpen,
    },
    { label: "Projects", value: projectCount[0]?.value ?? 0, href: "/admin/projects", icon: FolderKanban },
    { label: "News articles", value: newsCount[0]?.value ?? 0, href: "/admin/news", icon: Newspaper },
    { label: "Research areas", value: areaCount[0]?.value ?? 0, href: "/admin/research", icon: Layers },
    {
      label: "Open positions",
      value: openPositionCount[0]?.value ?? 0,
      href: "/admin/positions",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Everything published here appears on the public website immediately after saving."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-line bg-white p-4 transition-colors hover:border-brand-300"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface text-ink-700 group-hover:bg-brand-50 group-hover:text-brand-700">
                <stat.icon className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-line-strong group-hover:text-brand-600" />
            </div>
            <p className="mt-4 font-display text-2xl text-ink-900">{stat.value}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Recently added
              </p>
              <h2 className="display mt-1 text-lg text-ink-900">Publications</h2>
            </div>
            <Link
              href="/admin/publications"
              className="text-[11.5px] font-medium text-ink-700 hover:text-brand-700"
            >
              Manage →
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {recentPublications.map((paper) => (
              <li key={paper.id} className="py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-brand-700">
                    {publicationTypeLabels[paper.type]}
                  </span>
                  <span className="text-[10px] text-muted">· {paper.year}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-[12.5px] font-medium text-ink-900">
                  {paper.title}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{paper.authors}</p>
              </li>
            ))}
            {recentPublications.length === 0 && (
              <li className="py-4 text-[12px] text-muted">No publications yet.</li>
            )}
          </ul>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="display text-lg text-ink-900">Latest news</h2>
              <Link
                href="/admin/news"
                className="text-[11.5px] font-medium text-ink-700 hover:text-brand-700"
              >
                Manage →
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {recentNews.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[12.5px] font-medium text-ink-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-muted">
                      {formatDateShort(item.publishedAt)} ·{" "}
                      {item.isPublished ? "Published" : "Draft"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/news/${item.id}`}
                    className="shrink-0 text-[11px] font-medium text-brand-700 hover:text-brand-800"
                  >
                    Edit
                  </Link>
                </li>
              ))}
              {recentNews.length === 0 && (
                <li className="py-3 text-[12px] text-muted">No news yet.</li>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="display text-lg text-ink-900">Ongoing projects</h2>
              <Link
                href="/admin/projects"
                className="text-[11.5px] font-medium text-ink-700 hover:text-brand-700"
              >
                Manage →
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {recentProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2"
                >
                  <span className="line-clamp-1 text-[12px] text-ink-800">
                    {project.title}
                  </span>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="shrink-0 text-[11px] font-medium text-brand-700"
                  >
                    Edit
                  </Link>
                </li>
              ))}
              {recentProjects.length === 0 && (
                <li className="text-[12px] text-muted">No ongoing projects.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-ink-900">Publishing checklist</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            Add a member, publish a paper, post news, open a position, update the
            contact details — everything the public site shows is editable here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/news/new"
            className="rounded-lg bg-ink-950 px-4 py-2 text-[12px] font-medium text-white hover:bg-ink-800"
          >
            New article
          </Link>
          <Link
            href="/admin/publications/new"
            className="rounded-lg border border-line px-4 py-2 text-[12px] font-medium text-ink-800 hover:border-brand-300"
          >
            Add publication
          </Link>
        </div>
      </Card>
    </div>
  );
}
