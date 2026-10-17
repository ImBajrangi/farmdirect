import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, Store, MapPin } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { marketplaceService } from '../services/marketplaceService';
import { Order } from '../types';
import { formatPaise } from '../lib/formatting/currency';
import { useTranslation } from '../hooks/useTranslation';

export const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      try {
        const list = await marketplaceService.getOrders(user?.id, 'customer');
        setOrders(list);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserOrders();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-stone-500">
          Track active deliveries and review previous fresh harvests
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 rounded-3xl bg-earth-200 animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isRejected = order.status === 'rejected' || order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-earth-200 shadow-soft space-y-3 hover:border-agri-400 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-earth-100">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase">ORDER NUMBER</span>
                    <h3 className="font-mono font-black text-sm text-stone-900">{order.order_number}</h3>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRejected
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-stone-900">
                      {formatPaise(order.total_amount_paise, language)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="text-stone-600">
                    <span className="text-stone-400">Farm: </span>
                    <strong className="text-stone-800">{order.farmer?.farm_name}</strong>
                    <span className="text-stone-500"> • {order.items?.length} items</span>
                  </div>

                  <Link
                    to={`/order-tracking/${order.id}`}
                    className="inline-flex items-center gap-1 text-agri-700 hover:text-agri-800 font-bold text-xs"
                  >
                    <span>View Tracking Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-earth-200 max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-earth-100 text-stone-400 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-stone-800 text-base">No Orders Yet</h3>
          <p className="text-xs text-stone-500">
            Browse our verified farmer listings to place your first direct farmgate order.
          </p>
          <Link
            to="/marketplace"
            className="inline-block px-5 py-2.5 bg-agri-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Explore Marketplace
          </Link>
        </div>
      )}
    </div>
  );
};
