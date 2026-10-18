# FarmDirect — System Architecture

## 1. Architectural Principles
FarmDirect follows a **Feature-Based Architecture** using standard Web APIs, plain CSS with CSS variables, React, TypeScript, Vite, and Supabase.

```
src/
├── app/                  # Application root, routing, and global providers
├── components/           # Generic shared UI primitives and layout shells
│   ├── common/           # Button, Modal, Input, Loader, EmptyState
│   └── layout/           # Header, Footer, Sidebar
├── features/             # Domain feature modules (each owns types, service, UI, and CSS)
│   ├── auth/             # Authentication & user roles
│   ├── products/         # Product catalog, cards, filters, and details
│   ├── cart/             # Multi-farmer cart state and free-delivery meter
│   ├── checkout/         # Address selection, fulfillment, order lock
│   ├── orders/           # Order confirmation, live tracking, order history
│   ├── farmer/           # Farmer onboarding, production hub, stock management
│   ├── admin/            # Verification queue, product moderation, operational GMV
│   ├── payments/         # Payment gateway abstraction (Razorpay, COD)
│   └── home/             # Marketing hero, value props, category pills
├── services/             # Supabase client, logger, and notification bus
├── hooks/                # Global utility hooks (useTranslation)
├── utils/                # Currency integer paise, slug sanitizers
├── types/                # Relational database models and enums
└── styles/               # Central design tokens, resets, typography, utilities
```

## 2. Technology Stack
- **Frontend Framework**: React 19 + TypeScript + Vite.
- **Styling Architecture**: Plain CSS, CSS Variables (`src/styles/variables.css`), dedicated feature CSS files. Strict ban on Tailwind CSS, CSS-in-JS, and inline styles.
- **State & Data Caching**: TanStack Query + localStorage hybrid caching for fast 60 FPS performance on 2GB/3GB RAM Android smartphones.
- **Forms & Validation**: React Hook Form + Zod.
- **Backend & Database**: Supabase PostgreSQL 15+, Supabase Auth, Row Level Security (RLS), and database migrations.
- **Testing**: Vitest + React Testing Library.

## 3. Data Flow Pattern
```
Component / Page
  → Feature Service (e.g., product.service.ts, order.service.ts)
    → Supabase Client / Local Storage Cache Bus
      → PostgreSQL (with RLS Policies)
```
- UI components never execute direct database queries.
- Business rules and financial math are encapsulated in feature services and tested utilities.

---

## 4. Mandatory Architecture Rules

### A. No Tailwind CSS
Do not install or use Tailwind CSS.
Use React, TypeScript, Vite, Plain CSS, CSS variables, and reusable React components.
Do not use inline styles for normal UI styling, CSS-in-JS, or arbitrary styling shortcuts.
Every component must have readable, maintainable, and discoverable styling.

### B. Feature-Based Architecture
Organize code by business feature:
- Product changes belong in `src/features/products/`
- Cart changes belong in `src/features/cart/`
- Checkout changes belong in `src/features/checkout/`
- Order changes belong in `src/features/orders/`
- Farmer dashboard changes belong in `src/features/farmer/`
- Admin changes belong in `src/features/admin/`
Do not scatter one feature across unrelated folders.
Keep each feature's components, service functions, types, validation schemas, and styling together whenever practical.

### C. Single Responsibility
Each file must have one clear responsibility.
- `ProductCard.tsx`: renders a product card.
- `ProductList.tsx`: renders a list of products.
- `product.service.ts`: handles product data access.
- `product.types.ts`: defines product-related types.
- `products.css`: styles product components.
Do not create giant components containing an entire page, API logic, business rules, and styling decisions.
Avoid both giant files and unnecessary fragmentation. Create new files only when they improve discoverability or separate responsibilities.

