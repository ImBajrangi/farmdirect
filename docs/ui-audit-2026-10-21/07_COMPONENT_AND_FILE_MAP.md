# 07 — Component and Source File Map

This document maps all user-facing screens to their respective source components, stylesheets, shared dependencies, complexity estimates, and regression risks.

---

## 1. Screen-to-File Architecture Matrix

| Screen / Feature | Primary Component File | Associated Stylesheet(s) | Shared Dependencies | Redesign Complexity | Regression Risk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Landing Page** | [`src/features/home/HomePage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/home/HomePage.tsx) | [`src/features/home/home.css`](file:///Users/sakhi/Code/farmdirect/src/features/home/home.css) | `Header.tsx`, `variables.css` | **Small** | Low (Approved Master Reference) |
| **Platform Model** | [`src/features/home/FarmDirectPlatform.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/home/FarmDirectPlatform.tsx) | [`src/features/home/platform.css`](file:///Users/sakhi/Code/farmdirect/src/features/home/platform.css) | `Header.tsx` | **Small** | Low |
| **Marketplace Page** | [`src/features/products/MarketplacePage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/products/MarketplacePage.tsx) | [`src/features/products/products.css`](file:///Users/sakhi/Code/farmdirect/src/features/products/products.css) | `ProductCard.tsx` (**LOCKED**), `Header.tsx` | **Medium** | **High** (Must isolate surrounding grid from Card B) |
| **Marketplace Product Card** | [`src/features/products/ProductCard.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/products/ProductCard.tsx) | `.product-card-b` in `products.css` | `CartContext.tsx`, `currency.ts` | **ZERO (LOCKED)** | **CRITICAL** (DO NOT MODIFY) |
| **Product Detail** | [`src/features/products/ProductDetailsPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/products/ProductDetailsPage.tsx) | `products.css` | `CartContext.tsx` | **Medium** | Low |
| **Shopping Cart** | [`src/features/cart/CartPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/cart/CartPage.tsx) | [`src/features/cart/cart.css`](file:///Users/sakhi/Code/farmdirect/src/features/cart/cart.css) | `CartContext.tsx`, `Header.tsx` | **Medium** | Medium (Cart calculation math) |
| **Order Checkout** | [`src/features/checkout/CheckoutPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/checkout/CheckoutPage.tsx) | [`src/features/checkout/checkout.css`](file:///Users/sakhi/Code/farmdirect/src/features/checkout/checkout.css) | `CartContext.tsx`, `marketplaceService.ts` | **Large** | High (Order submission & payment) |
| **Order History** | [`src/features/orders/OrderHistoryPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/orders/OrderHistoryPage.tsx) | [`src/features/orders/orders.css`](file:///Users/sakhi/Code/farmdirect/src/features/orders/orders.css) | `Header.tsx` | **Medium** | Low |
| **Authentication** | [`src/features/auth/LoginPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/auth/LoginPage.tsx) | [`src/features/auth/auth.css`](file:///Users/sakhi/Code/farmdirect/src/features/auth/auth.css) | `AuthContext.tsx`, `ImagePlaceholder.tsx` | **Small** | Low |
| **Farmer Dashboard** | [`src/features/farmer/FarmerDashboard.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/farmer/FarmerDashboard.tsx) | [`src/features/farmer/farmer.css`](file:///Users/sakhi/Code/farmdirect/src/features/farmer/farmer.css) | `ImagePlaceholder.tsx`, `farmer.service.ts` | **Medium** | Medium (Live stock update state) |
| **Add Produce** | [`src/features/farmer/AddProductPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/farmer/AddProductPage.tsx) | `farmer.css` | `ImagePlaceholder.tsx`, `farmer.service.ts` | **Medium** | Low |
| **Farmer Register** | [`src/features/farmer/FarmerRegisterPage.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/farmer/FarmerRegisterPage.tsx) | `farmer.css` | `ImagePlaceholder.tsx`, `AuthContext.tsx` | **Medium** | Low |
| **Admin Dashboard** | [`src/features/admin/AdminDashboard.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/admin/AdminDashboard.tsx) | [`src/features/admin/admin.css`](file:///Users/sakhi/Code/farmdirect/src/features/admin/admin.css) | `ImagePlaceholder.tsx` | **Medium** | Low |

---

## 2. Reusable Primitives & Architectural Health

### Existing Reusable Primitives
1. [`src/components/common/ImagePlaceholder.tsx`](file:///Users/sakhi/Code/farmdirect/src/components/common/ImagePlaceholder.tsx): Reusable component handling aspect ratios, neutral borders, developer dimensions, and responsive resizing.
2. [`src/components/common/Loader.tsx`](file:///Users/sakhi/Code/farmdirect/src/components/common/Loader.tsx): Generic animated loading state with customizable text message.
3. [`src/components/layout/Header.tsx`](file:///Users/sakhi/Code/farmdirect/src/components/layout/Header.tsx): Multi-role top bar with localized language switcher and live cart pill.

### High-Impact Global CSS Risks
- **`src/styles/variables.css`**: Modifying existing typography or spacing tokens could subtly distort `ProductCard.tsx` if card rules inherit system font-size or spacing without local overrides. Always scope new redesign tokens or declare explicit dimensions on protected cards.
- **`src/styles/global.css`**: Global `button` or `input` resets must not override `.stepper-btn-b` or `.product-order-btn-b`.

---

## 3. Test Coverage & Missing Regression Suites

- **Existing Tests**: [`src/tests/marketplace.test.ts`](file:///Users/sakhi/Code/farmdirect/src/tests/marketplace.test.ts) covers 22 assertions verifying product catalog queries, category filters, organic filtering, and mock database queries. All 22 tests pass.
- **Missing Regression Coverage**:
  - Automated visual regression testing for `ProductCard.tsx` (presently reliant on manual/screenshot diffing).
  - Unit tests for Cart state mutations (`CartContext.tsx`).
  - Unit tests for Farmer stock adjustments in `farmer.service.ts`.
