import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

export async function createMediaAssetFromBase64(opts: {
  filename: string;
  base64: string;
  contentType: string;
  ownerType: string;
  ownerId: string;
  altEn?: string | null;
  altAr?: string | null;
  width?: number | null;
  height?: number | null;
}) {
  // keep existing wrapper for compatibility
  const base64Data = opts.base64.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  return createMediaAssetFromBuffer({
    filename: opts.filename,
    buffer,
    contentType: opts.contentType,
    ownerType: opts.ownerType,
    ownerId: opts.ownerId,
    altEn: opts.altEn || null,
    altAr: opts.altAr || null,
    width: opts.width || null,
    height: opts.height || null,
  });
}

export async function createMediaAssetFromBuffer(opts: {
  filename: string;
  buffer: Buffer;
  contentType: string;
  ownerType: string;
  ownerId: string;
  altEn?: string | null;
  altAr?: string | null;
  width?: number | null;
  height?: number | null;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  // Ensure unique filename
  const safeName = `${Date.now()}-${opts.filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
  const filePath = path.join(uploadsDir, safeName);

  fs.writeFileSync(filePath, opts.buffer);

  const url = `/uploads/${safeName}`;

  const assetType = opts.contentType.startsWith('image/')
    ? 'image'
    : opts.contentType.startsWith('video/')
      ? 'video'
      : 'document';

  const rawOwnerId = (opts.ownerId || '').trim();
  const normalizedOwnerId = rawOwnerId.length > 0 ? rawOwnerId : 'pending';
  const projectId =
    opts.ownerType === 'project' && rawOwnerId && rawOwnerId !== 'temp' ? rawOwnerId : null;

  const media = await prisma.mediaAsset.create({
    data: {
      url,
      type: assetType,
      altTextEn: opts.altEn || null,
      altTextAr: opts.altAr || null,
      width: typeof opts.width === 'number' ? opts.width : null,
      height: typeof opts.height === 'number' ? opts.height : null,
      bytes: opts.buffer.length,
      contentType: opts.contentType,
      filename: safeName,
      ownerType: opts.ownerType || 'unassigned',
      ownerId: normalizedOwnerId,
      projectId,
    },
  });

  return media;
}
