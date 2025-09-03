/**
 * DNAAnalysis Model
 * 
 * Represents a DNA analysis in the GeneGroove application.
 * Stores analysis data, results, and payment status.
 */

class DNAAnalysis {
  /**
   * Create a new DNAAnalysis instance
   * @param {Object} analysisData - Analysis data
   * @param {string} analysisData.analysisId - Unique analysis ID
   * @param {string} analysisData.userId - User ID
   * @param {string} analysisData.timestamp - Analysis timestamp
   * @param {string} analysisData.uploadedSequence - Uploaded DNA sequence
   * @param {Array} analysisData.identifiedSNPs - Identified SNPs
   * @param {Array} analysisData.predictedTraits - Predicted traits
   * @param {string} analysisData.paymentStatus - Payment status
   */
  constructor(analysisData = {}) {
    this.analysisId = analysisData.analysisId || `analysis_${Math.random().toString(36).substring(2, 10)}`;
    this.userId = analysisData.userId || null;
    this.timestamp = analysisData.timestamp || new Date().toISOString();
    this.uploadedSequence = analysisData.uploadedSequence || null;
    this.sequenceLength = analysisData.sequenceLength || 0;
    this.sequenceName = analysisData.sequenceName || 'Unnamed Sequence';
    this.gcContent = analysisData.gcContent || 0;
    this.identifiedSNPs = analysisData.identifiedSNPs || [];
    this.predictedTraits = {
      basic: analysisData.predictedTraits?.basic || [],
      detailed: analysisData.predictedTraits?.detailed || []
    };
    this.patternMatches = analysisData.patternMatches || [];
    this.paymentStatus = analysisData.paymentStatus || 'free'; // free, paid_basic, paid_detailed
    this.processingTime = analysisData.processingTime || 0;
    this.apiProvider = analysisData.apiProvider || 'genobank';
  }

  /**
   * Add SNPs to the analysis
   * @param {Array} snps - SNPs to add
   * @returns {DNAAnalysis} - Updated analysis
   */
  addSNPs(snps) {
    this.identifiedSNPs = [...this.identifiedSNPs, ...snps];
    return this;
  }

  /**
   * Add basic traits to the analysis
   * @param {Array} traits - Traits to add
   * @returns {DNAAnalysis} - Updated analysis
   */
  addBasicTraits(traits) {
    this.predictedTraits.basic = [...this.predictedTraits.basic, ...traits];
    return this;
  }

  /**
   * Add detailed traits to the analysis
   * @param {Array} traits - Traits to add
   * @returns {DNAAnalysis} - Updated analysis
   */
  addDetailedTraits(traits) {
    this.predictedTraits.detailed = [...this.predictedTraits.detailed, ...traits];
    this.paymentStatus = 'paid_detailed';
    return this;
  }

  /**
   * Add pattern matches to the analysis
   * @param {Array} matches - Pattern matches to add
   * @returns {DNAAnalysis} - Updated analysis
   */
  addPatternMatches(matches) {
    this.patternMatches = [...this.patternMatches, ...matches];
    return this;
  }

  /**
   * Update the payment status
   * @param {string} status - New payment status
   * @returns {DNAAnalysis} - Updated analysis
   */
  updatePaymentStatus(status) {
    this.paymentStatus = status;
    return this;
  }

  /**
   * Check if the analysis has detailed results
   * @returns {boolean} - Whether the analysis has detailed results
   */
  hasDetailedResults() {
    return this.paymentStatus === 'paid_detailed' && this.predictedTraits.detailed.length > 0;
  }

  /**
   * Get the analysis results
   * @param {boolean} includeDetailed - Whether to include detailed results
   * @returns {Object} - Analysis results
   */
  getResults(includeDetailed = false) {
    const results = {
      analysisId: this.analysisId,
      timestamp: this.timestamp,
      sequenceLength: this.sequenceLength,
      sequenceName: this.sequenceName,
      gcContent: this.gcContent,
      snps: this.identifiedSNPs,
      basicResults: this.predictedTraits.basic,
      patternMatches: this.patternMatches,
      processingTime: this.processingTime
    };

    if (includeDetailed && this.hasDetailedResults()) {
      results.detailedResults = this.predictedTraits.detailed;
    }

    return results;
  }

  /**
   * Serialize the analysis object for storage
   * @returns {Object} - Serialized analysis
   */
  serialize() {
    return {
      analysisId: this.analysisId,
      userId: this.userId,
      timestamp: this.timestamp,
      uploadedSequence: this.uploadedSequence,
      sequenceLength: this.sequenceLength,
      sequenceName: this.sequenceName,
      gcContent: this.gcContent,
      identifiedSNPs: this.identifiedSNPs,
      predictedTraits: this.predictedTraits,
      patternMatches: this.patternMatches,
      paymentStatus: this.paymentStatus,
      processingTime: this.processingTime,
      apiProvider: this.apiProvider
    };
  }

  /**
   * Create a DNAAnalysis instance from serialized data
   * @param {Object} data - Serialized analysis data
   * @returns {DNAAnalysis} - DNAAnalysis instance
   */
  static fromJSON(data) {
    return new DNAAnalysis(data);
  }

  /**
   * Create a DNAAnalysis instance from API response
   * @param {Object} apiResponse - API response data
   * @param {string} userId - User ID
   * @returns {DNAAnalysis} - DNAAnalysis instance
   */
  static fromAPIResponse(apiResponse, userId) {
    return new DNAAnalysis({
      userId: userId,
      sequenceLength: apiResponse.sequenceLength,
      sequenceName: apiResponse.sequenceName || 'Unnamed Sequence',
      gcContent: apiResponse.gcContent || 0,
      identifiedSNPs: apiResponse.snps || [],
      predictedTraits: {
        basic: apiResponse.basicResults || [],
        detailed: apiResponse.detailedResults || []
      },
      patternMatches: apiResponse.patternMatches || [],
      processingTime: apiResponse.processingTime || 0,
      apiProvider: 'genobank'
    });
  }
}

export default DNAAnalysis;

