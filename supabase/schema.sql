-- ==========================================================
-- SIPENAS - SISTEM PENGADUAN SISWA SMAN 11 SEMARANG
-- SCHEMA DATABASE & STORAGE SUPABASE
-- ==========================================================

-- 1. Buat Tabel Pengaduan
CREATE TABLE IF NOT EXISTS public.pengaduan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nomor_tiket VARCHAR(30) UNIQUE NOT NULL,
    nama VARCHAR(150),
    nis VARCHAR(50),
    is_anonim BOOLEAN DEFAULT false NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    foto_url TEXT,
    status VARCHAR(30) DEFAULT 'menunggu' NOT NULL 
        CHECK (status IN ('menunggu', 'review', 'tindak_lanjut', 'selesai', 'ditolak')),
    tanggapan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Index untuk pencarian cepat berdasarkan nomor tiket
CREATE INDEX IF NOT EXISTS idx_pengaduan_tiket ON public.pengaduan(nomor_tiket);
CREATE INDEX IF NOT EXISTS idx_pengaduan_created ON public.pengaduan(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Siswa (publik) dapat mengirim aduan baru
CREATE POLICY "Siswa dapat membuat aduan" 
ON public.pengaduan FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Kebijakan: Siapa saja dapat melacak aduan miliknya via nomor tiket
CREATE POLICY "Siswa dapat melihat status tiket aduan" 
ON public.pengaduan FOR SELECT 
TO anon, authenticated
USING (true);

-- Kebijakan: Hanya admin terautentikasi yang dapat mengubah status & memberi tanggapan
CREATE POLICY "Admin dapat update aduan" 
ON public.pengaduan FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Setup Storage Bucket untuk Foto Bukti
INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti-aduan', 'bukti-aduan', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Upload ke Bucket bukti-aduan
CREATE POLICY "Siswa dapat upload foto bukti"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'bukti-aduan');

CREATE POLICY "Foto bukti dapat dilihat publik"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'bukti-aduan');
