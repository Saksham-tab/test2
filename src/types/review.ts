export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  skinOrHairType?: string;
  helpfulCount: number;
  isDemoReview: boolean;
}
