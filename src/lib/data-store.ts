import {
  Product,
  Motif,
  Artisan,
  WeavingStep,
  PageContent,
  AdminUser,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  Promotion,
  Review,
  CustomerUser,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_MOTIFS,
  INITIAL_ARTISANS,
  INITIAL_WEAVING_STEPS,
  INITIAL_PAGE_CONTENTS,
  INITIAL_PROMOTIONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
} from './initial-data';

const STORAGE_KEYS = {
  PRODUCTS: 'jrai_products_v5',
  MOTIFS: 'jrai_motifs_v5',
  ARTISANS: 'jrai_artisans_v5',
  WEAVING_STEPS: 'jrai_weaving_steps_v5',
  PAGE_CONTENTS: 'jrai_page_contents_v5',
  PROMOTIONS: 'jrai_promotions_v5',
  ORDERS: 'jrai_orders_v5',
  REVIEWS: 'jrai_reviews_v5',
  CART: 'jrai_cart_v5',
  CUSTOMER_SESSION: 'jrai_customer_session_v5',
  CUSTOMER_USERS: 'jrai_customer_users_v5',
  ADMIN_SESSION: 'jrai_admin_session_v5',
  PUBLIC_DOMAIN: 'jrai_public_domain_v5',
  LAST_UPDATED: 'jrai_last_updated_v5',
};

// Memory fallback cache - Primary in-memory source of truth
let memoryProducts = [...INITIAL_PRODUCTS];
let memoryMotifs = [...INITIAL_MOTIFS];
let memoryArtisans = [...INITIAL_ARTISANS];
let memorySteps = [...INITIAL_WEAVING_STEPS];
let memoryPages = [...INITIAL_PAGE_CONTENTS];
let memoryPromotions = [...INITIAL_PROMOTIONS];
let memoryOrders = [...INITIAL_ORDERS];
let memoryReviews = [...INITIAL_REVIEWS];
let memoryCart: CartItem[] = [];
let memoryPublicDomain = 'https://jraioi.vn';
let isInitialSyncDone = false;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function notifyStoreUpdate(): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new Event('jrai_store_updated'));
    window.dispatchEvent(new Event('jrai_cart_updated'));
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
    console.warn(`Warning writing ${key} to localStorage:`, e);
    notifyStoreUpdate();
  }
}

// Global server synchronization
export async function syncWithServer(): Promise<void> {
  if (!isBrowser()) return;
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData) {
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
        if (Array.isArray(serverData.promotions) && serverData.promotions.length > 0) {
          memoryPromotions = serverData.promotions;
          try { localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(serverData.promotions)); } catch (_) {}
        }
        if (Array.isArray(serverData.orders) && serverData.orders.length > 0) {
          memoryOrders = serverData.orders;
          try { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(serverData.orders)); } catch (_) {}
        }
        if (Array.isArray(serverData.reviews) && serverData.reviews.length > 0) {
          memoryReviews = serverData.reviews;
          try { localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(serverData.reviews)); } catch (_) {}
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
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: memoryProducts,
        motifs: memoryMotifs,
        artisans: memoryArtisans,
        weaving_steps: memorySteps,
        page_contents: memoryPages,
        promotions: memoryPromotions,
        orders: memoryOrders,
        reviews: memoryReviews,
      }),
    });
  } catch (e) {
    console.error('Error pushing store to server:', e);
  }
}

