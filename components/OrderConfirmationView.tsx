
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext, OrdersContext } from '../index';
import { TRANSLATIONS } from '../constants';
import { Order, DELIVERY_CONFIG } from '../types';

interface OrderConfirmationProps {
  orderId: string;
  onBackToMenu: () => void;
  onTrackOrder: () => void;
}

const OrderConfirmationView: React.FC<OrderConfirmationProps> = ({ orderId, onBackToMenu, onTrackOrder }) => {
  const langCtx = useContext(LanguageContext);
  const ordersCtx = useContext(OrdersContext);
  const [order, setOrder] = useState<Order | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  if (!langCtx || !ordersCtx) return null;
  const { language } = langCtx;
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const foundOrder = ordersCtx.orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [orderId, ordersCtx.orders]);

  if (!order) {
    return (
      <section className="min-h-screen py-24 px-4 bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">{language === 'pl' ? 'Ładowanie zamówienia...' : 'Bestelling laden...'}</p>
        </div>
      </section>
    );
  }

  const estimatedTime = order.delivery.type === 'delivery' 
    ? DELIVERY_CONFIG.estimatedDeliveryMinutes 
    : DELIVERY_CONFIG.estimatedPickupMinutes;

  const estimatedReadyTime = new Date(new Date(order.createdAt).getTime() + estimatedTime * 60000);
  const formattedTime = estimatedReadyTime.toLocaleTimeString(language === 'nl' ? 'nl-NL' : 'pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <section className="min-h-screen py-24 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#D4AF37', '#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
                width: `${5 + Math.random() * 10}px`,
                height: `${5 + Math.random() * 10}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 animate-reveal">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {t.orderConfirmed}
          </h1>
          <p className="text-zinc-400 text-lg">
            {language === 'pl' 
              ? 'Dziękujemy za zamówienie!'
              : 'Bedankt voor je bestelling!'
            }
          </p>
          {/* Email confirmation notice */}
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-green-400 text-sm font-medium">
              {language === 'pl' 
                ? `Potwierdzenie wysłane na: ${order.customer.email}`
                : `Bevestiging verzonden naar: ${order.customer.email}`
              }
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="glass rounded-3xl p-8 border border-zinc-800 mb-8 animate-reveal stagger-1">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{t.orderNumber}</div>
              <div className="text-2xl font-mono font-bold text-gold-400">{order.id}</div>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
              order.payment.status === 'paid' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}>
              {order.payment.status === 'paid' 
                ? (language === 'pl' ? '✓ Opłacone' : '✓ Betaald')
                : (language === 'pl' ? 'Płatność przy odbiorze' : 'Betalen bij bezorging')
              }
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400">✓</span>
              </div>
              <div>
                <div className="font-bold">{language === 'pl' ? 'Zamówienie przyjęte' : 'Bestelling ontvangen'}</div>
                <div className="text-sm text-zinc-500">
                  {new Date(order.createdAt).toLocaleTimeString(language === 'nl' ? 'nl-NL' : 'pl-PL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                <span className="text-gold-400">🍳</span>
              </div>
              <div>
                <div className="font-bold">{language === 'pl' ? 'Przygotowywanie' : 'In voorbereiding'}</div>
                <div className="text-sm text-zinc-500">{language === 'pl' ? 'W kuchni' : 'In de keuken'}</div>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-50">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                <span>{order.delivery.type === 'delivery' ? '🚗' : '🏪'}</span>
              </div>
              <div>
                <div className="font-bold">
                  {order.delivery.type === 'delivery' 
                    ? (language === 'pl' ? 'Dostawa' : 'Bezorging')
                    : (language === 'pl' ? 'Gotowe do odbioru' : 'Klaar voor afhalen')
                  }
                </div>
                <div className="text-sm text-zinc-500">
                  {t.estimatedTime}: ~{formattedTime}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Info */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            {order.delivery.type === 'delivery' ? (
              <>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                  <span>📍</span>
                  <span>{t.deliveryAddress}</span>
                </div>
                <div className="font-bold text-lg">
                  {order.customer.address}
                </div>
                <div className="text-zinc-500">
                  {order.customer.postalCode} {order.customer.city}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                  <span>🏪</span>
                  <span>{t.pickupAddress}</span>
                </div>
                <div className="font-bold text-lg">
                  Weimarstraat 174
                </div>
                <div className="text-zinc-500">
                  2562 HD Den Haag
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass rounded-3xl p-8 border border-zinc-800 mb-8 animate-reveal stagger-2">
          <h3 className="text-lg font-bold mb-6">{t.orderSummary}</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-zinc-400">{item.quantity}x {item.name}</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">{t.subtotal}</span>
              <span>€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">{t.deliveryFee}</span>
              <span className={order.deliveryFee === 0 ? 'text-green-400' : ''}>
                {order.deliveryFee === 0 ? 'Gratis' : `€${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-zinc-800">
              <span>{t.total}</span>
              <span className="gold-gradient">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-reveal stagger-3">
          <button
            onClick={onBackToMenu}
            className="flex-1 py-5 border border-zinc-800 rounded-2xl font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all"
          >
            {t.backToMenu}
          </button>
          <button
            onClick={onTrackOrder}
            className="flex-1 py-5 gold-bg text-zinc-950 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {t.trackOrder}
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center text-zinc-500 text-sm">
          <p>{language === 'pl' ? 'Pytania?' : 'Vragen?'} <a href="tel:+31703456789" className="text-gold-400 hover:underline">+31 70 345 67 89</a></p>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
};

export default OrderConfirmationView;
