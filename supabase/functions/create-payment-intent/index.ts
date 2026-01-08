// Supabase Edge Function for creating Stripe PaymentIntent
// Deploy: supabase functions deploy create-payment-intent
// @ts-nocheck - Deno runtime types not available in VS Code

import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency, paymentMethod, customerEmail, customerName, metadata }: PaymentRequest = await req.json();

    // Validate input
    if (!amount || amount < 100) {
      throw new Error('Amount must be at least 100 cents (€1.00)');
    }

    // Map payment method to Stripe payment_method_types
    const paymentMethodTypes: string[] = [];
    switch (paymentMethod) {
      case 'ideal':
        paymentMethodTypes.push('ideal');
        break;
      case 'bancontact':
        paymentMethodTypes.push('bancontact');
        break;
      case 'sofort':
        paymentMethodTypes.push('sofort');
        break;
      case 'card':
      default:
        paymentMethodTypes.push('card');
        break;
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'eur',
      payment_method_types: paymentMethodTypes,
      receipt_email: customerEmail,
      metadata: {
        customerName,
        ...metadata,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Payment Intent creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
