import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Tractor,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Leaf,
  PackageCheck,
  Truck,
  Languages,
  RefreshCw,
  Award,
  Check,
  X,
  Zap,
  MapPin,
  HelpCircle,
  Percent,
  Home,
  Store,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { useTranslation } from '../../hooks/useTranslation';
import { productService } from '../products/product.service';
import { farmerService } from '../farmer/farmer.service';
import { adminService } from '../admin/admin.service';
import { marketplaceService, BackendStatus } from '../../services/marketplaceService';
import { Product, Category, Order, FarmerProfile, UnitOfSale, ServiceArea, MarketplaceFilters } from '../../types';
import { CustomDropdown, DropdownOption } from '../../components/common/CustomDropdown';
import { formatPaise } from '../../utils/currency';
import './platform.css';
import '../products/products.css';

function getCategoryEmoji(iconOrSlug?: string): string {
  if (!iconOrSlug) return '🌱';
  const val = iconOrSlug.toLowerCase();
  if (val.includes('veg') || val.includes('carrot')) return '🥬';
  if (val.includes('fruit') || val.includes('apple')) return '🍇';
  if (val.includes('grain') || val.includes('wheat') || val.includes('cereal')) return '🌾';
  if (val.includes('pulse') || val.includes('bean') || val.includes('lentil')) return '🥣';
  if (val.includes('spice') || val.includes('flame')) return '🌶️';
  if (val.includes('dairy') || val.includes('milk')) return '🥛';
  if (/\p{Extended_Pictographic}/u.test(iconOrSlug)) return iconOrSlug;
  return '🌱';
}

function formatShortUnit(unit?: string): string {
  if (!unit) return 'kg';
  const u = unit.toLowerCase();
  if (u === 'piece' || u === 'pieces') return 'pc';
  if (u === 'dozen') return 'dz';
  if (u === 'gram' || u === 'grams') return 'g';
  if (u === 'quintal') return 'qtl';
  if (u === 'liter' || u === 'liters') return 'L';
  if (u === 'packet' || u === 'packets') return 'pkt';
  return unit;
}

function getUnitLabel(unit: UnitOfSale, lang: 'hi' | 'en'): string {
  if (lang === 'hi') {
    switch (unit) {
      case 'kg': return 'किग्रा';
      case 'gram': return 'ग्राम';
      case 'piece': return 'नग / बोतल / L';
      case 'dozen': return 'दर्जन';
      case 'crate': return 'क्रेट';
      case 'quintal': return 'क्विंटल';
      default: return unit;
    }
  }
  switch (unit) {
    case 'kg': return 'kg';
    case 'gram': return 'gram';
    case 'piece': return 'unit / L';
    case 'dozen': return 'dozen';
    case 'crate': return 'crate';
    case 'quintal': return 'quintal';
    default: return unit;
  }
}

interface QuickPreset {
  id: string;
  name: string;
  catId: string;
  price: string;
  stock: string;
  unit: UnitOfSale;
  badgeHi: string;
  badgeEn: string;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'tomato',
    name: 'देशी लाल टमाटर',
    catId: 'cat-veg',
    price: '32',
    stock: '60',
    unit: 'kg',
    badgeHi: '🍅 देशी टमाटर (₹32/kg · 60kg)',
    badgeEn: '🍅 Desi Tomatoes (₹32/kg · 60kg)',
  },
  {
    id: 'onion',
    name: 'नाशिक लाल कांदा',
    catId: 'cat-veg',
    price: '26',
    stock: '120',
    unit: 'kg',
    badgeHi: '🧅 नाशिक लाल कांदा (₹26/kg · 120kg)',
    badgeEn: '🧅 Nashik Red Onions (₹26/kg · 120kg)',
  },
  {
    id: 'grapes',
    name: 'दिंडोरी एक्सपोर्ट अंगूर',
    catId: 'cat-fruit',
    price: '68',
    stock: '40',
    unit: 'kg',
    badgeHi: '🍇 दिंडोरी अंगूर (₹68/kg · 40kg)',
    badgeEn: '🍇 Dindori Grapes (₹68/kg · 40kg)',
  },
  {
    id: 'milk',
    name: 'गीर गाय A2 कच्चा दूध',
    catId: 'cat-dairy',
    price: '65',
    stock: '30',
    unit: 'piece',
    badgeHi: '🥛 शुद्ध A2 दूध (₹65/L · 30L)',
    badgeEn: '🥛 Pure Gir A2 Milk (₹65/L · 30L)',
  },
];

