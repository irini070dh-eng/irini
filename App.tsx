
import React, { useState, useContext, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import OrderConfirmationView from './components/OrderConfirmationView';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';
import GoogleReviewCard from './components/GoogleReviewCard';
import { View } from './types';
import { LanguageContext, CheckoutContext } from './index';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [activeView, setView] = useState<View>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChangingView, setIsChangingView] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Try to autoplay with sound immediately
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => {
        // Browser blocked autoplay with sound, fallback to muted
        video.muted = true;
        setIsMuted(true);
        video.play();
      });
    }
  }, []);

  const langCtx = useContext(LanguageContext);
  const checkoutCtx = useContext(CheckoutContext);
  const language = langCtx?.language || 'nl';
  const t = TRANSLATIONS[language];

  // Handle URL hash for admin access (secret URL: yoursite.com/#admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
        // Clear hash from URL for security (so it's not visible in browser)
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    // Check on mount
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (view: View) => {
    if (view === activeView || isChangingView) return;
    setIsChangingView(true);
    // Smooth transition between views
    setTimeout(() => {
      setView(view);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        setIsChangingView(false);
      }, 50);
    }, 400);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    handleViewChange('checkout');
  };

  const handleOrderComplete = (orderId: string) => {
    setConfirmedOrderId(orderId);
    handleViewChange('order-confirmation');
  };

  return (
    <div className="min-h-screen selection:bg-blue-200 selection:text-blue-700 bg-gradient-to-b from-white to-blue-50 flex flex-col relative overflow-hidden">
      {/* Animated Floating Background Shapes - Apple Style */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Shape 1 - Blue */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, #0066cc 0%, #4da6ff 50%, transparent 70%)',
            animation: 'float-1 25s ease-in-out infinite',
            top: '-10%',
            left: '-10%'
          }}
        />
        {/* Shape 2 - Light Blue */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full opacity-35 blur-[70px]"
          style={{
            background: 'radial-gradient(circle, #4da6ff 0%, #0066cc 50%, transparent 70%)',
            animation: 'float-2 30s ease-in-out infinite',
            top: '30%',
            right: '-10%'
          }}
        />
        {/* Shape 3 - White/Blue Mix */}
        <div 
          className="absolute w-[900px] h-[900px] rounded-full opacity-25 blur-[90px]"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, #4da6ff 40%, #0066cc 60%, transparent 70%)',
            animation: 'float-3 28s ease-in-out infinite',
            bottom: '-15%',
            left: '15%'
          }}
        />
      </div>

      <div className="relative z-10">
      <Header 
        onCartOpen={() => setIsCartOpen(true)} 
        activeView={activeView} 
        setView={handleViewChange} 
      />
      
      <main className={`flex-1 transition-all duration-500 ease-in-out ${isChangingView ? 'opacity-0 scale-[0.98] blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
        {activeView === 'home' && (
          <div className="animate-reveal">
            <Hero onOrderClick={() => handleViewChange('menu')} onAboutClick={() => handleViewChange('about')} />
            <section id="about-preview" className="py-40 px-4 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div className="relative group">
                    <div className="relative z-10 overflow-hidden rounded-[3.5rem] border border-blue-200">
                      <video 
                        ref={videoRef}
                        src="/WhatsApp Video 2025-12-31 at 1.58.25 AM.mp4" 
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-auto"
                      />
                      {/* Sound toggle button */}
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted;
                            setIsMuted(!isMuted);
                          }
                        }}
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 z-20"
                        title={isMuted ? 'Włącz dźwięk' : 'Wycisz'}
                      >
                        {isMuted ? (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        )}
                      </button>
                    </div>
                 </div>
                 <div className="space-y-12">
                   <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] text-gray-800">Heritage in <span className="italic blue-gradient">Every Savor</span></h2>
                   <p className="text-zinc-400 text-xl leading-relaxed font-light">Combining traditional family recipes with modern culinary craftsmanship since 1984 in Den Haag.</p>
                   <button onClick={() => handleViewChange('about')} className="group relative px-14 py-6 overflow-hidden rounded-2xl border border-zinc-800 hover:border-gold-400 transition-all active:scale-95">
                      <span className="relative text-[10px] font-bold uppercase tracking-[0.3em]">{t.aboutUs}</span>
                   </button>
                 </div>
               </div>
            </section>
            <section className="py-48 bg-zinc-950 border-t border-zinc-900">
               <div className="max-w-7xl mx-auto px-4">
                 <GoogleReviewCard 
                   rating={5.0} 
                   reviews={545} 
                   isLoading={false} 
                   onWriteReview={() => {
                     window.open('https://www.google.com/maps/place/Restaurant+Irini/@52.07532,4.2805916,21z/data=!4m16!1m7!3m6!1s0x47c5b0e074091211:0x13c8203ba4d6c277!2sSirtaki!8m2!3d52.0732918!4d4.2674365!16s%2Fg%2F1tvykyvy!3m7!1s0x47c5b10052097b33:0xee46939b90160e!8m2!3d52.0753369!4d4.2805116!9m1!1b1!16s%2Fg%2F11ms1d26zp?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D', '_blank', 'noopener,noreferrer');
                   }} 
                   language={language} 
                   t={t} 
                 />
               </div>
            </section>
          </div>
        )}

        {activeView === 'menu' && <Menu />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'reservations' && <ReservationForm />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'checkout' && (
          <CheckoutView 
            onOrderComplete={handleOrderComplete}
            onBack={() => handleViewChange('menu')}
          />
        )}
        {activeView === 'order-confirmation' && confirmedOrderId && (
          <OrderConfirmationView 
            orderId={confirmedOrderId}
            onBackToMenu={() => handleViewChange('menu')}
            onTrackOrder={() => handleViewChange('admin')}
          />
        )}
      </main>

      <Footer />
      </div>
      
      {/* Admin access via URL hash #admin only - no visible button */}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default App;