### D. Predictable Naming
Use descriptive, consistent names:
- React components and Context Providers: PascalCase (`CartContext.tsx`, `ProductCard.tsx`).
- Functions and variables: camelCase.
- Constants: UPPER_SNAKE_CASE where appropriate.
- CSS classes: descriptive kebab-case.
- Database tables and columns: consistent snake_case.
Avoid unclear names such as data2, tempFinal, handleThing, commonHelper, or utils2.

### E. Centralized Design System
Keep global design tokens in `src/styles/variables.css`.
Keep global resets and base rules in `src/styles/global.css`.
Keep typography rules in `src/styles/typography.css`.
Keep feature-specific styles close to their feature.
Never duplicate design tokens unnecessarily. Do not create competing definitions for the same global color, spacing, or typography value.

### F. Clear Data Flow
Use a predictable flow:
Page or component → Feature hook or service → Supabase client or trusted server-side function → Database.
Do not put database queries directly inside every UI component.
Keep payment verification, authorization, pricing calculations, and privileged operations in trusted server-side code.

### G. Modification Protocol
Whenever a new feature or modification is requested:
1. Identify the relevant feature folder.
2. Search for existing components, services, types, styles, and tests.
3. Read the relevant code before changing it.
4. Identify the actual source of the behavior.
5. Make the smallest complete and correct change.
6. Reuse existing components and services where appropriate.
7. Update tests and documentation when needed.
8. Check for regressions and unintended side effects.
9. Run the relevant tests and production build.
10. Report the exact files changed and why.

### H. Architecture Documentation
Maintain these files:
- `docs/PROJECT_OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/BUSINESS_RULES.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/CHANGELOG.md`
Update documentation whenever a meaningful architectural decision or business rule changes.

### I. File Discoverability
When a feature is implemented, document:
- Its main page or entry component.
- Its service file.
- Its data types and validation schemas.
- Its CSS files.
- Its database tables.
- Its relevant tests.
Use clear exports and avoid unnecessary barrel files that make code navigation harder.

### J. Quality Requirements
- No unexplained any types.
- No duplicated business logic.
- No unnecessary abstractions.
- No unused dependencies.
- No dead code.
- No undocumented environment variables.
- No hard-coded secrets.
- No silent error swallowing.
- Preserve existing conventions unless there is a clear reason to change them.
- Prioritize readability and ease of modification over clever abstractions or reducing the number of lines of code.

### K. Integer Currency Enforcement
- Store and calculate all monetary values as integer paise wherever applicable.
- Use `₹1 = 100 paise`.
- Never use floating-point arithmetic for financial calculations.
- Convert paise to formatted rupees only at the UI boundary via `src/utils/currency.ts` (`formatPaise`).
- Validate prices, discounts, delivery charges, taxes, refunds, and totals on the trusted server.
- Add tests for rounding, discounts, quantity multiplication, and boundary values.
- Clearly document any external payment gateway fields that use rupees instead of paise.

### L. Strict Feature CSS Colocation
- Keep business-feature styles inside the relevant feature folder.
- Examples: `src/features/products/products.css` and `src/features/checkout/checkout.css`.
- Reserve `src/styles/` for global tokens, resets, typography, and genuinely shared utilities.
- Do not add feature-specific rules to global CSS.
- Reuse existing design tokens instead of introducing duplicate colors, spacing, or radii.
- Avoid `!important` unless a documented technical constraint makes it necessary.

### M. State Management Discipline
- Use React Context for shared client state when appropriate (`AuthContext`, `CartContext`).
- Use TanStack Query for server-state fetching, caching, invalidation, and synchronization.
- Do not add Redux, Zustand, or another state library unless a documented requirement cannot be handled cleanly with the existing architecture.
- Avoid duplicating server data in React Context or maintaining competing sources of truth.
- Define clear ownership for authentication, cart state, product data, and order data.

