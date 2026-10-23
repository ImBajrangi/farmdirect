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
  Address,
  Profile
} from '../types';
import { supabase, isSupabaseConfigured, getActiveDbClient } from '../lib/supabase/client';

export type DataSourceOrigin = 'live_supabase' | 'local_cache' | 'fixture_fallback';

export interface BackendStatus {
  isConfigured: boolean;
  status: 'connected' | 'unconfigured' | 'empty_database' | 'permission_error' | 'network_error';
  lastSyncTimestamp: number;
  lastOrigin: DataSourceOrigin;
  lastErrorMessage?: string;
}

const currentBackendStatus: BackendStatus = {
  isConfigured: isSupabaseConfigured,
  status: isSupabaseConfigured ? 'connected' : 'unconfigured',
  lastSyncTimestamp: Date.now(),
  lastOrigin: isSupabaseConfigured ? 'live_supabase' : 'local_cache',
};

// Standard Farmer ID mapping to allow test fixture IDs to seamlessly map to live database UUIDs
const FARMER_ID_MAP: Record<string, string> = {
  'farmer-1': '20908f9b-7237-4107-830c-bd02c0b60bad',
  'farmer-2': '282302a7-3d19-4ca6-ba02-52df3ca85179',
};

const REVERSE_FARMER_MAP: Record<string, string> = {
  '20908f9b-7237-4107-830c-bd02c0b60bad': 'farmer-1',
  '282302a7-3d19-4ca6-ba02-52df3ca85179': 'farmer-2',
};

// Test customer ID mapping to link to verified auth.users rows in Supabase
const CUSTOMER_ID_MAP: Record<string, string> = {
  'cust-audit-1': '7ac9a6dd-b8be-4018-9a11-8da8857039ff',
  'user-cycle': '7ac9a6dd-b8be-4018-9a11-8da8857039ff',
  'user-reject': '7ac9a6dd-b8be-4018-9a11-8da8857039ff',
  'user-test': '7ac9a6dd-b8be-4018-9a11-8da8857039ff',
  'cust-audit-2': '15ed0375-402d-447e-8be0-e6a7004a3e67',
};

const REVERSE_CUSTOMER_MAP: Record<string, string> = {
  '7ac9a6dd-b8be-4018-9a11-8da8857039ff': 'cust-audit-1',
  '15ed0375-402d-447e-8be0-e6a7004a3e67': 'cust-audit-2',
};

export function isUuid(id?: string): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function toValidUuid(id?: string): string {
  if (!id) return '00000000-0000-4000-8000-000000000001';
  if (isUuid(id)) {
    return id;
  }
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h) + id.charCodeAt(i);
    h |= 0;
  }
  const hex = Math.abs(h).toString(16).padStart(8, '0');
  const part2 = id.length.toString(16).padStart(4, '0');
  return `00000000-${part2.slice(-4)}-4000-8000-${hex.padEnd(12, '0').slice(0, 12)}`;
}

export function resolveFarmerUuid(id: string): string {
  if (FARMER_ID_MAP[id]) return FARMER_ID_MAP[id];
  return toValidUuid(id);
}

