import { marketplaceService } from '../../services/marketplaceService';
import { Address, Product, Profile, Order } from '../../types';

export interface ProcessCheckoutParams {
  customerId: string;
  customerProfile: Profile;
  address: Address;
  deliveryType: 'local_delivery' | 'pickup';
  paymentMethod: 'razorpay_online' | 'cod';
  paymentId?: string;
  deliveryNotes?: string;
  items: { product: Product; quantity: number }[];
}

export interface CheckoutResult {
  checkoutGroupId: string;
  orders: Order[];
}

export const checkoutService = {
  async executeCheckout(params: ProcessCheckoutParams): Promise<CheckoutResult> {
    if (!params.address) {
      throw new Error('Delivery address is required for checkout');
    }
    if (!params.items || params.items.length === 0) {
      throw new Error('Your cart is empty');
    }

    return marketplaceService.processCheckout({
      customerId: params.customerId,
      customerProfile: params.customerProfile,
      address: params.address,
      deliveryType: params.deliveryType,
      paymentMethod: params.paymentMethod,
      paymentId: params.paymentId,
      deliveryNotes: params.deliveryNotes,
      items: params.items,
    });
  },

  calculateDeliveryFee(
    subtotalPaise: number,
    deliveryType: 'local_delivery' | 'pickup'
  ): number {
    if (deliveryType === 'pickup') return 0;
    // Free delivery threshold: ₹500 (50,000 paise)
    return subtotalPaise >= 50000 ? 0 : 4000;
  },
};
