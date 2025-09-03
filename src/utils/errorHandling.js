/**
 * Error Handling Utilities
 * 
 * Provides functions for handling errors in the GeneGroove application.
 */

/**
 * Standard error types
 */
export const ErrorTypes = {
  VALIDATION: 'validation_error',
  API: 'api_error',
  PAYMENT: 'payment_error',
  AUTHENTICATION: 'auth_error',
  STORAGE: 'storage_error',
  NETWORK: 'network_error',
  UNKNOWN: 'unknown_error'
};

/**
 * Create a standardized error object
 * @param {string} message - Error message
 * @param {string} type - Error type
 * @param {any} details - Additional error details
 * @returns {Object} - Standardized error object
 */
export function createError(message, type = ErrorTypes.UNKNOWN, details = null) {
  return {
    message,
    type,
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @returns {Object} - Standardized error object
 */
export function handleApiError(error) {
  // Extract error details from API response
  const apiError = error.response?.data?.error;
  const status = error.response?.status;
  
  // Create appropriate error message based on status code
  let message = apiError?.message || error.message || 'An unknown API error occurred';
  let type = ErrorTypes.API;
  
  if (status === 401 || status === 403) {
    message = 'Authentication error. Please log in again.';
    type = ErrorTypes.AUTHENTICATION;
  } else if (status === 400) {
    message = apiError?.message || 'Invalid request. Please check your input.';
    type = ErrorTypes.VALIDATION;
  } else if (status === 404) {
    message = 'Resource not found.';
  } else if (status === 429) {
    message = 'Too many requests. Please try again later.';
  } else if (status >= 500) {
    message = 'Server error. Please try again later.';
  }
  
  return createError(message, type, {
    status,
    apiError,
    originalMessage: error.message
  });
}

/**
 * Handle payment errors
 * @param {Error} error - Error object
 * @returns {Object} - Standardized error object
 */
export function handlePaymentError(error) {
  let message = error.message || 'Payment failed. Please try again.';
  
  // Check for specific payment error types
  if (message.includes('wallet') || message.includes('connect')) {
    message = 'Please connect your wallet to make a payment.';
  } else if (message.includes('insufficient')) {
    message = 'Insufficient funds in your wallet. Please add funds and try again.';
  } else if (message.includes('rejected')) {
    message = 'Payment was rejected. Please try again.';
  }
  
  return createError(message, ErrorTypes.PAYMENT, {
    originalMessage: error.message
  });
}

/**
 * Handle validation errors
 * @param {string} message - Error message
 * @param {Object} validationErrors - Validation errors by field
 * @returns {Object} - Standardized error object
 */
export function handleValidationError(message, validationErrors = {}) {
  return createError(
    message || 'Validation failed. Please check your input.',
    ErrorTypes.VALIDATION,
    validationErrors
  );
}

/**
 * Format error for display
 * @param {Object} error - Error object
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(error) {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  return error.message || 'An unknown error occurred';
}

/**
 * Log error to console
 * @param {Object} error - Error object
 * @param {string} context - Error context
 */
export function logError(error, context = '') {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}] Error:`, error);
  }
  
  // In a real app, you would send this to an error tracking service
  // like Sentry, LogRocket, etc.
}

export default {
  ErrorTypes,
  createError,
  handleApiError,
  handlePaymentError,
  handleValidationError,
  formatErrorMessage,
  logError
};

