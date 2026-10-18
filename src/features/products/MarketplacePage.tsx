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
    titleSub: ' — Direct From Nashik & Pune',
    allProduce: 'All Harvest',
    searchPlaceholder: 'Search fresh produce: Nashik Onions, Grapes, Spinach, Wheat, Gir Cow Ghee...',
    staplesLabel: '🔥 Quick:',
    staples: [
      { name: 'Nashik Red Onions', query: 'onion' },
      { name: 'Thompson Grapes', query: 'grapes' },
      { name: 'Tender Spinach', query: 'spinach' },
      { name: 'Lokwan Wheat', query: 'wheat' },
      { name: 'Gir Cow Ghee', query: 'ghee' },
      { name: 'Vine Tomatoes', query: 'tomato' },
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
    titleSub: ' — नासिक और पुणे से ताज़ा',
    allProduce: 'सर्व शेतमाल (All)',
    searchPlaceholder: 'खोजें: नाशिक कांदा, Thompson Grapes, देशी पालक, लोकवन गहू, तूप...',
    staplesLabel: '🔥 रोजची गरज:',
    staples: [
      { name: 'नाशिक लाल कांदा', query: 'onion' },
      { name: 'Thompson Grapes', query: 'grapes' },
      { name: 'देशी कोवळा पालक', query: 'spinach' },
      { name: 'लोकवन गहू', query: 'wheat' },
      { name: 'गिर गाय बिलोना तूप', query: 'ghee' },
      { name: 'गावरान टोमॅटो', query: 'tomato' },
    ],
    categories: {
      'cat-veg': { label: 'ताजी भाजीपाला', icon: '🥬' },
      'cat-fruit': { label: 'बागेतील फळे', icon: '🍇' },
      'cat-grains': { label: 'धान्य आणि कडधान्ये', icon: '🌾' },
      'cat-pulses': { label: 'डाळी व कडधान्ये', icon: '🥣' },
      'cat-spices': { label: 'मसाले व गूळ', icon: '🌶️' },
      'cat-dairy': { label: 'बिलोना तूप व डेअरी', icon: '🥛' },
    } as Record<string, { label: string; icon: string }>,
    allHubs: 'सर्व हब्स (Nashik & Pune)',
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

  return (
    <div className="page-container products-page">
      {/* Sleek Compact Header (Zero wasted vertical space) */}
      <div className="marketplace-header-compact">
        <div className="marketplace-title-wrap">
          <h1 className="marketplace-title-compact">
            {copy.titleMain}
            <span className="marketplace-title-sub-compact">{copy.titleSub}</span>
          </h1>
        </div>
      </div>

      {/* Compact Category Pills Strip */}
      <div className="marketplace-category-strip" role="tablist" aria-label="Product Categories">
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`category-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          role="tab"
          aria-selected={selectedCategory === 'all'}
        >
          <Sparkles size={13} />
          <span>{copy.allProduce}</span>
        </button>

        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          const friendly = copy.categories[c.id];
          const label = friendly
            ? friendly.label
            : (language === 'hi' && c.name_hi ? c.name_hi : c.name);
          const icon = friendly ? friendly.icon : '🌱';

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategorySelect(c.id)}
              className={`category-pill-btn ${isSelected ? 'active' : ''}`}
              role="tab"
              aria-selected={isSelected}
            >
              <span>{icon} {label}</span>
            </button>
          );
        })}
      </div>

      {/* High-Efficiency Unified Command Card */}
      <div className="marketplace-command-card">
        {/* Controls Row: Search + Custom Dropdowns + Organic + Lots Count */}
        <div className="command-controls-row">
          {/* Integrated Search Input */}
          <div className="command-search-field">
            <Search size={15} className="command-search-icon" />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="command-search-input"
              aria-label="Search produce"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="command-search-clear"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Action Filters Group with Custom Dropdowns */}
          <div className="command-filters-group">
            {/* Custom Service Hub Dropdown */}
            <CustomDropdown
              value={selectedServiceArea}
              options={serviceAreaOptions}
              onChange={setSelectedServiceArea}
              icon={<MapPin size={13} />}
              ariaLabel="Select Hub"
            />

            {/* Custom Sort Dropdown */}
            <CustomDropdown
              value={sortBy || 'newest'}
              options={sortOptions}
              onChange={(val) => setSortBy(val as MarketplaceFilters['sortBy'])}
              icon={<ArrowUpDown size={13} />}
              ariaLabel="Sort Produce"
            />

            {/* Organic Toggle Pill */}
            <button
              type="button"
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`organic-toggle-pill ${onlyOrganic ? 'active' : ''}`}
              aria-pressed={onlyOrganic}
              title="Filter Certified Organic"
            >
              <Award size={13} />
              <span>{copy.organicOnly}</span>
              {onlyOrganic && <Check size={11} className="toggle-check" />}
            </button>

            {/* Compact Lot Badge */}
            <div className="command-lot-badge">
              <span className="lot-dot"></span>
              <span><strong>{products.length}</strong> {language === 'hi' ? 'शेतमाल' : 'lots'}</span>
            </div>
          </div>
        </div>

        {/* Compact Micro-Staples Strip (Inline & Zero Bloat) */}
        <div className="command-staples-substrip">
          <span className="staples-micro-label">{copy.staplesLabel}</span>
          <div className="staples-micro-scroll">
            {copy.staples.map((staple) => (
              <button
                key={staple.query}
                type="button"
                onClick={() => handleStapleClick(staple.query)}
                className={`staple-micro-btn ${searchQuery.toLowerCase().includes(staple.query) ? 'active' : ''}`}
              >
                {staple.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      <ProductList products={products} isLoading={loading} />
    </div>
  );
};
