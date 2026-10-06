import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { globalMediaCache } from '@/lib/media-cache';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || 'application/octet-stream';
    const ext = path.extname(file.name) || (contentType.includes('video') ? '.mp4' : '.jpg');
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Store in global memory map
    globalMediaCache.set(filename, { buffer, contentType });

    // Try saving to disk under public/uploads
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl, filename });
    } catch (diskErr) {
      console.warn('Could not write to public/uploads directory, using media API fallback URL:', diskErr);
      const mediaApiUrl = `/api/media/${filename}`;
      return NextResponse.json({ success: true, url: mediaApiUrl, filename });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'File upload failed' }, { status: 500 });
  }
}
