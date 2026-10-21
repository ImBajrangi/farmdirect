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
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  // 7/12 Audit Modal State
  const [auditingFarmer, setAuditingFarmer] = useState<FarmerProfile | null>(null);

  const loadData = async () => {
    try {
      const data = await adminService.getDashboardData();
      setFarmers(data.farmers);
      setOrders(data.orders);
      setProducts(data.products);
      setServiceAreas(data.serviceAreas);
      if (data.farmers.length > 0 && !selectedFarmerId) {
        setSelectedFarmerId(data.farmers[0].id);
      }
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

  const pendingCount = farmers.filter(
    (f) => !f.verification_status || f.verification_status === 'pending'
  ).length;
  const verifiedCount = farmers.filter(
    (f) => f.verification_status === 'verified'
  ).length;

  const currentSelectedFarmer =
    farmers.find((f) => f.id === selectedFarmerId) ||
    filteredFarmers[0] ||
    null;

  return (
    <div className="page-container admin-dashboard">
      {/* SaaS Governance Header with Title & Pending Reviews Badge */}
      <div className="admin-workspace-header">
        <div className="admin-workspace-title-group">
          <div className="admin-title-row">
            <h1 className="admin-title">Admin Command Center</h1>
            <span className="admin-pending-badge">
              {pendingCount} Pending Reviews
            </span>
          </div>
          <p className="admin-subtitle">
            Producer verification queue, land record audit dossiers, and regional dispatch governance
          </p>
        </div>

        <div className="admin-header-actions">
          <span className="admin-role-badge">Super Admin</span>
          <span className="admin-gateway-badge">
            <Globe size={13} /> Nashik–Pune Hub
          </span>
        </div>
      </div>

      {/* Wireframe 4 Secondary KPI Cards Row */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Pending KYC</span>
            <span className="admin-kpi-icon-wrap amber">
              <AlertTriangle size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{pendingCount}</div>
          <div className="admin-kpi-badge">
            <span>Awaiting document review</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Verified Farms</span>
            <span className="admin-kpi-icon-wrap emerald">
              <ShieldCheck size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{verifiedCount}</div>
          <div className="admin-kpi-badge">
            <span>Active licensed producers</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Orders</span>
            <span className="admin-kpi-icon-wrap blue">
              <ShoppingBag size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{orders.length}</div>
          <div className="admin-kpi-badge">
            <span>Platform transactions</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-title">Active Hubs</span>
            <span className="admin-kpi-icon-wrap purple">
              <MapPin size={16} />
            </span>
          </div>
          <div className="admin-kpi-value">{serviceAreas.length}</div>
          <div className="admin-kpi-badge">
            <span>Logistics gateways</span>
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
          <span>Producer Review Workspace</span>
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

      {/* TAB 1: Master-Detail Farmer Verification Workspace (Wireframe 4) */}
      {activeTab === 'verifications' && (
        <div className="admin-content-section">
          <div className="admin-master-detail-workspace">
            {/* Left 35-40%: Producer review queue */}
            <div className="admin-master-queue">
              <div className="admin-queue-header">
                <div className="admin-queue-title-row">
                  <h3 className="admin-queue-heading">Producer Review Queue</h3>
                  <span className="admin-queue-count-pill">{filteredFarmers.length}</span>
                </div>

                <div className="admin-search-wrapper">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search farm, village, or district..."
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
                    All ({farmers.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${farmerStatusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFarmerStatusFilter('pending')}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${farmerStatusFilter === 'verified' ? 'active' : ''}`}
                    onClick={() => setFarmerStatusFilter('verified')}
                  >
                    Verified ({verifiedCount})
                  </button>
                </div>
              </div>

              {filteredFarmers.length === 0 ? (
                <div className="admin-queue-empty">
                  <p>No producers match the filter.</p>
                </div>
              ) : (
                <div className="admin-queue-list">
                  {filteredFarmers.map((farm) => {
                    const status = farm.verification_status || 'pending';
                    const isSelected = currentSelectedFarmer?.id === farm.id;

                    return (
                      <div
                        key={farm.id}
                        className={`admin-queue-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedFarmerId(farm.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedFarmerId(farm.id);
                          }
                        }}
                      >
                        <div className="queue-item-avatar">
                          {farm.farm_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="queue-item-content">
                          <div className="queue-item-top">
                            <span className="queue-item-name">{farm.farm_name}</span>
                            <span className={`admin-status-tag ${status}`}>
                              {status === 'verified' ? 'Verified' : status === 'pending' ? 'Review' : 'Rejected'}
                            </span>
                          </div>
                          <div className="queue-item-meta">
                            <span>{farm.village}, {farm.district}</span>
                            <span className="meta-dot">•</span>
                            <span>{farm.land_area_acres || 8.5} ac</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 60-65%: Selected farmer · inspection dossier */}
            <div className="admin-detail-dossier">
              {currentSelectedFarmer ? (
                <div className="admin-dossier-card">
                  <div className="admin-dossier-header">
                    <div>
                      <span className="admin-dossier-eyebrow">Producer Inspection Dossier</span>
                      <h2 className="admin-dossier-title">{currentSelectedFarmer.farm_name}</h2>
                      <div className="admin-dossier-subtitle">
                        <MapPin size={13} /> {currentSelectedFarmer.village}, {currentSelectedFarmer.district}, Maharashtra
                      </div>
                    </div>
                    <span className={`admin-verification-badge ${currentSelectedFarmer.verification_status || 'pending'}`}>
                      {currentSelectedFarmer.verification_status === 'verified'
                        ? 'Verified 7/12'
                        : currentSelectedFarmer.verification_status === 'rejected'
                        ? 'Revoked'
                        : 'Audit Pending'}
                    </span>
                  </div>

                  {/* Land document preview image placeholder · 16:9 */}
                  <div className="admin-dossier-preview-box">
                    <ImagePlaceholder
                      aspectRatio="16:9"
                      height={200}
                      label="Digital 7/12 (Saat Bara) Land Extract"
                      sublabel={`${currentSelectedFarmer.farm_name} • Gat #${currentSelectedFarmer.id.slice(0, 6).toUpperCase()} • Verified Revenue Dept Records`}
                      borderRadius="12px"
                    />
                  </div>

                  {/* Dossier Information Grid */}
                  <div className="admin-dossier-info-grid">
                    <div className="dossier-info-section">
                      <h4 className="dossier-section-heading">Identity Details</h4>
                      <div className="dossier-key-val">
                        <span className="dossier-key">Registered Name:</span>
                        <span className="dossier-val">{currentSelectedFarmer.farm_name}</span>
                      </div>
                      <div className="dossier-key-val">
                        <span className="dossier-key">Contact Phone:</span>
                        <span className="dossier-val">{currentSelectedFarmer.phone || currentSelectedFarmer.user?.phone || '9822012345'}</span>
                      </div>
                      <div className="dossier-key-val">
                        <span className="dossier-key">Taluka & District:</span>
                        <span className="dossier-val">{currentSelectedFarmer.village}, {currentSelectedFarmer.district}</span>
                      </div>
                    </div>

                    <div className="dossier-info-section">
                      <h4 className="dossier-section-heading">Land Record Details</h4>
                      <div className="dossier-key-val">
                        <span className="dossier-key">Survey / Gat No:</span>
                        <span className="dossier-val">Gat #{currentSelectedFarmer.id.slice(0, 5).toUpperCase()}/2A</span>
                      </div>
                      <div className="dossier-key-val">
                        <span className="dossier-key">Cultivable Land:</span>
                        <span className="dossier-val">{currentSelectedFarmer.land_area_acres || 8.5} Acres</span>
                      </div>
                      <div className="dossier-key-val">
                        <span className="dossier-key">Water & Soil:</span>
                        <span className="dossier-val">Drip Irrigated • Certified Natural</span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Checkpoints */}
                  <div className="dossier-checkpoints">
                    <div className="dossier-checkpoint-row">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>Mahabhulekh 7/12 Land Title authentic and active</span>
                    </div>
                    <div className="dossier-checkpoint-row">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>PGS-India organic / natural agricultural compliance audited</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="admin-dossier-actions">
                    {(!currentSelectedFarmer.verification_status || currentSelectedFarmer.verification_status === 'pending') && (
                      <>
                        <button
                          type="button"
                          className="action-btn-success"
                          onClick={() => handleUpdateVerification(currentSelectedFarmer.id, 'verified')}
                        >
                          <CheckCircle2 size={15} /> Approve, if authorized
                        </button>
                        <button
                          type="button"
                          className="action-btn-danger"
                          onClick={() => handleUpdateVerification(currentSelectedFarmer.id, 'rejected')}
                        >
                          <XCircle size={15} /> Request correction / Reject
                        </button>
                      </>
                    )}

                    {currentSelectedFarmer.verification_status === 'verified' && (
                      <>
                        <div className="admin-verified-notice">
                          <CheckCircle2 size={15} className="text-emerald-600" />
                          <span>Producer authorized for direct consumer marketplace orders</span>
                        </div>
                        <button
                          type="button"
                          className="action-btn-danger"
                          onClick={() => handleUpdateVerification(currentSelectedFarmer.id, 'rejected')}
                        >
                          Revoke Verification
                        </button>
                      </>
                    )}

                    {currentSelectedFarmer.verification_status === 'rejected' && (
                      <button
                        type="button"
                        className="action-btn-success"
                        onClick={() => handleUpdateVerification(currentSelectedFarmer.id, 'verified')}
                      >
                        <CheckCircle2 size={15} /> Re-instate Producer
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="admin-dossier-empty">
                  <p>Select a producer from the review queue on the left to inspect land records and verification status.</p>
                </div>
              )}
            </div>
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

