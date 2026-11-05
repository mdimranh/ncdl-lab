import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  backHref,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  backHref?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Link>
        )}
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-700">
            {eyebrow}
          </p>
        )}
        <h1 className="display mt-1.5 text-2xl text-ink-900">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-ink-950 px-4 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-800"
        >
          <Plus className="h-3.5 w-3.5" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-line bg-white", className)}>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center gap-1 text-[11.5px] font-medium text-ink-800">
        {label}
        {required && <span className="text-brand-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-relaxed text-muted">{hint}</span>}
    </label>
  );
}

const control =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink-900 placeholder:text-muted/60 focus:border-brand-400 focus:outline-none";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cn(control, className)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(control, "min-h-[96px] leading-relaxed", className)}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select {...props} className={cn(control, "pr-8", className)} />;
}

export function Checkbox({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & ComponentProps<"input">) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5">
      <input
        type="checkbox"
        {...props}
        className="mt-0.5 h-3.5 w-3.5 rounded border-line-strong text-brand-600 focus:ring-brand-400"
      />
      <span>
        <span className="block text-[12.5px] font-medium text-ink-800">{label}</span>
        {hint && <span className="mt-0.5 block text-[11px] text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function FormActions({
  submitLabel = "Save changes",
  cancelHref,
  children,
}: {
  submitLabel?: string;
  cancelHref?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
      <button
        type="submit"
        className="rounded-lg bg-ink-950 px-5 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-800"
      >
        {submitLabel}
      </button>
      {cancelHref && (
        <Link
          href={cancelHref}
          className="rounded-lg border border-line bg-white px-4 py-2.5 text-[12.5px] font-medium text-ink-700 transition-colors hover:text-ink-900"
        >
          Cancel
        </Link>
      )}
      {children}
    </div>
  );
}

export function Notice({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-[12.5px]",
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700",
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
      <p className="text-[13.5px] font-medium text-ink-900">{title}</p>
      {hint && <p className="mt-1.5 text-[12px] text-muted">{hint}</p>}
    </div>
  );
}
