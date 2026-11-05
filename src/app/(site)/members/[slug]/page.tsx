import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  ScrollText,
  UserRound,
} from "lucide-react";
import { and, eq, like } from "drizzle-orm";
import { db } from "@/db";
import { members, publications } from "@/db/schema";
import { MemberAvatar } from "@/components/site/member-avatar";
import { memberCategoryLabels } from "@/lib/content";
import { Tag } from "@/components/site/section";

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

  // Publications are matched on the author string, which is how the lab records them.
  const authored = await db
    .select()
    .from(publications)
    .where(like(publications.authors, `%${member.name.split(" ").slice(-1)[0]}%`))
    .limit(5);

  const paragraphs = member.bio
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-10">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All members
          </Link>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-surface-2 sm:h-40 sm:w-40">
              <MemberAvatar name={member.name} photoUrl={member.photoUrl} />
            </div>
            <div>
              <Tag tone="brand">{memberCategoryLabels[member.category]}</Tag>
              <h1 className="display mt-3 text-3xl text-ink-900 sm:text-4xl">
                {member.name}
              </h1>
              <p className="mt-2 text-[14px] text-ink-700">{member.designation}</p>
              {member.alumniPosition && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12.5px] text-brand-700">
                  <UserRound className="h-3.5 w-3.5" />
                  {member.alumniPosition}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-ink-900"
                  >
                    <Mail className="h-3.5 w-3.5 text-brand-600" />
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 hover:text-ink-900"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-600" />
                    {member.phone}
                  </a>
                )}
                {member.joinedYear && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
                    Joined {member.joinedYear}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:py-20">
          <div>
            <h2 className="eyebrow text-brand-600">Biography</h2>
            <div className="article-body mt-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <h2 className="eyebrow mt-12 flex items-center gap-2 text-brand-600">
              <BookOpen className="h-3.5 w-3.5" />
              Research interests
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {member.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-700"
                >
                  {interest}
                </span>
              ))}
            </div>

            {authored.length > 0 && (
              <>
                <h2 className="eyebrow mt-12 flex items-center gap-2 text-brand-600">
                  <ScrollText className="h-3.5 w-3.5" />
                  Recent publications
                </h2>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {authored.map((paper) => (
                    <li key={paper.id} className="py-3.5">
                      <p className="text-[13.5px] font-medium leading-snug text-ink-900">
                        {paper.title}
                      </p>
                      <p className="mt-1 text-[12px] text-muted">
                        {paper.venue} · {paper.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="space-y-4">
            {member.education.length > 0 && (
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h2 className="eyebrow flex items-center gap-2 text-muted">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Education
                </h2>
                <ol className="mt-5 space-y-5">
                  {member.education.map((entry, index) => (
                    <li key={`${entry.degree}-${entry.year}`} className="relative pl-5">
                      <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-brand-400" />
                      {index !== member.education.length - 1 && (
                        <span className="absolute left-[3.5px] top-5 h-full w-px bg-line-strong" />
                      )}
                      <p className="text-[13px] font-medium leading-snug text-ink-900">
                        {entry.degree}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted">{entry.institution}</p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-muted">{entry.year}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="eyebrow text-muted">Profiles</h2>
              <div className="mt-4 space-y-2.5 text-[13px]">
                {member.scholarUrl && (
                  <a
                    href={member.scholarUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-ink-700 hover:text-brand-700"
                  >
                    <ScrollText className="h-4 w-4 text-brand-600" />
                    Google Scholar
                  </a>
                )}
                {member.orcidUrl && (
                  <a
                    href={member.orcidUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-ink-700 hover:text-brand-700"
                  >
                    <UserRound className="h-4 w-4 text-brand-600" />
                    ORCID
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-ink-700 hover:text-brand-700"
                  >
                    <Globe className="h-4 w-4 text-brand-600" />
                    LinkedIn
                  </a>
                )}
                {member.websiteUrl && (
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 text-ink-700 hover:text-brand-700"
                  >
                    <BookOpen className="h-4 w-4 text-brand-600" />
                    Personal website
                  </a>
                )}
                {!member.scholarUrl &&
                  !member.orcidUrl &&
                  !member.linkedinUrl &&
                  !member.websiteUrl && (
                    <p className="text-[12.5px] text-muted">
                      No external profiles listed. Write to {member.email ?? "the lab"} instead.
                    </p>
                  )}
              </div>
            </div>

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-ink-950 px-5 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-800"
              >
                <Mail className="h-4 w-4" />
                Contact {member.name.split(" ")[0]}
              </a>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
