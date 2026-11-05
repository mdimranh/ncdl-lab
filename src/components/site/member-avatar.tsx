import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const gradients = [
  "from-ink-900 to-ink-700",
  "from-brand-800 to-ink-800",
  "from-ink-800 to-brand-800",
  "from-ink-700 to-brand-900",
];

/** Photo when available, otherwise a deterministic monogram plate. */
export function MemberAvatar({
  name,
  photoUrl,
  className,
  textClassName,
  index = 0,
}: {
  name: string;
  photoUrl?: string | null;
  className?: string;
  textClassName?: string;
  index?: number;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid h-full w-full place-items-center bg-gradient-to-br text-white",
        gradients[index % gradients.length],
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "font-display text-2xl font-medium tracking-tight text-white/85",
          textClassName,
        )}
      >
        {initials(name)}
      </span>
    </div>
  );
}
