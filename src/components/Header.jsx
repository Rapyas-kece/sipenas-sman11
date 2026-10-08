import React from 'react';

export default function Header({ currentView, setCurrentView }) {
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
          aria-label="SIPENAS - Beranda"
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
          >
            Beranda
          </button>

          <button 
            type="button"
            className={`nav-link ${currentView === 'aduan' ? 'active' : ''}`}
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
