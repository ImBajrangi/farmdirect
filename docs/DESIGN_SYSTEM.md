# FarmDirect — Design System

## 1. Principles
- **No Tailwind CSS / No CSS-in-JS**: Built using plain CSS, CSS variables, and modular component stylesheets.
- **Mobile-First Ergonomics**: Minimum touch targets of $44\times44\text{px}$ (`min-height: 44px; min-width: 44px`).
- **Low-Tier Device Compositor Safety**:
  - GPU-accelerated scroll containers (`transform: translateZ(0)`).
  - Minimal layout thrashing and zero unnecessary re-renders.

## 2. Central CSS Tokens (`src/styles/variables.css`)
```css
:root {
  /* Agri Palette */
  --color-primary: #15803d;
  --color-primary-hover: #166534;
  --color-primary-light: #f0fdf4;
  --color-primary-dark: #14532d;

  /* Saffron Accent */
  --color-accent: #ea580c;
  --color-accent-hover: #c2410c;
  --color-accent-light: #fff7ed;

  /* Earth Neutrals */
  --color-background: #fbfbf9;
  --color-surface: #ffffff;
  --color-surface-subtle: #f6f5f0;
  --color-border: #e7e5e4;
  --color-border-subtle: #f0ede6;

  /* Text Hierarchy */
  --color-text-main: #1c1917;
  --color-text-muted: #57534e;
  --color-text-light: #a8a29e;

  /* Semantic Feedback */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  /* Geometry */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(20, 83, 45, 0.08);
  --shadow-lg: 0 10px 25px rgba(20, 83, 45, 0.12);

  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
}
```

## 3. Class Naming Convention
- Every CSS class must be descriptive kebab-case (`.product-card`, `.farmer-dashboard`, `.checkout-form`, `.btn-primary`).
- Never use inline styling for standard UI elements.
