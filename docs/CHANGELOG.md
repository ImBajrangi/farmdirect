# FarmDirect — Changelog

## [1.1.0] - 2026-10-17
### Architectural Migration & Full Feature Completion
- **Strict Plain CSS & Zero Tailwind**: Uninstalled Tailwind CSS, PostCSS, and Autoprefixer. Replaced all styling with dedicated feature stylesheets and centralized design tokens (`src/styles/variables.css`, `global.css`, `typography.css`, `utilities.css`).
- **Feature-Based Architecture**:
  - `src/features/auth/`: `auth.service.ts`, `auth.types.ts`, `auth.css`, `LoginPage.tsx`
  - `src/features/products/`: `product.service.ts`, `product.types.ts`, `products.css`, `ProductCard.tsx`, `ProductList.tsx`, `ProductDetailsPage.tsx`, `MarketplacePage.tsx`
  - `src/features/cart/`: `cart.service.ts`, `cart.types.ts`, `cart.context.tsx`, `cart.css`, `CartPage.tsx`
  - `src/features/checkout/`: `checkout.service.ts`, `checkout.types.ts`, `checkout.css`, `CheckoutPage.tsx`
  - `src/features/orders/`: `order.service.ts`, `order.types.ts`, `orders.css`, `OrderConfirmationPage.tsx`, `OrderTrackingPage.tsx`, `OrderHistoryPage.tsx`
  - `src/features/farmer/`: `farmer.service.ts`, `farmer.types.ts`, `farmer.css`, `FarmerDashboard.tsx`, `AddProductPage.tsx`, `FarmerRegisterPage.tsx`, `FarmerPublicProfilePage.tsx`
  - `src/features/admin/`: `admin.service.ts`, `admin.types.ts`, `admin.css`, `AdminDashboard.tsx`
  - `src/features/payments/`: `payment.service.ts`, `payment.types.ts`, `payments.css`, `RazorpayModal.tsx`
  - `src/features/home/`: `home.css`, `HomePage.tsx`
- **Application Shell**:
  - `src/app/App.tsx`, `src/app/routes.tsx`, `src/app/providers.tsx`
- **Reusable Layout & Common Components**:
  - `src/components/common/`: `Button.tsx`, `Input.tsx`, `Modal.tsx`, `Loader.tsx`, `EmptyState.tsx`, `common.css`
  - `src/components/layout/`: `Header.tsx`, `Footer.tsx`, `Sidebar.tsx` (mobile bottom navigation), `layout.css`
- **Validation**:
  - Production build: `tsc -b && vite build` completed with **0 errors**.
  - Vitest test suite: 14/14 tests passing.

## [1.0.0] - 2026-10-17
### Added
- Complete 20-table PostgreSQL relational schema in `supabase/migrations/001_initial_schema.sql` with full Row Level Security (RLS).
- Exact integer paise currency calculation system avoiding floating point rounding errors.
- Multi-farmer cart grouping and atomic sub-order partitioning at checkout.
- Bilingual localization engine (English and हिन्दी / मराठी) with Devanagari slug sanitization.
- Pure CSS design tokens (`styles/variables.css`, `styles/global.css`, `styles/typography.css`, `styles/utilities.css`).
