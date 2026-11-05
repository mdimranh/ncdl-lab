"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  collaborations,
  gallery,
  members,
  news,
  positions,
  projects,
  publications,
  researchAreas,
  siteSettings,
  type EducationEntry,
} from "@/db/schema";
import { requireAdmin, requireUser } from "@/lib/auth";
import { bool, int, optional, parseLines, slugify, str } from "@/lib/utils";
import { fileFrom, saveUpload, UploadError } from "@/lib/upload";

/* -------------------------------- helpers -------------------------------- */

function pick<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function fail(target: string, message: string): never {
  redirect(`${target}?error=${encodeURIComponent(message)}`);
}

function refreshPublic(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

async function resolveImage(
  formData: FormData,
  fileKey: string,
  urlKey: string,
  target: string,
): Promise<string | null> {
  const existing = optional(formData.get(urlKey));
  try {
    return await saveUpload(fileFrom(formData, fileKey), existing);
  } catch (error) {
    if (error instanceof UploadError) fail(target, error.message);
    throw error;
  }
}

/* -------------------------------- members -------------------------------- */

export async function saveMemberAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  const target = id ? `/admin/members/${id}` : "/admin/members/new";
  const name = str(formData.get("name"));
  if (!name) fail(target, "Name is required.");

  const photoUrl = await resolveImage(formData, "photoFile", "photoUrl", target);
  const slug = slugify(str(formData.get("slug")) || name);
  if (!slug) fail(target, "A URL slug is required.");

  const education: EducationEntry[] = parseLines(formData.get("education"))
    .map((line) => {
      const [degree, institution, year] = line.split("|").map((part) => part.trim());
      return { degree: degree ?? "", institution: institution ?? "", year: year ?? "" };
    })
    .filter((entry) => entry.degree.length > 0);

  const values = {
    name,
    slug,
    category: pick(
      str(formData.get("category")),
      ["professor", "phd", "masters", "alumni"] as const,
      "phd",
    ),
    designation: str(formData.get("designation")),
    photoUrl,
    email: optional(formData.get("email")),
    phone: optional(formData.get("phone")),
    bio: str(formData.get("bio")),
    interests: parseLines(formData.get("interests")),
    education,
    websiteUrl: optional(formData.get("websiteUrl")),
    scholarUrl: optional(formData.get("scholarUrl")),
    linkedinUrl: optional(formData.get("linkedinUrl")),
    orcidUrl: optional(formData.get("orcidUrl")),
    joinedYear: int(formData.get("joinedYear")),
    alumniPosition: optional(formData.get("alumniPosition")),
    displayOrder: int(formData.get("displayOrder")) ?? 0,
    published: bool(formData.get("published")),
  };

  let failed = false;
  try {
    if (id) await db.update(members).set(values).where(eq(members.id, id));
    else await db.insert(members).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this member. The slug may already be in use.");

  refreshPublic(["/", "/members", `/members/${slug}`]);
  redirect("/admin/members?saved=1");
}

export async function deleteMemberAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  if (id) await db.delete(members).where(eq(members.id, id));
  refreshPublic(["/", "/members"]);
  redirect("/admin/members?deleted=1");
}

/* ----------------------------- research areas ---------------------------- */

export async function saveAreaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  const target = id ? `/admin/research/${id}` : "/admin/research/new";
  const title = str(formData.get("title"));
  if (!title) fail(target, "Title is required.");

  const slug = slugify(str(formData.get("slug")) || title);
  if (!slug) fail(target, "A URL slug is required.");

  const values = {
    title,
    slug,
    tagline: str(formData.get("tagline")),
    icon: str(formData.get("icon")) || "cpu",
    summary: str(formData.get("summary")),
    overview: str(formData.get("overview")),
    objectives: parseLines(formData.get("objectives")),
    methodologies: parseLines(formData.get("methodologies")),
    keywords: str(formData.get("keywords"))
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    displayOrder: int(formData.get("displayOrder")) ?? 0,
    published: bool(formData.get("published")),
  };

  let failed = false;
  try {
    if (id) await db.update(researchAreas).set(values).where(eq(researchAreas.id, id));
    else await db.insert(researchAreas).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this research area. The slug may already be in use.");

  refreshPublic(["/", "/research", `/research/${slug}`]);
  redirect("/admin/research?saved=1");
}

export async function deleteAreaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  if (id) await db.delete(researchAreas).where(eq(researchAreas.id, id));
  refreshPublic(["/", "/research"]);
  redirect("/admin/research?deleted=1");
}

