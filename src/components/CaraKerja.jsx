import React from 'react';
import { PenTool, CheckSquare, Sparkles } from 'lucide-react';

export default function CaraKerja() {
  const steps = [
    {
      number: '1',
      icon: <PenTool size={22} color="#2563eb" />,
      title: 'Lapor',
      desc: 'Tuliskan laporan keluhan, aspirasi, atau masukan Anda dengan detail, lengkapi dengan foto bukti jika ada.',
    },
    {
      number: '2',
      icon: <CheckSquare size={22} color="#2563eb" />,
      title: 'Review',
      desc: 'Tim Kesiswaan / Guru BK sekolah akan mereview laporan Anda secara objektif dan meneruskannya ke pihak berwenang.',
    },
    {
      number: '3',
      icon: <Sparkles size={22} color="#2563eb" />,
      title: 'Tindak Lanjut',
      desc: 'Laporan diselesaikan secara adil. Anda dapat memantau seluruh riwayat proses dan tanggapan dari nomor tiket Anda.',
    },
  ];

  return (
    <section id="cara-kerja" style={{ padding: '60px 0' }}>
      <div className="container">
        <h2 className="section-title">Cara Kerja Sistem</h2>
        <div className="grid-3">
          {steps.map((s, idx) => (
            <div key={idx} className="card">
              <div className="card-num">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
