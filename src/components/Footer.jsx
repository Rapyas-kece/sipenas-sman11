import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <img src="./logo-sman11.jpg" alt="SMAN 11 Semarang" className="footer-logo" />
        <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
          SIPENAS - Sistem Pengaduan Siswa SMAN 11 Semarang
        </div>
        <div style={{ marginTop: '4px', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} SMAN 11 Semarang. Dikelola oleh Tim IT & Kesiswaan Sekolah.
        </div>
      </div>
    </footer>
  );
}
