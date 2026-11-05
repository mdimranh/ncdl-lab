import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 5 * 1024 * 1024;

const allowed: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export class UploadError extends Error {}

/**
 * Saves an uploaded image into `public/uploads` and returns its public path.
 * Returns `existing` when no new file was supplied.
 */
export async function saveUpload(
  file: File | null,
  existing: string | null,
): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return existing;

  if (file.size > MAX_BYTES) {
    throw new UploadError("Image is larger than 5 MB.");
  }

  const extension = allowed[file.type];
  if (!extension) {
    throw new UploadError("Unsupported image type. Use PNG, JPEG, WebP, GIF or AVIF.");
  }

  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });

  const filename = `${Date.now()}-${randomBytes(5).toString("hex")}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, filename), buffer);

  return `/uploads/${filename}`;
}

export function fileFrom(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}
