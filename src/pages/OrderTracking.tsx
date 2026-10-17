import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  MessageCircle, 
  XCircle,
  AlertCircle 
} from 'lucide-react';
import { marketplaceService } from '../services/marketplaceService';
import { Order, OrderStatus } from '../types';
import { formatPaise } from '../lib/formatting/currency';
import { useTranslation } from '../hooks/useTranslation';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending_confirmation', label: 'Order Placed', desc: 'Awaiting farmer schedule review' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Accepted by farmer' },
  { key: 'preparing', label: 'Fresh Packing', desc: 'Harvesting & sorting at farm shed' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Dispatched to your address' },
  { key: 'delivered', label: 'Delivered', desc: 'Fresh produce received' },
];

export const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const item = await marketplaceService.getOrderById(id);
        setOrder(item);
      } catch (err) {
        console.error('Failed to load tracking order', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setIsCancelling(true);
    try {
      const updated = await marketplaceService.updateOrderStatus(order.id, 'cancelled', 'Customer cancelled');
      setOrder(updated);
    } catch (err) {
      alert('Unable to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        <div className="h-40 bg-earth-200 rounded-3xl animate-pulse" />
        <div className="h-64 bg-earth-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-lg font-bold text-stone-900">Order Not Found</h2>
        <Link to="/orders" className="text-xs text-agri-700 font-bold hover:underline">
          View My Orders
        </Link>
      </div>
    );
  }

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending_confirmation': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready_for_pickup':
      case 'out_for_delivery': return 3;
      case 'delivered':
      case 'completed': return 4;
      default: return -1;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isTerminalNegative = order.status === 'rejected' || order.status === 'cancelled';

  const whatsappMessage = encodeURIComponent(
    `Hello ${order.farmer?.farm_name || 'Farmer'}, I am inquiring regarding my FarmDirect Order #${order.order_number}.`
  );
  const whatsappUrl = `https://wa.me/91${order.farmer?.user?.phone || '9822012345'}?text=${whatsappMessage}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-earth-100">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400">Order Reference</span>
            <h1 className="font-mono font-black text-base sm:text-lg text-stone-900">{order.order_number}</h1>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500 block">Total Amount</span>
            <span className="font-extrabold text-sm sm:text-base text-agri-900">
              {formatPaise(order.total_amount_paise, language)} ({order.payment_method === 'cod' ? 'COD' : 'Paid Online'})
            </span>
          </div>
        </div>

        {/* Farm & Contact */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
          <div>
            <span className="text-stone-500">Producer: </span>
            <strong className="text-stone-800">{order.farmer?.farm_name}</strong>
            <span className="text-stone-400"> ({order.farmer?.village})</span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat with Farmer</span>
          </a>
        </div>
      </div>

      {/* Tracking Progression */}
      <div className="bg-white rounded-3xl p-6 border border-earth-200 shadow-soft space-y-6">
        <h2 className="font-black text-sm uppercase tracking-wider text-stone-800">
          Order Status Journey
        </h2>

        {isTerminalNegative ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-900 text-xs">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">
                Order {order.status === 'rejected' ? 'Declined by Farmer' : 'Cancelled'}
              </h3>
              <p className="mt-1 text-red-700">
                Reason: {order.rejection_reason || order.cancellation_reason || 'Status updated.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-earth-200">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPast
                        ? 'bg-agri-600 text-white ring-4 ring-agri-100'
                        : 'bg-earth-200 text-stone-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-agri-800 font-extrabold' : isPast ? 'text-stone-900' : 'text-stone-400'}`}>
                      {step.label} {isCurrent && <span className="text-[10px] bg-agri-100 text-agri-800 px-1.5 py-0.2 rounded ml-1">Current</span>}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Option for Customer */}
        {order.status === 'pending_confirmation' && (
          <div className="pt-4 border-t border-earth-100">
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Orders can be cancelled free of charge prior to farmer packaging confirmation.
            </p>
          </div>
        )}
      </div>

      {/* Item Summary */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500">Ordered Produce</h3>
        <div className="divide-y divide-earth-100 text-xs">
          {order.items?.map((item) => (
            <div key={item.id} className="py-2.5 flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-800 block">{item.product_name}</span>
                <span className="text-[11px] text-stone-500">{item.quantity} {item.unit} @ {formatPaise(item.unit_price_paise, language)}</span>
              </div>
              <span className="font-bold text-stone-900">{formatPaise(item.total_price_paise, language)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