export const FarmDirectPlatform: React.FC = () => {
  const { currentRole, switchRole, farmerProfile } = useAuth();
  const { itemCount, grandTotalPaise, addToCart, updateQuantity, getItemQuantity } = useCart();
  const { language, setLanguage } = useTranslation();
  const navigate = useNavigate();

  // Persona State: 'customer' | 'farmer' | 'admin'
  const [selectedPersona, setSelectedPersona] = useState<'customer' | 'farmer' | 'admin'>(currentRole);

  // Core Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farmerOrders, setFarmerOrders] = useState<Order[]>([]);
  const [farmerProducts, setFarmerProducts] = useState<Product[]>([]);
  const [adminFarmers, setAdminFarmers] = useState<FarmerProfile[]>([]);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(() => marketplaceService.getBackendStatus());
  const [loading, setLoading] = useState(true);

  // Buyer Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedServiceArea, setSelectedServiceArea] = useState('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState<MarketplaceFilters['sortBy']>('newest');
  const [harvestTodayOnly, setHarvestTodayOnly] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);

  // Farmer Quick-List Fields
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('cat-veg');
  const [quickPriceRupees, setQuickPriceRupees] = useState('32');
  const [quickStock, setQuickStock] = useState('50');
  const [quickUnit, setQuickUnit] = useState<UnitOfSale>('kg');
  const [quickSuccess, setQuickSuccess] = useState(false);

  // Synchronize persona with auth context
  const handlePersonaSelect = (persona: 'customer' | 'farmer' | 'admin') => {
    setSelectedPersona(persona);
    switchRole(persona);
  };

  // Reload master datasets
  const refreshData = async () => {
    setLoading(true);
    try {
      const [prods, cats, adminData, areas] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
        adminService.getDashboardData(),
        productService.getServiceAreas(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setAdminFarmers(adminData.farmers);
      setServiceAreas(areas || []);

      const activeFarmerId = farmerProfile?.id || 'farmer-1';
      const [fOrders, fProds] = await Promise.all([
        farmerService.getFarmerOrders(activeFarmerId),
        farmerService.getFarmerProducts(activeFarmerId),
      ]);
      setFarmerOrders(fOrders);
      setFarmerProducts(fProds);

      setBackendStatus(marketplaceService.getBackendStatus());
    } catch (err) {
      console.error('Failed to refresh platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [farmerProfile]);

  // Buyer Filtered Products
  const filteredProducts = useMemo(() => {
    const list = products.filter((prod) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        (prod.name_hi && prod.name_hi.toLowerCase().includes(q)) ||
        (prod.farmer?.farm_name && prod.farmer.farm_name.toLowerCase().includes(q));
      const matchesCat = selectedCategory === 'all' || prod.category_id === selectedCategory;
      const matchesArea =
        selectedServiceArea === 'all' ||
        prod.farmer?.service_area_id === selectedServiceArea ||
        (prod.farmer?.district && prod.farmer.district.toLowerCase().includes(selectedServiceArea.toLowerCase()));
      const matchesOrganic = !onlyOrganic || prod.is_certified_organic;
      const matchesHarvest = !harvestTodayOnly || Boolean(prod.harvest_date);
      return matchesSearch && matchesCat && matchesArea && matchesOrganic && matchesHarvest;
    });

    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => a.price_paise - b.price_paise);
    }
    if (sortBy === 'price_desc') {
      return [...list].sort((a, b) => b.price_paise - a.price_paise);
    }
    return list;
  }, [products, searchQuery, selectedCategory, selectedServiceArea, onlyOrganic, sortBy, harvestTodayOnly]);

  // Farmer: Quick preset filler
  const handleSelectQuickCrop = (name: string, catId: string, price: string, stock: string, unit: UnitOfSale) => {
    setQuickTitle(name);
    setQuickCategory(catId);
    setQuickPriceRupees(price);
    setQuickStock(stock);
    setQuickUnit(unit);
  };

  // Farmer: Quick Publish
  const handleCreateQuickProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      const pricePaise = Math.round(parseFloat(quickPriceRupees) * 100);
      const stockQty = parseFloat(quickStock);

      await farmerService.createProduct({
        farmerId: farmerProfile?.id || 'farmer-1',
        name: quickTitle.trim(),
        nameHi: quickTitle.trim(),
        categoryId: quickCategory,
        unit: quickUnit,
        pricePaise,
        availableQuantity: stockQty,
        minOrderQuantity: 1,
        unitStep: 1,
        isCertifiedOrganic: true,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        description: 'Harvested fresh at dawn. PGS-India natural pesticide-free certification.',
        descriptionHi: 'सुबह ताज़ा तोड़ा गया। पीजीएस-इंडिया प्राकृतिक प्रमाणीकरण।',
      });

      setQuickSuccess(true);
      setQuickTitle('');
      await refreshData();
      setTimeout(() => setQuickSuccess(false), 3500);
    } catch (err) {
      console.error('Quick product creation failed:', err);
      alert('Could not publish product. Please verify fields.');
    }
  };

  // Farmer: Order Lifecycle Progression
  const handleOrderStatusAdvance = async (orderId: string, nextStatus: Order['status']) => {
    try {
      await farmerService.updateOrderStatus(orderId, nextStatus);
      await refreshData();
    } catch (err) {
      console.error('Failed to advance order status:', err);
    }
  };

  // Farmer: Replenish Stock
  const handleAddStock = async (productId: string, currentStock: number) => {
    try {
      await farmerService.updateStock(productId, currentStock + 25);
      await refreshData();
    } catch (err) {
      console.error('Stock replenishment error:', err);
    }
  };

  // Admin: Verification Decision
  const handleAdminVerification = async (farmerId: string, status: 'verified' | 'rejected') => {
    try {
      await adminService.updateFarmerVerification(farmerId, status);
      await refreshData();
    } catch (err) {
      console.error('Farmer verification decision error:', err);
    }
  };

  // Dropdown Options (Matches Marketplace Bar UI)
  const serviceAreaOptions: DropdownOption[] = [
    { value: 'all', label: language === 'hi' ? 'सर्व हब्स (All Hubs)' : 'All Service Hubs', icon: '📍' },
    ...serviceAreas.map((sa) => ({
      value: sa.id,
      label: language === 'hi' && sa.name_hi ? sa.name_hi : sa.name,
      sublabel: sa.district,
      icon: '📍',
    })),
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'newest', label: language === 'hi' ? 'आजची ताजी तोडणी' : 'Fresh Harvest First', icon: '⚡' },
    { value: 'price_asc', label: language === 'hi' ? 'कमी किंमत' : 'Price: Low to High', icon: '💰' },
    { value: 'price_desc', label: language === 'hi' ? 'प्रीमियम आधी' : 'Price: High to Low', icon: '💎' },
  ];

  return (
    <div className="fd-platform-root">
      {/* ─── 1. Organic Floating Island Header ───────────────────────────── */}
      <div className="fd-island-header">
        <header className="fd-island-pill">
          {/* Brand Wordmark */}
          <Link to="/" className="fd-brand-group">
            <div className="fd-brand-badge-icon">🌱</div>
            <span className="fd-brand-wordmark">FarmDirect</span>
            <span className="fd-brand-subtag">India Direct</span>
          </Link>

          {/* Persona Switcher (Stadium Pill) */}
          <nav className="fd-persona-stadium" role="tablist">
            <button
              onClick={() => handlePersonaSelect('customer')}
              className={`fd-persona-tab ${selectedPersona === 'customer' ? 'active' : ''}`}
            >
              <ShoppingBag size={14} />
              <span>{language === 'hi' ? 'ग्राहक' : 'Buyer'}</span>
            </button>
            <button
              onClick={() => handlePersonaSelect('farmer')}
              className={`fd-persona-tab farmer ${selectedPersona === 'farmer' ? 'active' : ''}`}
            >
              <Tractor size={14} />
              <span>{language === 'hi' ? 'किसान' : 'Farmer'}</span>
            </button>
            <button
              onClick={() => handlePersonaSelect('admin')}
              className={`fd-persona-tab admin ${selectedPersona === 'admin' ? 'active' : ''}`}
            >
              <ShieldCheck size={14} />
              <span>{language === 'hi' ? 'प्रशासक' : 'Admin'}</span>
            </button>
          </nav>

          {/* Action Pills */}
          <div className="fd-actions-group">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="fd-ghost-pill"
              title="Change Language"
            >
              <Languages size={14} />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Cart Button */}
            <Link to="/cart" className="fd-cart-trigger">
              <ShoppingBag size={15} />
              <span>{formatPaise(grandTotalPaise, language)}</span>
              {itemCount > 0 && <span className="fd-cart-count">{itemCount}</span>}
            </Link>
          </div>
        </header>
      </div>

      {/* ─── 2. Agentic Copilot Hero Section ─────────────────────────────── */}
      <section className="fd-hero-section">
        <div className="fd-agentic-copilot-card">
          <div className="fd-copilot-badge">
            <Sparkles size={14} />
            <span>
              {selectedPersona === 'customer' && (language === 'hi' ? 'एआई फ़सल रडार' : 'AI Freshness Radar')}
              {selectedPersona === 'farmer' && (language === 'hi' ? 'किसान एआई सहायक' : 'Kisan AI Operating System')}
              {selectedPersona === 'admin' && (language === 'hi' ? 'सुरक्षा व नीति नियंत्रण' : 'Governance & Trust Engine')}
            </span>
          </div>

          <h1 className="fd-copilot-headline">
            {selectedPersona === 'customer' &&
              (language === 'hi'
                ? 'सीधे खेत की मिट्टी से। शून्य बिचौलिए।'
                : 'Direct from the Soil. Zero Middlemen.')}
            {selectedPersona === 'farmer' &&
              (language === 'hi'
                ? '1-मिनट में फ़सल लिस्ट करें। पूरा पैसा सीधे यूपीआई खाते में।'
                : 'List in 60 seconds. 100% Payout straight to UPI.')}
            {selectedPersona === 'admin' &&
              (language === 'hi'
                ? 'सत्यापित किसान, ईमानदार दरें व सुरक्षित भुगतान।'
                : 'Verified Farmers, Transparent Pricing & Idempotent Webhooks.')}
          </h1>

          <p className="fd-copilot-subhead">
            {selectedPersona === 'customer' &&
              (language === 'hi'
                ? 'नाशिक और पुणे के किसानों द्वारा सुबह 5:30 बजे कटी ताज़ा सब्जियां व फल। सुपरमार्केट से 34% कम दाम, बिना किसी दलाली के।'
                : 'Harvested at dawn along the Godavari basin. Delivered within 18 hours at 34% below supermarket prices with complete origin traceability.')}
            {selectedPersona === 'farmer' &&
              (language === 'hi'
                ? 'बिना मंडी दलालों के अपनी फ़सल उचित मूल्य पर सीधे ग्राहकों को बेचें। तुरंत ऑर्डर सूचना और सुरक्षित इन्वेंटरी नियंत्रण।'
                : 'Eliminate mandi commission and weighment shrinkage. Receive instant orders from nearby households and restaurants with guaranteed settlements.')}
            {selectedPersona === 'admin' &&
              (language === 'hi'
                ? '7/12 भूलेख भूमि सत्यापन, पीजीएस प्राकृतिक प्रमाणीकरण जांच और 0% ओवरसेलिंग की गारंटी।'
                : 'Automated 7/12 land record cross-checking, PGS organic validation, and strict single-tenant RLS isolation.')}
          </p>

          {/* Persona Quick Actions */}
          <div className="fd-copilot-actions">
            {selectedPersona === 'customer' && (
              <>
                <button
                  onClick={() => {
                    const veg = products.find(p => p.category_id === 'cat-veg');
                    if (veg) addToCart(veg, 2);
                  }}
                  className="fd-action-chip primary-lime"
                >
                  <Zap size={14} />
                  <span>{language === 'hi' ? '🌅 आज की प्रभात टोकरी जोड़ें (₹120)' : '🌅 1-Tap Morning Harvest Crate (₹120)'}</span>
                </button>
                <button
                  onClick={() => setHarvestTodayOnly(!harvestTodayOnly)}
                  className="fd-action-chip"
                >
                  <Clock size={14} />
                  <span>{harvestTodayOnly ? 'Showing Today Only' : 'Filter Harvested Today'}</span>
                </button>
                <Link to="/marketplace" className="fd-action-chip">
                  <span>{language === 'hi' ? 'पूरा बाज़ार देखें →' : 'Browse Full Catalog →'}</span>
                </Link>
              </>
            )}

            {selectedPersona === 'farmer' && (
              <>
                <button
                  onClick={() => handleSelectQuickCrop('नाशिक लाल कांदा', 'cat-veg', '26', '100', 'kg')}
                  className="fd-action-chip primary-lime"
                >
                  <Plus size={14} />
                  <span>{language === 'hi' ? '🧅 100 किग्रा कांदा लिस्ट करें (₹26/किग्रा)' : '🧅 Draft 100 kg Red Onions (₹26/kg)'}</span>
                </button>
                <button
                  onClick={() => handleSelectQuickCrop('देशी टमाटर', 'cat-veg', '32', '50', 'kg')}
                  className="fd-action-chip"
                >
                  <span>{language === 'hi' ? '🍅 50 किग्रा देशी टमाटर (₹32)' : '🍅 50 kg Tomatoes (₹32)'}</span>
                </button>
                <Link to="/farmer/dashboard" className="fd-action-chip">
                  <span>{language === 'hi' ? 'विस्तृत किसान डैशबोर्ड →' : 'Full Farmer Dashboard →'}</span>
                </Link>
              </>
            )}

            {selectedPersona === 'admin' && (
              <>
                <button onClick={refreshData} className="fd-action-chip primary-lime">
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  <span>{language === 'hi' ? 'लाइव ऑडिट सिंक करें' : 'Sync Live Telemetry'}</span>
                </button>
                <Link to="/admin/dashboard" className="fd-action-chip">
                  <span>{language === 'hi' ? 'प्रशासन डेस्क खोलें →' : 'Open Admin Operations Desk →'}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── 3. Dynamic Persona View ────────────────────────────────────── */}
      <main className="fd-main-content">
        {/* ================================================================= */}
        {/* BUYER MODE: CLEAN, MOUTH-WATERING, TRANSPARENT MARKETPLACE        */}
        {/* ================================================================= */}
        {selectedPersona === 'customer' && (
          <div>
            {/* Price Transparency Card */}
            <div className="fd-price-transparency-card">
              <div className="fd-metric-column">
                <span className="fd-metric-kicker">
                  {language === 'hi' ? 'किसान को सीधे भुगतान' : 'Direct Farmer Payout'}
                </span>
                <span className="fd-metric-num">₹32 / kg · 100% Direct</span>
              </div>
              <div className="fd-metric-column">
                <span className="fd-metric-kicker">
                  {language === 'hi' ? 'मंडी दलाली व आढ़त' : 'Mandi Middlemen Cut'}
                </span>
                <span className="fd-metric-num savings">₹0.00 (Zero)</span>
              </div>
              <div className="fd-metric-column">
                <span className="fd-metric-kicker">
                  {language === 'hi' ? 'सुपरमार्केट खुदरा भाव' : 'Supermarket Retail'}
                </span>
                <span className="fd-metric-num retail">₹48 - ₹55 / kg</span>
              </div>
              <div className="fd-metric-column">
                <span className="fd-metric-kicker">
                  {language === 'hi' ? 'आपकी शुद्ध बचत' : 'Your Net Savings'}
                </span>
                <span className="fd-metric-num savings">34% Cheaper</span>
              </div>
            </div>

            {/* 1. Category Pills Strip (Exact Marketplace Bar UI) */}
            <div className="marketplace-category-strip" role="tablist" aria-label="Product Categories">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`category-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                role="tab"
                aria-selected={selectedCategory === 'all'}
              >
                <Sparkles size={13} />
                <span>{language === 'hi' ? 'सर्व शेतमाल (All)' : 'All Harvest'}</span>
              </button>

              {categories.map((c) => {
                const isSelected = selectedCategory === c.id;
                const label = language === 'hi' && c.name_hi ? c.name_hi : c.name;
                const icon = getCategoryEmoji(c.icon || c.slug);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                    role="tab"
                    aria-selected={isSelected}
                  >
                    <span>{icon} {label}</span>
                  </button>
                );
              })}
            </div>

            {/* 2. Unified Command Card (Exact Marketplace Bar UI) */}
            <div className="marketplace-command-card">
              <div className="command-controls-row">
                {/* Search */}
                <div className="command-search-field">
                  <Search size={15} className="command-search-icon" />
                  <input
                    type="text"
                    placeholder={language === 'hi' ? 'खोजें: नाशिक कांदा, द्राक्षे, पालक, लोकवन गहू, तूप, टोमॅटो...' : 'Search fresh produce: Nashik Onions, Grapes, Spinach, Wheat, Gir Cow Ghee...'}
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

                {/* Filters */}
                <div className="command-filters-group">
                  <CustomDropdown
                    value={selectedServiceArea}
                    options={serviceAreaOptions}
                    onChange={setSelectedServiceArea}
                    icon={<MapPin size={13} />}
                    ariaLabel="Select Hub"
                  />

                  <CustomDropdown
                    value={sortBy || 'newest'}
                    options={sortOptions}
                    onChange={(val) => setSortBy(val as MarketplaceFilters['sortBy'])}
                    icon={<ArrowUpDown size={13} />}
                    ariaLabel="Sort Produce"
                  />

                  <button
                    type="button"
                    onClick={() => setOnlyOrganic(!onlyOrganic)}
                    className={`organic-toggle-pill ${onlyOrganic ? 'active' : ''}`}
                    aria-pressed={onlyOrganic}
                    title="Filter Certified Organic"
                  >
                    <Award size={13} />
                    <span>{language === 'hi' ? '100% सेंद्रिय' : 'Organic Only'}</span>
                    {onlyOrganic && <Check size={11} className="toggle-check" />}
                  </button>

                  <div className="command-lot-badge">
                    <span className="lot-dot"></span>
                    <span><strong>{filteredProducts.length}</strong> {language === 'hi' ? 'शेतमाल' : 'lots'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Staples Micro-Strip */}
              <div className="command-staples-substrip">
                <span className="staples-micro-label">{language === 'hi' ? '🔥 रोजची गरज:' : '🔥 Quick:'}</span>
                <div className="staples-micro-scroll">
                  {[
                    { name: language === 'hi' ? 'नाशिक लाल कांदा' : 'Nashik Red Onions', q: 'onion' },
                    { name: language === 'hi' ? 'Thompson Grapes' : 'Thompson Grapes', q: 'grapes' },
                    { name: language === 'hi' ? 'देशी कोवळा पालक' : 'Tender Spinach', q: 'spinach' },
                    { name: language === 'hi' ? 'लोकवन गहू' : 'Lokwan Wheat', q: 'wheat' },
                    { name: language === 'hi' ? 'गिर गाय बिलोना तूप' : 'Gir Cow Ghee', q: 'ghee' },
                    { name: language === 'hi' ? 'गावरान टोमॅटो' : 'Vine Tomatoes', q: 'tomato' },
                  ].map((staple) => (
                    <button
                      key={staple.q}
                      type="button"
                      onClick={() => {
                        setSearchQuery(staple.q);
                        setSelectedCategory('all');
                      }}
                      className={`staple-micro-btn ${searchQuery.toLowerCase().includes(staple.q) ? 'active' : ''}`}
                    >
                      {staple.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="fd-grid-products">
              {filteredProducts.map((prod) => {
                const qty = getItemQuantity(prod.id);
                const stock = prod.inventory?.available_quantity ?? 45;

                return (
                  <article key={prod.id} className="fd-product-card">
                    <div className="fd-card-visual">
                      <img
                        src={prod.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="fd-card-photo"
                        loading="lazy"
                      />
                      {prod.harvest_date && (
                        <div className="fd-harvest-badge">
                          <Clock size={11} />
                          <span>{language === 'hi' ? 'आज सुबह की कटाई' : 'Dawn Harvest'}</span>
                        </div>
                      )}
                      <div className="fd-stock-badge">
                        <span>{stock} {prod.unit} left</span>
                      </div>
                    </div>

                    <div className="fd-card-content">
                      <h3 className="fd-crop-name" title={prod.name}>
                        {language === 'hi' ? (prod.name_hi || prod.name) : prod.name}
                      </h3>
                      <div className="fd-farm-origin">
                        <MapPin size={12} color="#1b4d3a" style={{ flexShrink: 0 }} />
                        <span>{prod.farmer?.farm_name || 'Shree Ganesh Farm'} · {prod.farmer?.district || 'Nashik'}</span>
                      </div>

                      <div className="fd-card-bottom">
                        <div className="fd-price-lockup">
                          <span className="fd-rupee-price">{formatPaise(prod.price_paise, language)}</span>
                          <span className="fd-unit-denom">/ {prod.unit}</span>
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="fd-add-cart-btn"
                            aria-label={`Add ${prod.name} to cart`}
                          >
                            <Plus size={13} strokeWidth={2.5} />
                            <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
                          </button>
                        ) : (
                          <div className="fd-stepper-container" role="group" aria-label={`Adjust ${prod.name} quantity`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(prod.id, qty - 1)}
                              className="fd-stepper-icon-btn fd-stepper-dec"
                              aria-label="Decrease quantity"
                              title={qty === 1 ? 'Remove from cart' : 'Decrease quantity'}
                            >
                              {qty === 1 ? <Trash2 size={11} strokeWidth={2.2} /> : <Minus size={11} strokeWidth={2.5} />}
                            </button>
                            <span className="fd-stepper-digit-wrap">
                              <span className="fd-stepper-digit">{qty}</span>
                              <span className="fd-stepper-unit">{formatShortUnit(prod.unit)}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(prod.id, qty + 1)}
                              className="fd-stepper-icon-btn fd-stepper-inc"
                              aria-label="Increase quantity"
                              title="Increase quantity"
                            >
                              <Plus size={11} strokeWidth={2.5} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Floating Checkout Drawer on Selection */}
            {itemCount > 0 && (
              <div className="fd-floating-checkout-pill">
                <div>
                  <div className="fd-checkout-pill-meta">
                    {itemCount} {language === 'hi' ? 'फसलें चुनी गईं' : 'farm items'}
                  </div>
                  <div className="fd-checkout-pill-amount">
                    {formatPaise(grandTotalPaise, language)}
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="fd-checkout-action-btn"
                >
                  <span>{language === 'hi' ? 'ऑर्डर पूरा करें' : 'Proceed to Checkout'}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* FARMER MODE: EFFORTLESS 1-MINUTE LISTING & LIVE ORDERS            */}
        {/* ================================================================= */}
        {selectedPersona === 'farmer' && (
          <div>
            {/* 1-Minute Crop Studio */}
            <div className="fd-farmer-card-studio">
              <div className="fd-studio-header">
                <div>
                  <h2 className="fd-studio-title">
                    {language === 'hi' ? '🌾 आज क्या काटा, रमेश जी?' : '🌾 What did you harvest today, Ramesh?'}
                  </h2>
                  <p style={{ color: '#4e6b5d', fontSize: '0.875rem', marginTop: 4 }}>
                    {language === 'hi'
                      ? 'नीचे दिए गए सुझावों पर क्लिक करें या फ़सल का नाम टाइप करें। 1 क्लिक में बाज़ार में लाइव।'
                      : 'Tap any recommendation or type below. Published directly to nearby consumers in 60 seconds.'}
                  </p>
                </div>
                <div className="fd-studio-theme-badge">
                  <Sparkles size={13} color="#15803d" />
                  <span>{language === 'hi' ? 'सीधी फ़ार्मगेट बिक्री' : 'Direct Farmgate'}</span>
                </div>
              </div>

              {/* Pre-calibrated 1-tap quick suggestions */}
              <div className="fd-studio-quick-chips">
                {QUICK_PRESETS.map((preset) => {
                  const isActive = quickTitle === preset.name;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectQuickCrop(preset.name, preset.catId, preset.price, preset.stock, preset.unit)}
                      className={`fd-quick-crop-suggestion ${isActive ? 'active' : ''}`}
                    >
                      {isActive && (
                        <span className="fd-quick-chip-check" aria-hidden="true">
                          <Check size={11} strokeWidth={3.5} />
                        </span>
                      )}
                      <span>{language === 'hi' ? preset.badgeHi : preset.badgeEn}</span>
                    </button>
                  );
                })}
              </div>

              {quickSuccess && (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid #10b981',
                    color: '#065f46',
                    padding: '12px 18px',
                    borderRadius: 16,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>{language === 'hi' ? 'फ़सल सफलतापूर्वक बाज़ार में लाइव कर दी गई!' : 'Crop published directly to live consumer marketplace!'}</span>
                </div>
              )}

              <form onSubmit={handleCreateQuickProduct}>
                <div className="fd-inline-form-grid">
                  <div className="fd-input-wrapper">
                    <label className="fd-input-tag" htmlFor="fd-studio-title">
                      {language === 'hi' ? 'फ़सल का नाम' : 'Crop Name'}
                    </label>
                    <div className="fd-studio-input-wrap">
                      <span className="fd-input-icon-affix" aria-hidden="true">🌾</span>
                      <input
                        id="fd-studio-title"
                        type="text"
                        className="fd-clean-field fd-has-affix"
                        placeholder={language === 'hi' ? 'उदा: देशी टमाटर, पालक...' : 'e.g. Desi Tomatoes, Spinach...'}
                        value={quickTitle}
                        onChange={(e) => setQuickTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="fd-input-wrapper">
                    <label className="fd-input-tag" htmlFor="fd-studio-category">
                      {language === 'hi' ? 'श्रेणी' : 'Category'}
                    </label>
                    <div className="fd-studio-select-wrap">
                      <select
                        id="fd-studio-category"
                        className="fd-clean-field fd-studio-select"
                        value={quickCategory}
                        onChange={(e) => setQuickCategory(e.target.value)}
                      >
                        <option value="cat-veg">{language === 'hi' ? '🥬 ताज़ा सब्जियां (Vegetables)' : '🥬 Fresh Vegetables'}</option>
                        <option value="cat-fruit">{language === 'hi' ? '🍇 ताज़ा फल (Fruits)' : '🍇 Fresh Fruits'}</option>
                        <option value="cat-grains">{language === 'hi' ? '🌾 अनाज व दालें (Grains)' : '🌾 Grains & Pulses'}</option>
                        <option value="cat-dairy">{language === 'hi' ? '🥛 डेयरी व तेल (Dairy)' : '🥛 Farm Dairy & Oils'}</option>
                      </select>
                      <div className="fd-studio-select-arrow" aria-hidden="true">
                        <ChevronDown size={16} strokeWidth={2.4} />
                      </div>
                    </div>
                  </div>

                  <div className="fd-input-wrapper">
                    <label className="fd-input-tag" htmlFor="fd-studio-price">
                      {language === 'hi' ? `मूल्य प्रति ${getUnitLabel(quickUnit, 'hi')} (₹)` : `Rate / ${getUnitLabel(quickUnit, 'en')} (₹)`}
                    </label>
                    <div className="fd-studio-input-wrap">
                      <span className="fd-input-prefix-badge">₹</span>
                      <input
                        id="fd-studio-price"
                        type="number"
                        step="0.5"
                        min="1"
                        className="fd-clean-field fd-has-prefix fd-has-suffix"
                        value={quickPriceRupees}
                        onChange={(e) => setQuickPriceRupees(e.target.value)}
                        required
                      />
                      <span className="fd-input-suffix-tag">/ {formatShortUnit(quickUnit)}</span>
                    </div>
                  </div>

                  <div className="fd-input-wrapper">
                    <label className="fd-input-tag" htmlFor="fd-studio-stock">
                      {language === 'hi' ? `उपलब्ध मात्रा (${getUnitLabel(quickUnit, 'hi')})` : `Available Qty (${formatShortUnit(quickUnit)})`}
                    </label>
                    <div className="fd-studio-input-wrap">
                      <input
                        id="fd-studio-stock"
                        type="number"
                        min="1"
                        className="fd-clean-field fd-has-suffix"
                        value={quickStock}
                        onChange={(e) => setQuickStock(e.target.value)}
                        required
                      />
                      <span className="fd-input-suffix-tag">{formatShortUnit(quickUnit)}</span>
                    </div>
                  </div>
                </div>

                {/* Theme Customisable Unit Selector */}
                <div className="fd-unit-customizer-row">
                  <span className="fd-unit-customizer-label">
                    {language === 'hi' ? 'इकाई अनुकूलन (Unit of Sale):' : 'Unit of Sale:'}
                  </span>
                  <div className="fd-unit-pill-group" role="radiogroup" aria-label="Select unit of sale">
                    {(['kg', 'piece', 'dozen', 'gram', 'crate', 'quintal'] as UnitOfSale[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        role="radio"
                        aria-checked={quickUnit === u}
                        onClick={() => setQuickUnit(u)}
                        className={`fd-unit-choice-pill ${quickUnit === u ? 'selected' : ''}`}
                      >
                        <span className="fd-unit-choice-code">{formatShortUnit(u)}</span>
                        <span className="fd-unit-choice-name">
                          ({language === 'hi' ? getUnitLabel(u, 'hi') : u})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="fd-publish-btn"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>{language === 'hi' ? 'सीधे बाज़ार में लाइव करें (Publish Harvest)' : 'Publish to Live Marketplace'}</span>
                  <ArrowRight size={16} strokeWidth={2} style={{ marginLeft: 6 }} />
                </button>
              </form>
            </div>

            {/* Live Orders Stream */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2e22', marginBottom: 4 }}>
                {language === 'hi' ? '📦 प्राप्त ग्राहक ऑर्डर्स' : '📦 Incoming Farmgate Orders'}
              </h3>
              <p style={{ color: '#4e6b5d', fontSize: '0.84375rem', marginBottom: 16 }}>
                {language === 'hi'
                  ? 'ग्राहकों ने यह माल आरक्षित किया है। एक क्लिक में स्थिति बदलें।'
                  : 'Orders placed by nearby consumers. Stock is reserved atomically in database.'}
              </p>
            </div>

            <div className="fd-live-orders-grid">
              {farmerOrders.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#789285' }}>
                  {language === 'hi' ? 'कोई नया ऑर्डर लंबित नहीं है' : 'All orders fulfilled'}
                </div>
              ) : (
                farmerOrders.map((ord) => (
                  <div key={ord.id} className="fd-order-card-tile">
                    <div className="fd-order-header">
                      <span className="fd-order-id">#{ord.id.slice(0, 8)}</span>
                      <span className={`fd-order-badge ${ord.status === 'confirmed' ? 'confirmed' : 'ready'}`}>
                        {ord.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#4e6b5d' }}>
                      <strong>{ord.items?.length || 1} items</strong> · Total: {formatPaise(ord.total_amount_paise, language)}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      {ord.status === 'pending_confirmation' && (
                        <button
                          onClick={() => handleOrderStatusAdvance(ord.id, 'confirmed')}
                          className="fd-action-chip primary-lime"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Check size={14} />
                          <span>{language === 'hi' ? 'स्वीकारें व लॉक करें' : 'Accept & Lock'}</span>
                        </button>
                      )}
                      {ord.status === 'confirmed' && (
                        <button
                          onClick={() => handleOrderStatusAdvance(ord.id, 'ready_for_pickup')}
                          className="fd-action-chip primary-lime"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <PackageCheck size={14} />
                          <span>{language === 'hi' ? 'तैयार मार्क करें' : 'Mark Ready'}</span>
                        </button>
                      )}
                      {ord.status === 'ready_for_pickup' && (
                        <button
                          onClick={() => handleOrderStatusAdvance(ord.id, 'out_for_delivery')}
                          className="fd-action-chip primary-lime"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Truck size={14} />
                          <span>{language === 'hi' ? 'डिस्पैच करें' : 'Dispatch'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Smart Low-Stock Nudge */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2e22', marginBottom: 14 }}>
                {language === 'hi' ? '⚠️ कम स्टॉक चेतावनी व पुनः पूर्ति' : '⚠️ Smart Low Stock Replenishment'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {farmerProducts.map((p) => {
                  const stock = p.inventory?.available_quantity ?? 0;
                  return (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(15, 46, 34, 0.08)',
                        borderRadius: 18,
                        padding: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f2e22' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: stock < 15 ? '#e11d48' : '#4e6b5d' }}>
                          {stock} {p.unit} in stock
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddStock(p.id, stock)}
                        className="fd-ghost-pill"
                        style={{ borderColor: '#1b4d3a', color: '#1b4d3a' }}
                      >
                        <Plus size={14} />
                        <span>+ 25 {p.unit}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ADMIN MODE: GOVERNANCE, VERIFICATION & SECURITY TELEMETRY         */}
        {/* ================================================================= */}
        {selectedPersona === 'admin' && (
          <div>
            {/* Stats Row */}
            <div className="fd-admin-stats-row">
              <div className="fd-admin-metric-card">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#789285' }}>
                  Verified Producers
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2e22', marginTop: 4 }}>
                  {adminFarmers.filter(f => f.verification_status === 'verified').length} / {adminFarmers.length}
                </div>
              </div>

              <div className="fd-admin-metric-card">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#789285' }}>
                  Live Catalog Crops
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f2e22', marginTop: 4 }}>
                  {products.length} Items
                </div>
              </div>

              <div className="fd-admin-metric-card">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#789285' }}>
                  Webhook Idempotency
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: 4 }}>
                  100% Verified
                </div>
              </div>
            </div>

            {/* Farmer KYC Verification Queue */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2e22', marginBottom: 14 }}>
              {language === 'hi' ? '🛡️ किसान सत्यापन व 7/12 भूलेख जांच' : '🛡️ Farmer KYC & 7/12 Land Verification Desk'}
            </h3>

            <div className="fd-verification-stream">
              {adminFarmers.map((farmer) => (
                <div key={farmer.id} className="fd-verification-row">
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f2e22', fontSize: '1.05rem' }}>{farmer.farm_name}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#4e6b5d' }}>
                      {farmer.village}, {farmer.district} · ID: {farmer.id}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 9999,
                        fontSize: '0.71875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: farmer.verification_status === 'verified' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: farmer.verification_status === 'verified' ? '#065f46' : '#b45309',
                      }}
                    >
                      {farmer.verification_status}
                    </span>

                    {farmer.verification_status !== 'verified' && (
                      <button
                        onClick={() => handleAdminVerification(farmer.id, 'verified')}
                        className="fd-ghost-pill"
                        style={{ borderColor: '#10b981', color: '#065f46' }}
                      >
                        <Check size={14} />
                        <span>{language === 'hi' ? 'सत्यापित करें' : 'Approve KYC'}</span>
                      </button>
                    )}
                    {farmer.verification_status !== 'rejected' && (
                      <button
                        onClick={() => handleAdminVerification(farmer.id, 'rejected')}
                        className="fd-ghost-pill"
                        style={{ borderColor: '#e11d48', color: '#e11d48' }}
                      >
                        <X size={14} />
                        <span>{language === 'hi' ? 'खारिज' : 'Reject'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ─── 4. Clean Organic Footer ────────────────────────────────────── */}
      <footer className="fd-footer">
        <div className="fd-footer-top">
          <div className="fd-brand-group">
            <div className="fd-brand-badge-icon" style={{ width: 30, height: 30, fontSize: '0.95rem' }}>🌱</div>
            <span className="fd-brand-wordmark" style={{ fontSize: '1.05rem' }}>FarmDirect.</span>
          </div>

          <div className="fd-footer-links">
            <Link to="/marketplace" className="fd-footer-link">{language === 'hi' ? 'बाज़ार' : 'Marketplace'}</Link>
            <Link to="/orders" className="fd-footer-link">{language === 'hi' ? 'मेरे ऑर्डर्स' : 'My Orders'}</Link>
            <Link to="/farmer/dashboard" className="fd-footer-link">{language === 'hi' ? 'किसान हब' : 'Farmer Hub'}</Link>
            <Link to="/about" className="fd-footer-link">About</Link>
            <Link to="/terms" className="fd-footer-link">Terms</Link>
            <Link to="/privacy" className="fd-footer-link">Privacy</Link>
            <Link to="/support" className="fd-footer-link">Support</Link>
          </div>
        </div>

        <div className="fd-footer-bottom">
          <span>© 2026 FarmDirect · India-Focused Farmer-to-Consumer Agricultural Marketplace</span>
          <span>100% Direct UPI Settlement · PGS-India Natural · 7/12 Land Record Verified</span>
        </div>
      </footer>

      {/* ─── 5. Native Mobile Bottom Bar (PWA) ───────────────────────────── */}
      <nav className="fd-mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          onClick={() => handlePersonaSelect('customer')}
          className={`fd-nav-touch-item ${selectedPersona === 'customer' ? 'active' : ''}`}
        >
          <Home size={18} />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        <Link to="/marketplace" className="fd-nav-touch-item">
          <Store size={18} />
          <span>{language === 'hi' ? 'बाज़ार' : 'Market'}</span>
        </Link>

        <Link to="/cart" className="fd-nav-touch-item" style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={18} />
            {itemCount > 0 && <span className="fd-nav-touch-badge">{itemCount}</span>}
          </div>
          <span>{language === 'hi' ? 'कार्ट' : 'Cart'}</span>
        </Link>

        <Link to="/orders" className="fd-nav-touch-item">
          <PackageCheck size={18} />
          <span>{language === 'hi' ? 'ऑर्डर्स' : 'Orders'}</span>
        </Link>

        <button
          onClick={() => handlePersonaSelect('farmer')}
          className={`fd-nav-touch-item ${selectedPersona === 'farmer' ? 'active' : ''}`}
        >
          <Tractor size={18} />
          <span>{language === 'hi' ? 'किसान' : 'Farmer'}</span>
        </button>
      </nav>
    </div>
  );
};
