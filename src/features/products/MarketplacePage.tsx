import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Award } from 'lucide-react';
import { productService } from './product.service';
import { Product, Category, ServiceArea, MarketplaceFilters } from './product.types';
import { ProductList } from './ProductList';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import './products.css';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedServiceArea, setSelectedServiceArea] = useState('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState<MarketplaceFilters['sortBy']>('newest');

  useEffect(() => {
    async function loadMeta() {
      const [cats, areas] = await Promise.all([
        productService.getCategories(),
        productService.getServiceAreas(),
      ]);
      setCategories(cats);
      setServiceAreas(areas);
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      try {
        const filters: MarketplaceFilters = {
          searchQuery,
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
          serviceAreaId: selectedServiceArea === 'all' ? undefined : selectedServiceArea,
          onlyOrganic,
          sortBy,
        };
        const list = await productService.getProducts(filters);
        setProducts(list);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchFiltered, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedServiceArea, onlyOrganic, sortBy]);

  return (
    <div className="page-container products-page">
      <div className="mb-6">
        <h1 className="heading-1">Fresh Farm Marketplace</h1>
        <p className="text-muted">
          Browse daily harvested fruits, vegetables, pulses & spices straight from Nashik & Pune farms
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card mb-6" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          <Input
            placeholder="Search crops, vegetables, farmers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="form-group">
            <select
              className="input-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.name_hi})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              className="input-field"
              value={selectedServiceArea}
              onChange={(e) => setSelectedServiceArea(e.target.value)}
            >
              <option value="all">All Service Hubs</option>
              {serviceAreas.map((sa) => (
                <option key={sa.id} value={sa.id}>
                  {sa.name} ({sa.district})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              className="input-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MarketplaceFilters['sortBy'])}
            >
              <option value="newest">Sort: Fresh Harvest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <label className="form-checkbox-label" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
            />
            <span className="flex items-center gap-1 font-semibold">
              <Award size={14} color="var(--color-primary)" /> Organic Certified Only
            </span>
          </label>

          <span className="text-caption">
            Showing <strong>{products.length}</strong> fresh harvest lots
          </span>
        </div>
      </div>

      <ProductList products={products} isLoading={loading} />
    </div>
  );
};
