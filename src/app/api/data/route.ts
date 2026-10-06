import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS, INITIAL_MOTIFS, INITIAL_ARTISANS, INITIAL_WEAVING_STEPS, INITIAL_PAGE_CONTENTS } from '@/lib/initial-data';
import { Product, Motif, Artisan, WeavingStep, PageContent } from '@/types';

export interface ServerStoreData {
  products: Product[];
  motifs: Motif[];
  artisans: Artisan[];
  weaving_steps: WeavingStep[];
  page_contents: PageContent[];
  updated_at: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data-store.json');

// Global in-memory cache to retain state across API calls in Node server process
let inMemoryStore: ServerStoreData | null = null;

function loadStoreFromFileOrInitial(): ServerStoreData {
  // Always try reading local data-store.json file first
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileContent);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        inMemoryStore = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading data-store.json:', err);
  }

  // Fallback to authentic initial data
  const initialStore: ServerStoreData = {
    products: INITIAL_PRODUCTS,
    motifs: INITIAL_MOTIFS,
    artisans: INITIAL_ARTISANS,
    weaving_steps: INITIAL_WEAVING_STEPS,
    page_contents: INITIAL_PAGE_CONTENTS,
    updated_at: new Date().toISOString(),
  };

  inMemoryStore = initialStore;
  return initialStore;
}

export async function GET() {
  const store = loadStoreFromFileOrInitial();
  return NextResponse.json(store, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = loadStoreFromFileOrInitial();

    const updatedStore: ServerStoreData = {
      products: body.products ?? current.products,
      motifs: body.motifs ?? current.motifs,
      artisans: body.artisans ?? current.artisans,
      weaving_steps: body.weaving_steps ?? current.weaving_steps,
      page_contents: body.page_contents ?? current.page_contents,
      updated_at: new Date().toISOString(),
    };

    inMemoryStore = updatedStore;

    // Persist to disk if allowed
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedStore, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not persist data-store.json to disk:', err);
    }

    return NextResponse.json({ success: true, store: updatedStore }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Invalid JSON request' }, { status: 400 });
  }
}
