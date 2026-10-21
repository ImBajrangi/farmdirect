# 08 — Strict Marketplace Product-Card Protection Protocol

## NON-NEGOTIABLE CORE DIRECTIVE

**The existing Marketplace product-card UI ("Card B") is approved, validated, and must remain visually identical and completely protected.**

Future redesign implementations must NOT modify, refactor, replace, or restyle this component under any circumstances.

---

## 1. Protected Component Architecture

- **Primary Source Component**: [`src/features/products/ProductCard.tsx`](file:///Users/sakhi/Code/farmdirect/src/features/products/ProductCard.tsx)
- **Primary Stylesheet Block**: Lines 452–650 in [`src/features/products/products.css`](file:///Users/sakhi/Code/farmdirect/src/features/products/products.css)
- **Protected CSS Selectors**:
  - `.product-card-b`
  - `.product-canvas-b`
  - `.product-canvas-link-b`
  - `.product-canvas-img-b`
  - `.product-canvas-ribbon-b`
  - `.product-footer-split-b`
  - `.product-active-cart-container-b`
  - `.product-title-b`
  - `.product-active-cart-row-b`
  - `.product-active-price-wrap-b`
  - `.product-active-price-val-b`
  - `.product-active-unit-sub-b`
  - `.product-stepper-b`
  - `.product-stepper-spacious`
  - `.stepper-btn-b`
  - `.stepper-qty-b`
  - `.product-left-col-b`
  - `.product-tags-row-b`
  - `.product-trait-pill-b`
  - `.product-right-col-b`
  - `.product-price-val-b`
  - `.product-soldout-b`
  - `.product-order-btn-b`

---

## 2. Dynamic Color Theming System (Embedded in Component)

Card B implements an inline dynamic color theming function `getItemTheme(slug: string)` that assigns custom organic palettes based on crop type:
1. **Red Onions (`kanda`)**: Soft Blush Rose canvas (`#FFF1F2`), deep crimson ribbon (`#FFE4E6`, text `#9F1239`), crimson border.
2. **Grapes (`draksh`)**: Soft Lilac canvas (`#F5F3FF`), violet ribbon (`#EDE9FE`, text `#6B21A8`), purple border.
3. **Spinach & Green Veggies (`palak`, `methi`)**: Soft Mint canvas (`#F0FDF4`), emerald ribbon (`#DCFCE7`, text `#15803D`).
4. **Wheat / Grains (`gehu`, `lokwan`)**: Soft Warm Amber canvas (`#FFFBEB`), golden harvest ribbon (`#FEF3C7`, text `#92400E`).
5. **Gir Cow Dairy (`ghee`, `toop`)**: Soft Sunlit Cream canvas (`#FEFCE8`), honey gold ribbon (`#FEF9C3`, text `#854D0E`).
6. **Tomatoes & Spices (`tamatar`)**: Pastel Coral canvas (`#FEF2F2`), field crimson ribbon (`#FEE2E2`, text `#991B1B`).

---

## 3. Protected Visual Dimensions & Proportions

- **Outer Shell**: `border-radius: 34px`, padding `10px 10px 18px 10px`, background `#FFFFFF`.
- **Inner Canvas**: `border-radius: 26px`, `aspect-ratio: 1 / 1.05`, overflow hidden.
- **Harvest Ribbon**: Positioned `bottom: 0`, height ~`32px`, font-size `0.72rem`, `font-weight: 550`, bottom border-radius `26px`.
- **Footer Split**: Left title + traits (`flex: 1`), Right price + order button (`flex-shrink: 0`).
- **Interactive States**:
  - `currentQty === 0`: Shows "Order Now ↗" pill button (`border-radius: 9999px`, font-size `0.75rem`).
  - `currentQty > 0`: Smoothly expands to reveal full-width price + spacious `[-] [Qty] [+]` stepper.

---

## 4. Protected Dependency Risk Map

| Dependency Level | Source File | Risk to Product Card | Protection Mechanism |
| :--- | :--- | :--- | :--- |
| **Global Resets** | `src/styles/global.css` | Global `button` or `a` styles could remove card padding or change link text colors. | All Card B selectors have explicit overrides and scoped class names (`.stepper-btn-b`, `.product-canvas-link-b`). |
| **Design Tokens** | `src/styles/variables.css` | Changing `--fs-body` or `--radius-md` could alter card typography or corners if inherited. | Card B defines hardcoded explicit radii (`34px`, `26px`) and explicit fonts (`1.0625rem`, `-apple-system`). |
| **Grid Container** | `src/features/products/products.css` | Changing `.grid-products` min-card width could compress cards on tablet. | Grid rule strictly enforced at `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`. |
| **Cart Context** | `src/features/cart/CartContext.tsx` | Changing `addToCart` or `updateQuantity` method signature would break stepper actions. | Preserve existing method signatures completely. |

---

## 5. Visual Baseline Screenshot References

For all future visual regression checks, compare against these captured baseline screenshots:
- **Desktop (1440×900)**: `docs/ui-audit-2026-10-21/screenshots/desktop_marketplace_1440x900.png`
- **Tablet (768×1024)**: `docs/ui-audit-2026-10-21/screenshots/tablet_marketplace_768x1024.png`
- **Large Mobile (430×932)**: `docs/ui-audit-2026-10-21/screenshots/large_mobile_marketplace_430x932.png`
- **Mobile (375×812)**: `docs/ui-audit-2026-10-21/screenshots/mobile_marketplace_375x812.png`
