/**
 * GenoBank.io API Service
 * 
 * This service handles all interactions with the GenoBank.io API for DNA analysis,
 * including sequence upload, variant calling, and trait prediction.
 */

import axios from 'axios';

// API configuration
const API_BASE_URL = 'https://api.genobank.io/v1';
const API_KEY = process.env.REACT_APP_GENOBANK_API_KEY || 'demo_key'; // Use environment variable in production

// Create axios instance with default config
const genoBankApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

/**
 * Extract sequence data from FASTA format
 * @param {string} fastaText - Raw FASTA format text
 * @returns {string} - Extracted DNA sequence
 */
export function extractSequence(fastaText) {
  const lines = fastaText.trim().split('\n');
  // Skip the header line (starts with '>') and join the rest
  return lines.slice(1).join('').toUpperCase().replace(/\\s/g, '');
}

/**
 * Validate a DNA sequence
 * @param {string} sequence - DNA sequence to validate
 * @returns {boolean} - Whether the sequence is valid
 */
export function validateSequence(sequence) {
  // Check if sequence contains only valid DNA bases (A, T, C, G, N)
  return /^[ATCGN]+$/.test(sequence);
}

/**
 * Upload a DNA sequence to GenoBank.io
 * @param {string} fastaContent - FASTA format content
 * @returns {Promise<Object>} - Upload response with sequence ID
 */
