import { describe, it, expect, beforeEach } from 'vitest';
import { marketplaceService } from '../services/marketplaceService';
import { Address } from '../types';

describe('Marketplace Catalog & Search Operations', () => {
  it('retrieves default categories and service areas', async () => {
    const categories = await marketplaceService.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some(c => c.slug === 'vegetables')).toBe(true);

    const areas = await marketplaceService.getServiceAreas();
    expect(areas.length).toBeGreaterThan(0);
    expect(areas.some(a => a.district === 'Nashik')).toBe(true);
  });

  it('filters products by category correctly', async () => {
    const vegCategory = (await marketplaceService.getCategories()).find(c => c.slug === 'vegetables')!;
    const vegProducts = await marketplaceService.getProducts({ categoryId: vegCategory.id, sortBy: 'newest' });
    expect(vegProducts.length).toBeGreaterThan(0);
    expect(vegProducts.every(p => p.category_id === vegCategory.id)).toBe(true);
  });

  it('searches products by English and Hindi names', async () => {
    const searchResult = await marketplaceService.getProducts({ searchQuery: 'onion', sortBy: 'newest' });
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult.some(p => p.name.toLowerCase().includes('onion'))).toBe(true);

    const hindiResult = await marketplaceService.getProducts({ searchQuery: 'कांदा', sortBy: 'newest' });
    expect(hindiResult.length).toBeGreaterThan(0);
  });
});

describe('Multi-Farmer Atomic Checkout & Stock Isolation', () => {
  const dummyAddress: Address = {
    id: 'addr-test',
    user_id: 'user-test',
    label: 'Home',
    recipient_name: 'Pooja Verma',
    phone: '9822123456',
    address_line_1: 'Plot 4, Nashik Road',
    city: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422001',
    is_default: true,
    created_at: new Date().toISOString(),
  };

  it('partitions cart into distinct sub-orders when products belong to different farmers', async () => {
    const products = await marketplaceService.getProducts();
    const farmer1Prod = products.find(p => p.farmer_id === 'farmer-1')!;
    const farmer2Prod = products.find(p => p.farmer_id === 'farmer-2')!;

    expect(farmer1Prod).toBeDefined();
    expect(farmer2Prod).toBeDefined();

    await marketplaceService.updateInventory(farmer1Prod.id, 20);
    await marketplaceService.updateInventory(farmer2Prod.id, 20);

    const checkoutResult = await marketplaceService.processCheckout({
      customerId: 'user-test',
      customerProfile: {
        id: 'user-test',
        full_name: 'Pooja Verma',
        role: 'customer',
        preferred_language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      address: dummyAddress,
      deliveryType: 'local_delivery',
      paymentMethod: 'cod',
      items: [
        { product: farmer1Prod, quantity: 2 },
        { product: farmer2Prod, quantity: 1 },
      ],
    });

    expect(checkoutResult.checkoutGroupId).toBeTruthy();
    expect(checkoutResult.orders.length).toBe(2);

    // Order isolation: each order belongs to its respective farmer
    const order1 = checkoutResult.orders.find(o => o.farmer_id === 'farmer-1');
    const order2 = checkoutResult.orders.find(o => o.farmer_id === 'farmer-2');

    expect(order1).toBeDefined();
    expect(order2).toBeDefined();
    expect(order1?.order_number).not.toBe(order2?.order_number);
  });
});
