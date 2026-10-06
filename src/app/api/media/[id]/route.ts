import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { globalMediaCache } from '@/lib/media-cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 1. Check in-memory media cache
  const cached = globalMediaCache.get(id);
  if (cached) {
    return new NextResponse(Uint8Array.from(cached.buffer), {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 2. Check public/uploads directory
  const uploadsFilePath = path.join(process.cwd(), 'public', 'uploads', id);
  if (fs.existsSync(uploadsFilePath)) {
    try {
      const fileBuffer = fs.readFileSync(uploadsFilePath);
      const ext = path.extname(id).toLowerCase();
      let contentType = 'application/octet-stream';
      if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.mp4') contentType = 'video/mp4';
      else if (ext === '.webm') contentType = 'video/webm';
      else if (ext === '.mov') contentType = 'video/quicktime';

      return new NextResponse(Uint8Array.from(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (err) {
      console.error('Error reading upload media file:', err);
    }
  }

  return new NextResponse('File Not Found', { status: 404 });
}
