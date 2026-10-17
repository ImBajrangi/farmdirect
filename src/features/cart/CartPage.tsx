import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MapPin, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';
import { formatPaise } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import './cart.css';

export const CartPage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    cartGroups,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalSubtotalPaise,
    totalDeliveryFeePaise,
    grandTotalPaise,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-container page-content">
        <EmptyState
          icon="🛒"
          title="Your Basket is Empty"
          description="Explore our local Maharashtra farmers to get fresh produce delivered direct."
          action={
            <Button variant="primary" onClick={() => navigate('/marketplace')}>
              Explore Produce
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container page-content" style={{ maxWidth: 840 }}>
      <div className="flex-row items-center justify-between" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="heading-2">{t.nav.cart}</h1>
          <p className="text-subtle">
            {cartGroups.length} {cartGroups.length > 1 ? 'Farm Producers' : 'Farm Producer'} in this basket
          </p>
        </div>
        <button onClick={clearCart} className="text-caption font-bold" style={{ color: 'var(--color-danger)' }}>
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

      {/* Farm Groups */}
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

      {/* Summary Card */}
      <div className="cart-summary-card">
        <h3 className="heading-4" style={{ textTransform: 'uppercase', marginBottom: 12 }}>
          Bill Details
        </h3>
        <div className="cart-summary-line">
          <span>Produce Subtotal:</span>
          <strong>{formatPaise(totalSubtotalPaise, language)}</strong>
        </div>
        <div className="cart-summary-line">
          <span>Delivery Fees:</span>
          <strong>{totalDeliveryFeePaise === 0 ? <span style={{ color: 'var(--color-primary)' }}>FREE</span> : formatPaise(totalDeliveryFeePaise, language)}</strong>
        </div>
        <div className="cart-summary-total">
          <span>Grand Total:</span>
          <span style={{ color: 'var(--color-primary-dark)' }}>{formatPaise(grandTotalPaise, language)}</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/checkout')}
          style={{ marginTop: 16 }}
        >
          <span>{t.common.checkout}</span>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};
