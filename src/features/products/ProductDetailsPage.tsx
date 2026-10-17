import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, MapPin, Calendar, Clock, Award, ShieldCheck, MessageCircle } from 'lucide-react';
import { productService } from './product.service';
import { Product } from './product.types';
import { formatPaise, formatWeight } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../cart/cart.context';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { notificationService } from '../../services/notifications';
import './products.css';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const item = await productService.getProductBySlug(slug);
        setProduct(item);
        if (item) setQuantity(item.min_order_quantity || 1);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <Loader message="Loading fresh harvest details..." />;

  if (!product) {
    return (
      <div className="page-container" style={{ padding: '48px 16px', textAlign: 'center' }}>
        <h2 className="heading-3">Produce Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/marketplace')} style={{ marginTop: 16 }}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const productName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
  const description = language === 'hi' && product.description_hi ? product.description_hi : product.description;
  const imageUrl = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
  const availableQty = product.inventory?.available_quantity ?? 999;
  const isOutOfStock = availableQty <= 0;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const whatsappLink = notificationService.createWhatsAppLink(
    product.farmer?.user?.phone || '9822012345',
    `Hello ${product.farmer?.farm_name || 'Farmer'}, I am inquiring on FarmDirect regarding ${product.name}.`
  );

  return (
    <div className="page-container page-content">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 16, paddingLeft: 0 }}>
        <ArrowLeft size={16} />
        <span>Back to listings</span>
      </button>

      <div className="product-details-grid">
        {/* Left: Media */}
        <div>
          <div className="product-detail-img-box">
            <img src={imageUrl} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            {product.harvest_date && (
              <div className="card card-padded" style={{ padding: 12 }}>
                <span className="text-caption" style={{ display: 'block' }}>{t.common.harvestedOn}</span>
                <span className="font-bold flex-row items-center gap-1" style={{ fontSize: '0.8125rem' }}>
                  <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
                  <span>{product.harvest_date}</span>
                </span>
              </div>
            )}
            {product.shelf_life_days && (
              <div className="card card-padded" style={{ padding: 12 }}>
                <span className="text-caption" style={{ display: 'block' }}>{t.common.shelfLife}</span>
                <span className="font-bold flex-row items-center gap-1" style={{ fontSize: '0.8125rem' }}>
                  <Clock size={13} style={{ color: 'var(--color-accent)' }} />
                  <span>{product.shelf_life_days} {t.common.days}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info & Purchase */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              {product.is_certified_organic && (
                <span className="badge badge-organic" style={{ marginBottom: 8 }}>
                  <Award size={12} />
                  <span>{t.common.organicCertified}</span>
                </span>
              )}
              <h1 className="heading-2">{productName}</h1>
              <div className="flex-row items-center gap-2" style={{ marginTop: 8 }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary-dark)' }}>
                  {formatPaise(product.price_paise, language)}
                </span>
                <span className="text-subtle">/ {formatWeight(1, product.unit, language)}</span>
              </div>
            </div>

            <p className="text-body" style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
              {description}
            </p>

            {/* Stepper Quantity */}
            {!isOutOfStock && (
              <div style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ marginBottom: 6, display: 'block' }}>
                  Choose Quantity ({product.unit}):
                </label>
                <div className="flex-row items-center gap-3">
                  <div className="product-stepper" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - (product.unit_step || 1)))}
                      disabled={quantity <= product.min_order_quantity}
                      className="stepper-btn"
                      style={{ width: 38, height: 38 }}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="stepper-value" style={{ minWidth: 44, fontSize: '0.875rem' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(availableQty, quantity + (product.unit_step || 1)))}
                      disabled={quantity >= availableQty}
                      className="stepper-btn"
                      style={{ width: 38, height: 38 }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-subtle">
                    Subtotal: <strong>{formatPaise(product.price_paise * quantity, language)}</strong>
                  </span>
                </div>
              </div>
            )}

            {addedToast && (
              <div style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', padding: 10, borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.75rem', marginBottom: 12 }}>
                ✓ Added {quantity} {product.unit} to your basket!
              </div>
            )}

            {/* Actions */}
            {!isOutOfStock && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Button variant="outline" onClick={handleAdd}>
                  <Plus size={16} />
                  <span>{t.common.addToCart}</span>
                </Button>
                <Button variant="primary" onClick={handleBuyNow}>
                  <span>{t.common.buyNow}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Farmer Card */}
          {product.farmer && (
            <div className="card card-padded" style={{ marginTop: 24, backgroundColor: 'var(--color-surface-subtle)' }}>
              <div className="flex-row items-center justify-between" style={{ marginBottom: 8 }}>
                <span className="text-caption font-bold">PRODUCER</span>
                <Link to={`/farmer/${product.farmer.id}`} className="text-caption font-bold" style={{ color: 'var(--color-primary)' }}>
                  View Farm Profile →
                </Link>
              </div>

              <div className="flex-row items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={product.farmer.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 className="heading-4">{product.farmer.farm_name}</h4>
                  <span className="text-caption flex-row items-center gap-1">
                    <MapPin size={11} />
                    <span>{product.farmer.village}, {product.farmer.district}</span>
                  </span>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ backgroundColor: '#25d366', color: '#ffffff', width: '100%', marginTop: 12 }}
              >
                <MessageCircle size={14} />
                <span>Contact Farmer on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
