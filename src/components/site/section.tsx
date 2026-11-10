import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "copper",
  className,
}: {
  children: ReactNode;
  tone?: "copper" | "muted" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "eyebrow",
        tone === "copper" && "text-brand-600",
        tone === "muted" && "text-muted",
        tone === "light" && "text-brand-300",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <Eyebrow tone={tone === "dark" ? "light" : "copper"}>{eyebrow}</Eyebrow>
        )}
        <h2
          className={cn(
            "display mt-3 text-[1.9rem] sm:text-[2.35rem]",
            tone === "dark" ? "text-white" : "text-ink-900",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-[14px] leading-relaxed",
              tone === "dark" ? "text-white/60" : "text-muted",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-[12.5px] font-medium",
            tone === "dark"
              ? "text-brand-300 hover:text-brand-200"
              : "text-ink-800 hover:text-brand-700",
          )}
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "brand" | "steel" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10.5px] font-medium uppercase tracking-[0.1em]",
        tone === "default" && "bg-surface text-ink-600",
        tone === "brand" && "bg-brand-50 text-brand-700",
        tone === "steel" && "bg-steel-50 text-steel-600",
        tone === "dark" && "bg-white/10 text-white/70",
      )}
    >
      {children}
    </span>
  );
}
