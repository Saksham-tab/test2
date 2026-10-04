import { ProductCategory, ProductConcern } from './product';

export interface CategoryInfo {
  slug: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  itemCount: number;
}

export interface ConcernInfo {
  slug: ProductConcern;
  name: string;
  shortDesc: string;
  description: string;
  heroImage: string;
  routineAdvice: string[];
  recommendedIngredients: string[];
  relatedRitualSlug?: string;
}

export interface RitualStep {
  stepNumber: number;
  name: string;
  action: string;
  timing: string;
  productId: string;
  tip: string;
}

export interface Ritual {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  durationMinutes: number;
  timeOfDay: 'Morning' | 'Evening' | 'Weekly' | 'Anytime';
  steps: RitualStep[];
  heroImage: string;
  productIds: string[];
  bundleDiscountPercent?: number;
}

export interface Ingredient {
  id: string;
  slug: string;
  name: string;
  botanicalName: string;
  origin: string;
  description: string;
  benefits: string[];
  historicalContext: string;
  featuredInProductIds: string[];
  imageUrl: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  contentParagraphs: string[];
  keyTakeaways: string[];
  relatedProductIds: string[];
  relatedConcerns: ProductConcern[];
}

export interface FAQItem {
  id: string;
  category: 'Orders & Shipping' | 'Formulations & Quality' | 'Safety & Ingestibles' | 'Rituals & Usage' | 'Returns';
  question: string;
  answer: string;
}
