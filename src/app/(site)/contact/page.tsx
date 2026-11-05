import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  Compass,
  Mail,
  MapPin,
  Phone,
  Printer,
} from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { positions } from "@/db/schema";
import { getSettings, positionTypeLabels } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Eyebrow, Tag } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Address, phone, email, fax and directions for the Neuromorphic Chip Design Laboratory.",
};

export default async function ContactPage() {
  const [settings, openPositions] = await Promise.all([
    getSettings(),
    db
      .select()
      .from(positions)
      .where(eq(positions.isOpen, true))
      .orderBy(asc(positions.displayOrder)),
  ]);

  const mapSrc = settings.mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&z=14&output=embed`
    : null;

  const details = [
    {
      icon: MapPin,
      label: "Address",
      value: settings.address,
      hint: "Visitors are welcome during office hours.",
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings.phone,
      href: settings.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : undefined,
      hint: "Lab office, ext. 402",
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : undefined,
      hint: "We reply within two working days.",
    },
    {
      icon: Printer,
      label: "Fax",
      value: settings.fax || "—",
      hint: "For formal correspondence.",
    },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 lg:py-20">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="display mt-4 max-w-3xl text-4xl text-ink-900 sm:text-5xl">
            Come and see the benches.
          </h1>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            Whether you are a prospective student, a collaborator or a journalist,
            the fastest way to reach us is email. For visits, write ahead so we can
            arrange access to the measurement laboratory.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-14 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div
                  key={detail.label}
                  className="flex flex-col rounded-2xl border border-line bg-white p-6"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
                  </span>
                  <p className="eyebrow mt-5 text-muted">{detail.label}</p>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="mt-2 text-[13.5px] font-medium leading-relaxed text-ink-900 hover:text-brand-700"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-ink-900">
                      {detail.value}
                    </p>
                  )}
                  <p className="mt-auto pt-4 text-[11.5px] leading-relaxed text-muted">
                    {detail.hint}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title="Laboratory location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[380px] w-full border-0 lg:h-full lg:min-h-[420px]"
                />
              ) : (
                <div className="grid h-[380px] place-items-center text-sm text-muted">
                  Map location not configured.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="eyebrow flex items-center gap-2 text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  Office hours
                </h2>
                <p className="mt-3 text-[13.5px] text-ink-900">{settings.officeHours}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">
                  The measurement laboratory is accessible by appointment only.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="eyebrow flex items-center gap-2 text-muted">
                  <Compass className="h-3.5 w-3.5" />
                  Getting here
                </h2>
                <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-muted">
                  <li>Enter through the north gate of the academic campus.</li>
                  <li>Academic Building B is the second block on your right.</li>
                  <li>Take the lift to the fourth floor; the lab is room 402.</li>
                </ul>
              </div>

              {settings.email && (
                <a
                  href={`mailto:${settings.email}?subject=Lab%20visit`}
                  className="flex items-center justify-between rounded-2xl bg-ink-950 px-6 py-5 text-white transition-colors hover:bg-ink-800"
                >
                  <span>
                    <span className="block text-[13px] font-medium">Arrange a visit</span>
                    <span className="mt-0.5 block text-[11.5px] text-white/50">
                      Email the lab coordinator
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-brand-300" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="wrap py-14 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <Eyebrow>Applications</Eyebrow>
              <h2 className="display mt-3 text-2xl text-ink-900 sm:text-3xl">
                Open positions
              </h2>
            </div>
            <Link
              href="/research"
              className="text-[12.5px] font-medium text-ink-700 hover:text-brand-700"
            >
              Explore research areas →
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {openPositions.map((position) => (
              <li
                key={position.id}
                className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="brand">{positionTypeLabels[position.type]}</Tag>
                    {position.deadline && (
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                        Deadline {formatDate(position.deadline)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[14px] font-medium text-ink-900">
                    {position.title}
                  </p>
                  <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted">
                    {position.description}
                  </p>
                </div>
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}?subject=${encodeURIComponent(position.title)}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[12px] font-medium text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    Apply
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </li>
            ))}
            {openPositions.length === 0 && (
              <li className="py-6 text-sm text-muted">
                No positions are open right now. Speculative enquiries are welcome.
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
