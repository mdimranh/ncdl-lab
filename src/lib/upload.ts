import { randomBytes } from "node:crypto";
import { Bucket } from "@upstash/blob";
import { IMAGE_EXTENSIONS, imageFileProblem } from "@/lib/image-rules";

export class UploadError extends Error {}

let bucket: Bucket | null = null;

/** Lazily built so the app boots (and reads other pages) without a storage token. */
function getBucket(): Bucket {
  const token = process.env.UPSTASH_BLOB_TOKEN;
  if (!token) {
    throw new UploadError(
      "Image storage is not configured: set UPSTASH_BLOB_TOKEN in the environment.",
    );
  }
  bucket ??= new Bucket({ token, cache: "immutable" });
  return bucket;
}

/**
 * Uploads an image to Upstash Blob and returns its public URL.
 * Returns `existing` when no new file was supplied.
 */
export async function saveUpload(
  file: File | null,
  existing: string | null,
): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return existing;

  const problem = imageFileProblem(file);
  if (problem) throw new UploadError(problem);

  const extension = IMAGE_EXTENSIONS[file.type];

  const filename = `${Date.now()}-${randomBytes(5).toString("hex")}${extension}`;
  const path = `uploads/${filename}`;
  const client = getBucket();

  // Fail before writing when the bucket has no public URL (site images must be readable).
  const publicUrl = await client.publicUrl(path);
  if (!publicUrl) {
    throw new UploadError(
      "The Upstash Blob bucket is private. Make it public in the Upstash console so uploaded images can be served.",
    );
  }

  try {
    const blob = await client.put(path, file, {
      contentType: file.type,
      cache: "immutable",
    });
    return blob.url ?? publicUrl;
  } catch (error) {
    console.error("Upstash Blob upload failed:", error);
    throw new UploadError("Could not upload the image to storage. Please try again.");
  }
}

export function fileFrom(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}
