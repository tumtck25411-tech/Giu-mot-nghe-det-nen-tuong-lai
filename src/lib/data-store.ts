import { Product, Motif, Artisan, WeavingStep, PageContent, AdminUser } from '../types';
import { INITIAL_PRODUCTS, INITIAL_MOTIFS, INITIAL_ARTISANS, INITIAL_WEAVING_STEPS, INITIAL_PAGE_CONTENTS } from './initial-data';

const STORAGE_KEYS = {
  PRODUCTS: 'jrai_products_v4',
  MOTIFS: 'jrai_motifs_v4',
  ARTISANS: 'jrai_artisans_v4',
  WEAVING_STEPS: 'jrai_weaving_steps_v4',
  PAGE_CONTENTS: 'jrai_page_contents_v4',
  ADMIN_SESSION: 'jrai_admin_session_v4',
  PUBLIC_DOMAIN: 'jrai_public_domain_v4',
  LAST_UPDATED: 'jrai_last_updated_v4',
};

// Memory fallback cache - Primary in-memory source of truth
let memoryProducts = [...INITIAL_PRODUCTS];
let memoryMotifs = [...INITIAL_MOTIFS];
let memoryArtisans = [...INITIAL_ARTISANS];
let memorySteps = [...INITIAL_WEAVING_STEPS];
let memoryPages = [...INITIAL_PAGE_CONTENTS];
let memoryPublicDomain = 'https://det-nen-tuong-lai.vercel.app';
let isInitialSyncDone = false;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function notifyStoreUpdate(): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new Event('jrai_store_updated'));
  } catch (e) {
    console.error('Error dispatching store update event', e);
  }
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, Date.now().toString());
    notifyStoreUpdate();
  } catch (e) {
    console.warn(`Warning writing ${key} to localStorage (quota or disabled):`, e);
    notifyStoreUpdate();
  }
}

function getLocalLastUpdated(): number {
  if (!isBrowser()) return 0;
  const val = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
  return val ? parseInt(val, 10) : 0;
}

// Global server synchronization with timestamp safety guard
export async function syncWithServer(): Promise<void> {
  if (!isBrowser()) return;
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData) {
        // Apply server updates to in-memory cache and localStorage
        if (Array.isArray(serverData.products) && serverData.products.length > 0) {
          memoryProducts = serverData.products;
          try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(serverData.products)); } catch (_) {}
        }
        if (Array.isArray(serverData.motifs) && serverData.motifs.length > 0) {
          memoryMotifs = serverData.motifs;
          try { localStorage.setItem(STORAGE_KEYS.MOTIFS, JSON.stringify(serverData.motifs)); } catch (_) {}
        }
        if (Array.isArray(serverData.artisans) && serverData.artisans.length > 0) {
          memoryArtisans = serverData.artisans;
          try { localStorage.setItem(STORAGE_KEYS.ARTISANS, JSON.stringify(serverData.artisans)); } catch (_) {}
        }
        if (Array.isArray(serverData.weaving_steps) && serverData.weaving_steps.length > 0) {
          memorySteps = serverData.weaving_steps;
          try { localStorage.setItem(STORAGE_KEYS.WEAVING_STEPS, JSON.stringify(serverData.weaving_steps)); } catch (_) {}
        }
        if (Array.isArray(serverData.page_contents) && serverData.page_contents.length > 0) {
          memoryPages = serverData.page_contents;
          try { localStorage.setItem(STORAGE_KEYS.PAGE_CONTENTS, JSON.stringify(serverData.page_contents)); } catch (_) {}
        }
        notifyStoreUpdate();
      }
    }
  } catch (e) {
    console.error('Error syncing store with server:', e);
  }
}

export async function pushStoreToServer(): Promise<void> {
  if (!isBrowser()) return;
  try {
    // ALWAYS use live in-memory variables as primary source of truth
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: memoryProducts,
        motifs: memoryMotifs,
        artisans: memoryArtisans,
        weaving_steps: memorySteps,
        page_contents: memoryPages,
      }),
    });
  } catch (e) {
    console.error('Error pushing store to server:', e);
  }
}

