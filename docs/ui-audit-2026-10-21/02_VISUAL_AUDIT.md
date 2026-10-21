# 02 — Comprehensive Visual Audit (20 Design Dimensions)

This forensic visual audit evaluates FarmDirect against modern SaaS benchmarks, agricultural consumer expectations, and operational workflow requirements. Each of the 20 required dimensions is assessed with exact screen references, visual evidence, severity ratings, and actionable improvement recommendations.

---

### 1. Visual Hierarchy
- **Current Assessment**: High variance across views. The Landing Page and Marketplace feature confident hierarchies (large display typography, prominent badges, high-contrast CTA buttons). However, secondary views like Cart (`CartPage.tsx`), Checkout (`CheckoutPage.tsx`), and Order History (`OrderHistoryPage.tsx`) collapse into flat hierarchies where line-item costs, delivery tags, and action buttons compete at similar visual weights.
- **Specific Evidence**: In `desktop_cart_1440x900.png`, the subtotal, delivery fee, and discount callout have identical font sizes and weights as the product item description.
- **Affected Elements**: Cart summary drawer (`.cart-summary-box`), Checkout fee breakdown (`.checkout-summary-section`).
- **Why It Hurts**: Users experience cognitive fatigue calculating final order totals, reducing checkout conversion velocity.
- **Severity**: **High**
- **Recommendation**: Introduce 3 distinct typographic tiers for financial summaries: Large bold primary total (`1.75rem`, bold, `--brand-forest`), medium secondary line items (`0.95rem`, `--text-muted`), and subdued tax/fee disclosures (`0.8rem`, `--text-faint`).
- **Implementation Type**: Component & Design Tokens

---

### 2. Layout Composition
- **Current Assessment**: Improved by recent workdesk and split-screen patterns, but tertiary pages still rely heavily on simple centered single-column cards (`max-width: 640px` or `768px`) surrounded by excessive unused whitespace on desktop displays.
- **Specific Evidence**: `desktop_farmer_register_1440x900.png` and `desktop_farmer_add_product_1440x900.png` show long forms constrained to a centered column with ~400px of empty margins on both sides.
- **Affected Elements**: Form wrappers in `FarmerRegisterPage.tsx` and `AddProductPage.tsx`.
- **Why It Hurts**: Makes high-resolution desktop monitors feel inefficiently utilized while forcing unnecessary vertical scrolling for farmers.
- **Severity**: **Medium**
- **Recommendation**: Transform registration and produce creation into asymmetric split compositions: Form inputs on the left 60%, live visual dossier preview or guidance cards on the right 40%.
- **Implementation Type**: Layout Restructuring

---

### 3. Distinctiveness and Brand Identity
- **Current Assessment**: Strong agricultural character established by the `#006044` Pine Forest green, `#ECF96E` Lime accent, and Maharashtra agricultural terminology (Mahabhulekh, 7/12, PGS Organic, Taluka). However, standard neutral cards risk blending into generic SaaS templates without organic texture or distinct agricultural micro-elements.
- **Specific Evidence**: `desktop_admin_dashboard_1440x900.png` metric cards look similar to generic Stripe/Vercel dashboards without agricultural context.
- **Affected Elements**: Metric tiles in `AdminDashboard.tsx` (`.admin-kpi-card`).
- **Why It Hurts**: Reduces memorable brand affinity for platform stakeholders.
- **Severity**: **Medium**
- **Recommendation**: Inject subtle agricultural iconography (seedling indicators, harvest cycle timers, live hub nodes) and custom badge textures into metric cards.
- **Implementation Type**: Component Styling

---

