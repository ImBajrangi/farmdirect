# FarmDirect — Database Schema

## 1. Schema Specifications
The production database consists of 20 normalized PostgreSQL tables located in `supabase/migrations/001_initial_schema.sql`.

| # | Table Name | Purpose | Primary Key | Key Foreign Keys |
|---|---|---|---|---|
| 1 | `profiles` | Extended user identity, role (`customer`, `farmer`, `admin`), language | `id` (UUID) | References `auth.users(id)` |
| 2 | `farmer_profiles` | Verified farm details, 7/12 land KYC, acreage, rating | `id` (UUID) | `user_id` $\to$ `profiles(id)` |
| 3 | `addresses` | Customer delivery locations | `id` (UUID) | `user_id` $\to$ `profiles(id)` |
| 4 | `categories` | Product classifications (Vegetables, Fruits, Grains, etc.) | `id` (UUID) | Unique `slug` |
| 5 | `products` | Produce catalog with price in paise, unit of sale, harvest date | `id` (UUID) | `farmer_id`, `category_id` |
| 6 | `product_images` | Gallery images per product | `id` (UUID) | `product_id` $\to$ `products(id)` |
| 7 | `inventory` | Realtime available and reserved stock quantities | `id` (UUID) | `product_id` $\to$ `products(id)` |
| 8 | `carts` | User active shopping cart session | `id` (UUID) | `user_id` $\to$ `profiles(id)` |
| 9 | `cart_items` | Products and quantities inside cart | `id` (UUID) | `cart_id`, `product_id` |
| 10 | `orders` | Partitioned farmer sub-orders with immutable address snapshots | `id` (UUID) | `customer_id`, `farmer_id` |
| 11 | `order_items` | Historical price and quantity snapshots per order | `id` (UUID) | `order_id`, `product_id` |
| 12 | `payments` | Financial gateway transactions (Razorpay / COD) | `id` (UUID) | `customer_id`, `checkout_group_id` |
| 13 | `payment_events` | Webhook idempotency audit ledger | `id` (UUID) | Unique `event_id` |
| 14 | `deliveries` | Courier / pickup status tracking | `id` (UUID) | `order_id` $\to$ `orders(id)` |
| 15 | `reviews` | Customer ratings and feedback | `id` (UUID) | `order_id`, `product_id`, `farmer_id` |
| 16 | `notifications` | Multilingual alerts and WhatsApp deep links | `id` (UUID) | `user_id` $\to$ `profiles(id)` |
| 17 | `support_tickets` | Customer and farmer resolution disputes | `id` (UUID) | `user_id`, `order_id` |
| 18 | `audit_logs` | Immutable admin action records | `id` (UUID) | `actor_id` $\to$ `profiles(id)` |
| 19 | `service_areas` | Active delivery regions, pincodes, and fee thresholds | `id` (UUID) | Unique `name` |
| 20 | `platform_settings` | Commission rates and helpline configurations | `key` (TEXT) | Global JSONB values |

## 2. Row Level Security (RLS) Policy Matrix
- **`profiles`**: Public read; update restricted to `auth.uid() = id`.
- **`farmer_profiles`**: Public read for verified farmers; updates restricted to farm owner.
- **`products`**: Public read for active moderated items; mutations restricted to verified farmer.
- **`orders` & `order_items`**: Strictly isolated. Customers can only read their orders. Farmers can only read orders assigned to their farm ID.
- **`audit_logs` & `payment_events`**: Restricted strictly to administrators via `is_admin()`.
