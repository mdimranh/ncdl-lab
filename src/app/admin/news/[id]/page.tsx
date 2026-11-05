import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toDateInput } from "@/lib/utils";
import {
  Card,
  Checkbox,
  Field,
  FormActions,
  Input,
  Notice,
  PageHeader,
  Textarea,
} from "@/components/admin/ui";
import { saveNewsAction } from "../../actions";

export default async function NewsEditorPage({
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

  let article: typeof news.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db.select().from(news).where(eq(news.id, numeric)).limit(1);
    if (!row) notFound();
    article = row;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title={isNew ? "New article" : "Edit article"}
        description="The excerpt appears on cards; the full content appears on the article page."
        backHref="/admin/news"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={saveNewsAction} className="space-y-5">
        <input type="hidden" name="id" value={article?.id ?? ""} />

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card className="space-y-4 p-5">
              <Field label="Headline" required>
                <Input name="title" defaultValue={article?.title ?? ""} required />
              </Field>
              <Field label="URL slug" hint="Leave empty to generate from the headline.">
                <Input name="slug" defaultValue={article?.slug ?? ""} />
              </Field>
              <Field label="Excerpt" hint="One or two sentences for cards and search results.">
                <Textarea name="excerpt" defaultValue={article?.excerpt ?? ""} />
              </Field>
              <Field
                label="Article content"
                hint="Separate paragraphs with a blank line. Use “## Heading” for section headings and “- item” for bullets."
              >
                <Textarea
                  name="content"
                  defaultValue={article?.content ?? ""}
                  className="min-h-[320px] font-mono text-[12.5px]"
                />
              </Field>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="space-y-4 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Publishing
              </h2>
              <Field label="Publication date">
                <Input
                  type="date"
                  name="publishedAt"
                  defaultValue={toDateInput(article?.publishedAt ?? new Date())}
                />
              </Field>
              <Field label="Author / source">
                <Input name="authorName" defaultValue={article?.authorName ?? "NCDL"} />
              </Field>
              <Checkbox
                name="isPublished"
                label="Published"
                hint="Uncheck to keep this article as a private draft."
                defaultChecked={article ? article.isPublished : true}
              />
            </Card>

            <Card className="space-y-4 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Header image
              </h2>
              {article?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg border border-line object-cover"
                />
              )}
              <Field label="Upload image" hint="PNG, JPEG, WebP or AVIF up to 5 MB.">
                <Input type="file" name="imageFile" accept="image/*" className="py-1.5 text-[11.5px]" />
              </Field>
              <Field label="…or image URL">
                <Input name="imageUrl" defaultValue={article?.imageUrl ?? ""} />
              </Field>
            </Card>
          </div>
        </div>

        <FormActions
          submitLabel={isNew ? "Publish article" : "Save changes"}
          cancelHref="/admin/news"
        />
      </form>
    </div>
  );
}
