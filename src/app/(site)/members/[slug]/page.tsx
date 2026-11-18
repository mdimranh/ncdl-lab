import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react";
import { and, desc, eq, like } from "drizzle-orm";
import { db } from "@/db";
import { members, publications } from "@/db/schema";
import { MemberAvatar } from "@/components/site/member-avatar";
import { Eyebrow, Tag } from "@/components/site/section";
import { getSettings, memberCategoryLabels } from "@/lib/content";
import { getDictionary, localized, localizedList } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

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

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-10 lg:py-14">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-[12px] font-medium text-muted hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {dict.nav.members}
          </Link>

          <div className="mt-8 grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
            <div className="h-48 w-40 overflow-hidden bg-surface-2">
              <MemberAvatar name={member.name} photoUrl={member.photoUrl} />
            </div>

            <div>
              <Tag tone="steel">{memberCategoryLabels[member.category]}</Tag>
              <h1 className="display mt-3 text-4xl text-ink-900 sm:text-5xl">
                {displayName}
              </h1>
              <p className="mt-2 text-[14.5px] text-ink-800">
                {localized(locale, member.designation, member.designationKo)}
                {member.designation && " · "}
                {settings.shortName} Lab
              </p>
              {member.alumniPosition && (
                <p className="mt-1 text-[12.5px] text-steel-600">
                  {localized(locale, member.alumniPosition, member.alumniPositionKo)}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-muted">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-ink-900"
                  >
                    <Mail className="h-3.5 w-3.5 text-steel-500" />
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 hover:text-ink-900"
                  >
                    <Phone className="h-3.5 w-3.5 text-steel-500" />
                    {member.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap grid gap-12 py-12 lg:grid-cols-[1.55fr_1fr] lg:py-16">
          <div>
            {paragraphs.length > 0 && (
              <>
                <Eyebrow>{dict.members.profile.about}</Eyebrow>
                <div className="article-body mt-4">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}

            <h2 className="eyebrow mt-10 flex items-center gap-2 text-brand-600">
              <BookOpen className="h-3.5 w-3.5" />
              {dict.members.profile.interests}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {displayInterests.map((interest) => (
                <span
                  key={interest}
                  className="border border-line bg-white px-3 py-1.5 text-[12px] text-ink-700"
                >
                  {interest}
                </span>
              ))}
            </div>

            <h2 className="eyebrow mt-10 text-brand-600">
              {dict.members.profile.publications}
            </h2>
            {authored.length > 0 ? (
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {authored.map((paper) => (
                  <li key={paper.id} className="py-3.5">
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
                        className="mt-1 inline-flex items-center gap-1 font-mono text-[10.5px] text-steel-600 hover:text-steel-700"
                      >
                        DOI {paper.doi}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[12.5px] text-muted">
                {dict.members.profile.noPublications}
              </p>
            )}
          </div>

          <aside>
            <dl className="divide-y divide-line border-y border-line text-[13px]">
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted">{dict.members.profile.department}</dt>
                <dd className="max-w-[60%] text-right text-ink-800">
                  {localized(locale, settings.institution, settings.institutionKo)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted">{dict.members.profile.building}</dt>
                <dd className="max-w-[60%] text-right text-ink-800">
                  {localized(locale, settings.address, settings.addressKo)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted">{dict.members.profile.email}</dt>
                <dd className="max-w-[60%] break-all text-right text-ink-800">
                  {member.email ?? "—"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-muted">{dict.members.profile.officePhone}</dt>
                <dd className="text-right text-ink-800">{member.phone ?? "—"}</dd>
              </div>
              {member.mobile && (
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-muted">{dict.members.profile.mobile}</dt>
                  <dd className="text-right text-ink-800">{member.mobile}</dd>
                </div>
              )}
              {member.officeAddress && (
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-muted">{dict.members.profile.officeAddress}</dt>
                  <dd className="max-w-[60%] text-right text-ink-800">
                    {member.officeAddress}
                  </dd>
                </div>
              )}
              {member.homeAddress && (
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-muted">{dict.members.profile.homeAddress}</dt>
                  <dd className="max-w-[60%] text-right text-ink-800">
                    {member.homeAddress}
                  </dd>
                </div>
              )}
              {member.joinedYear && (
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-muted">{dict.members.profile.joined}</dt>
                  <dd className="text-right text-ink-800">{member.joinedYear}</dd>
                </div>
              )}
            </dl>

            {member.education.length > 0 && (
              <div className="mt-8">
                <h2 className="eyebrow flex items-center gap-2 text-brand-600">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {dict.members.profile.education}
                </h2>
                <ul className="mt-4 space-y-4">
                  {member.education.map((entry) => (
                    <li key={`${entry.degree}-${entry.year}`}>
                      <p className="text-[13px] font-medium text-ink-900">
                        {entry.degree}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {entry.institution} · {entry.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="mt-8 flex items-center justify-center gap-2 bg-ink-900 px-5 py-3 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-800"
              >
                <Mail className="h-4 w-4" />
                {dict.members.profile.contact} · {displayName.split(" ")[0]}
              </a>
            )}
          </aside>
        </div>
      </section>

      {(member.experience.length > 0 ||
        member.patents.length > 0 ||
        member.memberProjects.length > 0) && (
        <section className="border-t border-line bg-surface">
          <div className="wrap space-y-12 py-12 lg:py-16">
            {member.experience.length > 0 && (
              <div>
                <h2 className="eyebrow text-brand-600">
                  {dict.members.profile.experience}
                </h2>
                <div className="mt-4 overflow-x-auto border border-line bg-white">
                  <table className="w-full min-w-[640px] text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-line bg-surface text-[10.5px] uppercase tracking-[0.12em] text-muted">
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.period}
                        </th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.organization}
                        </th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.role}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {member.experience.map((entry, index) => (
                        <tr key={`${entry.organization}-${index}`}>
                          <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-steel-600">
                            {entry.from} – {entry.to}
                          </td>
                          <td className="px-4 py-2.5 text-ink-900">{entry.organization}</td>
                          <td className="px-4 py-2.5 text-muted">{entry.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {member.patents.length > 0 && (
              <div>
                <h2 className="eyebrow text-brand-600">
                  {dict.members.profile.patents}
                </h2>
                <div className="mt-4 overflow-x-auto border border-line bg-white">
                  <table className="w-full min-w-[720px] text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-line bg-surface text-[10.5px] uppercase tracking-[0.12em] text-muted">
                        <th className="w-10 px-4 py-2.5 font-medium">#</th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.patentTitle}
                        </th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.patentType}
                        </th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.patentNumber}
                        </th>
                        <th className="px-4 py-2.5 font-medium">
                          {dict.members.profile.date}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {member.patents.map((patent, index) => (
                        <tr key={`${patent.title}-${index}`}>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-muted">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5 text-ink-900">{patent.title}</td>
                          <td className="px-4 py-2.5 text-muted">{patent.status}</td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-steel-600">
                            {patent.number}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-muted">
                            {patent.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {member.memberProjects.length > 0 && (
              <div>
                <h2 className="eyebrow text-brand-600">
                  {dict.members.profile.projects}
                </h2>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {member.memberProjects.map((project, index) => (
                    <article
                      key={`${project.title}-${index}`}
                      className="border border-line bg-white p-5"
                    >
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-brand-600">
                        {project.period}
                      </p>
                      <h3 className="mt-2 font-display text-[15px] font-semibold leading-snug text-ink-900">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
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
          </div>
        </section>
      )}
    </>
  );
}
