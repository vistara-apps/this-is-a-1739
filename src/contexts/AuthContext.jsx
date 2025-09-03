import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import User from '../models/User';
import { loadUser, saveUser } from '../services/storageService';
import { createError, ErrorTypes } from '../utils/errorHandling';

// Create context
export const AuthContext = createContext();

/**
 * Authentication Provider Component
 * 
 * Provides authentication state and methods to the application.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { data: walletClient, isError, isLoading: isWalletLoading } = useWalletClient();
  
  // Initialize user from storage
  useEffect(() => {
    const storedUser = loadUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);
  
  // Update user when wallet changes
  useEffect(() => {
    if (walletClient && walletClient.account && !isError && !isWalletLoading) {
      handleWalletConnection(walletClient.account.address);
    }
  }, [walletClient, isError, isWalletLoading]);
  
  /**
   * Handle wallet connection
   * @param {string} address - Wallet address
   */
  const handleWalletConnection = useCallback((address) => {
    if (!address) return;
    
    try {
      // If user exists, update wallet address
      if (user) {
        const updatedUser = new User({
          ...user.serialize(),
          walletAddress: address
        });
        setUser(updatedUser);
        saveUser(updatedUser);
      } else {
        // Create new user with wallet address
        const newUser = new User({
          userId: `user_${Math.random().toString(36).substring(2, 10)}`,
          walletAddress: address
        });
        setUser(newUser);
        saveUser(newUser);
      }
      
      setError(null);
    } catch (err) {
      setError(createError(
        'Failed to connect wallet',
        ErrorTypes.AUTHENTICATION,
        { originalError: err.message }
      ));
    }
  }, [user]);
  
  /**
   * Update user email
   * @param {string} email - User email
   */
  const updateEmail = useCallback((email) => {
    if (!user) return;
    
    try {
      const updatedUser = new User({
        ...user.serialize(),
        email
      });
      setUser(updatedUser);
      saveUser(updatedUser);
      setError(null);
    } catch (err) {
      setError(createError(
        'Failed to update email',
        ErrorTypes.AUTHENTICATION,
        { originalError: err.message }
      ));
    }
  }, [user]);
  
  /**
   * Add payment to user history
   * @param {Object} payment - Payment data
   */
  const addPayment = useCallback((payment) => {
    if (!user) return;
    
    try {
      const updatedUser = user.addPayment(payment);
      setUser(updatedUser);
      saveUser(updatedUser);
      setError(null);
    } catch (err) {
      setError(createError(
        'Failed to add payment',
        ErrorTypes.AUTHENTICATION,
        { originalError: err.message }
      ));
    }
  }, [user]);
  
  /**
   * Check if user has paid for detailed analysis
   * @returns {boolean} - Whether user has paid for detailed analysis
   */
  const hasDetailedAccess = useCallback(() => {
    return user ? user.hasDetailedAnalysisAccess() : false;
  }, [user]);
  
  /**
   * Log out user
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('genegroove_user');
    setError(null);
  }, []);
  
  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    updateEmail,
    addPayment,
    hasDetailedAccess,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

