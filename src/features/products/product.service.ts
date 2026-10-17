import { Product, Category, ServiceArea, MarketplaceFilters } from './product.types';
import { marketplaceService } from '../../services/marketplaceService';

export const productService = {
  async getProducts(filters?: MarketplaceFilters): Promise<Product[]> {
    return marketplaceService.getProducts(filters);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    return marketplaceService.getProductBySlug(slug);
  },

  async getCategories(): Promise<Category[]> {
    return marketplaceService.getCategories();
  },

  async getServiceAreas(): Promise<ServiceArea[]> {
    return marketplaceService.getServiceAreas();
  },

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    return marketplaceService.getFarmerProducts(farmerId);
  },
};
