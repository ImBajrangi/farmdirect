# 🌱 FarmDirect

> **Direct Farmgate-to-Fork Marketplace for India**  
> Hyperlocal, mobile-first agricultural commerce connecting verified Maharashtra farmers directly with households, restaurants, and grocery buyers.

---

## 🎯 Project Overview

FarmDirect bridges the gap between rural Indian farmers and conscious urban buyers. By eliminating predatory middlemen and commission layers:
- **Farmers** receive 85–90% of retail realization directly into their bank/UPI accounts.
- **Buyers** receive morning-harvested produce within 12–24 hours, free of unverified claims.
- **Pilot Area**: Nashik – Pune Peri-Urban Agri-Corridor (Dindori, Niphad, Haveli, Baramati).

---

## 🏗️ Architecture & Core Principles

1. **Mobile-First & Low-End Android Optimization**:
   - Hardware-accelerated GPU transforms (`gpu-scroll`), touch targets $\ge 44\text{px}$.
   - Capped DOM render buffers to maintain 60 FPS on budget 2GB/3GB RAM Android devices.
2. **Offline-Resilient / Cache Data System**:
   - TanStack Query with localStorage caching.
   - Zero-lag instant hydration even on fluctuating 2G/3G connectivity.
3. **Multi-Farmer Cart & Order Partitioning**:
   - Buyers can add items from multiple independent farmers into one cart.
   - At checkout, the database atomically generates individual sub-orders for each farmer tied by `checkout_group_id`.
   - Each farmer only receives and manages their own specific order slice, preventing data leaks across competitors.
4. **Exact Financial Integrity (Integer Paise)**:
   - All prices and monetary values calculated and stored in **integer paise** (`₹1.00 = 100 paise`).
   - Zero floating-point roundoff issues. Client prices are strictly untrusted.
5. **Bilingual (English & हिन्दी / मराठी)**:
   - Instant language switching with persisted user preference.
   - Devanagari URL sanitization preventing double-encoding redirect loops.
6. **Honest Product Claims**:
   - Strict adherence to verifiable agriculture: products are never labeled "Certified Organic" without valid NPOP / PGS lab documentation.

---

## 💾 Database Schema (20 Normalized Tables & RLS)

Located at `supabase/migrations/001_initial_schema.sql`:

1. `profiles`: User accounts with role hierarchy (`customer`, `farmer`, `admin`).
2. `farmer_profiles`: 7/12 Land records, village, district, acreage, KYC verification status.
3. `addresses`: Delivery snapshots and coordinates.
4. `categories`: Perishable flag, icons, multilingual metadata.
5. `products`: Price in paise, unit of sale (`kg`, `piece`, `dozen`, `quintal`), harvest date.
6. `product_images`: Primary and gallery images.
7. `inventory`: Available quantity, reserved quantity, low stock thresholds.
8. `carts`: Customer active carts.
9. `cart_items`: Cart items with unit step constraints.
10. `orders`: Partitioned farmer sub-orders with immutable address snapshots.
11. `order_items`: Historical price and unit snapshots.
12. `payments`: Payment gateway transaction references and audit totals.
13. `payment_events`: Webhook idempotency ledger preventing duplicate credits.
14. `deliveries`: Local delivery vs farmgate pickup tracking.
15. `reviews`: Post-delivery star ratings and buyer feedback.
16. `notifications`: In-app updates and WhatsApp click-to-open links.
17. `support_tickets`: Customer and farmer support disputes.
18. `audit_logs`: Immutable ledger of administrative and financial transitions.
19. `service_areas`: Active delivery pincodes and fee thresholds.
20. `platform_settings`: Commission percentages and helpline contacts.

All 20 tables enforce strict **PostgreSQL Row Level Security (RLS)** policies.

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v26)
- **npm**: v9+

### 2. Installation
```bash
git clone <repository-url>
cd farmdirect
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials when connecting to live Supabase:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
```
*(Note: FarmDirect includes a robust offline/reactive cache data store. If Supabase keys are not set, it operates seamlessly in local interactive demo mode!)*

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser or Android mobile emulator.

### 5. Running Tests
```bash
npm test
```
Executes all unit, integration, financial math, and order lifecycle test suites via Vitest.

### 6. Production Build Verification
```bash
npm run build
```
Generates a lean production bundle in `dist/`.

---

## 💳 Payment Gateway (Razorpay Sandbox)

FarmDirect abstracts payments to prevent vendor lock-in:
- **Sandbox Simulation**: Supports UPI (Google Pay, PhonePe, Paytm), NetBanking, and RuPay/Visa/MasterCard.
- **Cash on Delivery (COD)**: Handled with verified delivery status transition.
- **Server Verification**: In production, Supabase Edge Functions verify HMAC SHA256 webhook signatures before order status transition.

---

## 📦 Deployment Guide

### Vercel (Frontend)
1. Import repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add Environment Variables from `.env`.

### Supabase (Backend)
1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and execute `supabase/migrations/001_initial_schema.sql`.
3. Copy the Project URL and Anon API key to your `.env`.
