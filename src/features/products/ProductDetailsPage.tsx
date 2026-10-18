import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, MapPin, Calendar, Clock, Award, ShieldCheck, MessageCircle } from 'lucide-react';
import { productService } from './product.service';
import { Product } from './product.types';
import { formatPaise, formatWeight } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../cart/CartContext';
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
    <div className="product-detail-container">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="detail-back-link">
        <ArrowLeft size={15} />
        <span>Back to listings</span>
      </button>

      <div className="product-details-grid">
        {/* Left Column: Media & Freshness Proof */}
        <div className="detail-media-column">
          <div className="product-detail-img-box">
            <img src={imageUrl} alt={productName} className="product-detail-img" />

            {/* Badges on Image */}
            {product.is_certified_organic && (
              <div className="detail-image-badges">
                <span className="detail-badge-organic">
                  <Award size={13} />
                  <span>{t.common.organicCertified}</span>
                </span>
              </div>
            )}

            {/* Bottom Olive Harvest Ribbon */}
            <div className="detail-image-ribbon">
              <span>{product.harvest_date ? `Free Delivery · Harvested ${product.harvest_date}` : 'Free Delivery · Fresh Morning Harvest'}</span>
            </div>
          </div>

          {/* Freshness Metrics Cards */}
          <div className="detail-metrics-row">
            {product.harvest_date && (
              <div className="detail-metric-card">
                <span className="detail-metric-label">{t.common.harvestedOn}</span>
                <span className="detail-metric-value">
                  <Calendar size={14} style={{ color: '#15803d' }} />
                  <span>{product.harvest_date}</span>
                </span>
              </div>
            )}
            {product.shelf_life_days && (
              <div className="detail-metric-card">
                <span className="detail-metric-label">{t.common.shelfLife}</span>
                <span className="detail-metric-value">
                  <Clock size={14} style={{ color: '#d97706' }} />
                  <span>{product.shelf_life_days} {t.common.days}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info & Purchase Section */}
        <div className="detail-info-column">
          <div className="detail-header-block">
            <h1 className="detail-product-title">{productName}</h1>

            <div className="detail-price-row">
              <span className="detail-price-amount">
                {formatPaise(product.price_paise, language)}
              </span>
              <span className="detail-price-unit">/ {formatWeight(1, product.unit, language)}</span>
            </div>

            <div className="detail-stock-status">
              <span className="detail-stock-dot" />
              <span>
                {isOutOfStock
                  ? t.common.outOfStock
                  : `${availableQty} ${product.unit} available directly from farmgate`}
              </span>
            </div>
          </div>

          <p className="detail-description">{description}</p>

          {/* Quantity Stepper & Subtotal */}
          {!isOutOfStock && (
            <div className="detail-purchase-box">
              <span className="detail-stepper-label">
                Choose Quantity ({product.unit}):
              </span>

              <div className="detail-stepper-row">
                <div className="detail-stepper-control">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - (product.unit_step || 1)))}
                    disabled={quantity <= product.min_order_quantity}
                    className="detail-stepper-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  <span className="detail-stepper-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(availableQty, quantity + (product.unit_step || 1)))}
                    disabled={quantity >= availableQty}
                    className="detail-stepper-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="detail-subtotal-val">
                  Subtotal: <strong>{formatPaise(product.price_paise * quantity, language)}</strong>
                </div>
              </div>

              {addedToast && (
                <div className="detail-toast-alert">
                  ✓ Added {quantity} {product.unit} to your basket!
                </div>
              )}

              {/* Action Buttons */}
              <div className="detail-actions-row">
                <button type="button" className="detail-add-btn" onClick={handleAdd}>
                  <Plus size={16} />
                  <span>{t.common.addToCart}</span>
                </button>
                <button type="button" className="detail-buy-btn" onClick={handleBuyNow}>
                  <span>{t.common.buyNow}</span>
                </button>
              </div>
            </div>
          )}

          {/* Farmer Provenance Card */}
          {product.farmer && (
            <div className="detail-farmer-card">
              <div className="detail-farmer-header">
                <span className="detail-farmer-pill">Verified Producer</span>
                <Link to={`/farmer/${product.farmer.id}`} className="detail-farm-profile-link">
                  View Farm Profile →
                </Link>
              </div>

              <div className="detail-farmer-row">
                <img
                  src={product.farmer.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                  alt={product.farmer.farm_name}
                  className="detail-farmer-avatar"
                />
                <div>
                  <h4 className="detail-farmer-name">{product.farmer.farm_name}</h4>
                  <span className="detail-farmer-location">
                    <MapPin size={12} />
                    <span>{product.farmer.village}, {product.farmer.district}</span>
                  </span>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-whatsapp-btn"
              >
                <MessageCircle size={15} />
                <span>Contact Farmer on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