### N. Live Backend and Fixture Fallback
- Prefer live Supabase reads when valid public client credentials are configured.
- Use local fixtures only according to an explicit fallback policy.
- Distinguish empty query results, permission errors, network failures, and missing configuration.
- Never silently present stale fixture data as confirmed live data.
- Display appropriate loading, empty, offline, and error states.
- Keep cached data timestamps and invalidate or refresh stale records predictably.

### O. Supabase Security Boundary
- Never expose the Supabase service-role key or other privileged secrets through Vite environment variables prefixed with `VITE_`.
- Use the publishable key or legacy anon key for browser clients, protected by correctly configured RLS policies.
- Perform privileged operations in trusted server-side functions.
- Validate authorization, prices, inventory, and payment status server-side.
- Never rely on frontend role checks as the sole authorization mechanism.
- Never log credentials, access tokens, or sensitive customer information.

### P. Performance and Mobile Budgets
- Measure performance using production builds and representative low-end Android devices.
- Configure code splitting for major routes and heavy features.
- Prefer static imports and tree-shakeable icon imports.
- Define and enforce a documented JavaScript bundle budget, distinguishing initial-load JavaScript from total assets.
- Use profiling to identify unnecessary renders before adding memoization.
- Test slow networks, offline recovery, cache expiration, and repeated navigation.
- Treat performance targets as verified only after measurement.

### Q. Mobbin Design Language Enforcement
- **Monochrome Gallery Canvas**: Maintain a pure white canvas (`#ffffff`) with near-black ink (`#141414`) typography and UI chrome. Saturated color belongs strictly to produce photography and farmer imagery.
- **Stadium-Pill Controls**: Every interactive element (buttons, floating nav, segmented controls, filter badges) must use stadium-pill geometry (`border-radius: 9999px`). Rectangular buttons are prohibited.
- **Shadow-Free Elevation**: Prohibit blurry drop shadows (`box-shadow: none`). Structure and elevation must be achieved strictly through the neutral tint ladder (`#ffffff` canvas, `#f3f3f3` canvas-soft, `#f0f0f0` field) and 1px hairlines (`#f0f0f0` soft, `#e0e0e0` control).
- **Geometric Primitives**: Use `24px` (`border-radius: 24px`) for card and modal surfaces, `16px` (`border-radius: 16px`) for inputs and media tiles, and iOS-style `30%` squircles (`border-radius: 30%`) for category icons and badges.
- **Commercial Accent Scarcity**: Reserve electric blue (`#0066ff`) strictly for commercial signals (direct harvest savings, featured badges). Never use it for standard CTAs or decorative flourishes.
- **Variable Weight Typographic Voice**: Headings must use 650/652 weight with tight 1.0–1.15 line-height and end with terminal periods. Subtitles must use an airy 300 light weight. Running body copy must use 450 weight.
- **Polarity Inversion Footer**: Every page must conclude with the full-bleed near-black (`#141414`) footer featuring `24px` rounded top corners.

## R. Dayos-Inspired Design Language Enforcement

- **Dark Cinematic Surfaces**: Deep background canvas (`#0A0B0F`), elevated surface (`#12141A`), and card surface (`#171A22`) with `1px rgba(255,255,255,0.10)` hairlines.
- **Single Electric Accent**: Cobalt accent (`#5B8CFF`) is reserved for primary CTAs, active tab indicators, and focus rings.
- **Show, Don't Tell**: Complex features must include interactive demo players with play/pause and speed toggles (1.5×).
- **Narrative Triptychs**: Key value propositions must follow the 3-column period-terminated pattern (e.g. `DIRECT.`, `FAIR.`, `FRESH.`).
- **1:1 Square Category Cards**: Department/category showcase cards must enforce square 1:1 aspect ratio (`aspect-ratio: 1 / 1;`).
- **Infinite Logo Marquee**: Partner networks must render via smooth CSS marquee with pause-on-hover and reduced-motion fallbacks.
- **Outcome-First Typography**: Display headlines must be bold and concise; H2 section titles must be uppercase; secondary links must use the `→` arrow glyph.

