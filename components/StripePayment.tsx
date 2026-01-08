import React, { useState, useContext } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { LanguageContext } from '../index';
import { TRANSLATIONS } from '../constants';
import { getStripe, IDEAL_BANKS, eurosToCents, createPaymentIntent } from '../services/stripeService';
import type { PaymentMethod, CustomerInfo } from '../types';

interface StripePaymentFormProps {
  paymentMethod: PaymentMethod;
  customer: CustomerInfo;
  total: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

// Card Element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: '"Inter", system-ui, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#3b82f6',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

const PaymentForm: React.FC<StripePaymentFormProps> = ({
  paymentMethod,
  customer,
  total,
  onPaymentSuccess,
  onPaymentError,
  onProcessingChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const langCtx = useContext(LanguageContext);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  if (!langCtx) return null;
  const { language } = langCtx;
  const t = TRANSLATIONS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onPaymentError('Stripe is nog niet geladen');
      return;
    }

    // Validate iDEAL bank selection
    if (paymentMethod === 'ideal' && !selectedBank) {
      onPaymentError(language === 'pl' ? 'Wybierz bank' : 'Selecteer een bank');
      return;
    }

    setIsLoading(true);
    onProcessingChange(true);
    setCardError(null);

    try {
      // Create payment intent on backend
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        amount: eurosToCents(total),
        currency: 'eur',
        paymentMethod: paymentMethod,
        customerEmail: customer.email,
        customerName: customer.name,
        metadata: {
          customerPhone: customer.phone,
          customerAddress: customer.address || '',
          customerCity: customer.city,
        },
      });

      let result;

      const billingDetails = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: {
          line1: customer.address || undefined,
          city: customer.city,
          postal_code: customer.postalCode || undefined,
          country: 'NL',
        },
      };

      switch (paymentMethod) {
        case 'ideal':
          // Use confirmIdealPayment with bank parameter
          result = await stripe.confirmIdealPayment(clientSecret, {
            payment_method: {
              ideal: {
                bank: selectedBank,
              },
              billing_details: billingDetails,
            },
            return_url: `${window.location.origin}?payment_intent=${paymentIntentId}`,
          });
          break;

        case 'bancontact':
          result = await stripe.confirmBancontactPayment(clientSecret, {
            payment_method: {
              billing_details: billingDetails,
            },
            return_url: `${window.location.origin}?payment_intent=${paymentIntentId}`,
          });
          break;

        case 'card':
        default:
          const cardElement = elements.getElement(CardElement);
          if (!cardElement) {
            throw new Error('Card element niet gevonden');
          }
          result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement as any,
              billing_details: billingDetails,
            },
          });
          break;
      }

      if (result.error) {
        onPaymentError(result.error.message || t.paymentFailed);
        setCardError(result.error.message || null);
      } else if (result.paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(result.paymentIntent.id);
      } else if (result.paymentIntent?.status === 'requires_action') {
        // 3D Secure or redirect required - Stripe handles this automatically
        console.log('Payment requires additional action');
      } else {
        // For redirect-based payments (iDEAL, Bancontact), we'll handle on return
        console.log('Payment initiated, awaiting redirect completion');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError(error.message || t.paymentFailed);
    } finally {
      setIsLoading(false);
      onProcessingChange(false);
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'ideal':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-pink-500">iD</span>
                <span className="font-medium text-gray-800">{t.idealPayment}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'pl' 
                  ? 'Wybierz swój bank i zostaniesz przekierowany do bezpiecznej płatności.'
                  : 'Kies je bank en je wordt doorgestuurd voor een veilige betaling.'}
              </p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                {language === 'pl' ? 'Wybierz bank' : 'Kies je bank'}
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                title={language === 'pl' ? 'Wybierz bank' : 'Selecteer bank'}
                className="w-full border border-gray-300 rounded-xl p-4 bg-white text-gray-800 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">{language === 'pl' ? '-- Wybierz bank --' : '-- Selecteer bank --'}</option>
                {IDEAL_BANKS.map(bank => (
                  <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'bancontact':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🇧🇪</span>
                <span className="font-medium text-gray-800">Bancontact</span>
              </div>
              <p className="text-sm text-gray-600">
                {language === 'pl'
                  ? 'Zostaniesz przekierowany do Bancontact aby dokończyć płatność.'
                  : 'Je wordt doorgestuurd naar Bancontact om de betaling af te ronden.'}
              </p>
            </div>
          </div>
        );

      case 'card':
      default:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💳</span>
                <span className="font-medium text-gray-800">{t.cardPayment}</span>
              </div>
              <div className="flex gap-2 mb-2">
                <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/visa.svg" alt="Visa" className="h-6 w-auto" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-bold">VISA</span>
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold">MC</span>
                <span className="text-xs bg-blue-400 text-white px-2 py-0.5 rounded font-bold">AMEX</span>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                {language === 'pl' ? 'Dane karty' : 'Kaartgegevens'}
              </label>
              <div className="border border-gray-300 rounded-xl p-4 bg-white focus-within:border-blue-500 transition-colors">
                <CardElement 
                  options={CARD_ELEMENT_OPTIONS}
                  onChange={(event) => {
                    if (event.error) {
                      setCardError(event.error.message);
                    } else {
                      setCardError(null);
                    }
                  }}
                />
              </div>
              {cardError && (
                <p className="text-red-500 text-sm mt-2">{cardError}</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderPaymentFields()}
      
      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>{language === 'pl' ? 'Bezpieczna płatność przez Stripe' : 'Veilige betaling via Stripe'}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-102 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t.processing}
          </span>
        ) : (
          <>
            {t.payNow} - €{total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

// Wrapper component with Stripe Elements provider
interface StripePaymentProps {
  paymentMethod: PaymentMethod;
  customer: CustomerInfo;
  total: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  const stripePromise = getStripe();

  return (
    <Elements 
      stripe={stripePromise}
      options={{
        locale: 'nl',
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: '"Inter", system-ui, sans-serif',
            borderRadius: '12px',
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;
