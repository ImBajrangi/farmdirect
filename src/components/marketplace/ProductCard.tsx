import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPaise } from '../../lib/formatting/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';
import '../../features/products/products.css';

interface ProductCardProps {
  product: Product;
}

interface ItemTheme {
  shellBg: string;
  borderColor: string;
  canvasBg: string;
  ribbonBg: string;
  ribbonText: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  accentColor: string;
  shadowColor: string;
}

function getItemTheme(slug: string): ItemTheme {
  const s = slug.toLowerCase();

  // 1. Red Onions -> Soft Blush Rose & Deep Crimson Accents
  if (s.includes('onion') || s.includes('kanda')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(225, 29, 72, 0.12)',
      canvasBg: '#FFF1F2',
      ribbonBg: '#FFE4E6',
      ribbonText: '#9F1239',
      pillBg: 'rgba(225, 29, 72, 0.06)',
      pillText: '#9F1239',
      pillBorder: 'rgba(225, 29, 72, 0.16)',
      accentColor: '#BE123C',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 2. Grapes -> Soft Lilac & Deep Violet Accents
  if (s.includes('grape') || s.includes('draksh')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(147, 51, 234, 0.12)',
      canvasBg: '#F5F3FF',
      ribbonBg: '#EDE9FE',
      ribbonText: '#6B21A8',
      pillBg: 'rgba(147, 51, 234, 0.06)',
      pillText: '#6B21A8',
      pillBorder: 'rgba(147, 51, 234, 0.16)',
      accentColor: '#7E22CE',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 3. Spinach & Green Veggies -> Soft Mint & Emerald Accents
  if (s.includes('spinach') || s.includes('palak') || s.includes('methi')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(22, 163, 74, 0.12)',
      canvasBg: '#F0FDF4',
      ribbonBg: '#DCFCE7',
      ribbonText: '#15803D',
      pillBg: 'rgba(22, 163, 74, 0.06)',
      pillText: '#15803D',
      pillBorder: 'rgba(22, 163, 74, 0.16)',
      accentColor: '#16A34A',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 4. Wheat / Grains -> Soft Warm Amber & Golden Harvest Accents
  if (s.includes('wheat') || s.includes('gehu') || s.includes('grain') || s.includes('cereal') || s.includes('rice')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(217, 119, 6, 0.12)',
      canvasBg: '#FFFBEB',
      ribbonBg: '#FEF3C7',
      ribbonText: '#92400E',
      pillBg: 'rgba(217, 119, 6, 0.06)',
      pillText: '#92400E',
      pillBorder: 'rgba(217, 119, 6, 0.16)',
      accentColor: '#B45309',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 5. Gir Cow Ghee & Dairy -> Soft Sunlit Cream & Honey Gold Accents
  if (s.includes('ghee') || s.includes('dairy') || s.includes('toop') || s.includes('milk')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(202, 138, 4, 0.12)',
      canvasBg: '#FEFCE8',
      ribbonBg: '#FEF9C3',
      ribbonText: '#854D0E',
      pillBg: 'rgba(202, 138, 4, 0.06)',
      pillText: '#854D0E',
      pillBorder: 'rgba(202, 138, 4, 0.16)',
      accentColor: '#A16207',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 6. Tomatoes & Spices -> Soft Pastel Coral & Ripe Field Crimson Accents
  if (s.includes('tomato') || s.includes('chilli') || s.includes('spice') || s.includes('masala')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(239, 68, 68, 0.12)',
      canvasBg: '#FEF2F2',
      ribbonBg: '#FEE2E2',
      ribbonText: '#991B1B',
      pillBg: 'rgba(239, 68, 68, 0.06)',
      pillText: '#991B1B',
      pillBorder: 'rgba(239, 68, 68, 0.16)',
      accentColor: '#DC2626',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // Default Organic Leaf Green
  return {
    shellBg: '#FFFFFF',
    borderColor: 'rgba(22, 163, 74, 0.12)',
    canvasBg: '#F0FDF4',
    ribbonBg: '#DCFCE7',
    ribbonText: '#15803D',
    pillBg: 'rgba(22, 163, 74, 0.06)',
    pillText: '#15803D',
    pillBorder: 'rgba(22, 163, 74, 0.16)',
    accentColor: '#16A34A',
    shadowColor: 'rgba(15, 46, 34, 0.06)',
  };
}

function getCleanTitle(name: string): string {
  if (name.includes('Nashik Garva Red Onions')) return 'Nashik Red Onions';
  if (name.includes('Thompson Seedless')) return 'Thompson Grapes';
  if (name.includes('Tender Spinach')) return 'Tender Spinach';
  if (name.includes('Lokwan Heritage')) return 'Lokwan Wheat';
  if (name.includes('Gir Cow Bilona')) return 'Gir Cow Ghee';
  if (name.includes('Country Tomatoes') || name.includes('देशी लाल टमाटर')) return 'Vine Tomatoes';
  return name;
}

function formatHarvestDate(dateStr?: string, lang?: string): string {
  if (!dateStr) return lang === 'hi' ? 'आजची ताजी तोडणी' : 'Fresh Morning Harvest';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${monthNames[month]}`;
      }
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useTranslation();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const currentQty = getItemQuantity(product.id);
  const availableQty = product.inventory?.available_quantity ?? 999;
  const isOutOfStock = availableQty <= 0;

  const imageUrl = product.images?.[0]?.image_url || 
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

  const cleanTitle = getCleanTitle(language === 'hi' && product.name_hi ? product.name_hi : product.name);
  const village = product.farmer?.village || 'Nashik';
  const unitLabel = product.unit ? `1 ${product.unit}` : '1 kg';
  const theme = getItemTheme(product.slug);

  // Dynamic price scaling with quantity
  const effectiveQty = currentQty > 0 ? currentQty : 1;
  const displayPricePaise = Math.round(product.price_paise * effectiveQty);

  return (
    <div
      className="product-card-b"
      style={{
        backgroundColor: theme.shellBg,
        borderColor: theme.borderColor,
        boxShadow: `0 16px 36px -4px ${theme.shadowColor}`,
      }}
    >
      {/* Top Media Canvas */}
      <div className="product-canvas-b" style={{ backgroundColor: theme.canvasBg }}>
        <Link to={`/product/${product.slug}`} className="product-canvas-link-b" aria-label={cleanTitle}>
          <img src={imageUrl} alt={cleanTitle} loading="lazy" className="product-canvas-img-b" />
        </Link>

        {/* Curved Olive Bottom Ribbon */}
        <div
          className="product-canvas-ribbon-b"
          style={{ backgroundColor: theme.ribbonBg, color: theme.ribbonText }}
        >
          <span>
            {product.harvest_date
              ? `Free Delivery · Harvested ${formatHarvestDate(product.harvest_date, language)}`
              : 'Free Delivery · Fresh Morning Harvest'}
          </span>
        </div>
      </div>

      {/* Harmonious Synchronized Footer (Google / Apple Design Hierarchy) */}
      <div className="product-footer-unified-b">
        {/* Title: 2-line clamped with fixed min-height for perfectly uniform grid rows */}
        <Link to={`/product/${product.slug}`} className="product-title-b" title={product.name}>
          {cleanTitle}
        </Link>

        {/* Origin & Unit Tags: Always anchor the produce details */}
        <div className="product-tags-row-b">
          <span
            className="product-trait-pill-b"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
            }}
          >
            {village}
          </span>
          <span
            className="product-trait-pill-b"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
            }}
          >
            {unitLabel}
          </span>
        </div>

        {/* Synchronized Price & Action Row: Anchored base row */}
        <div className="product-bottom-bar-b">
          <div className="product-price-block-b">
            <span className="product-price-val-b">
              {formatPaise(displayPricePaise, language)}
            </span>
            <span className="product-unit-sub-b">
              {currentQty > 0
                ? `${currentQty} × ${unitLabel}`
                : `per ${unitLabel}`}
            </span>
          </div>

          <div className="product-action-slot-b">
            {isOutOfStock ? (
              <span className="product-soldout-b">Sold Out</span>
            ) : currentQty > 0 ? (
              <div className="product-stepper-b">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, currentQty - (product.unit_step || 1))}
                  className="stepper-btn-b"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} strokeWidth={2.6} />
                </button>
                <span className="stepper-qty-b">{currentQty}</span>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={currentQty >= availableQty}
                  className="stepper-btn-b"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} strokeWidth={2.6} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="product-order-btn-b"
                aria-label={`Order ${cleanTitle} Now`}
              >
                <span>Order Now</span>
                <ArrowUpRight size={13} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
