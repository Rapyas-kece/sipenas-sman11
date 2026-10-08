import React, { useState } from 'react';
import { Search, ArrowRight, Shield, Send } from 'lucide-react';

export default function Hero({ onGoToForm, onTrackTicket }) {
  const [ticketInput, setTicketInput] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (ticketInput.trim()) {
      onTrackTicket(ticketInput.trim());
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          <span>Sistem Aduan Siswa Aktif & Siap Digunakan</span>
        </div>

        <h1>
          Suarakan. <span>Kami Dengar.</span>
        </h1>

        <p className="hero-desc">
          Platform resmi pengaduan dan aspirasi siswa SMAN 11 Semarang. Laporkan masalah, 
          beri masukan, dan bantu ciptakan lingkungan sekolah yang aman dan nyaman.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={onGoToForm}>
            <Send size={18} />
            Buat Aduan Sekarang
          </button>
        </div>

        <form onSubmit={handleTrackSubmit} className="track-box" style={{ margin: '32px auto 0' }}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text"
            className="track-input"
            placeholder="Punya tiket laporan? (cth: SIP-2026-AB123)"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <button type="submit" className="btn btn-sm">
            Lacak
          </button>
        </form>
      </div>
    </section>
  );
}
