import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle2, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';
import { getStatusAduan } from '../lib/supabase';

export default function CekTiketModal({ initialTicket, onClose }) {
  const [ticketQuery, setTicketQuery] = useState(initialTicket || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStatus = async (ticket) => {
    if (!ticket.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const data = await getStatusAduan(ticket);
      if (!data) {
        setErrorMsg(`Tiket dengan nomor "${ticket}" tidak ditemukan. Pastikan kode tiket sudah benar.`);
      } else {
        setResult(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memeriksa status tiket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicket) {
      fetchStatus(initialTicket);
    }
  }, [initialTicket]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStatus(ticketQuery);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'selesai':
        return <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700 }}>Selesai Ditindaklanjuti</span>;
      case 'tindak_lanjut':
        return <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700 }}>Sedang Ditindaklanjuti</span>;
      case 'review':
        return <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700 }}>Sedang Direview</span>;
      case 'ditolak':
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700 }}>Laporan Ditolak</span>;
      default:
        return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700 }}>Menunggu Review</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button type="button" className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
          Lacak Tiket Aduan
        </h3>
        <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Masukkan kode tiket Anda untuk melihat perkembangan proses aduan.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Masukkan nomor tiket..." 
            value={ticketQuery}
            onChange={(e) => setTicketQuery(e.target.value)}
            style={{ textTransform: 'uppercase', fontWeight: 700 }}
          />
          <button type="submit" className="btn btn-sm" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            <Search size={16} />
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {result && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginTop: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand)' }}>
                {result.nomor_tiket}
              </span>
              {getStatusBadge(result.status)}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Judul Aduan:</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>{result.judul}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Pelapor: </span>
                <span style={{ fontWeight: 600 }}>{result.is_anonim ? 'Anonim' : result.nama}</span>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Kelas: </span>
                <span style={{ fontWeight: 600 }}>Kelas {result.kelas}</span>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '4px' }}>Isi Aduan:</div>
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                {result.isi}
              </div>
            </div>

            {result.foto_url && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ImageIcon size={14} /> Foto Bukti:
                </div>
                <img 
                  src={result.foto_url} 
                  alt="Bukti Aduan" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', objectFit: 'cover' }} 
                />
              </div>
            )}

            <div style={{
              background: 'var(--brand-light)',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              marginTop: '14px',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '4px' }}>
                Tanggapan Resmi Pihak Sekolah:
              </div>
              <div style={{ fontSize: '0.9rem', color: '#1e3a8a' }}>
                {result.tanggapan || 'Belum ada tanggapan resmi dari pihak sekolah. Tim admin sedang memverifikasi laporan Anda.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
