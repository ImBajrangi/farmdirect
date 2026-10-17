import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tractor, 
  Plus, 
  PackageCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ShieldCheck, 
  AlertTriangle,
  Edit2 
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { marketplaceService } from '../../services/marketplaceService';
import { Order, Product, OrderStatus } from '../../types';
import { formatPaise } from '../../lib/formatting/currency';
import { useTranslation } from '../../hooks/useTranslation';

export const FarmerDashboard: React.FC = () => {
  const { farmerProfile, user } = useAuth();
  const { t, language } = useTranslation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const farmId = farmerProfile?.id || 'farmer-1';

  const loadFarmerData = async () => {
    try {
      const [orderList, productList] = await Promise.all([
        marketplaceService.getOrders(farmId, 'farmer'),
        marketplaceService.getFarmerProducts(farmId),
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
    loadFarmerData();
  }, [farmId]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, reason?: string) => {
    setUpdatingOrderId(orderId);
    try {
      await marketplaceService.updateOrderStatus(orderId, status, reason);
      await loadFarmerData();
    } catch (err) {
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
      await marketplaceService.updateInventory(productId, newQty);
      await loadFarmerData();
    }
  };

  // Metrics
  const pendingOrders = orders.filter(o => o.status === 'pending_confirmation');
  const inPrepOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing');
  const totalRevenuePaise = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'rejected')
    .reduce((sum, o) => sum + o.subtotal_paise, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      {/* Top Banner & KYC Verification Status */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-3xl p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tractor className="w-6 h-6 text-amber-300" />
            <h1 className="text-xl sm:text-2xl font-black">
              {farmerProfile?.farm_name || 'Farmer Production Portal'}
            </h1>
          </div>
          <p className="text-xs text-amber-200">
            {farmerProfile?.village}, {farmerProfile?.district} ({farmerProfile?.land_area_acres} Acres)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-950/70 border border-amber-700/60 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">7/12 Land Verified</span>
          </div>
          <Link
            to="/farmer/add-product"
            className="px-4 py-2 bg-agri-600 hover:bg-agri-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.farmer.addNewProduct}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">New Orders</span>
          <div className="text-2xl font-black text-amber-600">{pendingOrders.length}</div>
          <span className="text-[11px] text-stone-400">Needs confirmation</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">In Preparation</span>
          <div className="text-2xl font-black text-blue-600">{inPrepOrders.length}</div>
          <span className="text-[11px] text-stone-400">Harvesting / packing</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Active Produce</span>
          <div className="text-2xl font-black text-agri-700">{products.length}</div>
          <span className="text-[11px] text-stone-400">Listed on marketplace</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Farm Realization</span>
          <div className="text-2xl font-black text-stone-900">{formatPaise(totalRevenuePaise, language)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Direct to bank/UPI</span>
        </div>
      </div>

      {/* Section: Incoming Orders */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-stone-900 tracking-tight">
            Incoming Orders & Packaging Hub
          </h2>
          <span className="text-xs text-stone-500">{orders.length} total orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs">
            No incoming orders yet. Orders will appear here as soon as local buyers checkout.
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-earth-100">
            {orders.map((order) => {
              const isPending = order.status === 'pending_confirmation';
              const isConfirmed = order.status === 'confirmed';
              const isPreparing = order.status === 'preparing';
              const isOut = order.status === 'out_for_delivery';
              const isDelivered = order.status === 'delivered';

              return (
                <div key={order.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-900">{order.order_number}</span>
                        <span className="text-[10px] font-bold uppercase bg-earth-200 px-2 py-0.5 rounded text-stone-700">
                          {order.delivery_type === 'pickup' ? 'Farmgate Pickup' : 'Local Delivery'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Customer: <strong>{order.delivery_address_snapshot.recipient_name}</strong> • +91 {order.delivery_address_snapshot.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-stone-900">
                        {formatPaise(order.subtotal_paise, language)}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize bg-amber-100 text-amber-900">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Order Items list */}
                  <div className="bg-earth-50 p-3 rounded-2xl border border-earth-100 text-xs text-stone-700">
                    <ul className="space-y-1">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.product_name} × <strong>{item.quantity} {item.unit}</strong></span>
                          <span className="font-semibold">{formatPaise(item.total_price_paise, language)}</span>
                        </li>
                      ))}
                    </ul>
                    {order.delivery_notes && (
                      <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded">
                        <strong>Customer note:</strong> {order.delivery_notes}
                      </div>
                    )}
                  </div>

                  {/* Farmer Status Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                          disabled={updatingOrderId === order.id}
                          className="px-3.5 py-1.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Accept & Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'rejected', 'Produce out of stock')}
                          disabled={updatingOrderId === order.id}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition"
                        >
                          Decline Order
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                        disabled={updatingOrderId === order.id}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Start Fresh Packaging
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, order.delivery_type === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery')}
                        disabled={updatingOrderId === order.id}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        {order.delivery_type === 'pickup' ? 'Mark Ready for Pickup' : 'Hand Over to Delivery Partner'}
                      </button>
                    )}

                    {(isOut || order.status === 'ready_for_pickup') && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                        disabled={updatingOrderId === order.id}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Confirm Delivery Completed
                      </button>
                    )}

                    {isDelivered && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Fulfilled</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section: Live Inventory Management */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-stone-900 tracking-tight">
            Live Produce & Stock Management
          </h2>
          <Link
            to="/farmer/add-product"
            className="text-xs font-bold text-agri-700 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Item</span>
          </Link>
        </div>

        <div className="divide-y divide-earth-100">
          {products.map((p) => {
            const available = p.inventory?.available_quantity ?? 0;
            const isLowStock = available <= (p.inventory?.low_stock_threshold || 5);

            return (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-earth-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{p.name}</h4>
                    <span className="text-[11px] text-stone-500">
                      {formatPaise(p.price_paise, language)} / {p.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-xs font-extrabold block ${isLowStock ? 'text-amber-700' : 'text-stone-900'}`}>
                      {available} {p.unit}
                    </span>
                    {isLowStock && <span className="text-[10px] text-amber-600 block">Low Stock</span>}
                  </div>

                  <button
                    onClick={() => handleUpdateStock(p.id, available)}
                    className="p-2 rounded-xl bg-earth-100 hover:bg-earth-200 text-stone-700 transition"
                    title="Quick Edit Stock"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
