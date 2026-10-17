# FarmDirect — System Architecture

## 1. Architectural Principles
FarmDirect follows a **Feature-Based Architecture** using standard Web APIs, vanilla CSS with CSS variables, React, TypeScript, Vite, and Supabase.

```
src/
├── app/                  # Application root, routing, and global providers
├── components/           # Generic shared UI primitives and layout shells
│   ├── common/           # Button, Modal, Input, Loader, EmptyState
│   └── layout/           # Header, Footer, BottomNav
├── features/             # Domain feature modules (each owns types, service, UI, and CSS)
│   ├── auth/             # Authentication & user roles
│   ├── products/         # Product catalog, cards, filters, and details
│   ├── cart/             # Multi-farmer cart state and free-delivery meter
│   ├── checkout/         # Address selection, fulfillment, order lock
│   ├── orders/           # Order confirmation, live tracking, order history
│   ├── farmer/           # Farmer onboarding, production hub, stock management
│   ├── admin/            # Verification queue, product moderation, operational GMV
│   └── payments/         # Payment gateway abstraction (Razorpay, COD)
├── services/             # Supabase client, logger, and notification bus
├── hooks/                # Global utility hooks (useTranslation)
├── utils/                # Currency integer paise, slug sanitizers
├── types/                # Relational database models and enums
└── styles/               # Central design tokens, resets, typography, utilities
```

## 2. Technology Stack
- **Frontend Framework**: React 19 + TypeScript + Vite.
- **Styling Architecture**: Plain CSS, CSS Variables (`styles/variables.css`), dedicated component/feature CSS files. Strict ban on Tailwind, CSS-in-JS, and inline styles.
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
