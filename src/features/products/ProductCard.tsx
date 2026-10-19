import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
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
  pillBg: string;
  pillText: string;
  pillBorder: string;
  accentColor: string;
  shadowColor: string;
}

function getItemTheme(slug: string): ItemTheme {
  const s = slug.toLowerCase();

  // 1. Red Onions -> Deep Burgundy Velvet & Rose Tint
  if (s.includes('onion') || s.includes('kanda')) {
    return {
      shellBg: '#1f0d16',
      borderColor: 'rgba(244, 63, 94, 0.22)',
      canvasBg: '#fce7ef',
      ribbonBg: '#881337',
      ribbonText: '#ffe4e6',
      pillBg: 'rgba(244, 63, 94, 0.16)',
      pillText: '#fda4af',
      pillBorder: 'rgba(244, 63, 94, 0.3)',
      accentColor: '#fb7185',
      shadowColor: 'rgba(136, 19, 55, 0.3)',
    };
  }

  // 2. Grapes -> Deep Royal Violet & Lavender Tint
  if (s.includes('grape') || s.includes('draksh')) {
    return {
      shellBg: '#130d24',
      borderColor: 'rgba(168, 85, 247, 0.22)',
      canvasBg: '#ede9fe',
      ribbonBg: '#581c87',
      ribbonText: '#f3e8ff',
      pillBg: 'rgba(168, 85, 247, 0.16)',
      pillText: '#d8b4fe',
      pillBorder: 'rgba(168, 85, 247, 0.3)',
      accentColor: '#c084fc',
      shadowColor: 'rgba(88, 28, 135, 0.3)',
    };
  }

  // 3. Spinach & Green Veggies -> Deep Forest Bottle Green & Emerald Tint
  if (s.includes('spinach') || s.includes('palak') || s.includes('methi')) {
    return {
      shellBg: '#0d1f13',
      borderColor: 'rgba(34, 197, 94, 0.22)',
      canvasBg: '#dcfce7',
      ribbonBg: '#166534',
      ribbonText: '#dcfce7',
      pillBg: 'rgba(34, 197, 94, 0.16)',
      pillText: '#86efac',
      pillBorder: 'rgba(34, 197, 94, 0.3)',
      accentColor: '#4ade80',
      shadowColor: 'rgba(22, 101, 52, 0.3)',
    };
  }

  // 4. Wheat / Grains -> Deep Roasted Amber & Golden Husk Tint
  if (s.includes('wheat') || s.includes('gehu') || s.includes('grain') || s.includes('cereal') || s.includes('rice')) {
    return {
      shellBg: '#211508',
      borderColor: 'rgba(245, 158, 11, 0.22)',
      canvasBg: '#fef3c7',
      ribbonBg: '#78350f',
      ribbonText: '#fef3c7',
      pillBg: 'rgba(245, 158, 11, 0.16)',
      pillText: '#fde68a',
      pillBorder: 'rgba(245, 158, 11, 0.3)',
      accentColor: '#fbbf24',
      shadowColor: 'rgba(120, 53, 15, 0.3)',
    };
  }

  // 5. Gir Cow Ghee & Dairy -> Artisan Bronze & Saffron Gold Tint
  if (s.includes('ghee') || s.includes('dairy') || s.includes('toop') || s.includes('milk')) {
    return {
      shellBg: '#1d1305',
      borderColor: 'rgba(234, 179, 8, 0.22)',
      canvasBg: '#fef9c3',
      ribbonBg: '#713f12',
      ribbonText: '#fef9c3',
      pillBg: 'rgba(234, 179, 8, 0.16)',
      pillText: '#fef08a',
      pillBorder: 'rgba(234, 179, 8, 0.3)',
      accentColor: '#facc15',
      shadowColor: 'rgba(113, 63, 18, 0.3)',
    };
  }

  // 6. Tomatoes & Spices -> Deep Ripe Field Crimson & Coral Tint
  if (s.includes('tomato') || s.includes('chilli') || s.includes('spice') || s.includes('masala')) {
    return {
      shellBg: '#220b0b',
      borderColor: 'rgba(239, 68, 68, 0.22)',
      canvasBg: '#fee2e2',
      ribbonBg: '#7f1d1d',
      ribbonText: '#fee2e2',
      pillBg: 'rgba(239, 68, 68, 0.16)',
      pillText: '#fca5a5',
      pillBorder: 'rgba(239, 68, 68, 0.3)',
      accentColor: '#f87171',
      shadowColor: 'rgba(127, 29, 29, 0.3)',
    };
  }

  // Default Organic Kiwi/Farmgate Forest Green
  return {
    shellBg: '#112417',
    borderColor: 'rgba(34, 197, 94, 0.22)',
    canvasBg: '#dcfce7',
    ribbonBg: '#166534',
    ribbonText: '#dcfce7',
    pillBg: 'rgba(34, 197, 94, 0.16)',
    pillText: '#86efac',
    pillBorder: 'rgba(34, 197, 94, 0.3)',
    accentColor: '#4ade80',
    shadowColor: 'rgba(22, 101, 52, 0.3)',
  };
}

