import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, ShoppingBag, PackageCheck, Tractor, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/cart.context';
import { useAuth } from '../../features/auth/AuthContext';
import './layout.css';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { currentRole } = useAuth();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>{t.nav.home}</span>
        </NavLink>

        {/* Marketplace */}
        <NavLink
          to="/marketplace"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Store size={20} />
          <span>{t.nav.marketplace}</span>
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          style={{ position: 'relative' }}
        >
          <ShoppingBag size={20} />
          {itemCount > 0 && <span className="cart-button-badge">{itemCount}</span>}
          <span>{t.nav.cart}</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <PackageCheck size={20} />
          <span>{t.nav.orders}</span>
        </NavLink>

        {/* Role Portal */}
        {currentRole === 'farmer' && (
          <NavLink
            to="/farmer/dashboard"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            style={{ color: 'var(--color-accent)' }}
          >
            <Tractor size={20} />
            <span>Farm Hub</span>
          </NavLink>
        )}

        {currentRole === 'admin' && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            style={{ color: '#7e22ce' }}
          >
            <ShieldCheck size={20} />
            <span>Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
