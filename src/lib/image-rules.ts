export const IMAGE_MAX_BYTES = 15 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

/**
 * Returns a human-readable problem with a picked image, or null when it is fine.
 * Used in the browser so an oversized file is never posted to a server action
 * (the request would be rejected by Next and only show up as "Failed to fetch").
 */
export function imageFileProblem(file: File): string | null {
  if (!IMAGE_EXTENSIONS[file.type]) {
    return "Unsupported image type. Use PNG, JPEG, WebP, GIF or AVIF.";
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return "Image is larger than 15 MB. Resize or compress it and try again.";
  }
  return null;
}
