import React from 'react';

export default function CaraKerja() {
  const steps = [
    {
      number: '1',
      title: 'Lapor',
      desc: 'Tuliskan laporan keluhan atau masukan Anda dengan detail, lengkapi dengan foto bukti jika ada.',
    },
    {
      number: '2',
      title: 'Review',
      desc: 'Tim Admin sekolah akan mereview laporan Anda dan meneruskannya ke pihak yang berwenang.',
    },
    {
      number: '3',
      title: 'Tindak Lanjut',
      desc: 'Laporan diselesaikan. Anda dapat memantau seluruh riwayat proses dari dashboard Anda.',
    },
  ];

  return (
    <section id="cara-kerja" style={{ padding: '20px 0' }}>
      <div className="container">
        <h2 className="section-title">Cara Kerja Sistem</h2>
        <div className="grid">
          {steps.map((s, idx) => (
            <div key={idx} className="card">
              <div className="step">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
