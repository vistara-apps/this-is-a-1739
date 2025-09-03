import { useWalletClient } from "wagmi";
import { useCallback, useState } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Check if wallet is connected
  useState(() => {
    if (walletClient && walletClient.account && !isError && !isLoading) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [walletClient, isError, isLoading]);

  /**
   * Create a payment session
   * @param {number} amount - Payment amount in USD
   * @param {string} description - Payment description
   * @returns {Promise<Object>} - Payment session details
   */
  const createSession = useCallback(async (amount = 2.00, description = "Detailed DNA Analysis") => {
    if (!walletClient || !walletClient.account) throw new Error("Please connect your wallet");
    if (isError) throw new Error("Wallet not connected");
    if (isLoading) throw new Error("Wallet is loading");
    
    try {
      const baseClient = axios.create({
          baseURL: "https://payments.vistara.dev",
          headers: {
              "Content-Type": "application/json",
          },
      });
      
      const apiClient = withPaymentInterceptor(baseClient, walletClient);
      const response = await apiClient.post("/api/payment", { 
        amount: `$${amount.toFixed(2)}`,
        description: description
      });
      
      const paymentResponse = response.config.headers["X-PAYMENT"];
      
      if (!paymentResponse) throw new Error("Payment response is absent");
      
      const decoded = decodeXPaymentResponse(paymentResponse);
      console.log(`Payment successful: ${JSON.stringify(decoded)}`);
      
      // Add to payment history
      const paymentRecord = {
        id: decoded.id || `payment_${Math.random().toString(36).substring(2, 10)}`,
        amount: amount,
        description: description,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setPaymentHistory(prev => [paymentRecord, ...prev]);
      
      return decoded;
    } catch (error) {
      console.error("Payment error:", error);
      throw new Error(error.message || "Payment failed. Please try again.");
    }
  }, [walletClient, isError, isLoading]);

  /**
   * Get payment history
   * @returns {Array} - Payment history
   */
  const getPaymentHistory = useCallback(() => {
    return paymentHistory;
  }, [paymentHistory]);

  return { 
    createSession,
    getPaymentHistory,
    isConnected
  };
}
