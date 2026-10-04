import { generateWellnessRecommendations } from '../ai/recommend';
import { AIRecommendationRequest, AIRecommendationResponse } from '../types/ai';

export interface IRecommendationService {
  getRecommendations(req: AIRecommendationRequest): Promise<AIRecommendationResponse>;
}

class MockRecommendationService implements IRecommendationService {
  async getRecommendations(req: AIRecommendationRequest): Promise<AIRecommendationResponse> {
    // Simulate brief network latency for realistic feel
    await new Promise((res) => setTimeout(res, 600));
    return generateWellnessRecommendations(req);
  }
}

export const recommendationService: IRecommendationService = new MockRecommendationService();
