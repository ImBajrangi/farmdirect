import { FarmerProfile, Order, Product, ServiceArea, FarmerVerificationStatus } from '../../types';

export type { FarmerProfile, Order, Product, ServiceArea, FarmerVerificationStatus };

export interface AdminStats {
  totalGMVPaise: number;
  totalOrders: number;
  activeProducers: number;
  activeProducts: number;
}
