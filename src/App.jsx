import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FormAduan from './components/FormAduan';
import CekTiketModal from './components/CekTiketModal';
import CaraKerja from './components/CaraKerja';
import Privasi from './components/Privasi';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('beranda');
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState('');

  const handleOpenTrack = (ticket = '') => {
    setActiveTicket(ticket);
    setTrackModalOpen(true);
  };

  const handleCloseTrack = () => {
    setTrackModalOpen(false);
    setActiveTicket('');
  };

  return (
    <div className="app">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
      />

      <main>
        {currentView === 'beranda' ? (
          <>
            <Hero 
              onGoToForm={() => {
                setCurrentView('aduan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTrackTicket={(ticket) => handleOpenTrack(ticket)}
            />

            <CaraKerja />
            <Privasi />

            {/* CTA Section */}
            <section className="cta-container">
              <div className="container">
                <div className="cta-box">
                  <h2>Siap untuk Membuat Laporan?</h2>
                  <p>
                    Jangan ragu untuk menyampaikan aspirasi Anda demi SMAN 11 Semarang yang lebih baik.
                  </p>
                  <button 
                    className="btn btn-cta" 
                    onClick={() => {
                      setCurrentView('aduan');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Buat Laporan
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <FormAduan 
            onBackToHome={() => {
              setCurrentView('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTrackTicket={(ticket) => handleOpenTrack(ticket)}
          />
        )}
      </main>

      <Footer />

      {trackModalOpen && (
        <CekTiketModal 
          initialTicket={activeTicket} 
          onClose={handleCloseTrack} 
        />
      )}
    </div>
  );
}
