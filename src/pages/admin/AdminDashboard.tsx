import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  MapPin, 
  FileText 
} from 'lucide-react';
import { marketplaceService } from '../../services/marketplaceService';
import { FarmerProfile, Order, Product, ServiceArea } from '../../types';
import { formatPaise } from '../../lib/formatting/currency';

export const AdminDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'areas'>('verifications');

  const loadData = async () => {
    try {
      const [farmList, orderList, prodList, saList] = await Promise.all([
        marketplaceService.getFarmers(),
        marketplaceService.getOrders(undefined, 'admin'),
        marketplaceService.getProducts(),
        marketplaceService.getServiceAreas(),
      ]);
      setFarmers(farmList);
      setOrders(orderList);
      setProducts(prodList);
      setServiceAreas(saList);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateVerification = async (farmerId: string, status: 'verified' | 'rejected' | 'suspended') => {
    await marketplaceService.updateFarmerVerification(farmerId, status);
    await loadData();
  };

  const totalGMVPaise = orders.reduce((sum, o) => sum + o.total_amount_paise, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-300" />
            <h1 className="text-xl sm:text-2xl font-black">Marketplace Governance & Admin Desk</h1>
          </div>
          <p className="text-xs text-purple-200">
            Field KYC audits, platform service rates, and multi-farmer order supervision
          </p>
        </div>

        <div className="bg-purple-950/70 border border-purple-700/60 px-3.5 py-1.5 rounded-2xl text-xs font-bold">
          Role: Platform Super Admin
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Gross Marketplace GMV</span>
          <div className="text-2xl font-black text-purple-900">{formatPaise(totalGMVPaise)}</div>
          <span className="text-[11px] text-stone-400">Total processed</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Orders Count</span>
          <div className="text-2xl font-black text-stone-900">{orders.length}</div>
          <span className="text-[11px] text-stone-400">Sub-orders logged</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Registered Farmers</span>
          <div className="text-2xl font-black text-agri-700">{farmers.length}</div>
          <span className="text-[11px] text-stone-400">Producers in database</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-earth-200 shadow-soft">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Catalog Listings</span>
          <div className="text-2xl font-black text-blue-700">{products.length}</div>
          <span className="text-[11px] text-stone-400">Published produce</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-earth-200 pb-2">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'verifications'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-earth-100'
          }`}
        >
          Farmer KYC Verifications ({farmers.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'orders'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-earth-100'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('areas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'areas'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-earth-100'
          }`}
        >
          Service Areas & Fees ({serviceAreas.length})
        </button>
      </div>

      {/* Tab 1: Farmer Verifications */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-4">
          <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
            Farmer Identity & Land 7/12 Verification Queue
          </h2>

          <div className="divide-y divide-earth-100">
            {farmers.map((farmer) => {
              const isVerified = farmer.verification_status === 'verified';

              return (
                <div key={farmer.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-stone-900">{farmer.farm_name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {farmer.verification_status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {farmer.village}, {farmer.district} • {farmer.land_area_acres} Acres
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Document: {farmer.id_proof_type?.toUpperCase()} (Ref: {farmer.id_proof_url || 'Verified in person'})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isVerified ? (
                      <button
                        onClick={() => handleUpdateVerification(farmer.id, 'verified')}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
                      >
                        Approve & Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateVerification(farmer.id, 'suspended')}
                        className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateVerification(farmer.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-4">
          <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
            All Marketplace Orders ({orders.length})
          </h2>

          <div className="divide-y divide-earth-100 text-xs">
            {orders.map((o) => (
              <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{o.order_number}</span>
                    <span className="bg-earth-100 text-stone-700 px-2 py-0.5 rounded capitalize font-semibold">
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-stone-500 mt-0.5">
                    Farmer: <strong>{o.farmer?.farm_name}</strong> → Buyer: {o.delivery_address_snapshot?.recipient_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-stone-900">{formatPaise(o.total_amount_paise)}</span>
                  <span className="block text-[10px] text-stone-400 capitalize">{o.payment_method} ({o.payment_status})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Service Areas */}
      {activeTab === 'areas' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-4">
          <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
            Active Logistics Service Areas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceAreas.map((sa) => (
              <div key={sa.id} className="p-4 rounded-2xl border border-earth-200 bg-earth-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">{sa.name}</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-stone-500">{sa.name_hi}</p>
                <div className="pt-2 border-t border-earth-200 space-y-1 text-stone-700">
                  <p>Standard Delivery Fee: <strong>{formatPaise(sa.delivery_fee_paise)}</strong></p>
                  <p>Free Delivery Above: <strong>{formatPaise(sa.free_delivery_threshold_paise)}</strong></p>
                  <p>Covered Pincodes: {sa.pincodes.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
