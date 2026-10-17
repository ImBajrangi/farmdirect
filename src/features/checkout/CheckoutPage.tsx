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

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const deliveryFeePaise =
    deliveryType === 'pickup'
      ? 0
      : cartGroups.reduce(
          (acc, g) => acc + checkoutService.calculateDeliveryFee(g.subtotal_paise, deliveryType),
          0
        );

  const finalTotalPaise = totalSubtotalPaise + deliveryFeePaise;

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newLine1 || !newPincode) return;

    const created = addAddress({
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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

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
        paymentMethod,
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
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    required
                  />
                  <Input
                    label="Pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    required
                  />
                </div>
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
              {addresses.map((addr: Address) => (
                <div
                  key={addr.id}
                  className={`address-item ${selectedAddressId === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddressId(addr.id)}
                >
                  <span className="address-item-tag">{addr.label}</span>
                  <div className="address-item-name">{addr.recipient_name}</div>
                  <div className="address-item-phone">{addr.phone}</div>
                  <div className="address-item-text">
                    {addr.address_line_1}, {addr.city}, {addr.pincode}
                  </div>
                </div>
              ))}
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
                className={`delivery-option-btn ${deliveryType === 'local_delivery' ? 'active' : ''}`}
                onClick={() => setDeliveryType('local_delivery')}
              >
                <Truck size={24} />
                <span className="delivery-option-title">Local Delivery</span>
                <span className="delivery-option-desc">Direct to your doorstep in 24 hrs</span>
              </button>
              <button
                type="button"
                className={`delivery-option-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryType('pickup')}
              >
                <Store size={24} />
                <span className="delivery-option-title">Farm Pickup</span>
                <span className="delivery-option-desc">Pick up directly at the farm</span>
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
                  <CreditCard size={20} color="var(--color-primary)" />
                  <div>
                    <div className="payment-option-title">UPI / Cards / NetBanking</div>
                    <div className="payment-option-desc">Instant online payment via Razorpay</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay_online'}
                  onChange={() => setPaymentMethod('razorpay_online')}
                />
              </div>

              <div
                className={`payment-option-row ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="payment-option-left">
                  <Banknote size={20} color="var(--color-primary)" />
                  <div>
                    <div className="payment-option-title">Cash on Delivery (COD)</div>
                    <div className="payment-option-desc">Pay cash or scan QR when receiving goods</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
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
    </div>
  );
};
