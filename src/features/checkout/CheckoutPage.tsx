import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  Truck,
  Store,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { formatPaise } from '../../utils/currency';
import { useTranslation } from '../../hooks/useTranslation';
import { checkoutService } from './checkout.service';
import { RazorpayModal } from '../payments/RazorpayModal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Address } from '../../types';
import './checkout.css';

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, addresses, addAddress } = useAuth();
  const { items, cartGroups, totalSubtotalPaise, clearCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return addresses.find((a) => a.is_default)?.id || addresses[0]?.id || '';
  });

  const [deliveryType, setDeliveryType] = useState<'local_delivery' | 'pickup'>('local_delivery');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay_online' | 'cod'>('razorpay_online');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // New Address inline form state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState(user?.full_name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newLabel, setNewLabel] = useState('Home');

  // Automatically select address when addresses load from database
  React.useEffect(() => {
    if ((!selectedAddressId || !addresses.some(a => a.id === selectedAddressId)) && addresses.length > 0) {
      const def = addresses.find((a) => a.is_default) || addresses[0];
      if (def) setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const deliveryFeePaise =
    deliveryType === 'pickup'
      ? 0
      : cartGroups.reduce(
          (acc, g) => acc + checkoutService.calculateDeliveryFee(g.subtotal_paise, deliveryType),
          0
        );

  const finalTotalPaise = totalSubtotalPaise + deliveryFeePaise;

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newLine1 || !newPincode || !newCity) return;

    try {
      const created = await addAddress({
        label: newLabel || 'Home',
        recipient_name: newRecipient,
        phone: newPhone,
        address_line_1: newLine1,
        city: newCity,
        district: newDistrict || newCity,
        state: newState || 'Maharashtra',
        pincode: newPincode,
        is_default: addresses.length === 0,
      });

      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const completeCheckout = async (method: 'razorpay_online' | 'cod', paymentId?: string) => {
    setIsProcessing(true);
    try {
      const res = await checkoutService.executeCheckout({
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
        paymentMethod: method,
        paymentId,
        deliveryNotes,
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
      });

      clearCart();
      navigate(`/orders/confirmation?groupId=${res.checkoutGroupId}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Checkout failed';
      alert(`Checkout failed: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

    if (paymentMethod === 'razorpay_online') {
      setShowRazorpayModal(true);
    } else {
      await completeCheckout('cod');
    }
  };

  return (
    <div className="page-container checkout-page">
      <div className="checkout-header">
        <button className="checkout-header-back" onClick={() => navigate('/cart')}>
          <ArrowLeft size={16} /> Back to Cart
        </button>
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Direct harvest from local Maharashtra farms</p>
      </div>

      <div className="checkout-grid">
        {/* Left Column: Form & Details */}
        <div className="checkout-form-column">
          {/* Section 1: Delivery Address */}
          <section className="checkout-card">
            <div className="checkout-card-header">
              <h2 className="checkout-card-title">
                <MapPin size={20} /> 1. Select Delivery Address
              </h2>
              {!showNewAddressForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  <Plus size={14} /> Add New
                </Button>
              )}
            </div>

            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} className="new-address-form">
                <h3 className="heading-4 mb-3">Add New Address</h3>
                <div className="form-grid-2">
                  <Input
                    label="Full Name / Recipient"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    required
                  />
                </div>
                <Input
                  label="Street Address / House No."
                  value={newLine1}
                  onChange={(e) => setNewLine1(e.target.value)}
                  placeholder="e.g. Flat 302, Green Valley Apts"
                  required
                />
                <div className="form-grid-2">
                  <Input
                    label="City"
                    placeholder="e.g. Pune / Nashik"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Maharashtra"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Pincode"
                  placeholder="6-digit pincode"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  required
                />
                <div className="form-actions-row">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save & Use Address
                  </Button>
                </div>
              </form>
            )}

            <div className="address-grid">
              {addresses.map((addr: Address) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    className={`address-item ${isSelected ? 'active selected' : ''}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className="address-item-top">
                      <span className="address-item-tag">{addr.label}</span>
                      <div className={`delivery-radio-dot ${isSelected ? 'checked' : ''}`} />
                    </div>
                    <div className="address-item-name">{addr.recipient_name}</div>
                    <div className="address-item-phone">{addr.phone}</div>
                    <div className="address-item-text">
                      {addr.address_line_1}, {addr.city}, {addr.pincode}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Fulfillment Choice */}
          <section className="checkout-card">
            <div className="checkout-card-header">
              <h2 className="checkout-card-title">
                <Truck size={20} /> 2. Delivery or Pickup
              </h2>
            </div>
            <div className="delivery-options-grid">
              <button
                type="button"
                className={`delivery-option-card ${deliveryType === 'local_delivery' ? 'active' : ''}`}
                onClick={() => setDeliveryType('local_delivery')}
              >
                <div className="delivery-option-icon-box">
                  <Truck size={22} />
                </div>
                <div className="delivery-option-text">
                  <div className="delivery-option-title-row">
                    <span className="delivery-option-title">Local Delivery</span>
                    <span className="delivery-badge-pill">Direct</span>
                  </div>
                  <span className="delivery-option-desc">Direct to your doorstep in 24 hrs</span>
                </div>
                <div className={`delivery-radio-dot ${deliveryType === 'local_delivery' ? 'checked' : ''}`} />
              </button>

              <button
                type="button"
                className={`delivery-option-card ${deliveryType === 'pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryType('pickup')}
              >
                <div className="delivery-option-icon-box">
                  <Store size={22} />
                </div>
                <div className="delivery-option-text">
                  <div className="delivery-option-title-row">
                    <span className="delivery-option-title">Farm Pickup</span>
                    <span className="delivery-badge-pill free">Free</span>
                  </div>
                  <span className="delivery-option-desc">Pick up directly at the farm</span>
                </div>
                <div className={`delivery-radio-dot ${deliveryType === 'pickup' ? 'checked' : ''}`} />
              </button>
            </div>

            <Input
              label="Delivery / Pickup Instructions (Optional)"
              placeholder="e.g. Leave with security guard, or call before arriving"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
            />
          </section>

          {/* Section 3: Payment Method */}
          <section className="checkout-card">
            <div className="checkout-card-header">
              <h2 className="checkout-card-title">
                <CreditCard size={20} /> 3. Payment Method
              </h2>
            </div>
            <div className="payment-options-grid">
              <div
                className={`payment-option-row ${paymentMethod === 'razorpay_online' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('razorpay_online')}
              >
                <div className="payment-option-left">
                  <div className="payment-option-icon-box">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div className="payment-option-title">UPI / Cards / NetBanking</div>
                    <div className="payment-option-desc">Instant online payment via Razorpay</div>
                  </div>
                </div>
                <div className={`delivery-radio-dot ${paymentMethod === 'razorpay_online' ? 'checked' : ''}`} />
              </div>

              <div
                className={`payment-option-row ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="payment-option-left">
                  <div className="payment-option-icon-box">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <div className="payment-option-title">Cash on Delivery (COD)</div>
                    <div className="payment-option-desc">Pay cash or scan QR when receiving goods</div>
                  </div>
                </div>
                <div className={`delivery-radio-dot ${paymentMethod === 'cod' ? 'checked' : ''}`} />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-column">
          <div className="order-summary-box">
            <h3 className="heading-3 mb-4">Order Summary</h3>

            <div className="summary-row">
              <span>Items Total ({items.length} items)</span>
              <span>{formatPaise(totalSubtotalPaise)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>
                {deliveryFeePaise === 0 ? (
                  <span className="checkout-badge-free">FREE</span>
                ) : (
                  formatPaise(deliveryFeePaise)
                )}
              </span>
            </div>

            <div className="summary-row total-row">
              <span>Grand Total</span>
              <span className="total-amount">{formatPaise(finalTotalPaise)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isProcessing}
              onClick={handlePlaceOrder}
            >
              Place Order ({formatPaise(finalTotalPaise)})
            </Button>

            <div className="checkout-trust-banner">
              <ShieldCheck size={16} color="var(--color-primary)" />
              <span>100% Secure Checkout • Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      <RazorpayModal
        isOpen={showRazorpayModal}
        amountPaise={finalTotalPaise}
        onSuccess={async (paymentId) => {
          setShowRazorpayModal(false);
          await completeCheckout('razorpay_online', paymentId);
        }}
        onFailure={(reason) => {
          setShowRazorpayModal(false);
          alert(`Payment failed: ${reason}. Your items remain safely in your cart.`);
        }}
        onClose={() => setShowRazorpayModal(false)}
      />
    </div>
  );
};

