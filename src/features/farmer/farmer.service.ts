import { marketplaceService } from '../../services/marketplaceService';
import { FarmerProfile, Product, Order, OrderStatus, Category } from '../../types';
import { AddProductInput } from './farmer.types';

// Fast in-memory cache system for instant response on all phone tiers
const memoryCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes fresh cache

function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data as T;
  }
  // Try sessionStorage as second-layer cache
  try {
    const raw = sessionStorage.getItem(`fd_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.expiry > Date.now()) {
        memoryCache.set(key, parsed);
        return parsed.data as T;
      }
    }
  } catch {
    // sessionStorage unavailable or restricted, fallback safely
  }
  return null;
}

function setCached(key: string, data: any): void {
  const record = { data, expiry: Date.now() + CACHE_TTL_MS };
  memoryCache.set(key, record);
  try {
    sessionStorage.setItem(`fd_cache_${key}`, JSON.stringify(record));
  } catch {
    // Ignore storage quota or access issues
  }
}

function invalidateCache(prefix: string): void {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(`fd_cache_${prefix}`)) {
        sessionStorage.removeItem(k);
      }
    }
  } catch {
    // Ignore
  }
}

export const farmerService = {
  async getFarmerProfile(farmerId: string): Promise<FarmerProfile | null> {
    const cacheKey = `farmer_profile_${farmerId}`;
    const cached = getCached<FarmerProfile>(cacheKey);
    if (cached) return cached;

    const data = await marketplaceService.getFarmerById(farmerId);
    if (data) {
      setCached(cacheKey, data);
    }
    return data;
  },

  async getFarmerOrders(farmerId: string): Promise<Order[]> {
    return marketplaceService.getOrders(farmerId, 'farmer');
  },

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    const cacheKey = `farmer_products_${farmerId}`;
    const cached = getCached<Product[]>(cacheKey);
    if (cached) return cached;

    const prods = await marketplaceService.getFarmerProducts(farmerId);
    if (prods) {
      setCached(cacheKey, prods);
    }
    return prods;
  },

  async getCategories(): Promise<Category[]> {
    const cacheKey = 'app_categories';
    const cached = getCached<Category[]>(cacheKey);
    if (cached) return cached;

    const cats = await marketplaceService.getCategories();
    if (cats) {
      setCached(cacheKey, cats);
    }
    return cats;
  },

  async createProduct(input: AddProductInput): Promise<Product> {
    const created = await marketplaceService.createProduct(input);
    invalidateCache(`farmer_products_${created.farmer_id}`);
    return created;
  },

  async updateStock(productId: string, newAvailableQty: number): Promise<void> {
    await marketplaceService.updateInventory(productId, newAvailableQty);
    invalidateCache('farmer_products_');
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    return marketplaceService.updateOrderStatus(orderId, status, reason);
  },

  async registerFarmer(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const registered = await marketplaceService.registerFarmer(profile);
    invalidateCache('farmer_profile_');
    return registered;
  },
};

