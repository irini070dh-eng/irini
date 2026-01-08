// Netlify Function for creating Stripe PaymentIntent
// This function handles the server-side payment intent creation

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { amount, currency, paymentMethod, customerEmail, customerName, metadata } = JSON.parse(event.body);

    // Validate input
    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Amount must be at least 100 cents (€1.00)' }),
      };
    }

    // Map payment method to Stripe payment_method_types
    const paymentMethodTypes = [];
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Payment Intent creation error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
