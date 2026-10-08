import React from 'react';

export default function Hero({ onGoToForm }) {
  return (
    <section className="hero">
      <div className="container">
        <img 
          src="./logo-sipenas.png" 
          alt="Logo SIPENAS" 
          className="hero-logo" 
        />

        <div>
          <span className="badge">
            <span className="pulse-dot"></span>
            Sistem Aduan Aktif &amp; Siap Digunakan
          </span>
        </div>

        <h1>Suarakan. Kami Dengar.</h1>

        <p className="hero-desc">
          Platform resmi pengaduan siswa SMAN 11 Semarang. Laporkan masalah, beri masukan, dan bantu ciptakan lingkungan sekolah yang lebih baik.
        </p>

        <div>
          <button className="btn" onClick={onGoToForm}>
            Buat Aduan Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
