-- FarmDirect Master Database Schema Migration
-- 20 Normalized Tables, Custom Enums, Strict Row Level Security (RLS), Atomic Checkout RPC & Seed Data

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & TYPES
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'farmer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE farmer_verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unit_of_sale AS ENUM ('kg', 'gram', 'piece', 'dozen', 'quintal', 'crate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending_confirmation',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'delivered',
        'completed',
        'rejected',
        'cancelled',
        'refund_pending'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('razorpay_online', 'cod');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_type AS ENUM ('local_delivery', 'pickup');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status AS ENUM ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. CORE MARKETPLACE & USER TABLES
-- ============================================================================

-- Table 1: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    preferred_language TEXT NOT NULL DEFAULT 'en', -- 'en' or 'hi'
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 19: service_areas (Created early for foreign keys)
CREATE TABLE IF NOT EXISTS public.service_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_hi TEXT,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL,
    pincodes TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    delivery_fee_paise BIGINT NOT NULL DEFAULT 4000, -- ₹40.00
    free_delivery_threshold_paise BIGINT NOT NULL DEFAULT 50000, -- ₹500.00
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: farmer_profiles
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    farm_name_hi TEXT,
    story TEXT,
    story_hi TEXT,
    village TEXT NOT NULL,
    taluka_or_tehsil TEXT,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    pincode TEXT NOT NULL,
    service_area_id UUID REFERENCES public.service_areas(id),
    verification_status farmer_verification_status NOT NULL DEFAULT 'pending',
    id_proof_type TEXT, -- 'aadhaar', 'kisan_credit_card', 'land_7_12'
    id_proof_url TEXT,
    land_area_acres NUMERIC(6, 2),
    pickup_address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    total_reviews INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 3: addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home', -- 'Home', 'Work', 'Restaurant'
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    pincode TEXT NOT NULL,
    service_area_id UUID REFERENCES public.service_areas(id),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4: categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_perishable BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id),
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    description_hi TEXT,
    price_paise BIGINT NOT NULL CHECK (price_paise > 0),
    unit unit_of_sale NOT NULL DEFAULT 'kg',
    unit_step NUMERIC(6, 2) NOT NULL DEFAULT 1.0, -- increment e.g. 0.5kg or 1kg
    min_order_quantity NUMERIC(6, 2) NOT NULL DEFAULT 1.0 CHECK (min_order_quantity > 0),
    max_order_quantity NUMERIC(6, 2),
    harvest_date DATE,
    shelf_life_days INT,
    is_certified_organic BOOLEAN NOT NULL DEFAULT false, -- Strictly verified only
    certification_doc_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_moderated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 6: product_images
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 7: inventory
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
    available_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    reserved_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold NUMERIC(10, 2) NOT NULL DEFAULT 5.0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 8: carts
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 9: cart_items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity NUMERIC(6, 2) NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (cart_id, product_id)
);

-- ============================================================================
-- 3. ORDERS, CHECKOUT & PAYMENTS
-- ============================================================================

-- Table 10: orders (Partitioned per farmer sub-order, tied by checkout_group_id)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    checkout_group_id UUID NOT NULL, -- Ties multi-farmer cart items to one customer checkout session
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    farmer_id UUID NOT NULL REFERENCES public.farmer_profiles(id),
    status order_status NOT NULL DEFAULT 'pending_confirmation',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL DEFAULT 'cod',
    delivery_type delivery_type NOT NULL DEFAULT 'local_delivery',
    
    -- Financials in exact integer paise
    subtotal_paise BIGINT NOT NULL CHECK (subtotal_paise >= 0),
    delivery_fee_paise BIGINT NOT NULL DEFAULT 0 CHECK (delivery_fee_paise >= 0),
    platform_fee_paise BIGINT NOT NULL DEFAULT 0 CHECK (platform_fee_paise >= 0),
    total_amount_paise BIGINT NOT NULL CHECK (total_amount_paise >= 0),
    
    -- Address Snapshot at time of order
    delivery_address_snapshot JSONB NOT NULL,
    delivery_notes TEXT,
    rejection_reason TEXT,
    cancellation_reason TEXT,
    
    confirmed_at TIMESTAMPTZ,
    prepared_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 11: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_name_hi TEXT,
    unit unit_of_sale NOT NULL,
    unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise >= 0),
    quantity NUMERIC(6, 2) NOT NULL CHECK (quantity > 0),
    total_price_paise BIGINT NOT NULL CHECK (total_price_paise >= 0),
    product_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 12: payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checkout_group_id UUID NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status payment_status NOT NULL DEFAULT 'pending',
    refunded_amount_paise BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 13: payment_events (Webhook idempotency & audit ledger)
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_processed BOOLEAN NOT NULL DEFAULT true
);

