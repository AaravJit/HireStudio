import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function saveFile({
  buffer,
  filename,
  contentType
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
}) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, buffer, { access: 'public', contentType });
    return blob.url;
  }

  const storageDir = path.join(process.cwd(), 'storage');
  await mkdir(storageDir, { recursive: true });
  const filePath = path.join(storageDir, filename);
  await writeFile(filePath, buffer);
  return `/storage/${filename}`;
}
