import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { MemberAvatar } from "@/components/site/member-avatar";
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
import { saveMemberAction } from "../../actions";

export default async function MemberEditorPage({
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

  let member: typeof members.$inferSelect | null = null;
  if (!isNew) {
    const numeric = Number.parseInt(id, 10);
    if (Number.isNaN(numeric)) notFound();
    const [row] = await db.select().from(members).where(eq(members.id, numeric)).limit(1);
    if (!row) notFound();
    member = row;
  }

  const educationValue = (member?.education ?? [])
    .map((entry) => [entry.degree, entry.institution, entry.year].filter(Boolean).join(" | "))
    .join("\n");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title={isNew ? "Add member" : `Edit ${member?.name}`}
        description="Profile details appear on the members directory and on the member's own page."
        backHref="/admin/members"
      />

      {error && <Notice tone="error">{error}</Notice>}

      <form action={saveMemberAction} className="space-y-5">
        <input type="hidden" name="id" value={member?.id ?? ""} />

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card className="space-y-4 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Identity
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <Input name="name" defaultValue={member?.name ?? ""} required />
                </Field>
                <Field label="Full name (Korean)" hint="Shown when the site is read in Korean.">
                  <Input name="nameKo" defaultValue={member?.nameKo ?? ""} />
                </Field>
                <Field label="URL slug" hint="Leave empty to generate from the name.">
                  <Input name="slug" defaultValue={member?.slug ?? ""} placeholder="ayesha-rahman" />
                </Field>
                <Field label="Category">
                  <Select name="category" defaultValue={member?.category ?? "phd"}>
                    <option value="professor">Faculty / Professor</option>
                    <option value="phd">PhD researcher</option>
                    <option value="masters">Master&apos;s student</option>
                    <option value="alumni">Alumni</option>
                  </Select>
                </Field>
                <Field label="Designation">
                  <Input
                    name="designation"
                    defaultValue={member?.designation ?? ""}
                    placeholder="PhD Candidate · Spiking Accelerators"
                  />
                </Field>
                <Field label="Designation (Korean)">
                  <Input name="designationKo" defaultValue={member?.designationKo ?? ""} />
                </Field>
                <Field label="Email">
                  <Input type="email" name="email" defaultValue={member?.email ?? ""} />
                </Field>
                <Field label="Phone">
                  <Input name="phone" defaultValue={member?.phone ?? ""} />
                </Field>
                <Field label="Joined year">
                  <Input type="number" name="joinedYear" defaultValue={member?.joinedYear ?? ""} min={1990} max={2100} />
                </Field>
                <Field label="Display order" hint="Lower numbers appear first.">
                  <Input type="number" name="displayOrder" defaultValue={member?.displayOrder ?? 0} />
                </Field>
              </div>
            </Card>

            <Card className="space-y-4 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Profile
              </h2>
              <Field label="Biography" hint="Separate paragraphs with a blank line.">
                <Textarea name="bio" defaultValue={member?.bio ?? ""} className="min-h-[160px]" />
              </Field>
              <Field label="Biography (Korean)" hint="Leave empty to fall back to English.">
                <Textarea name="bioKo" defaultValue={member?.bioKo ?? ""} className="min-h-[160px]" />
              </Field>
              <Field label="Research interests" hint="One per line.">
                <Textarea
                  name="interests"
                  defaultValue={(member?.interests ?? []).join("\n")}
                  className="min-h-[96px]"
                />
              </Field>
              <Field label="Research interests (Korean)" hint="One per line.">
                <Textarea
                  name="interestsKo"
                  defaultValue={(member?.interestsKo ?? []).join("\n")}
                  className="min-h-[96px]"
                />
              </Field>
              <Field
                label="Education"
                hint="One entry per line: Degree | Institution | Year"
              >
                <Textarea name="education" defaultValue={educationValue} className="min-h-[96px]" />
              </Field>
              <Field
                label="Alumni position"
                hint="For former members — current role and institution."
              >
                <Input
                  name="alumniPosition"
                  defaultValue={member?.alumniPosition ?? ""}
                  placeholder="Postdoctoral Researcher, ETH Zürich"
                />
              </Field>
              <Field label="Alumni position (Korean)">
                <Input name="alumniPositionKo" defaultValue={member?.alumniPositionKo ?? ""} />
              </Field>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="space-y-4 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Photo
              </h2>
              <div className="h-36 w-full overflow-hidden rounded-xl bg-surface-2">
                <MemberAvatar name={member?.name ?? "New member"} photoUrl={member?.photoUrl} />
              </div>
              <Field label="Upload photo" hint="PNG, JPEG, WebP or AVIF up to 5 MB.">
                <Input type="file" name="photoFile" accept="image/*" className="py-1.5 text-[11.5px]" />
              </Field>
              <Field label="…or image URL">
                <Input name="photoUrl" defaultValue={member?.photoUrl ?? ""} placeholder="/uploads/photo.jpg" />
              </Field>
            </Card>

            <Card className="space-y-4 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Links
              </h2>
              <Field label="Google Scholar">
                <Input name="scholarUrl" defaultValue={member?.scholarUrl ?? ""} placeholder="https://scholar.google.com/…" />
              </Field>
              <Field label="ORCID">
                <Input name="orcidUrl" defaultValue={member?.orcidUrl ?? ""} placeholder="https://orcid.org/…" />
              </Field>
              <Field label="LinkedIn">
                <Input name="linkedinUrl" defaultValue={member?.linkedinUrl ?? ""} placeholder="https://linkedin.com/in/…" />
              </Field>
              <Field label="Personal website">
                <Input name="websiteUrl" defaultValue={member?.websiteUrl ?? ""} placeholder="https://…" />
              </Field>
            </Card>

            <Card className="space-y-3 p-5">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Visibility
              </h2>
              <Checkbox
                name="published"
                label="Published"
                hint="Hidden members do not appear on the website."
                defaultChecked={member ? member.published : true}
              />
            </Card>
          </div>
        </div>

        <FormActions
          submitLabel={isNew ? "Create member" : "Save changes"}
          cancelHref="/admin/members"
        />
      </form>
    </div>
  );
}
