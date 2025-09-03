/**
 * Storage Service
 * 
 * Handles data persistence for the GeneGroove application.
 * Uses localStorage for client-side storage.
 */

import User from '../models/User';
import DNAAnalysis from '../models/DNAAnalysis';

// Storage keys
const STORAGE_KEYS = {
  USER: 'genegroove_user',
  ANALYSES: 'genegroove_analyses',
  CURRENT_ANALYSIS: 'genegroove_current_analysis'
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {any} - Loaded data
 */
function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error);
    return null;
  }
}

/**
 * Save user data
 * @param {User} user - User to save
 */
export function saveUser(user) {
  if (!(user instanceof User)) {
    throw new Error('Invalid user object');
  }
  
  saveToStorage(STORAGE_KEYS.USER, user.serialize());
}

/**
 * Load user data
 * @returns {User|null} - Loaded user
 */
export function loadUser() {
  const userData = loadFromStorage(STORAGE_KEYS.USER);
  return userData ? User.fromJSON(userData) : null;
}

/**
 * Save analysis data
 * @param {DNAAnalysis} analysis - Analysis to save
 */
export function saveAnalysis(analysis) {
  if (!(analysis instanceof DNAAnalysis)) {
    throw new Error('Invalid analysis object');
  }
  
  // Save as current analysis
  saveToStorage(STORAGE_KEYS.CURRENT_ANALYSIS, analysis.serialize());
  
  // Add to analyses list
  const analyses = loadAnalyses();
  const existingIndex = analyses.findIndex(a => a.analysisId === analysis.analysisId);
  
  if (existingIndex >= 0) {
    analyses[existingIndex] = analysis.serialize();
  } else {
    analyses.unshift(analysis.serialize());
  }
  
  saveToStorage(STORAGE_KEYS.ANALYSES, analyses);
}

/**
 * Load current analysis
 * @returns {DNAAnalysis|null} - Current analysis
 */
export function loadCurrentAnalysis() {
  const analysisData = loadFromStorage(STORAGE_KEYS.CURRENT_ANALYSIS);
  return analysisData ? DNAAnalysis.fromJSON(analysisData) : null;
}

/**
 * Load all analyses
 * @returns {Array} - All analyses
 */
export function loadAnalyses() {
  return loadFromStorage(STORAGE_KEYS.ANALYSES) || [];
}

/**
 * Load analysis by ID
 * @param {string} analysisId - Analysis ID
 * @returns {DNAAnalysis|null} - Loaded analysis
 */
export function loadAnalysisById(analysisId) {
  const analyses = loadAnalyses();
  const analysisData = analyses.find(a => a.analysisId === analysisId);
  return analysisData ? DNAAnalysis.fromJSON(analysisData) : null;
}

/**
 * Delete analysis by ID
 * @param {string} analysisId - Analysis ID
 * @returns {boolean} - Whether the analysis was deleted
 */
export function deleteAnalysis(analysisId) {
  const analyses = loadAnalyses();
  const newAnalyses = analyses.filter(a => a.analysisId !== analysisId);
  
  if (newAnalyses.length !== analyses.length) {
    saveToStorage(STORAGE_KEYS.ANALYSES, newAnalyses);
    
    // If current analysis is deleted, clear it
    const currentAnalysis = loadCurrentAnalysis();
    if (currentAnalysis && currentAnalysis.analysisId === analysisId) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ANALYSIS);
    }
    
    return true;
  }
  
  return false;
}

/**
 * Clear all storage
 */
export function clearStorage() {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.ANALYSES);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_ANALYSIS);
}

export default {
  saveUser,
  loadUser,
  saveAnalysis,
  loadCurrentAnalysis,
  loadAnalyses,
  loadAnalysisById,
  deleteAnalysis,
  clearStorage
};

