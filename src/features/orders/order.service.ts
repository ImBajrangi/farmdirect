import { marketplaceService } from '../../services/marketplaceService';
import { Order, OrderStatus } from '../../types';

export const orderService = {
  async getOrders(userId?: string, role: 'customer' | 'farmer' | 'admin' = 'customer'): Promise<Order[]> {
    return marketplaceService.getOrders(userId, role);
  },

  async getOrderById(id: string): Promise<Order | null> {
    return marketplaceService.getOrderById(id);
  },

  async getOrdersByGroupId(groupId: string): Promise<Order[]> {
    const all = await marketplaceService.getOrders(undefined, 'admin');
    return all.filter((o) => o.checkout_group_id === groupId);
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    reason?: string
  ): Promise<Order> {
    return marketplaceService.updateOrderStatus(orderId, status, reason);
  },

  async cancelOrder(orderId: string, reason = 'Customer cancelled'): Promise<Order> {
    return marketplaceService.updateOrderStatus(orderId, 'cancelled', reason);
  },
};
