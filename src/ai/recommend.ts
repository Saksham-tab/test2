import { productsData } from '../data/products';
import { AIRecommendationRequest, AIRecommendationResponse } from '../types/ai';
import { parseQueryIntent } from './intent';
import { retrieveScoredProducts } from './retrieval';
import { assessInputSafety } from './safety';
import { recommendationOutputSchema } from './schemas';

export function generateWellnessRecommendations(
  req: AIRecommendationRequest
): AIRecommendationResponse {
  const rawInput = `${req.query || ''} ${(req.concerns || []).join(' ')} ${req.skinOrHairType || ''}`;

  // 1. Safety assessment
  const safety = assessInputSafety(rawInput);
  if (!safety.isSafeToRecommend) {
    return {
      intent: 'Medical caution advisory triggered',
      identifiedConcerns: req.concerns || [],
      matchedProducts: [],
      disclaimer: 'Sattva & Co. wellness recommendations are strictly for cosmetic, lifestyle, and dietary educational purposes.',
      safetyCaution: safety.cautionNotice,
    };
  }

  // 2. Parse intent
  const parsedIntent = parseQueryIntent(req.query || '', req.concerns);

  // 3. Retrieve scored items from catalog
  const scoredItems = retrieveScoredProducts(parsedIntent, 3);

  // Fallback if no specific matches found
  const finalItems = scoredItems.length > 0 ? scoredItems : productsData.filter((p) => p.isBestSeller).slice(0, 3).map((p) => ({
    product: p,
    score: 1,
    matchedReasons: ['One of our most cherished everyday formulations'],
  }));

  // 4. Validate output with Zod
  const rawOutput = {
    intent: parsedIntent.rawQuery ? `Custom request: "${parsedIntent.rawQuery}"` : 'Concern-driven wellness alignment',
    concerns: parsedIntent.concerns,
    recommendations: finalItems.map((item) => ({
      productId: item.product.id,
      headline: item.product.productType,
      reasons: item.matchedReasons,
    })),
    disclaimer: 'These suggestions are grounded in traditional botanical wisdom and personal preference. They do not constitute medical diagnosis or treatment.',
  };

  const validation = recommendationOutputSchema.safeParse(rawOutput);
  if (!validation.success) {
    // Return safe fallback
    return {
      intent: 'General wellness recommendations',
      identifiedConcerns: [],
      matchedProducts: [],
      disclaimer: 'We could not complete your personalized recommendation right now. You can browse our collections instead.',
    };
  }

  // 5. Verify product IDs against catalog
  const catalogIds = new Set(productsData.map((p) => p.id));
  const verifiedMatches = finalItems
    .filter((item) => catalogIds.has(item.product.id))
    .map((item) => ({
      product: item.product,
      reason: {
        productId: item.product.id,
        matchScore: item.score,
        headline: item.product.productType,
        reasons: item.matchedReasons,
      },
    }));

  return {
    intent: validation.data.intent,
    identifiedConcerns: parsedIntent.concerns,
    matchedProducts: verifiedMatches,
    disclaimer: validation.data.disclaimer,
  };
}
