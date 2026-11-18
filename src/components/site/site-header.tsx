"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";
import { setLocaleAction } from "@/lib/locale-actions";
import { localeLabels, type Dictionary, type Locale } from "@/lib/i18n";
import { defaultMemberGroup, isMemberGroup, memberGroups } from "@/lib/site-config";

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
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";
  const [open, setOpen] = useState(false);
  const [membersMenuOpen, setMembersMenuOpen] = useState(false);
  const [mobileMembersOpen, setMobileMembersOpen] = useState(false);

  useEffect(() => {
    setMembersMenuOpen(false);
    setMobileMembersOpen(false);
    setOpen(false);
  }, [pathname, search]);

  const navItems = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.members, href: "/members" },
    { label: dict.nav.research, href: "/research" },
    { label: dict.nav.publications, href: "/publications" },
    { label: dict.nav.news, href: "/news" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  const memberGroupItems = memberGroups.map((key) => ({
    key,
    label: dict.members.groups[key],
  }));

  // Only the directory page has an active group; profile pages are not part of one.
  const onMembersList = pathname === "/members";
  const groupParam = searchParams?.get("group") ?? null;
  const activeGroup = onMembersList
    ? isMemberGroup(groupParam)
      ? groupParam
      : defaultMemberGroup
    : null;

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
          {navItems.map((item) =>
            item.href === "/members" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setMembersMenuOpen(true)}
                onMouseLeave={() => setMembersMenuOpen(false)}
              >
                <Link
                  href={item.href}
                  onFocus={() => setMembersMenuOpen(true)}
                  aria-haspopup="true"
                  aria-expanded={membersMenuOpen}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 text-[13.5px] font-medium transition-colors",
                    isActive(item.href)
                      ? "text-white"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      membersMenuOpen && "rotate-180",
                    )}
                  />
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-brand-400" />
                  )}
                </Link>

                <div
                  className={cn(
                    "absolute left-0 top-full pt-2 transition-all duration-150",
                    membersMenuOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0",
                  )}
                >
                  <div
                    role="menu"
                    aria-label={item.label}
                    className="w-56 border border-white/10 bg-ink-950 p-1.5 shadow-2xl"
                  >
                    {memberGroupItems.map((group) => {
                      const selected = activeGroup === group.key;
                      return (
                        <Link
                          key={group.key}
                          href={`/members?group=${group.key}`}
                          role="menuitem"
                          aria-current={selected ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 text-[13px] transition-colors",
                            selected
                              ? "bg-white/10 text-white"
                              : "text-white/65 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          {group.label}
                          {selected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
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
            ),
          )}
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
            {navItems.map((item) =>
              item.href === "/members" ? (
                <div key={item.href} className="border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex-1 px-1 py-3 text-sm font-medium",
                        isActive(item.href) ? "text-brand-300" : "text-white/70",
                      )}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileMembersOpen((value) => !value)}
                      aria-expanded={mobileMembersOpen}
                      aria-label={dict.nav.members}
                      className="grid h-9 w-9 place-items-center text-white/60"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          mobileMembersOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  {mobileMembersOpen && (
                    <div className="pb-2">
                      {memberGroupItems.map((group) => {
                        const selected = activeGroup === group.key;
                        return (
                          <Link
                            key={group.key}
                            href={`/members?group=${group.key}`}
                            onClick={() => setOpen(false)}
                            aria-current={selected ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between px-4 py-2 text-[13px]",
                              selected ? "text-brand-300" : "text-white/60",
                            )}
                          >
                            {group.label}
                            {selected && (
                              <span className="h-1 w-1 rounded-full bg-brand-400" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
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
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
