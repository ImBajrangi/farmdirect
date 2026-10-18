import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Clock, ArrowRight, Sprout, ShoppingBag, Sunrise, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { orderService } from './order.service';
import { Order } from './order.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './orders.css';

export const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();
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
          Real-time farmgate harvest tracking and dispatch history
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading your orders..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-card">
          <div className="orders-empty-icon-wrap">
            <Sprout size={22} />
          </div>

          <h2 className="orders-empty-title">Your Harvest Basket is Clear</h2>
          <p className="orders-empty-desc">
            No active or past harvest orders yet. When you order from Patil Agro Orchards and local family farms, morning harvest progress, grading, and live delivery routes will appear right here.
          </p>

          {itemCount > 0 && (
            <div className="orders-cart-bridge">
              <div className="cart-bridge-info">
                <ShoppingBag size={15} className="text-emerald-700" />
                <span>You have <strong>{itemCount} {itemCount === 1 ? 'crop' : 'crops'}</strong> in your cart ready for morning harvest</span>
              </div>
              <Link to="/cart" className="cart-bridge-btn">
                <span>View Cart</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          <div className="orders-empty-actions">
            <Link to="/products" className="orders-explore-btn">
              <Sprout size={15} />
              <span>Explore Today's Harvests</span>
            </Link>
          </div>

          {/* Minimal Relatable FarmDirect Lifecycle */}
          <div className="orders-farmgate-pipeline">
            <div className="pipeline-item">
              <span className="pipeline-icon-wrap">
                <Sunrise size={14} />
              </span>
              <div className="pipeline-text">
                <strong>Sunrise Harvest</strong>
                <span>Cut fresh to order</span>
              </div>
            </div>
            <div className="pipeline-separator" />
            <div className="pipeline-item">
              <span className="pipeline-icon-wrap">
                <ShieldCheck size={14} />
              </span>
              <div className="pipeline-text">
                <strong>PGS Natural Tested</strong>
                <span>Graded at farm gate</span>
              </div>
            </div>
            <div className="pipeline-separator" />
            <div className="pipeline-item">
              <span className="pipeline-icon-wrap">
                <Truck size={14} />
              </span>
              <div className="pipeline-text">
                <strong>Direct Delivery</strong>
                <span>Doorstep in hours</span>
              </div>
            </div>
          </div>
        </div>
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
