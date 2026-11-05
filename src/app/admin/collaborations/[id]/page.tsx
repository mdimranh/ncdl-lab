import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { collaborations } from "@/db/schema";
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
import { saveCollaborationAction } from "../../actions";

export default async function CollaborationEditorPage({
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

  let partner: typeof collaborations.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db
      .select()
      .from(collaborations)
      .where(eq(collaborations.id, numeric))
      .limit(1);
    if (!row) notFound();
    partner = row;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title={isNew ? "Add collaborator" : `Edit ${partner?.institution}`}
        description="Appears in the collaborations section of the public members page."
        backHref="/admin/collaborations"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={saveCollaborationAction} className="space-y-5">
        <input type="hidden" name="id" value={partner?.id ?? ""} />

        <Card className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Institution" required>
              <Input name="institution" defaultValue={partner?.institution ?? ""} required />
            </Field>
            <Field label="Country">
              <Input name="country" defaultValue={partner?.country ?? ""} />
            </Field>
            <Field label="Website">
              <Input name="websiteUrl" defaultValue={partner?.websiteUrl ?? ""} placeholder="https://…" />
            </Field>
            <Field label="Display order">
              <Input type="number" name="displayOrder" defaultValue={partner?.displayOrder ?? 0} />
            </Field>
          </div>

          <Field label="Collaboration summary">
            <Textarea
              name="description"
              defaultValue={partner?.description ?? ""}
              className="min-h-[110px]"
            />
          </Field>
        </Card>

        <FormActions
          submitLabel={isNew ? "Create partner" : "Save changes"}
          cancelHref="/admin/collaborations"
        />
      </form>
    </div>
  );
}
