import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, MapPin, Calendar, Award } from 'lucide-react';
import { Product } from './product.types';
import { formatPaise, formatWeight } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../cart/CartContext';
import './products.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useTranslation();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const currentQty = getItemQuantity(product.id);
  const availableQty = product.inventory?.available_quantity ?? 999;
  const isOutOfStock = availableQty <= 0;

  const imageUrl = product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

  const productName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
  const farmName = language === 'hi' && product.farmer?.farm_name_hi ? product.farmer.farm_name_hi : product.farmer?.farm_name;

  return (
    <div className="product-card">
      {/* Media */}
      <div className="product-media">
        <Link to={`/product/${product.slug}`}>
          <img src={imageUrl} alt={productName} loading="lazy" className="product-image" />
        </Link>

        {/* Badges */}
        <div className="product-badges">
          {product.is_certified_organic ? (
            <span className="badge badge-organic">
              <Award size={12} />
              <span>{t.common.organicCertified}</span>
            </span>
          ) : (
            <span className="badge badge-neutral">{t.common.directFromFarm}</span>
          )}

          {isOutOfStock && <span className="badge badge-danger">{t.common.outOfStock}</span>}
        </div>

        {/* Harvest Date */}
        {product.harvest_date && (
          <div className="product-harvest-tag">
            <Calendar size={12} style={{ color: 'var(--color-primary)' }} />
            <span>{product.harvest_date}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-content">
        <div>
          {product.farmer && (
            <Link to={`/farmer/${product.farmer.id}`} className="product-farmer-link">
              <MapPin size={12} />
              <span>{farmName} • {product.farmer.village}</span>
            </Link>
          )}

          <Link to={`/product/${product.slug}`}>
            <h3 className="product-title">{productName}</h3>
          </Link>

          <p className="product-description">
            {language === 'hi' && product.description_hi ? product.description_hi : product.description}
          </p>
        </div>

        {/* Footer */}
        <div className="product-footer">
          <div>
            <div className="flex-row items-center">
              <span className="product-price-val">{formatPaise(product.price_paise, language)}</span>
              <span className="product-price-unit">/ {formatWeight(1, product.unit, language)}</span>
            </div>
          </div>

          {/* Stepper or Add button */}
          {isOutOfStock ? (
            <span className="badge badge-danger">{t.common.outOfStock}</span>
          ) : currentQty > 0 ? (
            <div className="product-stepper">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, currentQty - (product.unit_step || 1))}
                className="stepper-btn"
                aria-label="Decrease"
              >
                <Minus size={14} />
              </button>
              <span className="stepper-value">{currentQty}</span>
              <button
                type="button"
                onClick={() => addToCart(product)}
                disabled={currentQty >= availableQty}
                className="stepper-btn"
                aria-label="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="btn btn-primary btn-sm"
              aria-label={`Add ${productName} to Cart`}
            >
              <Plus size={14} />
              <span>{t.common.addToCart}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
