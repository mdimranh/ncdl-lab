import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { positions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { positionTypeLabels } from "@/lib/content";
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
import { savePositionAction } from "../../actions";

export default async function PositionEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  let position: typeof positions.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db.select().from(positions).where(eq(positions.id, numeric)).limit(1);
    if (!row) notFound();
    position = row;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title={isNew ? "Add position" : "Edit position"}
        description="Keep the description short on cards; requirements are rendered as a bullet list."
        backHref="/admin/positions"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={savePositionAction} className="space-y-5">
        <input type="hidden" name="id" value={position?.id ?? ""} />

        <Card className="space-y-4 p-5">
          <Field label="Position title" required>
            <Input name="title" defaultValue={position?.title ?? ""} required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type">
              <Select name="type" defaultValue={position?.type ?? "phd"}>
                {Object.entries(positionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Application deadline">
              <Input type="date" name="deadline" defaultValue={position?.deadline ?? ""} />
            </Field>
            <Field label="Display order">
              <Input type="number" name="displayOrder" defaultValue={position?.displayOrder ?? 0} />
            </Field>
          </div>

          <Field label="Description">
            <Textarea name="description" defaultValue={position?.description ?? ""} />
          </Field>

          <Field label="Requirements" hint="One requirement per line.">
            <Textarea
              name="requirements"
              defaultValue={(position?.requirements ?? []).join("\n")}
              className="min-h-[140px]"
            />
          </Field>

          <Field label="Funding note">
            <Input
              name="fundingNote"
              defaultValue={position?.fundingNote ?? ""}
              placeholder="Fully funded for four years, including tuition and stipend."
            />
          </Field>
        </Card>

        <Card className="p-5">
          <Checkbox
            name="isOpen"
            label="Accepting applications"
            hint="Closed positions remain in the admin list but are hidden from the website."
            defaultChecked={position ? position.isOpen : true}
          />
        </Card>

        <FormActions
          submitLabel={isNew ? "Create position" : "Save changes"}
          cancelHref="/admin/positions"
        />
      </form>
    </div>
  );
}
