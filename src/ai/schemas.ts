import { z } from 'zod';

export const recommendationReasonSchema = z.object({
  productId: z.string(),
  headline: z.string(),
  reasons: z.array(z.string()).min(1),
});

export const recommendationOutputSchema = z.object({
  intent: z.string(),
  concerns: z.array(z.string()),
  recommendations: z.array(recommendationReasonSchema),
  disclaimer: z.string(),
  safetyCaution: z.string().optional(),
});

export type ValidatedRecommendationOutput = z.infer<typeof recommendationOutputSchema>;
