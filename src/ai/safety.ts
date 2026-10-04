export interface SafetyAssessment {
  isSafeToRecommend: boolean;
  cautionNotice?: string;
  triggeredKeyword?: string;
}

const MEDICAL_KEYWORDS = [
  'pregnant',
  'pregnancy',
  'breastfeeding',
  'lactating',
  'cure cancer',
  'eczema bleeding',
  'psoriasis infected',
  'severe infection',
  'prescription drug',
  'stop medication',
  'chemotherapy',
  'thyroid medication',
  'blood thinner',
  'hypertension crisis',
  'chest pain',
  'burn third degree',
  'alopecia areata',
  'chronic illness',
  'diabetic shock',
  'autoimmune disease',
];

export function assessInputSafety(query: string): SafetyAssessment {
  const normalized = query.toLowerCase();

  for (const kw of MEDICAL_KEYWORDS) {
    if (normalized.includes(kw)) {
      return {
        isSafeToRecommend: false,
        triggeredKeyword: kw,
        cautionNotice:
          'Our botanical offerings and discovery guide are designed for general wellness support and are not intended to diagnose, treat, prescribe, or substitute professional medical advice. Because your inquiry references a clinical condition or prescription/pregnancy context, we strongly encourage speaking directly with a licensed physician or dermatologist before initiating any new product or herbal regimen.',
      };
    }
  }

  return {
    isSafeToRecommend: true,
  };
}
