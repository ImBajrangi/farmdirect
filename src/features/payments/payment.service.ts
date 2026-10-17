export const paymentService = {
  async createRazorpayOrder(amountPaise: number, receiptId: string) {
    // In production, calls backend/Supabase Edge Function: /functions/v1/create-razorpay-order
    return {
      orderId: `order_rp_${Date.now()}`,
      amount: amountPaise,
      currency: 'INR',
      receipt: receiptId,
    };
  },

  async verifyPaymentSignature(paymentId: string, orderId: string, signature: string) {
    // Trusted server-side verification simulation
    return {
      verified: true,
      paymentId,
      orderId,
    };
  },
};
