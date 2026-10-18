import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowLeft, 
  MessageCircle, 
  Truck,
  Check
} from 'lucide-react';
import { marketplaceService } from '../services/marketplaceService';
import { Product } from '../types';
import { formatPaise, formatWeight } from '../lib/formatting/currency';
import { useTranslation } from '../hooks/useTranslation';
import { useCart } from '../features/cart/CartContext';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showAddedBanner, setShowAddedBanner] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      try {
        const item = await marketplaceService.getProductBySlug(slug);
        setProduct(item);
        if (item) {
          setQuantity(item.min_order_quantity || 1);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="h-64 sm:h-96 rounded-3xl bg-earth-200 animate-pulse" />
        <div className="h-20 rounded-2xl bg-earth-200 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500">The requested produce item might have been unlisted or harvested out.</p>
        <Link to="/marketplace" className="inline-block px-4 py-2 bg-agri-700 text-white text-xs font-bold rounded-xl">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const productName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
  const description = language === 'hi' && product.description_hi ? product.description_hi : product.description;
  const imageUrl = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
  const availableQty = product.inventory?.available_quantity ?? 999;
  const isOutOfStock = availableQty <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedBanner(true);
    setTimeout(() => setShowAddedBanner(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${product.farmer?.farm_name || 'Farmer'}, I am inquiring on FarmDirect about ${product.name} (harvested ${product.harvest_date || 'today'}). Is bulk order available?`
  );
  const whatsappUrl = `https://wa.me/91${product.farmer?.user?.phone || '9822012345'}?text=${whatsappMessage}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl p-4 sm:p-8 border border-earth-200 shadow-soft">
        {/* Left: Product Image & Badges */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-earth-100 border border-earth-200">
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            {product.is_certified_organic && (
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-emerald-800/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Award className="w-4 h-4" />
                  <span>{t.common.organicCertified}</span>
                </span>
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-sm px-4 py-2 rounded-xl shadow-lifted uppercase tracking-wider">
                  {t.common.outOfStock}
                </span>
              </div>
            )}
          </div>

          {/* Quick Freshness Metrics Strip */}
          <div className="grid grid-cols-2 gap-3">
            {product.harvest_date && (
              <div className="bg-earth-50 p-3 rounded-xl border border-earth-200 text-xs">
                <span className="text-stone-400 block mb-0.5">{t.common.harvestedOn}</span>
                <span className="font-bold text-stone-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-agri-600" />
                  <span>{product.harvest_date}</span>
                </span>
              </div>
            )}
            {product.shelf_life_days && (
              <div className="bg-earth-50 p-3 rounded-xl border border-earth-200 text-xs">
                <span className="text-stone-400 block mb-0.5">{t.common.shelfLife}</span>
                <span className="font-bold text-stone-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{product.shelf_life_days} {t.common.days}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                {productName}
              </h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-agri-900">
                  {formatPaise(product.price_paise, language)}
                </span>
                <span className="text-sm font-medium text-stone-500">
                  / {formatWeight(1, product.unit, language)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-earth-100 pt-3">
              <p>{description}</p>
            </div>

            {/* Stock Availability indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${availableQty > 10 ? 'bg-emerald-500' : availableQty > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="font-semibold text-stone-700">
                {isOutOfStock 
                  ? t.common.outOfStock 
                  : `${availableQty} ${product.unit} available in farm inventory`}
              </span>
            </div>

            {/* Quantity Stepper Selector */}
            {!isOutOfStock && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-stone-700">
                  Select Quantity ({product.unit}):
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-earth-100 border border-earth-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - (product.unit_step || 1)))}
                      disabled={quantity <= product.min_order_quantity}
                      className="w-10 h-10 flex items-center justify-center text-stone-700 hover:bg-earth-200 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-sm text-stone-900 min-w-[50px] text-center h-10 flex items-center justify-center leading-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(availableQty, quantity + (product.unit_step || 1)))}
                      disabled={quantity >= availableQty}
                      className="w-10 h-10 flex items-center justify-center text-stone-700 hover:bg-earth-200 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-stone-500">
                    Subtotal: <strong>{formatPaise(product.price_paise * quantity, language)}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Added to cart toast feedback */}
            {showAddedBanner && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{t.common.addedToCart}! Added {quantity} {product.unit} to your basket.</span>
              </div>
            )}

            {/* Action Buttons */}
            {!isOutOfStock && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-xl border-2 border-agri-700 text-agri-800 hover:bg-agri-50 active:scale-95 font-bold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.common.addToCart}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-xl bg-agri-700 hover:bg-agri-800 active:scale-95 text-white font-bold text-xs sm:text-sm transition shadow-lifted flex items-center justify-center gap-1.5"
                >
                  <span>{t.common.buyNow}</span>
                </button>
              </div>
            )}
          </div>

          {/* Farmer Profile Card & WhatsApp Connect */}
          {product.farmer && (
            <div className="bg-earth-50 rounded-2xl p-4 border border-earth-200 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Produced by
                </span>
                <Link
                  to={`/farmer/${product.farmer.id}`}
                  className="text-xs font-bold text-agri-700 hover:underline"
                >
                  View Farm Profile →
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-earth-300 shrink-0">
                  <img
                    src={product.farmer.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={product.farmer.farm_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-stone-900 truncate">
                      {language === 'hi' && product.farmer.farm_name_hi ? product.farmer.farm_name_hi : product.farmer.farm_name}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-agri-600 shrink-0" />
                    <span>{product.farmer.village}, {product.farmer.district} ({product.farmer.land_area_acres} Acres)</span>
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Farmer Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.common.contactFarmerWhatsApp}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