-- Table 14: deliveries
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    service_area_id UUID REFERENCES public.service_areas(id),
    delivery_status delivery_status NOT NULL DEFAULT 'pending',
    partner_name TEXT,
    partner_contact TEXT,
    tracking_notes TEXT,
    delivery_slot TEXT,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 15: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (order_id, product_id)
);

-- Table 16: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_hi TEXT,
    message TEXT NOT NULL,
    message_hi TEXT,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 17: support_tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 18: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id UUID,
    old_state JSONB,
    new_state JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 20: platform_settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all 20 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles can be viewed by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Verified farmer profiles are public" ON public.farmer_profiles FOR SELECT 
    USING (verification_status = 'verified' OR user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Farmers can insert own profile" ON public.farmer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Farmers can update own profile" ON public.farmer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins full access farmer_profiles" ON public.farmer_profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view all addresses" ON public.addresses FOR SELECT USING (public.is_admin());

CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Active products viewable by all" ON public.products FOR SELECT 
    USING (is_active = true AND is_moderated = true OR EXISTS (
        SELECT 1 FROM public.farmer_profiles fp WHERE fp.id = products.farmer_id AND fp.user_id = auth.uid()
    ) OR public.is_admin());
CREATE POLICY "Verified farmers manage own products" ON public.products FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.farmer_profiles fp WHERE fp.id = farmer_id AND fp.user_id = auth.uid() AND fp.verification_status = 'verified'));
CREATE POLICY "Farmers update own products" ON public.products FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.farmer_profiles fp WHERE fp.id = products.farmer_id AND fp.user_id = auth.uid()));
CREATE POLICY "Farmers delete own products" ON public.products FOR DELETE 
    USING (EXISTS (SELECT 1 FROM public.farmer_profiles fp WHERE fp.id = products.farmer_id AND fp.user_id = auth.uid()));
CREATE POLICY "Admins manage all products" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "Product images viewable by all" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Farmers manage own product images" ON public.product_images FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.products p 
        JOIN public.farmer_profiles fp ON fp.id = p.farmer_id 
        WHERE p.id = product_images.product_id AND fp.user_id = auth.uid()
    ));

CREATE POLICY "Inventory viewable by all" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Farmers manage own inventory" ON public.inventory FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.products p 
        JOIN public.farmer_profiles fp ON fp.id = p.farmer_id 
        WHERE p.id = inventory.product_id AND fp.user_id = auth.uid()
    ));

CREATE POLICY "Users manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart items" ON public.cart_items FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()));

CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Farmers view assigned orders" ON public.orders FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.farmer_profiles fp WHERE fp.id = orders.farmer_id AND fp.user_id = auth.uid()));
CREATE POLICY "Farmers update status of assigned orders" ON public.orders FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.farmer_profiles fp WHERE fp.id = orders.farmer_id AND fp.user_id = auth.uid()));
CREATE POLICY "Admins manage all orders" ON public.orders FOR ALL USING (public.is_admin());

