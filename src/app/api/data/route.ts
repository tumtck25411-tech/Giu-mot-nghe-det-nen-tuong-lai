import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  INITIAL_PRODUCTS,
  INITIAL_MOTIFS,
  INITIAL_ARTISANS,
  INITIAL_WEAVING_STEPS,
  INITIAL_PAGE_CONTENTS,
  INITIAL_PROMOTIONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
} from '@/lib/initial-data';
import { Product, Motif, Artisan, WeavingStep, PageContent, Promotion, Order, Review } from '@/types';

export interface ServerStoreData {
  products: Product[];
  motifs: Motif[];
  artisans: Artisan[];
  weaving_steps: WeavingStep[];
  page_contents: PageContent[];
  promotions: Promotion[];
  orders: Order[];
  reviews: Review[];
  updated_at: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data-store.json');

// Global in-memory cache to retain state across API calls in Node server process
let inMemoryStore: ServerStoreData | null = null;

function loadStoreFromFileOrInitial(): ServerStoreData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileContent);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        inMemoryStore = {
          products: parsed.products,
          motifs: parsed.motifs || INITIAL_MOTIFS,
          artisans: parsed.artisans || INITIAL_ARTISANS,
          weaving_steps: parsed.weaving_steps || INITIAL_WEAVING_STEPS,
          page_contents: parsed.page_contents || INITIAL_PAGE_CONTENTS,
          promotions: parsed.promotions || INITIAL_PROMOTIONS,
          orders: parsed.orders || INITIAL_ORDERS,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          updated_at: parsed.updated_at || new Date().toISOString(),
        };
        return inMemoryStore;
      }
    }
  } catch (err) {
    console.error('Error reading data-store.json:', err);
  }

  const initialStore: ServerStoreData = {
    products: INITIAL_PRODUCTS,
    motifs: INITIAL_MOTIFS,
    artisans: INITIAL_ARTISANS,
    weaving_steps: INITIAL_WEAVING_STEPS,
    page_contents: INITIAL_PAGE_CONTENTS,
    promotions: INITIAL_PROMOTIONS,
    orders: INITIAL_ORDERS,
    reviews: INITIAL_REVIEWS,
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
      promotions: body.promotions ?? current.promotions,
      orders: body.orders ?? current.orders,
      reviews: body.reviews ?? current.reviews,
      updated_at: new Date().toISOString(),
    };

    inMemoryStore = updatedStore;

    // Persist to disk
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedStore, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not persist data-store.json to disk:', err);
    }

    return NextResponse.json(
      { success: true, store: updatedStore },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Invalid JSON request' },
      { status: 400 }
    );
  }
}
