import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Award, MapPin, ArrowUpDown, X, Check, Sparkles } from 'lucide-react';
import { productService } from './product.service';
import { Product, Category, ServiceArea, MarketplaceFilters } from './product.types';
import { ProductList } from './ProductList';
import { CustomDropdown, DropdownOption } from '../../components/common/CustomDropdown';
import { useTranslation } from '../../hooks/useTranslation';
import './products.css';

// Localized copy: Clean English by default; dynamic Hindi on demand
const LOCALIZED_CONTENT = {
  en: {
    badge: '🌅 6:00 AM HARVEST DISPATCH',
    titleMain: 'Fresh Farm Marketplace',
    titleSub: ' — 100% Direct From Farmers',
    allProduce: 'All Harvest',
    searchPlaceholder: 'Search fresh produce: Farm Onions, Tomatoes, Grapes, Spinach, Wheat, Pure Ghee...',
    staplesLabel: '🔥 Quick:',
    staples: [
      { name: 'Red Onions', query: 'onion' },
      { name: 'Country Tomatoes', query: 'tomato' },
      { name: 'Thompson Grapes', query: 'grapes' },
      { name: 'Baby Spinach', query: 'spinach' },
      { name: 'Lokwan Wheat', query: 'wheat' },
      { name: 'Gir Cow Ghee', query: 'ghee' },
    ],
    categories: {
      'cat-veg': { label: 'Fresh Vegetables', icon: '🥬' },
      'cat-fruit': { label: 'Orchard Fruits', icon: '🍇' },
      'cat-grains': { label: 'Grains & Cereals', icon: '🌾' },
      'cat-pulses': { label: 'Pulses & Lentils', icon: '🥣' },
      'cat-spices': { label: 'Pure Spices & Jaggery', icon: '🌶️' },
      'cat-dairy': { label: 'Bilona Ghee & Dairy', icon: '🥛' },
    } as Record<string, { label: string; icon: string }>,
    allHubs: 'All Service Hubs',
    sortNewest: 'Fresh Harvest First',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    organicOnly: 'Organic Only',
  },
  hi: {
    badge: '🌅 सकाळी 6:00 AM थेट शेतातून',
    titleMain: 'सीधे खेत से आपकी रसोई तक',
    titleSub: ' — 100% किसानों से सीधा',
    allProduce: 'सर्व शेतमाल (All)',
    searchPlaceholder: 'खोजें: कांदा, गावरान टोमॅटो, द्राक्षे, कोवळा पालक, लोकवन गहू, शुद्ध तूप...',
    staplesLabel: '🔥 रोजची गरज:',
    staples: [
      { name: 'लाल कांदा', query: 'onion' },
      { name: 'गावरान टोमॅटो', query: 'tomato' },
      { name: 'थॉम्पसन द्राक्षे', query: 'grapes' },
      { name: 'कोवळा पालक', query: 'spinach' },
      { name: 'लोकवन गहू', query: 'wheat' },
      { name: 'गिर गाय तूप', query: 'ghee' },
    ],
    categories: {
      'cat-veg': { label: 'ताजी भाजीपाला', icon: '🥬' },
      'cat-fruit': { label: 'बागेतील फळे', icon: '🍇' },
      'cat-grains': { label: 'धान्य आणि कडधान्ये', icon: '🌾' },
      'cat-pulses': { label: 'डाळी व कडधान्ये', icon: '🥣' },
      'cat-spices': { label: 'मसाले व गूळ', icon: '🌶️' },
      'cat-dairy': { label: 'बिलोना तूप व डेअरी', icon: '🥛' },
    } as Record<string, { label: string; icon: string }>,
    allHubs: 'सर्व हब्स',
    sortNewest: 'आजची ताजी तोडणी',
    sortPriceAsc: 'कमी किंमत',
    sortPriceDesc: 'प्रीमियम आधी',
    organicOnly: '100% सेंद्रिय',
  },
};

