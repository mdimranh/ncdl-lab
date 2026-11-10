"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";
import { setLocaleAction } from "@/lib/locale-actions";
import { localeLabels, type Dictionary, type Locale } from "@/lib/i18n";

export function SiteHeader({
  shortName,
  locale,
  dict,
}: {
  shortName: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.members, href: "/members" },
    { label: dict.nav.research, href: "/research" },
    { label: dict.nav.publications, href: "/publications" },
    { label: dict.nav.news, href: "/news" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-900 text-white">
      <div className="wrap flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-white/10 text-brand-300">
            <LogoMark />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[19px] font-semibold tracking-tight text-white">
              {shortName}
            </span>
            <span className="mt-1.5 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-white/45 sm:block">
              Neuromorphic Chip Design Lab
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-3 py-2 text-[13.5px] font-medium transition-colors",
                isActive(item.href)
                  ? "text-white"
                  : "text-white/60 hover:text-white",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-brand-400" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-l border-white/15 pl-3 font-mono text-[10.5px] uppercase tracking-[0.12em]">
            {(["en", "ko"] as const).map((option) => (
              <form key={option} action={setLocaleAction}>
                <input type="hidden" name="locale" value={option} />
                <button
                  type="submit"
                  aria-current={locale === option ? "true" : undefined}
                  className={cn(
                    "px-1.5 py-1 transition-colors",
                    locale === option
                      ? "text-brand-300"
                      : "text-white/45 hover:text-white",
                  )}
                >
                  {localeLabels[option]}
                </button>
              </form>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center border border-white/20 text-white/80 md:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink-900 md:hidden">
          <nav className="wrap flex flex-col py-2" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-white/5 px-1 py-3 text-sm font-medium last:border-0",
                  isActive(item.href) ? "text-brand-300" : "text-white/70",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