CREATE POLICY "Customers view own order items" ON public.order_items FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()));
CREATE POLICY "Farmers view own sub-order items" ON public.order_items FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.orders o 
        JOIN public.farmer_profiles fp ON fp.id = o.farmer_id 
        WHERE o.id = order_items.order_id AND fp.user_id = auth.uid()
    ));
CREATE POLICY "Admins view all order items" ON public.order_items FOR ALL USING (public.is_admin());

CREATE POLICY "Customers view own payments" ON public.payments FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (public.is_admin());
CREATE POLICY "Admins view payment events" ON public.payment_events FOR ALL USING (public.is_admin());

CREATE POLICY "Customers view own deliveries" ON public.deliveries FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = deliveries.order_id AND o.customer_id = auth.uid()));
CREATE POLICY "Farmers view own deliveries" ON public.deliveries FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.orders o JOIN public.farmer_profiles fp ON fp.id = o.farmer_id WHERE o.id = deliveries.order_id AND fp.user_id = auth.uid()));
CREATE POLICY "Admins manage deliveries" ON public.deliveries FOR ALL USING (public.is_admin());

CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Customers create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Users view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own support tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all support tickets" ON public.support_tickets FOR ALL USING (public.is_admin());
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());

CREATE POLICY "Service areas are public" ON public.service_areas FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage service areas" ON public.service_areas FOR ALL USING (public.is_admin());

CREATE POLICY "Platform settings viewable by all" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage platform settings" ON public.platform_settings FOR ALL USING (public.is_admin());