/* -------------------------------- projects ------------------------------- */

export async function saveProjectAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = int(formData.get("id"));
  const target = id ? `/admin/projects/${id}` : "/admin/projects/new";
  const title = str(formData.get("title"));
  if (!title) fail(target, "Title is required.");

  const slug = slugify(str(formData.get("slug")) || title);
  const values = {
    title,
    slug,
    areaId: int(formData.get("areaId")),
    status: pick(str(formData.get("status")), ["ongoing", "completed"] as const, "ongoing"),
    summary: str(formData.get("summary")),
    description: str(formData.get("description")),
    funding: optional(formData.get("funding")),
    collaborators: optional(formData.get("collaborators")),
    startYear: int(formData.get("startYear")),
    endYear: int(formData.get("endYear")),
    featured: bool(formData.get("featured")),
    displayOrder: int(formData.get("displayOrder")) ?? 0,
    published: bool(formData.get("published")),
  };

  let failed = false;
  try {
    if (id) await db.update(projects).set(values).where(eq(projects.id, id));
    else await db.insert(projects).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this project. The slug may already be in use.");

  refreshPublic(["/", "/research", "/research/neuromorphic-circuit-design"]);
  redirect("/admin/projects?saved=1");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = int(formData.get("id"));
  if (id) await db.delete(projects).where(eq(projects.id, id));
  refreshPublic(["/", "/research"]);
  redirect("/admin/projects?deleted=1");
}

/* ------------------------------ publications ----------------------------- */

export async function savePublicationAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = int(formData.get("id"));
  const target = id ? `/admin/publications/${id}` : "/admin/publications/new";
  const title = str(formData.get("title"));
  const authors = str(formData.get("authors"));
  if (!title) fail(target, "Title is required.");
  if (!authors) fail(target, "At least one author is required.");

  const year = int(formData.get("year"));
  if (!year || year < 1950 || year > 2100) fail(target, "Enter a valid publication year.");

  const doi = optional(formData.get("doi"));
  const values = {
    title,
    authors,
    venue: str(formData.get("venue")),
    type: pick(
      str(formData.get("type")),
      ["journal", "conference", "chip", "workshop", "certificate"] as const,
      "journal",
    ),
    year: year as number,
    doi,
    url: optional(formData.get("url")) ?? (doi ? `https://doi.org/${doi}` : null),
    abstract: optional(formData.get("abstract")),
    areaId: int(formData.get("areaId")),
    featured: bool(formData.get("featured")),
  };

  let failed = false;
  try {
    if (id) await db.update(publications).set(values).where(eq(publications.id, id));
    else await db.insert(publications).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this publication.");

  refreshPublic(["/", "/publications", "/research"]);
  redirect("/admin/publications?saved=1");
}

export async function deletePublicationAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = int(formData.get("id"));
  if (id) await db.delete(publications).where(eq(publications.id, id));
  refreshPublic(["/", "/publications", "/research"]);
  redirect("/admin/publications?deleted=1");
}

/* ---------------------------------- news --------------------------------- */

export async function saveNewsAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = int(formData.get("id"));
  const target = id ? `/admin/news/${id}` : "/admin/news/new";
  const title = str(formData.get("title"));
  if (!title) fail(target, "Title is required.");

  const imageUrl = await resolveImage(formData, "imageFile", "imageUrl", target);
  const slug = slugify(str(formData.get("slug")) || title);
  const publishedAtRaw = str(formData.get("publishedAt"));
  const publishedAt = publishedAtRaw ? new Date(`${publishedAtRaw}T09:00:00`) : new Date();

  const values = {
    title,
    slug,
    excerpt: str(formData.get("excerpt")),
    content: str(formData.get("content")),
    imageUrl,
    authorName: str(formData.get("authorName")) || "NCDL",
    publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    isPublished: bool(formData.get("isPublished")),
  };

  let failed = false;
  try {
    if (id) await db.update(news).set(values).where(eq(news.id, id));
    else await db.insert(news).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this article. The slug may already be in use.");

  refreshPublic(["/", "/news", `/news/${slug}`]);
  redirect("/admin/news?saved=1");
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = int(formData.get("id"));
  if (id) await db.delete(news).where(eq(news.id, id));
  refreshPublic(["/", "/news"]);
  redirect("/admin/news?deleted=1");
}

/* -------------------------------- positions ------------------------------ */

