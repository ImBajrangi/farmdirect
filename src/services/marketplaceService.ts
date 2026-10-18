import {
  Product,
  Category,
  FarmerProfile,
  ServiceArea,
  Order,
  Inventory,
  MarketplaceFilters,
  OrderStatus,
  FarmerVerificationStatus,
  Address
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SERVICE_AREAS,
  INITIAL_FARMERS,
  INITIAL_PRODUCTS,
  INITIAL_INVENTORIES,
  PRODUCT_IMAGE_MAP
} from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

const STORAGE_KEYS = {
  PRODUCTS: 'farmdirect_products_v1',
  CATEGORIES: 'farmdirect_categories_v1',
  FARMERS: 'farmdirect_farmers_v1',
  INVENTORY: 'farmdirect_inventory_v1',
  ORDERS: 'farmdirect_orders_v1',
  SERVICE_AREAS: 'farmdirect_service_areas_v1',
};

// High-Performance 2-Tier Caching System (Memory microcache + LocalStorage)
export type DataSourceOrigin = 'live_supabase' | 'local_cache' | 'fixture_fallback';

export interface BackendStatus {
  isConfigured: boolean;
  status: 'connected' | 'unconfigured' | 'empty_database' | 'permission_error' | 'network_error';
  lastSyncTimestamp: number | null;
  lastOrigin: DataSourceOrigin;
  lastErrorMessage?: string;
}

const currentBackendStatus: BackendStatus = {
  isConfigured: isSupabaseConfigured,
  status: isSupabaseConfigured ? 'connected' : 'unconfigured',
  lastSyncTimestamp: null,
  lastOrigin: isSupabaseConfigured ? 'live_supabase' : 'fixture_fallback',
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const MEMORY_CACHE_TTL = 120 * 1000; // 2 minutes

function withTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs = 4000): Promise<T> {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Network timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > MEMORY_CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }
  return item.data as T;
}

function setCached<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function invalidateMarketplaceCache(prefix?: string): void {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}

