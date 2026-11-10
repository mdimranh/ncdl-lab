import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Clock, Compass, Mail, MapPin, Phone, Printer } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { positions } from "@/db/schema";
import { getSettings } from "@/lib/content";
import { getDictionary, localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { formatDate } from "@/lib/utils";
import { Eyebrow, Tag } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Address, phone, email, fax and directions for the Neuromorphic Chip Design Laboratory.",
};

export default async function ContactPage() {
  const [settings, locale, openPositions] = await Promise.all([
    getSettings(),
    getLocale(),
    db
      .select()
      .from(positions)
      .where(eq(positions.isOpen, true))
      .orderBy(asc(positions.displayOrder)),
  ]);
  const dict = getDictionary(locale);

  const mapSrc = settings.mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&z=15&output=embed`
    : null;

  const details = [
    {
      icon: MapPin,
      label: dict.contact.address,
      value: localized(locale, settings.address, settings.addressKo),
      href: undefined,
    },
    {
      icon: Phone,
      label: dict.contact.phone,
      value: settings.phone,
      href: settings.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : undefined,
    },
    {
      icon: Mail,
      label: dict.contact.email,
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : undefined,
    },
    {
      icon: Printer,
      label: dict.contact.fax,
      value: settings.fax || "—",
      href: undefined,
    },
  ];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-12 lg:py-16">
          <Eyebrow>{dict.nav.contact}</Eyebrow>
          <h1 className="display mt-3 text-4xl text-ink-900 sm:text-5xl">
            {dict.contact.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
            {dict.contact.intro}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="wrap py-10 lg:py-14">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="bg-white p-6">
                  <span className="grid h-9 w-9 place-items-center bg-surface text-steel-600">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <p className="eyebrow mt-4 text-muted">{detail.label}</p>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="mt-1.5 block text-[13px] font-medium leading-relaxed text-ink-900 hover:text-steel-600"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-ink-900">
                      {detail.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="overflow-hidden border border-line bg-surface">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title={dict.contact.map}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[360px] w-full border-0 lg:h-full lg:min-h-[400px]"
                />
              ) : (
                <div className="grid h-[360px] place-items-center text-[13px] text-muted">
                  {dict.contact.mapMissing}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="border border-line bg-white p-6">
                <p className="eyebrow flex items-center gap-2 text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {dict.contact.hours}
                </p>
                <p className="mt-2 text-[13px] text-ink-900">
                  {localized(locale, settings.officeHours, settings.officeHoursKo)}
                </p>
              </div>

              <div className="border border-line bg-white p-6">
                <p className="eyebrow flex items-center gap-2 text-muted">
                  <Compass className="h-3.5 w-3.5" />
                  {dict.contact.gettingHere}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  {localized(locale, settings.address, settings.addressKo)}
                </p>
              </div>

              {settings.email && (
                <a
                  href={`mailto:${settings.email}?subject=Lab%20visit`}
                  className="flex items-center justify-between bg-ink-900 px-6 py-4 text-white transition-colors hover:bg-ink-800"
                >
                  <span className="text-[12.5px] font-medium">{dict.contact.visit}</span>
                  <ArrowUpRight className="h-4 w-4 text-brand-300" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="wrap py-10 lg:py-14">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
            <Eyebrow>{dict.contact.applications}</Eyebrow>
            <Link href="/research" className="text-[12px] font-medium text-steel-600 hover:text-steel-700">
              {dict.nav.research} →
            </Link>
          </div>

          <ul className="divide-y divide-line">
            {openPositions.map((position) => (
              <li
                key={position.id}
                className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="steel">{dict.home.positionsKo[position.type]}</Tag>
                    {position.deadline && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {formatDate(position.deadline)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[14px] font-medium text-ink-900">
                    {localized(locale, position.title, position.titleKo)}
                  </p>
                  <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted">
                    {localized(locale, position.description, position.descriptionKo)}
                  </p>
                </div>
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}?subject=${encodeURIComponent(position.title)}`}
                    className="inline-flex shrink-0 items-center gap-1.5 border border-line bg-white px-4 py-2 text-[11.5px] font-medium text-ink-800 transition-colors hover:border-steel-300 hover:text-steel-600"
                  >
                    {dict.contact.apply}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </li>
            ))}
            {openPositions.length === 0 && (
              <li className="py-6 text-[13px] text-muted">{dict.contact.noPositions}</li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
