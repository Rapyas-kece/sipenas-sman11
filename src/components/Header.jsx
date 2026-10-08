import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Header({ currentView, setCurrentView, onOpenTrackModal }) {
  return (
    <header>
      <div className="container nav-bar">
        <a 
          href="#beranda" 
          className="brand-logos"
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('beranda');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src="./logo-sman11.jpg" alt="Logo SMAN 11 Semarang" className="sch-logo" />
          <img src="./logo-sipenas.png" alt="Logo SIPENAS" className="sip-logo" />
        </a>

        <nav className="nav-links">
          <button 
            type="button"
            className={`nav-link ${currentView === 'beranda' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ background: 'none', border: 'none' }}
          >
            Beranda
          </button>

          <button 
            type="button"
            className="nav-link"
            onClick={() => {
              setCurrentView('beranda');
              setTimeout(() => {
                document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            style={{ background: 'none', border: 'none' }}
          >
            Alur Laporan
          </button>

          <button 
            type="button"
            className="nav-link"
            onClick={onOpenTrackModal}
            style={{ background: 'none', border: 'none' }}
          >
            Cek Tiket
          </button>

          <button 
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setCurrentView('aduan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Buat Aduan
          </button>
        </nav>
      </div>
    </header>
  );
}
