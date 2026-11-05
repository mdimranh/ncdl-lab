import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDot,
  Mail,
  Microscope,
  Sparkles,
} from "lucide-react";
import { and, asc, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  gallery,
  members,
  news,
  positions,
  projects,
  publications,
  researchAreas,
} from "@/db/schema";
import { getSettings, positionTypeLabels } from "@/lib/content";
import { formatDate, formatDateShort } from "@/lib/utils";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { AreaIcon } from "@/components/site/area-icon";
import { Eyebrow, SectionHeading, Tag } from "@/components/site/section";

export default async function HomePage() {
  const settings = await getSettings();

  const [
    slides,
    areas,
    featuredProjects,
    latestNews,
    openPositions,
    memberTotal,
    publicationTotal,
    projectTotal,
    areaTotal,
  ] = await Promise.all([
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
      .orderBy(asc(researchAreas.displayOrder)),
    db
      .select({ project: projects, areaTitle: researchAreas.title })
      .from(projects)
      .leftJoin(researchAreas, eq(projects.areaId, researchAreas.id))
      .where(and(eq(projects.published, true), eq(projects.featured, true)))
      .orderBy(asc(projects.displayOrder))
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
    db
      .select({ value: count() })
      .from(members)
      .where(and(eq(members.published, true), ne(members.category, "alumni"))),
    db.select({ value: count() }).from(publications),
    db
      .select({ value: count() })
      .from(projects)
      .where(and(eq(projects.published, true), eq(projects.status, "ongoing"))),
    db
      .select({ value: count() })
      .from(researchAreas)
      .where(eq(researchAreas.published, true)),
  ]);

  const stats = [
    { value: memberTotal[0]?.value ?? 0, label: "Researchers" },
    { value: publicationTotal[0]?.value ?? 0, label: "Publications" },
    { value: projectTotal[0]?.value ?? 0, label: "Active projects" },
    { value: areaTotal[0]?.value ?? 0, label: "Research areas" },
  ];

  const missionParagraphs = (settings.mission || "")
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const pillars = [
    {
      title: "Design at the transistor level",
      body: "Every architecture we propose is carried through schematic, layout and sign-off in a modern CMOS process.",
    },
    {
      title: "Prototype what we cannot simulate",
      body: "FPGA platforms and test chips let us measure real non-idealities long before a paper is written.",
    },
    {
      title: "Publish reproducible results",
      body: "Measurement data, test benches and RTL are released with our papers so others can build on them.",
    },
  ];

  return (
    <>
      {/* ------------------------------- hero ------------------------------- */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <HeroCarousel
          slides={slides.map((slide) => ({
            imageUrl: slide.imageUrl,
            title: slide.title,
            caption: slide.caption,
          }))}
        />

        <div className="wrap relative z-10 pt-20 pb-32 sm:pt-28 sm:pb-36">
          <div className="max-w-3xl animate-rise">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-300" />
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/70">
                {settings.shortName} · Established {settings.foundingYear}
              </span>
            </div>

            <h1 className="display mt-7 text-[2.6rem] leading-[1.02] text-white sm:text-6xl lg:text-[4.1rem]">
              Silicon that learns
              <br className="hidden sm:block" /> the way brains do.
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-base">
              {settings.tagline} We design neuromorphic circuits, RF front-ends,
              FPGA accelerators and robotics control hardware — and measure every
              one of them in the lab.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-400 px-6 py-3 text-[13.5px] font-semibold text-ink-950 transition-colors hover:bg-brand-300"
              >
                Explore our research
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/members"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13.5px] font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white"
              >
                Meet the team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- stats ------------------------------ */}
      <section className="border-y border-white/10 bg-ink-950">
        <div className="wrap grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-5 py-7 first:pl-0">
              <p className="font-display text-3xl font-medium tracking-tight text-white">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ mission ----------------------------- */}
      <section className="bg-white">
        <div className="wrap grid gap-14 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:py-28">
          <div>
            <Eyebrow>The laboratory</Eyebrow>
            <h2 className="display mt-4 text-3xl text-ink-900 sm:text-[2.65rem]">
              {settings.motto}
            </h2>
            <div className="mt-8 h-px w-16 bg-brand-400" />
            <dl className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                  Founded
                </dt>
                <dd className="mt-1 font-display text-lg text-ink-900">
                  {settings.foundingYear}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                  Affiliated with
                </dt>
                <dd className="mt-1 text-[13.5px] leading-snug text-ink-800">
                  {settings.institution}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <div className="space-y-4 text-[14.5px] leading-relaxed text-ink-700">
              {missionParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="flex gap-4 bg-white px-5 py-5 transition-colors hover:bg-surface/60"
                >
                  <span className="mt-0.5 font-mono text-[11px] text-brand-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink-900">
                      {pillar.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- research areas ------------------------- */}
      <section className="border-y border-line bg-surface">
        <div className="wrap py-20 lg:py-24">
          <SectionHeading
            eyebrow="Research"
            title="Four disciplines, one silicon stack."
            description="Our work connects device physics to system-level behaviour. Each area has its own methods, labs and measurement benches — and they meet in the same test chips."
            action={{ label: "All research areas", href: "/research" }}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {areas.map((area, index) => (
              <Link
                key={area.id}
                href={`/research/${area.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_24px_60px_-32px_rgba(12,27,48,0.35)]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-ink-800 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700">
                    <AreaIcon name={area.icon} />
                  </span>
                  <span className="font-mono text-[11px] text-line-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="display mt-6 text-[1.35rem] text-ink-900">
                  {area.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
                  {area.summary}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {area.keywords.slice(0, 3).map((keyword) => (
                    <Tag key={keyword}>{keyword}</Tag>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-700 transition-colors group-hover:text-brand-700">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- projects ----------------------------- */}
      <section className="bg-white">
        <div className="wrap py-20 lg:py-24">
          <SectionHeading
            eyebrow="Selected projects"
            title="Research you can measure."
            description="A sample of the programmes currently running in the lab, from a 28 nm spiking accelerator to a walking robot's motor drive."
            action={{ label: "Browse research areas", href: "/research" }}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {featuredProjects.map(({ project, areaTitle }) => (
              <article
                key={project.id}
                className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-brand-300"
              >
                <div className="flex items-center justify-between">
                  <Tag tone={project.status === "ongoing" ? "brand" : "default"}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {project.status}
                  </Tag>
                  <span className="font-mono text-[11px] text-muted">
                    {project.startYear}
                    {project.endYear ? `–${project.endYear}` : ""}
                  </span>
                </div>

                <h3 className="display mt-5 text-[1.15rem] leading-snug text-ink-900">
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">
                  {project.summary}
                </p>

                <div className="mt-6 border-t border-line pt-4">
                  {areaTitle && (
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-700">
                      {areaTitle}
                    </p>
                  )}
                  {project.funding && (
                    <p className="mt-1.5 text-[12px] text-muted">{project.funding}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- news ------------------------------- */}
      <section className="border-y border-line bg-surface">
        <div className="wrap py-20 lg:py-24">
          <SectionHeading
            eyebrow="Latest news"
            title="From the bench."
            description="Tape-outs, awards, field trials and everything in between."
            action={{ label: "All news", href: "/news" }}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {latestNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(12,27,48,0.35)]"
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
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-600" />
                    <time dateTime={new Date(item.publishedAt).toISOString()}>
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted">
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
        </div>
      </section>

      {/* ----------------------------- positions ---------------------------- */}
      <section id="positions" className="bg-ink-950 text-white">
        <div className="grid-tech">
          <div className="wrap py-20 lg:py-24">
            <SectionHeading
              tone="dark"
              eyebrow="Open positions"
              title="Join the next silicon generation."
              description="We are always looking for students who enjoy both the physics and the pragmatics of building hardware."
              action={{ label: "How to apply", href: "/contact" }}
            />

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.9fr]">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {openPositions.map((position) => (
                  <li key={position.id}>
                    <div className="group flex items-start justify-between gap-6 py-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Tag tone="dark">{positionTypeLabels[position.type]}</Tag>
                          {position.deadline && (
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                              Apply by {formatDateShort(position.deadline)}
                            </span>
                          )}
                        </div>
                        <p className="mt-2.5 text-[15px] font-medium text-white">
                          {position.title}
                        </p>
                        <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-white/50">
                          {position.description}
                        </p>
                      </div>
                      <Link
                        href="/contact"
                        aria-label={`Enquire about ${position.title}`}
                        className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/60 transition-colors group-hover:border-brand-300 group-hover:text-brand-300"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))}
                {openPositions.length === 0 && (
                  <li className="py-6 text-sm text-white/50">
                    No positions are open right now — send us a speculative enquiry.
                  </li>
                )}
              </ul>

              <aside className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-400/15 text-brand-300">
                    <Sparkles className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <p className="display mt-5 text-xl text-white">
                    Prospective students
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                    Send a CV, transcripts and a short note about which research
                    area interests you. We read every enquiry and reply within two
                    weeks.
                  </p>
                  <ul className="mt-5 space-y-2 text-[12.5px] text-white/55">
                    <li className="flex items-center gap-2">
                      <Microscope className="h-3.5 w-3.5 text-brand-300" />
                      Fully funded PhD and MSc places
                    </li>
                    <li className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-brand-300" />
                      Rolling applications, two intakes per year
                    </li>
                  </ul>
                </div>
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}?subject=Application%20enquiry`}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-brand-100"
                  >
                    <Mail className="h-4 w-4" />
                    {settings.email}
                  </a>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
