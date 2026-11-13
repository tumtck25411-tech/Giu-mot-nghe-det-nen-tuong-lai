export interface Product {
  id: string;
  product_code: string; // e.g. B001, K001, JRAI-IMN-001
  slug_id?: string;
  name: string;
  name_en?: string;
  category: 'scarf' | 'wallet' | 'crossbag' | 'tote' | 'apron' | 'dress' | 'shirt' | 'gourd' | string;
  category_name: string; // "Khăn quàng cổ", "Ví cầm tay", "Túi đeo chéo", "Túi tote", "Tạp dề", "Váy nữ", "Áo nam", "Bầu nước"
  category_name_en?: string;
  price: number;
  original_price?: number;
  description: string;
  image_url: string;
  additional_images?: string[];
  video_url?: string;
  production_time: string; // e.g. "3 ngày dệt tay tỉ mỉ"
  production_days?: number;
  dimensions?: string;
  material: string;
  material_en?: string;
  story_title?: string;
  story_lead?: string;
  story_paragraphs?: string[];
  story: string;
  story_en?: string;
  motif_name?: string;
  motif_id?: string;
  motif_ids: string[];
  motif_overview?: string;
  motif_bullets?: string[];
  artisan_id: string;
  artisan_name?: string;
  artisan_village?: string;
  location: string;
  impact?: string;
  status: 'draft' | 'published';
  featured?: boolean;
  in_stock: boolean;
  stock_quantity: number;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Motif {
  id: string;
  motif_code: string; // e.g. JRAI-001
  name_jrai?: string;
  name: string;
  name_en?: string;
  theme: 'nature' | 'life' | 'spiritual' | string;
  theme_name: string;
  technique: string;
  philosophy: string;
  meaning: string;
  description?: string;
  meaning_en?: string;
  colors: string[];
  origin?: string;
  location?: string;
  artisan_id?: string;
  artisan_verification?: string;
  informant_name?: string;
  village?: string;
  verification_source: string;
  verification_date: string;
  verification_notes?: string;
  image_url: string;
  video_url?: string;
  accent_color?: string;
  research_overview?: string;
  research_bullets?: string[];
  research_full_text?: string;
  applied_product_ids: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Artisan {
  id: string;
  legacy_id?: string;
  name: string;
  age?: number;
  location: string;
  village: string;
  experience: string;
  experience_years?: number;
  avatar?: string;
  image_url: string;
  specialty: string;
  specialty_en?: string;
  quote: string;
  quote_en?: string;
  bio: string;
  bio_en?: string;
  product_ids: string[];
  phone?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface WeavingStep {
  id: string;
  step_number: number; // 1 to 13
  title: string;
  description: string;
  details?: string;
  image_url?: string;
  video_url?: string;
}

export interface PageContent {
  id: string;
  page_key: 'home' | 'about_brocade' | 'about_project';
  title: string;
  subtitle?: string;
  intro_text: string;
  body_html?: string;
  highlights?: string[];
  updated_at: string;
}

export interface AdminUser {
  username: string;
  role: 'admin';
  name: string;
}

// ---------------- E-COMMERCE TYPES ----------------

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'pending'     // Chờ xác nhận
  | 'confirmed'   // Đã xác nhận
  | 'processing'  // Đang chuẩn bị hàng
  | 'shipping'    // Đang giao hàng
  | 'delivered'   // Đã giao hàng
  | 'cancelled';  // Đã hủy

export interface OrderStatusHistory {
  status: OrderStatus;
  time: string;
  description: string;
}

export interface Order {
  id: string; // e.g. "JRAI-ORD-68219"
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  province: string;
  district: string;
  ward: string;
  orderNotes?: string;
  paymentMethod: 'cod' | 'banking';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  discountCode?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
}

export interface Promotion {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  description: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productCode?: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  provider?: 'local' | 'google' | 'facebook';
  password?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  wishlist: string[];
  createdAt: string;
}

