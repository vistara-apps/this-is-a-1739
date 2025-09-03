/**
 * Custom hook for DNA analysis functionality
 * 
 * This hook provides methods and state for DNA sequence analysis,
 * handling the loading states, errors, and results.
 */

import { useState, useCallback } from 'react';
import genoBankService from '../services/genoBankService';

export function useDnaAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [sequenceInfo, setSequenceInfo] = useState(null);

  /**
   * Analyze a DNA sequence
   * @param {string} fastaContent - FASTA format content
   * @param {boolean} detailed - Whether to get detailed trait predictions
   * @param {boolean} useMock - Whether to use mock data (for development)
   * @returns {Promise<Object>} - Analysis results
   */
  const analyzeDNA = useCallback(async (fastaContent, detailed = false, useMock = false) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Extract basic sequence info for display
      const sequence = genoBankService.extractSequence(fastaContent);
      const isValid = genoBankService.validateSequence(sequence);
      
      if (!isValid) {
        throw new Error('Invalid DNA sequence. Sequence must contain only A, T, C, G, or N bases.');
      }
      
      setSequenceInfo({
        length: sequence.length,
        gcContent: calculateGCContent(sequence),
        header: fastaContent.split('\\n')[0].replace('>', '')
      });
      
      // Use mock or real service based on parameter
      const analysisResults = useMock 
        ? genoBankService.mockAnalyzeDNA(fastaContent)
        : await genoBankService.analyzeDNA(fastaContent, detailed);
      
      setResults(analysisResults);
      return analysisResults;
    } catch (error) {
      setError(error.message || 'Failed to analyze DNA sequence');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Get detailed trait predictions for an existing analysis
   * @param {string} sequenceId - ID of the analyzed sequence
   * @param {string} variantCallId - ID of the variant calling result
   * @returns {Promise<Object>} - Detailed trait predictions
   */
  const getDetailedTraits = useCallback(async (sequenceId, variantCallId) => {
    if (!sequenceId || !variantCallId) {
      throw new Error('Missing sequence or variant call information');
    }
    
    try {
      const detailedResults = await genoBankService.getTraitPredictions(variantCallId, true);
      
      // Update the existing results with detailed traits
      setResults(prevResults => ({
        ...prevResults,
        detailedResults: detailedResults.detailedTraits
      }));
      
      return detailedResults;
    } catch (error) {
      setError(error.message || 'Failed to get detailed trait predictions');
      throw error;
    }
  }, []);

  /**
   * Reset the analysis state
   */
  const resetAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setError(null);
    setResults(null);
    setSequenceInfo(null);
  }, []);

  /**
   * Calculate GC content of a DNA sequence
   * @param {string} sequence - DNA sequence
   * @returns {number} - GC content percentage
   */
  function calculateGCContent(sequence) {
    if (!sequence) return 0;
    
    const gcCount = (sequence.match(/[GC]/g) || []).length;
    return Math.round((gcCount / sequence.length) * 100);
  }

  return {
    isAnalyzing,
    error,
    results,
    sequenceInfo,
    analyzeDNA,
    getDetailedTraits,
    resetAnalysis
  };
}

export default useDnaAnalysis;

