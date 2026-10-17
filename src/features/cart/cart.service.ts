import { CartItemData, CartGroup } from './cart.types';

const STORAGE_KEY = 'farmdirect_cart_v1';

export const cartService = {
  getStoredItems(): CartItemData[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveItems(items: CartItemData[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  groupItemsByFarmer(items: CartItemData[]): CartGroup[] {
    const map = new Map<string, CartItemData[]>();
    for (const item of items) {
      const fId = item.product.farmer_id;
      if (!map.has(fId)) map.set(fId, []);
      map.get(fId)!.push(item);
    }

    const groups: CartGroup[] = [];
    for (const [, groupItems] of map.entries()) {
      const farmer = groupItems[0]?.product.farmer;
      if (!farmer) continue;

      const subtotalPaise = groupItems.reduce(
        (sum, item) => sum + item.product.price_paise * item.quantity,
        0
      );
      // Free delivery threshold: ₹500 (50,000 paise)
      const deliveryFeePaise = subtotalPaise >= 50000 ? 0 : 4000;

      groups.push({
        farmer,
        items: groupItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          subtotal_paise: item.product.price_paise * item.quantity,
        })),
        subtotal_paise: subtotalPaise,
        delivery_fee_paise: deliveryFeePaise,
        total_paise: subtotalPaise + deliveryFeePaise,
      });
    }

    return groups;
  },
};
