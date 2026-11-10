"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabItem = {
  key: string;
  label: string;
  count: number;
  content: ReactNode;
};

export function TabGroup({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.key ?? "");

  if (items.length === 0) return null;
  const current = items.find((item) => item.key === active) ?? items[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sections"
        className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line"
      >
        {items.map((item) => {
          const selected = item.key === current.key;
          return (
            <button
              key={item.key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(item.key)}
              className={cn(
                "-mb-px border-b-2 pb-3 text-[13.5px] font-medium transition-colors",
                selected
                  ? "border-brand-500 text-ink-900"
                  : "border-transparent text-muted hover:text-ink-800",
              )}
            >
              {item.label}
              <span className="ml-2 font-mono text-[10.5px] text-muted">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="pt-8">
        {current.content}
      </div>
    </div>
  );
}
