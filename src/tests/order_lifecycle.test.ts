import { describe, it, expect } from 'vitest';
import { marketplaceService } from '../services/marketplaceService';
import { Address } from '../types';

describe('Order Lifecycle State Transitions', () => {
  const dummyAddress: Address = {
    id: 'addr-cycle',
    user_id: 'user-cycle',
    label: 'Home',
    recipient_name: 'Amit Joshi',
    phone: '9822345678',
    address_line_1: 'Baner Road',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    is_default: true,
    created_at: new Date().toISOString(),
  };

  it('progresses through valid status transitions', async () => {
    const products = await marketplaceService.getProducts();
    const prod = products[0];

    const checkoutResult = await marketplaceService.processCheckout({
      customerId: 'user-cycle',
      customerProfile: {
        id: 'user-cycle',
        full_name: 'Amit Joshi',
        role: 'customer',
        preferred_language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      address: dummyAddress,
      deliveryType: 'local_delivery',
      paymentMethod: 'cod',
      items: [{ product: prod, quantity: 1 }],
    });

    const orderId = checkoutResult.orders[0].id;

    // 1. Initial State: pending_confirmation
    let order = await marketplaceService.getOrderById(orderId);
    expect(order?.status).toBe('pending_confirmation');

    // 2. Farmer Confirms Order
    order = await marketplaceService.updateOrderStatus(orderId, 'confirmed');
    expect(order.status).toBe('confirmed');
    expect(order.confirmed_at).toBeTruthy();

    // 3. Farmer begins preparation
    order = await marketplaceService.updateOrderStatus(orderId, 'preparing');
    expect(order.status).toBe('preparing');
    expect(order.prepared_at).toBeTruthy();

    // 4. Dispatched
    order = await marketplaceService.updateOrderStatus(orderId, 'out_for_delivery');
    expect(order.status).toBe('out_for_delivery');
    expect(order.dispatched_at).toBeTruthy();

    // 5. Delivered
    order = await marketplaceService.updateOrderStatus(orderId, 'delivered');
    expect(order.status).toBe('delivered');
    expect(order.delivered_at).toBeTruthy();
    // COD payment status becomes captured upon delivery
    expect(order.payment_status).toBe('captured');
  });

  it('records farmer rejection reason', async () => {
    const products = await marketplaceService.getProducts();
    const checkoutResult = await marketplaceService.processCheckout({
      customerId: 'user-reject',
      customerProfile: {
        id: 'user-reject',
        full_name: 'Kavita Roy',
        role: 'customer',
        preferred_language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      address: dummyAddress,
      deliveryType: 'pickup',
      paymentMethod: 'cod',
      items: [{ product: products[0], quantity: 1 }],
    });

    const orderId = checkoutResult.orders[0].id;
    const rejectedOrder = await marketplaceService.updateOrderStatus(
      orderId,
      'rejected',
      'Sudden hail damaged current harvest batch'
    );

    expect(rejectedOrder.status).toBe('rejected');
    expect(rejectedOrder.rejection_reason).toContain('hail damaged');
  });
});

describe('Admin Governance & Farmer Verification', () => {
  it('updates farmer verification status with audit integrity', async () => {
    const farmers = await marketplaceService.getFarmers();
    const targetFarmer = farmers[0];

    await marketplaceService.updateFarmerVerification(targetFarmer.id, 'suspended');
    let updated = await marketplaceService.getFarmerById(targetFarmer.id);
    expect(updated?.verification_status).toBe('suspended');

    await marketplaceService.updateFarmerVerification(targetFarmer.id, 'verified');
    updated = await marketplaceService.getFarmerById(targetFarmer.id);
    expect(updated?.verification_status).toBe('verified');
  });
});