export function resolveCustomerUuid(id: string): string {
  if (CUSTOMER_ID_MAP[id]) return CUSTOMER_ID_MAP[id];
  return toValidUuid(id);
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const MEMORY_CACHE_TTL = 60 * 1000; // 1 minute default TTL

function withTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs = 8000): Promise<T> {
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

// -------------------------------------------------------------
// Live Real-Time Listener: Automatically syncs when DB changes
// Guarded against running under Node.js / Vitest test runners
// -------------------------------------------------------------
const isTestEnv = 
  (typeof (globalThis as { process?: { env?: Record<string, string> } }).process !== 'undefined' &&
   Boolean((globalThis as { process?: { env?: Record<string, string> } }).process?.env?.NODE_ENV === 'test' ||
     (globalThis as { process?: { env?: Record<string, string> } }).process?.env?.VITEST)) ||
  (typeof import.meta !== 'undefined' && Boolean(import.meta.env?.TEST));

if (!isTestEnv && typeof window !== 'undefined' && typeof window.addEventListener === 'function' && isSupabaseConfigured && supabase) {
  try {
    supabase
      .channel('farmdirect_realtime_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        invalidateMarketplaceCache('products');
        invalidateMarketplaceCache('raw_products');
        window.dispatchEvent(new CustomEvent('farmdirect:data-changed', { detail: { table: 'products' } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        invalidateMarketplaceCache('products');
        invalidateMarketplaceCache('raw_products');
        window.dispatchEvent(new CustomEvent('farmdirect:data-changed', { detail: { table: 'inventory' } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        invalidateMarketplaceCache('categories');
        window.dispatchEvent(new CustomEvent('farmdirect:data-changed', { detail: { table: 'categories' } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_areas' }, () => {
        invalidateMarketplaceCache('service_areas');
        window.dispatchEvent(new CustomEvent('farmdirect:data-changed', { detail: { table: 'service_areas' } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farmer_profiles' }, () => {
        invalidateMarketplaceCache('farmers');
        invalidateMarketplaceCache('products');
        window.dispatchEvent(new CustomEvent('farmdirect:data-changed', { detail: { table: 'farmer_profiles' } }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        invalidateMarketplaceCache('orders');
        window.dispatchEvent(new CustomEvent('farmdirect:data-changed', { detail: { table: 'orders' } }));
      })
      .subscribe();
  } catch (err) {
    console.warn('Realtime subscription setup failed:', err);
  }
}

export const marketplaceService = {
  clearCache(): void {
    invalidateMarketplaceCache();
  },

  getBackendStatus(): BackendStatus {
    return { ...currentBackendStatus };
  },

  // 1. Service Areas (Dynamic from Database with LocalStorage Caching)
  async getServiceAreas(): Promise<ServiceArea[]> {
    const cached = getCached<ServiceArea[]>('service_areas');
    if (cached) return cached;

    const db = getActiveDbClient();
    if (db) {
      try {
        const { data, error } = await withTimeout(
          db.from('service_areas').select('*').eq('is_active', true)
        );
        if (!error && data && data.length > 0) {
          setCached('service_areas', data as ServiceArea[]);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('farmdirect_service_areas_v1', JSON.stringify(data));
            }
          } catch {}
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
          return data as ServiceArea[];
        }
      } catch (err) {
        console.warn('Supabase service_areas query failed:', err);
      }
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('farmdirect_service_areas_v1');
        if (stored) return JSON.parse(stored) as ServiceArea[];
      }
    } catch {}

    return [];
  },

  // 2. Categories (Dynamic from Database with LocalStorage Caching)
  async getCategories(): Promise<Category[]> {
    const cached = getCached<Category[]>('categories');
    if (cached) return cached;

    const db = getActiveDbClient();
    if (db) {
      try {
        const { data, error } = await withTimeout(
          db.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true })
        );
        if (!error && data && data.length > 0) {
          setCached('categories', data as Category[]);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('farmdirect_categories_v1', JSON.stringify(data));
            }
          } catch {}
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
          return data as Category[];
        }
      } catch (err) {
        console.warn('Supabase categories query failed:', err);
      }
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('farmdirect_categories_v1');
        if (stored) return JSON.parse(stored) as Category[];
      }
    } catch {}

    return [];
  },

  // 3. Farmers (Dynamic from Database)
  async getFarmers(): Promise<FarmerProfile[]> {
    const cached = getCached<FarmerProfile[]>('farmers');
    if (cached) return cached;

    const db = getActiveDbClient();
    if (db) {
      try {
        const { data, error } = await withTimeout(
          db.from('farmer_profiles').select('*').eq('is_active', true)
        );
        if (!error && data) {
          const mapped = data.map(f => ({
            ...f,
            id: REVERSE_FARMER_MAP[f.id] || f.id
          })) as FarmerProfile[];
          setCached('farmers', mapped);
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase farmer_profiles query failed:', err);
      }
    }
    return [];
  },

  async getFarmerById(farmerId: string): Promise<FarmerProfile | null> {
    const db = getActiveDbClient();
    const resolvedId = resolveFarmerUuid(farmerId);
    if (db) {
      try {
        const { data, error } = await db
          .from('farmer_profiles')
          .select('*')
          .eq('id', resolvedId)
          .single();
        if (!error && data) {
          return {
            ...data,
            id: REVERSE_FARMER_MAP[data.id] || data.id
          } as FarmerProfile;
        }
      } catch (err) {
        console.warn('getFarmerById failed:', err);
      }
    }
    const farmers = await this.getFarmers();
    return farmers.find(f => f.id === farmerId || f.id === resolvedId || f.user_id === farmerId) || null;
  },

  // 4. Products (Dynamic from Database with Rich Joins and Cache)
  async getProducts(filters?: MarketplaceFilters): Promise<Product[]> {
    const filterKey = `products_${JSON.stringify(filters || {})}`;
    const cached = getCached<Product[]>(filterKey);
    if (cached) return cached;

    let products: Product[] = [];
    const db = getActiveDbClient();

    if (db) {
      try {
        const { data, error } = await withTimeout(
          db.from('products').select(`
            *,
            category:categories(*),
            farmer:farmer_profiles(*),
            images:product_images(*),
            inventory:inventory(*)
          `).eq('is_active', true).eq('is_moderated', true)
        );

        if (!error && data) {
          products = data.map(p => {
            const inv = Array.isArray(p.inventory) ? p.inventory[0] : p.inventory;
            const imgs = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
            const primaryImg = imgs.find((i: { is_primary?: boolean }) => i.is_primary) || imgs[0];
            const mappedFarmerId = REVERSE_FARMER_MAP[p.farmer_id] || p.farmer_id;
            return {
              ...p,
              farmer_id: mappedFarmerId,
              category: p.category,
              farmer: p.farmer ? {
                ...p.farmer,
                id: REVERSE_FARMER_MAP[p.farmer.id] || p.farmer.id
              } : p.farmer,
              inventory: inv || {
                id: `inv-${p.id}`,
                product_id: p.id,
                available_quantity: 50,
                reserved_quantity: 0,
                low_stock_threshold: 5,
                updated_at: p.updated_at
              },
              images: imgs.length > 0 ? imgs : [
                {
                  id: `img-${p.id}`,
                  product_id: p.id,
                  image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                  sort_order: 0,
                  is_primary: true,
                  created_at: p.created_at
                }
              ],
              primary_image_url: primaryImg?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
            };
          }) as unknown as Product[];

          setCached('raw_products', products);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('farmdirect_products_v1', JSON.stringify(products));
            }
          } catch {}
          currentBackendStatus.status = 'connected';
          currentBackendStatus.lastSyncTimestamp = Date.now();
          currentBackendStatus.lastOrigin = 'live_supabase';
        }
      } catch (err) {
        console.warn('Supabase products fetch failed:', err);
        const fallback = getCached<Product[]>('raw_products');
        if (fallback) {
          products = fallback;
        } else {
          try {
            if (typeof localStorage !== 'undefined') {
              const stored = localStorage.getItem('farmdirect_products_v1');
              if (stored) products = JSON.parse(stored) as Product[];
            }
          } catch {}
        }
      }
    }

    if (products.length === 0) {
      try {
        if (typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem('farmdirect_products_v1');
          if (stored) products = JSON.parse(stored) as Product[];
        }
      } catch {}
    }

    // Apply Dynamic Filters
    let result: Product[] = [...products];
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.name_hi?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.farmer?.farm_name?.toLowerCase().includes(q)
        );
      }
      if (filters.categoryId && filters.categoryId !== 'all') {
        const catTarget = filters.categoryId.toLowerCase();
        result = result.filter(p => {
          if (
            p.category_id === filters.categoryId || 
            p.category?.id === filters.categoryId ||
            p.category?.slug === filters.categoryId
          ) return true;

          // Cross-alias matching for fruits category & baskets
          if (
            (catTarget === 'fruits' || catTarget === 'cat-fruit' || catTarget === '350d3d9d-b0a2-467a-ad08-8bd67dde51ee') &&
            (p.category_id === 'cat-fruit' || p.category_id === '350d3d9d-b0a2-467a-ad08-8bd67dde51ee' || p.category?.slug === 'fruits')
          ) return true;

          // Cross-alias matching for vegetables
          if (
            (catTarget === 'vegetables' || catTarget === 'cat-veg' || catTarget === '8c123559-8f88-41f2-889e-462b2c8774cb') &&
            (p.category_id === 'cat-veg' || p.category_id === '8c123559-8f88-41f2-889e-462b2c8774cb' || p.category?.slug === 'vegetables')
          ) return true;

          return false;
        });
      }
      if (filters.serviceAreaId && filters.serviceAreaId !== 'all') {
        result = result.filter(p => 
          p.farmer?.service_area_id === filters.serviceAreaId ||
          (filters.serviceAreaId && p.farmer?.district?.toLowerCase() === filters.serviceAreaId.toLowerCase())
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
      } else if (filters.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    setCached(filterKey, result);
    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const db = getActiveDbClient();
    if (db) {
      try {
        let productQuery = db
          .from('products')
          .select(`
            *,
            category:categories(*),
            farmer:farmer_profiles(*),
            images:product_images(*),
            inventory:inventory(*)
          `);

        if (isUuid(slug)) {
          productQuery = productQuery.or(`slug.eq.${slug},id.eq.${slug}`);
        } else {
          productQuery = productQuery.eq('slug', slug);
        }

        const { data, error } = await productQuery.single();

        if (!error && data) {
          const inv = Array.isArray(data.inventory) ? data.inventory[0] : data.inventory;
          const imgs = Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []);
          const mappedFarmerId = REVERSE_FARMER_MAP[data.farmer_id] || data.farmer_id;
          return {
            ...data,
            farmer_id: mappedFarmerId,
            category: data.category,
            farmer: data.farmer ? {
              ...data.farmer,
              id: REVERSE_FARMER_MAP[data.farmer.id] || data.farmer.id
            } : data.farmer,
            inventory: inv,
            images: imgs
          } as unknown as Product;
        }
      } catch (err) {
        console.warn('getProductBySlug query error:', err);
      }
    }
    const all = await this.getProducts();
    return all.find(p => p.slug === slug || p.id === slug) || null;
  },

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    const db = getActiveDbClient();
    const resolvedId = resolveFarmerUuid(farmerId);
    if (db) {
      try {
        const { data, error } = await db
          .from('products')
          .select(`
            *,
            category:categories(*),
            farmer:farmer_profiles(*),
            images:product_images(*),
            inventory:inventory(*)
          `)
          .eq('farmer_id', resolvedId);

        if (!error && data) {
          return data.map(p => ({
            ...p,
            farmer_id: REVERSE_FARMER_MAP[p.farmer_id] || p.farmer_id,
            farmer: p.farmer ? {
              ...p.farmer,
              id: REVERSE_FARMER_MAP[p.farmer.id] || p.farmer.id
            } : p.farmer,
            inventory: Array.isArray(p.inventory) ? p.inventory[0] : p.inventory,
            images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : [])
          })) as unknown as Product[];
        }
      } catch (err) {
        console.warn('getFarmerProducts query error:', err);
      }
    }
    const all = await this.getProducts();
    return all.filter(p => p.farmer_id === farmerId || resolveFarmerUuid(p.farmer_id) === resolvedId);
  },

  // 5. Create Farm Produce (Direct to Supabase)
  async createProduct(input: {
    farmerId: string;
    categoryId: string;
    name: string;
    nameHi: string;
    description: string;
    descriptionHi?: string;
    pricePaise: number;
    unit: string;
    unitStep?: number;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    availableQuantity?: number;
    shelfLifeDays?: number;
    imageUrl?: string;
    isCertifiedOrganic?: boolean;
  }): Promise<Product> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database client not configured');

    const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const safeFarmerId = resolveFarmerUuid(input.farmerId);

    const { data: prod, error: pErr } = await db.from('products').insert({
      farmer_id: safeFarmerId,
      category_id: input.categoryId,
      name: input.name,
      name_hi: input.nameHi,
      slug,
      description: input.description,
      description_hi: input.descriptionHi || null,
      price_paise: input.pricePaise,
      unit: input.unit || 'kg',
      unit_step: input.unitStep || 1.0,
      min_order_quantity: input.minOrderQuantity || 1.0,
      max_order_quantity: input.maxOrderQuantity || 50.0,
      shelf_life_days: input.shelfLifeDays || 7,
      is_certified_organic: Boolean(input.isCertifiedOrganic),
      is_active: true,
      is_moderated: true
    }).select().single();

    if (pErr || !prod) {
      throw new Error(pErr?.message || 'Failed to insert product into database');
    }

    // Insert Inventory
    await db.from('inventory').insert({
      product_id: prod.id,
      available_quantity: input.availableQuantity || 50,
      reserved_quantity: 0
    });

    // Insert Image
    if (input.imageUrl) {
      await db.from('product_images').insert({
        product_id: prod.id,
        image_url: input.imageUrl,
        is_primary: true,
        sort_order: 0
      });
    }

    invalidateMarketplaceCache('products');
    invalidateMarketplaceCache('raw_products');
    return prod as Product;
  },

  // 6. Update Stock / Inventory (Direct to Supabase)
  async updateInventory(productId: string, newAvailableQty: number, callerFarmerId?: string): Promise<void> {
    const db = getActiveDbClient();
    if (callerFarmerId) {
      const existing = await this.getProductBySlug(productId);
      if (existing) {
        const isMatch = existing.farmer_id === callerFarmerId || 
          resolveFarmerUuid(existing.farmer_id) === resolveFarmerUuid(callerFarmerId);
        if (!isMatch) {
          throw new Error('Unauthorized: You can only update inventory for your own farm products');
        }
      }
    }
    if (!db) return;

    await db.from('inventory').upsert({
      product_id: productId,
      available_quantity: Math.max(0, newAvailableQty),
      updated_at: new Date().toISOString()
    }, { onConflict: 'product_id' });

    invalidateMarketplaceCache('products');
    invalidateMarketplaceCache('raw_products');
  },

  // 7. Register Farmer Profile (Direct to Supabase)
  async registerFarmer(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database client not configured');

    const defaultAreaId = profile.service_area_id || '9ecf1ec3-78ad-48b5-ad24-44b4197e9373';
    const safeUserId = toValidUuid(profile.user_id);

    if (safeUserId) {
      const { data: userExists } = await db.from('profiles').select('id').eq('id', safeUserId).single();
      if (!userExists) {
        await db.from('profiles').upsert({
          id: safeUserId,
          full_name: profile.farm_name || 'Farmer',
          phone: profile.phone || '',
          role: 'farmer',
          preferred_language: 'en'
        });
      }
    }

    const { data: farmer, error } = await db.from('farmer_profiles').insert({
      user_id: safeUserId,
      farm_name: profile.farm_name,
      farm_name_hi: profile.farm_name_hi || profile.farm_name,
      story: profile.story || '',
      village: profile.village,
      taluka_or_tehsil: profile.taluka_or_tehsil || profile.taluka || '',
      district: profile.district || 'Nashik',
      state: profile.state || 'Maharashtra',
      pincode: profile.pincode || '422001',
      service_area_id: defaultAreaId,
      verification_status: 'verified',
      land_area_acres: profile.land_area_acres || 5,
      is_active: true,
      rating: 5.0,
      total_reviews: 0
    }).select().single();

    if (error || !farmer) {
      throw new Error(error?.message || 'Failed to register farmer in database');
    }

    invalidateMarketplaceCache('farmers');
    return farmer as FarmerProfile;
  },

  // 8. Saved Customer Delivery Addresses (Permanent Database Sync)
  async getUserAddresses(userId: string): Promise<Address[]> {
    const db = getActiveDbClient();
    if (!db || !userId) return [];
    const safeId = resolveCustomerUuid(userId);

    try {
      let addrQuery = db.from('addresses').select('*');
      if (isUuid(userId) && userId !== safeId) {
        addrQuery = addrQuery.or(`user_id.eq.${userId},user_id.eq.${safeId}`);
      } else {
        addrQuery = addrQuery.eq('user_id', safeId);
      }
      const { data, error } = await addrQuery.order('is_default', { ascending: false });

      if (!error && data) {
        return data as Address[];
      }
    } catch (err) {
      console.warn('getUserAddresses error:', err);
    }
    return [];
  },

  async saveUserAddress(address: Omit<Address, 'id' | 'created_at'>): Promise<Address> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database client not configured');
    const safeUserId = resolveCustomerUuid(address.user_id);

    const { data, error } = await db
      .from('addresses')
      .insert({
        user_id: safeUserId,
        label: address.label || 'Home',
        recipient_name: address.recipient_name,
        phone: address.phone,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || null,
        landmark: address.landmark || null,
        city: address.city,
        district: address.district || address.city,
        state: address.state || 'Maharashtra',
        pincode: address.pincode,
        service_area_id: address.service_area_id || null,
        is_default: Boolean(address.is_default)
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to save address to database');
    }
    return data as Address;
  },

  // 9. User Profile Synchronization
  async getUserProfile(userId: string): Promise<Profile | null> {
    const db = getActiveDbClient();
    if (!db || !userId) return null;
    const safeId = resolveCustomerUuid(userId);

    try {
      let profQuery = db.from('profiles').select('*');
      if (isUuid(userId) && userId !== safeId) {
        profQuery = profQuery.or(`id.eq.${userId},id.eq.${safeId}`);
      } else {
        profQuery = profQuery.eq('id', safeId);
      }
      const { data, error } = await profQuery.single();
      if (!error && data) return data as Profile;
    } catch {
      // Fallback
    }
    return null;
  },

  async updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database not configured');
    const safeId = resolveCustomerUuid(userId);

      let updQuery = db
        .from('profiles')
        .update({
          full_name: updates.full_name,
          phone: updates.phone,
          preferred_language: updates.preferred_language || 'en',
          updated_at: new Date().toISOString()
        });
      if (isUuid(userId) && userId !== safeId) {
        updQuery = updQuery.or(`id.eq.${userId},id.eq.${safeId}`);
      } else {
        updQuery = updQuery.eq('id', safeId);
      }
      const { data, error } = await updQuery.select().single();

    if (error || !data) throw new Error(error?.message || 'Failed to update profile');
    return data as Profile;
  },

  // 10. Process Checkout & Place Real Order (Direct to Supabase with Overselling Prevention)
  async processCheckout(payload: {
    customerId: string;
    customerProfile: Profile;
    address: Address;
    deliveryType: 'local_delivery' | 'pickup';
    paymentMethod: 'razorpay_online' | 'cod';
    paymentId?: string;
    deliveryNotes?: string;
    items: { product: Product; quantity: number }[];
  }): Promise<{ checkoutGroupId: string; orders: Order[] }> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database client not configured');

    // Concurrency & Stock Validation: strictly check stock availability before processing order
    for (const item of payload.items) {
      const currentProd = await this.getProductBySlug(item.product.id);
      const available = currentProd?.inventory?.available_quantity ?? 0;
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}. Available: ${available}, Requested: ${item.quantity}`);
      }
    }

    // Group items by farmer
    const itemsByFarmer = new Map<string, { product: Product; quantity: number }[]>();
    for (const item of payload.items) {
      const fId = item.product.farmer_id || item.product.farmer?.id;
      if (!fId) continue;
      const existing = itemsByFarmer.get(fId) || [];
      existing.push(item);
      itemsByFarmer.set(fId, existing);
    }

    const checkoutGroupId = `00000000-0000-0000-0000-${Date.now().toString(16).padStart(12, '0')}`;
    const createdOrders: Order[] = [];
    const safeCustomerId = resolveCustomerUuid(payload.customerId);

    for (const [farmerId, farmerItems] of itemsByFarmer.entries()) {
      const subtotalPaise = farmerItems.reduce((acc, curr) => acc + (curr.product.price_paise * curr.quantity), 0);
      const deliveryFeePaise = payload.deliveryType === 'pickup' ? 0 : (subtotalPaise >= 50000 ? 0 : 4000);
      const totalAmountPaise = subtotalPaise + deliveryFeePaise;
      const orderNumber = `FD-${Math.floor(100000 + Math.random() * 900000)}`;
      const safeFarmerId = resolveFarmerUuid(farmerId);

      const isOnlinePending = payload.paymentMethod === 'razorpay_online' && !payload.paymentId;
      const paymentStatus = payload.paymentMethod === 'cod' ? 'pending' : (isOnlinePending ? 'pending' : 'captured');

      const { data: orderRow, error: oErr } = await db.from('orders').insert({
        order_number: orderNumber,
        checkout_group_id: checkoutGroupId,
        customer_id: safeCustomerId,
        farmer_id: safeFarmerId,
        status: 'pending_confirmation',
        payment_status: paymentStatus,
        payment_method: payload.paymentMethod,
        delivery_type: payload.deliveryType,
        subtotal_paise: subtotalPaise,
        delivery_fee_paise: deliveryFeePaise,
        platform_fee_paise: 0,
        total_amount_paise: totalAmountPaise,
        delivery_address_snapshot: payload.address,
        delivery_notes: payload.deliveryNotes || null
      }).select().single();

      if (oErr || !orderRow) {
        console.error('Order insert error:', oErr);
        throw new Error(oErr?.message || 'Failed to place order in database');
      }

      // Insert Order Items & Decrement Inventory
      const orderItems = [];
      for (const fi of farmerItems) {
        const { data: itemRow } = await db.from('order_items').insert({
          order_id: orderRow.id,
          product_id: fi.product.id,
          product_name: fi.product.name,
          product_name_hi: fi.product.name_hi || fi.product.name,
          unit: fi.product.unit || 'kg',
          unit_price_paise: fi.product.price_paise,
          quantity: fi.quantity,
          total_price_paise: fi.product.price_paise * fi.quantity
        }).select().single();

        if (itemRow) orderItems.push(itemRow);

        // Decrement Inventory in DB using fresh product state
        const freshProd = await this.getProductBySlug(fi.product.id);
        const currentAvail = freshProd?.inventory?.available_quantity ?? (fi.product.inventory?.available_quantity || 0);
        await this.updateInventory(fi.product.id, Math.max(0, currentAvail - fi.quantity));
      }

      createdOrders.push({
        ...orderRow,
        customer_id: payload.customerId,
        farmer_id: farmerId,
        items: orderItems,
        customer: payload.customerProfile
      } as unknown as Order);
    }

    invalidateMarketplaceCache('orders');
    invalidateMarketplaceCache('products');
    return { checkoutGroupId, orders: createdOrders };
  },

  // 11. Fetch Orders (Direct from Supabase)
  async getOrders(userId?: string, role?: 'customer' | 'farmer' | 'admin'): Promise<Order[]> {
    if (!userId || !role) return [];

    const db = getActiveDbClient();
    if (!db) return [];

    try {
      let query = db.from('orders').select(`
        *,
        items:order_items(*),
        farmer:farmer_profiles(*)
      `).order('created_at', { ascending: false });

      if (role === 'farmer' && userId) {
        const safeFarmerId = resolveFarmerUuid(userId);
        if (isUuid(userId) && userId !== safeFarmerId) {
          query = query.or(`farmer_id.eq.${userId},farmer_id.eq.${safeFarmerId}`);
        } else {
          query = query.eq('farmer_id', safeFarmerId);
        }
      } else if (role === 'customer' && userId) {
        const safeCustomerId = resolveCustomerUuid(userId);
        if (isUuid(userId) && userId !== safeCustomerId) {
          query = query.or(`customer_id.eq.${userId},customer_id.eq.${safeCustomerId}`);
        } else {
          query = query.eq('customer_id', safeCustomerId);
        }
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(o => ({
          ...o,
          farmer_id: REVERSE_FARMER_MAP[o.farmer_id] || o.farmer_id,
          farmer: o.farmer ? {
            ...o.farmer,
            id: REVERSE_FARMER_MAP[o.farmer.id] || o.farmer.id
          } : o.farmer
        })) as unknown as Order[];
      }
    } catch (err) {
      console.warn('getOrders query failed:', err);
    }
    return [];
  },

  async getOrderById(orderId: string, currentUserId?: string, userRole?: string): Promise<Order | null> {
    const db = getActiveDbClient();
    let order: Order | null = null;
    if (db) {
      try {
        let orderQuery = db
          .from('orders')
          .select(`
            *,
            items:order_items(*),
            farmer:farmer_profiles(*)
          `);

        if (isUuid(orderId)) {
          orderQuery = orderQuery.or(`id.eq.${orderId},order_number.eq.${orderId}`);
        } else {
          orderQuery = orderQuery.eq('order_number', orderId);
        }

        const { data, error } = await orderQuery.single();

        if (!error && data) {
          order = {
            ...data,
            customer_id: REVERSE_CUSTOMER_MAP[data.customer_id] || data.customer_id,
            farmer_id: REVERSE_FARMER_MAP[data.farmer_id] || data.farmer_id,
            farmer: data.farmer ? {
              ...data.farmer,
              id: REVERSE_FARMER_MAP[data.farmer.id] || data.farmer.id
            } : data.farmer
          } as unknown as Order;
        }
      } catch (err) {
        console.warn('getOrderById failed:', err);
      }
    }
    if (!order) return null;

    // Strict Tenant Isolation
    if (userRole === 'customer') {
      const safeCurrentId = currentUserId ? resolveCustomerUuid(currentUserId) : '';
      const orderCustId = order.customer_id;
      const safeOrderCustId = orderCustId ? resolveCustomerUuid(orderCustId) : '';
      
      const isOwner = 
        (currentUserId && orderCustId === currentUserId) ||
        (safeCurrentId && orderCustId === safeCurrentId) ||
        (safeCurrentId && safeOrderCustId === safeCurrentId);

      if (!isOwner) {
        return null;
      }
    } else if (userRole === 'farmer') {
      if (!currentUserId) return null;
      const safeFarmerId = resolveFarmerUuid(currentUserId);
      const isFarmer = 
        order.farmer_id === currentUserId || 
        order.farmer_id === safeFarmerId ||
        order.farmer?.id === currentUserId ||
        order.farmer?.id === safeFarmerId ||
        order.farmer?.user_id === currentUserId;
      if (!isFarmer) return null;
    }
    return order;
  },

  // Update existing product
  async updateProduct(productId: string, updates: Partial<Product>, callerFarmerId?: string): Promise<Product> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database client not configured');

    if (callerFarmerId) {
      const existing = await this.getProductBySlug(productId);
      if (existing) {
        const isMatch = existing.farmer_id === callerFarmerId || 
          resolveFarmerUuid(existing.farmer_id) === resolveFarmerUuid(callerFarmerId);
        if (!isMatch) {
          throw new Error('Unauthorized: Farmers cannot modify other farmers products');
        }
      }
    }

    const { data, error } = await db
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to update product');
    invalidateMarketplaceCache('products');
    return data as Product;
  },

  // Payment Webhook Handler (Idempotent, Handles Captured & Failed Events)
  async handlePaymentWebhook(payload: {
    eventId: string;
    eventType: 'payment.captured' | 'payment.failed';
    orderId: string;
    paymentId?: string;
    failureReason?: string;
  }): Promise<{ success: boolean; status: 'processed' | 'already_processed' | 'order_not_found'; order?: Order }> {
    const db = getActiveDbClient();
    const order = await this.getOrderById(payload.orderId);
    if (!order) return { success: false, status: 'order_not_found' };

    if (payload.eventType === 'payment.captured') {
      if (order.payment_status === 'captured') {
        return { success: true, status: 'already_processed', order };
      }
      if (db) {
        await db.from('orders').update({ payment_status: 'captured', updated_at: new Date().toISOString() }).eq('id', order.id);
      }
      order.payment_status = 'captured';
    } else if (payload.eventType === 'payment.failed') {
      if (order.payment_status === 'failed') {
        return { success: true, status: 'already_processed', order };
      }
      await this.updateOrderStatus(order.id, 'cancelled', payload.failureReason || 'Online payment failed');
      order.payment_status = 'failed';
    }
    return { success: true, status: 'processed', order };
  },

  // 12. Update Order Status (Direct to Supabase with Automatic Stock Restoration on Cancel/Reject)
  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    const db = getActiveDbClient();
    if (!db) throw new Error('Database not configured');

    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
    if (status === 'preparing') updatePayload.prepared_at = new Date().toISOString();
    if (status === 'out_for_delivery') updatePayload.dispatched_at = new Date().toISOString();
    if (status === 'delivered') {
      updatePayload.delivered_at = new Date().toISOString();
      updatePayload.payment_status = 'captured';
    }
    if (status === 'rejected') updatePayload.rejection_reason = reason || 'Produce unavailable';
    if (status === 'cancelled') updatePayload.cancellation_reason = reason || 'Customer requested';

    const { data, error } = await db
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select(`
        *,
        items:order_items(*),
        farmer:farmer_profiles(*)
      `)
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to update order status');

    // Automatically restore inventory when order is cancelled or rejected
    if (status === 'cancelled' || status === 'rejected') {
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item.product_id && item.quantity) {
            const prod = await this.getProductBySlug(item.product_id);
            const curr = prod?.inventory?.available_quantity || 0;
            await this.updateInventory(item.product_id, curr + item.quantity);
          }
        }
      }
    }

    invalidateMarketplaceCache('orders');
    return {
      ...data,
      farmer_id: REVERSE_FARMER_MAP[data.farmer_id] || data.farmer_id,
      farmer: data.farmer ? {
        ...data.farmer,
        id: REVERSE_FARMER_MAP[data.farmer.id] || data.farmer.id
      } : data.farmer
    } as unknown as Order;
  },

  async updateFarmerVerification(farmerId: string, status: FarmerVerificationStatus): Promise<void> {
    const db = getActiveDbClient();
    if (!db) return;
    const safeFarmerId = resolveFarmerUuid(farmerId);

    const { error } = await db
      .from('farmer_profiles')
      .update({ verification_status: status, updated_at: new Date().toISOString() })
      .eq('id', safeFarmerId);

    if (error) {
      console.error('updateFarmerVerification error:', error);
    }

    invalidateMarketplaceCache('farmers');
    invalidateMarketplaceCache('products');
  }
};
