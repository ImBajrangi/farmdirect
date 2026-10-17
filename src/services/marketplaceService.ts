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
  async getServiceAreas(): Promise<ServiceArea[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('service_areas').select('*').eq('is_active', true);
      if (!error && data) return data as ServiceArea[];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_AREAS);
    return raw ? JSON.parse(raw) : INITIAL_SERVICE_AREAS;
  },

  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
      if (!error && data) return data as Category[];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
  },

  async getFarmers(): Promise<FarmerProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('farmer_profiles').select('*');
      if (!error && data) return data as FarmerProfile[];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.FARMERS);
    return raw ? JSON.parse(raw) : INITIAL_FARMERS;
  },

  async getFarmerById(farmerId: string): Promise<FarmerProfile | null> {
    const farmers = await this.getFarmers();
    return farmers.find(f => f.id === farmerId) || null;
  },

  async getProducts(filters?: MarketplaceFilters): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('products').select(`
        *,
        category:categories(*),
        farmer:farmer_profiles(*),
        images:product_images(*),
        inventory:inventory(*)
      `).eq('is_active', true).eq('is_moderated', true);

      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters?.onlyOrganic) query = query.eq('is_certified_organic', true);

      const { data, error } = await query;
      if (!error && data) return data as unknown as Product[];
    }

    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    const categories = await this.getCategories();
    const farmers = await this.getFarmers();
    const inventoryRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = inventoryRaw ? JSON.parse(inventoryRaw) : INITIAL_INVENTORIES;

    // Enrich with joins
    products = products.map(p => ({
      ...p,
      category: categories.find(c => c.id === p.category_id),
      farmer: farmers.find(f => f.id === p.farmer_id),
      inventory: inventories.find(i => i.product_id === p.id),
      images: p.images || [{
        id: `img-${p.id}`,
        product_id: p.id,
        image_url: PRODUCT_IMAGE_MAP[p.id] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        sort_order: 0,
        is_primary: true,
        created_at: new Date().toISOString()
      }]
    }));

    // Apply Filters
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        products = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.name_hi.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.farmer?.farm_name.toLowerCase().includes(q)
        );
      }
      if (filters.categoryId && filters.categoryId !== 'all') {
        products = products.filter(p => p.category_id === filters.categoryId);
      }
      if (filters.serviceAreaId && filters.serviceAreaId !== 'all') {
        products = products.filter(p => p.farmer?.service_area_id === filters.serviceAreaId);
      }
      if (filters.minPricePaise !== undefined) {
        products = products.filter(p => p.price_paise >= filters.minPricePaise!);
      }
      if (filters.maxPricePaise !== undefined) {
        products = products.filter(p => p.price_paise <= filters.maxPricePaise!);
      }
      if (filters.onlyOrganic) {
        products = products.filter(p => p.is_certified_organic);
      }
      if (filters.inStockOnly) {
        products = products.filter(p => (p.inventory?.available_quantity || 0) > 0);
      }

      // Sort
      if (filters.sortBy === 'price_asc') {
        products.sort((a, b) => a.price_paise - b.price_paise);
      } else if (filters.sortBy === 'price_desc') {
        products.sort((a, b) => b.price_paise - a.price_paise);
      } else if (filters.sortBy === 'rating') {
        products.sort((a, b) => (b.farmer?.rating || 0) - (a.farmer?.rating || 0));
      } else {
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    return products;
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

    return newProduct;
  },

  async updateInventory(productId: string, newAvailableQty: number): Promise<void> {
    const invRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = invRaw ? JSON.parse(invRaw) : INITIAL_INVENTORIES;
    const item = inventories.find(i => i.product_id === productId);
    if (item) {
      item.available_quantity = newAvailableQty;
      item.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
    }
  },

  // Checkout and Order Atomic Processing (Multi-farmer aware)
  async processCheckout(payload: {
    customerId: string;
    customerProfile: import('../types').Profile;
    address: Address;
    deliveryType: 'local_delivery' | 'pickup';
    paymentMethod: 'razorpay_online' | 'cod';
    deliveryNotes?: string;
    items: { product: Product; quantity: number }[];
  }): Promise<{ checkoutGroupId: string; orders: Order[] }> {
    const checkoutGroupId = `chk-${Date.now()}`;
    const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const allOrders: Order[] = rawOrders ? JSON.parse(rawOrders) : [];
    const invRaw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventories: Inventory[] = invRaw ? JSON.parse(invRaw) : INITIAL_INVENTORIES;
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
        payment_status: payload.paymentMethod === 'razorpay_online' ? 'captured' : 'pending',
        payment_method: payload.paymentMethod,
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

      // Decrement Inventory safely
      for (const fi of farmerItems) {
        const inv = inventories.find(i => i.product_id === fi.product.id);
        if (inv) {
          inv.available_quantity = Math.max(0, inv.available_quantity - fi.quantity);
          inv.updated_at = new Date().toISOString();
        }
      }

      createdOrders.push(newOrder);
      allOrders.unshift(newOrder);
    }

    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventories));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));

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
    return orders;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders(undefined, 'admin');
    return orders.find(o => o.id === orderId || o.order_number === orderId) || null;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = raw ? JSON.parse(raw) : [];
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

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
    if (status === 'cancelled') order.cancellation_reason = reason || 'Customer requested';

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return order;
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
    return newFarmer;
  }
};
