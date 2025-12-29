
import React, { useState, useContext } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import OrderConfirmationView from './components/OrderConfirmationView';
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

  const langCtx = useContext(LanguageContext);
  const checkoutCtx = useContext(CheckoutContext);
  const language = langCtx?.language || 'nl';
  const t = TRANSLATIONS[language];

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
                      <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000" alt="Greek cuisine heritage" className="w-full object-cover aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-1000" />
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
      
      {/* Hidden Dev Trigger for Staff Portal */}
      <div className="fixed bottom-4 left-4 z-[200] opacity-10 hover:opacity-100 transition-opacity">
        <button onClick={() => handleViewChange('admin')} className="text-[8px] uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-zinc-500">Staff Portal</button>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default App;