export function initializeStoreIfNeeded(): void {
  if (!isBrowser()) return;

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

  const storedPromotions = getItem<Promotion[] | null>(STORAGE_KEYS.PROMOTIONS, null);
  if (storedPromotions && storedPromotions.length > 0) {
    memoryPromotions = storedPromotions;
  } else {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
  }

  const storedOrders = getItem<Order[] | null>(STORAGE_KEYS.ORDERS, null);
  if (storedOrders && storedOrders.length > 0) {
    memoryOrders = storedOrders;
  } else {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }

  const storedReviews = getItem<Review[] | null>(STORAGE_KEYS.REVIEWS, null);
  if (storedReviews && storedReviews.length > 0) {
    memoryReviews = storedReviews;
  } else {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }

  const storedCart = getItem<CartItem[] | null>(STORAGE_KEYS.CART, null);
  if (storedCart) {
    memoryCart = storedCart;
  }

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

export function getProductById(idOrCode: string): Product | undefined {
  const products = getProducts();
  const search = idOrCode.toLowerCase().trim();
  return products.find(
    (p) =>
      p.id.toLowerCase() === search ||
      p.product_code.toLowerCase() === search ||
      p.slug_id?.toLowerCase() === search ||
      `jrai-imn-${p.product_code.toLowerCase()}` === search ||
      search === `jrai-${p.product_code.toLowerCase()}`
  );
}

export function addProduct(product: Partial<Product> & { product_code: string; name: string }): Product {
  const products = getProducts();
  const cat = product.category || 'scarf';
  let catName = product.category_name;
  if (!catName) {
    if (cat.includes('scarf') || cat.includes('Khăn')) catName = 'Khăn quàng cổ';
    else if (cat.includes('wallet') || cat.includes('Ví')) catName = 'Ví cầm tay';
    else if (cat.includes('crossbag') || cat.includes('đeo chéo')) catName = 'Túi đeo chéo';
    else if (cat.includes('tote')) catName = 'Túi tote';
    else if (cat.includes('apron') || cat.includes('Tạp dề')) catName = 'Tạp dề';
    else if (cat.includes('dress') || cat.includes('Váy')) catName = 'Váy nữ';
    else if (cat.includes('shirt') || cat.includes('Áo')) catName = 'Áo nam';
    else if (cat.includes('gourd') || cat.includes('Bầu')) catName = 'Bầu nước';
    else catName = 'Thổ cẩm Jrai';
  }

  const newProduct: Product = {
    category: cat,
    category_name: catName,
    price: 350000,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    additional_images: [],
    video_url: '',
    production_time: '3 ngày dệt thủ công',
    material: 'Sợi bông tự nhiên nhuộm thảo mộc',
    story: '',
    artisan_id: 'A001',
    location: 'Ia Mơ Nông, Chư Păh, Gia Lai',
    motif_ids: [],
    status: 'published',
    in_stock: true,
    stock_quantity: 10,
    rating: 5,
    review_count: 1,
    ...product,
    id: product.id || product.product_code || `P${Date.now().toString().slice(-4)}`,
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
  const index = products.findIndex((p) => p.id === id || p.product_code === id);
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
  const filtered = products.filter((p) => p.id !== id && p.product_code !== id);
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
  const search = id.toLowerCase().trim();
  return motifs.find(
    (m) => m.id.toLowerCase() === search || m.motif_code.toLowerCase() === search
  );
}

export function addMotif(motif: Partial<Motif> & { motif_code: string; name: string }): Motif {
  const motifs = getMotifs();
  const newMotif: Motif = {
    theme: 'nature',
    theme_name: 'Thiên nhiên',
    technique: 'Dệt cài hoa văn nổi',
    philosophy: '',
    meaning: '',
    description: '',
    colors: ['#A93226', '#1A1A1A'],
    verification_source: 'Nghệ nhân cao tuổi làng Kép',
    verification_date: new Date().toISOString().split('T')[0],
    image_url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80',
    applied_product_ids: [],
    status: 'published',
    ...motif,
    id: motif.id || motif.motif_code || `motif-jrai-${Date.now().toString().slice(-4)}`,
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
  const index = motifs.findIndex((m) => m.id === id || m.motif_code === id);
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
  const filtered = motifs.filter((m) => m.id !== id && m.motif_code !== id);
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
  const search = id.toLowerCase().trim();
  return artisans.find(
    (a) =>
      a.id.toLowerCase() === search ||
      a.legacy_id?.toLowerCase() === search ||
      a.name.toLowerCase() === search
  );
}

export function addArtisan(artisan: Partial<Artisan> & { name: string }): Artisan {
  const artisans = getArtisans();
  const newArtisan: Artisan = {
    location: 'Ia Mơ Nông, Chư Păh, Gia Lai',
    village: 'Làng Kép',
    experience: '10+ năm kinh nghiệm',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    specialty: 'Kỹ thuật dệt luồn sợi kép truyền thống',
    quote: 'Từng đường kim mũi chỉ là tấm lòng người Jrai gửi vào tấm vải.',
    bio: '',
    product_ids: [],
    ...artisan,
    id: artisan.id || `artisan-${Date.now().toString().slice(-4)}`,
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

// ---------------- CART SYSTEM ----------------

export function getCart(): CartItem[] {
  initializeStoreIfNeeded();
  const stored = getItem<CartItem[]>(STORAGE_KEYS.CART, []);
  memoryCart = stored;
  return stored;
}

export function getCartTotal(): { count: number; subtotal: number } {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0);
  return { count, subtotal };
}

export function addToCart(product: Product, quantity: number = 1, selectedColor?: string): CartItem[] {
  const cart = getCart();
  const existingIdx = cart.findIndex((item) => item.productId === product.id);

  if (existingIdx > -1) {
    cart[existingIdx].quantity += quantity;
    if (selectedColor) cart[existingIdx].selectedColor = selectedColor;
  } else {
    cart.push({
      productId: product.id,
      product,
      quantity,
      selectedColor,
    });
  }

  memoryCart = [...cart];
  setItem(STORAGE_KEYS.CART, memoryCart);
  return memoryCart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else {
    const item = cart.find((i) => i.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }
  memoryCart = [...cart];
  setItem(STORAGE_KEYS.CART, memoryCart);
  return memoryCart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart();
  const filtered = cart.filter((item) => item.productId !== productId);
  memoryCart = filtered;
  setItem(STORAGE_KEYS.CART, filtered);
  return filtered;
}

export function clearCart(): void {
  memoryCart = [];
  setItem(STORAGE_KEYS.CART, []);
}

// ---------------- ORDERS ----------------

export function getOrders(): Order[] {
  initializeStoreIfNeeded();
  return memoryOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  const search = id.trim().toLowerCase();
  return orders.find(
    (o) => o.id.toLowerCase() === search || o.code.toLowerCase() === search
  );
}

export function getOrderByCodeAndPhone(code: string, phone: string): Order | undefined {
  const orders = getOrders();
  const searchCode = code.trim().toLowerCase();
  const searchPhone = phone.trim().replace(/\D/g, '');

  return orders.find((o) => {
    const matchesCode =
      o.code.toLowerCase() === searchCode || o.id.toLowerCase() === searchCode;
    const cleanPhone = o.customerPhone.replace(/\D/g, '');
    const matchesPhone = cleanPhone.includes(searchPhone) || searchPhone.includes(cleanPhone);
    return matchesCode && matchesPhone;
  });
}

export function createOrder(
  orderData: Partial<Order> & {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
  }
): Order {
  const orders = getOrders();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderCode = `JRAI-ORD-${randomSuffix}`;
  const now = new Date().toISOString();

  const cart = getCart();
  const currentTotal = getCartTotal();
  const fallbackItems: OrderItem[] = cart.map((it) => ({
    productId: it.productId,
    productCode: it.product?.product_code || it.productId,
    productName: it.product?.name || 'Sản phẩm thổ cẩm',
    productImage: it.product?.image_url || '/images/products/k001.jpg',
    unitPrice: it.product?.price || 0,
    quantity: it.quantity,
    totalPrice: (it.product?.price || 0) * it.quantity,
  }));

  const items = orderData.items && orderData.items.length > 0 ? orderData.items : fallbackItems;
  const subtotal = orderData.subtotal ?? currentTotal.subtotal;
  const totalAmount = orderData.totalAmount ?? subtotal;

  const newOrder: Order = {
    customerEmail: '',
    province: 'Gia Lai',
    district: 'Chư Păh',
    ward: 'Ia Mơ Nông',
    orderNotes: '',
    paymentMethod: 'banking',
    paymentStatus: 'pending',
    status: 'pending',
    items,
    subtotal,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount,
    ...orderData,
    id: orderCode,
    code: orderCode,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: orderData.status || 'pending',
        time: now,
        description:
          orderData.paymentMethod === 'banking'
            ? 'Đơn hàng được khởi tạo thành công với hình thức Chuyển khoản ngân hàng (VietQR).'
            : 'Đơn hàng được khởi tạo thành công với hình thức Thanh toán khi nhận hàng (COD).',
      },
    ],
  };

  const updatedOrders = [newOrder, ...orders];
  memoryOrders = updatedOrders;
  setItem(STORAGE_KEYS.ORDERS, updatedOrders);
  pushStoreToServer();

  // Clear cart on successful order
  clearCart();
  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId || o.code === orderId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const statusDescriptions: Record<OrderStatus, string> = {
    pending: 'Đơn hàng đang chờ bộ phận CSKH xác nhận.',
    confirmed: 'Đơn hàng đã được xác nhận thành công.',
    processing: 'Sản phẩm đang được HTX Ia Mơ Nông kiểm tra, đóng gói kèm tem số QR.',
    shipping: 'Đơn hàng đã bàn giao cho đơn vị vận chuyển phát nhanh.',
    delivered: 'Đơn hàng đã được giao thành công đến quý khách.',
    cancelled: note || 'Đơn hàng đã bị hủy.',
  };

  const currentOrder = orders[index];
  const updatedHistory = [
    ...(currentOrder.statusHistory || []),
    {
      status: newStatus,
      time: now,
      description: note || statusDescriptions[newStatus] || `Cập nhật trạng thái sang ${newStatus}`,
    },
  ];

  const updatedOrder: Order = {
    ...currentOrder,
    status: newStatus,
    updatedAt: now,
    paymentStatus: newStatus === 'delivered' ? 'paid' : currentOrder.paymentStatus,
    statusHistory: updatedHistory,
  };

  orders[index] = updatedOrder;
  memoryOrders = [...orders];
  setItem(STORAGE_KEYS.ORDERS, memoryOrders);
  pushStoreToServer();
  return updatedOrder;
}

// ---------------- PROMOTIONS ----------------

export function getPromotions(): Promotion[] {
  initializeStoreIfNeeded();
  return memoryPromotions;
}

export function validatePromotion(code: string, currentSubtotal: number): { valid: boolean; discount: number; message: string; promo?: Promotion } {
  const promos = getPromotions();
  const promo = promos.find((p) => p.code.toLowerCase() === code.trim().toLowerCase() && p.isActive);

  if (!promo) {
    return { valid: false, discount: 0, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
  }

  if (currentSubtotal < promo.minOrderValue) {
    return {
      valid: false,
      discount: 0,
      message: `Đơn hàng tối thiểu để áp dụng mã này là ${promo.minOrderValue.toLocaleString('vi-VN')}₫.`,
    };
  }

  let discount = 0;
  if (promo.discountPercent) {
    discount = Math.round((currentSubtotal * promo.discountPercent) / 100);
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }
  } else if (promo.discountAmount) {
    discount = promo.discountAmount;
  }

  return {
    valid: true,
    discount,
    message: `Áp dụng mã ${promo.code} thành công: giảm ${discount.toLocaleString('vi-VN')}₫!`,
    promo,
  };
}

// ---------------- REVIEWS ----------------

export function getReviews(productId?: string): Review[] {
  initializeStoreIfNeeded();
  if (productId) {
    return memoryReviews.filter(
      (r) =>
        r.isApproved &&
        (r.productId.toLowerCase() === productId.toLowerCase() ||
          r.productCode?.toLowerCase() === productId.toLowerCase())
    );
  }
  return memoryReviews;
}

export function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Review {
  const reviews = getItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const newRev: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isApproved: true, // auto approve verified reviews
  };
  const updated = [newRev, ...reviews];
  memoryReviews = updated;
  setItem(STORAGE_KEYS.REVIEWS, updated);
  pushStoreToServer();
  return newRev;
}

// ---------------- CUSTOMER AUTHENTICATION ----------------

export function getCustomerUsers(): CustomerUser[] {
  return getItem<CustomerUser[]>(STORAGE_KEYS.CUSTOMER_USERS, [
    {
      id: "cust-1",
      name: "Nguyễn Hoàng Minh",
      email: "minh.nguyen@example.com",
      phone: "0912345678",
      wishlist: ["K001", "B001", "C001"],
      createdAt: "2026-10-01T00:00:00.000Z",
    }
  ]);
}

export function getCustomerSession(): CustomerUser | null {
  return getItem<CustomerUser | null>(STORAGE_KEYS.CUSTOMER_SESSION, null);
}

export function loginCustomer(emailOrPhone: string): CustomerUser {
  const users = getCustomerUsers();
  const clean = emailOrPhone.trim().toLowerCase();
  let user = users.find((u) => u.email.toLowerCase() === clean || u.phone === clean);

  if (!user) {
    // Quick login or create guest customer account
    user = {
      id: `cust-${Date.now()}`,
      name: clean.includes('@') ? clean.split('@')[0] : `Khách hàng ${clean.slice(-4)}`,
      email: clean.includes('@') ? clean : `${clean}@customer.jraioi.vn`,
      phone: clean.includes('@') ? '0900000000' : clean,
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    setItem(STORAGE_KEYS.CUSTOMER_USERS, users);
  }

  setItem(STORAGE_KEYS.CUSTOMER_SESSION, user);
  return user;
}

export function registerCustomer(name: string, email: string, phone: string): CustomerUser {
  const users = getCustomerUsers();
  const user: CustomerUser = {
    id: `cust-${Date.now()}`,
    name,
    email,
    phone,
    wishlist: [],
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  setItem(STORAGE_KEYS.CUSTOMER_USERS, users);
  setItem(STORAGE_KEYS.CUSTOMER_SESSION, user);
  notifyStoreUpdate();
  return user;
}

export function loginSocialCustomer(
  provider: 'google' | 'facebook',
  profile?: { name?: string; email?: string; avatar?: string; phone?: string }
): CustomerUser {
  const users = getCustomerUsers();
  const defaultName = provider === 'google' ? 'Mai Thị Cẩm Tú' : 'Cẩm Tú (Jrai Craft)';
  const defaultEmail = provider === 'google' ? 'camtu.jrai@gmail.com' : 'camtu.facebook@social.jraioi.vn';
  const defaultAvatar = provider === 'google' 
    ? '/images/team/MaiThiCamTu_user.png' 
    : '/images/team/MaiThiCamTu_user.png';

  const name = profile?.name || defaultName;
  const email = profile?.email || defaultEmail;
  const phone = profile?.phone || '0383451929';
  const avatar = profile?.avatar || defaultAvatar;

  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.avatar = avatar;
    user.provider = provider;
  } else {
    user = {
      id: `cust-${provider}-${Date.now()}`,
      name,
      email,
      phone,
      avatar,
      provider,
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  setItem(STORAGE_KEYS.CUSTOMER_USERS, users);
  setItem(STORAGE_KEYS.CUSTOMER_SESSION, user);
  notifyStoreUpdate();
  return user;
}


export function logoutCustomer(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_SESSION);
  notifyStoreUpdate();
}

export function toggleWishlist(productId: string): boolean {
  const customer = getCustomerSession();
  const wishKey = 'jrai_guest_wishlist';
  let wishlist: string[] = customer ? customer.wishlist || [] : getItem<string[]>(wishKey, []);

  let isAdded = false;
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
    isAdded = false;
  } else {
    wishlist.push(productId);
    isAdded = true;
  }

  if (customer) {
    customer.wishlist = wishlist;
    setItem(STORAGE_KEYS.CUSTOMER_SESSION, customer);
    const users = getCustomerUsers();
    const idx = users.findIndex((u) => u.id === customer.id);
    if (idx > -1) {
      users[idx].wishlist = wishlist;
      setItem(STORAGE_KEYS.CUSTOMER_USERS, users);
    }
  } else {
    setItem(wishKey, wishlist);
  }

  notifyStoreUpdate();
  return isAdded;
}

export function isInWishlist(productId: string): boolean {
  const customer = getCustomerSession();
  if (customer) {
    return (customer.wishlist || []).includes(productId);
  }
  const guestWishlist = getItem<string[]>('jrai_guest_wishlist', []);
  return guestWishlist.includes(productId);
}

// ---------------- ADMIN AUTHENTICATION ----------------

export function loginAdmin(usernameInput: string, passwordInput: string): AdminUser | null {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (
    (cleanUsername === 'admin' && cleanPassword === 'admin123') ||
    (cleanUsername === 'detnentuonglai' && cleanPassword === 'jrai2026') ||
    (cleanUsername === 'jraioi' && cleanPassword === 'jraioi2026')
  ) {
    const adminUser: AdminUser = {
      username: cleanUsername,
      role: 'admin',
      name: 'Quản trị viên JRAI ƠI',
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
  notifyStoreUpdate();
}
