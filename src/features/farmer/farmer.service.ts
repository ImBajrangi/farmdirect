import { marketplaceService } from '../../services/marketplaceService';
import { FarmerProfile, Product, Order, OrderStatus, Category } from '../../types';
import { AddProductInput } from './farmer.types';

export const farmerService = {
  async getFarmerProfile(farmerId: string): Promise<FarmerProfile | null> {
    return marketplaceService.getFarmerById(farmerId);
  },

  async getFarmerOrders(farmerId: string): Promise<Order[]> {
    return marketplaceService.getOrders(farmerId, 'farmer');
  },

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    return marketplaceService.getFarmerProducts(farmerId);
  },

  async getCategories(): Promise<Category[]> {
    return marketplaceService.getCategories();
  },

  async createProduct(input: AddProductInput): Promise<Product> {
    return marketplaceService.createProduct(input);
  },

  async updateStock(productId: string, newAvailableQty: number): Promise<void> {
    return marketplaceService.updateInventory(productId, newAvailableQty);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    return marketplaceService.updateOrderStatus(orderId, status, reason);
  },

  async registerFarmer(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    return marketplaceService.registerFarmer(profile);
  },
};
