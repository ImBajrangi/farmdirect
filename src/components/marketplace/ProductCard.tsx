import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { formatPaise } from '../../lib/formatting/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';
import '../../features/products/products.css';
import { isVegetableProduct, isFruitProduct } from '../../features/products/ProductList';

interface ProductCardProps {
  product: Product;
}

export interface CategoryBadge {
  labelEn: string;
  labelHi: string;
  icon: string;
  type: 'veg' | 'fruit' | 'grain' | 'dairy' | 'pulse' | 'spice';
}

export interface ItemTheme {
  shellBg: string;
  borderColor: string;
  canvasBg: string;
  ribbonBg: string;
  ribbonText: string;
  accentColor: string;
  shadowColor: string;
  categoryBadge: CategoryBadge;
}

function getItemTheme(product: Product): ItemTheme {
  const s = ((product.slug || '') + ' ' + (product.name || '')).toLowerCase();
  const catSlug = product.category?.slug?.toLowerCase() || '';
  const catId = product.category_id || '';

  // 1. FRUITS & BASKETS (Lavender / Berry Ruby / Orchard Violet)
  if (isFruitProduct(product as any)) {
    // 1a. Strawberries & Berries -> Rich Berry Blush
    if (s.includes('strawberr') || s.includes('berry')) {
      return {
        shellBg: '#FFFFFF',
        borderColor: 'rgba(225, 29, 72, 0.18)',
        canvasBg: '#FFF1F2',
        ribbonBg: '#FFE4E6',
        ribbonText: '#BE123C',
        accentColor: '#E11D48',
        shadowColor: 'rgba(225, 29, 72, 0.08)',
        categoryBadge: { labelEn: 'Fruit', labelHi: 'फळे', icon: '', type: 'fruit' },
      };
    }

    // 1b. Apples -> Crisp Orchard Red-Blush
    if (s.includes('apple') || s.includes('seb')) {
      return {
        shellBg: '#FFFFFF',
        borderColor: 'rgba(220, 38, 38, 0.16)',
        canvasBg: '#FFF5F5',
        ribbonBg: '#FEE2E2',
        ribbonText: '#B91C1C',
        accentColor: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.08)',
        categoryBadge: { labelEn: 'Fruit', labelHi: 'फळे', icon: '🍎', type: 'fruit' },
      };
    }

    // 1c. Curated Seasonal Fruit Basket -> Regal Orchard Lilac
    if (s.includes('basket')) {
      return {
        shellBg: '#FFFFFF',
        borderColor: 'rgba(147, 51, 234, 0.20)',
        canvasBg: '#FAF5FF',
        ribbonBg: '#F3E8FF',
        ribbonText: '#7E22CE',
        accentColor: '#9333EA',
        shadowColor: 'rgba(147, 51, 234, 0.09)',
        categoryBadge: { labelEn: 'Fruit Basket', labelHi: 'फळ बास्केट', icon: '🧺', type: 'fruit' },
      };
    }

    // 1d. Grapes & Other Sun-Ripened Fruits -> Orchard Lilac / Violet
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(147, 51, 234, 0.18)',
      canvasBg: '#FAF5FF',
      ribbonBg: '#EDE9FE',
      ribbonText: '#6B21A8',
      accentColor: '#9333EA',
      shadowColor: 'rgba(147, 51, 234, 0.08)',
      categoryBadge: { labelEn: 'Fruit', labelHi: 'फळे', icon: '🍇', type: 'fruit' },
    };
  }

  // 2. VEGETABLES (Crisp Morning Mint & Leaf Emerald / Earthy Onion Blush)
  if (isVegetableProduct(product as any)) {
    // 2a. Red Onions -> Soft Earthy Rose Blush Canvas
    if (s.includes('onion') || s.includes('kanda')) {
      return {
        shellBg: '#FFFFFF',
        borderColor: 'rgba(190, 18, 60, 0.16)',
        canvasBg: '#FFF5F5',
        ribbonBg: '#FFE4E6',
        ribbonText: '#9F1239',
        accentColor: '#BE123C',
        shadowColor: 'rgba(190, 18, 60, 0.06)',
        categoryBadge: { labelEn: 'Fresh Veg', labelHi: 'भाजीपाला', icon: '🧅', type: 'veg' },
      };
    }

    // 2b. Tomatoes -> Vibrant Garden Coral
    if (s.includes('tomato') || s.includes('tamatar')) {
      return {
        shellBg: '#FFFFFF',
        borderColor: 'rgba(220, 38, 38, 0.16)',
        canvasBg: '#FEF2F2',
        ribbonBg: '#FEE2E2',
        ribbonText: '#991B1B',
        accentColor: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.06)',
        categoryBadge: { labelEn: 'Fresh Veg', labelHi: 'भाजीपाला', icon: '🍅', type: 'veg' },
      };
    }

    // 2c. Spinach & Leafy Greens & General Veggies -> Botanical Dew Mint
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(22, 163, 74, 0.18)',
      canvasBg: '#F0FDF4',
      ribbonBg: '#DCFCE7',
      ribbonText: '#15803D',
      accentColor: '#16A34A',
      shadowColor: 'rgba(22, 163, 74, 0.06)',
      categoryBadge: { labelEn: 'Fresh Veg', labelHi: 'भाजीपाला', icon: '🥬', type: 'veg' },
    };
  }

  // 3. GRAINS & CEREALS -> Warm Sun-Baked Amber Gold
  if (catId === 'cat-grains' || catSlug.includes('grain') || s.includes('wheat') || s.includes('gehu') || s.includes('rice') || s.includes('cereal')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(180, 83, 9, 0.16)',
      canvasBg: '#FFFBEB',
      ribbonBg: '#FEF3C7',
      ribbonText: '#92400E',
      accentColor: '#B45309',
      shadowColor: 'rgba(180, 83, 9, 0.06)',
      categoryBadge: { labelEn: 'Grain', labelHi: 'धान्य', icon: '🌾', type: 'grain' },
    };
  }

  // 4. DAIRY & FARM ESSENTIALS -> Warm Vedic Cream Gold
  if (catId === 'cat-dairy' || catSlug.includes('dairy') || s.includes('ghee') || s.includes('toop') || s.includes('milk') || s.includes('butter')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(161, 98, 7, 0.16)',
      canvasBg: '#FEFCE8',
      ribbonBg: '#FEF9C3',
      ribbonText: '#854D0E',
      accentColor: '#A16207',
      shadowColor: 'rgba(161, 98, 7, 0.06)',
      categoryBadge: { labelEn: 'Pure Dairy', labelHi: 'डेअरी', icon: '🥛', type: 'dairy' },
    };
  }

  // 5. SPICES & SEASONINGS -> Warm Sun-Dried Terracotta
  if (catId === 'cat-spices' || catSlug.includes('spice') || s.includes('spice') || s.includes('masala') || s.includes('turmeric') || s.includes('chilli')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(234, 88, 12, 0.16)',
      canvasBg: '#FFF7ED',
      ribbonBg: '#FFEDD5',
      ribbonText: '#C2410C',
      accentColor: '#EA580C',
      shadowColor: 'rgba(234, 88, 12, 0.06)',
      categoryBadge: { labelEn: 'Spice', labelHi: 'मसाले', icon: '🌶️', type: 'spice' },
    };
  }

  // 6. PULSES & LENTILS -> Natural Hearth Amber
  if (catId === 'cat-pulses' || catSlug.includes('pulse') || s.includes('dal') || s.includes('lentil')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(217, 119, 6, 0.16)',
      canvasBg: '#FFFBEB',
      ribbonBg: '#FEF3C7',
      ribbonText: '#B45309',
      accentColor: '#D97706',
      shadowColor: 'rgba(217, 119, 6, 0.06)',
      categoryBadge: { labelEn: 'Pulse', labelHi: 'कडधान्य', icon: '🥣', type: 'pulse' },
    };
  }

  // Fallback: Default Farm Direct Organic Dew Green
  return {
    shellBg: '#FFFFFF',
    borderColor: 'rgba(15, 46, 34, 0.10)',
    canvasBg: '#F4F7F4',
    ribbonBg: '#DCFCE7',
    ribbonText: '#15803D',
    accentColor: '#16A34A',
    shadowColor: 'rgba(15, 46, 34, 0.06)',
    categoryBadge: { labelEn: 'Farm Direct', labelHi: 'थेट शेतातून', icon: '🌱', type: 'veg' },
  };
}

