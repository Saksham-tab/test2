import { Product, ProductConcern } from './product';

export interface AIRecommendationRequest {
  query?: string;
  concerns?: ProductConcern[];
  timeOfDay?: 'morning' | 'night' | 'both';
  preferredFormat?: string;
  skinOrHairType?: string;
}

export interface RecommendationReason {
  productId: string;
  matchScore: number;
  headline: string;
  reasons: string[];
}

export interface AIRecommendationResponse {
  intent: string;
  identifiedConcerns: ProductConcern[];
  matchedProducts: {
    product: Product;
    reason: RecommendationReason;
  }[];
  routineSuggestion?: {
    morning?: string[];
    evening?: string[];
  };
  disclaimer: string;
  safetyCaution?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'view_product' | 'view_ritual' | 'filter_concern';
    payload: string;
    label: string;
  };
  recommendedProductIds?: string[];
}
