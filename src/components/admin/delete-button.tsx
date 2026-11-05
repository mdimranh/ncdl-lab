"use client";

import { Trash2 } from "lucide-react";

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
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        aria-label={`Delete ${label}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {!compact && "Delete"}
      </button>
    </form>
  );
}
