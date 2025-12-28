
import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext, CartContext, CheckoutContext } from '../index';
import { TRANSLATIONS, MENU_ITEMS } from '../constants';
import { DEN_HAAG_POSTAL_CODES, DELIVERY_CONFIG, PaymentMethod, DeliveryType, CustomerInfo } from '../types';

interface CheckoutViewProps {
  onOrderComplete: (orderId: string) => void;
  onBack: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderComplete, onBack }) => {
  const langCtx = useContext(LanguageContext);
  const cartCtx = useContext(CartContext);
  const checkoutCtx = useContext(CheckoutContext);

  const [step, setStep] = useState<'details' | 'payment' | 'processing'>('details');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ideal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: 'Den Haag',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (!langCtx || !cartCtx || !checkoutCtx) return null;
  const { language } = langCtx;
  const t = TRANSLATIONS[language];

  // Calculate cart details
  const cartDetails = cartCtx.cart.map(item => {
    const menuInfo = MENU_ITEMS.find(m => m.id === item.id);
    return menuInfo ? { ...menuInfo, quantity: item.quantity } : null;
  }).filter(Boolean);

  const subtotal = cartDetails.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0);
  const deliveryFee = deliveryType === 'pickup' ? 0 : (subtotal >= DELIVERY_CONFIG.freeDeliveryFrom ? 0 : DELIVERY_CONFIG.deliveryFee);
  const total = subtotal + deliveryFee;

  // Validation functions
  const validatePostalCode = (code: string): boolean => {
    const cleaned = code.replace(/\s/g, '').toUpperCase();
    const prefix = cleaned.substring(0, 4);
    return DEN_HAAG_POSTAL_CODES.includes(prefix);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+31|0031|0)[1-9][0-9]{8}$/.test(cleaned) || /^\+?[0-9]{10,14}$/.test(cleaned);
  };

  const validateField = (field: keyof CustomerInfo, value: string): string | undefined => {
    switch (field) {
      case 'name':
        return value.trim().length < 2 ? t.requiredField : undefined;
      case 'email':
        return !validateEmail(value) ? t.invalidEmail : undefined;
      case 'phone':
        return !validatePhone(value) ? t.invalidPhone : undefined;
      case 'address':
        if (deliveryType === 'pickup') return undefined;
        return value.trim().length < 5 ? t.requiredField : undefined;
      case 'postalCode':
        if (deliveryType === 'pickup') return undefined;
        if (!value.trim()) return t.requiredField;
        return !validatePostalCode(value) ? t.denHaagOnly : undefined;
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleFieldBlur = (field: keyof CustomerInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, customer[field] || '') }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const fieldsToValidate: (keyof CustomerInfo)[] = deliveryType === 'delivery' 
      ? ['name', 'email', 'phone', 'address', 'postalCode']
      : ['name', 'email', 'phone'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, customer[field] || '');
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(fieldsToValidate.reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (subtotal < DELIVERY_CONFIG.minOrderAmount) {
      setPaymentError(t.minOrderAmount);
      return;
    }
    if (validateForm()) {
      setStep('payment');
      setPaymentError(null);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    setStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For cash payment, we skip actual payment processing
      if (paymentMethod === 'cash') {
        const orderId = await checkoutCtx.createOrder({
          customer,
          items: cartCtx.cart,
          subtotal,
          deliveryFee,
          total,
          deliveryType,
          paymentMethod,
          isPaid: false // Cash = not paid yet
        });
        onOrderComplete(orderId);
        return;
      }

      // Simulate successful payment for iDEAL/card
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        const orderId = await checkoutCtx.createOrder({
          customer,
          items: cartCtx.cart,
          subtotal,
          deliveryFee,
          total,
          deliveryType,
          paymentMethod,
          isPaid: true
        });
        onOrderComplete(orderId);
      } else {
        setPaymentError(t.paymentFailed);
        setStep('payment');
      }
    } catch (error) {
      setPaymentError(t.paymentFailed);
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const estimatedTime = deliveryType === 'delivery' 
    ? DELIVERY_CONFIG.estimatedDeliveryMinutes 
    : DELIVERY_CONFIG.estimatedPickupMinutes;

  return (
    <section className="min-h-screen py-24 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={onBack}
            title="Go back"
            aria-label="Go back"
            className="p-3 rounded-full glass border border-zinc-800 hover:border-gold-400 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-serif font-bold">{t.checkoutTitle}</h1>
            <p className="text-zinc-500 mt-1">{cartDetails.length} {language === 'pl' ? 'produktów' : 'items'}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-12">
          {['details', 'payment', 'processing'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-gold-400' : (i < ['details', 'payment', 'processing'].indexOf(step) ? 'text-green-400' : 'text-zinc-600')}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === s ? 'border-gold-400 bg-gold-400/10' : (i < ['details', 'payment', 'processing'].indexOf(step) ? 'border-green-400 bg-green-400/10' : 'border-zinc-700')}`}>
                  {i < ['details', 'payment', 'processing'].indexOf(step) ? '✓' : i + 1}
                </div>
                <span className="text-xs uppercase tracking-wider hidden sm:block">
                  {s === 'details' ? t.deliveryDetails : s === 'payment' ? t.paymentMethod : t.processing}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${i < ['details', 'payment', 'processing'].indexOf(step) ? 'bg-green-400' : 'bg-zinc-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {step === 'details' && (
              <div className="space-y-8 animate-reveal">
                {/* Delivery Type Selection */}
                <div className="glass rounded-3xl p-8 border border-zinc-800">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 text-sm">1</span>
                    {t.deliveryOption} / {t.pickupOption}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-6 rounded-2xl border-2 transition-all ${deliveryType === 'delivery' ? 'border-gold-400 bg-gold-400/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="text-3xl mb-3">🚗</div>
                      <div className="font-bold">{t.deliveryOption}</div>
                      <div className="text-sm text-zinc-500 mt-1">~{DELIVERY_CONFIG.estimatedDeliveryMinutes} min</div>
                      {subtotal < DELIVERY_CONFIG.freeDeliveryFrom && (
                        <div className="text-xs text-gold-400 mt-2">+ €{DELIVERY_CONFIG.deliveryFee.toFixed(2)}</div>
                      )}
                    </button>
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-6 rounded-2xl border-2 transition-all ${deliveryType === 'pickup' ? 'border-gold-400 bg-gold-400/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="text-3xl mb-3">🏪</div>
                      <div className="font-bold">{t.pickupOption}</div>
                      <div className="text-sm text-zinc-500 mt-1">~{DELIVERY_CONFIG.estimatedPickupMinutes} min</div>
                      <div className="text-xs text-green-400 mt-2">{language === 'pl' ? 'Bez opłat' : 'Gratis'}</div>
                    </button>
                  </div>
                  {deliveryType === 'pickup' && (
                    <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                      <div className="text-sm text-zinc-400 mb-1">{t.pickupAddress}:</div>
                      <div className="font-bold">Weimarstraat 174, 2562 HD Den Haag</div>
                    </div>
                  )}
                </div>

                {/* Customer Details */}
                <div className="glass rounded-3xl p-8 border border-zinc-800">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 text-sm">2</span>
                    {t.deliveryDetails}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.formName} *</label>
                        <input
                          type="text"
                          value={customer.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          onBlur={() => handleFieldBlur('name')}
                          className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 outline-none transition-all ${errors.name && touched.name ? 'border-red-500' : 'border-zinc-800 focus:border-gold-400'}`}
                          placeholder="Jan Kowalski"
                        />
                        {errors.name && touched.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.formEmail} *</label>
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          onBlur={() => handleFieldBlur('email')}
                          className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 outline-none transition-all ${errors.email && touched.email ? 'border-red-500' : 'border-zinc-800 focus:border-gold-400'}`}
                          placeholder="email@example.com"
                        />
                        {errors.email && touched.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        {language === 'pl' ? 'Telefon' : 'Telefoon'} *
                      </label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        onBlur={() => handleFieldBlur('phone')}
                        className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 outline-none transition-all ${errors.phone && touched.phone ? 'border-red-500' : 'border-zinc-800 focus:border-gold-400'}`}
                        placeholder="+31 6 12345678"
                      />
                      {errors.phone && touched.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {deliveryType === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                            {language === 'pl' ? 'Adres (ulica i numer)' : 'Adres (straat en nummer)'} *
                          </label>
                          <input
                            type="text"
                            value={customer.address}
                            onChange={(e) => handleFieldChange('address', e.target.value)}
                            onBlur={() => handleFieldBlur('address')}
                            className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 outline-none transition-all ${errors.address && touched.address ? 'border-red-500' : 'border-zinc-800 focus:border-gold-400'}`}
                            placeholder="Weimarstraat 10"
                          />
                          {errors.address && touched.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                              {language === 'pl' ? 'Kod pocztowy' : 'Postcode'} *
                            </label>
                            <input
                              type="text"
                              value={customer.postalCode}
                              onChange={(e) => handleFieldChange('postalCode', e.target.value.toUpperCase())}
                              onBlur={() => handleFieldBlur('postalCode')}
                              className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 outline-none transition-all ${errors.postalCode && touched.postalCode ? 'border-red-500' : 'border-zinc-800 focus:border-gold-400'}`}
                              placeholder="2562 HD"
                            />
                            {errors.postalCode && touched.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>}
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                              {language === 'pl' ? 'Miasto' : 'Stad'}
                            </label>
                            <input
                              type="text"
                              value={customer.city}
                              disabled
                              placeholder="Den Haag"
                              className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        {language === 'pl' ? 'Uwagi do zamówienia (opcjonalne)' : 'Opmerkingen (optioneel)'}
                      </label>
                      <textarea
                        value={customer.notes}
                        onChange={(e) => handleFieldChange('notes', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-gold-400 transition-all resize-none h-20"
                        placeholder={language === 'pl' ? 'Np. kod do domofonu, piętro...' : 'Bijv. belcode, verdieping...'}
                      />
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinueToPayment}
                  className="w-full py-5 gold-bg text-zinc-950 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  {language === 'pl' ? 'Przejdź do płatności' : 'Naar betaling'}
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-8 animate-reveal">
                {/* Payment Method Selection */}
                <div className="glass rounded-3xl p-8 border border-zinc-800">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 text-sm">3</span>
                    {t.paymentMethod}
                  </h3>
                  
                  {paymentError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                      {paymentError}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* iDEAL */}
                    <button
                      onClick={() => setPaymentMethod('ideal')}
                      className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'ideal' ? 'border-gold-400 bg-gold-400/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-pink-500">iD</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold">{t.idealPayment}</div>
                        <div className="text-sm text-zinc-500">{language === 'pl' ? 'Popularne w Holandii' : 'Populair in Nederland'}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'ideal' ? 'border-gold-400 bg-gold-400' : 'border-zinc-600'}`} />
                    </button>

                    {/* Card */}
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-gold-400 bg-gold-400/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-xl">💳</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold">{t.cardPayment}</div>
                        <div className="text-sm text-zinc-500">Visa, Mastercard, Amex</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'card' ? 'border-gold-400 bg-gold-400' : 'border-zinc-600'}`} />
                    </button>

                    {/* Cash (only for delivery) */}
                    {deliveryType === 'delivery' && (
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'cash' ? 'border-gold-400 bg-gold-400/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-xl">💵</span>
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-bold">{t.cashPayment}</div>
                          <div className="text-sm text-zinc-500">{language === 'pl' ? 'Płatność przy dostawie' : 'Betalen bij bezorging'}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'cash' ? 'border-gold-400 bg-gold-400' : 'border-zinc-600'}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('details')}
                    className="flex-1 py-5 border border-zinc-800 rounded-2xl font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all"
                  >
                    {language === 'pl' ? 'Wstecz' : 'Terug'}
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-[2] py-5 gold-bg text-zinc-950 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                  >
                    {paymentMethod === 'cash' 
                      ? (language === 'pl' ? 'Potwierdź zamówienie' : 'Bestelling bevestigen')
                      : t.payNow
                    } - €{total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="glass rounded-3xl p-16 border border-zinc-800 text-center animate-reveal">
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold-400/10 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{t.processing}</h3>
                <p className="text-zinc-500">{language === 'pl' ? 'Prosimy nie zamykać strony...' : 'Sluit deze pagina niet...'}</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl p-6 border border-zinc-800 sticky top-24">
              <h3 className="text-lg font-bold mb-6">{t.orderSummary}</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartDetails.map((item) => item && (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-800">
                      <img src={item.image} alt={item.names[language]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.names[language]}</div>
                      <div className="text-xs text-zinc-500">x{item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold">€{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t.subtotal}</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t.deliveryFee}</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                    {deliveryFee === 0 ? (language === 'pl' ? 'Gratis' : 'Gratis') : `€${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < DELIVERY_CONFIG.freeDeliveryFrom && deliveryType === 'delivery' && (
                  <div className="text-xs text-gold-400 text-center py-2">
                    {t.freeDeliveryFrom}
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
                  <span>{t.totalToPay}</span>
                  <span className="gold-gradient">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>⏱️</span>
                  <span>{t.estimatedTime}: ~{estimatedTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutView;
