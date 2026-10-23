import React from 'react';
import { Product } from './product.types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useTranslation } from '../../hooks/useTranslation';
import './products.css';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  activeCategory?: string;
}

export function isVegetableProduct(product: Product): boolean {
  if (product.category_id === 'cat-veg' || product.category_id === '8c123559-8f88-41f2-889e-462b2c8774cb') return true;
  const catSlug = product.category?.slug?.toLowerCase() || '';
  const catName = product.category?.name?.toLowerCase() || '';
  if (catSlug.includes('veg') || catName.includes('veg') || catName.includes('भाजी')) return true;

  const name = (product.name + ' ' + (product.slug || '')).toLowerCase();
  const vegKeywords = [
    'onion', 'kanda', 'spinach', 'palak', 'tomato', 'tamatar', 'potato', 'batata',
    'chilli', 'mirchi', 'garlic', 'lasun', 'ginger', 'adrak', 'coriander', 'kothimbir',
    'methi', 'fenugreek', 'bell pepper', 'capsicum', 'simla', 'cabbage', 'gobi',
    'cauliflower', 'carrot', 'gajar', 'radish', 'mula', 'cucumber', 'kakdi',
    'brinjal', 'eggplant', 'vangi', 'baingan', 'okra', 'bhendi', 'ladyfinger',
    'peas', 'matar', 'beans', 'gourd', 'lauki', 'dudhi', 'karela', 'pumpkin',
    'beetroot', 'mushroom', 'lettuce', 'broccoli', 'zucchini'
  ];
  return vegKeywords.some((k) => name.includes(k));
}

export function isFruitProduct(product: Product): boolean {
  if (product.category_id === 'cat-fruit' || product.category_id === '350d3d9d-b0a2-467a-ad08-8bd67dde51ee') return true;
  const catSlug = product.category?.slug?.toLowerCase() || '';
  const catName = product.category?.name?.toLowerCase() || '';
  if (catSlug.includes('fruit') || catName.includes('fruit') || catName.includes('फळ')) return true;

  const name = (product.name + ' ' + (product.slug || '')).toLowerCase();
  const fruitKeywords = [
    'grape', 'draksh', 'apple', 'seb', 'banana', 'kela', 'mango', 'aam', 'kesar', 'alphonso',
    'orange', 'santre', 'mosambi', 'citrus', 'pomegranate', 'anar', 'dalimb', 'strawberry',
    'papaya', 'papita', 'guava', 'peru', 'amrood', 'watermelon', 'tarbuj', 'kalingad',
    'muskmelon', 'melon', 'kharbuj', 'pineapple', 'ananas', 'chikoo', 'sapota',
    'fig', 'anjeer', 'custard apple', 'sitaphal', 'kiwi', 'pear', 'nashpati',
    'plum', 'peach', 'cherry', 'basket', 'berry'
  ];
  return fruitKeywords.some((k) => name.includes(k));
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading = false,
}) => {
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
