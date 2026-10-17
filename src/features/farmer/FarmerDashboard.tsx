import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Edit2,
  Package,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { farmerService } from './farmer.service';
import { Order, Product, OrderStatus } from './farmer.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './farmer.css';

export const FarmerDashboard: React.FC = () => {
  const { farmerProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const farmId = farmerProfile?.id || 'farmer-1';

  const loadData = async () => {
    try {
      const [orderList, productList] = await Promise.all([
        farmerService.getFarmerOrders(farmId),
        farmerService.getFarmerProducts(farmId),
      ]);
      setOrders(orderList);
      setProducts(productList);
    } catch (err) {
      console.error('Failed to load farmer data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [farmId]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    reason?: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      await farmerService.updateOrderStatus(orderId, status, reason);
      await loadData();
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleUpdateStock = async (productId: string, currentStock: number) => {
    const input = prompt('Enter new available stock quantity:', String(currentStock));
    if (input === null) return;
    const newQty = parseFloat(input);
    if (!isNaN(newQty) && newQty >= 0) {
      await farmerService.updateStock(productId, newQty);
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Loading farm operations dashboard..." />
      </div>
    );
  }

  // Metrics
  const pendingOrders = orders.filter((o) => o.status === 'pending_confirmation');
  const inPrepOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing');
  const totalRevenuePaise = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'rejected')
    .reduce((sum, o) => sum + o.subtotal_paise, 0);

  return (
    <div className="page-container farmer-dashboard">
      {/* Hero Banner */}
      <div className="farmer-hero-card">
        <div>
          <h1 className="farmer-hero-title">
            <Tractor size={28} /> {farmerProfile?.farm_name || 'Shree Ganesh Agro Farm'}
          </h1>
          <p className="farmer-hero-subtitle">
            {farmerProfile?.village || 'Dindori'}, {farmerProfile?.district || 'Nashik'} (
            {farmerProfile?.land_area_acres || 12} Acres)
          </p>
        </div>

        <div>
          <span className="farmer-verification-tag">
            <ShieldCheck size={16} /> 7/12 Land Record Verified
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="farmer-stats-grid">
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">New Orders</div>
          <div className="farmer-stat-val">{pendingOrders.length}</div>
        </div>
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">In Packing</div>
          <div className="farmer-stat-val">{inPrepOrders.length}</div>
        </div>
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">Active Produce</div>
          <div className="farmer-stat-val">{products.length}</div>
        </div>
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">Net Sales</div>
          <div className="farmer-stat-val revenue">{formatPaise(totalRevenuePaise)}</div>
        </div>
      </div>

      {/* Orders to Fulfill */}
      <section className="mb-8">
        <div className="section-actions-row">
          <h2 className="heading-3">Orders for Harvest & Dispatch ({orders.length})</h2>
        </div>

        {orders.length === 0 ? (
          <p className="text-muted">No orders received yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="farmer-order-item">
              <div className="farmer-order-item-header">
                <div>
                  <strong>Order #{order.order_number}</strong> •{' '}
                  <span className="text-muted">{new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
                <span className={`order-status-badge ${order.status}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="order-items-box">
                {order.items?.map((item) => (
                  <div key={item.id} className="order-item-line">
                    <span>
                      {item.product_name} × {item.quantity} {item.unit}
                    </span>
                    <strong>{formatPaise(item.total_price_paise)}</strong>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center flex-wrap gap-2 text-sm text-muted">
                <span>
                  Delivery: <strong>{order.delivery_type === 'pickup' ? 'Farm Pickup' : 'Direct Dispatch'}</strong>
                </span>
                <span>
                  Customer: {order.customer?.full_name || 'Customer'} ({order.delivery_address_snapshot.phone})
                </span>
              </div>

              <div className="farmer-order-actions">
                {order.status === 'pending_confirmation' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={updatingOrderId === order.id}
                      onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                    >
                      <CheckCircle2 size={14} /> Accept Order
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={updatingOrderId === order.id}
                      onClick={() => handleUpdateOrderStatus(order.id, 'rejected', 'Produce out of stock')}
                    >
                      <XCircle size={14} /> Reject
                    </Button>
                  </>
                )}

                {order.status === 'confirmed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={updatingOrderId === order.id}
                    onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                  >
                    <Package size={14} /> Mark as Fresh Packing
                  </Button>
                )}

                {order.status === 'preparing' && (
                  <Button
                    variant="accent"
                    size="sm"
                    isLoading={updatingOrderId === order.id}
                    onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                  >
                    <Truck size={14} /> Hand Over for Delivery
                  </Button>
                )}

                {order.status === 'out_for_delivery' && (
                  <Button
                    variant="outline"
                    size="sm"
                    isLoading={updatingOrderId === order.id}
                    onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                  >
                    <CheckCircle2 size={14} /> Mark Delivered
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Produce Inventory Management */}
      <section>
        <div className="section-actions-row">
          <h2 className="heading-3">My Listed Crops ({products.length})</h2>
          <Link to="/farmer/products/new">
            <Button variant="primary" size="sm">
              <Plus size={16} /> Add Harvest Produce
            </Button>
          </Link>
        </div>

        <div className="farmer-product-grid">
          {products.map((prod) => (
            <div key={prod.id} className="farmer-product-card">
              <img
                src={prod.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                alt={prod.name}
                className="farmer-product-thumb"
              />
              <div className="farmer-product-details">
                <div className="farmer-product-name">{prod.name}</div>
                <div className="farmer-product-price">
                  {formatPaise(prod.price_paise)} / {prod.unit}
                </div>
                <div className="farmer-product-stock">
                  Available: {prod.inventory?.available_quantity ?? 0} {prod.unit}
                </div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateStock(prod.id, prod.inventory?.available_quantity ?? 0)
                    }
                  >
                    <Edit2 size={12} /> Update Stock
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
