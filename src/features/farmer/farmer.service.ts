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

  async createDemoOrder(farmerId: string): Promise<Order> {
    const raw = localStorage.getItem('farmdirect_orders_v1');
    const allOrders: Order[] = raw ? JSON.parse(raw) : [];
    const products = await this.getFarmerProducts(farmerId);
    const prod = products[0] || {
      id: 'prod-1',
      name: 'Nashik Garva Red Onions',
      price_paise: 2800,
      unit: 'kg'
    };

    const orderNumber = `FD-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const qty = 25;
    const itemTotal = (prod.price_paise || 2800) * qty;

    const demoOrder: Order = {
      id: `ord-demo-${Date.now()}`,
      order_number: orderNumber,
      checkout_group_id: `chk-demo-${Date.now()}`,
      customer_id: 'cust-demo-1',
      farmer_id: farmerId,
      status: 'pending_confirmation',
      payment_status: 'captured',
      payment_method: 'razorpay_online',
      delivery_type: 'local_delivery',
      subtotal_paise: itemTotal,
      delivery_fee_paise: 5000,
      platform_fee_paise: 0,
      total_amount_paise: itemTotal + 5000,
      delivery_address_snapshot: {
        id: 'addr-demo-1',
        user_id: 'cust-demo-1',
        label: 'Home',
        recipient_name: 'Aditi Sharma',
        phone: '+91 98220 18452',
        address_line_1: 'Flat 402, Green Valley Apartments, Gangapur Road',
        city: 'Nashik',
        district: 'Nashik',
        state: 'Maharashtra',
        pincode: '422013',
        is_default: true,
        created_at: new Date().toISOString()
      },
      delivery_notes: 'Morning harvest requested. Please crate with dry-skin sorting.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: {
        id: 'cust-demo-1',
        full_name: 'Aditi Sharma',
        phone: '+91 98220 18452',
        role: 'customer',
        preferred_language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      items: [
        {
          id: `item-demo-${Date.now()}`,
          order_id: `ord-demo-${Date.now()}`,
          product_id: prod.id,
          product_name: prod.name,
          unit: prod.unit,
          unit_price_paise: prod.price_paise,
          quantity: qty,
          total_price_paise: itemTotal,
          created_at: new Date().toISOString()
        }
      ]
    };

    allOrders.unshift(demoOrder);
    localStorage.setItem('farmdirect_orders_v1', JSON.stringify(allOrders));
    return demoOrder;
  },

  async clearDemoOrders(farmerId: string): Promise<void> {
    const raw = localStorage.getItem('farmdirect_orders_v1');
    if (!raw) return;
    const allOrders: Order[] = JSON.parse(raw);
    const filtered = allOrders.filter(o => o.farmer_id !== farmerId || !o.id.startsWith('ord-demo-'));
    localStorage.setItem('farmdirect_orders_v1', JSON.stringify(filtered));
  },
};