// Clean concise display name helper (matches Card B typography)
function getCleanTitle(name: string): string {
  if (name.includes('Nashik Garva Red Onions')) return 'Nashik Red Onions';
  if (name.includes('Thompson Seedless')) return 'Thompson Grapes';
  if (name.includes('Tender Spinach')) return 'Tender Spinach';
  if (name.includes('Lokwan Heritage')) return 'Lokwan Wheat';
  if (name.includes('Gir Cow Bilona')) return 'Gir Cow Ghee';
  if (name.includes('Country Tomatoes') || name.includes('देशी लाल टमाटर')) return 'Vine Tomatoes';
  return name;
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
      {/* Top Media Canvas (Exact Card B: Full-width with thin 10px frame) */}
      <div className="product-canvas-b" style={{ backgroundColor: theme.canvasBg }}>
        <Link to={`/product/${product.slug}`} className="product-canvas-link-b" aria-label={cleanTitle}>
          <img src={imageUrl} alt={cleanTitle} loading="lazy" className="product-canvas-img-b" />
        </Link>

        {/* Curved Olive Bottom Ribbon (Exact Card B: Human formatted date) */}
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

      {/* Card B Bottom Split Layout: [Title + Single Row Tags] | [Price + Order Now ↗ / Stepper] */}
      <div className="product-footer-split-b">
        {/* Left Column: Title + Single-Row Pills */}
        <div className="product-left-col-b">
          <Link to={`/product/${product.slug}`} className="product-title-b" title={product.name}>
            {cleanTitle}
          </Link>

          <div className="product-tags-row-b">
            <span
              className="product-trait-pill-b"
              style={{
                backgroundColor: theme.pillBg,
                color: theme.pillText,
                borderColor: theme.pillBorder,
              }}
            >
              {village}
            </span>
            <span
              className="product-trait-pill-b"
              style={{
                backgroundColor: theme.pillBg,
                color: theme.pillText,
                borderColor: theme.pillBorder,
              }}
            >
              {unitLabel}
            </span>
          </div>
        </div>

        {/* Right Column: Giant Price (Top) + Order Now ↗ or Stepper (Bottom) */}
        <div className="product-right-col-b">
          <div className="product-price-val-b" title={`₹${product.price_paise / 100} / ${unitLabel}`}>
            {formatPaise(displayPricePaise, language)}
          </div>

          {isOutOfStock ? (
            <span className="product-soldout-b">Sold Out</span>
          ) : currentQty > 0 ? (
            <div
              className="product-stepper-b"
              style={{
                backgroundColor: theme.pillBg,
                borderColor: theme.pillBorder,
              }}
            >
              <button
                type="button"
                onClick={() => updateQuantity(product.id, currentQty - (product.unit_step || 1))}
                className="stepper-btn-b"
                style={{ color: theme.accentColor }}
                aria-label="Decrease quantity"
              >
                <Minus size={11} strokeWidth={2.5} />
              </button>
              <span className="stepper-qty-b" style={{ color: theme.pillText }}>
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={currentQty >= availableQty}
                className="stepper-btn-b"
                style={{ color: theme.accentColor }}
                aria-label="Increase quantity"
              >
                <Plus size={11} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="product-order-btn-b"
              style={{ color: theme.accentColor }}
              aria-label={`Order ${cleanTitle} Now`}
            >
              <span>Order Now</span>
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
