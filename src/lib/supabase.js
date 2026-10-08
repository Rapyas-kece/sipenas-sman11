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

/**
 * Mengirim data aduan siswa ke Supabase (atau fallback local storage jika belum connect)
 */
export async function kirimAduan({ nama, nis, isAnonim, kelas, judul, isi, fileFoto }) {
  const internalRef = 'SIP-' + Date.now().toString(36).toUpperCase();
  let fotoUrl = null;

  if (isSupabaseConfigured && supabase) {
    // 1. Upload foto ke Supabase Storage (Bucket: bukti-aduan)
    if (fileFoto) {
      const ext = fileFoto.name.split('.').pop();
      const fileName = `${internalRef}_${Date.now()}.${ext}`;

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
      nomor_tiket: internalRef,
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
    nomor_tiket: internalRef,
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

  const db = getLocalDb();
  db.unshift(record);
  saveLocalDb(db);

  return {
    success: true,
    data: record,
    isCloud: false,
  };
}

/**
 * Mengambil semua data pengaduan untuk Portal Guru BK / Admin
 */
export async function getSemuaAduan() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pengaduan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Gagal fetch dari Supabase, fallback ke local:', error.message);
        return getLocalDb();
      }
      return data || [];
    } catch (e) {
      console.warn('Exception saat fetch Supabase:', e);
      return getLocalDb();
    }
  }
  return getLocalDb();
}

/**
 * Memperbarui status aduan & catatan tanggapan guru BK
 */
export async function updateStatusAduan(id, status, tanggapan = '') {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pengaduan')
        .update({
          status,
          tanggapan,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0] };
      }
    } catch (e) {
      console.warn('Update cloud error:', e);
    }
  }

  // Update in local database fallback
  const db = getLocalDb();
  const idx = db.findIndex((item) => item.id === id);
  if (idx !== -1) {
    db[idx].status = status;
    db[idx].tanggapan = tanggapan;
    db[idx].updated_at = new Date().toISOString();
    saveLocalDb(db);
    return { success: true, data: db[idx] };
  }
  return { success: true };
}

/**
 * Mengunduh seluruh rekap aduan dalam format CSV (kompatibel dengan Microsoft Excel)
 */
export function exportAduanToCSV(data) {
  if (!data || data.length === 0) return;

  const headers = ['Waktu', 'Nama Siswa', 'NIS', 'Kelas', 'Anonim', 'Judul', 'Isi Aduan', 'Status', 'Tanggapan Guru', 'Link Foto Bukti'];
  const rows = data.map((item) => [
    new Date(item.created_at).toLocaleString('id-ID'),
    item.is_anonim ? 'Anonim' : (item.nama || '-'),
    item.is_anonim ? '-' : (item.nis || '-'),
    item.kelas || '-',
    item.is_anonim ? 'Ya' : 'Tidak',
    `"${(item.judul || '').replace(/"/g, '""')}"`,
    `"${(item.isi || '').replace(/"/g, '""')}"`,
    item.status || 'menunggu',
    `"${(item.tanggapan || '').replace(/"/g, '""')}"`,
    item.foto_url || '-'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rekap_pengaduan_sipenas_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
