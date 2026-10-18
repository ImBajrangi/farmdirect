import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Plus,
  CheckCircle2,
  XCircle,
  Truck,
  Edit2,
  Package,
  Clock,
  Sprout,
  IndianRupee,
  MapPin,
  ExternalLink,
  PackageCheck,
  X,
  Layers,
  ArrowRight,
  Zap,
  Trash2,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { farmerService } from './farmer.service';
import { Order, Product, OrderStatus } from './farmer.types';
import { formatPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './farmer.css';

export const FarmerDashboard: React.FC = () => {
  const { farmerProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Order segment filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'in_prep' | 'delivered'>('all');

  // Crop search and inventory filters
  const [cropFilter, setCropFilter] = useState<'all' | 'in_stock' | 'low_stock'>('all');
  const [cropSearch, setCropSearch] = useState<string>('');
  const [isCreatingDemoOrder, setIsCreatingDemoOrder] = useState<boolean>(false);

  // Interactive Stock Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockInputValue, setStockInputValue] = useState<number>(0);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const farmId = farmerProfile?.id || 'farmer-1';

  const loadData = async () => {
    try {
      const [orderList, productList] = await Promise.all([
        farmerService.getFarmerOrders(farmId),
        farmerService.getFarmerProducts(farmId),
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
    loadData();
  }, [farmId]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    reason?: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      await farmerService.updateOrderStatus(orderId, status, reason);
      await loadData();
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleQuickDelta = async (product: Product, delta: number) => {
    const currentQty = product.inventory?.available_quantity ?? 0;
    const newQty = Math.max(0, currentQty + delta);
    try {
      await farmerService.updateStock(product.id, newQty);
      await loadData();
    } catch {
      alert('Failed to update stock');
    }
  };

  const handleCreateDemoOrder = async () => {
    setIsCreatingDemoOrder(true);
    try {
      await farmerService.createDemoOrder(farmId);
      await loadData();
    } catch {
      alert('Failed to create demo harvest order');
    } finally {
      setIsCreatingDemoOrder(false);
    }
  };

  const handleClearDemoOrders = async () => {
    try {
      await farmerService.clearDemoOrders(farmId);
      await loadData();
    } catch {
      alert('Failed to clear demo orders');
    }
  };

  const openStockModal = (product: Product) => {
    setEditingProduct(product);
    setStockInputValue(product.inventory?.available_quantity ?? 0);
  };

  const closeStockModal = () => {
    setEditingProduct(null);
    setIsUpdatingStock(false);
  };

  const handleSaveStock = async () => {
    if (!editingProduct) return;
    setIsUpdatingStock(true);
    try {
      await farmerService.updateStock(editingProduct.id, stockInputValue);
      await loadData();
      closeStockModal();
    } catch {
      alert('Failed to update stock quantity');
    } finally {
      setIsUpdatingStock(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Loading farm operations dashboard..." />
      </div>
    );
  }

  // Metrics calculation
  const pendingOrders = orders.filter((o) => o.status === 'pending_confirmation');
  const inPrepOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'completed');
  const totalRevenuePaise = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'rejected')
    .reduce((sum, o) => sum + o.subtotal_paise, 0);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending') return o.status === 'pending_confirmation';
    if (orderFilter === 'in_prep') return o.status === 'confirmed' || o.status === 'preparing';
    if (orderFilter === 'delivered') return o.status === 'delivered' || o.status === 'completed';
    return true;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (cropSearch.trim()) {
      const q = cropSearch.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = (p.category?.name || '').toLowerCase().includes(q);
      if (!matchName && !matchCategory) return false;
    }
    const available = p.inventory?.available_quantity ?? 0;
    if (cropFilter === 'in_stock') return available > 0;
    if (cropFilter === 'low_stock') return available <= 50;
    return true;
  });

  return (
    <div className="page-container farmer-dashboard">
      {/* SaaS Farm Profile Header Card */}
      <div className="farmer-saas-header">
        <div className="farmer-profile-main">
          <div className="farmer-farm-emblem">
            <Tractor size={28} />
          </div>
          <div className="farmer-profile-text">
            <div className="farmer-title-row">
              <h1 className="farmer-farm-name">
                {farmerProfile?.farm_name || 'Patil Agro Orchards'}
              </h1>
              <span className="farmer-status-pill live">
                <span className="live-dot" /> Live Node
              </span>
              <span className="farmer-status-pill verified">
                <ShieldCheck size={12} /> PGS Natural
              </span>
            </div>
            <div className="farmer-meta-chips">
              <span className="farmer-meta-chip">
                <MapPin size={13} />
                {farmerProfile?.village || 'Dindori'}, {farmerProfile?.district || 'Nashik'} • {farmerProfile?.land_area_acres || 8.5} Registered Acres
              </span>
              <span className="farmer-meta-dot">•</span>
              <span className="farmer-meta-chip">
                Node ID: #FD-NSK-042
              </span>
            </div>
          </div>
        </div>

        <div className="farmer-header-actions">
          <Link to={`/farmer/${farmId}`} className="farmer-btn-secondary">
            <span>Public Storefront</span>
            <ExternalLink size={14} />
          </Link>
          <Link to="/farmer/products/new">
            <Button variant="primary" size="sm">
              <Plus size={16} /> Add Harvest Produce
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="farmer-kpi-grid">
        <div className="farmer-kpi-card">
          <div className="farmer-kpi-top">
            <span className="farmer-kpi-title">Awaiting Harvest</span>
            <span className="farmer-kpi-icon-wrap amber">
              <Clock size={16} />
            </span>
          </div>
          <div className="farmer-kpi-value">{pendingOrders.length}</div>
          <div className="farmer-kpi-badge amber">
            <span>{pendingOrders.length > 0 ? 'Requires morning harvest' : 'Zero pending harvest orders'}</span>
          </div>
        </div>

        <div className="farmer-kpi-card">
          <div className="farmer-kpi-top">
            <span className="farmer-kpi-title">In Packing</span>
            <span className="farmer-kpi-icon-wrap blue">
              <Package size={16} />
            </span>
          </div>
          <div className="farmer-kpi-value">{inPrepOrders.length}</div>
          <div className="farmer-kpi-badge blue">
            <span>{inPrepOrders.length > 0 ? 'Crate packing in progress' : 'No crates in packing'}</span>
          </div>
        </div>

        <div className="farmer-kpi-card">
          <div className="farmer-kpi-top">
            <span className="farmer-kpi-title">Active Produce</span>
            <span className="farmer-kpi-icon-wrap emerald">
              <Sprout size={16} />
            </span>
          </div>
          <div className="farmer-kpi-value">{products.length}</div>
          <div className="farmer-kpi-badge emerald">
            <span>Direct market catalog live</span>
          </div>
        </div>

        <div className="farmer-kpi-card">
          <div className="farmer-kpi-top">
            <span className="farmer-kpi-title">Net Farmer Sales</span>
            <span className="farmer-kpi-icon-wrap purple">
              <IndianRupee size={16} />
            </span>
          </div>
          <div className="farmer-kpi-value revenue">{formatPaise(totalRevenuePaise)}</div>
          <div className="farmer-kpi-badge emerald">
            <span>Direct bank settlement (0% fee)</span>
          </div>
        </div>
      </div>

      {/* Produce Inventory Management Section */}
      <section className="farmer-section-block">
        <div className="farmer-section-header">
          <div>
            <h2 className="farmer-section-title">
              <Layers size={18} className="text-emerald-700" /> My Listed Produce ({filteredProducts.length})
            </h2>
            <p className="farmer-section-desc">
              Manage harvest stock levels, prices per kg, and active marketplace visibility
            </p>
          </div>

          <div className="farmer-produce-toolbar">
            <div className="farmer-produce-search">
              <Search size={14} className="farmer-search-icon" />
              <input
                type="text"
                placeholder="Search crop name..."
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                className="farmer-search-input"
              />
            </div>
            <div className="farmer-filter-pills">
              <button
                type="button"
                className={`farmer-filter-pill ${cropFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCropFilter('all')}
              >
                All ({products.length})
              </button>
              <button
                type="button"
                className={`farmer-filter-pill ${cropFilter === 'in_stock' ? 'active' : ''}`}
                onClick={() => setCropFilter('in_stock')}
              >
                In Stock ({products.filter(p => (p.inventory?.available_quantity ?? 0) > 0).length})
              </button>
              <button
                type="button"
                className={`farmer-filter-pill ${cropFilter === 'low_stock' ? 'active' : ''}`}
                onClick={() => setCropFilter('low_stock')}
              >
                Low / Out ({products.filter(p => (p.inventory?.available_quantity ?? 0) <= 50).length})
              </button>
            </div>
          </div>
        </div>

        <div className="farmer-inventory-grid">
          {filteredProducts.map((prod) => {
            const availableQty = prod.inventory?.available_quantity ?? 0;
            const isLowStock = availableQty > 0 && availableQty <= 50;
            const isOutOfStock = availableQty === 0;

            return (
              <div key={prod.id} className="farmer-crop-card">
                <div className="farmer-crop-media-banner">
                  <img
                    src={prod.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                    alt={prod.name}
                    className="farmer-crop-img"
                  />
                  <div className="farmer-crop-banner-overlay">
                    <span className="farmer-crop-organic-tag">
                      {prod.is_certified_organic ? 'PGS Organic' : 'Direct Farmgate'}
                    </span>
                    <span className={`farmer-crop-stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'good'}`}>
                      {isOutOfStock ? 'Sold Out' : `${availableQty} ${prod.unit} Available`}
                    </span>
                  </div>
                </div>

                <div className="farmer-crop-body">
                  <div className="farmer-crop-main-row">
                    <div className="farmer-crop-title-group">
                      <h3 className="farmer-crop-title">{prod.name}</h3>
                      <span className="farmer-crop-category">
                        {prod.category?.name || 'Fresh Harvest'} • Direct Farmgate
                      </span>
                    </div>
                    <div className="farmer-crop-price-box">
                      <span className="farmer-crop-price-val">{formatPaise(prod.price_paise)}</span>
                      <span className="farmer-crop-price-unit">/{prod.unit}</span>
                    </div>
                  </div>

                  {/* Tactile Quick-Stock Stepper */}
                  <div className="farmer-crop-stepper-box">
                    <div className="stepper-label-col">
                      <span className="stepper-title">Available Stock</span>
                      <span className={`stepper-status ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'good'}`}>
                        {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock Warning' : 'Healthy Inventory'}
                      </span>
                    </div>
                    <div className="stepper-action-group">
                      <button
                        type="button"
                        className="stepper-btn minus"
                        onClick={() => handleQuickDelta(prod, -10)}
                        title="Decrease by 10 kg"
                        disabled={availableQty === 0}
                      >
                        −10
                      </button>
                      <span className="stepper-quantity-display">
                        <strong>{availableQty}</strong> <small>{prod.unit}</small>
                      </span>
                      <button
                        type="button"
                        className="stepper-btn plus"
                        onClick={() => handleQuickDelta(prod, +10)}
                        title="Increase by 10 kg"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="farmer-crop-actions-bar">
                    <button
                      type="button"
                      className="farmer-crop-edit-btn"
                      onClick={() => openStockModal(prod)}
                    >
                      <Edit2 size={13} />
                      <span>Update Stock</span>
                    </button>
                    <Link
                      to={`/product/${prod.slug}`}
                      className="farmer-crop-store-link"
                      title="View public marketplace listing"
                    >
                      <span>View Listing</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Orders for Harvest & Dispatch Section */}
      <section className="farmer-section-block">
        <div className="farmer-section-header">
          <div>
            <h2 className="farmer-section-title">
              <PackageCheck size={20} className="text-emerald-700" /> Orders for Harvest & Dispatch ({orders.length})
            </h2>
            <p className="farmer-section-desc">
              Morning harvest confirmation, grading, and crate hand-off tracking
            </p>
          </div>

          <div className="farmer-orders-toolbar">
            {/* Segment Filter */}
            <div className="farmer-order-segments">
              <button
                type="button"
                className={`farmer-segment-btn ${orderFilter === 'all' ? 'active' : ''}`}
                onClick={() => setOrderFilter('all')}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                className={`farmer-segment-btn ${orderFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setOrderFilter('pending')}
              >
                Awaiting ({pendingOrders.length})
              </button>
              <button
                type="button"
                className={`farmer-segment-btn ${orderFilter === 'in_prep' ? 'active' : ''}`}
                onClick={() => setOrderFilter('in_prep')}
              >
                Packing ({inPrepOrders.length})
              </button>
              <button
                type="button"
                className={`farmer-segment-btn ${orderFilter === 'delivered' ? 'active' : ''}`}
                onClick={() => setOrderFilter('delivered')}
              >
                Delivered ({deliveredOrders.length})
              </button>
            </div>

            {/* Quick Demo Order Actions */}
            <div className="farmer-demo-order-group">
              <button
                type="button"
                className="farmer-btn-demo"
                onClick={handleCreateDemoOrder}
                disabled={isCreatingDemoOrder}
                title="Simulate customer harvest order"
              >
                <Zap size={13} />
                <span>{isCreatingDemoOrder ? 'Creating...' : 'Test Order'}</span>
              </button>
              {orders.some((o) => o.id.startsWith('ord-demo-')) && (
                <button
                  type="button"
                  className="farmer-btn-demo-clear"
                  onClick={handleClearDemoOrders}
                  title="Clear simulated test orders"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="farmer-empty-orders-card">
            <div className="farmer-empty-icon-wrap">
              <PackageCheck size={28} />
            </div>
            <h3 className="farmer-empty-title">All Harvest Orders Dispatched & Clear</h3>
            <p className="farmer-empty-desc">
              No pending orders awaiting morning harvest or crate packing right now. New customer orders from your delivery zone will arrive here in real-time.
            </p>
            <div className="farmer-empty-actions">
              <button
                type="button"
                className="farmer-btn-generate-order"
                onClick={handleCreateDemoOrder}
                disabled={isCreatingDemoOrder}
              >
                <Zap size={14} />
                <span>{isCreatingDemoOrder ? 'Generating...' : 'Simulate Test Harvest Order'}</span>
              </button>
            </div>
            <div className="farmer-empty-tip">
              <strong>💡 Pro Tip:</strong> Keep your crop availability updated before 8 PM to receive top priority for morning customer harvest routes.
            </div>
          </div>
        ) : (
          <div className="farmer-orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="farmer-order-card">
                <div className="farmer-order-card-header">
                  <div className="farmer-order-identity">
                    <span className="farmer-order-number">Order #{order.order_number}</span>
                    <span className="farmer-order-time">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`order-status-badge ${order.status}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="farmer-order-items-table">
                  {order.items?.map((item) => (
                    <div key={item.id} className="farmer-order-item-row">
                      <div className="farmer-order-item-info">
                        <span className="farmer-order-item-bullet" />
                        <span className="farmer-order-item-title">{item.product_name}</span>
                        <span className="farmer-order-item-qty">
                          × {item.quantity} {item.unit}
                        </span>
                      </div>
                      <span className="farmer-order-item-price">
                        {formatPaise(item.total_price_paise)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="farmer-order-meta-footer">
                  <div className="farmer-order-meta-col">
                    <span className="meta-label">Fulfillment:</span>
                    <strong>{order.delivery_type === 'pickup' ? 'Direct Farm Pickup' : 'Local Courier Dispatch'}</strong>
                  </div>
                  <div className="farmer-order-meta-col">
                    <span className="meta-label">Recipient:</span>
                    <span>{order.customer?.full_name || 'Customer'} ({order.delivery_address_snapshot.phone})</span>
                  </div>
                  <div className="farmer-order-total-col">
                    <span className="meta-label">Total Amount:</span>
                    <strong className="total-val">{formatPaise(order.total_amount_paise)}</strong>
                  </div>
                </div>

                <div className="farmer-order-card-actions">
                  {order.status === 'pending_confirmation' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={updatingOrderId === order.id}
                        onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                      >
                        <CheckCircle2 size={14} /> Accept Harvest Order
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={updatingOrderId === order.id}
                        onClick={() => handleUpdateOrderStatus(order.id, 'rejected', 'Produce out of stock')}
                      >
                        <XCircle size={14} /> Decline
                      </Button>
                    </>
                  )}

                  {order.status === 'confirmed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={updatingOrderId === order.id}
                      onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                    >
                      <Package size={14} /> Move to Fresh Packing
                    </Button>
                  )}

                  {order.status === 'preparing' && (
                    <Button
                      variant="accent"
                      size="sm"
                      isLoading={updatingOrderId === order.id}
                      onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                    >
                      <Truck size={14} /> Hand Over for Dispatch
                    </Button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={updatingOrderId === order.id}
                      onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                    >
                      <CheckCircle2 size={14} /> Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Stock Edit Modal */}
      {editingProduct && (
        <div className="farmer-modal-backdrop" onClick={closeStockModal}>
          <div className="farmer-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="farmer-modal-header">
              <div>
                <h3 className="farmer-modal-title">Update Available Stock</h3>
                <p className="farmer-modal-sub">{editingProduct.name}</p>
              </div>
              <button type="button" className="farmer-modal-close" onClick={closeStockModal}>
                <X size={18} />
              </button>
            </div>

            <div className="farmer-modal-body">
              <div className="stock-input-group">
                <label className="stock-input-label">
                  Available Quantity ({editingProduct.unit})
                </label>
                <div className="stock-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="stock-number-field"
                    value={stockInputValue}
                    onChange={(e) => setStockInputValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  />
                  <span className="stock-unit-suffix">{editingProduct.unit}</span>
                </div>
              </div>

              {/* Quick increment buttons */}
              <div className="stock-quick-increments">
                <span className="quick-label">Quick adjustments:</span>
                <div className="quick-chip-row">
                  <button
                    type="button"
                    className="quick-chip"
                    onClick={() => setStockInputValue((prev) => prev + 10)}
                  >
                    +10 {editingProduct.unit}
                  </button>
                  <button
                    type="button"
                    className="quick-chip"
                    onClick={() => setStockInputValue((prev) => prev + 50)}
                  >
                    +50 {editingProduct.unit}
                  </button>
                  <button
                    type="button"
                    className="quick-chip"
                    onClick={() => setStockInputValue((prev) => prev + 100)}
                  >
                    +100 {editingProduct.unit}
                  </button>
                  <button
                    type="button"
                    className="quick-chip danger"
                    onClick={() => setStockInputValue(0)}
                  >
                    Set to 0 (Sold Out)
                  </button>
                </div>
              </div>
            </div>

            <div className="farmer-modal-footer">
              <button
                type="button"
                className="farmer-btn-secondary"
                onClick={closeStockModal}
                disabled={isUpdatingStock}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                size="md"
                isLoading={isUpdatingStock}
                onClick={handleSaveStock}
              >
                Save Inventory
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

