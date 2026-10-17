import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Store, Truck } from 'lucide-react';
import { orderService } from './order.service';
import { Order } from './order.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './orders.css';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('groupId');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!groupId) {
        setLoading(false);
        return;
      }
      try {
        const matched = await orderService.getOrdersByGroupId(groupId);
        setOrders(matched);
      } catch (err) {
        console.error('Failed to load confirmed orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [groupId]);

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Retrieving order confirmations..." />
      </div>
    );
  }

  return (
    <div className="page-container orders-page">
      <div className="confirmation-hero">
        <div className="confirmation-icon-wrap">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="confirmation-title">Order Placed Successfully!</h1>
        <p className="confirmation-desc">
          Thank you for supporting local farmers. Your harvest order has been routed to each grower for immediate farm packing.
        </p>
      </div>

      <div className="orders-section">
        <h2 className="heading-3 mb-4">Farm Sub-Orders ({orders.length})</h2>

        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <span className="order-number-label">Order Number</span>
                <span className="order-number-val">{order.order_number}</span>
              </div>
              <div className="order-badges-wrap">
                <span className="order-status-badge pending">Pending Farmer Confirmation</span>
                <span className="order-total-price">{formatPaise(order.total_amount_paise)}</span>
              </div>
            </div>

            <div className="order-producer-info">
              <Store size={16} color="var(--color-primary)" />
              <span>
                Producer: <strong>{order.farmer?.farm_name || 'Local Farm'}</strong> ({order.farmer?.district || 'Nashik'})
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
                <Truck size={14} style={{ display: 'inline', marginRight: 4 }} />
                {order.delivery_type === 'pickup' ? 'Farm Pickup' : 'Local Delivery (24 hrs)'}
              </span>
              <Link to={`/orders/tracking/${order.id}`}>
                <Button variant="outline" size="sm">
                  Track Delivery <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
