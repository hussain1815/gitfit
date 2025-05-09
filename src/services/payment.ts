// Mock payment processor - in real app, integrate with Stripe/Checkout/etc.
export const processPayment = async (amount: number, currency: string, paymentMethod: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
          amount,
          currency
        });
      }, 1500);
    });
  };