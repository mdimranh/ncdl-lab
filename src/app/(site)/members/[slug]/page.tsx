import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { and, desc, eq, like } from "drizzle-orm";
import { db } from "@/db";
import { members, publications } from "@/db/schema";
import { MemberAvatar } from "@/components/site/member-avatar";
import { Tag } from "@/components/site/section";
import { getSettings, memberCategoryLabels } from "@/lib/content";
import { getDictionary, localized, localizedList } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

async function getMember(slug: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.slug, slug), eq(members.published, true)))
    .limit(1);
  return member ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) return { title: "Member not found" };
  return {
    title: member.name,
    description: member.designation || member.bio.slice(0, 150),
  };
}

/** Section title with an optional item count. */
function SectionHeading({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5">
      <h2 className="font-display text-[1.2rem] font-semibold tracking-tight text-ink-900">
        {title}
      </h2>
      {typeof count === "number" && count > 0 && (
        <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-[13px] leading-relaxed text-ink-900">{children}</dd>
    </div>
  );
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) notFound();

  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const dict = getDictionary(locale);

  const surname = member.name.split(" ").slice(-1)[0];
  const authored = await db
    .select()
    .from(publications)
    .where(like(publications.authors, `%${surname}%`))
    .orderBy(desc(publications.year))
    .limit(6);

  const paragraphs = localized(locale, member.bio, member.bioKo)
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const displayName = localized(locale, member.name, member.nameKo);
  const displayInterests = localizedList(locale, member.interests, member.interestsKo);
  const institution = localized(locale, settings.institution, settings.institutionKo);

  const profileLinks = [
    { label: "Google Scholar", href: member.scholarUrl },
    { label: "ORCID", href: member.orcidUrl },
    { label: "LinkedIn", href: member.linkedinUrl },
    { label: dict.members.profile.website, href: member.websiteUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  const hasCv =
    member.experience.length > 0 ||
    member.education.length > 0 ||
    member.patents.length > 0 ||
    member.memberProjects.length > 0;

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-8 lg:py-12">
          <Link
            href={`/members?group=${member.category}`}
            className="inline-flex items-center gap-2 text-[12px] font-medium text-muted transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {dict.nav.members}
            <span aria-hidden="true" className="text-line-strong">
              /
            </span>
            {dict.members.groups[member.category]}
          </Link>

          <div className="mt-8 grid gap-8 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start sm:gap-10">
            <div className="h-56 w-44 overflow-hidden border border-line bg-surface-2">
              <MemberAvatar name={member.name} photoUrl={member.photoUrl} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <Tag tone="steel">{memberCategoryLabels[member.category]}</Tag>
                {member.joinedYear && (
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                    {dict.members.profile.joined} {member.joinedYear}
                  </span>
                )}
              </div>

              <h1 className="display mt-3 text-[2.6rem] leading-[1.05] text-ink-900 sm:text-[3.1rem]">
                {displayName}
              </h1>

              {member.designation && (
                <p className="mt-3 max-w-2xl text-[15px] font-medium leading-snug text-ink-800">
                  {localized(locale, member.designation, member.designationKo)}
                </p>
              )}
              <p className="mt-1 text-[13px] text-muted">
                {institution} · {settings.shortName}
              </p>
              {member.alumniPosition && (
                <p className="mt-2 text-[12.5px] text-steel-600">
                  {localized(locale, member.alumniPosition, member.alumniPositionKo)}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 bg-ink-900 px-4 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-800"
                  >
                    <Mail className="h-4 w-4" />
                    {dict.members.profile.contact}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-[12.5px] font-medium text-ink-800 transition-colors hover:border-steel-300"
                  >
                    <Phone className="h-4 w-4 text-steel-500" />
                    {member.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:py-16">
          <div className="min-w-0">
            {paragraphs.length > 0 && (
              <div>
                <SectionHeading title={dict.members.profile.about} />
                <div className="article-body mt-4">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {displayInterests.length > 0 && (
              <div className={cn(paragraphs.length > 0 && "mt-10")}>
                <SectionHeading title={dict.members.profile.interests} />
                <ul className="mt-4 flex flex-wrap gap-2">
                  {displayInterests.map((interest) => (
                    <li
                      key={interest}
                      className="border border-line bg-white px-3 py-1.5 text-[12px] text-ink-700"
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.experience.length > 0 && (
              <div className="mt-10">
                <SectionHeading title={dict.members.profile.experience} />
                <ol className="mt-1">
                  {member.experience.map((entry, index) => (
                    <li
                      key={`${entry.organization}-${index}`}
                      className="grid gap-1 border-b border-line py-3.5 last:border-0 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-5"
                    >
                      <span className="font-mono text-[11px] leading-relaxed text-steel-600">
                        {entry.from} – {entry.to}
                      </span>
                      <div>
                        <p className="text-[13.5px] font-medium leading-snug text-ink-900">
                          {entry.position}
                        </p>
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                          {entry.organization}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {member.education.length > 0 && (
              <div className="mt-10">
                <SectionHeading title={dict.members.profile.education} />
                <ol className="mt-1">
                  {member.education.map((entry, index) => (
                    <li
                      key={`${entry.degree}-${entry.year}-${index}`}
                      className="grid gap-1 border-b border-line py-3.5 last:border-0 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-5"
                    >
                      <span className="font-mono text-[11px] leading-relaxed text-steel-600">
                        {entry.year}
                      </span>
                      <div>
                        <p className="text-[13.5px] font-medium leading-snug text-ink-900">
                          {entry.degree}
                        </p>
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                          {entry.institution}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {member.memberProjects.length > 0 && (
              <div className="mt-10">
                <SectionHeading
                  title={dict.members.profile.projects}
                  count={member.memberProjects.length}
                />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {member.memberProjects.map((project, index) => (
                    <article
                      key={`${project.title}-${index}`}
                      className="flex flex-col border border-line bg-white p-5"
                    >
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-brand-600">
                        {project.period}
                      </p>
                      <h3 className="mt-2 font-display text-[15px] font-semibold leading-snug text-ink-900">
                        {project.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-muted">
                        {project.summary}
                      </p>
                      {project.relevance && (
                        <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-700">
                          <span className="font-medium text-ink-900">
                            {dict.members.profile.projectRelevance}:{" "}
                          </span>
                          {project.relevance}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {member.patents.length > 0 && (
              <div className={cn(hasCv && "mt-10")}>
                <SectionHeading
                  title={dict.members.profile.patents}
                  count={member.patents.length}
                />
                <ol className="mt-1">
                  {member.patents.map((patent, index) => {
                    const registered = patent.status.toLowerCase() === "registered";
                    return (
                      <li
                        key={`${patent.title}-${index}`}
                        className="flex flex-col gap-2 border-b border-line py-3.5 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                      >
                        <div className="flex min-w-0 gap-3">
                          <span className="mt-[3px] font-mono text-[10.5px] text-muted">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="text-[13px] leading-snug text-ink-900">
                            {patent.title}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 pl-7 sm:pl-0">
                          {patent.status && (
                            <span
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
                                registered
                                  ? "bg-brand-50 text-brand-700"
                                  : "bg-steel-50 text-steel-600",
                              )}
                            >
                              {patent.status}
                            </span>
                          )}
                          <span className="font-mono text-[10.5px] text-muted">
                            {patent.number}
                          </span>
                          <span className="font-mono text-[10.5px] text-muted">
                            {patent.date}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            <div className="mt-10">
              <SectionHeading
                title={dict.members.profile.publications}
                count={authored.length}
              />
              {authored.length > 0 ? (
                <ul className="mt-1">
                  {authored.map((paper) => (
                    <li key={paper.id} className="border-b border-line py-3.5 last:border-0">
                      <p className="text-[13.5px] font-medium leading-snug text-ink-900">
                        {localized(locale, paper.title, paper.titleKo)}
                      </p>
                      <p className="mt-1 text-[11.5px] text-muted">
                        {localized(locale, paper.venue, paper.venueKo)} · {paper.year}
                      </p>
                      {paper.doi && (
                        <a
                          href={paper.url ?? `https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10.5px] text-steel-600 hover:text-steel-700"
                        >
                          DOI {paper.doi}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[12.5px] text-muted">
                  {dict.members.profile.noPublications}
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line">
              <div className="flex items-center gap-2 border-b border-line bg-surface px-5 py-3">
                <Mail className="h-3.5 w-3.5 text-brand-600" />
                <p className="eyebrow text-brand-600">{dict.members.profile.contact}</p>
              </div>
              <dl className="space-y-4 px-5 py-5">
                {member.email && (
                  <Fact label={dict.members.profile.email}>
                    <a
                      href={`mailto:${member.email}`}
                      className="break-all text-steel-600 hover:text-steel-700"
                    >
                      {member.email}
                    </a>
                  </Fact>
                )}
                {member.phone && (
                  <Fact label={dict.members.profile.officePhone}>
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="hover:text-steel-600"
                    >
                      {member.phone}
                    </a>
                  </Fact>
                )}
                {member.mobile && (
                  <Fact label={dict.members.profile.mobile}>{member.mobile}</Fact>
                )}
                {member.officeAddress && (
                  <Fact label={dict.members.profile.officeAddress}>
                    <span className="inline-flex gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-steel-500" />
                      <span>{member.officeAddress}</span>
                    </span>
                  </Fact>
                )}
                {member.homeAddress && (
                  <Fact label={dict.members.profile.homeAddress}>
                    {member.homeAddress}
                  </Fact>
                )}
              </dl>
            </div>

            <div className="border border-line px-5 py-5">
              <p className="eyebrow text-muted">{dict.members.profile.department}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-900">
                {institution}
              </p>
              {member.joinedYear && (
                <p className="mt-3 border-t border-line pt-3 text-[12px] text-muted">
                  {dict.members.profile.joined} {member.joinedYear}
                </p>
              )}
            </div>

            {profileLinks.length > 0 && (
              <div className="border border-line px-5 py-5">
                <p className="eyebrow text-muted">{dict.members.profile.links}</p>
                <ul className="mt-3 space-y-2">
                  {profileLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between gap-3 text-[12.5px] text-ink-800 transition-colors hover:text-steel-600"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-steel-500" />
                          {link.label}
                        </span>
                        <ArrowUpRight className="h-3 w-3 text-muted transition-transform group-hover:-translate-y-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </aside>
        </div>
      </section>
    </>
  );
}
