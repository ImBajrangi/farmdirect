import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  ShoppingBag,
  IndianRupee,
  MapPin,
} from 'lucide-react';
import { adminService } from './admin.service';
import { FarmerProfile, Order, Product, ServiceArea, FarmerVerificationStatus } from './admin.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './admin.css';

export const AdminDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'areas'>('verifications');

  const loadData = async () => {
    try {
      const data = await adminService.getDashboardData();
      setFarmers(data.farmers);
      setOrders(data.orders);
      setProducts(data.products);
      setServiceAreas(data.serviceAreas);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateVerification = async (
    farmerId: string,
    status: FarmerVerificationStatus
  ) => {
    await adminService.updateFarmerVerification(farmerId, status);
    await loadData();
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Loading governance desk data..." />
      </div>
    );
  }

  const totalGMVPaise = orders.reduce((sum, o) => sum + o.total_amount_paise, 0);

  return (
    <div className="page-container admin-dashboard">
      <div className="admin-hero-card">
        <div>
          <h1 className="admin-hero-title">
            <ShieldCheck size={28} /> Marketplace Governance & Admin
          </h1>
          <p className="text-sm text-white/80">
            Field KYC audits, platform operations, and farmer verification
          </p>
        </div>
        <div className="admin-hero-badge">Role: Super Admin</div>
      </div>

      {/* Metrics */}
      <div className="farmer-stats-grid">
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">Gross GMV</div>
          <div className="farmer-stat-val revenue">{formatPaise(totalGMVPaise)}</div>
        </div>
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">Orders</div>
          <div className="farmer-stat-val">{orders.length}</div>
        </div>
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">Producers</div>
          <div className="farmer-stat-val">{farmers.length}</div>
        </div>
        <div className="farmer-stat-card">
          <div className="farmer-stat-label">Listed Crops</div>
          <div className="farmer-stat-val">{products.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-row">
        <button
          className={`admin-tab-btn ${activeTab === 'verifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('verifications')}
        >
          Farmer Verifications ({farmers.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'areas' ? 'active' : ''}`}
          onClick={() => setActiveTab('areas')}
        >
          Service Areas ({serviceAreas.length})
        </button>
      </div>

      {/* Tab 1: Verifications */}
      {activeTab === 'verifications' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Farm Producer</th>
                <th>District / Taluka</th>
                <th>Land Area</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farm) => (
                <tr key={farm.id}>
                  <td>
                    <strong>{farm.farm_name}</strong>
                    <div className="text-caption">{farm.phone || farm.user?.phone || 'N/A'}</div>
                  </td>
                  <td>
                    {farm.village}, {farm.district}
                  </td>
                  <td>{farm.land_area_acres} Acres</td>
                  <td>
                    <span
                      className={`admin-verification-badge ${
                        farm.verification_status || 'pending'
                      }`}
                    >
                      {farm.verification_status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateVerification(farm.id, 'verified')}
                      >
                        <CheckCircle2 size={14} /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateVerification(farm.id, 'rejected')}
                      >
                        <XCircle size={14} /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Farm Producer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{o.order_number}</strong>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{o.customer?.full_name || 'Customer'}</td>
                  <td>{o.farmer?.farm_name || 'Local Farm'}</td>
                  <td>
                    <strong>{formatPaise(o.total_amount_paise)}</strong>
                  </td>
                  <td>
                    <span className={`order-status-badge ${o.status}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Service Areas */}
      {activeTab === 'areas' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Area Name</th>
                <th>District / Taluka</th>
                <th>Pincodes Supported</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {serviceAreas.map((sa) => (
                <tr key={sa.id}>
                  <td>
                    <strong>{sa.name}</strong> ({sa.name_hi})
                  </td>
                  <td>
                    {sa.district}, {sa.state}
                  </td>
                  <td>{sa.pincodes.join(', ')}</td>
                  <td>
                    <span className="badge badge-success">Active Hub</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
