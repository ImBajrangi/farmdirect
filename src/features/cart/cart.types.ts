import { Product, FarmerProfile, CartGroup } from '../../types';

export interface CartItemData {
  product: Product;
  quantity: number;
}

export type { CartGroup };
