import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-2 text-brand-600", className)}>
      <span className="h-1 w-1 rounded-full bg-current" />
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
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  action?: { label: string; href: string };
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between",
        tone === "dark" ? "border-white/10" : "border-line",
        className,
      )}
    >
      <div className="max-w-2xl">
        <Eyebrow className={tone === "dark" ? "text-brand-300" : undefined}>
          {eyebrow}
        </Eyebrow>
        <h2
          className={cn(
            "display mt-3 text-3xl sm:text-4xl",
            tone === "dark" ? "text-white" : "text-ink-900",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-[14.5px] leading-relaxed",
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
            "group inline-flex shrink-0 items-center gap-2 text-[13px] font-medium transition-colors",
            tone === "dark"
              ? "text-brand-300 hover:text-white"
              : "text-ink-700 hover:text-brand-700",
          )}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "brand" | "dark" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]",
        tone === "default" && "bg-surface-2 text-muted",
        tone === "brand" && "bg-brand-50 text-brand-700",
        tone === "dark" && "bg-white/10 text-white/70",
        tone === "success" && "bg-emerald-50 text-emerald-700",
      )}
    >
      {children}
    </span>
  );
}
