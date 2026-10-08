import React from 'react';

export default function Privasi() {
  return (
    <section style={{ padding: '20px 0' }}>
      <div className="container">
        <h2 className="section-title">Privasi Pelapor Adalah Prioritas Kami</h2>

        <div className="grid">
          <div className="card">
            <h3>Opsi Anonimitas</h3>
            <p>
              Anda dapat memilih untuk menyembunyikan identitas Anda (Nama &amp; NIS) saat membuat laporan.
            </p>
          </div>

          <div className="card">
            <h3>Akses Terbatas</h3>
            <p>
              Hanya admin sekolah yang memiliki kewenangan penuh yang dapat melihat detail aduan Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
