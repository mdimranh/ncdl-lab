import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { researchAreas } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { areaIconNames } from "@/components/site/area-icon";
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
import { saveAreaAction } from "../../actions";

export default async function ResearchEditorPage({
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

  let area: typeof researchAreas.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db
      .select()
      .from(researchAreas)
      .where(eq(researchAreas.id, numeric))
      .limit(1);
    if (!row) notFound();
    area = row;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research"
        title={isNew ? "Add research area" : `Edit ${area?.title}`}
        description="Objectives and methodologies are rendered as lists on the public area page."
        backHref="/admin/research"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={saveAreaAction} className="space-y-5">
        <input type="hidden" name="id" value={area?.id ?? ""} />

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <Input name="title" defaultValue={area?.title ?? ""} required />
            </Field>
            <Field label="Title (Korean)">
              <Input name="titleKo" defaultValue={area?.titleKo ?? ""} />
            </Field>
            <Field label="URL slug" hint="Leave empty to generate from the title.">
              <Input name="slug" defaultValue={area?.slug ?? ""} />
            </Field>
            <Field label="Tagline">
              <Input name="tagline" defaultValue={area?.tagline ?? ""} />
            </Field>
            <Field label="Tagline (Korean)">
              <Input name="taglineKo" defaultValue={area?.taglineKo ?? ""} />
            </Field>
            <Field label="Icon">
              <Select name="icon" defaultValue={area?.icon ?? "cpu"}>
                {areaIconNames.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Display order">
              <Input type="number" name="displayOrder" defaultValue={area?.displayOrder ?? 0} />
            </Field>
            <Field label="Keywords" hint="Comma separated.">
              <Input name="keywords" defaultValue={(area?.keywords ?? []).join(", ")} />
            </Field>
            <Field label="Published date" hint="Shown on the research index; newest first.">
              <Input type="date" name="publishedAt" defaultValue={area?.publishedAt ?? ""} />
            </Field>
          </div>

          <Field label="Card summary" hint="Shown on the home page and research index.">
            <Textarea name="summary" defaultValue={area?.summary ?? ""} />
          </Field>
          <Field label="Card summary (Korean)">
            <Textarea name="summaryKo" defaultValue={area?.summaryKo ?? ""} />
          </Field>
          <Field label="Full overview" hint="Separate paragraphs with a blank line.">
            <Textarea name="overview" defaultValue={area?.overview ?? ""} className="min-h-[200px]" />
          </Field>
          <Field label="Full overview (Korean)" hint="Separate paragraphs with a blank line.">
            <Textarea name="overviewKo" defaultValue={area?.overviewKo ?? ""} className="min-h-[200px]" />
          </Field>
          <Field
            label="Figures & results"
            hint="One figure per line: image URL | caption."
          >
            <Textarea
              name="figures"
              defaultValue={(area?.figures ?? [])
                .map((figure) => `${figure.imageUrl} | ${figure.caption}`)
                .join("\n")}
              className="min-h-[120px] font-mono text-[12px]"
            />
          </Field>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="space-y-4 p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Objectives
            </h2>
            <Field label="One objective per line">
              <Textarea
                name="objectives"
                defaultValue={(area?.objectives ?? []).join("\n")}
                className="min-h-[180px]"
              />
            </Field>
            <Field label="Objectives (Korean)" hint="One per line.">
              <Textarea
                name="objectivesKo"
                defaultValue={(area?.objectivesKo ?? []).join("\n")}
                className="min-h-[180px]"
              />
            </Field>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Methodologies
            </h2>
            <Field label="One method per line">
              <Textarea
                name="methodologies"
                defaultValue={(area?.methodologies ?? []).join("\n")}
                className="min-h-[180px]"
              />
            </Field>
            <Field label="Methodologies (Korean)" hint="One per line.">
              <Textarea
                name="methodologiesKo"
                defaultValue={(area?.methodologiesKo ?? []).join("\n")}
                className="min-h-[180px]"
              />
            </Field>
          </Card>
        </div>

        <Card className="p-5">
          <Checkbox
            name="published"
            label="Published"
            hint="Hidden areas are removed from the public research section."
            defaultChecked={area ? area.published : true}
          />
        </Card>

        <FormActions
          submitLabel={isNew ? "Create area" : "Save changes"}
          cancelHref="/admin/research"
        />
      </form>
    </div>
  );
}