export async function uploadSequence(fastaContent) {
  try {
    const sequence = extractSequence(fastaContent);
    
    if (!validateSequence(sequence)) {
      throw new Error('Invalid DNA sequence. Sequence must contain only A, T, C, G, or N bases.');
    }
    
    const response = await genoBankApi.post('/upload-fasta', {
      sequence: fastaContent,
      format: 'fasta'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading sequence:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload DNA sequence. Please try again.');
  }
}

/**
 * Perform variant calling (SNP identification) on an uploaded sequence
 * @param {string} sequenceId - ID of the uploaded sequence
 * @returns {Promise<Object>} - Variant calling results with identified SNPs
 */
export async function performVariantCalling(sequenceId) {
  try {
    const response = await genoBankApi.post('/variant-calling', {
      sequenceId: sequenceId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error performing variant calling:', error);
    throw new Error(error.response?.data?.message || 'Failed to identify genetic variants. Please try again.');
  }
}

/**
 * Get trait predictions based on identified variants
 * @param {string} variantCallId - ID of the variant calling result
 * @param {boolean} detailed - Whether to get detailed trait predictions
 * @returns {Promise<Object>} - Trait prediction results
 */
export async function getTraitPredictions(variantCallId, detailed = false) {
  try {
    const response = await genoBankApi.post('/trait-predictions', {
      variantCallId: variantCallId,
      detailed: detailed
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting trait predictions:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate trait predictions. Please try again.');
  }
}

/**
 * Perform pattern matching on a DNA sequence
 * @param {string} sequenceId - ID of the uploaded sequence
 * @param {Array<string>} patterns - Array of patterns to search for
 * @returns {Promise<Object>} - Pattern matching results
 */
export async function performPatternMatching(sequenceId, patterns) {
  try {
    const response = await genoBankApi.post('/pattern-match', {
      sequenceId: sequenceId,
      patterns: patterns
    });
    
    return response.data;
  } catch (error) {
    console.error('Error performing pattern matching:', error);
    throw new Error(error.response?.data?.message || 'Failed to perform pattern matching. Please try again.');
  }
}

/**
 * Complete DNA analysis process (upload, variant calling, trait prediction)
 * @param {string} fastaContent - FASTA format content
 * @param {boolean} detailed - Whether to get detailed trait predictions
 * @returns {Promise<Object>} - Complete analysis results
 */
export async function analyzeDNA(fastaContent, detailed = false) {
  try {
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
      'GATTACA', // Example patterns
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
  } catch (error) {
    console.error('Error analyzing DNA:', error);
    throw new Error(error.message || 'Failed to complete DNA analysis. Please try again.');
  }
}

// Fallback mock implementation for development/testing
export function mockAnalyzeDNA(fastaInput) {
  console.warn('Using mock DNA analysis - for development only');
  
  const sequence = extractSequence(fastaInput);
  
  // Mock SNP database
  const SNP_DATABASE = [
    { id: 'rs1815739', position: 23423, allele: 'T', trait: 'Muscle Fiber Type' },
    { id: 'rs713598', position: 45234, allele: 'C', trait: 'Bitter Taste Sensitivity' },
    { id: 'rs4680', position: 67845, allele: 'A', trait: 'Stress Response' },
    { id: 'rs1805007', position: 89456, allele: 'T', trait: 'Hair Color' },
    { id: 'rs12913832', position: 123567, allele: 'G', trait: 'Eye Color' },
    { id: 'rs6152', position: 156789, allele: 'C', trait: 'Androgen Sensitivity' },
    { id: 'rs4994', position: 178901, allele: 'A', trait: 'Addiction Risk' },
    { id: 'rs53576', position: 201234, allele: 'G', trait: 'Social Behavior' },
    { id: 'rs1426654', position: 223456, allele: 'A', trait: 'Skin Pigmentation' },
    { id: 'rs885479', position: 245678, allele: 'T', trait: 'Hair Thickness' },
  ];

  // Mock basic traits
  const BASIC_TRAITS = [
    {
      name: 'Muscle Fiber Composition',
      prediction: 'Fast-twitch dominant',
      description: 'You likely excel at explosive, short-duration activities.',
      confidence: 'High'
    },
    {
      name: 'Bitter Taste Sensitivity',
      prediction: 'High sensitivity',
      description: 'You probably dislike bitter foods like coffee or dark chocolate.',
      confidence: 'Medium'
    },
    {
      name: 'Stress Response',
      prediction: 'Enhanced under pressure',
      description: 'You tend to perform better when stress levels are moderate.',
      confidence: 'High'
    },
    {
      name: 'Morning Alertness',
      prediction: 'Night owl tendency',
      description: 'You likely feel more alert and productive in the evening.',
      confidence: 'Medium'
    },
    {
      name: 'Hair Texture',
      prediction: 'Straight hair likely',
      description: 'Your genetic variants suggest naturally straight hair.',
      confidence: 'High'
    },
    {
      name: 'Earwax Type',
      prediction: 'Wet type',
      description: 'You most likely have wet, sticky earwax.',
      confidence: 'High'
    }
  ];

  // Mock detailed traits
  const DETAILED_TRAITS = [
    {
      name: 'Athletic Performance Potential',
      prediction: 'Optimized for power sports',
      description: 'Your genetic profile suggests natural advantages in activities requiring explosive power and strength.',
      confidence: 'High',
      scientificBasis: 'Based on ACTN3 gene variants that affect fast-twitch muscle fiber distribution and mitochondrial efficiency.',
      recommendation: 'Consider incorporating high-intensity interval training and power-based exercises into your fitness routine.'
    },
    {
      name: 'Caffeine Metabolism',
      prediction: 'Slow metabolizer',
      description: 'You likely feel caffeine effects for longer periods and may be more sensitive to its stimulating effects.',
      confidence: 'Medium',
      scientificBasis: 'CYP1A2 gene variants affect how quickly your liver processes caffeine.',
      recommendation: 'Limit caffeine intake in the afternoon to avoid sleep disruption. Consider smaller, more frequent doses.'
    },
    {
      name: 'Stress Resilience',
      prediction: 'High resilience under acute stress',
      description: 'You tend to maintain cognitive performance better than average during stressful situations.',
      confidence: 'High',
      scientificBasis: 'COMT gene variants affect dopamine breakdown in the prefrontal cortex during stress.',
      recommendation: 'Leverage your stress resilience in challenging situations, but ensure adequate recovery time.'
    },
    {
      name: 'Skin Sun Sensitivity',
      prediction: 'Moderate sensitivity',
      description: 'You have intermediate risk for sun damage and should use appropriate sun protection.',
      confidence: 'Medium',
      scientificBasis: 'MC1R and related gene variants influence melanin production and UV protection capacity.',
      recommendation: 'Use SPF 30+ sunscreen daily and limit direct sun exposure during peak hours (10am-4pm).'
    },
    {
      name: 'Omega-3 Fatty Acid Needs',
      prediction: 'Higher requirements',
      description: 'Your genetic variants suggest you may benefit from increased omega-3 fatty acid intake.',
      confidence: 'Medium',
      scientificBasis: 'FADS gene variants affect how efficiently you convert plant-based omega-3s to EPA and DHA.',
      recommendation: 'Include fatty fish 2-3 times per week or consider a high-quality omega-3 supplement.'
    },
    {
      name: 'Carbohydrate Sensitivity',
      prediction: 'Lower tolerance',
      description: 'You may be more prone to blood sugar spikes and benefit from complex carbohydrates.',
      confidence: 'Medium',
      scientificBasis: 'TCF7L2 and other diabetes-related gene variants affect insulin sensitivity and glucose metabolism.',
      recommendation: 'Focus on low-glycemic index foods and pair carbohydrates with protein or healthy fats.'
    }
  ];

  // Mock pattern matches
  const PATTERN_MATCHES = [
    {
      pattern: 'GATTACA',
      positions: [1024, 5678, 9012],
      significance: 'Common in DNA repair genes'
    },
    {
      pattern: 'TTAGGG',
      positions: [3456, 7890],
      significance: 'Telomere repeat sequence'
    }
  ];

  // Mock SNP detection
  const findSNPs = () => {
    const foundSNPs = [];
    
    SNP_DATABASE.forEach(snp => {
      // Simulate finding SNPs based on sequence length and content
      if (sequence.length > snp.position && Math.random() > 0.3) {
        foundSNPs.push({
          ...snp,
          position: Math.floor(Math.random() * sequence.length),
          confidence: Math.random() > 0.5 ? 'High' : 'Medium'
        });
      }
    });
    
    return foundSNPs;
  };

  // Shuffle and select random subsets for variety
  const shuffledBasic = [...BASIC_TRAITS].sort(() => Math.random() - 0.5);
  const shuffledDetailed = [...DETAILED_TRAITS].sort(() => Math.random() - 0.5);
  
  return {
    sequenceId: 'mock-seq-' + Math.random().toString(36).substring(2, 10),
    sequenceLength: sequence.length,
    snps: findSNPs(),
    basicResults: shuffledBasic.slice(0, 6),
    detailedResults: shuffledDetailed,
    patternMatches: PATTERN_MATCHES,
    processingTime: Math.floor(Math.random() * 3000) + 1000 // 1-4 seconds
  };
}

export default {
  uploadSequence,
  performVariantCalling,
  getTraitPredictions,
  performPatternMatching,
  analyzeDNA,
  mockAnalyzeDNA,
  extractSequence,
  validateSequence
};

