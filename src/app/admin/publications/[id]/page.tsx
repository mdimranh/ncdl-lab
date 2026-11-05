import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publications, researchAreas } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { publicationTypeLabels } from "@/lib/content";
import {
  Card,
  Checkbox,
  Field,
  FormActions,
  Input,
  Notice,
  PageHeader,
  Select,
  Textarea,
} from "@/components/admin/ui";
import { savePublicationAction } from "../../actions";

export default async function PublicationEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  let paper: typeof publications.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db
      .select()
      .from(publications)
      .where(eq(publications.id, numeric))
      .limit(1);
    if (!row) notFound();
    paper = row;
  }

  const areas = await db
    .select({ id: researchAreas.id, title: researchAreas.title })
    .from(researchAreas)
    .orderBy(asc(researchAreas.displayOrder));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title={isNew ? "Add publication" : "Edit publication"}
        description="Records are grouped by year on the public archive and can be searched by title, author or venue."
        backHref="/admin/publications"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={savePublicationAction} className="space-y-5">
        <input type="hidden" name="id" value={paper?.id ?? ""} />

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Record
          </h2>

          <Field label="Title" required>
            <Input name="title" defaultValue={paper?.title ?? ""} required />
          </Field>

          <Field label="Authors" required hint="Comma separated, as they appear in the paper.">
            <Input name="authors" defaultValue={paper?.authors ?? ""} required />
          </Field>

          <Field label="Venue / journal" hint="For chip records, use the fabrication detail line.">
            <Input name="venue" defaultValue={paper?.venue ?? ""} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type">
              <Select name="type" defaultValue={paper?.type ?? "journal"}>
                {Object.entries(publicationTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Year" required>
              <Input
                type="number"
                name="year"
                defaultValue={paper?.year ?? new Date().getFullYear()}
                min={1950}
                max={2100}
                required
              />
            </Field>
            <Field label="Research area">
              <Select name="areaId" defaultValue={paper?.areaId ?? ""}>
                <option value="">Unassigned</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="DOI" hint="Example: 10.1109/JSSC.2026.3312045">
              <Input name="doi" defaultValue={paper?.doi ?? ""} />
            </Field>
            <Field label="External link" hint="Defaults to the DOI resolver when a DOI is set.">
              <Input name="url" defaultValue={paper?.url ?? ""} placeholder="https://…" />
            </Field>
          </div>

          <Field label="Abstract">
            <Textarea name="abstract" defaultValue={paper?.abstract ?? ""} className="min-h-[120px]" />
          </Field>
        </Card>

        <Card className="p-5">
          <Checkbox
            name="featured"
            label="Highlight as featured"
            hint="Featured records are marked in the archive and on area pages."
            defaultChecked={paper ? paper.featured : false}
          />
        </Card>

        <FormActions
          submitLabel={isNew ? "Create record" : "Save changes"}
          cancelHref="/admin/publications"
        />
      </form>
    </div>
  );
}
