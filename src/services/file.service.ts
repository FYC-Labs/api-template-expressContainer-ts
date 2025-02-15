import { storage } from '../libs/firebase';

const bucket = storage().bucket(process.env.STORAGE_BUCKET);

export async function upload({
  filePath,
  fileContent,
}: {
  filePath: string;
  fileContent: Buffer | string;
}): Promise<void> {
  const file = bucket.file(filePath);
  await file.save(fileContent);
}

export async function fetchSignedUrl({ filePath }: { filePath: string }): Promise<string> {
  const file = bucket.file(filePath);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60, // 1 hour expiration
  });
  return url;
}

export async function download({ filePath }: { filePath: string }): Promise<Buffer> {
  const file = bucket.file(filePath);
  const [content] = await file.download();
  return content;
}

export async function read({ filePath }: { filePath: string }): Promise<string> {
  const fileContent = await download({ filePath });
  return fileContent.toString();
}

export async function deleteFile({ filePath }: { filePath: string }): Promise<void> {
  const file = bucket.file(filePath);
  await file.delete();
}

export async function edit({
  filePath,
  newContent,
}: {
  filePath: string;
  newContent: Buffer | string;
}): Promise<void> {
  await upload({ filePath, fileContent: newContent });
}

export async function listFiles({ path }: { path: string }): Promise<string[]> {
  const [files] = await bucket.getFiles({ prefix: path });
  return files.map((file) => file.name);
}
