export * from './database';

export interface CartGroup {
  farmer: import('./database').FarmerProfile;
  items: {
    product: import('./database').Product;
    quantity: number;
    subtotal_paise: number;
  }[];
  subtotal_paise: number;
  delivery_fee_paise: number;
  total_paise: number;
}

export interface MarketplaceFilters {
  searchQuery?: string;
  categoryId?: string;
  serviceAreaId?: string;
  minPricePaise?: number;
  maxPricePaise?: number;
  onlyOrganic?: boolean;
  inStockOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface CheckoutPayload {
  addressId: string;
  deliveryType: 'local_delivery' | 'pickup';
  paymentMethod: 'razorpay_online' | 'cod';
  deliveryNotes?: string;
}
