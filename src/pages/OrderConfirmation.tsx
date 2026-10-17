import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, MapPin, Truck, Store } from 'lucide-react';
import { marketplaceService } from '../services/marketplaceService';
import { Order } from '../types';
import { formatPaise } from '../lib/formatting/currency';
import { useTranslation } from '../hooks/useTranslation';

export const OrderConfirmation: React.FC = () => {
  const { t, language } = useTranslation();
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
        const allOrders = await marketplaceService.getOrders(undefined, 'admin');
        const matched = allOrders.filter(o => o.checkout_group_id === groupId);
        setOrders(matched);
      } catch (err) {
        console.error('Failed to load confirmed orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [groupId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-24 sm:pb-12">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-in zoom-in-75">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t.checkout.orderPlacedSuccess}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          {t.checkout.orderPlacedSubtitle}
        </p>
      </div>

      {/* Orders List Created in this Checkout */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider">
          Created Sub-Orders ({orders.length})
        </h2>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-5 border border-earth-200 shadow-soft space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-earth-100">
              <div>
                <span className="text-[11px] font-bold text-stone-400 block">ORDER ID</span>
                <span className="font-mono font-black text-sm text-stone-900">{order.order_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Pending Farmer Confirmation
                </span>
                <span className="text-xs font-bold text-stone-700">
                  {formatPaise(order.total_amount_paise, language)}
                </span>
              </div>
            </div>

            {/* Farm Producer Info */}
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Store className="w-4 h-4 text-agri-600" />
              <span>Farm Producer: <strong>{order.farmer?.farm_name || 'Local Farm'}</strong></span>
            </div>

            {/* Items */}
            <ul className="text-xs text-stone-600 space-y-1 bg-earth-50 p-3 rounded-2xl border border-earth-100">
              {order.items?.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.product_name} × {item.quantity} {item.unit}</span>
                  <span className="font-bold text-stone-800">{formatPaise(item.total_price_paise, language)}</span>
                </li>
              ))}
            </ul>

            {/* Delivery address snapshot */}
            <div className="text-[11px] text-stone-500 flex items-start gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                Delivering to: {order.delivery_address_snapshot.recipient_name}, {order.delivery_address_snapshot.address_line_1}, {order.delivery_address_snapshot.city}
              </span>
            </div>

            <div className="pt-2">
              <Link
                to={`/order-tracking/${order.id}`}
                className="w-full py-2.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Track Live Progress</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          to="/marketplace"
          className="px-6 py-3 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="px-6 py-3 bg-white border border-earth-300 text-stone-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-earth-50 transition"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};
