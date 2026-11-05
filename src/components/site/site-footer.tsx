import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "./logo-mark";
import type { SiteSettings } from "@/db/schema";
import { navItems } from "@/lib/site-config";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-white/70">
      <div className="wrap py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-brand-300">
                <LogoMark />
              </span>
              <div>
                <p className="font-display text-base font-semibold tracking-tight">
                  {settings.shortName}
                </p>
                <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">
                  {settings.institution || "Electrical & Electronic Engineering"}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/55">
              {settings.tagline}
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-300/80">
              {settings.motto}
            </p>
          </div>

          <div>
            <p className="eyebrow text-white/40">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/40">Research</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <Link href="/research/neuromorphic-circuit-design" className="hover:text-white">
                  Neuromorphic circuits
                </Link>
              </li>
              <li>
                <Link href="/research/rf-analog-circuit-design" className="hover:text-white">
                  RF & analog design
                </Link>
              </li>
              <li>
                <Link href="/research/fpga-circuit-and-image-analysis" className="hover:text-white">
                  FPGA & vision
                </Link>
              </li>
              <li>
                <Link href="/research/robotics-control-circuit-design" className="hover:text-white">
                  Robotics control
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/40">Find us</p>
            <ul className="mt-4 space-y-3 text-[13px]">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span className="leading-relaxed">{settings.address || "Campus address"}</span>
              </li>
              {settings.phone && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.labName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono uppercase tracking-[0.16em]">
              Established {settings.foundingYear}
            </span>
            <Link href="/login" className="hover:text-white/70">
              Admin login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
