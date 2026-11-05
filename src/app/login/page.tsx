import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AlertCircle, ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { signInAction } from "@/lib/auth-actions";
import { getSettings } from "@/lib/content";
import { LogoMark } from "@/components/site/logo-mark";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Content management access for NCDL staff.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const [settings, params] = await Promise.all([getSettings(), searchParams]);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-10 text-white lg:flex">
        <div className="grid-tech absolute inset-0 opacity-70" />
        <div className="radial-glow absolute inset-0" />

        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-brand-300">
            <LogoMark />
          </span>
          <div>
            <p className="font-display text-base font-semibold tracking-tight">
              {settings.shortName}
            </p>
            <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/45">
              Content management
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="display text-3xl leading-tight">{settings.motto}</p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
            {settings.tagline}
          </p>
          <div className="mt-8 flex items-center gap-2 text-[11.5px] text-white/40">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-300" />
            Sessions are signed and expire after seven days.
          </div>
        </div>

        <p className="relative font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
          {settings.labName}
        </p>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to website
          </Link>

          <h1 className="display mt-8 text-3xl text-ink-900">Sign in</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Use the credentials issued by the laboratory administrator.
          </p>

          {params.error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {params.error}
            </div>
          )}

          <form action={signInAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium text-ink-800">
                Email address
              </span>
              <span className="relative block">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={params.email ?? ""}
                  autoComplete="email"
                  placeholder="you@ncdl-lab.org"
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-3 text-[13.5px] text-ink-900 placeholder:text-muted/60 focus:border-brand-400 focus:outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[12px] font-medium text-ink-800">
                Password
              </span>
              <span className="relative block">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-3 text-[13.5px] text-ink-900 placeholder:text-muted/60 focus:border-brand-400 focus:outline-none"
                />
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-ink-950 py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-ink-800"
            >
              Sign in to dashboard
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Demo accounts
            </p>
            <dl className="mt-2 space-y-1 text-[11.5px] text-ink-700">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Administrator</dt>
                <dd className="font-mono">admin@ncdl-lab.org / admin1234</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Researcher</dt>
                <dd className="font-mono">faculty@ncdl-lab.org / faculty1234</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
