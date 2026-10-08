import React, { useState } from 'react';
import { Send, UploadCloud, X, CheckCircle, Copy, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { kirimAduan } from '../lib/supabase';

export default function FormAduan({ onBackToHome, onTrackTicket }) {
  const [nama, setNama] = useState('');
  const [nis, setNis] = useState('');
  const [isAnonim, setIsAnonim] = useState(false);
  const [kelas, setKelas] = useState('');
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [fileFoto, setFileFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasilTiket, setHasilTiket] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Format file harus berupa gambar (JPG, PNG, JPEG, WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran gambar maksimal 5 MB.');
        return;
      }
      setErrorMsg('');
      setFileFoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFoto = () => {
    setFileFoto(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await kirimAduan({
        nama,
        nis,
        isAnonim,
        kelas,
        judul,
        isi,
        fileFoto,
      });

      setHasilTiket(res.nomorTiket);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Reset fields
      setNama('');
      setNis('');
      setKelas('');
      setJudul('');
      setIsi('');
      removeFoto();
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengirim aduan.');
    } finally {
      setLoading(false);
    }
  };

  const copyTiket = () => {
    if (hasilTiket) {
      navigator.clipboard.writeText(hasilTiket);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <section className="container" style={{ padding: '40px 20px' }}>
      <button 
        type="button" 
        onClick={onBackToHome}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--ink-muted)',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={18} />
        Kembali ke Beranda
      </button>

      <div className="form-card">
        <div className="form-header">
          <h2>Buat Aduan Siswa</h2>
          <p>Sampaikan keluhan, aspirasi, atau masukan Anda dengan jelas dan lengkap.</p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {hasilTiket ? (
          <div style={{
            background: 'var(--success-light)',
            border: '1.5px solid #a7f3d0',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease',
          }}>
            <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: '#065f46', fontSize: '1.4rem', fontWeight: 800 }}>
              Aduan Berhasil Terkirim!
            </h3>
            <p style={{ color: '#047857', margin: '8px 0 20px', fontSize: '0.95rem' }}>
              Simpan dan catat nomor tiket di bawah ini untuk memantau status penyelesaian dari sekolah.
            </p>

            <div style={{
              background: '#fff',
              border: '2px dashed #059669',
              borderRadius: 'var(--radius-md)',
              padding: '14px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#0f172a' }}>
                {hasilTiket}
              </span>
              <button 
                type="button" 
                onClick={copyTiket}
                className="btn btn-sm"
                style={{ padding: '6px 12px' }}
              >
                <Copy size={14} />
                {isCopied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setHasilTiket(null)}
              >
                Kirim Laporan Lain
              </button>
              <button 
                type="button" 
                className="btn"
                onClick={() => onTrackTicket(hasilTiket)}
              >
                Lihat Status Tiket
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {!isAnonim && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nama">Nama Lengkap</label>
                  <input 
                    id="nama" 
                    type="text" 
                    placeholder="Contoh: Budi Santoso"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required={!isAnonim}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nis">NIS (Nomor Induk Siswa)</label>
                  <input 
                    id="nis" 
                    type="text" 
                    inputMode="numeric"
                    placeholder="Contoh: 12345"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    required={!isAnonim}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="checkbox-toggle">
                <input 
                  type="checkbox" 
                  checked={isAnonim}
                  onChange={(e) => setIsAnonim(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--brand-dark)' }}>
                  Kirim sebagai anonim (identitas Nama & NIS disembunyikan)
                </span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="kelas">Kelas</label>
              <select 
                id="kelas" 
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                required
              >
                <option value="">Pilih jenjang kelas</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="judul">Judul Aduan</label>
              <input 
                id="judul" 
                type="text" 
                placeholder="Contoh: Fasilitas AC di ruang kelas XI-4 tidak menyala"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isi">Isi Aduan</label>
              <textarea 
                id="isi" 
                placeholder="Tuliskan keluhan atau masukan Anda secara rinci, lokasi kejadian, waktu, dll..."
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Foto Bukti (Opsional)</label>
              {!previewUrl ? (
                <label className="file-dropzone" style={{ display: 'block' }}>
                  <UploadCloud size={32} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Klik untuk unggah foto bukti</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Maksimal 5MB (JPG, PNG, WEBP)</div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }}
                  />
                </label>
              ) : (
                <div className="preview-img-box">
                  <img src={previewUrl} alt="Preview Bukti" className="preview-img" />
                  <button 
                    type="button" 
                    onClick={removeFoto}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'var(--danger)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', marginTop: '12px' }}
              disabled={loading}
            >
              <Send size={18} />
              {loading ? 'Mengirim Aduan...' : 'Kirim Aduan'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
