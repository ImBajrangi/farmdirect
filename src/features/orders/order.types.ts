import { Order, OrderStatus, OrderItem } from '../../types';

export type { Order, OrderStatus, OrderItem };

export interface StatusStep {
  key: OrderStatus;
  label: string;
  desc: string;
}

export const STATUS_STEPS: StatusStep[] = [
  { key: 'pending_confirmation', label: 'Order Placed', desc: 'Awaiting farmer schedule review' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Accepted by farmer' },
  { key: 'preparing', label: 'Fresh Packing', desc: 'Harvesting & sorting at farm shed' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Dispatched to your address' },
  { key: 'delivered', label: 'Delivered', desc: 'Fresh produce received' },
];
