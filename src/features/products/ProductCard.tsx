import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, MapPin, ShieldCheck } from 'lucide-react';
import { Product } from './product.types';
import { formatPaise } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../cart/CartContext';
import './products.css';

interface ProductCardProps {
  product: Product;
}

import { isVegetableProduct, isFruitProduct } from './ProductList';

// Dynamic item color scheme according to produce type
export interface CategoryBadge {
  labelEn: string;
  labelHi: string;
  icon: string;
  type: 'veg' | 'fruit' | 'grain' | 'dairy' | 'pulse' | 'spice';
}

export interface ItemTheme {
  shellBg: string;
  canvasBg: string;
  ribbonBg: string;
  ribbonText: string;
  accentColor: string;
  tagBg: string;
  tagText: string;
  badgeBg: string;
  badgeText: string;
  badgeIcon: string;
  shadowColor: string;
  categoryBadge: CategoryBadge;
}

function getItemTheme(product: Product): ItemTheme {
  const s = ((product.slug || '') + ' ' + (product.name || '')).toLowerCase();
  const catSlug = product.category?.slug?.toLowerCase() || '';
  const catId = product.category_id || '';

  // 1. FRUITS & BASKETS (Berry Pink / Orchard Ruby / Grape Violet)
  if (isFruitProduct(product)) {
    // 1a. Strawberries & Berries -> Rich Berry Pink
    if (s.includes('strawberr') || s.includes('berry')) {
      return {
        shellBg: '#FFFFFF',
        canvasBg: '#FFF1F2',
        ribbonBg: '#FFE4E6',
        ribbonText: '#BE123C',
        accentColor: '#E11D48',
        tagBg: '#FFE4E6',
        tagText: '#BE123C',
        badgeBg: '#FFF1F2',
        badgeText: '#9F1239',
        badgeIcon: '#E11D48',
        shadowColor: 'rgba(225, 29, 72, 0.16)',
        categoryBadge: { labelEn: 'Fruit', labelHi: 'फळे', icon: '🍓', type: 'fruit' },
      };
    }

    // 1b. Apples -> Crisp Orchard Red
    if (s.includes('apple') || s.includes('seb')) {
      return {
        shellBg: '#FFFFFF',
        canvasBg: '#FFF5F5',
        ribbonBg: '#FEE2E2',
        ribbonText: '#B91C1C',
        accentColor: '#DC2626',
        tagBg: '#FEE2E2',
        tagText: '#B91C1C',
        badgeBg: '#FEF2F2',
        badgeText: '#991B1B',
        badgeIcon: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.16)',
        categoryBadge: { labelEn: 'Fruit', labelHi: 'फळे', icon: '🍎', type: 'fruit' },
      };
    }

    // 1c. Curated Seasonal Fruit Basket -> Regal Orchard Lilac
    if (s.includes('basket')) {
      return {
        shellBg: '#FFFFFF',
        canvasBg: '#FAF5FF',
        ribbonBg: '#F3E8FF',
        ribbonText: '#7E22CE',
        accentColor: '#9333EA',
        tagBg: '#F3E8FF',
        tagText: '#7E22CE',
        badgeBg: '#FAF5FF',
        badgeText: '#6B21A8',
        badgeIcon: '#9333EA',
        shadowColor: 'rgba(147, 51, 234, 0.16)',
        categoryBadge: { labelEn: 'Fruit Basket', labelHi: 'फळ बास्केट', icon: '🧺', type: 'fruit' },
      };
    }

    // 1d. Grapes & Other Sun-Ripened Fruits -> Vineyard Violet
    return {
      shellBg: '#FFFFFF',
      canvasBg: '#F5F3FF',
      ribbonBg: '#EDE9FE',
      ribbonText: '#6B21A8',
      accentColor: '#7C3AED',
      tagBg: '#EDE9FE',
      tagText: '#6B21A8',
      badgeBg: '#F5F3FF',
      badgeText: '#5B21B6',
      badgeIcon: '#7C3AED',
      shadowColor: 'rgba(124, 58, 237, 0.16)',
      categoryBadge: { labelEn: 'Fruit', labelHi: 'फळे', icon: '🍇', type: 'fruit' },
    };
  }

  // 2. VEGETABLES (Crisp Morning Mint & Leaf Emerald / Earthy Onion Rose)
  if (isVegetableProduct(product)) {
    // 2a. Red Onions -> Earthy Rose Onion Blush
    if (s.includes('onion') || s.includes('kanda')) {
      return {
        shellBg: '#FFFFFF',
        canvasBg: '#FFF1F2',
        ribbonBg: '#FFE4E6',
        ribbonText: '#9F1239',
        accentColor: '#BE123C',
        tagBg: '#FFE4E6',
        tagText: '#9F1239',
        badgeBg: '#FFF1F2',
        badgeText: '#881337',
        badgeIcon: '#BE123C',
        shadowColor: 'rgba(190, 18, 60, 0.16)',
        categoryBadge: { labelEn: 'Fresh Veg', labelHi: 'भाजीपाला', icon: '🧅', type: 'veg' },
      };
    }

    // 2b. Tomatoes -> Vibrant Garden Coral Red
    if (s.includes('tomato') || s.includes('tamatar')) {
      return {
        shellBg: '#FFFFFF',
        canvasBg: '#FEF2F2',
        ribbonBg: '#FEE2E2',
        ribbonText: '#991B1B',
        accentColor: '#DC2626',
        tagBg: '#FEE2E2',
        tagText: '#991B1B',
        badgeBg: '#FEF2F2',
        badgeText: '#7F1D1D',
        badgeIcon: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.16)',
        categoryBadge: { labelEn: 'Fresh Veg', labelHi: 'भाजीपाला', icon: '🍅', type: 'veg' },
      };
    }

    // 2c. Spinach & Leafy Greens & General Veggies -> Botanical Dew Mint
    return {
      shellBg: '#FFFFFF',
      canvasBg: '#F0FDF4',
      ribbonBg: '#DCFCE7',
      ribbonText: '#15803D',
      accentColor: '#16A34A',
      tagBg: '#DCFCE7',
      tagText: '#15803D',
      badgeBg: '#F0FDF4',
      badgeText: '#166534',
      badgeIcon: '#15803D',
      shadowColor: 'rgba(22, 163, 74, 0.16)',
      categoryBadge: { labelEn: 'Fresh Veg', labelHi: 'भाजीपाला', icon: '🥬', type: 'veg' },
    };
  }

  // 3. GRAINS & CEREALS -> Warm Sun-Baked Amber Gold
  if (catId === 'cat-grains' || catSlug.includes('grain') || s.includes('wheat') || s.includes('gehu') || s.includes('rice') || s.includes('cereal')) {
    return {
      shellBg: '#FFFFFF',
      canvasBg: '#FFFBEB',
      ribbonBg: '#FEF3C7',
      ribbonText: '#92400E',
      accentColor: '#D97706',
      tagBg: '#FEF3C7',
      tagText: '#92400E',
      badgeBg: '#FFFBEB',
      badgeText: '#78350F',
      badgeIcon: '#D97706',
      shadowColor: 'rgba(180, 83, 9, 0.16)',
      categoryBadge: { labelEn: 'Grain', labelHi: 'धान्य', icon: '🌾', type: 'grain' },
    };
  }

  // 4. DAIRY & FARM ESSENTIALS -> Warm Vedic Cream Gold
  if (catId === 'cat-dairy' || catSlug.includes('dairy') || s.includes('ghee') || s.includes('toop') || s.includes('milk') || s.includes('butter')) {
    return {
      shellBg: '#FFFFFF',
      canvasBg: '#FEFCE8',
      ribbonBg: '#FEF9C3',
      ribbonText: '#854D0E',
      accentColor: '#CA8A04',
      tagBg: '#FEF9C3',
      tagText: '#854D0E',
      badgeBg: '#FEFCE8',
      badgeText: '#713F12',
      badgeIcon: '#CA8A04',
      shadowColor: 'rgba(161, 98, 7, 0.16)',
      categoryBadge: { labelEn: 'Pure Dairy', labelHi: 'डेअरी', icon: '🥛', type: 'dairy' },
    };
  }

  // 5. SPICES & SEASONINGS -> Warm Sun-Dried Terracotta
  if (catId === 'cat-spices' || catSlug.includes('spice') || s.includes('spice') || s.includes('masala') || s.includes('turmeric') || s.includes('chilli')) {
    return {
      shellBg: '#FFFFFF',
      canvasBg: '#FFF7ED',
      ribbonBg: '#FFEDD5',
      ribbonText: '#C2410C',
      accentColor: '#EA580C',
      tagBg: '#FFEDD5',
      tagText: '#C2410C',
      badgeBg: '#FFF7ED',
      badgeText: '#7C2D12',
      badgeIcon: '#EA580C',
      shadowColor: 'rgba(234, 88, 12, 0.16)',
      categoryBadge: { labelEn: 'Spice', labelHi: 'मसाले', icon: '🌶️', type: 'spice' },
    };
  }

  // 6. PULSES & LENTILS -> Natural Hearth Amber
  if (catId === 'cat-pulses' || catSlug.includes('pulse') || s.includes('dal') || s.includes('lentil')) {
    return {
      shellBg: '#FFFFFF',
      canvasBg: '#FFFBEB',
      ribbonBg: '#FEF3C7',
      ribbonText: '#B45309',
      accentColor: '#D97706',
      tagBg: '#FEF3C7',
      tagText: '#B45309',
      badgeBg: '#FFFBEB',
      badgeText: '#78350F',
      badgeIcon: '#D97706',
      shadowColor: 'rgba(217, 119, 6, 0.16)',
      categoryBadge: { labelEn: 'Pulse', labelHi: 'कडधान्य', icon: '🥣', type: 'pulse' },
    };
  }

  // Fallback: Default Farm Direct Organic Dew Green
  return {
    shellBg: '#FFFFFF',
    canvasBg: '#F4F7F4',
    ribbonBg: '#DCFCE7',
    ribbonText: '#15803D',
    accentColor: '#16A34A',
    tagBg: '#DCFCE7',
    tagText: '#15803D',
    badgeBg: '#F0FDF4',
    badgeText: '#166534',
    badgeIcon: '#15803D',
    shadowColor: 'rgba(15, 46, 34, 0.14)',
    categoryBadge: { labelEn: 'Farm Direct', labelHi: 'थेट शेतातून', icon: '🌱', type: 'veg' },
  };
}

