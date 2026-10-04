import { reviewsData } from '../data/reviews';
import { Review } from '../types/review';

export interface IReviewService {
  getReviewsByProductId(productId: string): Promise<Review[]>;
  addReview(newReview: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'isDemoReview'>): Promise<Review>;
  markHelpful(reviewId: string): Promise<number>;
}

class MockReviewService implements IReviewService {
  private reviews: Review[] = [...reviewsData];

  async getReviewsByProductId(productId: string): Promise<Review[]> {
    return this.reviews.filter((r) => r.productId === productId);
  }

  async addReview(newReview: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'isDemoReview'>): Promise<Review> {
    const created: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      isDemoReview: false,
    };
    this.reviews.unshift(created);
    return created;
  }

  async markHelpful(reviewId: string): Promise<number> {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.helpfulCount += 1;
      return rev.helpfulCount;
    }
    return 0;
  }
}

export const reviewService: IReviewService = new MockReviewService();
