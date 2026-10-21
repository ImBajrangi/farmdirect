import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Plus, 
  CreditCard, 
  Banknote, 
  Truck, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  Loader2 
} from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { formatPaise } from '../lib/formatting/currency';
import { useTranslation } from '../hooks/useTranslation';
import { marketplaceService } from '../services/marketplaceService';
import { Address } from '../types';

export const Checkout: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { user, addresses, addAddress } = useAuth();
  const { items, cartGroups, totalSubtotalPaise, clearCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return addresses.find(a => a.is_default)?.id || addresses[0]?.id || '';
  });

  const [deliveryType, setDeliveryType] = useState<'local_delivery' | 'pickup'>('local_delivery');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay_online' | 'cod'>('razorpay_online');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // New Address inline form state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Nashik');
  const [newDistrict, setNewDistrict] = useState('Nashik');
  const [newPincode, setNewPincode] = useState('422002');
  const [newLabel, setNewLabel] = useState('Home');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // Delivery fee is 0 if pickup or subtotal >= ₹500
  const deliveryFeePaise = deliveryType === 'pickup' 
    ? 0 
    : cartGroups.reduce((acc, g) => acc + (g.subtotal_paise >= 50000 ? 0 : 4000), 0);
  
  const finalTotalPaise = totalSubtotalPaise + deliveryFeePaise;

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newLine1 || !newPincode) return;

    const created = await addAddress({
      label: newLabel,
      recipient_name: newRecipient,
      phone: newPhone,
      address_line_1: newLine1,
      city: newCity,
      district: newDistrict,
      state: 'Maharashtra',
      pincode: newPincode,
      is_default: false,
    });

    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
  };

  const handleExecuteCheckout = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

    if (paymentMethod === 'razorpay_online') {
      setShowRazorpayModal(true);
      return;
    }

    completeOrderPlacement();
  };

  const completeOrderPlacement = async () => {
    setIsProcessing(true);
    try {
      const res = await marketplaceService.processCheckout({
        customerId: user?.id || 'guest-customer',
        customerProfile: user || {
          id: 'guest',
          full_name: 'Guest Customer',
          role: 'customer',
          preferred_language: 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        address: selectedAddress,
        deliveryType,
        paymentMethod,
        deliveryNotes,
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
      });

      clearCart();
      setShowRazorpayModal(false);
      navigate(`/order-confirmation?groupId=${res.checkoutGroupId}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Checkout failed';
      alert(`Checkout failed: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      {/* Back to Cart */}
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t.checkout.title}
        </h1>
        <p className="text-xs text-stone-500">
          Nashik & Western Pune Agri Corridor • Fresh Harvest Guarantee
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Form Details */}
        <div className="md:col-span-7 space-y-6">
          {/* Section 1: Fulfillment Type */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-3">
            <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              1. {t.checkout.fulfillmentType}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('local_delivery')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  deliveryType === 'local_delivery'
                    ? 'border-agri-600 bg-agri-50/60 ring-2 ring-agri-600/20'
                    : 'border-earth-200 bg-white hover:bg-earth-50'
                }`}
              >
                <Truck className="w-5 h-5 text-agri-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                    {t.checkout.homeDelivery}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                    {t.checkout.homeDeliveryDesc}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  deliveryType === 'pickup'
                    ? 'border-agri-600 bg-agri-50/60 ring-2 ring-agri-600/20'
                    : 'border-earth-200 bg-white hover:bg-earth-50'
                }`}
              >
                <Store className="w-5 h-5 text-agri-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                    {t.checkout.farmPickup}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                    {t.checkout.farmPickupDesc}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
                2. {t.checkout.deliveryAddress}
              </h2>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="text-xs font-bold text-agri-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showNewAddressForm ? 'Select Existing' : t.checkout.addNewAddress}</span>
              </button>
            </div>

            {showNewAddressForm ? (
              <form onSubmit={handleAddNewAddress} className="space-y-3 bg-earth-50 p-4 rounded-2xl border border-earth-200 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder="e.g. Ramesh Kulkarni"
                      className="w-full bg-white border border-earth-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full bg-white border border-earth-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Street Address / House / Landmark</label>
                  <input
                    type="text"
                    required
                    value={newLine1}
                    onChange={(e) => setNewLine1(e.target.value)}
                    placeholder="e.g. Flat 302, Gangapur Road, Opp. Market Yard"
                    className="w-full bg-white border border-earth-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-white border border-earth-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">District</label>
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full bg-white border border-earth-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      placeholder="6 digits"
                      className="w-full bg-white border border-earth-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-agri-700 text-white font-bold rounded-xl hover:bg-agri-800 transition"
                >
                  Save & Use This Address
                </button>
              </form>
            ) : (
              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-start justify-between gap-3 transition ${
                        isSelected
                          ? 'border-agri-600 bg-agri-50/50 ring-1 ring-agri-600'
                          : 'border-earth-200 bg-white hover:bg-earth-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-agri-700' : 'text-stone-400'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">{addr.recipient_name}</span>
                            <span className="bg-earth-200 text-stone-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                              {addr.label}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            {addr.address_line_1}, {addr.city}, {addr.district} - {addr.pincode}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">Contact: +91 {addr.phone}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-agri-700 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Delivery Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Delivery Instructions (Optional):
              </label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder={t.checkout.notesPlaceholder}
                rows={2}
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:border-agri-600"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-3">
            <h2 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              3. {t.checkout.paymentMethod}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay_online')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  paymentMethod === 'razorpay_online'
                    ? 'border-agri-600 bg-agri-50/60 ring-2 ring-agri-600/20'
                    : 'border-earth-200 bg-white hover:bg-earth-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-agri-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                    {t.checkout.razorpay}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit/Debit Cards
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  paymentMethod === 'cod'
                    ? 'border-agri-600 bg-agri-50/60 ring-2 ring-agri-600/20'
                    : 'border-earth-200 bg-white hover:bg-earth-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-agri-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                    {t.checkout.cod}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    {t.checkout.codDesc}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Action */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-earth-200 shadow-soft space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-stone-700">
              {t.checkout.orderSummary}
            </h3>

            {/* Sub-orders snapshot */}
            <div className="space-y-3 divide-y divide-earth-100 max-h-60 overflow-y-auto no-scrollbar text-xs">
              {cartGroups.map((g) => (
                <div key={g.farmer.id} className="pt-2 first:pt-0">
                  <div className="font-bold text-stone-800 flex justify-between">
                    <span>{g.farmer.farm_name}</span>
                    <span>{formatPaise(g.subtotal_paise, language)}</span>
                  </div>
                  <ul className="text-stone-500 space-y-0.5 mt-1">
                    {g.items.map((i) => (
                      <li key={i.product.id} className="flex justify-between text-[11px]">
                        <span>{i.product.name} × {i.quantity}</span>
                        <span>{formatPaise(i.subtotal_paise, language)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Financials breakdown */}
            <div className="border-t border-earth-200 pt-3 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Produce Total:</span>
                <span className="font-bold text-stone-900">{formatPaise(totalSubtotalPaise, language)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment Fee:</span>
                <span className="font-bold text-stone-900">
                  {deliveryFeePaise === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPaise(deliveryFeePaise, language)}
                </span>
              </div>
              <div className="border-t border-earth-200 pt-2 flex justify-between text-base font-black text-stone-900">
                <span>Total Amount:</span>
                <span className="text-agri-900">{formatPaise(finalTotalPaise, language)}</span>
              </div>
            </div>

            <button
              onClick={handleExecuteCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-agri-700 hover:bg-agri-800 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-lifted flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reserving Stock & Placing...</span>
                </>
              ) : (
                <span>Confirm & Place Order ({formatPaise(finalTotalPaise, language)})</span>
              )}
            </button>

            <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-agri-600" />
              <span>Direct farm settlement • Bank grade encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Sandbox Payment Simulator Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-earth-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-earth-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  ₹
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">Razorpay Gateway</h3>
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    Sandbox Mode
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowRazorpayModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="bg-earth-50 p-3 rounded-2xl border border-earth-200 text-center space-y-1">
              <span className="text-xs text-stone-500">Payable to FarmDirect Escrow</span>
              <div className="text-2xl font-black text-stone-900">
                {formatPaise(finalTotalPaise, language)}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-stone-700">Simulate Payment Test Response:</p>
              <button
                onClick={completeOrderPlacement}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Simulate Successful Payment</span>
              </button>
              <button
                onClick={() => {
                  alert('Payment was declined by bank simulator. Try again.');
                  setShowRazorpayModal(false);
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition"
              >
                Simulate Failed Payment
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              Razorpay sandbox transaction with verifiable webhook payload simulation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
