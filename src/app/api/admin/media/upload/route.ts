import { NextResponse } from 'next/server';
import { createMediaAssetFromBuffer } from '@/lib/actions/media';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Parse multipart/form-data using the native formData API
    const form = await req.formData();

    const file = form.get('file') as unknown as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const filename = (form.get('filename') as string) || (file as any).name || 'upload';
    const contentType = (form.get('contentType') as string) || (file as any).type || 'application/octet-stream';
    const ownerType = (form.get('ownerType') as string) || 'unknown';
    const ownerId = (form.get('ownerId') as string) || 'unknown';
    const altEn = (form.get('altEn') as string) || null;
    const altAr = (form.get('altAr') as string) || null;
    const widthRaw = form.get('width') as string | null;
    const heightRaw = form.get('height') as string | null;

    const width = widthRaw ? parseInt(widthRaw, 10) : null;
    const height = heightRaw ? parseInt(heightRaw, 10) : null;

    // Get file data as buffer
    const arrayBuffer = await (file as any).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const media = await createMediaAssetFromBuffer({
      filename,
      buffer,
      contentType,
      ownerType,
      ownerId,
      altEn,
      altAr,
      width,
      height,
    });

    return NextResponse.json(media, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/media/upload error', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
