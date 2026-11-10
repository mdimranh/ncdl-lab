import { getSettings } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";
import {
  Card,
  Field,
  FormActions,
  Input,
  Notice,
  PageHeader,
  Textarea,
} from "@/components/admin/ui";
import { saveSettingsAction } from "../actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const [settings, params] = await Promise.all([getSettings(), searchParams]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site"
        title="Contact & settings"
        description="These values drive the header, footer, contact page and map — there is no hard-coded copy."
      />

      {params.saved && <Notice tone="success">Settings saved.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      <form action={saveSettingsAction} className="space-y-5">
        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Identity
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Laboratory name">
              <Input name="labName" defaultValue={settings.labName} />
            </Field>
            <Field label="Laboratory name (Korean)">
              <Input name="labNameKo" defaultValue={settings.labNameKo} />
            </Field>
            <Field label="Short name" hint="Used in the header, footer and admin.">
              <Input name="shortName" defaultValue={settings.shortName} />
            </Field>
            <Field label="Institution / department">
              <Input name="institution" defaultValue={settings.institution} />
            </Field>
            <Field label="Institution / department (Korean)">
              <Input name="institutionKo" defaultValue={settings.institutionKo} />
            </Field>
            <Field label="Founding year">
              <Input type="number" name="foundingYear" defaultValue={settings.foundingYear} min={1900} max={2100} />
            </Field>
          </div>

          <Field label="Tagline" hint="One sentence shown in the hero and footer.">
            <Textarea name="tagline" defaultValue={settings.tagline} className="min-h-[72px]" />
          </Field>

          <Field label="Tagline (Korean)" hint="Leave empty to fall back to English.">
            <Textarea name="taglineKo" defaultValue={settings.taglineKo} className="min-h-[72px]" />
          </Field>

          <Field label="Motto" hint="Short statement shown on the home page and login screen.">
            <Input name="motto" defaultValue={settings.motto} />
          </Field>

          <Field label="Motto (Korean)">
            <Input name="mottoKo" defaultValue={settings.mottoKo} />
          </Field>

          <Field label="Mission" hint="Separate paragraphs with a blank line.">
            <Textarea name="mission" defaultValue={settings.mission} className="min-h-[180px]" />
          </Field>

          <Field label="Mission (Korean)" hint="Leave empty to fall back to English.">
            <Textarea name="missionKo" defaultValue={settings.missionKo} className="min-h-[180px]" />
          </Field>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Contact details
          </h2>

          <Field label="Address">
            <Textarea name="address" defaultValue={settings.address} className="min-h-[72px]" />
          </Field>

          <Field label="Address (Korean)">
            <Textarea name="addressKo" defaultValue={settings.addressKo} className="min-h-[72px]" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <Input name="phone" defaultValue={settings.phone} />
            </Field>
            <Field label="Fax">
              <Input name="fax" defaultValue={settings.fax} />
            </Field>
            <Field label="Email">
              <Input type="email" name="email" defaultValue={settings.email} />
            </Field>
            <Field label="Office hours">
              <Input name="officeHours" defaultValue={settings.officeHours} />
            </Field>
            <Field label="Office hours (Korean)">
              <Input name="officeHoursKo" defaultValue={settings.officeHoursKo} />
            </Field>
          </div>

          <Field
            label="Map location"
            hint="Address or place name passed to Google Maps — e.g. “Dhaka 1207, Bangladesh”."
          >
            <Input name="mapQuery" defaultValue={settings.mapQuery} />
          </Field>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Social profiles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn">
              <Input name="linkedinUrl" defaultValue={settings.linkedinUrl ?? ""} />
            </Field>
            <Field label="Google Scholar">
              <Input name="scholarUrl" defaultValue={settings.scholarUrl ?? ""} />
            </Field>
            <Field label="GitHub">
              <Input name="githubUrl" defaultValue={settings.githubUrl ?? ""} />
            </Field>
            <Field label="YouTube">
              <Input name="youtubeUrl" defaultValue={settings.youtubeUrl ?? ""} />
            </Field>
          </div>
        </Card>

        <FormActions submitLabel="Save settings" cancelHref="/admin" />
      </form>
    </div>
  );
}
