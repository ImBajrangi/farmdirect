# 09 — Prioritized Redesign Roadmap & Issue Register

This roadmap establishes a sequenced, risk-managed engineering schedule for the subsequent redesign phase.

---

## 1. Ranked Forensic Issue Register

| ID | Screen | Identified Issue | Severity | User Impact | Proposed Redesign Direction | Effort | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-01** | Global | Faint caption text (`#728A7E`) fails WCAG AA contrast on light surfaces | **High** | Poor legibility in outdoor agricultural settings | Darken `--text-faint` token in `variables.css` to `#4A6356` | Small | `variables.css` |
| **ISS-02** | Checkout | Lack of delivery slot visualization and farmer payout transparency | **High** | Reduced buyer trust and unclear fulfillment expectations | Implement split fulfillment layout with direct farmer payout badge (88%) | Large | `CheckoutPage.tsx`, `checkout.css` |
| **ISS-03** | Farmer Reg | Long 14-field form causes completion friction on mobile | **High** | High drop-off during rural farmer onboarding | Convert into guided 3-stage progress stepper with live 7/12 document validation | Medium | `FarmerRegisterPage.tsx` |
| **ISS-04** | Global | Missing `:focus-visible` styling on custom buttons | **High** | Impairs keyboard-only and screen reader navigation | Add global accessible focus ring in `global.css` | Small | `global.css` |
| **ISS-05** | Orders | Empty order history renders as bare text without action pathways | **Medium** | Lost sales conversion when orders list is empty | Introduce branded empty-state graphic with quick "Explore Fresh Produce" CTA | Small | `OrderHistoryPage.tsx` |
| **ISS-06** | Admin | Desktop KYC table lacks multi-column sort and bulk verification actions | **Medium** | Governance bottleneck as farm network expands | Add sortable column headers and bulk "Verify Selected" toolbar | Medium | `AdminDashboard.tsx`, `admin.css` |
| **ISS-07** | Add Produce | Produce creation lacks live visual feedback of how listing appears in store | **Medium** | Farmers list broken images or suboptimal descriptions | Add live Card B preview rail updating synchronously as inputs change | Medium | `AddProductPage.tsx` |
| **ISS-08** | Global | Touch targets on small buttons (header & steppers) are `< 44px` on mobile | **Medium** | Accidental mis-clicks on mobile devices | Enforce `min-height: 44px; min-width: 44px` touch bounding boxes | Small | `layout.css`, `products.css` |
| **ISS-09** | Cart | Subtle delivery fee threshold indicators | **Low** | Buyers miss free delivery incentive | Add animated free delivery progress meter ("Add ₹40 more for Free Dawn Delivery") | Small | `CartPage.tsx`, `cart.css` |
| **ISS-10** | About | Dense line heights on long-form paragraphs (`1.4`) | **Low** | Reading fatigue on mission documentation | Increase paragraph `line-height` to `1.6` with refined section spacing | Small | `About.tsx`, `legal-pages.css` |

---

## 2. Multi-Phase Implementation Plan

### Phase 0: Baseline & Protection of Existing User Changes
- **Objective**: Freeze baseline state, ensure zero git regression on uncommitted user files, verify `ProductCard.tsx` protection lock.
- **Affected Files**: Git tracking, test suites.
- **Acceptance Criteria**: `git status` clean of accidental reverts; `ProductCard.tsx` checksum verified.

### Phase 1: Foundational Design Tokens & Accessibility
- **Objective**: Refine global CSS variables, darken muted text tokens to pass WCAG AA, implement accessible `:focus-visible` rings.
- **Affected Files**: `src/styles/variables.css`, `src/styles/global.css`, `src/styles/typography.css`.
- **Acceptance Criteria**: All contrast ratios `> 4.5:1`; keyboard tabbing reveals green focus rings.

### Phase 2: Farmer Operations & Workdesk Polish
- **Objective**: Refine the 2-column Farmer Workdesk (`FarmerDashboard.tsx`), elevate order dispatch deck, integrate live harvest logs.
- **Affected Files**: `src/features/farmer/FarmerDashboard.tsx`, `src/features/farmer/farmer.css`.
- **Acceptance Criteria**: One-tap order packing confirmation; live stock meters responsive on 375px screens.

### Phase 3: Platform Governance & Admin Command Center
- **Objective**: Add bulk verification actions, sortable columns, and side-by-side land record dossier inspection on desktop.
- **Affected Files**: `src/features/admin/AdminDashboard.tsx`, `src/features/admin/admin.css`.
- **Acceptance Criteria**: Zero horizontal table overflow across all breakpoints; batch verification working.

### Phase 4: Authentication & Onboarding Forms
- **Objective**: Implement 3-stage progress stepper in Farmer Registration; integrate OTP authentication toggle on Login.
- **Affected Files**: `src/features/auth/LoginPage.tsx`, `src/features/farmer/FarmerRegisterPage.tsx`.
- **Acceptance Criteria**: Registration completion rate optimized; mobile touch keyboard triggers appropriate input types (`tel`, `numeric`).

### Phase 5: Produce Listing & Live Card Preview
- **Objective**: Build side-by-side live Card B preview into `AddProductPage.tsx`.
- **Affected Files**: `src/features/farmer/AddProductPage.tsx`, `src/features/farmer/farmer.css`.
- **Acceptance Criteria**: Typing crop name and price updates the preview card in real-time.

### Phase 6: Customer Checkout & Order Lifecycle
- **Objective**: Redesign Cart, Checkout, and Order History with transparent farmer payout splits and dawn dispatch countdowns.
- **Affected Files**: `src/features/checkout/CheckoutPage.tsx`, `src/features/cart/CartPage.tsx`, `src/features/orders/OrderHistoryPage.tsx`.
- **Acceptance Criteria**: Checkout funnel seamless on 375px mobile; order tracking receipt clearly displayed.

### Phase 7: Full Regression Testing & Visual Diff Audit
- **Objective**: Run automated test suite (`npm test`), build production bundle (`npm run build`), capture complete 48-screenshot visual comparison suite.
- **Acceptance Criteria**: 22/22 tests passing; 0 build errors; `ProductCard.tsx` visually unchanged.
