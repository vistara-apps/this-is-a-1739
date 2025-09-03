import React, { useState } from 'react';
import { X, User, Wallet, Mail } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from './ErrorMessage';

/**
 * Login Modal Component
 * 
 * Displays a modal for connecting wallet and entering email.
 */
const LoginModal = ({ onClose }) => {
  const { user, isAuthenticated, updateEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [step, setStep] = useState('connect'); // connect, email, success
  
  // Move to email step if wallet is connected
  if (step === 'connect' && isAuthenticated && user?.walletAddress) {
    setStep('email');
  }
  
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      updateEmail(email);
      setStep('success');
      setError(null);
      
      // Auto-close after success
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update email');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 'connect' ? 'Connect Your Wallet' : 
             step === 'email' ? 'Add Your Email' : 
             'Login Successful'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <ErrorMessage 
            error={error} 
            onDismiss={() => setError(null)} 
            className="mb-4"
            variant="error"
          />
        )}
        
        {step === 'connect' && (
          <div className="text-center py-6">
            <Wallet className="w-16 h-16 text-purple-500 mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-6">
              Connect your wallet to access your DNA analysis history and results.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        )}
        
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="py-4">
            <Mail className="w-12 h-12 text-cyan-500 mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Add Your Email</h3>
            <p className="text-gray-600 mb-4 text-center">
              Add your email to receive your analysis results and updates.
            </p>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll never share your email with third parties.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
            >
              Continue
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              You can skip this step, but you won't receive your analysis results by email.
            </p>
          </form>
        )}
        
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Login Successful!</h3>
            <p className="text-gray-600 mb-2">
              You're now logged in and ready to explore your DNA.
            </p>
            <p className="text-sm text-green-600">
              Redirecting you automatically...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

