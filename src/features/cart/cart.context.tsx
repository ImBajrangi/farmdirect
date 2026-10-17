import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../../types';
import { CartItemData, CartGroup } from './cart.types';
import { cartService } from './cart.service';

interface CartContextType {
  items: CartItemData[];
  itemCount: number;
  totalSubtotalPaise: number;
  totalDeliveryFeePaise: number;
  grandTotalPaise: number;
  cartGroups: CartGroup[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItemData[]>(() => cartService.getStoredItems());

  useEffect(() => {
    cartService.saveItems(items);
  }, [items]);

  const addToCart = (product: Product, quantity?: number) => {
    const step = quantity || product.unit_step || 1;
    const available = product.inventory?.available_quantity ?? 999;

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + step, available);
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: newQty } : i));
      } else {
        const initialQty = Math.min(Math.max(product.min_order_quantity, step), available);
        return [...prev, { product, quantity: initialQty }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.product.id !== productId);
      return prev.map((i) => {
        if (i.product.id === productId) {
          const available = i.product.inventory?.available_quantity ?? 999;
          return { ...i, quantity: Math.min(quantity, available) };
        }
        return i;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    cartService.saveItems([]);
  };

  const getItemQuantity = (productId: string): number => {
    return items.find((i) => i.product.id === productId)?.quantity || 0;
  };

  const cartGroups = React.useMemo(() => cartService.groupItemsByFarmer(items), [items]);

  const totalSubtotalPaise = cartGroups.reduce((acc, g) => acc + g.subtotal_paise, 0);
  const totalDeliveryFeePaise = cartGroups.reduce((acc, g) => acc + g.delivery_fee_paise, 0);
  const grandTotalPaise = totalSubtotalPaise + totalDeliveryFeePaise;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalSubtotalPaise,
        totalDeliveryFeePaise,
        grandTotalPaise,
        cartGroups,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
