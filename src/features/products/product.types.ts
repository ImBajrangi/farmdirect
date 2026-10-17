import { Product, Category, ServiceArea, MarketplaceFilters } from '../../types';

export type { Product, Category, ServiceArea, MarketplaceFilters };

export interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}
