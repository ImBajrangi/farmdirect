import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Store, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { orderService } from './order.service';
import { Order } from './order.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import './orders.css';

export const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const list = await orderService.getOrders(user?.id, 'customer');
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  return (
    <div className="page-container orders-page">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">
          Track active deliveries and review previous farm-fresh orders
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading your orders..." />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No orders yet"
          description="You haven't ordered from any local farms yet. Explore today's freshly harvested produce!"
          actionLabel="Browse Fresh Produce"
          onAction={() => window.location.assign('/products')}
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-number-label">Order</span>
                  <span className="order-number-val">{order.order_number}</span>
                </div>
                <div className="order-badges-wrap">
                  <span className={`order-status-badge ${order.status}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="order-total-price">
                    {formatPaise(order.total_amount_paise)}
                  </span>
                </div>
              </div>

              <div className="order-producer-info">
                <Store size={16} color="var(--color-primary)" />
                <span>
                  Producer: <strong>{order.farmer?.farm_name || 'Local Farm'}</strong>
                </span>
                <span className="text-caption ml-auto">
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="order-items-box">
                {order.items?.map((item) => (
                  <div key={item.id} className="order-item-line">
                    <span>
                      {item.product_name} <span className="order-item-qty">× {item.quantity} {item.unit}</span>
                    </span>
                    <strong>{formatPaise(item.total_price_paise)}</strong>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span className="text-caption">
                  {order.delivery_type === 'pickup' ? 'Farm Pickup' : 'Local Delivery'}
                </span>
                <Link to={`/orders/tracking/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
