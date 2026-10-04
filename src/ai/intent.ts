import { ProductConcern, RoutineStep } from '../types/product';

export interface ParsedIntent {
  rawQuery: string;
  concerns: ProductConcern[];
  timePreference?: 'morning' | 'night' | 'weekly';
  desiredRoutine?: RoutineStep;
  formatPreference?: string;
  isHairFocused: boolean;
  isSkinFocused: boolean;
  isSleepFocused: boolean;
  isDigestionFocused: boolean;
  isBodyFocused: boolean;
}

const CONCERN_SYNONYMS: Record<ProductConcern, string[]> = {
  'hair-fall': ['hair fall', 'shedding', 'thinning', 'breakage', 'hair loss', 'bald', 'roots', 'follicle', 'scalp oil'],
  'dandruff': ['dandruff', 'flakes', 'itchy scalp', 'flaking', 'scalp buildup', 'greasy scalp', 'clarifying'],
  'dry-skin': ['dry skin', 'flaky', 'dehydrated', 'tightness', 'parched', 'rough texture', 'winter skin'],
  'skin-barrier': ['barrier', 'redness', 'burning', 'irritated', 'sensitized', 'reactive', 'glow', 'saffron', 'centella'],
  'sleep-quality': ['sleep', 'insomnia', 'night routine', 'restless', 'unwind', 'bedtime', 'circadian', 'calm evening', 'tea'],
  'stress': ['stress', 'anxiety', 'overwhelmed', 'fatigue', 'mental load', 'calm', 'adaptogen', 'ashwagandha'],
  'digestion': ['digestion', 'bloating', 'gut', 'triphala', 'constipation', 'heavy stomach', 'metabolism'],
  'energy': ['energy', 'stamina', 'tired', 'sluggish', 'vitality', 'endurance'],
  'immunity': ['immunity', 'amla', 'defense', 'vitamin c', 'resilience'],
  'daily-wellness': ['daily wellness', 'routine', 'general wellness', 'overall health', 'ritual'],
};

export function parseQueryIntent(query: string, explicitConcerns?: ProductConcern[]): ParsedIntent {
  const q = query.toLowerCase();
  const detectedConcerns: Set<ProductConcern> = new Set(explicitConcerns || []);

  for (const [concern, synonyms] of Object.entries(CONCERN_SYNONYMS)) {
    for (const syn of synonyms) {
      if (q.includes(syn)) {
        detectedConcerns.add(concern as ProductConcern);
        break;
      }
    }
  }

  let timePreference: 'morning' | 'night' | 'weekly' | undefined;
  if (q.includes('night') || q.includes('bedtime') || q.includes('evening') || q.includes('sleep')) {
    timePreference = 'night';
  } else if (q.includes('morning') || q.includes('wake') || q.includes('daytime') || q.includes('am')) {
    timePreference = 'morning';
  } else if (q.includes('week') || q.includes('sunday')) {
    timePreference = 'weekly';
  }

  return {
    rawQuery: query,
    concerns: Array.from(detectedConcerns),
    timePreference,
    isHairFocused: q.includes('hair') || q.includes('scalp') || detectedConcerns.has('hair-fall') || detectedConcerns.has('dandruff'),
    isSkinFocused: q.includes('skin') || q.includes('face') || q.includes('barrier') || q.includes('glow'),
    isSleepFocused: q.includes('sleep') || q.includes('night') || q.includes('tea') || detectedConcerns.has('sleep-quality'),
    isDigestionFocused: q.includes('gut') || q.includes('digest') || q.includes('triphala'),
    isBodyFocused: q.includes('body') || q.includes('bath') || q.includes('scrub') || q.includes('shower'),
  };
}