export const MarketplacePage: React.FC = () => {
  const { language } = useTranslation();
  const copy = LOCALIZED_CONTENT[language === 'hi' ? 'hi' : 'en'];

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

  const loadMeta = async () => {
    const [cats, areas] = await Promise.all([
      productService.getCategories(),
      productService.getServiceAreas(),
    ]);
    setCategories(cats);
    setServiceAreas(areas);
  };

  const fetchFiltered = async () => {
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
  };

  useEffect(() => {
    loadMeta();

    // Live Database Sync Listener: re-fetch immediately on any Supabase update
    const handleDataChanged = () => {
      loadMeta();
      fetchFiltered();
    };
    window.addEventListener('farmdirect:data-changed', handleDataChanged);
    return () => window.removeEventListener('farmdirect:data-changed', handleDataChanged);
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchFiltered, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedServiceArea, onlyOrganic, sortBy]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleStapleClick = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all');
  };

  // Dropdown Options
  const serviceAreaOptions: DropdownOption[] = [
    { value: 'all', label: copy.allHubs, icon: '📍' },
    ...serviceAreas.map((sa) => ({
      value: sa.id,
      label: language === 'hi' && sa.name_hi ? sa.name_hi : sa.name,
      sublabel: sa.district,
      icon: '📍',
    })),
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'newest', label: copy.sortNewest, icon: '⚡' },
    { value: 'price_asc', label: copy.sortPriceAsc, icon: '💰' },
    { value: 'price_desc', label: copy.sortPriceDesc, icon: '💎' },
  ];

  // Synchronize searchQuery with URL params if changed externally
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  return (
    <div className="page-container products-page">
      {/* 1. Distinct Marketplace Header with Premium Value Proposition & Trust Badges */}
      <header className="marketplace-hero-strip">
        <div className="marketplace-header-row">
          <div className="marketplace-header-text">
            <div className="marketplace-eyebrow-badge">
              <span className="eyebrow-dot" />
              <span>{language === 'hi' ? 'सकाळी 6:00 AM थेट शेतातून तोडणी' : '6:00 AM MORNING HARVEST DISPATCH'}</span>
            </div>
            <h1 className="marketplace-page-title">
              {copy.titleMain}
              <span className="marketplace-page-sub">{copy.titleSub}</span>
            </h1>
            <p className="marketplace-lead-desc">
              {language === 'hi'
                ? 'बिना किसी बिचौलिए के सीधे सत्यापित किसानों से ताज़ा फ़सलें खरीदें।'
                : 'Direct harvest dispatch from verified growers in Nashik and Pune. 100% direct farmer payouts with zero middlemen markups.'}
            </p>
          </div>

          <div className="marketplace-trust-cluster">
            <div className="trust-cluster-pill">
              <Sparkles size={13} className="trust-cluster-icon" />
              <span>PGS Organic</span>
            </div>
            <div className="trust-cluster-pill">
              <Award size={13} className="trust-cluster-icon" />
              <span>100% Direct Payout</span>
            </div>
            <div className="trust-cluster-pill">
              <MapPin size={13} className="trust-cluster-icon" />
              <span>Nashik & Pune Hubs</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Distinct 2-Column Marketplace Architecture: Filter Sidebar + Catalog Grid */}
      <div className="marketplace-layout">
        {/* Left Filter Rail */}
        <aside className="marketplace-filter-rail">
          {/* Categories Filter Block */}
          <div className="filter-block">
            <div className="filter-block-header">
              <span className="filter-block-title">{language === 'hi' ? 'श्रेणियां' : 'Categories'}</span>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className="filter-reset-link"
                >
                  {language === 'hi' ? 'सभी देखें' : 'Reset'}
                </button>
              )}
            </div>

            <div className="filter-cat-stack" role="tablist">
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className={`filter-cat-item ${selectedCategory === 'all' ? 'active' : ''}`}
                role="tab"
                aria-selected={selectedCategory === 'all'}
              >
                <span className="cat-label-with-icon">
                  <span className="cat-icon">🌱</span>
                  <span>{copy.allProduce}</span>
                </span>
                <span className="cat-count-pill">{products.length}</span>
              </button>

              {categories.map((c) => {
                const isSelected = selectedCategory === c.id;
                const friendly = copy.categories[c.id];
                const label = friendly
                  ? friendly.label
                  : (language === 'hi' && c.name_hi ? c.name_hi : c.name);
                const icon = friendly ? friendly.icon : '🥬';

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategorySelect(c.id)}
                    className={`filter-cat-item ${isSelected ? 'active' : ''}`}
                    role="tab"
                    aria-selected={isSelected}
                  >
                    <span className="cat-label-with-icon">
                      <span className="cat-icon">{icon}</span>
                      <span>{label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Farming Practices Block */}
          <div className="filter-block">
            <span className="filter-block-title">{language === 'hi' ? 'प्रमाणीकरण' : 'Standards'}</span>
            <button
              type="button"
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`filter-toggle-pill ${onlyOrganic ? 'active' : ''}`}
              aria-pressed={onlyOrganic}
            >
              <div className="filter-toggle-content">
                <Sparkles size={14} className="toggle-sparkle" />
                <span>{copy.organicOnly}</span>
              </div>
              <span className={`filter-toggle-switch ${onlyOrganic ? 'on' : ''}`}>
                <span className="switch-thumb" />
              </span>
            </button>
          </div>

          {/* Delivery Hub Block */}
          <div className="filter-block">
            <span className="filter-block-title">{language === 'hi' ? 'सेवा क्षेत्र' : 'Delivery Hub'}</span>
            <CustomDropdown
              value={selectedServiceArea}
              options={serviceAreaOptions}
              onChange={setSelectedServiceArea}
              icon={<MapPin size={13} />}
              ariaLabel="Select Hub"
            />
          </div>
        </aside>

        {/* Right Catalog Main Stream */}
        <main className="marketplace-catalog-stream">
          {/* Catalog Status Bar: Result Count + Inline Quick Filter + Sort */}
          <div className="catalog-status-bar">
            <div className="catalog-lot-indicator">
              <span className="lot-pulse-dot" />
              <span>
                <strong>{products.length}</strong> {language === 'hi' ? 'ताज़ा फ़सलें उपलब्ध' : 'fresh farm lots available'}
              </span>
              {searchQuery && (
                <span className="catalog-active-filter-badge">
                  <span>"{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchParams.delete('q');
                      setSearchParams(searchParams);
                    }}
                    className="catalog-filter-clear-btn"
                    aria-label="Clear keyword filter"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>

            <div className="catalog-toolbar-actions">
              {/* In-Catalog Quick Search Filter */}
              <div className="catalog-quick-filter-pill">
                <Search size={14} className="quick-filter-icon" />
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'फ़सल खोजें...' : 'Filter in catalog...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="quick-filter-input"
                  aria-label="Filter produce in catalog"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="quick-filter-clear"
                    aria-label="Clear filter"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="catalog-sort-group">
                <CustomDropdown
                  value={sortBy || 'newest'}
                  options={sortOptions}
                  onChange={(val) => setSortBy(val as MarketplaceFilters['sortBy'])}
                  icon={<ArrowUpDown size={13} />}
                  ariaLabel="Sort Produce"
                />
              </div>
            </div>
          </div>

          {/* Produce Grid */}
          <ProductList products={products} isLoading={loading} />
        </main>
      </div>
    </div>
  );
};