export function initializeStoreIfNeeded(): void {
  if (!isBrowser()) return;
  
  // Read from localStorage into memory on startup if present
  const storedProducts = getItem<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (storedProducts && storedProducts.length > 0) {
    memoryProducts = storedProducts;
  } else {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }

  const storedMotifs = getItem<Motif[] | null>(STORAGE_KEYS.MOTIFS, null);
  if (storedMotifs && storedMotifs.length > 0) {
    memoryMotifs = storedMotifs;
  } else {
    localStorage.setItem(STORAGE_KEYS.MOTIFS, JSON.stringify(INITIAL_MOTIFS));
  }

  const storedArtisans = getItem<Artisan[] | null>(STORAGE_KEYS.ARTISANS, null);
  if (storedArtisans && storedArtisans.length > 0) {
    memoryArtisans = storedArtisans;
  } else {
    localStorage.setItem(STORAGE_KEYS.ARTISANS, JSON.stringify(INITIAL_ARTISANS));
  }

  const storedSteps = getItem<WeavingStep[] | null>(STORAGE_KEYS.WEAVING_STEPS, null);
  if (storedSteps && storedSteps.length > 0) {
    memorySteps = storedSteps;
  } else {
    localStorage.setItem(STORAGE_KEYS.WEAVING_STEPS, JSON.stringify(INITIAL_WEAVING_STEPS));
  }

  const storedPages = getItem<PageContent[] | null>(STORAGE_KEYS.PAGE_CONTENTS, null);
  if (storedPages && storedPages.length > 0) {
    memoryPages = storedPages;
  } else {
    localStorage.setItem(STORAGE_KEYS.PAGE_CONTENTS, JSON.stringify(INITIAL_PAGE_CONTENTS));
  }

  // Trigger background sync with central server API
  if (!isInitialSyncDone) {
    isInitialSyncDone = true;
    syncWithServer();
  }
}

// ---------------- PUBLIC DOMAIN FOR QR ----------------

export function getPublicDomain(): string {
  if (!isBrowser()) return memoryPublicDomain;
  const stored = getItem<string>(STORAGE_KEYS.PUBLIC_DOMAIN, '');
  if (stored) return stored;
  return window.location.origin || memoryPublicDomain;
}

export function setPublicDomain(domain: string): void {
  let cleanDomain = domain.trim();
  if (cleanDomain && !cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
    cleanDomain = `https://${cleanDomain}`;
  }
  setItem(STORAGE_KEYS.PUBLIC_DOMAIN, cleanDomain);
  memoryPublicDomain = cleanDomain;
}

// ---------------- PRODUCTS ----------------

export function getProducts(publishedOnly: boolean = false): Product[] {
  initializeStoreIfNeeded();
  if (publishedOnly) {
    return memoryProducts.filter((p) => p.status === 'published');
  }
  return memoryProducts;
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id || p.product_code.toLowerCase() === id.toLowerCase());
}

export function addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const updated = [newProduct, ...products];
  memoryProducts = updated;
  setItem(STORAGE_KEYS.PRODUCTS, updated);
  pushStoreToServer();
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProduct = {
    ...products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  products[index] = updatedProduct;
  memoryProducts = [...products];
  setItem(STORAGE_KEYS.PRODUCTS, memoryProducts);
  pushStoreToServer();
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  memoryProducts = filtered;
  setItem(STORAGE_KEYS.PRODUCTS, filtered);
  pushStoreToServer();
  return true;
}

// ---------------- MOTIFS ----------------

export function getMotifs(publishedOnly: boolean = false): Motif[] {
  initializeStoreIfNeeded();
  if (publishedOnly) {
    return memoryMotifs.filter((m) => m.status === 'published');
  }
  return memoryMotifs;
}

export function getMotifById(id: string): Motif | undefined {
  const motifs = getMotifs();
  return motifs.find(
    (m) => m.id === id || m.motif_code.toLowerCase() === id.toLowerCase()
  );
}

