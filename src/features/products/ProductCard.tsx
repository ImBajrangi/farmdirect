import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import { Product } from './product.types';
import { formatPaise } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../cart/CartContext';
import './products.css';

interface ProductCardProps {
  product: Product;
}

// Dynamic item color scheme according to produce type
interface ItemTheme {
  shellBg: string;
  borderColor: string;
  canvasBg: string;
  ribbonBg: string;
  ribbonText: string;
  accentColor: string;
  shadowColor: string;
}

function getItemTheme(slug: string): ItemTheme {
  const s = slug.toLowerCase();

  // 1. Red Onions -> Soft Warm Organic Blush Canvas
  if (s.includes('onion') || s.includes('kanda')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(15, 46, 34, 0.08)',
      canvasBg: '#FFF5F5',
      ribbonBg: '#FFE4E6',
      ribbonText: '#9F1239',
      accentColor: '#BE123C',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 2. Grapes -> Soft Lilac Accent
  if (s.includes('grape') || s.includes('draksh')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(15, 46, 34, 0.08)',
      canvasBg: '#F5F3FF',
      ribbonBg: '#EDE9FE',
      ribbonText: '#6B21A8',
      accentColor: '#7E22CE',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 3. Spinach & Green Veggies -> Soft Mint Canvas
  if (s.includes('spinach') || s.includes('palak') || s.includes('methi')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(15, 46, 34, 0.08)',
      canvasBg: '#F0FDF4',
      ribbonBg: '#DCFCE7',
      ribbonText: '#15803D',
      accentColor: '#16A34A',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 4. Wheat / Grains -> Soft Warm Amber
  if (s.includes('wheat') || s.includes('gehu') || s.includes('grain') || s.includes('cereal') || s.includes('rice')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(15, 46, 34, 0.08)',
      canvasBg: '#FFFBEB',
      ribbonBg: '#FEF3C7',
      ribbonText: '#92400E',
      accentColor: '#B45309',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 5. Gir Cow Ghee & Dairy -> Soft Sunlit Cream
  if (s.includes('ghee') || s.includes('dairy') || s.includes('toop') || s.includes('milk')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(15, 46, 34, 0.08)',
      canvasBg: '#FEFCE8',
      ribbonBg: '#FEF9C3',
      ribbonText: '#854D0E',
      accentColor: '#A16207',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // 6. Tomatoes & Spices -> Soft Pastel Coral
  if (s.includes('tomato') || s.includes('chilli') || s.includes('spice') || s.includes('masala')) {
    return {
      shellBg: '#FFFFFF',
      borderColor: 'rgba(15, 46, 34, 0.08)',
      canvasBg: '#FEF2F2',
      ribbonBg: '#FEE2E2',
      ribbonText: '#991B1B',
      accentColor: '#DC2626',
      shadowColor: 'rgba(15, 46, 34, 0.06)',
    };
  }

  // Default Organic Leaf Green
  return {
    shellBg: '#FFFFFF',
    borderColor: 'rgba(15, 46, 34, 0.08)',
    canvasBg: '#F4F7F4',
    ribbonBg: '#DCFCE7',
    ribbonText: '#15803D',
    accentColor: '#16A34A',
    shadowColor: 'rgba(15, 46, 34, 0.06)',
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
  else if (title.includes('Lokwan Heritage')) title = 'Lokwan Wheat';
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

      {/* Harmonious Synchronized Footer (Google / Apple Quality) */}
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

        {/* Origin & Quality Badges: Organic Sage & Green Accents */}
        <div className="product-tags-row-b">
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
