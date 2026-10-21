# 11 — Implementation Handoff Prompt for Future AI Coding Agent

This document is the actionable implementation directive for the subsequent engineering agent. It translates the forensic audit findings into explicit coding instructions.

---

```markdown
# TASK PROMPT: FarmDirect Modern SaaS Full Platform Implementation

## 1. MISSION & CONTEXT
You are implementing the comprehensive visual and operational redesign of FarmDirect based on the forensic audit in `docs/ui-audit-2026-10-21/`. Your objective is to elevate the platform into a venture-grade agricultural SaaS application while preserving all business rules, Supabase data contracts, and existing uncommitted work.

## 2. STRICT NON-NEGOTIABLE SAFETY & PROTECTION DIRECTIVES
1. **PROTECTED COMPONENT LOCK**: You must NEVER modify `src/features/products/ProductCard.tsx` or `.product-card-b` in `src/features/products/products.css`. This component is approved, validated, and must remain pixel-for-pixel unchanged.
2. **PRESERVE USER WORK**: Run `git status --short` before starting. Treat all pre-existing uncommitted files as user-owned. Never execute `git checkout -- .`, `git reset`, or destructive git commands.
3. **PRESERVE FUNCTIONALITY**: Do not alter Supabase client queries, cart pricing calculations (`currency.ts`), local mock fallbacks, or role switching in `AuthContext.tsx`.

## 3. SCOPE OF IMPLEMENTATION PHASES

### Phase 1: Design Tokens & Accessibility
- **Target Files**: `src/styles/variables.css`, `src/styles/global.css`.
- **Changes**:
  - Darken `--text-faint` from `#728A7E` to `#4A6356` to pass WCAG AA contrast on light surfaces.
  - Add accessible `:focus-visible` styling (`outline: 2px solid var(--accent); outline-offset: 2px`).
  - Standardize button border radii using `--radius-full: 9999px` and card radii using `--radius-card: 20px`.

### Phase 2: Customer Checkout & Order Lifecycle
- **Target Files**: `src/features/checkout/CheckoutPage.tsx`, `src/features/checkout/checkout.css`, `src/features/cart/CartPage.tsx`, `src/features/orders/OrderHistoryPage.tsx`.
- **Changes**:
  - Redesign Checkout into a split desk: Left 65% fulfillment options (dawn harvest slot, delivery address, UPI payment); Right 35% transparent order receipt showing 88% direct farmer payout split.
  - Redesign empty states in Cart and Order History with branded illustrations and direct marketplace shortcuts.

### Phase 3: Farmer Operations & Workdesk Polish
- **Target Files**: `src/features/farmer/FarmerDashboard.tsx`, `src/features/farmer/farmer.css`.
- **Changes**:
  - Deepen the 2-column workdesk: Left inventory rail with stock capacity meters and +/-10kg adjusters; Right rail with instant order packing action triggers.
  - Maintain the 21:9 farm panoramic landscape placeholder and 16:9 Mahabhulekh 7/12 land dossier placeholder.

### Phase 4: Platform Governance & Admin Command Center
- **Target Files**: `src/features/admin/AdminDashboard.tsx`, `src/features/admin/admin.css`.
- **Changes**:
  - Add sortable table column headers and batch "Verify Selected" action toolbar.
  - Ensure the responsive `.admin-mobile-records` pattern continues to handle mobile viewports seamlessly without table clipping.

### Phase 5: Onboarding & Produce Listing Forms
- **Target Files**: `src/features/farmer/FarmerRegisterPage.tsx`, `src/features/farmer/AddProductPage.tsx`.
- **Changes**:
  - Convert Farmer Registration into a 3-stage progressive stepper (Identity -> Landholding -> 7/12 Land Document).
  - Add live Card B preview rail to Add Produce page updating in real time.

## 4. VERIFICATION & EVIDENCE CRITERIA
1. **Automated Tests**: Run `npm test` and verify that all 22 tests in `src/tests/marketplace.test.ts` pass cleanly.
2. **Production Build**: Run `npm run build` and ensure Vite compiles with 0 errors and 0 warnings.
3. **Visual Regression Verification**: Capture browser screenshots of all modified screens across 4 viewports (1440x900, 768x1024, 430x932, 375x812) using headless Chrome.
4. **Marketplace Card Check**: Compare `desktop_marketplace_1440x900.png` against `docs/ui-audit-2026-10-21/screenshots/desktop_marketplace_1440x900.png` to confirm 100% pixel fidelity on product cards.
```
