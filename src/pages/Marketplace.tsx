import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, Award, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { marketplaceService } from '../services/marketplaceService';
import { Product, Category, ServiceArea, MarketplaceFilters } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CategoryBar } from '../components/marketplace/CategoryBar';

export const Marketplace: React.FC = () => {
  const { t, language } = useTranslation();
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
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<MarketplaceFilters['sortBy']>('newest');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      const [catList, saList] = await Promise.all([
        marketplaceService.getCategories(),
        marketplaceService.getServiceAreas(),
      ]);
      setCategories(catList);
      setServiceAreas(saList);
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const filters: MarketplaceFilters = {
          searchQuery,
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
          serviceAreaId: selectedServiceArea === 'all' ? undefined : selectedServiceArea,
          onlyOrganic,
          inStockOnly,
          sortBy,
        };
        const list = await marketplaceService.getProducts(filters);
        setProducts(list);
      } catch (err) {
        console.error('Failed to query marketplace products', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFilteredProducts();
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedServiceArea, onlyOrganic, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedServiceArea('all');
    setOnlyOrganic(false);
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      {/* Top Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t.nav.marketplace}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Direct farmgate inventory from Nashik & Pune agricultural clusters
            </p>
          </div>

          {/* Quick Active Filters Summary or Reset */}
          {(searchQuery || selectedCategory !== 'all' || selectedServiceArea !== 'all' || onlyOrganic || inStockOnly) && (
            <button
              onClick={handleResetFilters}
              className="self-start sm:self-auto text-xs font-semibold text-agri-700 bg-agri-50 hover:bg-agri-100 border border-agri-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search Bar & Quick Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="w-full bg-white border border-earth-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 shadow-xs transition"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MarketplaceFilters['sortBy'])}
              className="flex-1 bg-white border border-earth-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 focus:border-agri-600 shadow-xs"
            >
              <option value="newest">Fresh Harvest / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Farmer Rating</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="sm:hidden p-2.5 rounded-xl border border-earth-300 bg-white text-stone-700 hover:bg-earth-50 shadow-xs"
              aria-label="Filter Options"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Horizontal Bar */}
        <CategoryBar
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Organic Only Toggle */}
          <button
            onClick={() => setOnlyOrganic(!onlyOrganic)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              onlyOrganic
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                : 'bg-white text-stone-600 border-earth-300 hover:border-emerald-600'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.common.organicCertified}</span>
            {onlyOrganic && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* In Stock Only Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              inStockOnly
                ? 'bg-agri-800 text-white border-agri-800 shadow-xs'
                : 'bg-white text-stone-600 border-earth-300 hover:border-agri-600'
            }`}
          >
            <span>{t.common.inStock}</span>
            {inStockOnly && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Service Area Filter Selector */}
          <select
            value={selectedServiceArea}
            onChange={(e) => setSelectedServiceArea(e.target.value)}
            className="bg-white border border-earth-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-700 shadow-xs"
          >
            <option value="all">All Service Corridors</option>
            {serviceAreas.map((sa) => (
              <option key={sa.id} value={sa.id}>
                {language === 'hi' && sa.name_hi ? sa.name_hi : sa.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-earth-200 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-earth-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-earth-100 text-stone-400 mx-auto flex items-center justify-center text-3xl">
            🌾
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 text-lg">{t.common.emptyTitle}</h3>
            <p className="text-xs text-stone-500">{t.common.emptySubtitle}</p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-agri-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-agri-800 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
