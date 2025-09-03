import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PaymentModal = ({ onClose, onSuccess, amount = 2.00, itemDescription = "Detailed DNA Analysis Report" }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState('details'); // details, processing, success
  const { createSession } = usePaymentContext();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');
      setPaymentStep('processing');
      
      // Create payment session with the specified amount
      await createSession(amount);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentStep('success');
        
        // Automatically close after success
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      setPaymentStep('details');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {paymentStep === 'success' ? 'Payment Successful' : 'Purchase Detailed Report'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStep === 'details' && (
          <>
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
              <span className="font-medium text-gray-900">{itemDescription}</span>
              <span className="text-2xl font-bold text-purple-600">${amount.toFixed(2)}</span>
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
              <CreditCard className="w-4 h-4 mr-2" />
              Pay with Crypto Wallet
            </button>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 mr-2" />
              <p className="text-blue-700 text-xs">
                This is a micro-transaction payment. You'll be charged ${amount.toFixed(2)} for this detailed report. 
                Basic DNA analysis costs $0.25 per scan.
              </p>
            </div>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Payment</h3>
            <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 h-1.5 rounded-full animate-pulse w-2/3"></div>
            </div>
            <p className="text-xs text-gray-500">
              Do not close this window. You will be redirected automatically.
            </p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your detailed DNA analysis report is now available.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{`tx_${Math.random().toString(36).substring(2, 10)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-sm text-green-600">
              Redirecting you to your detailed report...
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure payment powered by Web3. Your genetic data is never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
