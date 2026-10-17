import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Store, Truck, MapPin } from 'lucide-react';
import { orderService } from './order.service';
import { Order, STATUS_STEPS } from './order.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './orders.css';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const item = await orderService.getOrderById(id);
        setOrder(item);
      } catch (err) {
        console.error('Failed to load tracking order', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setIsCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.id);
      setOrder(updated);
    } catch {
      alert('Unable to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Loading live tracking status..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container py-12 text-center">
        <h2 className="heading-2 mb-2">Order Not Found</h2>
        <p className="text-muted mb-4">We could not find the specified order.</p>
        <Link to="/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="page-container orders-page">
      <div className="orders-header">
        <button className="checkout-header-back" onClick={() => navigate('/orders')}>
          <ArrowLeft size={16} /> Back to My Orders
        </button>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h1 className="orders-title">Tracking Order #{order.order_number}</h1>
            <p className="orders-subtitle">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`order-status-badge ${order.status}`}>{order.status.replace(/_/g, ' ')}</span>
        </div>
      </div>

      <div className="order-card">
        <h2 className="heading-3 mb-4">Live Status</h2>
        <div className="tracking-stepper">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIdx > idx || order.status === 'delivered';
            const isActive = currentStepIdx === idx;

            return (
              <div
                key={step.key}
                className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="stepper-bullet">
                  {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <div className="stepper-content">
                  <div className="stepper-title">{step.label}</div>
                  <div className="stepper-desc">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {order.status === 'pending_confirmation' && (
          <div className="mt-4 pt-4 border-t border-color-border flex justify-end">
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelling}
              onClick={handleCancel}
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>

      <div className="order-card">
        <h2 className="heading-3 mb-3">Order Details</h2>
        <div className="order-producer-info">
          <Store size={18} color="var(--color-primary)" />
          <span>
            Farm: <strong>{order.farmer?.farm_name}</strong> • Phone: {order.farmer?.phone || order.farmer?.user?.phone || '9822012345'}
          </span>
        </div>

        <div className="order-producer-info">
          <MapPin size={18} color="var(--color-primary)" />
          <span>
            Delivery Address: {order.delivery_address_snapshot.address_line_1},{' '}
            {order.delivery_address_snapshot.city} ({order.delivery_address_snapshot.pincode})
          </span>
        </div>

        <div className="order-items-box mt-3">
          {order.items?.map((item) => (
            <div key={item.id} className="order-item-line">
              <span>
                {item.product_name} × {item.quantity} {item.unit}
              </span>
              <strong>{formatPaise(item.total_price_paise)}</strong>
            </div>
          ))}
        </div>

        <div className="order-card-footer">
          <span>Total Amount</span>
          <span className="order-total-price">{formatPaise(order.total_amount_paise)}</span>
        </div>
      </div>
    </div>
  );
};
