import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Check, MapPin, Calendar, Award } from 'lucide-react';
import { Product } from '../../types';
import { formatPaise, formatWeight } from '../../lib/formatting/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
    <div className="group bg-white rounded-2xl border border-earth-200 overflow-hidden shadow-soft hover:shadow-lifted hover:border-agri-300 transition-all duration-200 flex flex-col justify-between">
      {/* Top Media & Badges */}
      <div className="relative aspect-[4/3] bg-earth-100 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={productName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {product.is_certified_organic ? (
            <span className="bg-emerald-700/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Award className="w-3 h-3" />
              <span>{t.common.organicCertified}</span>
            </span>
          ) : (
            <span className="bg-stone-900/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
              {t.common.directFromFarm}
            </span>
          )}

          {isOutOfStock && (
            <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {t.common.outOfStock}
            </span>
          )}
        </div>

        {/* Harvest Date Strip if available */}
        {product.harvest_date && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Calendar className="w-3 h-3 text-agri-600" />
            <span>{t.common.harvestedOn}: {product.harvest_date}</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Farmer Source Credit */}
          {product.farmer && (
            <Link
              to={`/farmer/${product.farmer.id}`}
              className="text-[11px] font-semibold text-agri-700 hover:text-agri-800 flex items-center gap-1 mb-1 truncate"
            >
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{farmName} • {product.farmer.village}</span>
            </Link>
          )}

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug hover:text-agri-700 transition line-clamp-1">
              {productName}
            </h3>
          </Link>

          {/* Subtitle / Unit info */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
            {language === 'hi' && product.description_hi ? product.description_hi : product.description}
          </p>
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-3 mt-3 border-t border-earth-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-stone-900 leading-none">
              {formatPaise(product.price_paise, language)}
              <span className="text-xs font-normal text-stone-500 ml-1">
                / {formatWeight(1, product.unit, language)}
              </span>
            </div>
            {product.min_order_quantity > 1 && (
              <span className="text-[10px] text-stone-400">
                {t.common.minOrder}: {product.min_order_quantity} {product.unit}
              </span>
            )}
          </div>

          {/* Cart Stepper or Add Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-earth-200 text-stone-400 text-xs font-semibold cursor-not-allowed"
            >
              {t.common.outOfStock}
            </button>
          ) : currentQty > 0 ? (
            <div className="flex items-center bg-agri-50 border border-agri-300 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, currentQty - (product.unit_step || 1))}
                className="w-8 h-8 flex items-center justify-center text-agri-800 hover:bg-agri-200 active:scale-95 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-bold text-xs text-agri-950 min-w-[28px] text-center">
                {currentQty}
              </span>
              <button
                onClick={() => addToCart(product)}
                disabled={currentQty >= availableQty}
                className="w-8 h-8 flex items-center justify-center text-agri-800 hover:bg-agri-200 active:scale-95 disabled:opacity-40 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="px-3 py-1.5 rounded-xl bg-agri-600 hover:bg-agri-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              aria-label={`Add ${productName} to Cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.common.addToCart}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
