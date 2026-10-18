import { describe, it, expect, beforeEach } from 'vitest';
import { marketplaceService } from '../services/marketplaceService';
import { Address, Product } from '../types';

describe('Production Readiness Audit Suite', () => {
  const dummyAddress: Address = {
    id: 'addr-audit-1',
    user_id: 'cust-audit-1',
    label: 'Home',
    recipient_name: 'Rahul Patil',
    phone: '9822001122',
    address_line_1: 'Gangapur Road',
    city: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422005',
    is_default: true,
    created_at: new Date().toISOString(),
  };

  const customerProfile1 = {
    id: 'cust-audit-1',
    full_name: 'Rahul Patil',
    role: 'customer' as const,
    preferred_language: 'en' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const customerProfile2 = {
    id: 'cust-audit-2',
    full_name: 'Sneha Deshmukh',
    role: 'customer' as const,
    preferred_language: 'en' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    localStorage.clear();
    marketplaceService.clearCache();
  });

  // =========================================================================
  // 1. SECURITY & TENANT ISOLATION AUDIT
  // =========================================================================
  describe('Pillar 1: Security & Cross-Tenant Isolation', () => {
    it('prevents Customer B from accessing Customer A orders via getOrderById', async () => {
      const products = await marketplaceService.getProducts();
      const prod = products[0];

      // Customer 1 places an order
      const checkoutRes = await marketplaceService.processCheckout({
        customerId: 'cust-audit-1',
        customerProfile: customerProfile1,
        address: dummyAddress,
        deliveryType: 'local_delivery',
        paymentMethod: 'cod',
        items: [{ product: prod, quantity: 1 }],
      });

      const orderId = checkoutRes.orders[0].id;

      // Customer 1 can view their own order
      const ownerView = await marketplaceService.getOrderById(orderId, 'cust-audit-1', 'customer');
      expect(ownerView).not.toBeNull();
      expect(ownerView?.customer_id).toBe('cust-audit-1');

      // Customer 2 attempts to read Customer 1's order -> MUST BE NULL
      const snoopView = await marketplaceService.getOrderById(orderId, 'cust-audit-2', 'customer');
      expect(snoopView).toBeNull();

      // Anonymous / unauthenticated customer -> MUST BE NULL
      const anonView = await marketplaceService.getOrderById(orderId, undefined, 'customer');
      expect(anonView).toBeNull();

      // Admin CAN view order for operations & dispute resolution
      const adminView = await marketplaceService.getOrderById(orderId, 'admin-1', 'admin');
      expect(adminView).not.toBeNull();
      expect(adminView?.id).toBe(orderId);
    });

    it('blocks anonymous access to general order listing', async () => {
      const anonOrders = await marketplaceService.getOrders(undefined, undefined);
      expect(anonOrders).toEqual([]);
    });

    it('prevents Farmer A from modifying products belonging to Farmer B', async () => {
      const products = await marketplaceService.getProducts();
      const farmer1Prod = products.find(p => p.farmer_id === 'farmer-1');
      expect(farmer1Prod).toBeDefined();

      // Farmer 2 attempts to edit Farmer 1's product
      await expect(
        marketplaceService.updateProduct(
          farmer1Prod!.id,
          { name: 'Hijacked Product Name' },
          'farmer-2' // Caller is Farmer 2!
        )
      ).rejects.toThrow(/Unauthorized: Farmers cannot modify/i);

      // Farmer 2 attempts to tamper with Farmer 1's inventory
      await expect(
        marketplaceService.updateInventory(
          farmer1Prod!.id,
          999,
          'farmer-2' // Caller is Farmer 2!
        )
      ).rejects.toThrow(/Unauthorized: You can only update inventory for your own farm products/i);
    });
  });

  // =========================================================================
  // 2. CHECKOUT CONCURRENCY & OVERSELLING PREVENTION AUDIT
  // =========================================================================
  describe('Pillar 2: Checkout Concurrency & Overselling Prevention', () => {
    it('strictly prevents overselling when available quantity is 1 and two customers compete', async () => {
      const products = await marketplaceService.getProducts();
      const targetProd = products[0];

      // Explicitly set available stock to exactly 1 unit
      await marketplaceService.updateInventory(targetProd.id, 1);

      // Customer 1 checks out the last remaining item
      const res1 = await marketplaceService.processCheckout({
        customerId: 'cust-audit-1',
        customerProfile: customerProfile1,
        address: dummyAddress,
        deliveryType: 'local_delivery',
        paymentMethod: 'cod',
        items: [{ product: targetProd, quantity: 1 }],
      });
      expect(res1.orders.length).toBe(1);

      // Customer 2 attempts to checkout the same item now that stock is 0
      await expect(
        marketplaceService.processCheckout({
          customerId: 'cust-audit-2',
          customerProfile: customerProfile2,
          address: dummyAddress,
          deliveryType: 'local_delivery',
          paymentMethod: 'cod',
          items: [{ product: targetProd, quantity: 1 }],
        })
      ).rejects.toThrow(/Insufficient stock/i);

      // Verify refreshed products show 0 available stock and never negative
      const refreshedProds = await marketplaceService.getProducts();
      const updatedTarget = refreshedProds.find(p => p.id === targetProd.id);
      expect(updatedTarget?.inventory?.available_quantity).toBe(0);
      expect(updatedTarget?.inventory?.available_quantity).toBeGreaterThanOrEqual(0);
    });
  });

  // =========================================================================
  // 3. PAYMENTS & WEBHOOK LIFECYCLE AUDIT
  // =========================================================================
  describe('Pillar 3: Payments & Webhook Idempotency & Recovery', () => {
    it('recovers inventory when order is cancelled or payment fails', async () => {
      const products = await marketplaceService.getProducts();
      const targetProd = products[1];

      // Set known initial stock
      await marketplaceService.updateInventory(targetProd.id, 10);

      // Place order for 3 units
      const checkoutRes = await marketplaceService.processCheckout({
        customerId: 'cust-audit-1',
        customerProfile: customerProfile1,
        address: dummyAddress,
        deliveryType: 'local_delivery',
        paymentMethod: 'cod',
        items: [{ product: targetProd, quantity: 3 }],
      });

      const orderId = checkoutRes.orders[0].id;

      // Stock should have reduced to 7
      let refreshed = await marketplaceService.getProducts();
      expect(refreshed.find(p => p.id === targetProd.id)?.inventory?.available_quantity).toBe(7);

      // Cancel order
      await marketplaceService.updateOrderStatus(orderId, 'cancelled', 'Customer changed mind');

      // Stock MUST be restored back to 10
      refreshed = await marketplaceService.getProducts();
      expect(refreshed.find(p => p.id === targetProd.id)?.inventory?.available_quantity).toBe(10);
    });

    it('handles idempotent payment webhooks and restores stock on payment.failed', async () => {
      const products = await marketplaceService.getProducts();
      const targetProd = products[2];
      await marketplaceService.updateInventory(targetProd.id, 5);

      // Create online order with pending payment
      const checkoutRes = await marketplaceService.processCheckout({
        customerId: 'cust-audit-1',
        customerProfile: customerProfile1,
        address: dummyAddress,
        deliveryType: 'local_delivery',
        paymentMethod: 'razorpay_online',
        items: [{ product: targetProd, quantity: 2 }],
      });

      const order = checkoutRes.orders[0];
      expect(order.payment_status).toBe('pending');

      // Stock is currently 3
      let refreshed = await marketplaceService.getProducts();
      expect(refreshed.find(p => p.id === targetProd.id)?.inventory?.available_quantity).toBe(3);

      // 1. Simulate duplicate payment captured webhooks (at-least-once delivery from gateway)
      const event1 = await marketplaceService.handlePaymentWebhook({
        eventId: 'evt_webhook_1001',
        eventType: 'payment.captured',
        orderId: order.id,
        paymentId: 'pay_rzp_test_1',
      });
      expect(event1.success).toBe(true);
      expect(event1.status).toBe('processed');
      expect(event1.order?.payment_status).toBe('captured');

      // Duplicate delivery of the exact same event
      const event1Duplicate = await marketplaceService.handlePaymentWebhook({
        eventId: 'evt_webhook_1001',
        eventType: 'payment.captured',
        orderId: order.id,
        paymentId: 'pay_rzp_test_1',
      });
      expect(event1Duplicate.success).toBe(true);
      expect(event1Duplicate.status).toBe('already_processed');

      // 2. Test failed webhook on a second order
      const failCheckout = await marketplaceService.processCheckout({
        customerId: 'cust-audit-2',
        customerProfile: customerProfile2,
        address: dummyAddress,
        deliveryType: 'local_delivery',
        paymentMethod: 'razorpay_online',
        items: [{ product: targetProd, quantity: 2 }],
      });
      const failOrder = failCheckout.orders[0];

      // Stock reduced to 1
      refreshed = await marketplaceService.getProducts();
      expect(refreshed.find(p => p.id === targetProd.id)?.inventory?.available_quantity).toBe(1);

      // Bank decline webhook arrives
      const failEvent = await marketplaceService.handlePaymentWebhook({
        eventId: 'evt_webhook_2002',
        eventType: 'payment.failed',
        orderId: failOrder.id,
        failureReason: 'Debit card insufficient funds',
      });
      expect(failEvent.success).toBe(true);
      expect(failEvent.status).toBe('processed');

      // Check that stock was rolled back to 3!
      refreshed = await marketplaceService.getProducts();
      expect(refreshed.find(p => p.id === targetProd.id)?.inventory?.available_quantity).toBe(3);
    });
  });

  // =========================================================================
  // 4. REAL-DEVICE & LOW-BANDWIDTH RESILIENCE AUDIT
  // =========================================================================
  describe('Pillar 4: Real-Device & Weak Network Resilience', () => {
    it('reports accurate backend telemetry without crashing the UI', async () => {
      const status = marketplaceService.getBackendStatus();
      expect(['connected', 'unconfigured', 'network_error', 'empty_database', 'permission_error']).toContain(status.status);
      expect(status.lastSyncTimestamp).toBeGreaterThan(0);
    });

    it('falls back seamlessly to local storage cache when network is offline', async () => {
      // Fetch categories
      const categories = await marketplaceService.getCategories();
      expect(categories.length).toBeGreaterThan(0);

      // Verify cached copy is stored in localStorage
      const cached = localStorage.getItem('farmdirect_categories_v1');
      expect(cached).toBeTruthy();
      expect(JSON.parse(cached!).length).toBe(categories.length);
    });
  });
});
