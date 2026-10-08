import React from 'react';
import { UserX, Lock, ShieldAlert } from 'lucide-react';

export default function Privasi() {
  return (
    <section style={{ padding: '60px 0', background: '#f1f5f9' }}>
      <div className="container">
        <h2 className="section-title" style={{ marginTop: 0 }}>
          Privasi Siswa Adalah Prioritas Kami
        </h2>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div className="card" style={{ background: '#fff' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: '#dbeafe',
              color: '#1d4ed8',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <UserX size={24} />
            </div>
            <h3>Opsi Anonimitas Penuh</h3>
            <p>
              Anda dapat memilih untuk menyembunyikan identitas Anda (Nama & NIS) saat membuat laporan. 
              Sistem menjamin kerahasiaan Anda sehingga Anda dapat bersuara tanpa rasa takut.
            </p>
          </div>

          <div className="card" style={{ background: '#fff' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: '#dcfce7',
              color: '#15803d',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Lock size={24} />
            </div>
            <h3>Akses Terbatas & Terenkripsi</h3>
            <p>
              Hanya tim admin sekolah yang memiliki kewenangan penuh (Kepala Sekolah, Waka Kesiswaan, Guru BK) 
              yang dapat mengakses laporan untuk keperluan verifikasi dan tindak lanjut.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
