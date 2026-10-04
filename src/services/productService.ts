import { productsData } from '../data/products';
import { Product, ProductCategory, ProductConcern } from '../types/product';

export interface ProductFilters {
  category?: ProductCategory;
  concern?: ProductConcern;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  format?: string;
}

export type ProductSortOption =
  | 'recommended'
  | 'bestselling'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'highest_rated';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: ProductCategory): Promise<Product[]>;
  getProductsByConcern(concern: ProductConcern): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
  getFilteredProducts(filters: ProductFilters, sort?: ProductSortOption): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
}

class MockProductService implements IProductService {
  private products: Product[] = [...productsData];

  async getAllProducts(): Promise<Product[]> {
    return this.products.filter((p) => p.active);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const found = this.products.find((p) => p.slug === slug && p.active);
    return found || null;
  }

  async getProductById(id: string): Promise<Product | null> {
    const found = this.products.find((p) => p.id === id && p.active);
    return found || null;
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return this.products.filter((p) => p.active && p.category === category);
  }

  async getProductsByConcern(concern: ProductConcern): Promise<Product[]> {
    return this.products.filter((p) => p.active && p.concerns.includes(concern));
  }

  async getBestSellers(limit = 4): Promise<Product[]> {
    return this.products
      .filter((p) => p.active && p.isBestSeller)
      .slice(0, limit);
  }

  async getNewArrivals(limit = 4): Promise<Product[]> {
    return this.products
      .filter((p) => p.active && p.isNewArrival)
      .slice(0, limit);
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    const target = this.products.find((p) => p.id === productId);
    if (!target) return this.products.slice(0, limit);

    return this.products
      .filter((p) => p.id !== productId && p.active)
      .map((p) => {
        let score = 0;
        if (p.category === target.category) score += 3;
        for (const c of p.concerns) {
          if (target.concerns.includes(c)) score += 2;
        }
        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)
      .slice(0, limit);
  }

  async getFilteredProducts(filters: ProductFilters, sort: ProductSortOption = 'recommended'): Promise<Product[]> {
    let list = this.products.filter((p) => p.active);

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters.concern) {
      list = list.filter((p) => p.concerns.includes(filters.concern!));
    }

    if (filters.productType) {
      list = list.filter((p) => p.productType.toLowerCase().includes(filters.productType!.toLowerCase()));
    }

    if (filters.format) {
      list = list.filter((p) => p.format.toLowerCase() === filters.format!.toLowerCase());
    }

    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      list = list.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters.inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    switch (sort) {
      case 'bestselling':
        list = [...list].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        list = [...list].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'price_asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'highest_rated':
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'recommended':
      default:
        list = [...list].sort((a, b) => (b.isBestSeller ? 2 : 0) + b.rating - ((a.isBestSeller ? 2 : 0) + a.rating));
        break;
    }

    return list;
  }

  async searchProducts(rawQuery: string): Promise<Product[]> {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return [];

    return this.products.filter((p) => {
      if (!p.active) return false;
      const inName = p.name.toLowerCase().includes(q);
      const inCategory = p.category.toLowerCase().includes(q);
      const inShortDesc = p.shortDescription.toLowerCase().includes(q);
      const inType = p.productType.toLowerCase().includes(q);
      const inConcerns = p.concerns.some((c) => c.toLowerCase().includes(q));
      const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
      const inIngredients = p.ingredients.some((i) => i.toLowerCase().includes(q));
      return inName || inCategory || inShortDesc || inType || inConcerns || inTags || inIngredients;
    });
  }
}

export const productService: IProductService = new MockProductService();
