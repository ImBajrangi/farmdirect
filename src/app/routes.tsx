import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Features
import { HomePage } from '../features/home/HomePage';
import { MarketplacePage } from '../features/products/MarketplacePage';
import { ProductDetailsPage } from '../features/products/ProductDetailsPage';
import { CartPage } from '../features/cart/CartPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { OrderConfirmationPage } from '../features/orders/OrderConfirmationPage';
import { OrderTrackingPage } from '../features/orders/OrderTrackingPage';
import { OrderHistoryPage } from '../features/orders/OrderHistoryPage';
import { LoginPage } from '../features/auth/LoginPage';
import { FarmerDashboard } from '../features/farmer/FarmerDashboard';
import { AddProductPage } from '../features/farmer/AddProductPage';
import { FarmerRegisterPage } from '../features/farmer/FarmerRegisterPage';
import { FarmerPublicProfilePage } from '../features/farmer/FarmerPublicProfilePage';
import { AdminDashboard } from '../features/admin/AdminDashboard';

// Informational & Trust Pages
import { About } from '../pages/About';
import { Terms, Privacy } from '../pages/PrivacyAndTerms';
import { CancellationRefund } from '../pages/CancellationRefund';
import { Support } from '../pages/Support';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home & Discovery */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<MarketplacePage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/product/:slug" element={<ProductDetailsPage />} />
      <Route path="/farmer/:id" element={<FarmerPublicProfilePage />} />

      {/* Customer Purchasing */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      <Route path="/orders/confirmation" element={<OrderConfirmationPage />} />
      <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
      <Route path="/orders/tracking/:id" element={<OrderTrackingPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Farmer Production Hub */}
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
      <Route path="/farmer/add-product" element={<AddProductPage />} />
      <Route path="/farmer/products/new" element={<AddProductPage />} />
      <Route path="/farmer/register" element={<FarmerRegisterPage />} />

      {/* Admin Governance */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Trust & Static Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cancellation-refund" element={<CancellationRefund />} />
      <Route path="/support" element={<Support />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
