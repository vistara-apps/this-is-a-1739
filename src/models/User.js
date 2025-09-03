/**
 * User Model
 * 
 * Represents a user in the GeneGroove application.
 * Handles user data, authentication, and payment history.
 */

class User {
  /**
   * Create a new User instance
   * @param {Object} userData - User data
   * @param {string} userData.userId - Unique user ID
   * @param {string} userData.email - User email
   * @param {Array} userData.paymentHistory - User payment history
   */
  constructor(userData = {}) {
    this.userId = userData.userId || null;
    this.email = userData.email || null;
    this.paymentHistory = userData.paymentHistory || [];
    this.createdAt = userData.createdAt || new Date().toISOString();
    this.updatedAt = userData.updatedAt || new Date().toISOString();
    this.walletAddress = userData.walletAddress || null;
  }

  /**
   * Add a payment to the user's payment history
   * @param {Object} payment - Payment data
   * @param {string} payment.id - Payment ID
   * @param {number} payment.amount - Payment amount
   * @param {string} payment.description - Payment description
   * @param {string} payment.status - Payment status
   * @returns {Object} - Updated user
   */
  addPayment(payment) {
    const newPayment = {
      id: payment.id,
      amount: payment.amount,
      description: payment.description,
      timestamp: payment.timestamp || new Date().toISOString(),
      status: payment.status || 'completed'
    };

    this.paymentHistory = [newPayment, ...this.paymentHistory];
    this.updatedAt = new Date().toISOString();
    
    return this;
  }

  /**
   * Get the user's payment history
   * @returns {Array} - Payment history
   */
  getPaymentHistory() {
    return this.paymentHistory;
  }

  /**
   * Check if the user has made a specific payment
   * @param {string} description - Payment description to check for
   * @returns {boolean} - Whether the user has made the payment
   */
  hasPaid(description) {
    return this.paymentHistory.some(
      payment => payment.description === description && payment.status === 'completed'
    );
  }

  /**
   * Check if the user has paid for detailed analysis
   * @returns {boolean} - Whether the user has paid for detailed analysis
   */
  hasDetailedAnalysisAccess() {
    return this.hasPaid('Detailed DNA Analysis Report');
  }

  /**
   * Serialize the user object for storage
   * @returns {Object} - Serialized user
   */
  serialize() {
    return {
      userId: this.userId,
      email: this.email,
      paymentHistory: this.paymentHistory,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      walletAddress: this.walletAddress
    };
  }

  /**
   * Create a User instance from serialized data
   * @param {Object} data - Serialized user data
   * @returns {User} - User instance
   */
  static fromJSON(data) {
    return new User(data);
  }
}

export default User;

