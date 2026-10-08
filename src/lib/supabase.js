import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage key
const LOCAL_STORAGE_KEY = 'sipenas_aduan_db';

function getLocalDb() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error membaca local database:', e);
    return [];
  }
}

function saveLocalDb(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error menyimpan local database:', e);
  }
}

// Generate nomor tiket berformat rapi: SIP-THN-XXXX
export function generateTicketCode() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SIP-${year}-${rand}`;
}

/**
 * Mengirim data aduan siswa ke Supabase (atau fallback local storage jika belum connect)
 */
export async function kirimAduan({ nama, nis, isAnonim, kelas, judul, isi, fileFoto }) {
  const nomorTiket = generateTicketCode();
  let fotoUrl = null;

  if (isSupabaseConfigured && supabase) {
    // 1. Upload foto ke Supabase Storage (Bucket: bukti-aduan)
    if (fileFoto) {
      const ext = fileFoto.name.split('.').pop();
      const fileName = `${nomorTiket}_${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bukti-aduan')
        .upload(fileName, fileFoto, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Gagal upload foto bukti:', uploadError.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('bukti-aduan')
          .getPublicUrl(fileName);
        fotoUrl = publicUrlData?.publicUrl || null;
      }
    }

    // 2. Insert data ke Tabel pengaduan
    const payload = {
      nomor_tiket: nomorTiket,
      nama: isAnonim ? 'Anonim' : nama,
      nis: isAnonim ? '-' : nis,
      is_anonim: isAnonim,
      kelas,
      judul,
      isi,
      foto_url: fotoUrl,
      status: 'menunggu',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('pengaduan')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`Gagal menyimpan aduan: ${error.message}`);
    }

    return {
      success: true,
      nomorTiket,
      data,
      isCloud: true,
    };
  }

  // --- Fallback Local Mock Mode ---
  if (fileFoto) {
    fotoUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(fileFoto);
    });
  }

  const record = {
    id: 'local-' + Date.now(),
    nomor_tiket: nomorTiket,
    nama: isAnonim ? 'Anonim' : nama,
    nis: isAnonim ? '-' : nis,
    is_anonim: isAnonim,
    kelas,
    judul,
    isi,
    foto_url: fotoUrl,
    status: 'menunggu',
    tanggapan: 'Laporan Anda telah diterima oleh sistem dan sedang masuk dalam antrean review tim sekolah.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const db = getLocalDb();
  db.unshift(record);
  saveLocalDb(db);

  return {
    success: true,
    nomorTiket,
    data: record,
    isCloud: false,
  };
}

/**
 * Mencari status aduan berdasarkan nomor tiket
 */
export async function getStatusAduan(nomorTiket) {
  const queryTiket = (nomorTiket || '').trim().toUpperCase();
  if (!queryTiket) {
    throw new Error('Nomor tiket tidak boleh kosong.');
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('pengaduan')
      .select('*')
      .eq('nomor_tiket', queryTiket)
      .maybeSingle();

    if (error) {
      throw new Error(`Gagal mengambil status: ${error.message}`);
    }
    return data;
  }

  // --- Fallback Local Mock Mode ---
  const db = getLocalDb();
  const match = db.find((item) => item.nomor_tiket === queryTiket);
  return match || null;
}
