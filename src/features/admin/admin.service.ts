import { marketplaceService } from '../../services/marketplaceService';
import { FarmerProfile, Order, Product, ServiceArea, FarmerVerificationStatus } from '../../types';

export const adminService = {
  async getDashboardData(): Promise<{
    farmers: FarmerProfile[];
    orders: Order[];
    products: Product[];
    serviceAreas: ServiceArea[];
  }> {
    const [farmers, orders, products, serviceAreas] = await Promise.all([
      marketplaceService.getFarmers(),
      marketplaceService.getOrders(undefined, 'admin'),
      marketplaceService.getProducts(),
      marketplaceService.getServiceAreas(),
    ]);

    return { farmers, orders, products, serviceAreas };
  },

  async updateFarmerVerification(
    farmerId: string,
    status: FarmerVerificationStatus
  ): Promise<void> {
    return marketplaceService.updateFarmerVerification(farmerId, status);
  },
};
