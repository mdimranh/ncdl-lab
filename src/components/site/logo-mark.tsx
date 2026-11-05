import { cn } from "@/lib/utils";

/** Compact chip glyph used across the header, footer and admin chrome. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
      fill="none"
    >
      <rect
        x="6.5"
        y="6.5"
        width="19"
        height="19"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect x="11.5" y="11.5" width="9" height="9" rx="2" fill="currentColor" opacity="0.9" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M13 3v3.5M19 3v3.5M13 25.5V29M19 25.5V29" />
        <path d="M3 13h3.5M3 19h3.5M25.5 13H29M25.5 19H29" />
      </g>
    </svg>
  );
}