-- ============================================================================
-- 5. ATOMIC CHECKOUT STORED PROCEDURE (RPC)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.process_checkout(
    p_customer_id UUID,
    p_address_id UUID,
    p_delivery_type delivery_type,
    p_payment_method payment_method,
    p_delivery_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_checkout_group_id UUID := uuid_generate_v4();
    v_address RECORD;
    v_cart_record RECORD;
    v_farmer_record RECORD;
    v_order_number TEXT;
    v_new_order_id UUID;
    v_subtotal BIGINT;
    v_delivery_fee BIGINT;
    v_total_amount BIGINT;
    v_created_orders JSONB := '[]'::JSONB;
BEGIN
    SELECT * INTO v_address FROM public.addresses WHERE id = p_address_id AND user_id = p_customer_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Delivery address not found or not owned by user';
    END IF;

    SELECT * INTO v_cart_record FROM public.carts WHERE user_id = p_customer_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cart not found';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.cart_items WHERE cart_id = v_cart_record.id) THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    FOR v_farmer_record IN
        SELECT DISTINCT p.farmer_id
        FROM public.cart_items ci
        JOIN public.products p ON p.id = ci.product_id
        WHERE ci.cart_id = v_cart_record.id
    LOOP
        SELECT COALESCE(SUM(p.price_paise * ci.quantity), 0)
        INTO v_subtotal
        FROM public.cart_items ci
        JOIN public.products p ON p.id = ci.product_id
        WHERE ci.cart_id = v_cart_record.id AND p.farmer_id = v_farmer_record.farmer_id;

        IF p_delivery_type = 'pickup' OR v_subtotal >= 50000 THEN
            v_delivery_fee := 0;
        ELSE
            v_delivery_fee := 4000;
        END IF;

        v_total_amount := v_subtotal + v_delivery_fee;
        v_order_number := 'FD-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

        INSERT INTO public.orders (
            order_number,
            checkout_group_id,
            customer_id,
            farmer_id,
            status,
            payment_status,
            payment_method,
            delivery_type,
            subtotal_paise,
            delivery_fee_paise,
            total_amount_paise,
            delivery_address_snapshot,
            delivery_notes
        ) VALUES (
            v_order_number,
            v_checkout_group_id,
            p_customer_id,
            v_farmer_record.farmer_id,
            'pending_confirmation',
            'pending'::payment_status,
            p_payment_method,
            p_delivery_type,
            v_subtotal,
            v_delivery_fee,
            v_total_amount,
            ROW_TO_JSON(v_address)::JSONB,
            p_delivery_notes
        ) RETURNING id INTO v_new_order_id;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            product_name_hi,
            unit,
            unit_price_paise,
            quantity,
            total_price_paise
        )
        SELECT 
            v_new_order_id,
            p.id,
            p.name,
            p.name_hi,
            p.unit,
            p.price_paise,
            ci.quantity,
            (p.price_paise * ci.quantity)::BIGINT
        FROM public.cart_items ci
        JOIN public.products p ON p.id = ci.product_id
        WHERE ci.cart_id = v_cart_record.id AND p.farmer_id = v_farmer_record.farmer_id;

        UPDATE public.inventory i
        SET available_quantity = i.available_quantity - ci.quantity,
            updated_at = NOW()
        FROM public.cart_items ci
        JOIN public.products p ON p.id = ci.product_id
        WHERE i.product_id = p.id 
          AND ci.cart_id = v_cart_record.id 
          AND p.farmer_id = v_farmer_record.farmer_id;

        INSERT INTO public.deliveries (order_id, delivery_status)
        VALUES (v_new_order_id, 'pending');

        v_created_orders := v_created_orders || JSONB_BUILD_OBJECT('order_id', v_new_order_id, 'order_number', v_order_number, 'farmer_id', v_farmer_record.farmer_id, 'amount_paise', v_total_amount);
    END LOOP;

    DELETE FROM public.cart_items WHERE cart_id = v_cart_record.id;

    RETURN JSONB_BUILD_OBJECT(
        'success', true,
        'checkout_group_id', v_checkout_group_id,
        'orders', v_created_orders
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. INITIAL SEED DATA
-- ============================================================================

INSERT INTO public.service_areas (name, name_hi, district, pincodes, delivery_fee_paise, free_delivery_threshold_paise)
VALUES 
    ('Nashik Agri Belt (Dindori - Niphad)', 'नाशिक कृषी पट्टा (दिंडोरी - निफाड)', 'Nashik', ARRAY['422001', '422002', '422003', '422201', '422303'], 4000, 50000),
    ('Pune Western Fringe (Haveli - Baramati)', 'पुणे पश्चिम पट्टा (हवेली - बारामती)', 'Pune', ARRAY['411001', '411004', '411038', '411057', '412206'], 4500, 50000)
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (slug, name, name_hi, description, icon, is_perishable, sort_order)
VALUES 
    ('vegetables', 'Fresh Vegetables', 'ताजी भाज्या', 'Locally harvested crisp seasonal vegetables direct from farm gate', 'Carrot', true, 1),
    ('fruits', 'Orchard Fruits', 'बागेतील फळे', 'Sweet and ripe farm-picked fruits', 'Apple', true, 2),
    ('grains', 'Grains & Cereals', 'धान्य आणि तृणधान्ये', 'Traditional stone-harvested wheat, rice, millets', 'Wheat', false, 3),
    ('pulses', 'Pulses & Lentils', 'डाळी आणि कडधान्ये', 'Unpolished, naturally grown protein-rich pulses', 'Bean', false, 4),
    ('spices', 'Pure Spices', 'शुद्ध मसाले', 'Sun-dried natural farm-origin spices with high aroma', 'Flame', false, 5),
    ('dairy', 'Farm Fresh Dairy', 'डेअरी उत्पादने', 'Pure A2 milk, bilona ghee, and country butter', 'Milk', true, 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('platform_commission_pct', '2.5'::JSONB, 'Platform facilitation fee percentage'),
    ('min_order_threshold_paise', '10000'::JSONB, 'Minimum order amount in paise (₹100)'),
    ('service_helpline', '{"phone": "+91 98230 00000", "whatsapp": "+91 98230 00000", "hours": "7 AM - 8 PM"}'::JSONB, 'Support contact information')
ON CONFLICT (key) DO NOTHING;
