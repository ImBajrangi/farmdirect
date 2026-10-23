import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Languages,
  Tractor,
  ShieldCheck,
  Sprout,
  ThermometerSnowflake,
  PackageCheck,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { UserRole } from '../../types';
import { FruitBasketsLogoIcon } from '../common/FruitBasketsLogoIcon';
import './layout.css';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { currentRole, switchRole } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const portalMenuRef = useRef<HTMLDivElement>(null);

  // Close portal dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portalMenuRef.current && !portalMenuRef.current.contains(event.target as Node)) {
        setPortalMenuOpen(false);
      }
    };
    if (portalMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [portalMenuOpen]);


  // Active link detection based on current pathname and query params
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');

  const isBasketsActive = location.pathname === '/marketplace' && categoryParam === 'fruits';
  const isHarvestActive =
    (location.pathname === '/marketplace' && categoryParam !== 'fruits') ||
    location.pathname === '/' ||
    location.pathname === '/home';
  const isFarmsActive =
    location.pathname === '/farmers' ||
    (location.pathname.startsWith('/farmer/') &&
      location.pathname !== '/farmer/dashboard' &&
      location.pathname !== '/farmer/add-product');
  const isPlatformActive = location.pathname === '/platform';
  const isOrdersActive = location.pathname === '/orders' || location.pathname.startsWith('/order');
  const isFarmerDashActive =
    location.pathname === '/farmer/dashboard' || location.pathname === '/farmer/add-product';
  const isAdminDashActive = location.pathname === '/admin/dashboard';

  const handleColdChainClick = (e: React.MouseEvent) => {
    if (location.pathname === '/' || location.pathname === '/home') {
      e.preventDefault();
      const el = document.getElementById('cold-chain');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      navigate('/#cold-chain');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setMobileMenuOpen(false);
    if (role === 'farmer') navigate('/farmer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/marketplace');
  };

  return (
    <header className="xfarm-unified-header">
      <div className="xfarm-unified-header-inner">
        {/* ─── Top Main Header Bar ───────────────────────────────────────── */}
        <div className="xfarm-header-nav">
          {/* Brand Lockup */}
          <Link to="/" className="xfarm-brand-lockup" aria-label="Fruit Baskets">
            <FruitBasketsLogoIcon size={34} color="#0F2E22" />
            <span className="xfarm-brand-text">Fruit Baskets</span>
          </Link>

          {/* Desktop Floating Pill Navigation */}
          <nav className="xfarm-pill-nav" aria-label="Main Navigation">
            <Link
              to="/marketplace"
              className={`xfarm-nav-link ${isHarvestActive ? 'active-lime' : ''}`}
            >
              <Sprout size={15} />
              <span>Fresh Harvest</span>
            </Link>
            <Link
              to="/marketplace?category=fruits"
              className={`xfarm-nav-link ${isBasketsActive ? 'active-lime' : ''}`}
            >
              <ShoppingBag size={15} />
              <span>Fruit Baskets</span>
            </Link>
            <Link
              to="/farmers"
              className={`xfarm-nav-link ${isFarmsActive ? 'active' : ''}`}
            >
              <Tractor size={15} />
              <span>Verified Farms</span>
            </Link>
            <a
              href="#cold-chain"
              onClick={handleColdChainClick}
              className="xfarm-nav-link"
            >
              <ThermometerSnowflake size={15} />
              <span>24h Cold-Chain</span>
            </a>
            <Link
              to="/platform"
              className={`xfarm-nav-link ${isPlatformActive ? 'active' : ''}`}
            >
              <ShieldCheck size={15} />
              <span>7/12 Land Verified</span>
            </Link>
          </nav>

          {/* Right Action & Utility Controls */}
          <div className="xfarm-header-actions">
            {/* Desktop Portal Switcher Dropdown */}
            <div className="xfarm-portal-menu-wrapper" ref={portalMenuRef}>
              <button
                type="button"
                onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                className={`xfarm-portal-pill-btn ${portalMenuOpen ? 'open' : ''}`}
                title="Switch Portal Experience"
                aria-expanded={portalMenuOpen}
                aria-haspopup="true"
              >
                {currentRole === 'customer' && <ShoppingBag size={14} className="xfarm-portal-pill-icon" />}
                {currentRole === 'farmer' && <Tractor size={14} className="xfarm-portal-pill-icon" />}
                {currentRole === 'admin' && <ShieldCheck size={14} className="xfarm-portal-pill-icon" />}
                <span className="xfarm-portal-label">
                  {currentRole === 'customer'
                    ? 'Buyer Mode'
                    : currentRole === 'farmer'
                    ? 'Farmer Portal'
                    : 'Admin Console'}
                </span>
                <ChevronDown size={12} className={`xfarm-chevron ${portalMenuOpen ? 'rotate' : ''}`} />
              </button>

              {portalMenuOpen && (
                <div className="xfarm-portal-dropdown" role="menu">
                  <div className="xfarm-portal-dropdown-header">Select Portal Experience</div>

                  <button
                    type="button"
                    role="menuitem"
                    className={`xfarm-portal-option ${currentRole === 'customer' ? 'active' : ''}`}
                    onClick={() => {
                      handleRoleChange('customer');
                      setPortalMenuOpen(false);
                    }}
                  >
                    <div className="xfarm-portal-option-icon">
                      <ShoppingBag size={15} />
                    </div>
                    <div className="xfarm-portal-option-text">
                      <span className="xfarm-portal-name">Buyer Store</span>
                      <span className="xfarm-portal-desc">Shop fresh fruit baskets & cold-chain produce</span>
                    </div>
                    {currentRole === 'customer' && <Check size={14} className="xfarm-portal-check" />}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className={`xfarm-portal-option ${currentRole === 'farmer' ? 'active' : ''}`}
                    onClick={() => {
                      handleRoleChange('farmer');
                      setPortalMenuOpen(false);
                    }}
                  >
                    <div className="xfarm-portal-option-icon">
                      <Tractor size={15} />
                    </div>
                    <div className="xfarm-portal-option-text">
                      <span className="xfarm-portal-name">Farmer Portal</span>
                      <span className="xfarm-portal-desc">Manage harvest listings & 7/12 land records</span>
                    </div>
                    {currentRole === 'farmer' && <Check size={14} className="xfarm-portal-check" />}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className={`xfarm-portal-option ${currentRole === 'admin' ? 'active' : ''}`}
                    onClick={() => {
                      handleRoleChange('admin');
                      setPortalMenuOpen(false);
                    }}
                  >
                    <div className="xfarm-portal-option-icon">
                      <ShieldCheck size={15} />
                    </div>
                    <div className="xfarm-portal-option-text">
                      <span className="xfarm-portal-name">Admin Console</span>
                      <span className="xfarm-portal-desc">Quality audits, cold-chain & farm approvals</span>
                    </div>
                    {currentRole === 'admin' && <Check size={14} className="xfarm-portal-check" />}
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="xfarm-lang-btn"
              title="Switch Language"
            >
              <Languages size={14} />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Cart Pill with Live Count */}
            <Link to="/cart" className="xfarm-cart-pill" aria-label="Shopping Cart">
              <ShoppingBag size={16} />
              {itemCount > 0 && <span className="xfarm-cart-count">{itemCount}</span>}
            </Link>

            {/* Primary Action CTA */}
            <Link to="/marketplace" className="xfarm-header-cta">
              <span>Order Farm Fresh</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xfarm-mobile-toggle"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile / Tablet Horizontal Scrollable Chips Rail ───────────── */}
        <nav className="xfarm-mobile-chips-wrapper" aria-label="Mobile Navigation Sections">
          <div className="xfarm-mobile-chips-track">
            <Link
              to="/marketplace"
              className={`xfarm-chip-pill ${isHarvestActive ? 'active' : ''}`}
            >
              <Sprout size={13} />
              <span>Fresh Harvest</span>
            </Link>
            <Link
              to="/marketplace?category=fruits"
              className={`xfarm-chip-pill ${isBasketsActive ? 'active' : ''}`}
            >
              <ShoppingBag size={13} />
              <span>Fruit Baskets</span>
            </Link>
            <Link
              to="/farmers"
              className={`xfarm-chip-pill ${isFarmsActive ? 'active' : ''}`}
            >
              <Tractor size={13} />
              <span>Verified Farms</span>
            </Link>
            <a
              href="#cold-chain"
              onClick={handleColdChainClick}
              className="xfarm-chip-pill"
            >
              <ThermometerSnowflake size={13} />
              <span>24h Cold-Chain</span>
            </a>
            <Link
              to="/platform"
              className={`xfarm-chip-pill ${isPlatformActive ? 'active' : ''}`}
            >
              <ShieldCheck size={13} />
              <span>7/12 Land Verified</span>
            </Link>
            <Link
              to="/orders"
              className={`xfarm-chip-pill ${isOrdersActive ? 'active' : ''}`}
            >
              <PackageCheck size={13} />
              <span>My Orders</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* ─── Mobile Expandable Drawer Panel ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xfarm-mobile-drawer">
          <form onSubmit={handleSearchSubmit} className="xfarm-mobile-search-form">
            <Search size={16} className="xfarm-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="xfarm-search-input"
            />
          </form>

          {/* Quick Portal Switcher */}
          <div className="xfarm-drawer-section">
            <div className="xfarm-drawer-section-title">Select Portal Mode:</div>
            <div className="xfarm-drawer-roles">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`xfarm-role-btn ${currentRole === 'customer' ? 'active' : ''}`}
              >
                <ShoppingBag size={14} />
                <span>Buyer Store</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('farmer')}
                className={`xfarm-role-btn ${currentRole === 'farmer' ? 'active' : ''}`}
              >
                <Tractor size={14} />
                <span>Farmer Portal</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`xfarm-role-btn ${currentRole === 'admin' ? 'active' : ''}`}
              >
                <ShieldCheck size={14} />
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          {/* Language Switcher Row in Drawer */}
          <div className="xfarm-drawer-lang-row">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="xfarm-drawer-lang-btn"
            >
              <Languages size={15} />
              <span>Language: {language === 'en' ? 'हिन्दी (Switch to Hindi)' : 'English (Switch to English)'}</span>
            </button>
          </div>


          {/* Quick Route Links */}
          <div className="xfarm-drawer-links">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <Sprout size={16} />
              <span>{t.nav.marketplace}</span>
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <PackageCheck size={16} />
              <span>{t.nav.orders}</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <ShoppingBag size={16} />
              <span>{t.nav.cart} ({itemCount})</span>
            </Link>
            <Link
              to="/platform"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <ShieldCheck size={16} />
              <span>7/12 Land Transparency</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <span>About FarmDirect</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
