import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from '../components/common/Loader';

const HomePage = lazy(() => import('../features/home/HomePage').then(m => ({ default: m.HomePage })));
const FarmDirectPlatform = lazy(() => import('../features/home/FarmDirectPlatform').then(m => ({ default: m.FarmDirectPlatform })));
const MarketplacePage = lazy(() => import('../features/products/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const ProductDetailsPage = lazy(() => import('../features/products/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('../features/cart/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('../features/orders/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const OrderTrackingPage = lazy(() => import('../features/orders/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const OrderHistoryPage = lazy(() => import('../features/orders/OrderHistoryPage').then(m => ({ default: m.OrderHistoryPage })));
const LoginPage = lazy(() => import('../features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const FarmerDashboard = lazy(() => import('../features/farmer/FarmerDashboard').then(m => ({ default: m.FarmerDashboard })));
const AddProductPage = lazy(() => import('../features/farmer/AddProductPage').then(m => ({ default: m.AddProductPage })));
const FarmerRegisterPage = lazy(() => import('../features/farmer/FarmerRegisterPage').then(m => ({ default: m.FarmerRegisterPage })));
const FarmerPublicProfilePage = lazy(() => import('../features/farmer/FarmerPublicProfilePage').then(m => ({ default: m.FarmerPublicProfilePage })));
const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Informational & Trust Pages
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const Terms = lazy(() => import('../pages/PrivacyAndTerms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('../pages/PrivacyAndTerms').then(m => ({ default: m.Privacy })));
const CancellationRefund = lazy(() => import('../pages/CancellationRefund').then(m => ({ default: m.CancellationRefund })));
const Support = lazy(() => import('../pages/Support').then(m => ({ default: m.Support })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loader size="md" message="Loading FarmDirect..." />}>
      <Routes>
        {/* Core FarmDirect Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/farmdirect" element={<HomePage />} />
        <Route path="/platform" element={<FarmDirectPlatform />} />

        {/* Marketplace & Catalog */}
        <Route path="/products" element={<MarketplacePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/farmer/:id" element={<FarmerPublicProfilePage />} />

        {/* Customer Purchasing & Orders */}
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

        {/* Trust & Policy Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation-refund" element={<CancellationRefund />} />
        <Route path="/support" element={<Support />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
