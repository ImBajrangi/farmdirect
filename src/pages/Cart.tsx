import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { formatPaise, formatWeight } from '../lib/formatting/currency';
import { useTranslation } from '../hooks/useTranslation';

export const Cart: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    cartGroups,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalSubtotalPaise,
    totalDeliveryFeePaise,
    grandTotalPaise,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-agri-50 text-agri-700 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-stone-900">Your Basket is Empty</h2>
          <p className="text-xs text-stone-500">
            Discover freshly harvested seasonal fruits, vegetables, and grains directly from Maharashtra farmers.
          </p>
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm shadow-lifted transition"
        >
          <span>Explore Farmgate Produce</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28 sm:pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t.nav.cart}
          </h1>
          <p className="text-xs text-stone-500">
            {cartGroups.length} {cartGroups.length > 1 ? 'Farm Producers' : 'Farm Producer'} in this basket
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Multi-Farmer Notice */}
      {cartGroups.length > 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Multi-farm order:</strong> Your cart includes produce from {cartGroups.length} independent local farmers. 
            Each farm prepares and packages their harvest fresh for you.
          </p>
        </div>
      )}

      {/* Cart Groups Partitioned by Farmer */}
      <div className="space-y-6">
        {cartGroups.map((group) => {
          const farmName = language === 'hi' && group.farmer.farm_name_hi ? group.farmer.farm_name_hi : group.farmer.farm_name;
          const remainingForFree = Math.max(0, 50000 - group.subtotal_paise);
          const percentFree = Math.min(100, Math.round((group.subtotal_paise / 50000) * 100));

          return (
            <div
              key={group.farmer.id}
              className="bg-white rounded-3xl p-4 sm:p-6 border border-earth-200 shadow-soft space-y-4"
            >
              {/* Farmer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-earth-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-agri-100 text-agri-800 font-bold flex items-center justify-center text-xs">
                    🌱
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{farmName}</h3>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-agri-600" />
                      <span>{group.farmer.village}, {group.farmer.district}</span>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-stone-700">
                  {formatPaise(group.subtotal_paise, language)}
                </span>
              </div>

              {/* Free Delivery Progress Bar for this Farm */}
              <div className="bg-earth-50 rounded-xl p-2.5 border border-earth-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-stone-600 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-agri-600" />
                    {remainingForFree === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE Farm Delivery Unlocked!</span>
                    ) : (
                      <span>Add {formatPaise(remainingForFree, language)} more for FREE delivery</span>
                    )}
                  </span>
                  <span className="font-bold text-stone-700">{percentFree}%</span>
                </div>
                <div className="w-full bg-earth-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-agri-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentFree}%` }}
                  />
                </div>
              </div>

              {/* Item List for this Farm */}
              <div className="divide-y divide-earth-100">
                {group.items.map(({ product, quantity, subtotal_paise }) => {
                  const pName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
                  const available = product.inventory?.available_quantity ?? 999;

                  return (
                    <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                      {/* Product Thumbnail & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80'}
                          alt={pName}
                          className="w-14 h-14 rounded-xl object-cover border border-earth-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                            {pName}
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            {formatPaise(product.price_paise, language)} / {product.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center bg-earth-100 rounded-lg overflow-hidden border border-earth-200">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - (product.unit_step || 1))}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-earth-200 active:scale-95"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs text-stone-800 min-w-[24px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + (product.unit_step || 1))}
                            disabled={quantity >= available}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-earth-200 active:scale-95 disabled:opacity-40"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right min-w-[65px]">
                          <span className="font-extrabold text-xs sm:text-sm text-stone-900 block leading-tight">
                            {formatPaise(subtotal_paise, language)}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-stone-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Farmer Sub-Order Summary */}
              <div className="pt-2 text-xs flex justify-between items-center text-stone-500">
                <span>Delivery charge ({group.farmer.farm_name}):</span>
                <span className="font-semibold text-stone-800">
                  {group.delivery_fee_paise === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatPaise(group.delivery_fee_paise, language)
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bill Details Summary Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-3">
        <h3 className="font-black text-sm uppercase tracking-wider text-stone-700">
          Payment Breakdown
        </h3>
        <div className="space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Produce Subtotal:</span>
            <span className="font-bold text-stone-900">{formatPaise(totalSubtotalPaise, language)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Delivery Fees:</span>
            <span className="font-bold text-stone-900">
              {totalDeliveryFeePaise === 0 ? (
                <span className="text-emerald-700">FREE</span>
              ) : (
                formatPaise(totalDeliveryFeePaise, language)
              )}
            </span>
          </div>
          <div className="border-t border-earth-200 pt-2 flex justify-between text-sm sm:text-base font-black text-stone-900">
            <span>Grand Total:</span>
            <span className="text-agri-900">{formatPaise(grandTotalPaise, language)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-4 rounded-2xl bg-agri-700 hover:bg-agri-800 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-lifted flex items-center justify-center gap-2 transition"
        >
          <span>{t.common.checkout}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
