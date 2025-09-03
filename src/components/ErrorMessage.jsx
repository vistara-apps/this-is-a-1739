import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { formatErrorMessage } from '../utils/errorHandling';

/**
 * Error Message Component
 * 
 * Displays an error message with optional dismiss button.
 */
const ErrorMessage = ({ 
  error, 
  onDismiss, 
  className = '',
  showDismiss = true,
  variant = 'error' // error, warning, info
}) => {
  if (!error) return null;
  
  const message = formatErrorMessage(error);
  
  // Determine styles based on variant
  let bgColor, borderColor, textColor, iconColor;
  let Icon = AlertCircle;
  
  switch (variant) {
    case 'warning':
      bgColor = 'bg-yellow-500/20';
      borderColor = 'border-yellow-500/50';
      textColor = 'text-yellow-200';
      iconColor = 'text-yellow-400';
      break;
    case 'info':
      bgColor = 'bg-blue-500/20';
      borderColor = 'border-blue-500/50';
      textColor = 'text-blue-200';
      iconColor = 'text-blue-400';
      break;
    case 'error':
    default:
      bgColor = 'bg-red-500/20';
      borderColor = 'border-red-500/50';
      textColor = 'text-red-200';
      iconColor = 'text-red-400';
      break;
  }
  
  return (
    <div className={`p-4 ${bgColor} ${borderColor} border rounded-lg flex items-start ${className}`}>
      <Icon className={`w-5 h-5 ${iconColor} mt-0.5 mr-3 flex-shrink-0`} />
      <p className={`${textColor} text-sm flex-grow`}>{message}</p>
      {showDismiss && onDismiss && (
        <button 
          onClick={onDismiss}
          className={`${iconColor} hover:text-white transition-colors ml-2`}
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

