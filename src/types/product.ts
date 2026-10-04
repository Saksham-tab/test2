export type ProductCategory =
  | 'hair'
  | 'scalp'
  | 'skin'
  | 'face'
  | 'body'
  | 'sleep'
  | 'wellness'
  | 'supplements'
  | 'rituals';

export type ProductConcern =
  | 'hair-fall'
  | 'dandruff'
  | 'dry-skin'
  | 'skin-barrier'
  | 'sleep-quality'
  | 'stress'
  | 'digestion'
  | 'energy'
  | 'immunity'
  | 'daily-wellness';

export type RoutineStep = 'cleanse' | 'apply' | 'nourish' | 'support' | 'complete';

export interface ProductVariant {
  id: string;
  name: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
}

export interface KeyIngredientItem {
  name: string;
  slug: string;
  purpose: string;
  percentage?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  productType: string; // e.g. "Scalp Treatment Oil", "Restorative Night Cream"
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  benefits: string[];
  concerns: ProductConcern[];
  routines: RoutineStep[];
  tags: string[];
  ingredients: string[]; // full INCI ingredient list
  keyIngredients: KeyIngredientItem[];
  howToUse: string;
  whenToUse: string; // e.g. "Morning & Evening after cleansing"
  size: string; // e.g. "50 ml / 1.7 fl. oz."
  format: string; // "Oil", "Cream", "Infusion Tea", "Vegetarian Capsule", "Serum"
  variants?: ProductVariant[];
  stock: number;
  active: boolean;
  warnings?: string;
  disclaimers?: string;
  intendedUse?: string;
  regulatoryClassification?: string; // e.g. "Ayurvedic Proprietary Medicine", "Cosmetic Formulation"
  licenseType?: string;
  licenseNumber?: string;
  manufacturer?: string;
  storageInstructions?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}
