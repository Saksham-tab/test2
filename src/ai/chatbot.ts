import { brandConfig } from '../config/brand';
import { faqsData } from '../data/faqs';
import { ingredientsData } from '../data/ingredients';
import { productsData } from '../data/products';
import { ritualsData } from '../data/rituals';
import { ChatMessage } from '../types/ai';
import { assessInputSafety } from './safety';

export function processGroundedChatMessage(userText: string): ChatMessage {
  const normalized = userText.trim().toLowerCase();

  // 1. Safety check
  const safety = assessInputSafety(normalized);
  if (!safety.isSafeToRecommend) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: safety.cautionNotice || 'Please consult a healthcare professional for clinical advice.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // 2. Shipping / Returns / Policy questions
  if (normalized.includes('shipping') || normalized.includes('delivery') || normalized.includes('pincode') || normalized.includes('how long')) {
    const faq = faqsData.find((f) => f.question.toLowerCase().includes('quickly') || f.question.toLowerCase().includes('delivery'));
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: faq
        ? `${faq.answer} We offer free shipping across India on orders over ₹${brandConfig.shipping.freeThreshold}.`
        : `We offer complimentary express shipping on orders over ₹${brandConfig.shipping.freeThreshold}. Metro deliveries take 2–3 business days.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'view_product',
        payload: '/policies/shipping',
        label: 'View Shipping Policy',
      },
    };
  }

  if (normalized.includes('return') || normalized.includes('refund') || normalized.includes('exchange')) {
    const faq = faqsData.find((f) => f.category === 'Returns');
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: faq ? faq.answer : 'Unopened items in original packaging can be returned within 14 days of receipt by emailing care@sattvaandco.in.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // 3. Sleep / Night questions
  if (normalized.includes('sleep') || normalized.includes('night') || normalized.includes('insomnia') || normalized.includes('restless')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: 'For evening rest, we formulate with whole German chamomile, adaptogenic ashwagandha, and soothing temple oils. Here are our core evening essentials:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProductIds: ['prod-9', 'prod-8', 'prod-12'],
      suggestedAction: {
        type: 'view_ritual',
        payload: '/rituals/night-rest-reset',
        label: 'Explore Night Ritual',
      },
    };
  }

  // 4. Hair / Scalp questions
  if (normalized.includes('hair') || normalized.includes('scalp') || normalized.includes('dandruff') || normalized.includes('shedding')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: 'Our hair care philosophy focuses on follicle stimulation and maintaining a balanced scalp pH. Here are our foundational hair care formulations:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProductIds: ['prod-1', 'prod-2', 'prod-11'],
      suggestedAction: {
        type: 'filter_concern',
        payload: '/concerns/hair-fall',
        label: 'View Hair Fall Guide',
      },
    };
  }

  // 5. Skin / Face / Barrier questions
  if (normalized.includes('skin') || normalized.includes('face') || normalized.includes('barrier') || normalized.includes('dry') || normalized.includes('glow')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: 'For healthy skin barrier resilience, we rely on hand-harvested Kashmiri saffron, Gotu Kola (Centella), and plant ceramides. These provide deep moisture without heavy pore-clogging waxes:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProductIds: ['prod-4', 'prod-5', 'prod-13'],
      suggestedAction: {
        type: 'view_ritual',
        payload: '/rituals/radiant-skin-barrier',
        label: 'View Barrier Duo',
      },
    };
  }

  // 6. Ingredients lookup
  const matchedIngredient = ingredientsData.find(
    (ing) => normalized.includes(ing.slug) || normalized.includes(ing.name.toLowerCase())
  );
  if (matchedIngredient) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: `${matchedIngredient.name} (${matchedIngredient.botanicalName}): ${matchedIngredient.description} Featured in our catalog:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProductIds: matchedIngredient.featuredInProductIds.slice(0, 2),
      suggestedAction: {
        type: 'view_product',
        payload: `/ingredients/${matchedIngredient.slug}`,
        label: `Learn more about ${matchedIngredient.name}`,
      },
    };
  }

  // 7. Rituals lookup
  if (normalized.includes('ritual') || normalized.includes('routine')) {
    const firstRitual = ritualsData[0];
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: `We design multi-step botanical rituals that seamlessly integrate into modern daily schedules. Take our ${firstRitual.title}, which guides you through ${firstRitual.steps.length} intentional steps.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'view_ritual',
        payload: `/rituals/${firstRitual.slug}`,
        label: 'Explore Rituals',
      },
    };
  }

  // 8. Specific product search match
  const matchedProd = productsData.find(
    (p) => normalized.includes(p.slug) || normalized.includes(p.name.toLowerCase())
  );
  if (matchedProd) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: `${matchedProd.name} is a ${matchedProd.productType.toLowerCase()}. ${matchedProd.shortDescription}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProductIds: [matchedProd.id],
      suggestedAction: {
        type: 'view_product',
        payload: `/products/${matchedProd.slug}`,
        label: 'View Product Details',
      },
    };
  }

  // 9. Strict seed grounding fallback as requested in prompt:
  // "If not found: 'I don't have enough verified information to answer that accurately.'"
  return {
    id: `bot-${Date.now()}`,
    sender: 'assistant',
    text: "I don't have enough verified information to answer that accurately. You can explore our collections by concern, browse the ingredient library, or review our curated rituals.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedAction: {
      type: 'view_product',
      payload: '/shop',
      label: 'Browse Complete Collection',
    },
  };
}
