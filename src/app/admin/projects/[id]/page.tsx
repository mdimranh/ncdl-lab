import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, researchAreas } from "@/db/schema";
import { requireUser } from "@/lib/auth";
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
import { saveProjectAction } from "../../actions";

export default async function ProjectEditorPage({
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

  let project: typeof projects.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db.select().from(projects).where(eq(projects.id, numeric)).limit(1);
    if (!row) notFound();
    project = row;
  }

  const areas = await db
    .select({ id: researchAreas.id, title: researchAreas.title })
    .from(researchAreas)
    .orderBy(asc(researchAreas.displayOrder));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Research"
        title={isNew ? "Add project" : `Edit ${project?.title}`}
        description="Projects are listed on the matching research area page; featured ones also appear on the home page."
        backHref="/admin/projects"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={saveProjectAction} className="space-y-5">
        <input type="hidden" name="id" value={project?.id ?? ""} />

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Project
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <Input name="title" defaultValue={project?.title ?? ""} required />
            </Field>
            <Field label="URL slug" hint="Used for internal references.">
              <Input name="slug" defaultValue={project?.slug ?? ""} />
            </Field>
            <Field label="Research area">
              <Select name="areaId" defaultValue={project?.areaId ?? ""}>
                <option value="">Unassigned</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={project?.status ?? "ongoing"}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </Select>
            </Field>
            <Field label="Start year">
              <Input type="number" name="startYear" defaultValue={project?.startYear ?? ""} min={1990} max={2100} />
            </Field>
            <Field label="End year">
              <Input type="number" name="endYear" defaultValue={project?.endYear ?? ""} min={1990} max={2100} />
            </Field>
            <Field label="Funding">
              <Input name="funding" defaultValue={project?.funding ?? ""} placeholder="University Research Grant · 2024–2027" />
            </Field>
            <Field label="Collaborators">
              <Input name="collaborators" defaultValue={project?.collaborators ?? ""} placeholder="imec, TU Delft" />
            </Field>
            <Field label="Display order">
              <Input type="number" name="displayOrder" defaultValue={project?.displayOrder ?? 0} />
            </Field>
          </div>

          <Field label="Summary" hint="One or two sentences shown on cards.">
            <Textarea name="summary" defaultValue={project?.summary ?? ""} />
          </Field>
          <Field label="Full description" hint="Separate paragraphs with a blank line.">
            <Textarea name="description" defaultValue={project?.description ?? ""} className="min-h-[160px]" />
          </Field>
        </Card>

        <Card className="grid gap-3 p-5 sm:grid-cols-2">
          <Checkbox
            name="featured"
            label="Feature on home page"
            defaultChecked={project ? project.featured : false}
          />
          <Checkbox
            name="published"
            label="Published"
            hint="Hidden projects are removed from public pages."
            defaultChecked={project ? project.published : true}
          />
        </Card>

        <FormActions
          submitLabel={isNew ? "Create project" : "Save changes"}
          cancelHref="/admin/projects"
        />
      </form>
    </div>
  );
}
