import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FormAduan from './components/FormAduan';
import CaraKerja from './components/CaraKerja';
import Privasi from './components/Privasi';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('beranda');

  return (
    <div className="app">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
      />

      <main>
        {currentView === 'beranda' && (
          <>
            <Hero 
              onGoToForm={() => {
                setCurrentView('aduan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
        )}

        {currentView === 'aduan' && (
          <FormAduan 
            onBackToHome={() => {
              setCurrentView('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
