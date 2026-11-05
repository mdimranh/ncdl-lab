"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { navItems } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader({ shortName }: { shortName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-line bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          : "border-transparent bg-white/75 backdrop-blur-md",
      )}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-950 text-brand-300 transition-colors group-hover:text-brand-200">
            <LogoMark />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] font-semibold tracking-tight text-ink-900">
              {shortName}
            </span>
            <span className="mt-1 hidden text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted sm:block">
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
                "relative rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                isActive(item.href)
                  ? "text-ink-900"
                  : "text-muted hover:bg-surface hover:text-ink-900",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-brand-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-800 sm:inline-flex"
          >
            Get in touch
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-700 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="wrap flex flex-col py-3" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-surface text-ink-900"
                    : "text-muted hover:bg-surface",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-between rounded-lg bg-ink-950 px-4 py-3 text-sm font-medium text-white"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