interface ParsedTitle {
  primary: string;
  regional?: string;
}

function parseProductTitle(rawName: string, nameHi?: string, lang?: string): ParsedTitle {
  // If language is Hindi and nameHi is available
  if (lang === 'hi' && nameHi) {
    return { primary: nameHi };
  }

  let title = rawName;
  if (title.includes('Nashik Garva Red Onions') || title.includes('Nashik Red Onions')) title = 'Nashik Red Onions';
  else if (title.includes('Thompson Seedless')) title = 'Thompson Grapes';
  else if (title.includes('Tender Spinach')) title = 'Tender Spinach';
  else if (title.includes('Lokwan')) title = 'Lokwan Wheat';
  else if (title.includes('Gir Cow Bilona')) title = 'Gir Cow Ghee';
  else if (title.includes('Country Tomatoes') || title.includes('देशी लाल टमाटर')) title = 'Vine Tomatoes';

  // Check for bilingual parenthetical names e.g. "Nashik Red Onions (नाशिक लाल कांदा)"
  const parenMatch = rawName.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    const main = parenMatch[1].trim();
    const sub = parenMatch[2].trim();
    if (lang === 'hi') {
      return { primary: sub, regional: main };
    }
    return { primary: title, regional: sub };
  }

  return { primary: title };
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

  const titleData = parseProductTitle(product.name, product.name_hi, language);
  const village = product.farmer?.village || 'Nashik';
  const unitLabel = product.unit ? `1 ${product.unit}` : '1 kg';
  const theme = getItemTheme(product);

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
        <Link to={`/product/${product.slug}`} className="product-canvas-link-b" aria-label={titleData.primary}>
          <img src={imageUrl} alt={titleData.primary} loading="lazy" className="product-canvas-img-b" />
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
        {/* Title Group: Clean Primary Name + Regional Subtitle */}
        <div className="product-title-group-b">
          <Link to={`/product/${product.slug}`} className="product-title-b" title={product.name}>
            {titleData.primary}
          </Link>
          {titleData.regional && (
            <span className="product-regional-sub-b">{titleData.regional}</span>
          )}
        </div>

        {/* Produce Category Pill & Farm Badges */}
        <div className="product-tags-row-b">
          {theme.categoryBadge && (
            <span className={`product-category-pill-b ${theme.categoryBadge.type}`}>
              <span className="cat-pill-icon">{theme.categoryBadge.icon}</span>
              <span>{language === 'hi' ? theme.categoryBadge.labelHi : theme.categoryBadge.labelEn}</span>
            </span>
          )}
          <span className="product-trait-pill-b origin">
            <MapPin size={11} className="trait-icon" />
            <span>{village}</span>
          </span>
          <span className="product-trait-pill-b verified">
            <ShieldCheck size={11} className="trait-icon" />
            <span>Direct Farm</span>
          </span>
        </div>

        {/* Synchronized Price & Action Row: Anchored base row */}
        <div className="product-bottom-bar-b">
          <div className="product-price-block-b">
            <div className="product-price-main-b">
              <span className="product-price-val-b">
                {formatPaise(displayPricePaise, language)}
              </span>
              <span className="product-unit-inline-b">
                / {unitLabel}
              </span>
            </div>
            {currentQty > 0 && (
              <span className="product-qty-sub-b">
                {currentQty} × {unitLabel}
              </span>
            )}
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
                aria-label={`Order ${titleData.primary} Now`}
              >
                <span>Order Now</span>
                <ArrowRight size={13} strokeWidth={2.4} className="order-btn-arrow" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
