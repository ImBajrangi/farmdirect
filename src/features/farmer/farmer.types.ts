import { FarmerProfile, Product, Order, UnitOfSale, Category, OrderStatus } from '../../types';

export type { FarmerProfile, Product, Order, UnitOfSale, Category, OrderStatus };

export interface FarmerDashboardStats {
  pendingCount: number;
  inPrepCount: number;
  completedCount: number;
  totalRevenuePaise: number;
}

export interface AddProductInput {
  farmerId: string;
  categoryId: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi?: string;
  pricePaise: number;
  unit: UnitOfSale;
  unitStep: number;
  minOrderQuantity: number;
  availableQuantity: number;
  shelfLifeDays?: number;
  imageUrl: string;
  isCertifiedOrganic: boolean;
}
