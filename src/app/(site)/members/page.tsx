import { MemberAvatar } from "@/components/site/member-avatar";
import { Eyebrow, Tag } from "@/components/site/section";
import { db } from "@/db";
import { collaborations, members } from "@/db/schema";
import {
  getDictionary,
  localized,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { defaultMemberGroup, isMemberGroup } from "@/lib/site-config";
import { asc, eq } from "drizzle-orm";
import { ArrowUpRight, Globe, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Faculty, doctoral researchers, master's students, alumni and collaborations of the Neuromorphic Chip Design Laboratory.",
};

function MemberCards({
  people,
  labels,
  locale,
}: {
  people: (typeof members.$inferSelect)[];
  labels: { contact: string; seeMore: string };
  locale: Locale;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person, index) => (
        <article
          key={person.id}
          className="flex flex-col border border-line bg-white p-5 transition-colors hover:border-steel-300"
        >
          <div className="flex gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden bg-surface-2">
              <MemberAvatar name={person.name} photoUrl={person.photoUrl} index={index} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-[16px] font-semibold leading-snug text-ink-900">
                {localized(locale, person.name, person.nameKo)}
              </h3>
              <p className="mt-1 text-[12px] leading-snug text-muted">
                {localized(locale, person.designation, person.designationKo)}
              </p>
              {person.alumniPosition && (
                <p className="mt-1.5 text-[11.5px] text-steel-600">
                  {localized(locale, person.alumniPosition, person.alumniPositionKo)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex-1 space-y-1.5 text-[12px] text-muted">
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="flex items-center gap-1.5 hover:text-steel-600"
              >
                <Mail className="h-3.5 w-3.5 text-steel-500" />
                <span className="truncate">{person.email}</span>
              </a>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <a
              href={person.email ? `mailto:${person.email}` : "/contact"}
              className="text-[11.5px] font-medium text-steel-600 hover:text-steel-700"
            >
              {labels.contact}
            </a>
            <Link
              href={`/members/${person.slug}`}
              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-brand-700 hover:text-brand-800"
            >
              {labels.seeMore}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function Collaborations({
  partners,
  dict,
}: {
  partners: (typeof collaborations.$inferSelect)[];
  dict: Dictionary;
}) {
  if (partners.length === 0) {
    return (
      <p className="border border-dashed border-line-strong px-6 py-14 text-center text-[13px] text-muted">
        {dict.members.collaborationsEmpty}
      </p>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <article key={partner.id} className="border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-[16px] font-semibold leading-snug text-ink-900">
                {partner.institution}
              </h3>
              {partner.country && <Tag tone="steel">{partner.country}</Tag>}
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              {partner.description}
            </p>
            {partner.websiteUrl && (
              <a
                href={partner.websiteUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-steel-600 hover:text-steel-700"
              >
                <Globe className="h-3.5 w-3.5" />
                {dict.common.seeMore}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-line bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-[16px] text-ink-900">
            {dict.members.collaborateTitle}
          </p>
          <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-muted">
            {dict.members.collaborateBody}
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-2 bg-ink-900 px-5 py-2.5 text-[12.5px] font-medium text-white hover:bg-ink-800"
        >
          <Mail className="h-4 w-4" />
          {dict.common.contact}
        </Link>
      </div>
    </div>
  );
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const [locale, params, people, partners] = await Promise.all([
    getLocale(),
    searchParams,
    db
      .select()
      .from(members)
      .where(eq(members.published, true))
      .orderBy(asc(members.displayOrder), asc(members.name)),
    db.select().from(collaborations).orderBy(asc(collaborations.displayOrder)),
  ]);
  const dict = getDictionary(locale);

  const group = isMemberGroup(params.group) ? params.group : defaultMemberGroup;

  const groupMembers = {
    professor: people.filter((person) => person.category === "professor"),
    phd: people.filter((person) => person.category === "phd"),
    masters: people.filter((person) => person.category === "masters"),
    alumni: people.filter((person) => person.category === "alumni"),
  };

  const count = group === "collaborations" ? partners.length : groupMembers[group].length;
  const cardLabels = { contact: dict.common.contact, seeMore: dict.common.seeMore };

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.nav.members}</Eyebrow>
          <h1 className="display mt-3 text-4xl text-ink-900 sm:text-5xl">
            {dict.members.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
            {dict.members.intro}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-10 lg:py-14">
          <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="display text-[1.65rem] text-ink-900">
                  {dict.members.groups[group]}
                </h2>
                <span className="border border-line px-2 py-0.5 font-mono text-[10.5px] text-muted">
                  {count}
                </span>
              </div>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                {dict.members.groupNotes[group]}
              </p>
            </div>
            <span className="hidden h-[2px] w-11 shrink-0 bg-brand-500 sm:block" />
          </div>

          <div className="pt-8">
            {group === "collaborations" ? (
              <Collaborations partners={partners} dict={dict} />
            ) : groupMembers[group].length === 0 ? (
              <p className="border border-dashed border-line-strong px-6 py-14 text-center text-[13px] text-muted">
                {dict.members.empty}
              </p>
            ) : (
              <MemberCards
                people={groupMembers[group]}
                labels={cardLabels}
                locale={locale}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
