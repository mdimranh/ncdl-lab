"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Submit button that shows a spinner and disables itself while its form's
 * server action is running. Must be rendered inside the <form>.
 */
export function SubmitButton({
  label,
  pendingLabel,
  icon,
  className,
  spinnerClassName,
}: {
  label: ReactNode;
  pendingLabel?: ReactNode;
  icon?: ReactNode;
  className?: string;
  spinnerClassName?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        className,
        pending && "cursor-progress opacity-70",
      )}
    >
      {pending ? (
        <Loader2 className={cn("h-3.5 w-3.5 shrink-0 animate-spin", spinnerClassName)} />
      ) : (
        icon
      )}
      {pending ? (pendingLabel ?? label) : label}
    </button>
  );
}
