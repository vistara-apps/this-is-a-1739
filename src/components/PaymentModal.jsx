import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PaymentModal = ({ onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { createSession } = usePaymentContext();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      await createSession();
      
      // Simulate payment success
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Purchase Detailed Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What's Included:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Comprehensive trait analysis</li>
            <li>• Health predisposition insights</li>
            <li>• Ancestry markers</li>
            <li>• Personalized recommendations</li>
            <li>• Scientific explanations</li>
          </ul>
        </div>

        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-900">Detailed Report</span>
          <span className="text-2xl font-bold text-purple-600">$2.00</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay with Crypto Wallet
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure payment powered by Web3. Your genetic data is never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;