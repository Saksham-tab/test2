import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productsData } from '../data/products';
import { Product } from '../types/product';

const getProductsForIds = (ids: string[]) => {
  const map = new Map(productsData.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter(Boolean) as Product[];
};

interface HistoryState {
  recentlyViewedIds: string[];
  recentlyViewedProducts: Product[];
  recentSearches: string[];
  recordView: (productId: string) => void;
  recordSearch: (query: string) => void;
  clearSearches: () => void;
  getRecentlyViewedProducts: () => Product[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      recentlyViewedIds: [],
      recentlyViewedProducts: [],
      recentSearches: ['rosemary', 'sleep tea', 'saffron serum', 'hair fall', 'ceramide'],

      recordView: (productId: string) => {
        const current = get().recentlyViewedIds;
        if (current[0] === productId) return; // already top item, no-op to prevent useless re-renders

        const filtered = current.filter((id) => id !== productId);
        const updatedIds = [productId, ...filtered].slice(0, 10);
        const recentlyViewedProducts = getProductsForIds(updatedIds);
        set({ recentlyViewedIds: updatedIds, recentlyViewedProducts });
      },

      recordSearch: (rawQuery: string) => {
        const q = rawQuery.trim();
        if (!q) return;
        const current = get().recentSearches;
        const filtered = current.filter((item) => item.toLowerCase() !== q.toLowerCase());
        set({ recentSearches: [q, ...filtered].slice(0, 8) });
      },

      clearSearches: () => {
        set({ recentSearches: [] });
      },

      getRecentlyViewedProducts: () => get().recentlyViewedProducts,
    }),
    {
      name: 'sattva_history_storage',
      partialize: (state) => ({
        recentlyViewedIds: state.recentlyViewedIds,
        recentSearches: state.recentSearches,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.recentlyViewedProducts = getProductsForIds(state.recentlyViewedIds || []);
        }
      },
    }
  )
);
