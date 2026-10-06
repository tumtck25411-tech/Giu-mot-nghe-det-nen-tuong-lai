export interface Product {
  id: string;
  product_code: string; // e.g. JRAI-P001
  name: string;
  category: string; // e.g. Túi xách, Váy, Khăn, Ví, Thảm
  description: string;
  image_url: string;
  additional_images?: string[];
  video_url?: string;
  production_time: string; // e.g. 7 ngày
  story: string;
  location: string; // e.g. Ia Mơ Nông, Chư Păh, Gia Lai
  artisan_id: string;
  status: 'draft' | 'published';
  motif_ids: string[]; // Linked motif IDs (JRAI-001, JRAI-003...)
  created_at: string;
  updated_at: string;
}

export interface Motif {
  id: string;
  motif_code: string; // e.g. JRAI-001
  name: string;
  description: string;
  meaning: string;
  colors: string[]; // e.g. ["Đỏ đất", "Đen chì", "Vàng nghệ"]
  origin: string; // e.g. Gia Lai, Kon Tum
  location: string;
  artisan_id?: string;
  informant_name?: string; // Người cung cấp thông tin
  verification_source: string; // Nguồn xác minh
  verification_date: string;
  verification_notes?: string;
  image_url: string;
  video_url?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Artisan {
  id: string;
  name: string;
  location: string; // e.g. Làng Kép, xã Ia Mơ Nông, huyện Chư Păh, tỉnh Gia Lai
  experience: string; // e.g. 35 năm dệt thổ cẩm
  bio: string;
  image_url: string;
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