// Initialize LocalStorage with seed data if absent
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICE_AREAS)) {
    localStorage.setItem(STORAGE_KEYS.SERVICE_AREAS, JSON.stringify(INITIAL_SERVICE_AREAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FARMERS)) {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(INITIAL_FARMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const enrichedProducts = INITIAL_PRODUCTS.map(p => ({
      ...p,
      images: [
        {
          id: `img-${p.id}`,
          product_id: p.id,
          image_url: PRODUCT_IMAGE_MAP[p.id] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
          sort_order: 0,
          is_primary: true,
          created_at: new Date().toISOString()
        }
      ]
    }));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(enrichedProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

initializeStorage();

export const marketplaceService = {
  clearCache(): void {
    invalidateMarketplaceCache();
  },

  getBackendStatus(): BackendStatus {
    return { ...currentBackendStatus };
  },

  async getServiceAreas(): Promise<ServiceArea[]> {
    const cached = getCached<ServiceArea[]>('service_areas');
    if (cached) return cached;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(supabase.from('service_areas').select('*').eq('is_active', true));
        if (!error && data && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.SERVICE_AREAS, JSON.stringify(data));
          setCached('service_areas', data as ServiceArea[]);
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
          return data as ServiceArea[];
        } else if (error) {
          currentBackendStatus.status = error.code === '42501' ? 'permission_error' : 'network_error';
          currentBackendStatus.lastErrorMessage = error.message;
        }
      } catch (err) {
        console.warn('Supabase service_areas query fallback to local cache:', err);
        currentBackendStatus.status = 'network_error';
        currentBackendStatus.lastErrorMessage = err instanceof Error ? err.message : String(err);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_AREAS);
    const result = raw ? JSON.parse(raw) : INITIAL_SERVICE_AREAS;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SERVICE_AREAS, JSON.stringify(result));
    }
    setCached('service_areas', result);
    return result;
  },

  async getCategories(): Promise<Category[]> {
    const cached = getCached<Category[]>('categories');
    if (cached) return cached;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(supabase.from('categories').select('*').eq('is_active', true).order('sort_order'));
        if (!error && data && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data));
          setCached('categories', data as Category[]);
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
          return data as Category[];
        } else if (error) {
          currentBackendStatus.status = error.code === '42501' ? 'permission_error' : 'network_error';
          currentBackendStatus.lastErrorMessage = error.message;
        }
      } catch (err) {
        console.warn('Supabase categories query fallback to local cache:', err);
        currentBackendStatus.status = 'network_error';
        currentBackendStatus.lastErrorMessage = err instanceof Error ? err.message : String(err);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const result = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(result));
    }
    setCached('categories', result);
    return result;
  },

  async getFarmers(): Promise<FarmerProfile[]> {
    const cached = getCached<FarmerProfile[]>('farmers');
    if (cached) return cached;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(supabase.from('farmer_profiles').select('*'));
        if (!error && data && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(data));
          setCached('farmers', data as FarmerProfile[]);
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
          return data as FarmerProfile[];
        } else if (error) {
          currentBackendStatus.status = error.code === '42501' ? 'permission_error' : 'network_error';
          currentBackendStatus.lastErrorMessage = error.message;
        }
      } catch (err) {
        console.warn('Supabase farmer_profiles query fallback to local cache:', err);
        currentBackendStatus.status = 'network_error';
        currentBackendStatus.lastErrorMessage = err instanceof Error ? err.message : String(err);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.FARMERS);
    const rawFarmers: FarmerProfile[] = raw ? JSON.parse(raw) : INITIAL_FARMERS;
    const serviceAreas = await this.getServiceAreas();
    const result = rawFarmers.map(f => {
      const sa = serviceAreas.find(s => 
        s.id === f.service_area_id || 
        (f.service_area_id === 'sa-nashik' && s.district === 'Nashik') ||
        (f.service_area_id === 'sa-pune' && s.district === 'Pune')
      );
      return {
        ...f,
        service_area_id: sa ? sa.id : f.service_area_id
      };
    });
    setCached('farmers', result);
    return result;
  },

  async getFarmerById(farmerId: string): Promise<FarmerProfile | null> {
    const farmers = await this.getFarmers();
    return farmers.find(f => f.id === farmerId) || null;
  },

  async getProducts(filters?: MarketplaceFilters): Promise<Product[]> {
    const filterKey = `products_${JSON.stringify(filters || {})}`;
    const cached = getCached<Product[]>(filterKey);
    if (cached) return cached;

    let products: Product[] | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').select(`
          *,
          category:categories(*),
          farmer:farmer_profiles(*),
          images:product_images(*),
          inventory:inventory(*)
        `).eq('is_active', true).eq('is_moderated', true);

        if (filters?.categoryId && filters.categoryId !== 'all') {
          query = query.eq('category_id', filters.categoryId);
        }
        if (filters?.onlyOrganic) {
          query = query.eq('is_certified_organic', true);
        }

        const { data, error } = await withTimeout(query);
        if (!error && data && data.length > 0) {
          products = data as unknown as Product[];
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
        } else if (!error && data && data.length === 0) {
          currentBackendStatus.status = 'empty_database';
          currentBackendStatus.lastOrigin = 'fixture_fallback';
        } else if (error) {
          currentBackendStatus.status = error.code === '42501' ? 'permission_error' : 'network_error';
          currentBackendStatus.lastErrorMessage = error.message;
          currentBackendStatus.lastOrigin = 'fixture_fallback';
        }
      } catch (err) {
        console.warn('Supabase products fetch fallback to local cache:', err);
        currentBackendStatus.status = 'network_error';
        currentBackendStatus.lastErrorMessage = err instanceof Error ? err.message : String(err);
        currentBackendStatus.lastOrigin = 'fixture_fallback';
      }
    }

    if (!products) {
      const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const fallbackProducts: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
      const categories = await this.getCategories();
      const farmers = await this.getFarmers();
      const inventoryRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      const inventories: Inventory[] = inventoryRaw ? JSON.parse(inventoryRaw) : INITIAL_INVENTORIES;

      // Enrich with joins and resolve category IDs across live Supabase & mock seed formats
      products = fallbackProducts.map(p => {
        const category = categories.find(c => 
          c.id === p.category_id || 
          c.slug === p.category_id ||
          (p.category_id === 'cat-veg' && c.slug === 'vegetables') ||
          (p.category_id === 'cat-fruit' && c.slug === 'fruits') ||
          (p.category_id === 'cat-grains' && c.slug === 'grains') ||
          (p.category_id === 'cat-pulses' && c.slug === 'pulses') ||
          (p.category_id === 'cat-spices' && c.slug === 'spices') ||
          (p.category_id === 'cat-dairy' && c.slug === 'dairy')
        );
        const resolvedCategoryId = category ? category.id : p.category_id;
        const farmer = farmers.find(f => f.id === p.farmer_id || f.farm_name === p.farmer?.farm_name);

        return {
          ...p,
          category_id: resolvedCategoryId,
          category,
          farmer,
          inventory: inventories.find(i => i.product_id === p.id),
          images: p.images || [{
            id: `img-${p.id}`,
            product_id: p.id,
            image_url: PRODUCT_IMAGE_MAP[p.id] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
            sort_order: 0,
            is_primary: true,
            created_at: new Date().toISOString()
          }]
        };
      });
    }

    // Apply Filters
    let result = [...products];
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.name_hi?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.farmer?.farm_name.toLowerCase().includes(q)
        );
      }
      if (filters.categoryId && filters.categoryId !== 'all') {
        result = result.filter(p => 
          p.category_id === filters.categoryId || 
          p.category?.id === filters.categoryId ||
          p.category?.slug === filters.categoryId
        );
      }
      if (filters.serviceAreaId && filters.serviceAreaId !== 'all') {
        result = result.filter(p => 
          p.farmer?.service_area_id === filters.serviceAreaId ||
          (filters.serviceAreaId === 'sa-nashik' && p.farmer?.district === 'Nashik') ||
          (filters.serviceAreaId === 'sa-pune' && p.farmer?.district === 'Pune')
        );
      }
      if (filters.minPricePaise !== undefined) {
        result = result.filter(p => p.price_paise >= filters.minPricePaise!);
      }
      if (filters.maxPricePaise !== undefined) {
        result = result.filter(p => p.price_paise <= filters.maxPricePaise!);
      }
      if (filters.onlyOrganic) {
        result = result.filter(p => p.is_certified_organic);
      }
      if (filters.inStockOnly) {
        result = result.filter(p => (p.inventory?.available_quantity || 0) > 0);
      }

      // Sort
      if (filters.sortBy === 'price_asc') {
        result.sort((a, b) => a.price_paise - b.price_paise);
      } else if (filters.sortBy === 'price_desc') {
        result.sort((a, b) => b.price_paise - a.price_paise);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => (b.farmer?.rating || 0) - (a.farmer?.rating || 0));
      } else {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    setCached(filterKey, result);
    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug) || null;
  },

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(p => p.farmer_id === farmerId);
  },

  async createProduct(payload: {
    farmerId: string;
    categoryId: string;
    name: string;
    nameHi: string;
    description: string;
    descriptionHi?: string;
    pricePaise: number;
    unit: Product['unit'];
    unitStep: number;
    minOrderQuantity: number;
    availableQuantity: number;
    shelfLifeDays?: number;
    imageUrl: string;
    isCertifiedOrganic: boolean;
  }): Promise<Product> {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    const invRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = invRaw ? JSON.parse(invRaw) : INITIAL_INVENTORIES;

    const newId = `prod-${Date.now()}`;
    const slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const newProduct: Product = {
      id: newId,
      farmer_id: payload.farmerId,
      category_id: payload.categoryId,
      name: payload.name,
      name_hi: payload.nameHi,
      slug,
      description: payload.description,
      description_hi: payload.descriptionHi,
      price_paise: payload.pricePaise,
      unit: payload.unit,
      unit_step: payload.unitStep,
      min_order_quantity: payload.minOrderQuantity,
      shelf_life_days: payload.shelfLifeDays,
      is_certified_organic: payload.isCertifiedOrganic,
      is_active: true,
      is_moderated: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        {
          id: `img-${newId}`,
          product_id: newId,
          image_url: payload.imageUrl,
          sort_order: 0,
          is_primary: true,
          created_at: new Date().toISOString()
        }
      ]
    };

    const newInventory: Inventory = {
      id: `inv-${newId}`,
      product_id: newId,
      available_quantity: payload.availableQuantity,
      reserved_quantity: 0,
      low_stock_threshold: 5,
      updated_at: new Date().toISOString()
    };

    products.unshift(newProduct);
    inventories.unshift(newInventory);

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
    invalidateMarketplaceCache('products');

    return newProduct;
  },

  async updateProduct(productId: string, updates: Partial<Product>, callerFarmerId?: string): Promise<Product> {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    const prod = products.find(p => p.id === productId);
    if (!prod) throw new Error('Product not found');

    if (callerFarmerId && prod.farmer_id !== callerFarmerId) {
      throw new Error('Unauthorized: Farmers cannot modify products belonging to another farm.');
    }

    Object.assign(prod, updates, { updated_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    invalidateMarketplaceCache('products');
    return prod;
  },

  async updateInventory(productId: string, newAvailableQty: number, callerFarmerId?: string): Promise<void> {
    const invRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = invRaw ? JSON.parse(invRaw) : INITIAL_INVENTORIES;
    const item = inventories.find(i => i.product_id === productId);
    if (item) {
      if (callerFarmerId) {
        const products = await this.getProducts();
        const prod = products.find(p => p.id === productId);
        if (prod && prod.farmer_id !== callerFarmerId) {
          throw new Error('Unauthorized: You can only update inventory for your own farm products.');
        }
      }
      item.available_quantity = Math.max(0, newAvailableQty);
      item.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
      invalidateMarketplaceCache('products');
    }
  },

  // Checkout and Order Atomic Processing (Multi-farmer aware)
  async processCheckout(payload: {
    customerId: string;
    customerProfile: import('../types').Profile;
    address: Address;
    deliveryType: 'local_delivery' | 'pickup';
    paymentMethod: 'razorpay_online' | 'cod';
    paymentId?: string;
    deliveryNotes?: string;
    items: { product: Product; quantity: number }[];
  }): Promise<{ checkoutGroupId: string; orders: Order[] }> {
    const checkoutGroupId = `chk-${Date.now()}`;
    const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const allOrders: Order[] = rawOrders ? JSON.parse(rawOrders) : [];
    const invRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = invRaw ? JSON.parse(invRaw) : INITIAL_INVENTORIES;

    // Strict Stock Pre-Validation: Prevent overselling before creating any orders
    for (const item of payload.items) {
      const inv = inventories.find(i => i.product_id === item.product.id);
      const available = inv ? inv.available_quantity : (item.product.inventory?.available_quantity ?? 0);
      if (available < item.quantity) {
        throw new Error(
          `Insufficient stock for "${item.product.name}". Requested: ${item.quantity} ${item.product.unit}, Available: ${available} ${item.product.unit}`
        );
      }
    }

    const farmers = await this.getFarmers();

    // Group items by farmer_id
    const farmerGroups = new Map<string, { product: Product; quantity: number }[]>();
    for (const item of payload.items) {
      const fId = item.product.farmer_id;
      if (!farmerGroups.has(fId)) farmerGroups.set(fId, []);
      farmerGroups.get(fId)!.push(item);
    }

    const createdOrders: Order[] = [];

    // Create 1 sub-order per farmer
    for (const [farmerId, farmerItems] of farmerGroups.entries()) {
      const farmer = farmers.find(f => f.id === farmerId);
      const subtotalPaise = farmerItems.reduce((sum, item) => sum + (item.product.price_paise * item.quantity), 0);
      const deliveryFeePaise = payload.deliveryType === 'pickup' || subtotalPaise >= 50000 ? 0 : 4000;
      const totalAmountPaise = subtotalPaise + deliveryFeePaise;
      const orderNumber = `FD-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}-${farmerId}`,
        order_number: orderNumber,
        checkout_group_id: checkoutGroupId,
        customer_id: payload.customerId,
        farmer_id: farmerId,
        status: 'pending_confirmation',
        payment_status: payload.paymentMethod === 'razorpay_online' && payload.paymentId ? 'captured' : 'pending',
        payment_method: payload.paymentMethod,
        payment_id: payload.paymentId,
        delivery_type: payload.deliveryType,
        subtotal_paise: subtotalPaise,
        delivery_fee_paise: deliveryFeePaise,
        platform_fee_paise: 0,
        total_amount_paise: totalAmountPaise,
        delivery_address_snapshot: payload.address,
        delivery_notes: payload.deliveryNotes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        farmer,
        customer: payload.customerProfile,
        items: farmerItems.map(fi => ({
          id: `item-${Date.now()}-${fi.product.id}`,
          order_id: `ord-${Date.now()}-${farmerId}`,
          product_id: fi.product.id,
          product_name: fi.product.name,
          product_name_hi: fi.product.name_hi,
          unit: fi.product.unit,
          unit_price_paise: fi.product.price_paise,
          quantity: fi.quantity,
          total_price_paise: fi.product.price_paise * fi.quantity,
          created_at: new Date().toISOString(),
        }))
      };

      // Decrement Inventory strictly (Disallow overselling, no negative values)
      for (const fi of farmerItems) {
        const inv = inventories.find(i => i.product_id === fi.product.id);
        if (inv) {
          if (inv.available_quantity < fi.quantity) {
            throw new Error(`Item "${fi.product.name}" became unavailable during checkout.`);
          }
          inv.available_quantity = inv.available_quantity - fi.quantity;
          inv.updated_at = new Date().toISOString();
        }
      }

      createdOrders.push(newOrder);
      allOrders.unshift(newOrder);
    }

    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
    invalidateMarketplaceCache('products');

    return { checkoutGroupId, orders: createdOrders };
  },

  async getOrders(userId?: string, role?: 'customer' | 'farmer' | 'admin'): Promise<Order[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = raw ? JSON.parse(raw) : [];

    if (role === 'admin') return orders;
    if (role === 'farmer' && userId) {
      // Find farmer record for this user
      const farmers = await this.getFarmers();
      const farmer = farmers.find(f => f.user_id === userId || f.id === userId);
      if (!farmer) return [];
      return orders.filter(o => o.farmer_id === farmer.id);
    }
    if (userId) {
      return orders.filter(o => o.customer_id === userId);
    }
    // Strict isolation: unauthenticated/anonymous visitors cannot view all orders
    return [];
  },

  async getOrderById(orderId: string, currentUserId?: string, userRole?: string): Promise<Order | null> {
    const orders = await this.getOrders(undefined, 'admin');
    const order = orders.find(o => o.id === orderId || o.order_number === orderId) || null;
    if (!order) return null;

    // Strict Tenant Isolation Guard: Non-admins cannot see other users' orders
    if (userRole === 'customer') {
      if (!currentUserId || order.customer_id !== currentUserId) {
        return null;
      }
    } else if (userRole === 'farmer') {
      if (!currentUserId) return null;
      const isFarmer = order.farmer_id === currentUserId || order.farmer?.user_id === currentUserId;
      if (!isFarmer) return null;
    } else if (currentUserId && userRole !== 'admin') {
      const isOwner = order.customer_id === currentUserId;
      const isFarmer = order.farmer_id === currentUserId || order.farmer?.user_id === currentUserId;
      if (!isOwner && !isFarmer) {
        return null;
      }
    }
    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = raw ? JSON.parse(raw) : [];
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const previousStatus = order.status;
    order.status = status;
    order.updated_at = new Date().toISOString();

    if (status === 'confirmed') order.confirmed_at = new Date().toISOString();
    if (status === 'preparing') order.prepared_at = new Date().toISOString();
    if (status === 'out_for_delivery') order.dispatched_at = new Date().toISOString();
    if (status === 'delivered') {
      order.delivered_at = new Date().toISOString();
      if (order.payment_method === 'cod') order.payment_status = 'captured';
    }
    if (status === 'rejected') order.rejection_reason = reason || 'Produce unavailable';
    if (status === 'cancelled') {
      order.cancellation_reason = reason || 'Customer requested';
      order.cancelled_at = new Date().toISOString();
    }

    // Inventory Rollback on Cancellation or Rejection: Restore deducted items back to farm inventory
    if ((status === 'cancelled' || status === 'rejected') && previousStatus !== 'cancelled' && previousStatus !== 'rejected') {
      const invRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      const inventories: Inventory[] = invRaw ? JSON.parse(invRaw) : INITIAL_INVENTORIES;
      if (order.items) {
        for (const item of order.items) {
          if (item.product_id) {
            const inv = inventories.find(i => i.product_id === item.product_id);
            if (inv) {
              inv.available_quantity += item.quantity;
              inv.updated_at = new Date().toISOString();
            }
          }
        }
      }
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
      invalidateMarketplaceCache('products');
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return order;
  },

  // Payment Webhook Handler (Idempotent, Handles Delayed & Failed Events)
  async handlePaymentWebhook(payload: {
    eventId: string;
    eventType: 'payment.captured' | 'payment.failed';
    orderId: string;
    paymentId?: string;
    failureReason?: string;
  }): Promise<{ success: boolean; status: 'processed' | 'already_processed' | 'order_not_found'; order?: Order }> {
    const WEBHOOK_KEY = 'farmdirect_processed_webhooks';
    const rawEvents = localStorage.getItem(WEBHOOK_KEY);
    const processedEvents: string[] = rawEvents ? JSON.parse(rawEvents) : [];

    // Idempotency check 1: Event ID already processed
    if (processedEvents.includes(payload.eventId)) {
      return { success: true, status: 'already_processed' };
    }

    const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = rawOrders ? JSON.parse(rawOrders) : [];
    const order = orders.find(o => o.id === payload.orderId || o.order_number === payload.orderId);

    if (!order) {
      return { success: false, status: 'order_not_found' };
    }

    if (payload.eventType === 'payment.captured') {
      // Idempotency check 2: Order already marked as captured
      if (order.payment_status === 'captured') {
        processedEvents.push(payload.eventId);
        localStorage.setItem(WEBHOOK_KEY, JSON.stringify(processedEvents));
        return { success: true, status: 'already_processed', order };
      }

      order.payment_status = 'captured';
      if (payload.paymentId) {
        order.payment_id = payload.paymentId;
      }
      order.updated_at = new Date().toISOString();
    } else if (payload.eventType === 'payment.failed') {
      // Idempotency check 3: Order already failed or cancelled
      if (order.payment_status === 'failed') {
        processedEvents.push(payload.eventId);
        localStorage.setItem(WEBHOOK_KEY, JSON.stringify(processedEvents));
        return { success: true, status: 'already_processed', order };
      }

      order.payment_status = 'failed';
      // Automatically cancel order and restore inventory on failed payment
      await this.updateOrderStatus(order.id, 'cancelled', payload.failureReason || 'Online payment failed');
    }

    processedEvents.push(payload.eventId);
    localStorage.setItem(WEBHOOK_KEY, JSON.stringify(processedEvents));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    return { success: true, status: 'processed', order };
  },

  // Admin Actions
  async updateFarmerVerification(farmerId: string, status: FarmerVerificationStatus): Promise<void> {
    const raw = localStorage.getItem(STORAGE_KEYS.FARMERS);
    const farmers: FarmerProfile[] = raw ? JSON.parse(raw) : INITIAL_FARMERS;
    const farmer = farmers.find(f => f.id === farmerId);
    if (farmer) {
      farmer.verification_status = status;
      farmer.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
      invalidateMarketplaceCache('farmers');
      invalidateMarketplaceCache('products');
    }
  },

  async registerFarmer(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const raw = localStorage.getItem(STORAGE_KEYS.FARMERS);
    const farmers: FarmerProfile[] = raw ? JSON.parse(raw) : INITIAL_FARMERS;
    const newFarmer: FarmerProfile = {
      id: `farmer-${Date.now()}`,
      user_id: profile.user_id || `usr-${Date.now()}`,
      farm_name: profile.farm_name || 'Local Farm',
      farm_name_hi: profile.farm_name_hi,
      story: profile.story,
      story_hi: profile.story_hi,
      village: profile.village || 'Village',
      taluka_or_tehsil: profile.taluka || profile.taluka_or_tehsil || 'Taluka',
      taluka: profile.taluka || profile.taluka_or_tehsil || 'Taluka',
      district: profile.district || 'Nashik',
      state: profile.state || 'Maharashtra',
      pincode: profile.pincode || '422001',
      service_area_id: profile.service_area_id,
      verification_status: 'verified',
      is_verified: true,
      land_area_acres: profile.land_area_acres || 5,
      is_active: true,
      rating: 5.0,
      total_reviews: 0,
      phone: profile.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    farmers.push(newFarmer);
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
    invalidateMarketplaceCache('farmers');
    return newFarmer;
  }
};
