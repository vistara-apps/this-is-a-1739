# GenoBank.io Integration Guide

This document provides detailed information on integrating with the GenoBank.io API for DNA sequence analysis in the GeneGroove application.

## Overview

GenoBank.io is a genomic data platform that provides APIs for DNA sequence analysis, variant calling, and trait prediction. GeneGroove uses these APIs to analyze user-uploaded DNA sequences and provide insights into genetic traits.

## API Key Setup

To use the GenoBank.io API, you need an API key. Follow these steps to obtain and configure your API key:

1. Sign up for a GenoBank.io developer account at [https://genobank.io/developers](https://genobank.io/developers)
2. Create a new API key in the developer dashboard
3. Store the API key securely in your environment variables:
   ```
   REACT_APP_GENOBANK_API_KEY=your_api_key_here
   ```

## Integration Architecture

The GeneGroove application integrates with GenoBank.io using the following architecture:

1. User uploads a DNA sequence in FASTA format
2. The sequence is validated client-side for format and size
3. The sequence is uploaded to GenoBank.io for analysis
4. Variant calling is performed to identify SNPs
5. Trait predictions are generated based on the identified variants
6. Results are displayed to the user

## API Endpoints

### Upload Sequence

```javascript
// Upload a DNA sequence in FASTA format
const uploadSequence = async (fastaContent) => {
  const response = await genoBankApi.post('/upload-fasta', {
    sequence: fastaContent,
    format: 'fasta'
  });
  
  return response.data;
};
```

### Variant Calling

```javascript
// Perform variant calling on an uploaded sequence
const performVariantCalling = async (sequenceId) => {
  const response = await genoBankApi.post('/variant-calling', {
    sequenceId: sequenceId
  });
  
  return response.data;
};
```

### Trait Prediction

```javascript
// Get trait predictions based on identified variants
const getTraitPredictions = async (variantCallId, detailed = false) => {
  const response = await genoBankApi.post('/trait-predictions', {
    variantCallId: variantCallId,
    detailed: detailed
  });
  
  return response.data;
};
```

### Pattern Matching

```javascript
// Perform pattern matching on a DNA sequence
const performPatternMatching = async (sequenceId, patterns) => {
  const response = await genoBankApi.post('/pattern-match', {
    sequenceId: sequenceId,
    patterns: patterns
  });
  
  return response.data;
};
```

## Complete Analysis Flow

The complete DNA analysis flow involves multiple API calls in sequence:

```javascript
// Complete DNA analysis process
const analyzeDNA = async (fastaContent, detailed = false) => {
  // Step 1: Upload sequence
  const uploadResult = await uploadSequence(fastaContent);
  const sequenceId = uploadResult.sequenceId;
  
  // Step 2: Perform variant calling
  const variantResult = await performVariantCalling(sequenceId);
  const variantCallId = variantResult.variantCallId;
  
  // Step 3: Get trait predictions
  const traitResult = await getTraitPredictions(variantCallId, detailed);
  
  // Step 4: Perform basic pattern matching
  const patternResult = await performPatternMatching(sequenceId, [
    'GATTACA',
    'TTAGGG',
    'CCCTAA'
  ]);
  
  // Combine all results
  return {
    sequenceId: sequenceId,
    sequenceLength: uploadResult.sequenceLength,
    snps: variantResult.variants,
    basicResults: traitResult.basicTraits,
    detailedResults: detailed ? traitResult.detailedTraits : [],
    patternMatches: patternResult.matches,
    processingTime: traitResult.processingTime
  };
};
```

## Error Handling

The GenoBank.io API may return various errors. Here's how to handle them:

```javascript
try {
  const result = await analyzeDNA(fastaContent, detailed);
  // Process result
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const errorData = error.response.data;
    
    if (status === 400) {
      // Handle validation errors
      console.error('Validation error:', errorData.error.message);
    } else if (status === 401) {
      // Handle authentication errors
      console.error('Authentication error: Invalid API key');
    } else if (status === 402) {
      // Handle payment required errors
      console.error('Payment required for detailed analysis');
    } else if (status === 429) {
      // Handle rate limiting
      console.error('Rate limit exceeded. Try again later.');
    } else {
      // Handle other errors
      console.error('API error:', errorData.error.message);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response from server. Check your network connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up request:', error.message);
  }
}
```

## Rate Limits and Quotas

GenoBank.io imposes rate limits and quotas on API usage:

- **Free Tier:**
  - 10 requests per minute
  - 1000 requests per day
  - Maximum sequence size: 1MB
  - No detailed trait predictions

- **Paid Tier:**
  - 100 requests per minute
  - 10000 requests per day
  - Maximum sequence size: 10MB
  - Detailed trait predictions available

## Fallback Strategy

In case the GenoBank.io API is unavailable or rate limits are exceeded, GeneGroove implements a fallback strategy using mock data:

```javascript
// Fallback mock implementation
export function mockAnalyzeDNA(fastaInput) {
  console.warn('Using mock DNA analysis - for development only');
  
  const sequence = extractSequence(fastaInput);
  
  // Mock SNP database and trait predictions
  // ...
  
  return {
    sequenceId: 'mock-seq-' + Math.random().toString(36).substring(2, 10),
    sequenceLength: sequence.length,
    snps: findSNPs(),
    basicResults: shuffledBasic.slice(0, 6),
    detailedResults: shuffledDetailed,
    patternMatches: PATTERN_MATCHES,
    processingTime: Math.floor(Math.random() * 3000) + 1000
  };
}
```

## Testing

For testing the GenoBank.io integration, use the provided test API key and sample FASTA sequences:

```
>Sample DNA Sequence
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
TCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
```

## Troubleshooting

Common issues and solutions:

1. **API Key Invalid:** Ensure your API key is correctly set in the environment variables
2. **Rate Limit Exceeded:** Implement exponential backoff and retry logic
3. **Invalid FASTA Format:** Validate FASTA format client-side before uploading
4. **Large Sequence Size:** Implement client-side file size validation
5. **Network Errors:** Implement proper error handling and retry logic

## Support

For issues with the GenoBank.io API, contact:

- Email: support@genobank.io
- Documentation: [https://docs.genobank.io](https://docs.genobank.io)
- Status Page: [https://status.genobank.io](https://status.genobank.io)

