import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, ShoppingBag, PackageCheck, Tractor, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { currentRole } = useAuth();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-earth-200 px-2 py-1 shadow-lifted">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[11px] font-semibold transition ${
              isActive ? 'text-agri-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{t.nav.home}</span>
        </NavLink>

        {/* Marketplace */}
        <NavLink
          to="/marketplace"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[11px] font-semibold transition ${
              isActive ? 'text-agri-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span>{t.nav.marketplace}</span>
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[11px] font-semibold transition ${
              isActive ? 'text-agri-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-saffron-600 text-white font-bold text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span>{t.nav.cart}</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[11px] font-semibold transition ${
              isActive ? 'text-agri-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`
          }
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span>{t.nav.orders}</span>
        </NavLink>

        {/* Dynamic Portal Icon based on Role */}
        {currentRole === 'farmer' && (
          <NavLink
            to="/farmer/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[11px] font-semibold transition ${
                isActive ? 'text-amber-700 font-bold' : 'text-amber-800/80 hover:text-amber-900'
              }`
            }
          >
            <Tractor className="w-5 h-5 mb-0.5 text-amber-700" />
            <span>Farm Hub</span>
          </NavLink>
        )}

        {currentRole === 'admin' && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[11px] font-semibold transition ${
                isActive ? 'text-purple-700 font-bold' : 'text-purple-800/80 hover:text-purple-900'
              }`
            }
          >
            <ShieldCheck className="w-5 h-5 mb-0.5 text-purple-700" />
            <span>Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
