import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Languages, 
  UserCircle, 
  ShieldCheck, 
  Tractor, 
  Search,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { UserRole } from '../../types';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-earth-200 transition-all">
      {/* Top Utility Belt */}
      <div className="bg-agri-900 text-agri-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-agri-400 shrink-0" />
            <span className="hidden sm:inline">Active Region:</span>
            <span className="text-white font-semibold">Nashik & Western Pune Corridor</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Bilingual Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-agri-800 hover:bg-agri-700 text-white font-medium transition"
              title="Switch Language / भाषा बदला"
              aria-label="Switch Language"
            >
              <Languages className="w-3 h-3 text-agri-300" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Quick Demo Role Switcher Badge */}
            <div className="hidden md:flex items-center gap-1 bg-agri-950/60 px-2 py-0.5 rounded border border-agri-800">
              <span className="text-agri-300 text-[11px]">Role:</span>
              <button
                onClick={() => handleRoleChange('customer')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition ${
                  currentRole === 'customer' ? 'bg-agri-500 text-white' : 'text-agri-200 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleChange('farmer')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition ${
                  currentRole === 'farmer' ? 'bg-amber-600 text-white' : 'text-agri-200 hover:text-white'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition ${
                  currentRole === 'admin' ? 'bg-purple-600 text-white' : 'text-agri-200 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center shadow-soft text-white font-bold text-xl group-hover:scale-105 transition-transform">
            🌱
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl text-stone-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>FarmDirect</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-agri-100 text-agri-800 px-1.5 py-0.5 rounded">
                Direct
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block font-medium">
              थेट शेतातून • Fair Farmgate Price
            </p>
          </div>
        </Link>

        {/* Global Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="w-full bg-earth-100/80 border border-earth-300 rounded-full pl-10 pr-4 py-2 text-sm text-stone-800 placeholder-stone-400 focus:bg-white focus:border-agri-600 focus:ring-2 focus:ring-agri-100 transition"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/marketplace"
            className="hidden sm:inline-flex text-sm font-semibold text-stone-700 hover:text-agri-700 transition"
          >
            {t.nav.marketplace}
          </Link>

          {currentRole === 'farmer' && (
            <Link
              to="/farmer/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition"
            >
              <Tractor className="w-4 h-4 text-amber-700" />
              <span>{t.nav.farmerDashboard}</span>
            </Link>
          )}

          {currentRole === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-purple-50 text-purple-900 border border-purple-300 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>{t.nav.adminDashboard}</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full hover:bg-earth-100 text-stone-700 transition"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-6 h-6 text-stone-800" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-saffron-600 text-white font-bold text-[11px] rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm animate-pulse">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-earth-100 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-earth-200 bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="w-full bg-earth-100 border border-earth-300 rounded-lg pl-9 pr-4 py-2.5 text-sm"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Role Switching for Mobile */}
          <div className="bg-earth-100/70 p-3 rounded-xl border border-earth-200">
            <p className="text-xs font-semibold text-stone-600 mb-2">{t.nav.switchRole}:</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleRoleChange('customer')}
                className={`py-1.5 text-xs font-bold rounded ${
                  currentRole === 'customer' ? 'bg-agri-600 text-white' : 'bg-white text-stone-700'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleChange('farmer')}
                className={`py-1.5 text-xs font-bold rounded ${
                  currentRole === 'farmer' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`py-1.5 text-xs font-bold rounded ${
                  currentRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-white text-stone-700'
                }`}
              >
                Admin
              </button>
            </div>
            {user && (
              <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1">
                <UserCircle className="w-3.5 h-3.5" />
                <span>Signed in as: <strong>{user.full_name}</strong></span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold rounded-lg hover:bg-earth-100"
            >
              {t.nav.marketplace}
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold rounded-lg hover:bg-earth-100"
            >
              {t.nav.orders}
            </Link>
            {currentRole === 'farmer' && (
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-semibold rounded-lg bg-amber-50 text-amber-900"
              >
                {t.nav.farmerDashboard}
              </Link>
            )}
            {currentRole === 'admin' && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-semibold rounded-lg bg-purple-50 text-purple-900"
              >
                {t.nav.adminDashboard}
              </Link>
            )}
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 text-sm font-semibold rounded-lg hover:bg-earth-100"
            >
              About FarmDirect
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
