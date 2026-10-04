import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productsData } from '../data/products';
import { analytics } from '../lib/analytics';
import { calculateCart, hydrateCartItems } from '../lib/pricing';
import { cartService } from '../services/cartService';
import { CartCalculation, CartItemReference, CouponRule, HydratedCartItem } from '../types/cart';
import { useUIStore } from './useUIStore';

const initialItems: CartItemReference[] = [];
const initialHydrated = hydrateCartItems(initialItems, productsData);
const initialCalculation = calculateCart(initialHydrated, null);

interface CartState {
  items: CartItemReference[];
  appliedCoupon: CouponRule | null;
  hydratedItems: HydratedCartItem[];
  calculation: CartCalculation;

  // Actions
  addItem: (productId: string, variantId?: string, quantity?: number, openDrawer?: boolean) => boolean;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Selectors (strictly re-derived from catalog)
  getHydratedItems: () => HydratedCartItem[];
  getCartCalculation: () => CartCalculation;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      const updateCartState = (items: CartItemReference[], coupon: CouponRule | null) => {
        const hydratedItems = hydrateCartItems(items, productsData);
        const calculation = calculateCart(hydratedItems, coupon);
        set({ items, appliedCoupon: coupon, hydratedItems, calculation });
      };

      return {
        items: initialItems,
        appliedCoupon: null,
        hydratedItems: initialHydrated,
        calculation: initialCalculation,

        getHydratedItems: () => get().hydratedItems,
        getCartCalculation: () => get().calculation,
        getSubtotal: () => get().calculation.subtotal,
        getDiscount: () => get().calculation.discountAmount,
        getShipping: () => get().calculation.shippingFee,
        getTotal: () => get().calculation.total,
        getItemCount: () => get().calculation.itemCount,

        addItem: (productId, variantId, quantity = 1, openDrawer = true) => {
          const product = productsData.find((p) => p.id === productId);
          if (!product || !product.active) {
            useUIStore.getState().showToast('This item is currently unavailable.', 'error');
            return false;
          }

          const currentItems = get().items;
          const existingIdx = currentItems.findIndex(
            (i) => i.productId === productId && (i.variantId || '') === (variantId || '')
          );
          const currentQty = existingIdx >= 0 ? currentItems[existingIdx].quantity : 0;
          const targetQty = currentQty + quantity;

          // Stock validation
          let availableStock = product.stock;
          if (variantId && product.variants) {
            const v = product.variants.find((vr) => vr.id === variantId);
            if (v) availableStock = v.stock;
          }

          if (targetQty > availableStock) {
            useUIStore.getState().showToast(
              `Only ${availableStock} units remaining in stock.`,
              'error'
            );
            return false;
          }

          let updated: CartItemReference[];
          if (existingIdx >= 0) {
            updated = currentItems.map((item, idx) =>
              idx === existingIdx ? { ...item, quantity: targetQty } : item
            );
          } else {
            updated = [...currentItems, { productId, variantId, quantity }];
          }

          updateCartState(updated, get().appliedCoupon);

          useUIStore.getState().showToast(`Added "${product.name}" to your wellness basket`);
          if (openDrawer) {
            useUIStore.getState().openCart();
          }

          analytics.track('add_to_cart', {
            productId,
            variantId,
            quantity,
            productName: product.name,
            price: product.price,
          });

          return true;
        },

        removeItem: (productId, variantId) => {
          const product = productsData.find((p) => p.id === productId);
          const updated = get().items.filter(
            (i) => !(i.productId === productId && (i.variantId || '') === (variantId || ''))
          );
          updateCartState(updated, get().appliedCoupon);

          if (product) {
            analytics.track('remove_from_cart', { productId, variantId, productName: product.name });
            useUIStore.getState().showToast(`Removed "${product.name}" from your basket`, 'info');
          }
        },

        updateQuantity: (productId, variantId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(productId, variantId);
            return;
          }

          const product = productsData.find((p) => p.id === productId);
          if (!product) return;

          let availableStock = product.stock;
          if (variantId && product.variants) {
            const v = product.variants.find((vr) => vr.id === variantId);
            if (v) availableStock = v.stock;
          }

          const capped = Math.min(quantity, availableStock);
          const updated = get().items.map((item) =>
            item.productId === productId && (item.variantId || '') === (variantId || '')
              ? { ...item, quantity: capped }
              : item
          );
          updateCartState(updated, get().appliedCoupon);
        },

        clearCart: () => {
          updateCartState([], null);
        },

        applyCoupon: async (code: string) => {
          const coupon = await cartService.validateCoupon(code);
          if (!coupon) {
            return { success: false, message: 'Invalid or expired coupon code' };
          }

          const currentSubtotal = get().calculation.subtotal;
          if (coupon.minSubtotal && currentSubtotal < coupon.minSubtotal) {
            return {
              success: false,
              message: `Coupon requires a minimum order value of ₹${coupon.minSubtotal}`,
            };
          }

          updateCartState(get().items, coupon);
          useUIStore.getState().showToast(`Applied coupon "${coupon.code}" successfully!`);
          return { success: true, message: coupon.description };
        },

        removeCoupon: () => {
          updateCartState(get().items, null);
          useUIStore.getState().showToast('Coupon removed', 'info');
        },
      };
    },
    {
      name: 'sattva_cart_storage',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const hydratedItems = hydrateCartItems(state.items || [], productsData);
          const calculation = calculateCart(hydratedItems, state.appliedCoupon || null);
          state.hydratedItems = hydratedItems;
          state.calculation = calculation;
        }
      },
    }
  )
);
