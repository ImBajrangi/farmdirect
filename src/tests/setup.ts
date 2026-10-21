import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import { marketplaceService } from '../services/marketplaceService';

beforeEach(async () => {
  try {
    const products = await marketplaceService.getProducts();
    for (const p of products) {
      if ((p.inventory?.available_quantity ?? 0) < 5) {
        await marketplaceService.updateInventory(p.id, 50);
      }
    }
  } catch {
    // Ignore during isolated unit tests
  }
});
