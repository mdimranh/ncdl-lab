import { notFound } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { gallery } from "@/db/schema";
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
import { ImageInput } from "@/components/admin/image-input";
import { saveGalleryAction } from "../../actions";

export default async function GalleryEditorPage({
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

  let photo: typeof gallery.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db.select().from(gallery).where(eq(gallery.id, numeric)).limit(1);
    if (!row) notFound();
    photo = row;
  }

  const nextOrder = isNew
    ? ((
        await db.select({ value: count() }).from(gallery)
      )[0]?.value ?? 0) + 1
    : photo?.displayOrder ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site"
        title={isNew ? "Add photo" : "Edit photo"}
        description="Appears in the home page carousel. Lower display numbers come first."
        backHref="/admin/gallery"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={saveGalleryAction} className="space-y-5">
        <input type="hidden" name="id" value={photo?.id ?? ""} />

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Photo
          </h2>

          <Field label="Title" hint="Used as the image's alt text.">
            <Input
              name="title"
              defaultValue={photo?.title ?? ""}
              placeholder="Die bring-up session"
            />
          </Field>

          <Field label="Caption" hint="Shown over the carousel image.">
            <Textarea
              name="caption"
              defaultValue={photo?.caption ?? ""}
              className="min-h-[96px]"
              placeholder="Short caption for visitors"
            />
          </Field>

          <Field label="Display order" hint="Lower numbers appear first in the carousel." className="w-32">
            <Input
              type="number"
              name="displayOrder"
              defaultValue={nextOrder}
              min={0}
            />
          </Field>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Image
          </h2>

          {photo?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.imageUrl}
              alt=""
              className="aspect-[16/9] w-full max-w-sm rounded-lg border border-line object-cover"
            />
          )}

          <Field label="Upload image" hint="PNG, JPEG, WebP or AVIF up to 5 MB.">
            <ImageInput name="imageFile" />
          </Field>

          <Field
            label="…or image URL"
            hint="A path such as /images/lab/die.svg or a full https URL. Leave as is to keep the current image."
          >
            <Input
              name="imageUrl"
              defaultValue={photo?.imageUrl ?? ""}
              placeholder="/images/lab/die.svg"
            />
          </Field>
        </Card>

        <FormActions
          submitLabel={isNew ? "Add photo" : "Save changes"}
          cancelHref="/admin/gallery"
        />
      </form>
    </div>
  );
}
