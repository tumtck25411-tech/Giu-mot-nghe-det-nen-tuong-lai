-- SQL Schema Migration for DỆT NÊN TƯƠNG LAI - NGÂN HÀNG SỐ HOA VĂN JRAI
-- Database: Supabase PostgreSQL
-- Row Level Security (RLS) is enabled for absolute security separation between Public Users and Admin.

-- 1. Create Artisans Table
CREATE TABLE IF NOT EXISTS public.artisans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    experience TEXT NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Motifs Table (Central Motif Bank)
CREATE TABLE IF NOT EXISTS public.motifs (
    id TEXT PRIMARY KEY,
    motif_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    meaning TEXT NOT NULL,
    colors TEXT[] NOT NULL DEFAULT '{}',
    origin TEXT NOT NULL,
    location TEXT NOT NULL,
    artisan_id TEXT REFERENCES public.artisans(id) ON DELETE SET NULL,
    informant_name TEXT,
    verification_source TEXT NOT NULL,
    verification_date DATE NOT NULL,
    verification_notes TEXT,
    image_url TEXT NOT NULL,
    video_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    additional_images TEXT[] DEFAULT '{}',
    video_url TEXT,
    production_time TEXT NOT NULL,
    story TEXT NOT NULL,
    location TEXT NOT NULL,
    artisan_id TEXT REFERENCES public.artisans(id) ON DELETE SET NULL,
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

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_motifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weaving_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 1. Public Users (anon): Can ONLY SELECT published data
CREATE POLICY "Public Read Published Products" ON public.products
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public Read Published Motifs" ON public.motifs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public Read Artisans" ON public.artisans
    FOR SELECT USING (true);

CREATE POLICY "Public Read Product Motifs" ON public.product_motifs
    FOR SELECT USING (true);

CREATE POLICY "Public Read Weaving Process" ON public.weaving_process
    FOR SELECT USING (true);

CREATE POLICY "Public Read Site Content" ON public.site_content
    FOR SELECT USING (true);

-- 2. Authenticated Admin: Full CRUD Rights
CREATE POLICY "Admin Full Access Products" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Motifs" ON public.motifs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Artisans" ON public.artisans
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Product Motifs" ON public.product_motifs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Weaving Process" ON public.weaving_process
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin Full Access Site Content" ON public.site_content
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
