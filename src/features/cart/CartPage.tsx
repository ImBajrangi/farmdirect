import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MapPin, Truck, AlertCircle, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from './CartContext';
import { formatPaise } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/common/Button';
import { ImagePlaceholder } from '../../components/common/ImagePlaceholder';
import { marketplaceService } from '../../services/marketplaceService';
import { Product } from '../../types';
import './cart.css';

export const CartPage: FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    cartGroups,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalSubtotalPaise,
    totalDeliveryFeePaise,
    grandTotalPaise,
  } = useCart();

  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    marketplaceService.getProducts().then((all) => {
      setSuggestedProducts(all.slice(0, 4));
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="page-container page-content" style={{ maxWidth: 960 }}>
        <div className="cart-empty-wrapper">
          <div className="cart-empty-card">
            {/* Intentional Grey Visual Area (Directive 7 & 9) */}
            <div className="cart-empty-visual-box" style={{ maxWidth: 280, margin: '0 auto 1.25rem' }}>
              <ImagePlaceholder
                aspectRatio="4:3"
                height={160}
                label="Farm Basket Empty"
                sublabel="Fresh harvest awaiting selection"
                borderRadius="14px"
              />
            </div>
            <h2 className="heading-2" style={{ marginBottom: 8 }}>Your Farm Basket is Empty</h2>
            <p className="cart-empty-text">
              Direct farm-to-table produce picked at dawn from verified Maharashtra growers with direct farmgate pricing.
            </p>
            <div className="flex-row items-center justify-center gap-3" style={{ marginBottom: 28 }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/marketplace')}>
                <span>Explore Marketplace</span>
                <ArrowRight size={18} />
              </Button>
            </div>

            {/* Quick Category Badges */}
            <div className="cart-quick-categories">
              <span className="cart-quick-label">Browse by harvest</span>
              <div className="cart-quick-pills">
                <button type="button" onClick={() => navigate('/marketplace?category=cat-veg')} className="cart-quick-pill">
                  🥬 Fresh Vegetables
                </button>
                <button type="button" onClick={() => navigate('/marketplace?category=cat-fruit')} className="cart-quick-pill">
                  🍇 Orchard Fruits
                </button>
                <button type="button" onClick={() => navigate('/marketplace?category=cat-grains')} className="cart-quick-pill">
                  🌾 Native Grains
                </button>
              </div>
            </div>
          </div>

          {/* Trending Dawn Harvest Section */}
          {suggestedProducts.length > 0 && (
            <div className="cart-suggested-section">
              <div className="flex-row items-center justify-between" style={{ marginBottom: 18 }}>
                <div>
                  <h3 className="heading-3 flex-row items-center gap-2">
                    <Sparkles size={18} style={{ color: 'var(--accent)' }} />
                    <span>Picked at Dawn Today</span>
                  </h3>
                  <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
                    Fresh arrivals from certified Nashik & Pune farm gates
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/marketplace')}
                  className="text-caption font-bold flex-row items-center gap-1"
                  style={{ color: 'var(--accent)' }}
                >
                  <span>View all</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="cart-suggested-grid">
                {suggestedProducts.map((p) => {
                  const pName = language === 'hi' && p.name_hi ? p.name_hi : p.name;
                  return (
                    <div key={p.id} className="cart-suggested-card">
                      <img
                        src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'}
                        alt={pName}
                        className="cart-suggested-img"
                      />
                      <div className="cart-suggested-info">
                        <div>
                          <span className="cart-suggested-farm">{p.farmer?.farm_name || 'Verified Farm'}</span>
                          <h4 className="cart-suggested-title">{pName}</h4>
                        </div>
                        <div className="flex-row items-center justify-between" style={{ marginTop: 10 }}>
                          <span className="cart-suggested-price">
                            {formatPaise(p.price_paise, language)} <span className="cart-suggested-unit">/ {p.unit}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(p, p.min_order_quantity || 1)}
                            className="cart-add-btn"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-content cart-page-container">


      <div className="flex-row items-center justify-between" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="heading-2">{t.nav.cart}</h1>
          <p className="text-subtle">
            {cartGroups.length} {cartGroups.length > 1 ? 'Farm Producers' : 'Farm Producer'} in this basket
          </p>
        </div>
        <button onClick={clearCart} className="cart-clear-btn">
          Clear All
        </button>
      </div>

      {/* Multi-Farmer Notice */}
      {cartGroups.length > 1 && (
        <div className="card card-padded flex-row items-center gap-2" style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: '#fde68a', marginBottom: 20, padding: 12 }}>
          <AlertCircle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
          <p className="text-caption" style={{ color: '#78350f' }}>
            <strong>Multi-farm order:</strong> Your cart includes produce from {cartGroups.length} independent local farmers. 
            Each farm prepares and packages their harvest fresh for you.
          </p>
        </div>
      )}

      {/* Desktop Split Zones: Left 68% Items, Right 32% Order Summary (Directive 7) */}
      <div className="cart-workspace-grid">
        {/* Left 68%: Items & Farm Groups */}
        <div className="cart-items-column">
          {cartGroups.map((group) => {
            const farmName = language === 'hi' && group.farmer.farm_name_hi ? group.farmer.farm_name_hi : group.farmer.farm_name;
            const remainingForFree = Math.max(0, 50000 - group.subtotal_paise);
            const percentFree = Math.min(100, Math.round((group.subtotal_paise / 50000) * 100));

            return (
              <div key={group.farmer.id} className="cart-group-card">
                <div className="cart-group-header">
                  <div className="flex-row items-center gap-2">
                    <span style={{ fontSize: '1.25rem' }}>🌱</span>
                    <div>
                      <h3 className="heading-4">{farmName}</h3>
                      <span className="text-caption flex-row items-center gap-1">
                        <MapPin size={11} />
                        <span>{group.farmer.village}, {group.farmer.district}</span>
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-body">{formatPaise(group.subtotal_paise, language)}</span>
                </div>

                {/* Free Delivery Meter */}
                <div className="cart-free-meter">
                  <div className="flex-row items-center justify-between text-caption">
                    <span className="flex-row items-center gap-1" style={{ fontWeight: 600 }}>
                      <Truck size={13} style={{ color: 'var(--color-primary)' }} />
                      {remainingForFree === 0 ? (
                        <strong style={{ color: 'var(--color-primary)' }}>FREE Farm Delivery Unlocked!</strong>
                      ) : (
                        <span>Add {formatPaise(remainingForFree, language)} more for FREE delivery</span>
                      )}
                    </span>
                    <span className="font-bold">{percentFree}%</span>
                  </div>
                  <div className="cart-progress-bar">
                    <div className="cart-progress-fill" style={{ width: `${percentFree}%` }} />
                  </div>
                </div>

                {/* Items in this farm group */}
                <div>
                  {group.items.map(({ product, quantity, subtotal_paise }) => {
                    const pName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
                    const available = product.inventory?.available_quantity ?? 999;

                    return (
                      <div key={product.id} className="cart-item-row">
                        <div className="flex-row items-center gap-3">
                          <img
                            src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'}
                            alt={pName}
                            style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                          />
                          <div>
                            <h4 className="heading-4" style={{ fontSize: '0.8125rem' }}>{pName}</h4>
                            <span className="text-caption">{formatPaise(product.price_paise, language)} / {product.unit}</span>
                          </div>
                        </div>

                        <div className="flex-row items-center gap-3">
                          <div className="product-stepper">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - (product.unit_step || 1))}
                              className="stepper-btn"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="stepper-value">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + (product.unit_step || 1))}
                              disabled={quantity >= available}
                              className="stepper-btn"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="font-bold text-body" style={{ minWidth: 60, textAlign: 'right' }}>
                            {formatPaise(subtotal_paise, language)}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: 4, color: 'var(--color-text-light)' }}
                            title="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 32%: Sticky Summary with Prominent Grand Total */}
        <div className="cart-summary-column">
          <div className="cart-summary-card cart-sticky-summary">
            <h3 className="heading-4" style={{ marginBottom: 14, fontWeight: 700 }}>
              Order Bill Details
            </h3>
            <div className="cart-summary-line">
              <span>Produce Subtotal:</span>
              <strong>{formatPaise(totalSubtotalPaise, language)}</strong>
            </div>
            <div className="cart-summary-line">
              <span>Delivery Charges:</span>
              <strong>{totalDeliveryFeePaise === 0 ? <span style={{ color: 'var(--color-primary)' }}>FREE</span> : formatPaise(totalDeliveryFeePaise, language)}</strong>
            </div>
            <div className="cart-summary-total">
              <span>Grand Total:</span>
              <span className="cart-grand-total-amount">{formatPaise(grandTotalPaise, language)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/checkout')}
              style={{ marginTop: 18 }}
            >
              <span>{t.common.checkout}</span>
              <ArrowRight size={18} />
            </Button>

            <div className="cart-trust-note">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Direct farmer settlements • 100% Quality guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
