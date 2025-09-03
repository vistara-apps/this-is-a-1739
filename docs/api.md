# GeneGroove API Documentation

This document provides comprehensive documentation for the GeneGroove API, including endpoints, request/response formats, authentication requirements, and error handling.

## Overview

GeneGroove uses two primary external APIs:

1. **GenoBank.io API** - For DNA sequence analysis, variant calling, and trait prediction
2. **Stripe API** - For payment processing

## Authentication

### GenoBank.io API Authentication

The GenoBank.io API requires an API key for authentication. This key should be included in the `Authorization` header of all requests.

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};
```

### Stripe API Authentication

Stripe payments are handled through the client-side Stripe.js library, which requires a publishable key. Server-side operations require a secret key.

```javascript
// Client-side
const stripe = Stripe('pk_test_your_publishable_key');

// Server-side
const stripe = require('stripe')('sk_test_your_secret_key');
```

## GenoBank.io API Endpoints

### Upload FASTA Sequence

Uploads a DNA sequence in FASTA format for analysis.

**Endpoint:** `/api/v1/upload-fasta`

**Method:** POST

**Request Body:**
```json
{
  "sequence": ">Sample DNA Sequence\nATCGATCGATCGATCGATCG...",
  "format": "fasta"
}
```

**Response:**
```json
{
  "success": true,
  "sequenceId": "seq_1234567890",
  "sequenceLength": 1000,
  "message": "Sequence uploaded successfully"
}
```

**Error Responses:**
- 400 Bad Request - Invalid sequence format
- 401 Unauthorized - Invalid API key
- 413 Payload Too Large - Sequence exceeds size limit
- 500 Internal Server Error - Server error

### Perform Variant Calling

Identifies SNPs and other variants in an uploaded sequence.

**Endpoint:** `/api/v1/variant-calling`

**Method:** POST

**Request Body:**
```json
{
  "sequenceId": "seq_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "variantCallId": "var_1234567890",
  "variants": [
    {
      "id": "rs1815739",
      "position": 23423,
      "allele": "T",
      "trait": "Muscle Fiber Type",
      "confidence": "High"
    },
    // More variants...
  ],
  "message": "Variant calling completed successfully"
}
```

**Error Responses:**
- 400 Bad Request - Invalid sequence ID
- 401 Unauthorized - Invalid API key
- 404 Not Found - Sequence not found
- 500 Internal Server Error - Server error

### Get Trait Predictions

Predicts traits based on identified variants.

**Endpoint:** `/api/v1/trait-predictions`

**Method:** POST

**Request Body:**
```json
{
  "variantCallId": "var_1234567890",
  "detailed": true
}
```

**Response:**
```json
{
  "success": true,
  "basicTraits": [
    {
      "name": "Muscle Fiber Composition",
      "prediction": "Fast-twitch dominant",
      "description": "You likely excel at explosive, short-duration activities.",
      "confidence": "High"
    },
    // More basic traits...
  ],
  "detailedTraits": [
    {
      "name": "Athletic Performance Potential",
      "prediction": "Optimized for power sports",
      "description": "Your genetic profile suggests natural advantages in activities requiring explosive power and strength.",
      "confidence": "High",
      "scientificBasis": "Based on ACTN3 gene variants that affect fast-twitch muscle fiber distribution and mitochondrial efficiency.",
      "recommendation": "Consider incorporating high-intensity interval training and power-based exercises into your fitness routine."
    },
    // More detailed traits...
  ],
  "processingTime": 1500,
  "message": "Trait prediction completed successfully"
}
```

**Error Responses:**
- 400 Bad Request - Invalid variant call ID
- 401 Unauthorized - Invalid API key
- 402 Payment Required - Detailed traits require payment
- 404 Not Found - Variant call not found
- 500 Internal Server Error - Server error

### Pattern Matching

Searches for specific DNA patterns in an uploaded sequence.

**Endpoint:** `/api/v1/pattern-match`

**Method:** POST

**Request Body:**
```json
{
  "sequenceId": "seq_1234567890",
  "patterns": ["GATTACA", "TTAGGG", "CCCTAA"]
}
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "pattern": "GATTACA",
      "positions": [1024, 5678, 9012],
      "significance": "Common in DNA repair genes"
    },
    {
      "pattern": "TTAGGG",
      "positions": [3456, 7890],
      "significance": "Telomere repeat sequence"
    }
  ],
  "message": "Pattern matching completed successfully"
}
```

**Error Responses:**
- 400 Bad Request - Invalid sequence ID or patterns
- 401 Unauthorized - Invalid API key
- 404 Not Found - Sequence not found
- 500 Internal Server Error - Server error

## Stripe Payment API

### Create Payment Intent

Creates a payment intent for processing a payment.

**Endpoint:** `/api/payment`

**Method:** POST

**Request Body:**
```json
{
  "amount": "$2.00",
  "description": "Detailed DNA Analysis Report"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_1234567890",
  "amount": 200,
  "currency": "usd",
  "description": "Detailed DNA Analysis Report"
}
```

**Error Responses:**
- 400 Bad Request - Invalid amount or description
- 401 Unauthorized - Invalid API key
- 500 Internal Server Error - Server error

## Error Handling

All API endpoints return standardized error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "invalid_sequence",
    "message": "The provided sequence is not in valid FASTA format",
    "details": {
      // Additional error details if available
    }
  }
}
```

### Common Error Codes

- `invalid_request` - The request is malformed or missing required parameters
- `authentication_error` - Invalid API key or authentication token
- `not_found` - The requested resource was not found
- `payment_required` - Payment is required to access this resource
- `rate_limit_exceeded` - API rate limit has been exceeded
- `server_error` - Internal server error

## Rate Limits

The GenoBank.io API has the following rate limits:

- 10 requests per minute for free tier
- 100 requests per minute for paid tier
- 1000 requests per day for free tier
- 10000 requests per day for paid tier

When a rate limit is exceeded, the API will return a 429 Too Many Requests response with a Retry-After header indicating when the client can retry the request.

## Webhooks

Stripe provides webhooks for payment events. Configure your webhook endpoint in the Stripe dashboard to receive the following events:

- `payment_intent.succeeded` - Payment was successful
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment was canceled

## Testing

The GenoBank.io API provides a sandbox environment for testing. Use the test API key to access the sandbox environment.

For Stripe, use test card numbers for testing payments:

- 4242 4242 4242 4242 - Successful payment
- 4000 0000 0000 0002 - Declined payment
- 4000 0000 0000 9995 - Insufficient funds

## Support

For API support, contact:

- GenoBank.io API: support@genobank.io
- Stripe API: support@stripe.com
- GeneGroove Support: support@genegroove.com

