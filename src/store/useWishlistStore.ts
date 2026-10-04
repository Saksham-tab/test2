import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productsData } from '../data/products';
import { analytics } from '../lib/analytics';
import { Product } from '../types/product';
import { useUIStore } from './useUIStore';

const getProductsForIds = (ids: string[]) => {
  const set = new Set(ids);
  return productsData.filter((p) => set.has(p.id) && p.active);
};

interface WishlistState {
  wishlistProductIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  getWishlistProducts: () => Product[];
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistProductIds: [],
      wishlistProducts: [],

      isInWishlist: (productId: string) => {
        return get().wishlistProductIds.includes(productId);
      },

      toggleWishlist: (productId: string) => {
        const current = get().wishlistProductIds;
        const exists = current.includes(productId);
        const product = productsData.find((p) => p.id === productId);

        let updatedIds: string[];
        let result: boolean;

        if (exists) {
          updatedIds = current.filter((id) => id !== productId);
          result = false;
          if (product) {
            useUIStore.getState().showToast(`Removed "${product.name}" from your wishlist`, 'info');
          }
        } else {
          updatedIds = [...current, productId];
          result = true;
          if (product) {
            useUIStore.getState().showToast(`Saved "${product.name}" to your wishlist`);
            analytics.track('wishlist_added', { productId, productName: product.name });
          }
        }

        const wishlistProducts = getProductsForIds(updatedIds);
        set({ wishlistProductIds: updatedIds, wishlistProducts });
        return result;
      },

      getWishlistProducts: () => get().wishlistProducts,

      clearWishlist: () => {
        set({ wishlistProductIds: [], wishlistProducts: [] });
      },
    }),
    {
      name: 'sattva_wishlist_storage',
      partialize: (state) => ({
        wishlistProductIds: state.wishlistProductIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.wishlistProducts = getProductsForIds(state.wishlistProductIds || []);
        }
      },
    }
  )
);
