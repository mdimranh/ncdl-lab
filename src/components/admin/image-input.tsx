"use client";

import { useState } from "react";
import { Input } from "@/components/admin/ui";
import { imageFileProblem } from "@/lib/image-rules";

/** File picker that blocks oversized or non-image files before they are posted. */
export function ImageInput({ name }: { name: string }) {
  const [problem, setProblem] = useState<string | null>(null);

  return (
    <span className="block">
      <Input
        type="file"
        name={name}
        accept="image/*"
        className="py-1.5 text-[11.5px]"
        aria-invalid={problem ? true : undefined}
        onChange={(event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          const next = file ? imageFileProblem(file) : null;
          setProblem(next);
          input.setCustomValidity(next ?? "");
          if (next) input.reportValidity();
        }}
      />
      {problem && (
        <span className="mt-1 block text-[11px] leading-relaxed text-red-600">{problem}</span>
      )}
    </span>
  );
}
