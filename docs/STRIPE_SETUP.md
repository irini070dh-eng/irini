# Stripe Payment Integration Setup

## Overview
This guide explains how to set up Stripe payments for the Greek Irini restaurant application with Dutch payment methods.

## Supported Payment Methods

### Netherlands (Primary Market)
- **iDEAL** - Most popular Dutch payment method (~60% of online payments)
- **Credit/Debit Cards** - Visa, Mastercard, American Express, Maestro
- **Bancontact** - Popular in Belgium and used by some Dutch customers
- **Sofort/Klarna** - Bank transfers (optional)
- **Cash** - Payment on delivery (no Stripe processing)

## Configuration

### 1. Stripe Dashboard Setup

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Settings** → **Payment Methods**
3. Enable the following payment methods:
   - iDEAL
   - Cards
   - Bancontact
   - Sofort (optional)

### 2. API Keys

#### Test Mode (Current)
```
Publishable Key: pk_test_51SkBRBFvfuoSDpaON7lAmMKoWcp6VO2i64LWZwI45gFGu9iLAb054BEvC2VG7hZ37J29ERHpxrwUkxndN7MQhO7u00qqSXSfTR
```

#### Production Mode
When ready to go live:
1. Go to Stripe Dashboard → Developers → API keys
2. Toggle from "Test mode" to "Live mode"
3. Copy the live publishable key
4. Update `services/stripeService.ts` with the live key

### 3. Backend Setup (Required for Production)

⚠️ **IMPORTANT**: The current implementation uses a demo/simulated payment flow. For production, you need a backend server to:

1. Create Payment Intents securely using the Secret Key
2. Handle webhooks for payment confirmations
3. Process refunds

#### Required Backend Endpoints

```typescript
// POST /api/create-payment-intent
// Creates a PaymentIntent and returns the client secret

// POST /api/webhooks/stripe
// Handles Stripe webhook events (payment_intent.succeeded, etc.)
```

#### Example Supabase Edge Function

Create a Supabase Edge Function for payment processing:

```typescript
// supabase/functions/create-payment-intent/index.ts
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

Deno.serve(async (req) => {
  const { amount, currency, customerEmail, metadata } = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['ideal', 'card', 'bancontact'],
    receipt_email: customerEmail,
    metadata,
  });

  return new Response(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

### 4. Webhook Configuration

For production, set up webhooks in Stripe Dashboard:

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

### 5. Environment Variables

For production, set these environment variables:

```env
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Testing

### Test Card Numbers
- **Successful payment**: 4242 4242 4242 4242
- **Requires authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 0002

### Test iDEAL Banks
All iDEAL test banks work in test mode. Select any bank to simulate the payment flow.

### Test Bancontact
Use any valid Belgian phone format for testing.

## Translations

The payment UI supports:
- 🇳🇱 Dutch (nl) - Primary
- 🇵🇱 Polish (pl)
- 🇬🇷 Greek (el)
- 🇹🇷 Turkish (tr)
- 🇦🇪 Arabic (ar)
- 🇧🇬 Bulgarian (bg)

## Security Considerations

1. **Never expose the Secret Key** in frontend code
2. **Validate amounts** on the backend
3. **Use webhooks** to confirm payments (don't rely on client-side confirmation alone)
4. **Enable Radar** for fraud detection in Stripe Dashboard

## Troubleshooting

### Common Issues

1. **"Stripe is not loaded"**
   - Check internet connection
   - Verify publishable key is correct

2. **iDEAL bank selection not showing**
   - Ensure iDEAL is enabled in Stripe Dashboard
   - Check that you're using EUR currency

3. **Payment redirect fails**
   - Verify `return_url` is correctly set
   - Check domain is added to Stripe's allowed domains

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
