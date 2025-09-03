import React, { useState } from 'react';
import { User, Mail, CreditCard, History, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from './ErrorMessage';

/**
 * User Profile Component
 * 
 * Displays user information and payment history.
 */
const UserProfile = ({ onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState(null);
  
  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        <div className="text-center py-4">
          <User className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">Not Logged In</h3>
          <p className="text-white/60 text-sm mb-4">
            Connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }
  
  const handleUpdateEmail = () => {
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      // Update email in auth context
      updateEmail(email);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update email');
    }
  };
  
  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-cyan-400" />
          Your Profile
        </h2>
        <button
          onClick={handleLogout}
          className="text-white/60 hover:text-white/90 transition-colors flex items-center text-sm"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </button>
      </div>
      
      {error && (
        <ErrorMessage 
          error={error} 
          onDismiss={() => setError(null)} 
          className="mb-4"
        />
      )}
      
      <div className="space-y-4">
        {/* Wallet Address */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-sm font-medium text-white/70 mb-1">Wallet Address</h3>
          <p className="text-white font-mono text-sm truncate">
            {user.walletAddress || 'Not connected'}
          </p>
        </div>
        
        {/* Email */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-sm font-medium text-white/70 mb-2">Email Address</h3>
          <div className="flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow bg-white/10 border border-white/20 rounded-l-lg p-2 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleUpdateEmail}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-r-lg text-sm transition-colors"
            >
              Save
            </button>
          </div>
          <p className="text-white/50 text-xs mt-2">
            <Mail className="w-3 h-3 inline mr-1" />
            We'll only email you about your analyses
          </p>
        </div>
        
        {/* Payment History */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <button
            onClick={() => setShowPaymentHistory(!showPaymentHistory)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-sm font-medium text-white/70 flex items-center">
              <CreditCard className="w-4 h-4 mr-1 text-purple-400" />
              Payment History
            </h3>
            {showPaymentHistory ? (
              <ChevronUp className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/60" />
            )}
          </button>
          
          {showPaymentHistory && (
            <div className="mt-3 space-y-2">
              {user.paymentHistory && user.paymentHistory.length > 0 ? (
                user.paymentHistory.map((payment, index) => (
                  <div key={index} className="border-t border-white/10 pt-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">{payment.description}</span>
                      <span className="text-white font-medium">${payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>{formatDate(payment.timestamp)}</span>
                      <span className="capitalize">{payment.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3">
                  <History className="w-8 h-8 text-white/30 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">No payment history yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

