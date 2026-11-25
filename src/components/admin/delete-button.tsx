"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/admin/submit-button";

export function DeleteButton({
  action,
  id,
  label,
  compact = false,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  label: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const titleId = `delete-confirm-${id}`;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        aria-haspopup="dialog"
        aria-label={`Delete ${label}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {!compact && "Delete"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/45 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-sm rounded-xl border border-line bg-white p-5 text-left shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                <Trash2 className="h-4 w-4" />
              </span>
              <div>
                <h2 id={titleId} className="text-[13.5px] font-semibold text-ink-900">
                  Delete “{label}”?
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  This cannot be undone.
                </p>
              </div>
            </div>

            <form action={action} className="mt-5 flex justify-end gap-2">
              <input type="hidden" name="id" value={id} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                autoFocus
                className="rounded-lg border border-line bg-white px-3.5 py-2 text-[12px] font-medium text-ink-700 transition-colors hover:text-ink-900"
              >
                Cancel
              </button>
              <SubmitButton
                label="Delete"
                pendingLabel="Deleting…"
                className="rounded-lg bg-red-600 px-3.5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-red-700"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