export function addMotif(motif: Omit<Motif, 'id' | 'created_at' | 'updated_at'>): Motif {
  const motifs = getMotifs();
  const newMotif: Motif = {
    ...motif,
    id: `motif-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const updated = [newMotif, ...motifs];
  memoryMotifs = updated;
  setItem(STORAGE_KEYS.MOTIFS, updated);
  pushStoreToServer();
  return newMotif;
}

export function updateMotif(id: string, updates: Partial<Motif>): Motif | null {
  const motifs = getMotifs();
  const index = motifs.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updatedMotif = {
    ...motifs[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  motifs[index] = updatedMotif;
  memoryMotifs = [...motifs];
  setItem(STORAGE_KEYS.MOTIFS, memoryMotifs);
  pushStoreToServer();
  return updatedMotif;
}

export function deleteMotif(id: string): boolean {
  const motifs = getMotifs();
  const filtered = motifs.filter((m) => m.id !== id);
  if (filtered.length === motifs.length) return false;
  memoryMotifs = filtered;
  setItem(STORAGE_KEYS.MOTIFS, filtered);
  pushStoreToServer();
  return true;
}

// ---------------- ARTISANS ----------------

export function getArtisans(): Artisan[] {
  initializeStoreIfNeeded();
  return memoryArtisans;
}

export function getArtisanById(id: string): Artisan | undefined {
  const artisans = getArtisans();
  return artisans.find((a) => a.id === id);
}

export function addArtisan(artisan: Omit<Artisan, 'id' | 'created_at' | 'updated_at'>): Artisan {
  const artisans = getArtisans();
  const newArtisan: Artisan = {
    ...artisan,
    id: `artisan-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const updated = [newArtisan, ...artisans];
  memoryArtisans = updated;
  setItem(STORAGE_KEYS.ARTISANS, updated);
  pushStoreToServer();
  return newArtisan;
}

export function updateArtisan(id: string, updates: Partial<Artisan>): Artisan | null {
  const artisans = getArtisans();
  const index = artisans.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedArtisan = {
    ...artisans[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  artisans[index] = updatedArtisan;
  memoryArtisans = [...artisans];
  setItem(STORAGE_KEYS.ARTISANS, memoryArtisans);
  pushStoreToServer();
  return updatedArtisan;
}

export function deleteArtisan(id: string): boolean {
  const artisans = getArtisans();
  const filtered = artisans.filter((a) => a.id !== id);
  if (filtered.length === artisans.length) return false;
  memoryArtisans = filtered;
  setItem(STORAGE_KEYS.ARTISANS, filtered);
  pushStoreToServer();
  return true;
}

// ---------------- WEAVING STEPS ----------------

export function getWeavingSteps(): WeavingStep[] {
  initializeStoreIfNeeded();
  return memorySteps.sort((a, b) => a.step_number - b.step_number);
}

export function updateWeavingStep(id: string, updates: Partial<WeavingStep>): WeavingStep | null {
  const steps = getWeavingSteps();
  const index = steps.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const updatedStep = {
    ...steps[index],
    ...updates,
  };
  steps[index] = updatedStep;
  memorySteps = [...steps];
  setItem(STORAGE_KEYS.WEAVING_STEPS, memorySteps);
  pushStoreToServer();
  return updatedStep;
}

// ---------------- SITE CONTENTS ----------------

export function getPageContent(pageKey: 'home' | 'about_brocade' | 'about_project'): PageContent | undefined {
  initializeStoreIfNeeded();
  return memoryPages.find((p) => p.page_key === pageKey);
}

export function updatePageContent(pageKey: 'home' | 'about_brocade' | 'about_project', updates: Partial<PageContent>): PageContent | null {
  initializeStoreIfNeeded();
  const index = memoryPages.findIndex((p) => p.page_key === pageKey);
  if (index === -1) return null;

  const updatedPage = {
    ...memoryPages[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  memoryPages[index] = updatedPage;
  setItem(STORAGE_KEYS.PAGE_CONTENTS, memoryPages);
  pushStoreToServer();
  return updatedPage;
}

// ---------------- ADMIN AUTHENTICATION ----------------

export function loginAdmin(usernameInput: string, passwordInput: string): AdminUser | null {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (
    (cleanUsername === 'admin' && cleanPassword === 'admin123') ||
    (cleanUsername === 'detnentuonglai' && cleanPassword === 'jrai2026')
  ) {
    const adminUser: AdminUser = {
      username: cleanUsername,
      role: 'admin',
      name: 'Quản trị viên Jrai',
    };
    setItem(STORAGE_KEYS.ADMIN_SESSION, adminUser);
    return adminUser;
  }
  return null;
}

export function getAdminSession(): AdminUser | null {
  return getItem<AdminUser | null>(STORAGE_KEYS.ADMIN_SESSION, null);
}

export function logoutAdmin(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}
