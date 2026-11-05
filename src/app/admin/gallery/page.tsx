import { asc } from "drizzle-orm";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  Card,
  EmptyState,
  Field,
  Input,
  Notice,
  PageHeader,
  Textarea,
} from "@/components/admin/ui";
import { deleteGalleryAction, saveGalleryAction } from "../actions";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.displayOrder), asc(gallery.id));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site"
        title="Gallery & carousel"
        description="Photos shown in the home page carousel, in display order. Upload new images or reuse an existing path."
      />

      {params.saved && <Notice tone="success">Photo saved.</Notice>}
      {params.deleted && <Notice tone="success">Photo removed.</Notice>}
      {params.error && <Notice tone="error">{params.error}</Notice>}

      <Card className="p-5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Add a photo
        </h2>
        <form action={saveGalleryAction} className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-3">
            <Field label="Title">
              <Input name="title" placeholder="Die bring-up session" />
            </Field>
            <Field label="Caption" hint="Shown over the carousel image.">
              <Textarea name="caption" className="min-h-[74px]" />
            </Field>
          </div>

          <div className="space-y-3">
            <Field label="Upload image" hint="PNG, JPEG, WebP or AVIF up to 5 MB.">
              <Input type="file" name="imageFile" accept="image/*" className="py-1.5 text-[11.5px]" />
            </Field>
            <Field label="…or image URL">
              <Input name="imageUrl" placeholder="/images/lab/die.svg" />
            </Field>
          </div>

          <div className="space-y-3">
            <Field label="Display order">
              <Input type="number" name="displayOrder" defaultValue={rows.length + 1} />
            </Field>
            <button
              type="submit"
              className="w-full rounded-lg bg-ink-950 px-4 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-ink-800"
            >
              Add photo
            </button>
          </div>
        </form>
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="Gallery is empty" hint="Add photos to enable the home page carousel." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-[16/9] bg-ink-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <form action={saveGalleryAction} className="space-y-3 p-4">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="imageUrl" value={item.imageUrl} />
                <Field label="Title">
                  <Input name="title" defaultValue={item.title} />
                </Field>
                <Field label="Caption">
                  <Textarea name="caption" defaultValue={item.caption} className="min-h-[64px]" />
                </Field>
                <div className="flex items-end gap-3">
                  <Field label="Order" className="w-24">
                    <Input type="number" name="displayOrder" defaultValue={item.displayOrder} />
                  </Field>
                  <button
                    type="submit"
                    className="rounded-lg border border-line px-3 py-2 text-[11.5px] font-medium text-ink-800 hover:border-brand-300"
                  >
                    Update
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <span className="font-mono text-[10px] text-muted">{item.imageUrl}</span>
                <DeleteButton
                  action={deleteGalleryAction}
                  id={item.id}
                  label={item.title || "photo"}
                  compact
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
