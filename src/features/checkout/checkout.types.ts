import { Address, Product } from '../../types';

export interface CheckoutPayload {
  customerId: string;
  address: Address;
  deliveryType: 'local_delivery' | 'pickup';
  paymentMethod: 'razorpay_online' | 'cod';
  deliveryNotes?: string;
  items: { product: Product; quantity: number }[];
}