// Clean concise display name helper with bilingual parenthetical extraction
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

// Friendly human harvest date formatter
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

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
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
        boxShadow: `0 10px 28px -4px ${theme.shadowColor}, 0 2px 6px -1px rgba(0, 0, 0, 0.03)`,
      }}
    >
      {/* Top Media Canvas */}
      <div className="product-canvas-b" style={{ backgroundColor: theme.canvasBg }}>
        <Link to={`/product/${product.slug}`} className="product-canvas-link-b" aria-label={titleData.primary}>
          <img src={imageUrl} alt={titleData.primary} loading="lazy" className="product-canvas-img-b" />
        </Link>

        {/* Curved Bottom Ribbon */}
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

      {/* Harmonious Synchronized Footer (Apple / Airbnb Quality) */}
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

        {/* Produce Category Pill & Farm Badges Synchronized with Bar Colors */}
        <div className="product-tags-row-b">
          {theme.categoryBadge && (
            <span
              className="product-category-pill-b"
              style={{
                backgroundColor: theme.tagBg,
                color: theme.tagText,
              }}
            >
              <span className="cat-pill-icon">{theme.categoryBadge.icon}</span>
              <span>{language === 'hi' ? theme.categoryBadge.labelHi : theme.categoryBadge.labelEn}</span>
            </span>
          )}
          <span
            className="product-trait-pill-b origin"
            style={{
              backgroundColor: theme.badgeBg,
              color: theme.badgeText,
            }}
          >
            <MapPin size={11} className="trait-icon" style={{ color: theme.badgeIcon }} />
            <span>{village}</span>
          </span>
          <span
            className="product-trait-pill-b verified"
            style={{
              backgroundColor: theme.badgeBg,
              color: theme.badgeText,
            }}
          >
            <ShieldCheck size={11} className="trait-icon" style={{ color: theme.badgeIcon }} />
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
              <span className="product-qty-sub-b" style={{ color: theme.accentColor }}>
                {currentQty} × {unitLabel}
              </span>
            )}
          </div>

          <div className="product-action-slot-b">
            {isOutOfStock ? (
              <span className="product-soldout-b">Sold Out</span>
            ) : currentQty > 0 ? (
              <div
                className="product-stepper-b"
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 4px 14px ${theme.shadowColor}`,
                }}
              >
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
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 4px 14px ${theme.shadowColor}`,
                }}
                aria-label={`Order ${titleData.primary} Now`}
              >
                <span>Order Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
