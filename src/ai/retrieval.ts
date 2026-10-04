import { productsData } from '../data/products';
import { Product } from '../types/product';
import { ParsedIntent } from './intent';

export interface ScoredProductMatch {
  product: Product;
  score: number;
  matchedReasons: string[];
}

export function retrieveScoredProducts(intent: ParsedIntent, limit = 3): ScoredProductMatch[] {
  const scored: ScoredProductMatch[] = [];

  for (const product of productsData) {
    if (!product.active || product.stock <= 0) continue;

    let score = 0;
    const reasons: string[] = [];

    // Match concerns
    for (const c of intent.concerns) {
      if (product.concerns.includes(c)) {
        score += 4;
        reasons.push(`Targeted formulation for ${c.replace('-', ' ')} support`);
      }
    }

    // Match Category domain
    if (intent.isHairFocused && (product.category === 'hair' || product.category === 'rituals')) {
      score += 3;
      if (!reasons.some((r) => r.includes('hair') || r.includes('scalp'))) {
        reasons.push('Rooted in traditional scalp and hair follicle nourishment');
      }
    }

    if (intent.isSkinFocused && (product.category === 'face' || product.category === 'skin')) {
      score += 3;
      reasons.push('Biocompatible plant lipids that support the dermal barrier');
    }

    if (intent.isSleepFocused && (product.category === 'sleep' || product.category === 'rituals')) {
      score += 4;
      reasons.push('Designed for restorative evening and circadian unwinding');
    }

    if (intent.isDigestionFocused && product.category === 'supplements') {
      score += 4;
      reasons.push('Balances digestive rhythm and nutrient assimilation');
    }

    // Routine timing match
    if (intent.timePreference === 'night' && product.whenToUse.toLowerCase().includes('evening')) {
      score += 2;
      reasons.push('Fits directly into your evening bedtime routine');
    } else if (intent.timePreference === 'morning' && product.whenToUse.toLowerCase().includes('morning')) {
      score += 2;
      reasons.push('Ideal for an uplifting morning awakening routine');
    }

    // Best sellers receive slight natural boost
    if (product.isBestSeller) {
      score += 1;
    }

    if (score > 0) {
      scored.push({
        product,
        score,
        matchedReasons: reasons.length > 0 ? reasons.slice(0, 3) : ['Grounded botanical formulation tailored to your profile'],
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
