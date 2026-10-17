import React from 'react';
import { Product } from './product.types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import './products.css';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid-products">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card" style={{ height: 260, backgroundColor: 'var(--color-surface-subtle)' }} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No Farm Produce Found"
        description="Try adjusting your filter options or search keywords."
      />
    );
  }

  return (
    <div className="grid-products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
