import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Download, 
  RefreshCw, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon,
  ArrowLeft,
  X,
  ExternalLink
} from 'lucide-react';
import { getSemuaAduan, updateStatusAduan, exportAduanToCSV, isSupabaseConfigured } from '../lib/supabase';

// PIN akses default untuk Guru BK / Admin Sekolah
const DEFAULT_ADMIN_PIN = 'smanse11';
const SESSION_STORAGE_KEY = 'sipenas_admin_auth';

export default function AdminDashboard({ onBackToHome }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Data state
  const [aduanList, setAduanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');

  // Detail Modal State
  const [selectedAduan, setSelectedAduan] = useState(null);
  const [newStatus, setNewStatus] = useState('menunggu');
  const [tanggapanText, setTanggapanText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Image Preview Modal
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  // Load complaints
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getSemuaAduan();
      setAduanList(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_ADMIN_PIN) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN salah! Silakan coba lagi (Default PIN: smanse11)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setIsAuthenticated(false);
    setPinInput('');
  };

  const openDetailModal = (item) => {
    setSelectedAduan(item);
    setNewStatus(item.status || 'menunggu');
    setTanggapanText(item.tanggapan || '');
    setUpdateSuccess(false);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedAduan) return;

    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      await updateStatusAduan(selectedAduan.id, newStatus, tanggapanText);
      
      // Update local state in table
      setAduanList(prev => prev.map(item => {
        if (item.id === selectedAduan.id) {
          return { ...item, status: newStatus, tanggapan: tanggapanText, updated_at: new Date().toISOString() };
        }
        return item;
      }));

      setSelectedAduan(prev => prev ? { ...prev, status: newStatus, tanggapan: tanggapanText } : null);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered complaints
  const filteredList = aduanList.filter(item => {
    // Search filter
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      (item.nama && item.nama.toLowerCase().includes(q)) ||
      (item.nis && item.nis.toLowerCase().includes(q)) ||
      (item.judul && item.judul.toLowerCase().includes(q)) ||
      (item.isi && item.isi.toLowerCase().includes(q));

    // Kelas filter
    const matchKelas = 
      filterKelas === 'semua' || 
      (item.kelas && item.kelas.toUpperCase().startsWith(filterKelas.toUpperCase()));

    // Status filter
    const matchStatus = 
      filterStatus === 'semua' || item.status === filterStatus;

    return matchSearch && matchKelas && matchStatus;
  });

  // KPI counts
  const countTotal = aduanList.length;
  const countMenunggu = aduanList.filter(i => i.status === 'menunggu').length;
  const countReview = aduanList.filter(i => i.status === 'review' || i.status === 'tindak_lanjut').length;
  const countSelesai = aduanList.filter(i => i.status === 'selesai').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu':
        return <span className="status-badge badge-warning"><Clock size={12} /> Menunggu</span>;
      case 'review':
        return <span className="status-badge badge-info"><AlertCircle size={12} /> Sedang Direview</span>;
      case 'tindak_lanjut':
        return <span className="status-badge badge-primary"><RefreshCw size={12} /> Ditindaklanjuti</span>;
      case 'selesai':
        return <span className="status-badge badge-success"><CheckCircle2 size={12} /> Selesai</span>;
      case 'ditolak':
        return <span className="status-badge badge-danger">Ditolak</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: GATE LOGIN ADMIN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-gate-wrapper">
        <div className="admin-gate-card">
          <div className="admin-gate-header">
            <div className="admin-gate-icon">
              <ShieldCheck size={40} color="var(--primary)" />
            </div>
            <h2>Portal Guru BK & Admin</h2>
            <p>Masukkan PIN keamanan untuk melihat data aduan siswa SMAN 11 Semarang.</p>
          </div>

          <form onSubmit={handleLogin} className="admin-gate-form">
            <div className="form-group">
              <label htmlFor="adminPin">PIN Akses Keamanan</label>
              <div className="input-with-icon">
                <Lock size={18} className="icon-inside" />
                <input 
                  type="password" 
                  id="adminPin"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN sekolah..."
                  autoFocus
                  required
                />
              </div>
              <small className="help-text">Default PIN: <code>smanse11</code></small>
            </div>

            {pinError && (
              <div className="admin-error-box">
                {pinError}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block">
              Masuk ke Portal Admin
            </button>
          </form>

          <div className="admin-gate-footer">
            <button 
              type="button" 
              className="btn-link"
              onClick={onBackToHome}
            >
              <ArrowLeft size={16} /> Kembali ke Halaman Siswa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DASHBOARD UTAMA
  // -------------------------------------------------------------
  return (
    <div className="admin-dashboard-container">
      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <ShieldCheck size={32} color="var(--primary)" />
          <div>
            <h1>Dashboard Pengaduan Siswa</h1>
            <p className="subtitle">
              Sistem Pengaduan Siswa (SIPENAS) &bull; SMAN 11 Semarang
              {isSupabaseConfigured && (
                <span className="cloud-indicator"> &bull; Terhubung ke Supabase Cloud</span>
              )}
            </p>
          </div>
        </div>

        <div className="admin-actions">
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadData}
            disabled={isLoading}
            title="Muat Ulang Data"
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            <span>Segarkan</span>
          </button>

          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => exportAduanToCSV(aduanList)}
            disabled={aduanList.length === 0}
            title="Download Rekap Excel"
          >
            <Download size={16} />
            <span>Export Excel</span>
          </button>

          <button 
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
            title="Keluar dari Portal"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon total"><FileText size={22} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Total Aduan</span>
            <span className="kpi-value">{countTotal}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon pending"><Clock size={22} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Menunggu Respon</span>
            <span className="kpi-value text-warning">{countMenunggu}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon process"><RefreshCw size={22} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Sedang Diproses</span>
            <span className="kpi-value text-primary">{countReview}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon done"><CheckCircle2 size={22} /></div>
          <div className="kpi-info">
            <span className="kpi-label">Selesai Ditangani</span>
            <span className="kpi-value text-success">{countSelesai}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Cari nama, NIS, judul, atau kata kunci keluhan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>&times;</button>
          )}
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={16} />
            <select 
              value={filterKelas} 
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              <option value="semua">Semua Tingkat</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
          </div>

          <div className="filter-item">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="review">Sedang Direview</option>
              <option value="tindak_lanjut">Ditindaklanjuti</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-table-wrapper">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Siswa Pengadu</th>
                <th>Kelas</th>
                <th>Judul & Keluhan</th>
                <th>Bukti Foto</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="loading-spinner"></div>
                    <p>Memuat data pengaduan dari Supabase...</p>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <p className="no-data-text">
                      {searchQuery || filterKelas !== 'semua' || filterStatus !== 'semua' 
                        ? 'Tidak ada aduan yang cocok dengan filter pencarian.'
                        : 'Belum ada data aduan siswa yang masuk.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className={`row-status-${item.status}`}>
                    <td className="cell-date">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="cell-user">
                      {item.is_anonim ? (
                        <div className="user-anonim">
                          <span className="badge-anonim">Anonim</span>
                          <small className="text-muted">Identitas Terlindungi</small>
                        </div>
                      ) : (
                        <div className="user-real">
                          <strong>{item.nama || 'Siswa'}</strong>
                          <small className="text-muted">NIS: {item.nis || '-'}</small>
                        </div>
                      )}
                    </td>
                    <td className="cell-kelas">
                      <span className="badge-kelas">{item.kelas || '-'}</span>
                    </td>
                    <td className="cell-content">
                      <div className="aduan-title">{item.judul}</div>
                      <div className="aduan-preview text-muted">
                        {item.isi && item.isi.length > 80 
                          ? `${item.isi.substring(0, 80)}...` 
                          : item.isi}
                      </div>
                    </td>
                    <td className="cell-foto">
                      {item.foto_url ? (
                        <button 
                          type="button"
                          className="btn-foto-preview"
                          onClick={() => setPreviewImageUrl(item.foto_url)}
                          title="Lihat foto bukti"
                        >
                          <ImageIcon size={16} />
                          <span>Foto</span>
                        </button>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="cell-status">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="cell-action">
                      <button 
                        type="button" 
                        className="btn btn-outline btn-xs"
                        onClick={() => openDetailModal(item)}
                      >
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Response Modal */}
      {selectedAduan && (
        <div className="admin-modal-overlay" onClick={() => setSelectedAduan(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h2>Detail Pengaduan Siswa</h2>
                <small className="text-muted">
                  ID: {selectedAduan.id.slice(0, 8)} &bull; {new Date(selectedAduan.created_at).toLocaleString('id-ID')}
                </small>
              </div>
              <button 
                type="button" 
                className="close-modal-btn"
                onClick={() => setSelectedAduan(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Identity Bar */}
              <div className="detail-meta-box">
                <div className="meta-item">
                  <span className="meta-label">Nama Siswa</span>
                  <span className="meta-val">
                    {selectedAduan.is_anonim ? 'Anonim (Dirahasiakan)' : selectedAduan.nama}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">NIS</span>
                  <span className="meta-val">
                    {selectedAduan.is_anonim ? '-' : selectedAduan.nis}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Kelas</span>
                  <span className="meta-val badge-kelas">{selectedAduan.kelas}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status Saat Ini</span>
                  <span className="meta-val">{getStatusBadge(selectedAduan.status)}</span>
                </div>
              </div>

              {/* Title & Content */}
              <div className="detail-content-box">
                <h3>{selectedAduan.judul}</h3>
                <p className="complaint-text">{selectedAduan.isi}</p>
              </div>

              {/* Photo Evidence */}
              {selectedAduan.foto_url && (
                <div className="detail-photo-box">
                  <span className="meta-label">Foto Bukti Lampiran:</span>
                  <div className="photo-thumb-container">
                    <img 
                      src={selectedAduan.foto_url} 
                      alt="Bukti Aduan" 
                      onClick={() => setPreviewImageUrl(selectedAduan.foto_url)}
                    />
                    <a 
                      href={selectedAduan.foto_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="open-full-link"
                    >
                      <ExternalLink size={14} /> Buka Resolusi Penuh
                    </a>
                  </div>
                </div>
              )}

              {/* Update Status Form for Teacher/BK */}
              <form onSubmit={handleUpdateStatus} className="detail-update-form">
                <hr className="divider" />
                <h4>Tindak Lanjut & Tanggapan Pihak Sekolah</h4>
                
                <div className="form-group">
                  <label htmlFor="modalStatus">Perbarui Status Penanganan:</label>
                  <select 
                    id="modalStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="menunggu">Menunggu</option>
                    <option value="review">Sedang Direview Guru BK</option>
                    <option value="tindak_lanjut">Sedang Ditindaklanjuti</option>
                    <option value="selesai">Selesai Ditangani</option>
                    <option value="ditolak">Ditolak (Tidak Valid)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="modalTanggapan">Catatan Solusi / Tanggapan Guru BK:</label>
                  <textarea 
                    id="modalTanggapan"
                    rows="3"
                    value={tanggapanText}
                    onChange={(e) => setTanggapanText(e.target.value)}
                    placeholder="Tuliskan catatan tindak lanjut atau solusi penyelesaian..."
                  />
                </div>

                {updateSuccess && (
                  <div className="alert-success-box">
                    <CheckCircle2 size={16} /> Status dan tanggapan berhasil diperbarui!
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setSelectedAduan(null)}
                  >
                    Tutup
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div className="admin-modal-overlay image-preview-overlay" onClick={() => setPreviewImageUrl(null)}>
          <div className="image-preview-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="close-preview-btn" 
              onClick={() => setPreviewImageUrl(null)}
            >
              <X size={24} />
            </button>
            <img src={previewImageUrl} alt="Pratinjau Foto Bukti" />
          </div>
        </div>
      )}
    </div>
  );
}
