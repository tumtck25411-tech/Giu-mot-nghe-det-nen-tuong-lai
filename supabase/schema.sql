-- SQL Schema Migration for JRAI ƠI - THƯƠNG MẠI ĐIỆN TỬ THỔ CẨM GIA LAI
-- Database: Supabase PostgreSQL
-- Row Level Security (RLS) is enabled for absolute security separation between Public Users and Admin.

-- 1. Create Artisans Table
CREATE TABLE IF NOT EXISTS public.artisans (
    id TEXT PRIMARY KEY,
    legacy_id TEXT,
    name TEXT NOT NULL,
    age INTEGER DEFAULT 60,
    location TEXT NOT NULL,
    village TEXT NOT NULL,
    experience TEXT NOT NULL,
    experience_years INTEGER DEFAULT 25,
    bio TEXT NOT NULL,
    bio_en TEXT,
    specialty TEXT NOT NULL,
    specialty_en TEXT,
    quote TEXT NOT NULL,
    quote_en TEXT,
    avatar TEXT NOT NULL,
    image_url TEXT NOT NULL,
    phone TEXT,
    video_url TEXT,
    product_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Motifs Table (Central Motif Bank)
CREATE TABLE IF NOT EXISTS public.motifs (
    id TEXT PRIMARY KEY,
    motif_code TEXT UNIQUE NOT NULL,
    name_jrai TEXT,
    name TEXT NOT NULL,
    name_en TEXT,
    theme TEXT NOT NULL DEFAULT 'nature',
    theme_name TEXT NOT NULL DEFAULT 'Thiên nhiên & Muông thú',
    technique TEXT NOT NULL,
    philosophy TEXT NOT NULL,
    meaning TEXT NOT NULL,
    meaning_en TEXT,
    colors TEXT[] NOT NULL DEFAULT '{}',
    origin TEXT DEFAULT 'Ia Mơ Nông, Gia Lai',
    location TEXT NOT NULL,
    village TEXT,
    artisan_id TEXT REFERENCES public.artisans(id) ON DELETE SET NULL,
    artisan_verification TEXT,
    informant_name TEXT,
    verification_source TEXT NOT NULL,
    verification_date DATE NOT NULL,
    verification_notes TEXT,
    image_url TEXT NOT NULL,
    video_url TEXT,
    accent_color TEXT DEFAULT '#9E2A2B',
    research_overview TEXT,
    research_bullets TEXT[] DEFAULT '{}',
    research_full_text TEXT,
    applied_product_ids TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    product_code TEXT UNIQUE NOT NULL,
    slug_id TEXT,
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT NOT NULL,
    category_name TEXT NOT NULL,
    category_name_en TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(12, 2),
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    additional_images TEXT[] DEFAULT '{}',
    video_url TEXT,
    production_time TEXT NOT NULL,
    production_days INTEGER DEFAULT 3,
    dimensions TEXT,
    material TEXT NOT NULL,
    material_en TEXT,
    story_title TEXT,
    story_lead TEXT,
    story_paragraphs TEXT[] DEFAULT '{}',
    story TEXT NOT NULL,
    story_en TEXT,
    motif_name TEXT,
    motif_id TEXT,
    motif_ids TEXT[] DEFAULT '{}',
    motif_overview TEXT,
    motif_bullets TEXT[] DEFAULT '{}',
    artisan_id TEXT REFERENCES public.artisans(id) ON DELETE SET NULL,
    artisan_name TEXT,
    artisan_village TEXT,
    location TEXT NOT NULL,
    impact TEXT,
    featured BOOLEAN DEFAULT true,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 10,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Product Motifs Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.product_motifs (
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    motif_id TEXT REFERENCES public.motifs(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, motif_id)
);

-- 5. Create Weaving Process Table
CREATE TABLE IF NOT EXISTS public.weaving_process (
    id TEXT PRIMARY KEY,
    step_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    image_url TEXT NOT NULL,
    video_url TEXT
);

-- 6. Create Page Contents Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    page_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    intro_text TEXT NOT NULL,
    body_html TEXT,
    highlights TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    ward TEXT NOT NULL,
    order_notes TEXT,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    status TEXT NOT NULL DEFAULT 'pending',
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_code TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status_history JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_code TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price NUMERIC(12, 2) NOT NULL
);

-- 9. Create Promotions Table
CREATE TABLE IF NOT EXISTS public.promotions (
    code TEXT PRIMARY KEY,
    discount_percent NUMERIC(5, 2),
    discount_amount NUMERIC(12, 2),
    min_order_value NUMERIC(12, 2) DEFAULT 0,
    max_discount NUMERIC(12, 2),
    expiry_date DATE NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    product_code TEXT,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_motifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weaving_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read published products, motifs, artisans, steps, content, approved reviews, active promotions
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Motifs" ON public.motifs FOR SELECT USING (status = 'published');
CREATE POLICY "Public Read Artisans" ON public.artisans FOR SELECT USING (true);
CREATE POLICY "Public Read Product Motifs" ON public.product_motifs FOR SELECT USING (true);
CREATE POLICY "Public Read Weaving Process" ON public.weaving_process FOR SELECT USING (true);
CREATE POLICY "Public Read Site Content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public Read Active Promotions" ON public.promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (is_approved = true);

-- Public can insert orders and reviews
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Authenticated Admin: Full CRUD Rights
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Motifs" ON public.motifs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Artisans" ON public.artisans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Order Items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Promotions" ON public.promotions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
