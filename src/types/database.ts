export type UserRole = 'customer' | 'farmer' | 'admin';
export type FarmerVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type UnitOfSale = 'kg' | 'gram' | 'piece' | 'dozen' | 'quintal' | 'crate';
export type OrderStatus = 
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'refund_pending';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay_online' | 'cod';
export type DeliveryType = 'local_delivery' | 'pickup';
export type DeliveryStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  preferred_language: 'en' | 'hi';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  name_hi: string;
  state: string;
  district: string;
  taluka?: string;
  pincodes: string[];
  is_active: boolean;
  delivery_fee_paise: number;
  free_delivery_threshold_paise: number;
  created_at: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  farm_name: string;
  farm_name_hi?: string;
  story?: string;
  story_hi?: string;
  village: string;
  taluka_or_tehsil?: string;
  taluka?: string;
  district: string;
  state: string;
  pincode: string;
  phone?: string;
  service_area_id?: string;
  verification_status: FarmerVerificationStatus;
  is_verified?: boolean;
  id_proof_type?: string;
  id_proof_url?: string;
  land_area_acres?: number;
  pickup_address?: string;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  service_area_id?: string;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_hi: string;
  description?: string;
  icon?: string;
  image_url?: string;
  sort_order: number;
  is_perishable: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  farmer_id: string;
  category_id: string;
  name: string;
  name_hi: string;
  slug: string;
  description: string;
  description_hi?: string;
  price_paise: number;
  unit: UnitOfSale;
  unit_step: number;
  min_order_quantity: number;
  max_order_quantity?: number;
  harvest_date?: string;
  shelf_life_days?: number;
  is_certified_organic: boolean;
  certification_doc_url?: string;
  is_active: boolean;
  is_moderated: boolean;
  created_at: string;
  updated_at: string;
  
  // Joins
  category?: Category;
  farmer?: FarmerProfile;
  images?: ProductImage[];
  inventory?: Inventory;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  available_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  checkout_group_id: string;
  customer_id: string;
  farmer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  delivery_type: DeliveryType;
  subtotal_paise: number;
  delivery_fee_paise: number;
  platform_fee_paise: number;
  total_amount_paise: number;
  delivery_address_snapshot: Address;
  delivery_notes?: string;
  rejection_reason?: string;
  cancellation_reason?: string;
  confirmed_at?: string;
  prepared_at?: string;
  dispatched_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  
  items?: OrderItem[];
  farmer?: FarmerProfile;
  customer?: Profile;
  delivery?: Delivery;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_name_hi?: string;
  unit: UnitOfSale;
  unit_price_paise: number;
  quantity: number;
  total_price_paise: number;
  product_snapshot?: Partial<Product>;
  created_at: string;
}

export interface Payment {
  id: string;
  checkout_group_id: string;
  customer_id: string;
  gateway: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  gateway_signature?: string;
  amount_paise: number;
  currency: string;
  status: PaymentStatus;
  refunded_amount_paise: number;
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  service_area_id?: string;
  delivery_status: DeliveryStatus;
  partner_name?: string;
  partner_contact?: string;
  tracking_notes?: string;
  delivery_slot?: string;
  delivered_at?: string;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  product_id: string;
  customer_id: string;
  farmer_id: string;
  rating: number;
  comment?: string;
  is_published: boolean;
  created_at: string;
  customer?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  title_hi?: string;
  message: string;
  message_hi?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  order_id?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  resolution_notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_name: string;
  entity_id?: string;
  old_state?: Record<string, unknown>;
  new_state?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface PlatformSettings {
  key: string;
  value: Record<string, unknown> | string | number;
  description?: string;
  updated_at: string;
}
