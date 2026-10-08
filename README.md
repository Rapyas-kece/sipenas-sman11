# SIPENAS - Sistem Pengaduan Siswa SMAN 11 Semarang

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Enabled-orange?style=for-the-badge)

Platform resmi pengaduan dan aspirasi bagi siswa/siswi **SMAN 11 Semarang (SMANSE)**. Dibangun menggunakan arsitektur modern **Vite + React 19** dan terintegrasi dengan **Supabase (PostgreSQL & Cloud Media Storage)** untuk menampung keluhan dan bukti foto secara aman dan terenkripsi.

---

## 🌐 Live Akses & Repositori
* **Repositori GitHub:** [https://github.com/Rapyas-kece/sipenas-sman11](https://github.com/Rapyas-kece/sipenas-sman11)
* **Website Pengaduan Siswa:** [https://rapyas-kece.github.io/sipenas-sman11/](https://rapyas-kece.github.io/sipenas-sman11/)
* **Portal Khusus Guru BK & Admin:** [https://rapyas-kece.github.io/sipenas-sman11/admin.html](https://rapyas-kece.github.io/sipenas-sman11/admin.html) *(PIN Default: `smanse11`)*

---

## ✨ Fitur Utama
1. **Formulir Pengaduan Siswa (Website Publik):**
   - Halaman bersih khusus siswa (`index.html`) tanpa tombol atau akses admin terlihat.
   - Input Nama, NIS, Kelas, Judul, dan Isi Aduan dengan opsi Anonimitas Penuh.
   - Upload Foto Bukti dengan preview gambar dan validasi ukuran (maks. 5MB).
   - Animasi konfeti perayaan & notifikasi ramah setelah aduan terkirim.
2. **Portal Terpisah Guru BK & Admin (`admin.html`):**
   - Halaman terpisah khusus pihak sekolah dengan proteksi PIN keamanan (`smanse11`).
   - Kartu statistik (KPI): Total Aduan, Menunggu Respon, Sedang Diproses, Selesai Ditangani.
   - Pencarian instan dan filter multi-kategori (berdasarkan tingkat kelas X/XI/XII dan status aduan).
   - Modal detail keluhan dengan pratinjau foto resolusi penuh.
   - Fitur update status penanganan & input catatan/tanggapan guru BK.
   - Fitur **Export ke Excel / CSV** untuk pembuatan laporan berkas pengaduan sekolah.
3. **Database & Cloud Storage (Supabase):**
   - Tabel PostgreSQL `public.pengaduan` dengan proteksi Row Level Security (RLS).
   - Storage Bucket `bukti-aduan` untuk menyimpan file gambar bukti secara aman.
   - Terintegrasi langsung dengan Supabase Cloud & dilengkapi local fallback.

---

## 📁 Struktur Direktori Proyek
```text
smanse_web/
├── public/                 # Aset statis (Logo SMAN 11, Logo SIPENAS)
├── src/
│   ├── components/         # Komponen UI modular
│   │   ├── Header.jsx      # Navigasi siswa (Beranda & Buat Aduan)
│   │   ├── Hero.jsx        # Headline & logo SIPENAS resmi
│   │   ├── FormAduan.jsx   # Form aduan siswa + upload bukti + confetti
│   │   ├── AdminDashboard.jsx # Dashboard rekap aduan, filter, & export guru BK
│   │   ├── CaraKerja.jsx   # Alur pengaduan 3 langkah
│   │   ├── Privasi.jsx     # Jaminan privasi dan kerahasiaan
│   │   └── Footer.jsx      # Footer resmi sekolah
│   ├── lib/
│   │   └── supabase.js     # Supabase client SDK & API helper admin
│   ├── App.jsx             # Root layout web siswa
│   ├── admin.jsx           # Entry point halaman portal admin guru
│   ├── index.css           # Sistem desain modern, variables & animasi
│   └── main.jsx            # Entry point web siswa
├── admin.html              # Halaman terpisah khusus Guru BK & Admin
├── index.html              # Halaman utama web siswa
├── supabase/
│   └── schema.sql          # Skrip SQL tabel, RLS, & storage bucket
├── .env.example            # Contoh variabel lingkungan Supabase
├── vite.config.js          # Konfigurasi multi-page build Vite
└── package.json            # Daftar dependensi (React 19, Supabase, Lucide, Confetti)
```

---

## 🚀 Panduan Setup & Menjalankan Lokal

1. **Clone repositori:**
   ```bash
   git clone https://github.com/Rapyas-kece/sipenas-sman11.git
   cd sipenas-sman11
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Koneksikan ke Cloud Supabase (Opsional tapi Direkomendasikan):**
   - Buat project baru di [supabase.com](https://supabase.com).
   - Masuk ke menu **SQL Editor**, buka file `supabase/schema.sql` dan jalankan (*Run*).
   - Salin **Project URL** dan **Anon API Key** dari *Project Settings -> API*.
   - Buat file `.env` dan masukkan:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Restart dev server (`npm run dev`). Aplikasi kini terhubung langsung ke cloud database!

---

## 👤 Pengembang & Hak Cipta
- **Pengembang:** [@Rapyas-kece](https://github.com/Rapyas-kece)
- **Instansi:** SMAN 11 Semarang (SMANSE)
