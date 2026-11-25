import type { SiteSettings } from "@/db/schema";
import { localized, type Dictionary, type Locale } from "@/lib/i18n";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "./logo-mark";

export function SiteFooter({
  settings,
  locale,
  dict,
}: {
  settings: SiteSettings;
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  const researchLinks = [
    { label: "Neuromorphic Circuit Design", href: "/research/neuromorphic-circuit-design" },
    { label: "RF & Analog Circuit Design", href: "/research/rf-analog-circuit-design" },
    { label: "FPGA Circuit & Image Analysis", href: "/research/fpga-circuit-and-image-analysis" },
    { label: "Robotics & Control Circuit Design", href: "/research/robotics-control-circuit-design" },
  ];

  return (
    <footer className="bg-ink-900 text-white/70">
      <div className="wrap py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-white/10 text-brand-300">
                <LogoMark />
              </span>
              <div>
                <p className="font-display text-base font-semibold tracking-tight">
                  {settings.shortName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {localized(locale, settings.institution, settings.institutionKo) ||
                    "Electrical & Electronic Engineering"}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/55">
              {localized(locale, settings.tagline, settings.taglineKo)}
            </p>
          </div>

          <div>
            <p className="eyebrow text-white/40">{dict.footer.explore}</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {[
                { label: dict.nav.home, href: "/" },
                { label: dict.nav.members, href: "/members" },
                { label: dict.nav.research, href: "/research" },
                { label: dict.nav.publications, href: "/publications" },
                { label: dict.nav.news, href: "/news" },
                { label: dict.nav.contact, href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/40">{dict.footer.research}</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {researchLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/40">{dict.footer.reach}</p>
            <ul className="mt-4 space-y-3 text-[13px]">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="leading-relaxed">
                  {localized(locale, settings.address, settings.addressKo) || "Campus address"}
                </span>
              </li>
              {/* {settings.phone && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="hover:text-white"
                  >
                    {settings.phone}
                  </a>
                </li>
              )} */}
              {settings.email && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
              {/* {settings.fax && (
                <li className="flex gap-2.5">
                  <Printer className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span>{settings.fax}</span>
                </li>
              )} */}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {localized(locale, settings.labName, settings.labNameKo)}. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono uppercase tracking-[0.14em]">
              {dict.footer.developedBy}
            </span>
            <Link href="/login" className="hover:text-white/70">
              {dict.footer.admin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
