import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getSettings } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader shortName={settings.shortName} locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} dict={dict} />
    </div>
  );
}
