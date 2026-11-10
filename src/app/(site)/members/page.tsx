import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Globe, Mail, Phone } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { collaborations, members } from "@/db/schema";
import { MemberAvatar } from "@/components/site/member-avatar";
import { TabGroup } from "@/components/site/tab-group";
import { Eyebrow, Tag } from "@/components/site/section";
import { getDictionary, localized, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

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
            {person.phone && (
              <a
                href={`tel:${person.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 hover:text-steel-600"
              >
                <Phone className="h-3.5 w-3.5 text-steel-500" />
                {person.phone}
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

export default async function MembersPage() {
  const [locale, people, partners] = await Promise.all([
    getLocale(),
    db
      .select()
      .from(members)
      .where(eq(members.published, true))
      .orderBy(asc(members.displayOrder), asc(members.name)),
    db.select().from(collaborations).orderBy(asc(collaborations.displayOrder)),
  ]);
  const dict = getDictionary(locale);

  const professors = people.filter((person) => person.category === "professor");
  const students = people.filter(
    (person) => person.category === "phd" || person.category === "masters",
  );
  const alumni = people.filter((person) => person.category === "alumni");

  const cardLabels = { contact: dict.common.contact, seeMore: dict.common.seeMore };

  const tabItems = [
    {
      key: "professor",
      label: dict.members.tabs.professor,
      count: professors.length,
      content: <MemberCards people={professors} labels={cardLabels} locale={locale} />,
    },
    {
      key: "phd-masters",
      label: dict.members.tabs.phdMasters,
      count: students.length,
      content: <MemberCards people={students} labels={cardLabels} locale={locale} />,
    },
    {
      key: "alumni",
      label: dict.members.tabs.alumni,
      count: alumni.length,
      content: <MemberCards people={alumni} labels={cardLabels} locale={locale} />,
    },
    {
      key: "collaborations",
      label: dict.members.tabs.collaborations,
      count: partners.length,
      content: (
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
      ),
    },
  ];

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
          <TabGroup items={tabItems} />
        </div>
      </section>
    </>
  );
}
