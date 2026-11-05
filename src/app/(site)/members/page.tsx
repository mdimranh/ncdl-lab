import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Globe, Mail, MapPin } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { collaborations, members } from "@/db/schema";
import { MemberAvatar } from "@/components/site/member-avatar";
import { Eyebrow, SectionHeading, Tag } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Faculty, doctoral researchers, master's students and alumni of the Neuromorphic Chip Design Laboratory.",
};

const groups = [
  {
    key: "professor" as const,
    title: "Faculty",
    description: "Principal investigators who lead the laboratory's research programmes.",
  },
  {
    key: "phd" as const,
    title: "PhD Researchers",
    description: "Doctoral candidates carrying out the lab's core silicon and systems work.",
  },
  {
    key: "masters" as const,
    title: "Master's Students",
    description: "Thesis students contributing to active projects across all four research areas.",
  },
  {
    key: "alumni" as const,
    title: "Alumni",
    description: "Former members who now lead research and design teams around the world.",
  },
];

export default async function MembersPage() {
  const [people, partners] = await Promise.all([
    db
      .select()
      .from(members)
      .where(eq(members.published, true))
      .orderBy(asc(members.displayOrder), asc(members.name)),
    db.select().from(collaborations).orderBy(asc(collaborations.displayOrder)),
  ]);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 lg:py-20">
          <Eyebrow>People</Eyebrow>
          <h1 className="display mt-4 max-w-3xl text-4xl text-ink-900 sm:text-5xl">
            The people behind the silicon.
          </h1>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            Three faculty members, four doctoral researchers and five master&apos;s
            students work side by side on the same benches. Alumni carry the
            lab&apos;s methods into universities and companies worldwide.
          </p>

          <nav className="mt-9 flex flex-wrap gap-2" aria-label="Member groups">
            {groups.map((group) => {
              const total = people.filter((person) => person.category === group.key).length;
              return (
                <a
                  key={group.key}
                  href={`#${group.key}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {group.title}
                  <span className="font-mono text-[10.5px] text-muted">{total}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      {groups.map((group, groupIndex) => {
        const items = people.filter((person) => person.category === group.key);
        if (items.length === 0) return null;

        return (
          <section
            key={group.key}
            id={group.key}
            className={groupIndex % 2 === 1 ? "border-y border-line bg-surface" : "bg-white"}
          >
            <div className="wrap py-16 lg:py-20">
              <SectionHeading
                eyebrow={`${String(groupIndex + 1).padStart(2, "0")} · ${items.length} people`}
                title={group.title}
                description={group.description}
              />

              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((person, index) => (
                  <Link
                    key={person.id}
                    href={`/members/${person.slug}`}
                    className="group flex gap-4 rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_20px_50px_-34px_rgba(12,27,48,0.4)]"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                      <MemberAvatar
                        name={person.name}
                        photoUrl={person.photoUrl}
                        index={index}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14.5px] font-semibold text-ink-900">
                        {person.name}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted">
                        {person.designation}
                      </p>
                      {person.alumniPosition && (
                        <p className="mt-1.5 line-clamp-1 text-[11.5px] text-brand-700">
                          {person.alumniPosition}
                        </p>
                      )}
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {person.interests.slice(0, 2).map((interest) => (
                          <span
                            key={interest}
                            className="rounded-md bg-surface px-1.5 py-0.5 text-[10.5px] text-ink-600"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-line-strong transition-colors group-hover:text-brand-600" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section id="collaborations" className="bg-white">
        <div className="wrap py-16 lg:py-20">
          <SectionHeading
            eyebrow="Collaborations"
            title="We do not work alone."
            description="Shared tape-outs, co-supervised students and joint measurement campaigns with partners across four continents."
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="rounded-2xl border border-line bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="display text-lg text-ink-900">{partner.institution}</p>
                  <Tag>{partner.country}</Tag>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  {partner.description}
                </p>
                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-700 hover:text-brand-800"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Visit institution
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-7 sm:flex-row sm:items-center">
            <div>
              <p className="display text-lg text-ink-900">Interested in collaborating?</p>
              <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted">
                We welcome joint proposals, student exchanges and shared shuttle
                runs. Tell us about your group and the problem you want to solve.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-800"
            >
              <Mail className="h-4 w-4" />
              Start a conversation
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-[11.5px] text-muted">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            Students supervised jointly with partner institutions are listed with
            their current affiliation.
          </p>
        </div>
      </section>
    </>
  );
}
