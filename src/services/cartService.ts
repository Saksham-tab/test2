import { siteConfig } from '../config/site';
import { productsData } from '../data/products';
import { CouponRule } from '../types/cart';

export interface ICartService {
  validateCoupon(code: string): Promise<CouponRule | null>;
  checkStock(productId: string, variantId?: string, quantity?: number): Promise<{ available: boolean; maxQuantity: number }>;
}

class MockCartService implements ICartService {
  async validateCoupon(code: string): Promise<CouponRule | null> {
    const cleaned = code.trim().toUpperCase();
    const found = siteConfig.coupons.find((c) => c.code.toUpperCase() === cleaned);
    return found || null;
  }

  async checkStock(productId: string, variantId?: string, quantity = 1): Promise<{ available: boolean; maxQuantity: number }> {
    const product = productsData.find((p) => p.id === productId);
    if (!product || !product.active) {
      return { available: false, maxQuantity: 0 };
    }

    if (variantId && product.variants) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) return { available: false, maxQuantity: 0 };
      return {
        available: variant.stock >= quantity,
        maxQuantity: variant.stock,
      };
    }

    return {
      available: product.stock >= quantity,
      maxQuantity: product.stock,
    };
  }
}

export const cartService: ICartService = new MockCartService();