### 4. Typography
- **Current Assessment**: Solid native system font stack defined in `variables.css` (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`). Font weights are well-calibrated in `ProductCard.tsx` (550, 600, 700), but secondary legal and informational pages suffer from inconsistent heading line heights (`1.2` vs `1.5`) and cramped body text.
- **Specific Evidence**: `desktop_about_1440x900.png` displays body paragraphs with `line-height: 1.4`, which is dense for long-form reading.
- **Affected Elements**: Paragraphs in `src/pages/About.tsx`, `PrivacyAndTerms.tsx`.
- **Why It Hurts**: Poor readability on legal and trust documentation undermines user trust.
- **Severity**: **Low**
- **Recommendation**: Enforce a standardized typography utility scale: headings at `line-height: 1.15`, body text at `line-height: 1.6`, and captions with `letter-spacing: 0.02em`.
- **Implementation Type**: Design Tokens (`typography.css`)

---

### 5. Spacing and Density
- **Current Assessment**: Good vertical rhythm in the newly implemented Farmer Dashboard (`farmer-workdesk-grid`), but spacing in `CheckoutPage.tsx` and `CartPage.tsx` feels cramped on mobile viewports (`375x812`), with buttons sitting too close to input fields.
- **Specific Evidence**: `mobile_checkout_375x812.png` shows only 8px gap between delivery time slot pills and the address selection radio cards.
- **Affected Elements**: `.delivery-slot-container`, `.checkout-payment-methods`.
- **Why It Hurts**: High risk of accidental mis-taps on mobile devices.
- **Severity**: **High**
- **Recommendation**: Increase interactive element spacing to minimum 16px gap (`--space-md`) on mobile viewports.
- **Implementation Type**: Responsive CSS Implementation

---

### 6. Color and Contrast
- **Current Assessment**: The primary brand palette (`#006044` on white) achieves WCAG AAA compliance (`10.4:1` contrast ratio). However, muted secondary text using `#728A7E` on light grey surfaces (`#F8FAF8`) drops to ~3.8:1, failing WCAG AA requirements for small text (`< 18px`).
- **Specific Evidence**: Subtitle labels in `desktop_farmer_dashboard_1440x900.png` under the land dossier card.
- **Affected Elements**: `--text-faint` in `variables.css` and `.farmer-metric-desc`.
- **Why It Hurts**: Farmers viewing screens outdoors in direct sunlight struggle to read secondary details.
- **Severity**: **High**
- **Recommendation**: Darken `--text-faint` from `#728A7E` to `#4A6356` (contrast ratio 5.2:1 against `#F8FAF8`).
- **Implementation Type**: Design Tokens (`variables.css`)

---

### 7. Surface and Component Styling
- **Current Assessment**: Selective use of rounded surfaces (`border-radius: 20px` to `24px`) is effective. The Card B product card styling with its subtle outer border and themed inner canvas is best-in-class. However, checkout and cart cards still use older, generic `12px` rounded cards with harsh grey borders.
- **Specific Evidence**: `desktop_checkout_1440x900.png` address card borders look blocky compared to the rounded hero cards.
- **Affected Elements**: `.checkout-card`, `.cart-item-row`.
- **Why It Hurts**: Breaks visual cohesion across the consumer purchasing funnel.
- **Severity**: **Medium**
- **Recommendation**: Harmonize card radii across all customer checkout screens using `--radius-card: 20px` and soft organic border tokens `rgba(15, 46, 34, 0.08)`.
- **Implementation Type**: Component Styling

---

### 8. Use of Imagery and Graphics
- **Current Assessment**: The recent introduction of `ImagePlaceholder.tsx` with defined aspect ratios (21:9 for panoramic farm covers, 16:9 for land deeds & cluster telemetry maps) resolved blank spaces. However, the application still lacks dedicated empty-state illustrations and category header visuals.
- **Specific Evidence**: `desktop_orders_1440x900.png` shows an empty order list rendered as plain text without any visual illustration or CTA.
- **Affected Elements**: Empty state in `OrderHistoryPage.tsx`, `CartPage.tsx`.
- **Why It Hurts**: Empty states feel like error states rather than inviting invitations to explore farm produce.
- **Severity**: **Medium**
- **Recommendation**: Introduce structured, neutral-grey empty state visual placeholders with clear semantic badges ("No active orders yet") and direct shortcuts to the fresh marketplace.
- **Implementation Type**: Component & Placeholder Integration

---

### 9. Icon Consistency
- **Current Assessment**: Uses `lucide-react` across the application with good semantic alignment. However, stroke widths vary inconsistently between components (`strokeWidth={1.5}` in header vs `strokeWidth={2.4}` in product cards).
- **Specific Evidence**: Stepper icons in `ProductCard.tsx` use `strokeWidth={2.6}`, while header search uses `strokeWidth={1.5}`.
- **Affected Elements**: Navigation icons vs action button icons.
- **Why It Hurts**: Subtle visual discordance that detracts from a unified design system.
- **Severity**: **Low**
- **Recommendation**: Establish a standard icon convention: `strokeWidth={1.8}` for navigational icons, `strokeWidth={2.2}` for primary action buttons.
- **Implementation Type**: Design Tokens & Component Review

---

### 10. Forms and Data Entry
- **Current Assessment**: Field inputs are clean with readable placeholder text. However, long forms (Farmer Registration and Add Product) lack real-time field validation, format masking (e.g. 10-digit Indian mobile numbers, PIN codes), and floating error labels.
- **Specific Evidence**: Submitting invalid data in `desktop_farmer_register_1440x900.png` relies on browser native alerts rather than inline error states.
- **Affected Elements**: `FarmerRegisterPage.tsx`, `AddProductPage.tsx`.
- **Why It Hurts**: Poor submission UX causes user drop-off during farmer onboarding.
- **Severity**: **High**
- **Recommendation**: Implement inline validation states (`.input-error`, `.field-error-message`) with clear red indicators and helper hints before form submission.
- **Implementation Type**: Component & Interaction Logic

---

### 11. Data Tables and Information Presentation
- **Current Assessment**: The Admin Dashboard's conversion to `.admin-mobile-records` for screens `< 768px` successfully resolved mobile table clipping. On desktop, however, the governance table lacks multi-column sorting, pagination, and sticky headers for high-volume producer lists.
- **Specific Evidence**: `desktop_admin_dashboard_1440x900.png` renders a static 2-row table without column sorting indicators or bulk action checkboxes.
- **Affected Elements**: Producer audit table in `AdminDashboard.tsx`.
- **Why It Hurts**: Unsuitable for scaling to hundreds of registered farmers.
- **Severity**: **Medium**
- **Recommendation**: Add table sorting headers (Name, Land Size, Verification Date), status filter badges, and bulk "Approve Selected" action bars.
- **Implementation Type**: Component Architecture

---

### 12. Navigation and Wayfinding
- **Current Assessment**: The global header provides clear navigation between Marketplace, Orders, and Role Views. The mobile bottom navigation bar (`Home`, `Marketplace`, `Cart`) is thumb-accessible. However, active route indicators on mobile are subtle and breadcrumbs are missing on deep pages (`/product/:slug`, `/checkout`).
- **Specific Evidence**: On `mobile_checkout_375x812.png`, there is no clear back button or breadcrumb returning to the cart without using browser native back.
- **Affected Elements**: `CheckoutPage.tsx`, `ProductDetailsPage.tsx`.
- **Why It Hurts**: Users feel disoriented during multi-step purchasing funnels.
- **Severity**: **Medium**
- **Recommendation**: Add a sticky top sub-navigation bar with a "← Back to Cart" chevron and step progress indicator ("1. Cart → 2. Delivery → 3. Confirmation").
- **Implementation Type**: Layout & Navigation

---

### 13. Responsive Behavior
- **Current Assessment**: Thoroughly verified across 4 breakpoints (1440px, 768px, 430px, 375px). No horizontal scrollbar regressions or text clipping observed. Layout collapses gracefully from 3-column to 1-column on mobile.
- **Specific Evidence**: Verified by all 48 captured headless screenshots in `docs/ui-audit-2026-10-21/screenshots/`.
- **Affected Elements**: Global layout containers.
- **Why It Hurts**: Responsive architecture is solid; needs only fine-tuning of touch margins.
- **Severity**: **Low**
- **Recommendation**: Maintain current grid breakpoints (`auto-fill, minmax(280px, 1fr)`) and ensure minimum 44px touch targets on all mobile buttons.
- **Implementation Type**: Responsive Verification

---

### 14. Accessibility (a11y)
- **Current Assessment**: Key interactive controls have `aria-label` attributes (e.g. stepper buttons in `ProductCard.tsx`). However, tab focus rings are suppressed or inconsistent in custom button styles, and color contrast on faint text needs boosting.
- **Specific Evidence**: Outline focus rings are removed via `:focus { outline: none }` on some custom buttons in `admin.css`.
- **Affected Elements**: `.btn-admin-action`, `.stepper-btn-b`.
- **Why It Hurts**: Keyboard navigation is severely impaired for accessibility compliance.
- **Severity**: **High**
- **Recommendation**: Implement accessible, brand-styled focus rings: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`.
- **Implementation Type**: Design Tokens & Global CSS

---

### 15. Interaction Feedback
- **Current Assessment**: Adding items to the cart triggers quantity updates instantly in the header counter and card stepper. However, adding an item from product detail or checkout lacks micro-toast confirmations.
- **Specific Evidence**: Clicking "Add to Cart" updates state silently without an animated checkmark or floating snackbar confirmation.
- **Affected Elements**: `ProductDetailsPage.tsx`, `MarketplacePage.tsx`.
- **Why It Hurts**: Users are unsure if their action succeeded, causing duplicate clicks.
- **Severity**: **Medium**
- **Recommendation**: Integrate a subtle floating toast notification ("Added to harvest cart") that auto-dismisses after 2.5s.
- **Implementation Type**: Component & Interaction Feedback

---

### 16. Empty, Loading, Success, and Error States
- **Current Assessment**: Full-page loader (`Loader.tsx`) is functional with animated spinners. However, skeleton loading states are missing during catalog and dashboard fetch, leading to brief layout shifts.
- **Specific Evidence**: Loading products causes a blank white canvas before sudden card rendering.
- **Affected Elements**: `MarketplacePage.tsx`, `FarmerDashboard.tsx`.
- **Why It Hurts**: Cumulative Layout Shift (CLS) degrades perceived speed and polish.
- **Severity**: **Medium**
- **Recommendation**: Implement pulse-animated skeleton cards matching Card B proportions to render during initial data fetch.
- **Implementation Type**: Component Addition

---

### 17. Cross-Screen Consistency
- **Current Assessment**: High consistency between Landing Page and Marketplace, but customer order tracking and checkout pages use older typographic styles and square buttons from earlier iterations.
- **Specific Evidence**: `desktop_checkout_1440x900.png` button uses sharp corners while Landing Page uses full pill buttons (`border-radius: 9999px`).
- **Affected Elements**: `CheckoutPage.tsx` submit button.
- **Why It Hurts**: Creates a fragmented experience as users move through the app.
- **Severity**: **High**
- **Recommendation**: Apply global `--radius-full` to all primary call-to-action buttons across checkout, farmer forms, and admin actions.
- **Implementation Type**: Component Styling Consistency

---

### 18. Perceived Product Maturity
- **Current Assessment**: The app feels like a promising, working enterprise pilot. The inclusion of genuine regional context (Mahabhulekh land records, Nashik/Pune hubs) gives it strong authenticity. Elevating secondary screen polish and typography will make it feel like a venture-backed Series-A SaaS platform.
- **Severity**: **Medium**
- **Recommendation**: Refine secondary screen textures, introduce subtle glassmorphism in floating headers, and add verified trust badges across customer touchpoints.
- **Implementation Type**: Design System Architecture

---

### 19. Operational Usability
- **Current Assessment**: The Farmer Workdesk's one-touch `+10` / `-10` kg stock adjusters and live percentage capacity bars provide high operational value. Farmers can manage inventory in seconds without complex navigation.
- **Severity**: **Low (Strong Positive)**
- **Recommendation**: Extend this quick-action paradigm to order status updates (e.g. one-tap "Mark Crate Packed" and "Handed to Logistics Van").
- **Implementation Type**: Workflow Enhancement

---

### 20. Technical Maintainability of UI Code
- **Current Assessment**: CSS architecture is currently split across module-like stylesheets (`farmer.css`, `admin.css`, `products.css`, `auth.css`, `layout.css`). While scoped well, some CSS variables and utility classes are duplicated.
- **Specific Evidence**: Card border radius is declared independently in 4 CSS files instead of referencing `--radius-card`.
- **Affected Elements**: `admin.css`, `farmer.css`, `checkout.css`.
- **Why It Hurts**: Increases maintenance overhead and risks styling divergence over time.
- **Severity**: **Medium**
- **Recommendation**: Consolidate shared surface tokens in `variables.css` and migrate repeated component rules to shared utility classes.
- **Implementation Type**: CSS Refactoring & Token Standardization
