# 04 — Design System Forensics & Token Audit

This audit evaluates the current styling architecture of FarmDirect across CSS files, design tokens, typography, surfaces, and interactive components.

---

## 1. Design Token Architecture & Token Files

The core token architecture resides in [`src/styles/variables.css`](file:///Users/sakhi/Code/farmdirect/src/styles/variables.css), supplemented by [`typography.css`](file:///Users/sakhi/Code/farmdirect/src/styles/typography.css) and [`global.css`](file:///Users/sakhi/Code/farmdirect/src/styles/global.css).

### A. Color Palette & Semantic Tokens
```css
/* Brand Colors */
--accent: #006044;                  /* Deep Pine Forest Green */
--accent-hover: #004330;            /* Dark Forest Hover */
--brand-lime: #ECF96E;              /* High-Visibility Acid Lime Accent */
--brand-dark: #0F2E22;              /* Deep Forest Ink */

/* Surface Tokens */
--bg: #FFFFFF;                      /* Pure Canvas */
--bg-elevated: #F8FAF8;             /* Subtle Elevated Canvas */
--bg-card: #FFFFFF;                 /* Card Surface */
--border: rgba(15, 46, 34, 0.10);   /* Soft Organic Border */
--border-subtle: rgba(15, 46, 34, 0.05);

/* Feedback Signals */
--success: #15803D;                 /* Emerald Green */
--warning: #D97706;                 /* Warm Amber */
--danger: #DC2626;                  /* Field Crimson */
--info: #0284C7;                    /* Sky Blue */
```

### B. Typography Stack
```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-display: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

--fs-display: clamp(2.75rem, 5.5vw + 1rem, 5.25rem);
--fs-h2: clamp(1.75rem, 3vw + 0.5rem, 3rem);
--fs-h3: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem);
--fs-body: clamp(1rem, 0.3vw + 0.95rem, 1.125rem);
--fs-small: 0.8125rem;
```

### C. Geometry & Radius Scale
```css
--radius-xs: 4px;
--radius-sm: 12px;                  /* Small badges & inputs */
--radius-md: 20px;                  /* Standard cards */
--radius-lg: 24px;                  /* Hero panels & modals */
--radius-full: 9999px;              /* Stadium pills */
--radius-squircle: 24%;             /* Icon avatar frames */
```

### D. Layout Constraints & Breakpoints
```css
--max-width-page: 1280px;
--container-width-desktop: 1240px;
--header-height: 64px;
--bottom-nav-height: 58px;
```
- Standard Responsive Breakpoints:
  - Mobile: `< 640px`
  - Tablet: `641px - 1024px`
  - Desktop: `> 1024px`

---

## 2. Component Design System Forensics

### Buttons & Hierarchy
1. **Primary Action**: `.btn-primary` or `.product-order-btn-b`
   - Background: `var(--accent)` (`#006044`) or crop-themed accent.
   - Text: `#FFFFFF`, `font-weight: 550` to `600`.
   - Radius: Full stadium pill (`9999px`).
2. **Secondary Outlined**: `.btn-secondary` or `.btn-admin-action`
   - Background: `#FFFFFF`.
   - Border: `1px solid rgba(15, 46, 34, 0.12)`.
   - Text: `var(--brand-dark)`.
3. **Critical / Destructive**: `.btn-revoke`
   - Background: `rgba(220, 38, 38, 0.08)`.
   - Text: `#DC2626`.
   - Border: `1px solid rgba(220, 38, 38, 0.2)`.

### Form Controls & Inputs
- Height: `44px` on desktop, `48px` on mobile for comfortable touch targets.
- Background: `var(--theme-input-bg)` (`#F8FAF8`).
- Border: `1px solid var(--theme-input-border)` (`rgba(15, 46, 34, 0.12)`).
- Active Focus State: Border color switches to `#15803D` with subtle glow ring `rgba(21, 128, 61, 0.16)`.

### Image Aspect Ratio Standardization
- `21:9`: Ultrawide panoramic farm covers and land document preview strips.
- `16:9`: Platform showcases, cluster telemetry maps, and harvest photos.
- `4:3`: Produce listing previews and farm gate facilities.
- `1:1`: Square avatars, farmer producer badges, and icon frames.

---

## 3. Inconsistencies & Competing Conventions Identified

1. **Card Border Radii Divergence**:
   - `ProductCard.tsx`: Uses `border-radius: 34px` on outer shell and `26px` on inner canvas.
   - `FarmerDashboard.tsx`: Uses `border-radius: 20px`.
   - `CheckoutPage.tsx`: Uses `border-radius: 12px`.
   - *Risk*: Mixing 12px, 20px, and 34px radii creates subtle visual incoherence. Standardizing secondary cards to `20px` resolves this while leaving `ProductCard` (34px) protected.
2. **Hardcoded Color Selectors**:
   - Several files (`auth.css`, `checkout.css`) use raw `#006044` and `#15803d` instead of the canonical `var(--accent)` token.
3. **Focus Outline Suppression**:
   - `.stepper-btn-b:focus` and `.btn-admin-action:focus` use `outline: none`, which harms keyboard navigation accessibility.
