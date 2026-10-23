import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Languages,
  Tractor,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';
import { FruitBasketsLogoIcon } from '../common/FruitBasketsLogoIcon';
import './layout.css';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active link detection: strictly inactive on landing page (/), only active on their dedicated page
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');

  const isFruitsCategory = categoryParam === 'fruits' || categoryParam === 'cat-fruit' || categoryParam === '350d3d9d-b0a2-467a-ad08-8bd67dde51ee';
  const isBasketsActive = location.pathname === '/marketplace' && isFruitsCategory;
  const isHarvestActive = location.pathname === '/marketplace' && !isFruitsCategory;
  const isFarmsActive = location.pathname === '/farmers';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="xfarm-unified-header">
      {/* ─── Continuous Top Announcement Bar ──────────────────────────────── */}
      <div className="xfarm-top-announcement-bar">
        <div className="xfarm-announcement-inner">
          <span className="xfarm-announcement-text">
            {language === 'hi'
              ? 'नाशिक व पुणे थेट शेतातून ताजी तोडणी · शून्य मध्यस्थ · ₹४९९ वरील ऑर्डरवर मोफत डिलिव्हरी'
              : 'Direct Farmgate Morning Harvest Across Nashik & Western Pune · 100% Direct Farmer Payouts · Free Delivery > ₹499'}
          </span>
          <Link to="/marketplace" className="xfarm-announcement-link">
            <span>{language === 'hi' ? 'खरेदी करा' : 'Order Now'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="xfarm-unified-header-inner">
        {/* ─── Top Main Header Bar ───────────────────────────────────────── */}
        <div className="xfarm-header-nav">
          {/* Brand Lockup */}
          <Link to="/" className="xfarm-brand-lockup" aria-label="Fruit Baskets">
            <FruitBasketsLogoIcon className="xfarm-brand-icon" color="#0F2E22" />
            <span className="xfarm-brand-text">Fruit Baskets</span>
          </Link>

          {/* Desktop Floating Pill Navigation: Exactly 3 Items */}
          <nav className="xfarm-pill-nav" aria-label="Main Navigation">
            <Link
              to="/marketplace"
              className={`xfarm-nav-link ${isHarvestActive ? 'active-lime' : ''}`}
            >
              <Sprout size={16} className="xfarm-nav-icon" />
              <span>Fresh Harvest</span>
            </Link>
            <Link
              to="/marketplace?category=fruits"
              className={`xfarm-nav-link ${isBasketsActive ? 'active-lime' : ''}`}
            >
              <ShoppingBag size={16} className="xfarm-nav-icon" />
              <span>Fruit Baskets</span>
            </Link>
            <Link
              to="/farmers"
              className={`xfarm-nav-link ${isFarmsActive ? 'active-lime' : ''}`}
            >
              <Tractor size={16} className="xfarm-nav-icon" />
              <span>Verified Farms</span>
            </Link>
          </nav>

          {/* Right Action & Utility Controls */}
          <div className="xfarm-header-actions">
            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="xfarm-lang-btn"
              title="Switch Language"
            >
              <Languages size={15} className="xfarm-action-icon" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Cart Pill with Live Count */}
            <Link to="/cart" className="xfarm-cart-pill" aria-label="Shopping Cart">
              <ShoppingBag size={16} className="xfarm-action-icon" />
              {itemCount > 0 && <span className="xfarm-cart-count">{itemCount}</span>}
            </Link>

            {/* Primary Action CTA (Desktop/Tablet) */}
            <Link to="/marketplace" className="xfarm-header-cta">
              <span>Order Now</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xfarm-mobile-toggle"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X size={18} className="xfarm-toggle-icon" />
              ) : (
                <Menu size={18} className="xfarm-toggle-icon" />
              )}
            </button>
          </div>
        </div>

        {/* ─── Mobile / Tablet Horizontal Scrollable Chips Rail (Exactly 3 Items) ───── */}
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
          </div>
        </nav>
      </div>

      {/* ─── Mobile Expandable Drawer Panel ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xfarm-mobile-drawer">
          {/* Quick Search */}
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

          {/* Primary Marketplace 2-Item Menu */}
          <div className="xfarm-drawer-marketplace-hero">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-harvest-card"
            >
              <div className="xfarm-drawer-harvest-icon">
                <Sprout size={20} />
              </div>
              <div className="xfarm-drawer-harvest-info">
                <span className="xfarm-drawer-harvest-title">Fresh Harvest</span>
                <span className="xfarm-drawer-harvest-desc">Direct farmgate listings</span>
              </div>
            </Link>

            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-order-now-btn"
            >
              <span>Order Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Clean Navigation Links */}
          <div className="xfarm-drawer-links">
            <Link
              to="/marketplace?category=fruits"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <ShoppingBag size={16} />
              <span>Fruit Baskets</span>
            </Link>
            <Link
              to="/farmers"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <Tractor size={16} />
              <span>Verified Farms</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="xfarm-drawer-link"
            >
              <ShoppingBag size={16} />
              <span>{t.nav.cart} ({itemCount})</span>
            </Link>
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
        </div>
      )}
    </header>
  );
};
