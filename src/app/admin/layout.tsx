import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import { getSettings } from "@/lib/content";
import { LogoMark } from "@/components/site/logo-mark";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [user, settings] = await Promise.all([requireUser(), getSettings()]);

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink-950 lg:flex">
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-brand-300">
            <LogoMark className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-[14px] font-semibold text-white">
              {settings.shortName} Admin
            </p>
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-white/35">
              Content management
            </p>
          </div>
        </div>

        <AdminNav role={user.role} />

        <div className="border-t border-white/5 p-4">
          <div className="rounded-lg bg-white/[0.04] p-3">
            <p className="truncate text-[12px] font-medium text-white">{user.name}</p>
            <p className="mt-0.5 truncate text-[10.5px] text-white/40">{user.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-brand-400/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-300">
              {user.role === "admin" ? "Administrator" : "Researcher"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[11.5px] text-white/45 hover:text-white"
            >
              View site
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11.5px] text-white/45 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-brand-300">
                <LogoMark className="h-5 w-5" />
              </span>
              <span className="font-display text-[13px] font-semibold text-ink-900">
                {settings.shortName} Admin
              </span>
            </div>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:block">
              Dashboard · {user.role === "admin" ? "Full access" : "Research & publications"}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[11.5px] font-medium text-ink-700 hover:text-ink-900 sm:inline-flex"
              >
                View site
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-muted hover:text-ink-900"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-line lg:hidden">
            <AdminNav role={user.role} variant="mobile" />
          </div>
        </header>

        <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
