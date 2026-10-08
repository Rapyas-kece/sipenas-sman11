import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <img src="./logo-sman11.jpg" alt="Logo SMAN 11 Semarang" className="foot-logo" /><br />
        <strong>SIPENAS</strong> - Sistem Pengaduan Siswa SMAN 11 Semarang<br />
        &copy; {new Date().getFullYear()} SMAN 11 Semarang. Dikelola oleh Tim IT Sekolah
      </div>
    </footer>
  );
}
