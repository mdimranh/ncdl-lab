"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  FolderKanban,
  Handshake,
  Images,
  LayoutDashboard,
  Layers,
  Newspaper,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/auth";

type Item = {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const sections: { title: string; items: Item[] }[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "People & research",
    items: [
      { label: "Members", href: "/admin/members", icon: Users, adminOnly: true },
      { label: "Research areas", href: "/admin/research", icon: Layers },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Collaborations", href: "/admin/collaborations", icon: Handshake, adminOnly: true },
    ],
  },
  {
    title: "Output",
    items: [
      { label: "Publications", href: "/admin/publications", icon: BookOpen },
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Positions", href: "/admin/positions", icon: Briefcase, adminOnly: true },
    ],
  },
  {
    title: "Site",
    items: [
      { label: "Gallery", href: "/admin/gallery", icon: Images, adminOnly: true },
      { label: "Contact & settings", href: "/admin/settings", icon: Settings, adminOnly: true },
    ],
  },
];

export function AdminNav({
  role,
  variant = "sidebar",
}: {
  role: Role;
  variant?: "sidebar" | "mobile";
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  if (variant === "mobile") {
    const items = sections.flatMap((section) =>
      section.items.filter((item) => !item.adminOnly || role === "admin"),
    );
    return (
      <nav className="flex gap-1 overflow-x-auto px-4 py-2" aria-label="Admin">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-medium",
              isActive(item.href)
                ? "bg-ink-950 text-white"
                : "text-muted hover:bg-surface",
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 flex-col gap-7 overflow-y-auto px-4 py-6" aria-label="Admin">
      {sections.map((section) => {
        const items = section.items.filter(
          (item) => !item.adminOnly || role === "admin",
        );
        if (items.length === 0) return null;
        return (
          <div key={section.title}>
            <p className="px-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/30">
              {section.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-white/10 text-white"
                        : "text-white/55 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4",
                        isActive(item.href) ? "text-brand-300" : "text-white/35",
                      )}
                      strokeWidth={1.7}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
