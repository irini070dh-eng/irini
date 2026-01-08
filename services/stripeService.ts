import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabaseClient';

// Stripe Publishable Key (Test Mode)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SkBRBFvfuoSDpaON7lAmMKoWcp6VO2i64LWZwI45gFGu9iLAb054BEvC2VG7hZ37J29ERHpxrwUkxndN7MQhO7u00qqSXSfTR';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Dutch payment methods configuration
export const DUTCH_PAYMENT_METHODS = {
  ideal: {
    id: 'ideal',
    name: 'iDEAL',
    description: 'Populair in Nederland',
    icon: '🏦',
    countries: ['NL'],
  },
  card: {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: '💳',
    countries: ['*'],
  },
  bancontact: {
    id: 'bancontact',
    name: 'Bancontact',
    description: 'Populair in België',
    icon: '🇧🇪',
    countries: ['BE', 'NL'],
  },
  sofort: {
    id: 'sofort',
    name: 'Sofort/Klarna',
    description: 'Direct betalen via bank',
    icon: '🔐',
    countries: ['NL', 'DE', 'AT', 'BE'],
  },
} as const;

// iDEAL Banks list (Netherlands)
export const IDEAL_BANKS = [
  { id: 'abn_amro', name: 'ABN AMRO' },
  { id: 'asn_bank', name: 'ASN Bank' },
  { id: 'bunq', name: 'bunq' },
  { id: 'ing', name: 'ING' },
  { id: 'knab', name: 'Knab' },
  { id: 'n26', name: 'N26' },
  { id: 'nn', name: 'NN (Nationale-Nederlanden)' },
  { id: 'rabobank', name: 'Rabobank' },
  { id: 'revolut', name: 'Revolut' },
  { id: 'sns_bank', name: 'SNS Bank' },
  { id: 'triodos_bank', name: 'Triodos Bank' },
  { id: 'van_lanschot', name: 'Van Lanschot' },
  { id: 'yoursafe', name: 'Yoursafe' },
] as const;

export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  orderId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Detect if running on Netlify (production) or locally
const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify');
const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Create PaymentIntent via backend (Netlify Functions or Supabase Edge Function)
export const createPaymentIntent = async (data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
  console.log('Creating payment intent:', data);
  
  try {
    // Try Netlify Functions first (works in production and can work locally with netlify dev)
    const netlifyEndpoint = isLocalDev 
      ? '/.netlify/functions/create-payment-intent'
      : '/.netlify/functions/create-payment-intent';
    
    try {
      const response = await fetch(netlifyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.clientSecret) {
          return {
            clientSecret: result.clientSecret,
            paymentIntentId: result.paymentIntentId,
          };
        }
      }
    } catch (netlifyError) {
      console.log('Netlify function not available, trying Supabase...');
    }

    // Fallback to Supabase Edge Function
    const { data: response, error } = await supabase.functions.invoke('create-payment-intent', {
      body: data,
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to create payment intent');
    }

    if (!response || !response.clientSecret) {
      throw new Error('Invalid response from payment service');
    }

    return {
      clientSecret: response.clientSecret,
      paymentIntentId: response.paymentIntentId,
    };
  } catch (error: any) {
    console.error('Payment intent creation failed:', error);
    throw error;
  }
};

// Confirm payment with Stripe
export const confirmPayment = async (
  stripe: Stripe,
  clientSecret: string,
  paymentMethodType: string,
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    };
  }
) => {
  const paymentMethodData: any = {
    billing_details: billingDetails,
  };

  switch (paymentMethodType) {
    case 'ideal':
      return stripe.confirmIdealPayment(clientSecret, {
        payment_method: paymentMethodData,
        return_url: `${window.location.origin}/order-confirmation`,
      });
    
    case 'bancontact':
      return stripe.confirmBancontactPayment(clientSecret, {
        payment_method: paymentMethodData,
        return_url: `${window.location.origin}/order-confirmation`,
      });
    
    case 'sofort':
      return stripe.confirmSofortPayment(clientSecret, {
        payment_method: {
          ...paymentMethodData,
          sofort: {
            country: 'NL',
          },
        },
        return_url: `${window.location.origin}/order-confirmation`,
      });
    
    case 'card':
    default:
      return stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodData,
      });
  }
};

// Format amount for display
export const formatAmount = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Convert euros to cents for Stripe
export const eurosToCents = (euros: number): number => {
  return Math.round(euros * 100);
};

// Convert cents to euros
export const centsToEuros = (cents: number): number => {
  return cents / 100;
};
