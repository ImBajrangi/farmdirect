import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Languages, 
  Search, 
  Menu, 
  X, 
  Tractor, 
  ShieldCheck, 
  UserCircle 
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/cart.context';
import { UserRole } from '../../types';
import './layout.css';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { currentRole, switchRole, user } = useAuth();
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
      {/* Top Utility Belt */}
      <div className="header-utility-belt">
        <div className="header-utility-content">
          <div className="flex-row items-center gap-2">
            <MapPin size={13} style={{ color: '#4ade80' }} />
            <span>Active Pilot Corridor:</span>
            <strong style={{ color: '#ffffff' }}>Nashik & Western Pune</strong>
          </div>

          <div className="flex-row items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="btn btn-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                padding: '2px 8px',
                minHeight: 'auto',
              }}
              title="Switch Language"
            >
              <Languages size={13} />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="flex-row items-center gap-1" style={{ fontSize: '0.6875rem' }}>
              <span style={{ color: '#86efac' }}>Role:</span>
              <button
                onClick={() => handleRoleChange('customer')}
                className={`btn btn-sm ${currentRole === 'customer' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '2px 6px', minHeight: 'auto', color: currentRole === 'customer' ? '#fff' : '#dcfce7' }}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleChange('farmer')}
                className={`btn btn-sm ${currentRole === 'farmer' ? 'btn-accent' : 'btn-ghost'}`}
                style={{ padding: '2px 6px', minHeight: 'auto', color: currentRole === 'farmer' ? '#fff' : '#dcfce7' }}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`btn btn-sm`}
                style={{
                  padding: '2px 6px',
                  minHeight: 'auto',
                  backgroundColor: currentRole === 'admin' ? '#7e22ce' : 'transparent',
                  color: '#ffffff',
                }}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="header-container">
        {/* Brand */}
        <Link to="/" className="header-brand">
          <div className="header-logo-icon">🌱</div>
          <div>
            <div className="header-brand-title">
              <span>FarmDirect</span>
              <span className="badge badge-primary">Direct</span>
            </div>
            <span className="text-caption" style={{ display: 'block' }}>
              थेट शेतातून • Fair Farmgate Price
            </span>
          </div>
        </Link>

        {/* Desktop Search Form */}
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

        {/* Action Controls */}
        <div className="header-actions">
          <Link to="/marketplace" className="btn btn-ghost btn-sm" style={{ fontWeight: 700 }}>
            {t.nav.marketplace}
          </Link>

          {currentRole === 'farmer' && (
            <Link to="/farmer/dashboard" className="btn btn-sm" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
              <Tractor size={14} />
              <span>{t.nav.farmerDashboard}</span>
            </Link>
          )}

          {currentRole === 'admin' && (
            <Link to="/admin/dashboard" className="btn btn-sm" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
              <ShieldCheck size={14} />
              <span>{t.nav.adminDashboard}</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <Link to="/cart" className="btn btn-ghost" style={{ position: 'relative', padding: 8 }} aria-label="Cart">
            <ShoppingBag size={22} />
            {itemCount > 0 && <span className="cart-button-badge">{itemCount}</span>}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost"
            style={{ padding: 8 }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '16px' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: 12 }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              {t.nav.marketplace}
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              {t.nav.orders}
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              About FarmDirect
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