export async function savePositionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  const target = id ? `/admin/positions/${id}` : "/admin/positions/new";
  const title = str(formData.get("title"));
  if (!title) fail(target, "Title is required.");

  const values = {
    title,
    type: pick(
      str(formData.get("type")),
      ["phd", "masters", "postdoc", "research-assistant", "internship"] as const,
      "phd",
    ),
    description: str(formData.get("description")),
    requirements: parseLines(formData.get("requirements")),
    fundingNote: optional(formData.get("fundingNote")),
    deadline: optional(formData.get("deadline")),
    isOpen: bool(formData.get("isOpen")),
    displayOrder: int(formData.get("displayOrder")) ?? 0,
  };

  let failed = false;
  try {
    if (id) await db.update(positions).set(values).where(eq(positions.id, id));
    else await db.insert(positions).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this position.");

  refreshPublic(["/", "/contact"]);
  redirect("/admin/positions?saved=1");
}

export async function deletePositionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  if (id) await db.delete(positions).where(eq(positions.id, id));
  refreshPublic(["/", "/contact"]);
  redirect("/admin/positions?deleted=1");
}

/* --------------------------------- gallery ------------------------------- */

export async function saveGalleryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  const target = "/admin/gallery";

  const imageUrl = await resolveImage(formData, "imageFile", "imageUrl", target);
  if (!imageUrl) fail(target, "Upload an image or provide an image URL.");

  const values = {
    title: str(formData.get("title")),
    caption: str(formData.get("caption")),
    imageUrl: imageUrl as string,
    displayOrder: int(formData.get("displayOrder")) ?? 0,
    isActive: true,
  };

  let failed = false;
  try {
    if (id) await db.update(gallery).set(values).where(eq(gallery.id, id));
    else await db.insert(gallery).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this photo.");

  refreshPublic(["/", "/admin/gallery"]);
  redirect("/admin/gallery?saved=1");
}

export async function deleteGalleryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  if (id) await db.delete(gallery).where(eq(gallery.id, id));
  refreshPublic(["/", "/admin/gallery"]);
  redirect("/admin/gallery?deleted=1");
}

/* ----------------------------- collaborations ---------------------------- */

export async function saveCollaborationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  const target = id ? `/admin/collaborations/${id}` : "/admin/collaborations/new";
  const institution = str(formData.get("institution"));
  if (!institution) fail(target, "Institution name is required.");

  const values = {
    institution,
    country: str(formData.get("country")),
    description: str(formData.get("description")),
    websiteUrl: optional(formData.get("websiteUrl")),
    displayOrder: int(formData.get("displayOrder")) ?? 0,
  };

  let failed = false;
  try {
    if (id) await db.update(collaborations).set(values).where(eq(collaborations.id, id));
    else await db.insert(collaborations).values(values);
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save this collaboration.");

  refreshPublic(["/members"]);
  redirect("/admin/collaborations?saved=1");
}

export async function deleteCollaborationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = int(formData.get("id"));
  if (id) await db.delete(collaborations).where(eq(collaborations.id, id));
  refreshPublic(["/members"]);
  redirect("/admin/collaborations?deleted=1");
}

/* -------------------------------- settings ------------------------------- */

export async function saveSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const target = "/admin/settings";

  const values = {
    labName: str(formData.get("labName")) || "Neuromorphic Chip Design Laboratory",
    shortName: str(formData.get("shortName")) || "NCDL",
    institution: str(formData.get("institution")),
    tagline: str(formData.get("tagline")),
    motto: str(formData.get("motto")),
    mission: str(formData.get("mission")),
    foundingYear: int(formData.get("foundingYear")) ?? 2018,
    address: str(formData.get("address")),
    phone: str(formData.get("phone")),
    fax: str(formData.get("fax")),
    email: str(formData.get("email")),
    officeHours: str(formData.get("officeHours")),
    mapQuery: str(formData.get("mapQuery")),
    linkedinUrl: optional(formData.get("linkedinUrl")),
    scholarUrl: optional(formData.get("scholarUrl")),
    githubUrl: optional(formData.get("githubUrl")),
    youtubeUrl: optional(formData.get("youtubeUrl")),
    updatedAt: new Date(),
  };

  let failed = false;
  try {
    const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
    if (existing) {
      await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values({ id: 1, ...values });
    }
  } catch {
    failed = true;
  }
  if (failed) fail(target, "Could not save the settings.");

  refreshPublic(["/", "/contact", "/members"]);
  redirect("/admin/settings?saved=1");
}
