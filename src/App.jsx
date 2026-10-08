import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FormAduan from './components/FormAduan';
import CekTiketModal from './components/CekTiketModal';
import CaraKerja from './components/CaraKerja';
import Privasi from './components/Privasi';
import Footer from './components/Footer';
import { isSupabaseConfigured } from './lib/supabase';
import { Send, CheckCircle2, ShieldCheck } from 'lucide-react';

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
        onOpenTrackModal={() => handleOpenTrack()}
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
            <section style={{ padding: '40px 20px' }}>
              <div className="container" style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '48px 32px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
                  Siap untuk Membuat Laporan?
                </h2>
                <p style={{ maxWidth: '520px', margin: '0 auto 24px', opacity: 0.9 }}>
                  Jangan ragu untuk menyampaikan aspirasi Anda demi terciptanya lingkungan belajar SMAN 11 Semarang yang lebih baik.
                </p>
                <button 
                  className="btn" 
                  onClick={() => {
                    setCurrentView('aduan');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ background: '#fff', color: 'var(--brand-dark)' }}
                >
                  <Send size={18} />
                  Buat Laporan Sekarang
                </button>
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
