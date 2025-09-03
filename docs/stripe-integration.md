# Stripe Integration Guide

This document provides detailed information on integrating with the Stripe API for payment processing in the GeneGroove application.

## Overview

GeneGroove uses Stripe to implement its micro-transaction business model, charging users $0.25 per DNA scan and $2.00 for detailed trait reports. This guide covers the integration of Stripe for payment processing.

## Prerequisites

Before integrating Stripe, you need:

1. A Stripe account (sign up at [https://stripe.com](https://stripe.com))
2. API keys (publishable and secret)
3. Webhook endpoint configuration

## API Key Setup

Stripe requires two types of API keys:

1. **Publishable Key:** Used for client-side operations
2. **Secret Key:** Used for server-side operations

Store these keys securely in your environment variables:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

## Integration Architecture

GeneGroove integrates with Stripe using the following architecture:

1. User initiates a payment for a detailed trait report
2. Client-side code creates a payment intent using the Stripe API
3. User completes payment using the Stripe Elements UI
4. Stripe confirms the payment and sends a webhook notification
5. Application updates the user's access to detailed traits

## Client-Side Integration

### Installing Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Initializing Stripe

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

### Creating a Payment Intent

```javascript
const createPaymentIntent = async (amount, description) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        description: description,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error.message || 'Failed to create payment intent');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
```

### Implementing the Payment Form

```jsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount, description, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(amount, description);
      
      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      
      if (result.error) {
        setError(result.error.message);
        onError(result.error);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      setError(error.message);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};
```

## Server-Side Integration

### Creating a Payment Intent

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description: description,
      metadata: {
        description: description,
      },
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
});
```

### Handling Webhooks

```javascript
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update user's access to detailed traits
      await updateUserAccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      // Handle failed payment
      await handleFailedPayment(failedPaymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});
```

## Implementing the Micro-Transaction Model

GeneGroove uses a micro-transaction model with two payment tiers:

1. **Basic Scan ($0.25):** Provides basic trait analysis
2. **Detailed Report ($2.00):** Provides comprehensive trait analysis with scientific explanations and recommendations

### Handling Basic Scan Payments

```javascript
const handleBasicScanPayment = async (userId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 25, // $0.25 in cents
      currency: 'usd',
      description: 'Basic DNA Scan',
      metadata: {
        userId: userId,
        type: 'basic_scan',
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating basic scan payment:', error);
    throw error;
  }
};
```

### Handling Detailed Report Payments

```javascript
const handleDetailedReportPayment = async (userId, analysisId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200, // $2.00 in cents
      currency: 'usd',
      description: 'Detailed DNA Analysis Report',
      metadata: {
        userId: userId,
        analysisId: analysisId,
        type: 'detailed_report',
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating detailed report payment:', error);
    throw error;
  }
};
```

## Tracking Payment History

GeneGroove tracks payment history for each user to manage access to paid features:

```javascript
const addPaymentToHistory = (user, payment) => {
  const newPayment = {
    id: payment.id,
    amount: payment.amount / 100, // Convert cents to dollars
    description: payment.description,
    timestamp: new Date().toISOString(),
    status: payment.status,
  };
  
  user.paymentHistory = [newPayment, ...user.paymentHistory];
  
  return user;
};
```

## Testing Payments

For testing payments, Stripe provides test card numbers:

- **Successful Payment:** 4242 4242 4242 4242
- **Requires Authentication:** 4000 0025 0000 3155
- **Declined Payment:** 4000 0000 0000 0002

Test the payment flow in development using these card numbers with any future expiration date, CVC, and postal code.

## Error Handling

Handle common Stripe errors:

```javascript
const handleStripeError = (error) => {
  let message;
  
  switch (error.type) {
    case 'card_error':
      message = error.message;
      break;
    case 'validation_error':
      message = error.message;
      break;
    case 'authentication_error':
      message = 'Authentication with Stripe failed. Please try again.';
      break;
    case 'rate_limit_error':
      message = 'Too many requests. Please try again later.';
      break;
    case 'api_error':
      message = 'Stripe API error. Please try again later.';
      break;
    case 'api_connection_error':
      message = 'Failed to connect to Stripe. Please check your internet connection.';
      break;
    default:
      message = 'An unexpected error occurred. Please try again.';
  }
  
  return message;
};
```

## Security Considerations

1. **PCI Compliance:** Use Stripe Elements to collect card details securely
2. **API Keys:** Never expose secret keys in client-side code
3. **HTTPS:** Ensure all API requests are made over HTTPS
4. **Webhook Signatures:** Verify webhook signatures to prevent tampering
5. **Idempotency:** Use idempotency keys for API requests to prevent duplicate charges

## Going to Production

Before going to production:

1. Switch from test to live API keys
2. Update webhook endpoints to production URLs
3. Implement proper error handling and logging
4. Set up monitoring and alerts for payment failures
5. Implement a refund policy and process

## Support

For issues with the Stripe API, contact:

- Email: support@stripe.com
- Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Status Page: [https://status.stripe.com](https://status.stripe.com)

