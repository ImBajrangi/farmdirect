import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Languages,
  Tractor,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { UserRole } from '../../types';
import './layout.css';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { currentRole, switchRole } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <header className="app-header">
      {/* Mobbin Floating Stadium Nav Pill */}
      <div className="nav-pill-wrapper">
        {/* Brand Lockup */}
        <Link to="/" className="header-brand">
          <div className="header-logo-icon">🌱</div>
          <span className="header-brand-title">FarmDirect.</span>
        </Link>

        {/* Desktop Search Pill */}
        <form onSubmit={handleSearchSubmit} className="header-search-form">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="header-search-input"
          />
        </form>

        {/* Center Nav Links */}
        <nav className="header-nav-links">
          <Link to="/marketplace" className="header-link">
            {t.nav.marketplace}
          </Link>
          <Link to="/orders" className="header-link">
            Orders
          </Link>
          {currentRole === 'farmer' && (
            <Link to="/farmer/dashboard" className="header-link flex-row items-center gap-1">
              <Tractor size={14} />
              <span>{t.nav.farmerDashboard}</span>
            </Link>
          )}
          {currentRole === 'admin' && (
            <Link to="/admin/dashboard" className="header-link flex-row items-center gap-1">
              <ShieldCheck size={14} />
              <span>{t.nav.adminDashboard}</span>
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Workspace Persona Switcher */}
          <div className="header-persona-switcher">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`header-persona-btn ${currentRole === 'customer' ? 'active' : ''}`}
              title="Buyer Portal"
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('farmer')}
              className={`header-persona-btn ${currentRole === 'farmer' ? 'active' : ''}`}
              title="Farmer Portal"
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`header-persona-btn ${currentRole === 'admin' ? 'active' : ''}`}
              title="Admin Console"
            >
              Admin
            </button>
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="btn btn-pill-soft btn-sm"
            title="Switch Language"
          >
            <Languages size={13} />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Cart Primary CTA Pill */}
          <Link to="/cart" className="btn btn-primary btn-sm" aria-label="Cart">
            <ShoppingBag size={15} />
            <span>Cart</span>
            {itemCount > 0 && <span className="cart-button-badge">{itemCount}</span>}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-pill-soft btn-sm header-mobile-toggle"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="input-field"
              style={{ paddingLeft: 36 }}
            />
          </form>

          <div className="flex-col gap-2">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start' }}
            >
              {t.nav.marketplace}
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start' }}
            >
              {t.nav.orders}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start' }}
            >
              About FarmDirect
            </Link>
          </div>

          {/* Quick Role Switcher */}
          <div style={{ paddingTop: 8, borderTop: '1px solid var(--color-hairline)' }}>
            <div className="text-caption mb-2">Switch View Mode:</div>
            <div className="flex-row gap-2">
              <button
                onClick={() => handleRoleChange('customer')}
                className={`btn btn-sm ${currentRole === 'customer' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleChange('farmer')}
                className={`btn btn-sm ${currentRole === 'farmer' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`btn btn-sm ${currentRole === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
