import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logError } from '../utils/errorHandling';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console and potentially to an error tracking service
    logError(error, 'ErrorBoundary');
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback(error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div className="p-6 max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/80 mb-6">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

