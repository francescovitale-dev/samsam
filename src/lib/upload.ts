import { put } from "@vercel/blob";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Store an uploaded file and return its public URL.
 * - If BLOB_READ_WRITE_TOKEN is set → Vercel Blob.
 * - Otherwise (local dev) → /public/uploads on disk, served at /uploads/...
 * Returns null if the file is empty/absent.
 */
export async function storeUpload(
  file: File | null | undefined,
  prefix = "uploads",
): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${prefix}/${crypto.randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, file, { access: "public", addRandomSuffix: false });
    return blob.url;
  }

  // Local disk fallback
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = key.split("/").pop()!;
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${filename}`;
}
