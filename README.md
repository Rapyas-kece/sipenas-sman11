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
* **Live Website:** [https://rapyas-kece.github.io/sipenas-sman11/](https://rapyas-kece.github.io/sipenas-sman11/) *(atau Vercel: `sipenas-sman11.vercel.app`)*

---

## ✨ Fitur Utama
1. **Formulir Pengaduan Interaktif:**
   - Input Nama, NIS, Kelas, Judul, dan Isi Aduan.
   - Opsi Anonimitas Penuh (sembunyikan identitas Nama & NIS).
   - Upload Foto Bukti dengan live image preview dan validasi ukuran (maks. 5MB).
   - Animasi konfeti perayaan & nomor tiket unik otomatis (contoh: `SIP-2026-X89AB`) yang bisa langsung disalin.
2. **Pelacakan Status Tiket Real-time:**
   - Siswa dapat melacak perkembangan penanganan laporan secara transparan.
   - Indikator status: *Menunggu Review*, *Sedang Direview*, *Sedang Ditindaklanjuti*, *Selesai*.
   - Menampilkan tanggapan resmi dari pihak sekolah/guru BK.
3. **Database & Storage (Supabase):**
   - Tabel database relasional `pengaduan` dengan proteksi Row Level Security (RLS).
   - Cloud Storage Bucket `bukti-aduan` untuk menyimpan gambar barang/fasilitas yang diadukan.
   - Dilengkapi *Smart Local Fallback* sehingga aplikasi tetap dapat berjalan lancar offline maupun saat proses setup kredensial cloud.
4. **Monitoring Database via MCP (Model Context Protocol):**
   - Konfigurasi server MCP Postgres/Supabase telah ditambahkan ke Antigravity IDE untuk pemantauan tabel dan query langsung dari AI assistant.

---

## 📁 Struktur Direktori Proyek
```text
smanse_web/
├── public/                 # Aset publik statis (Logo SMAN 11, Logo SIPENAS)
├── src/
│   ├── components/         # Komponen UI modular
│   │   ├── Header.jsx      # Navigasi & logo
│   │   ├── Hero.jsx        # Headline & quick track box
│   │   ├── FormAduan.jsx   # Form keluhan siswa + upload bukti + confetti
│   │   ├── CekTiketModal.jsx # Modal pelacakan tiket real-time
│   │   ├── CaraKerja.jsx   # Edukasi 3 langkah alur pengaduan
│   │   ├── Privasi.jsx     # Jaminan privasi dan kerahasiaan
│   │   └── Footer.jsx      # Footer resmi sekolah
│   ├── lib/
│   │   └── supabase.js     # Supabase client SDK & fallback local DB
│   ├── App.jsx             # Root layout & routing sederhana
│   ├── index.css           # Sistem desain modern, variables & animasi
│   └── main.jsx            # Entry point React
├── supabase/
│   └── schema.sql          # Skrip SQL tabel, indeks, RLS, & storage bucket
├── .env.example            # Contoh variabel lingkungan Supabase
├── vite.config.js          # Konfigurasi build Vite
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
