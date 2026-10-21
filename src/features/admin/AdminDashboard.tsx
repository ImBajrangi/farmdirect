import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  ShoppingBag,
  IndianRupee,
  MapPin,
  FileText,
  Search,
  ExternalLink,
  X,
  AlertTriangle,
  Globe,
  Layers,
  Sprout,
  TrendingUp,
} from 'lucide-react';
import { adminService } from './admin.service';
import { FarmerProfile, Order, Product, ServiceArea, FarmerVerificationStatus } from './admin.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { ImagePlaceholder } from '../../components/common/ImagePlaceholder';
import './admin.css';

export const AdminDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'verifications' | 'orders' | 'areas'>('verifications');

  // Search and filter for farmers
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerStatusFilter, setFarmerStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

  // 7/12 Audit Modal State
  const [auditingFarmer, setAuditingFarmer] = useState<FarmerProfile | null>(null);

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
    if (auditingFarmer && auditingFarmer.id === farmerId) {
      setAuditingFarmer(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Loading governance desk data..." />
      </div>
    );
  }

  const totalGMVPaise = orders.reduce((sum, o) => sum + o.total_amount_paise, 0);

  // Filtered farmers
  const filteredFarmers = farmers.filter((farm) => {
    const matchesSearch =
      farm.farm_name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      farm.village.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      farm.district.toLowerCase().includes(farmerSearch.toLowerCase());

    const status = farm.verification_status || 'pending';
    const matchesStatus =
      farmerStatusFilter === 'all' || status === farmerStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container admin-dashboard">
      {/* SaaS Governance Overview Grid */}
      <div className="admin-overview-hero-grid">
        <div className="admin-saas-header">
          <div className="admin-profile-main">
            <div className="admin-emblem">
              <ShieldCheck size={28} />
            </div>
            <div className="admin-profile-text">
              <div className="admin-title-row">
                <h1 className="admin-title">Marketplace Governance & Platform Desk</h1>
                <span className="admin-status-pill">
                  <span className="admin-live-dot" /> Operational Node
                </span>
              </div>
              <p className="admin-subtitle">
                Field KYC audits, 7/12 land deed verifications, and real-time multi-tenant platform operations
              </p>
            </div>
          </div>

          <div className="admin-header-badge-row">
            <span className="admin-role-badge">Super Admin</span>
            <span className="admin-gateway-badge">
              <Globe size={13} /> Nashik–Pune Hub
            </span>
          </div>
        </div>

        {/* Intentional Neutral Grey Overview Map Placeholder */}
        <div className="admin-overview-map-card">
          <ImagePlaceholder
            aspectRatio="16:9"
            height={130}
            label="Maharashtra Gateway Hub & Agricultural Cluster Map"
            sublabel="Live telemetry coverage for Nashik & Pune regional nodes"
            borderRadius="20px"
          />
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Gross Platform GMV</span>
            <span className="admin-kpi-icon-wrap emerald">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="admin-kpi-value revenue">{formatPaise(totalGMVPaise)}</div>
          <div className="admin-kpi-badge">
            <span>Direct farmer settlements</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Buyer Orders</span>
            <span className="admin-kpi-icon-wrap blue">
              <ShoppingBag size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{orders.length}</div>
          <div className="admin-kpi-badge">
            <span>{orders.length === 0 ? 'Fresh cycle starting' : 'All-time dispatches'}</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Verified Producers</span>
            <span className="admin-kpi-icon-wrap purple">
              <Users size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{farmers.length}</div>
          <div className="admin-kpi-badge">
            <span>Active agricultural hubs</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Listed Harvest SKUs</span>
            <span className="admin-kpi-icon-wrap amber">
              <Sprout size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{products.length}</div>
          <div className="admin-kpi-badge">
            <span>Fresh crop varieties</span>
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="admin-tabs-segmented">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'verifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('verifications')}
        >
          <span>Farmer KYC & 7/12 Audits</span>
          <span className="tab-counter">{farmers.length}</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span>All Marketplace Orders</span>
          <span className="tab-counter">{orders.length}</span>
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'areas' ? 'active' : ''}`}
          onClick={() => setActiveTab('areas')}
        >
          <span>Active Service Areas</span>
          <span className="tab-counter">{serviceAreas.length}</span>
        </button>
      </div>

      {/* TAB 1: Farmer Verifications */}
      {activeTab === 'verifications' && (
        <div className="admin-content-section">
          <div className="admin-filter-bar">
            <div className="admin-search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search farm name, village, or district..."
                value={farmerSearch}
                onChange={(e) => setFarmerSearch(e.target.value)}
                className="admin-search-field"
              />
            </div>

            <div className="admin-status-filters">
              <button
                type="button"
                className={`filter-chip ${farmerStatusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setFarmerStatusFilter('all')}
              >
                All Producers ({farmers.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${farmerStatusFilter === 'verified' ? 'active' : ''}`}
                onClick={() => setFarmerStatusFilter('verified')}
              >
                Verified ({farmers.filter((f) => f.verification_status === 'verified').length})
              </button>
              <button
                type="button"
                className={`filter-chip ${farmerStatusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setFarmerStatusFilter('pending')}
              >
                Pending ({farmers.filter((f) => !f.verification_status || f.verification_status === 'pending').length})
              </button>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Farm Producer</th>
                  <th>District / Taluka</th>
                  <th>Land Holding</th>
                  <th>7/12 Land Record Status</th>
                  <th>Governance Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farm) => {
                  const status = farm.verification_status || 'pending';
                  const isVerified = status === 'verified';
                  const isPending = status === 'pending';

                  return (
                    <tr key={farm.id}>
                      <td>
                        <div className="farm-info-cell">
                          <strong className="farm-name">{farm.farm_name}</strong>
                          <span className="farm-contact">
                            {farm.phone || farm.user?.phone || 'Contact Verified'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="farm-location-cell">
                          <span>{farm.village}, {farm.district}</span>
                          <span className="state-sub">Maharashtra</span>
                        </div>
                      </td>
                      <td>
                        <span className="land-area-tag">
                          {farm.land_area_acres || 8.5} Acres
                        </span>
                      </td>
                      <td>
                        <div className="status-cell">
                          <span className={`admin-verification-badge ${status}`}>
                            {isVerified ? 'Verified 7/12' : isPending ? 'Pending Audit' : status}
                          </span>
                          <button
                            type="button"
                            className="audit-deed-link"
                            onClick={() => setAuditingFarmer(farm)}
                          >
                            <FileText size={12} /> View Deed Dossier
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="admin-actions-cell">
                          {isVerified && (
                            <>
                              <button
                                type="button"
                                className="action-btn-neutral"
                                onClick={() => setAuditingFarmer(farm)}
                              >
                                Audit Dossier
                              </button>
                              <button
                                type="button"
                                className="action-btn-danger"
                                onClick={() => handleUpdateVerification(farm.id, 'rejected')}
                              >
                                Revoke
                              </button>
                            </>
                          )}

                          {isPending && (
                            <>
                              <button
                                type="button"
                                className="action-btn-success"
                                onClick={() => handleUpdateVerification(farm.id, 'verified')}
                              >
                                <CheckCircle2 size={13} /> Approve KYC
                              </button>
                              <button
                                type="button"
                                className="action-btn-danger"
                                onClick={() => handleUpdateVerification(farm.id, 'rejected')}
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </>
                          )}

                          {!isVerified && !isPending && (
                            <button
                              type="button"
                              className="action-btn-success"
                              onClick={() => handleUpdateVerification(farm.id, 'verified')}
                            >
                              <CheckCircle2 size={13} /> Re-instate Farm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Responsive Mobile Stacked Records (< 768px) */}
          <div className="admin-mobile-records">
            {filteredFarmers.map((farm) => {
              const status = farm.verification_status || 'pending';
              const isVerified = status === 'verified';
              const isPending = status === 'pending';

              return (
                <div key={farm.id} className="admin-mobile-card">
                  <div className="admin-mobile-card-top">
                    <div>
                      <h4 className="admin-mobile-farm-name">{farm.farm_name}</h4>
                      <span className="admin-mobile-contact">
                        {farm.phone || farm.user?.phone || 'Contact Verified'}
                      </span>
                    </div>
                    <span className={`admin-verification-badge ${status}`}>
                      {isVerified ? 'Verified 7/12' : isPending ? 'Pending Audit' : status}
                    </span>
                  </div>

                  <div className="admin-mobile-card-meta">
                    <span>
                      <MapPin size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
                      {farm.village}, {farm.district}
                    </span>
                    <span className="land-area-tag">{farm.land_area_acres || 8.5} Acres</span>
                  </div>

                  <div style={{ marginBottom: '0.625rem' }}>
                    <button
                      type="button"
                      className="audit-deed-link"
                      onClick={() => setAuditingFarmer(farm)}
                    >
                      <FileText size={12} /> View Deed Dossier
                    </button>
                  </div>

                  <div className="admin-mobile-card-actions">
                    {isVerified && (
                      <>
                        <button
                          type="button"
                          className="action-btn-neutral"
                          style={{ flex: 1 }}
                          onClick={() => setAuditingFarmer(farm)}
                        >
                          Audit Dossier
                        </button>
                        <button
                          type="button"
                          className="action-btn-danger"
                          style={{ flex: 1 }}
                          onClick={() => handleUpdateVerification(farm.id, 'rejected')}
                        >
                          Revoke
                        </button>
                      </>
                    )}

                    {isPending && (
                      <>
                        <button
                          type="button"
                          className="action-btn-success"
                          style={{ flex: 1 }}
                          onClick={() => handleUpdateVerification(farm.id, 'verified')}
                        >
                          <CheckCircle2 size={13} /> Approve KYC
                        </button>
                        <button
                          type="button"
                          className="action-btn-danger"
                          style={{ flex: 1 }}
                          onClick={() => handleUpdateVerification(farm.id, 'rejected')}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}

                    {!isVerified && !isPending && (
                      <button
                        type="button"
                        className="action-btn-success"
                        style={{ width: '100%' }}
                        onClick={() => handleUpdateVerification(farm.id, 'verified')}
                      >
                        <CheckCircle2 size={13} /> Re-instate Farm
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Orders */}
      {activeTab === 'orders' && (
        <div className="admin-content-section">
          {orders.length === 0 ? (
            <div className="admin-empty-state-card">
              <div className="empty-icon-wrap">
                <ShoppingBag size={32} />
              </div>
              <h3 className="empty-title">No Marketplace Orders Recorded</h3>
              <p className="empty-desc">
                When consumer checkout occurs on the platform, full transactional records, farmer fulfillment states, and delivery snapshots will appear here for audit.
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Date & Time</th>
                    <th>Buyer</th>
                    <th>Farm Producer</th>
                    <th>Total Amount</th>
                    <th>Fulfillment State</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong className="order-num-text">{o.order_number}</strong>
                      </td>
                      <td>
                        <span className="order-date-text">
                          {new Date(o.created_at).toLocaleDateString()} {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>{o.customer?.full_name || 'Direct Buyer'}</td>
                      <td>{o.farmer?.farm_name || 'Local Producer'}</td>
                      <td>
                        <strong className="order-price-val">{formatPaise(o.total_amount_paise)}</strong>
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
        </div>
      )}

      {/* TAB 3: Service Areas */}
      {activeTab === 'areas' && (
        <div className="admin-content-section">
          <div className="admin-areas-grid">
            {serviceAreas.map((sa) => (
              <div key={sa.id} className="admin-area-card">
                <div className="area-card-header">
                  <div>
                    <h3 className="area-title">{sa.name}</h3>
                    <span className="area-native">({sa.name_hi})</span>
                  </div>
                  <span className="active-hub-badge">
                    <span className="hub-dot" /> Active Logistics Hub
                  </span>
                </div>

                <div className="area-meta-rows">
                  <div className="area-meta-row">
                    <span className="label">Jurisdiction:</span>
                    <strong>{sa.district}, {sa.state}</strong>
                  </div>
                  <div className="area-meta-row">
                    <span className="label">Delivery Fee:</span>
                    <span>{formatPaise(sa.delivery_fee_paise)} (Free above {formatPaise(sa.free_delivery_threshold_paise)})</span>
                  </div>
                </div>

                <div className="area-pincodes-block">
                  <span className="pincodes-label">Serviced Pincodes ({sa.pincodes.length}):</span>
                  <div className="pincode-chips">
                    {sa.pincodes.map((pin) => (
                      <span key={pin} className="pincode-chip">{pin}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7/12 Land Deed Audit Dossier Modal */}
      {auditingFarmer && (
        <div className="admin-modal-backdrop" onClick={() => setAuditingFarmer(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <ShieldCheck size={22} className="text-emerald-700" />
                <div>
                  <h3 className="admin-modal-title">7/12 Land Deed Audit Dossier</h3>
                  <p className="admin-modal-sub">{auditingFarmer.farm_name}</p>
                </div>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setAuditingFarmer(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="dossier-grid">
                <div className="dossier-item">
                  <span className="dossier-label">Registered Producer:</span>
                  <strong className="dossier-val">{auditingFarmer.farm_name}</strong>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Owner Contact:</span>
                  <strong className="dossier-val">{auditingFarmer.phone || '9822012345'}</strong>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Land Parcel Area:</span>
                  <strong className="dossier-val">{auditingFarmer.land_area_acres || 8.5} Cultivable Acres</strong>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Taluka & District:</span>
                  <strong className="dossier-val">{auditingFarmer.village}, {auditingFarmer.district}</strong>
                </div>
              </div>

              <div className="dossier-verify-box">
                <div className="verify-point">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <div>
                    <strong>Mahabhulekh Land Records (Satbara 7/12)</strong>
                    <p className="text-xs text-muted">Surv. Gat #142/3A registered under agricultural use without encumbrance.</p>
                  </div>
                </div>
                <div className="verify-point">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <div>
                    <strong>PGS-India Natural Farm Audit</strong>
                    <p className="text-xs text-muted">Field agronomist visit conducted. Zero synthetic pesticides certified.</p>
                  </div>
                </div>
                <div className="verify-point">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <div>
                    <strong>Harvest Dispatch Node Connectivity</strong>
                    <p className="text-xs text-muted">Direct farm pickup vehicle turnaround within 45 minutes of packing.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="action-btn-neutral"
                onClick={() => setAuditingFarmer(null)}
              >
                Close Dossier
              </button>
              {auditingFarmer.verification_status !== 'verified' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleUpdateVerification(auditingFarmer.id, 'verified')}
                >
                  <CheckCircle2 size={14} /> Approve 7/12 Verification
                </Button>
              ) : (
                <button
                  type="button"
                  className="action-btn-danger"
                  onClick={() => handleUpdateVerification(auditingFarmer.id, 'rejected')}
                >
                  Revoke Verification
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

