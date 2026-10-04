import { JournalArticle } from '../types/content';

export const journalData: JournalArticle[] = [
  {
    id: 'post-1',
    slug: 'the-chronobiology-of-evening-tea',
    title: 'The Chronobiology of Evening Tea: Why Temperature & Terpenes Matter',
    excerpt: 'How warm infusions and gentle herbal terpenes signal the body’s circadian clock to lower core body temperature for restorative sleep.',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Dr. Shruti Sen',
      role: 'Head of Botanical Formulation',
    },
    publishedAt: '2024-03-01',
    readTime: '5 min read',
    category: 'Circadian Science',
    contentParagraphs: [
      'In an era dominated by high-intensity blue light screens and late-evening notifications, our evolutionary biological clocks rarely receive a clean transition from alertness to physiological rest.',
      'Sipping a warm, caffeine-free botanical brew performs a double action: the warm liquid triggers a peripheral vasodilation response in extremities, which subtly cools core internal body temperature—a recognized physiological trigger for natural melatonin secretion.',
      'Simultaneously, aromatic plant terpenes such as apigenin (from whole chamomile) and linalool (from wild lavender) bind to neurotransmitter pathways, quelling sympathetic nervous tone.',
      'By anchoring this practice into a fixed 15-minute daily ceremony without screens, you provide the autonomic nervous system with a dependable cue that daytime striving is officially complete.',
    ],
    keyTakeaways: [
      'Peripheral warmth induces core cooling, signaling sleep readiness',
      'Whole chamomile delivers apigenin directly to neuro-receptors',
      'Screen-free transitions compound in efficacy after 10 consecutive days',
    ],
    relatedProductIds: ['prod-9', 'prod-8', 'prod-12'],
    relatedConcerns: ['sleep-quality', 'stress'],
  },
  {
    id: 'post-2',
    slug: 'scalp-microbiome-and-oil-infusion',
    title: 'Demystifying the Scalp Microbiome: Why Cold-Pressed Botanicals Outperform Silicones',
    excerpt: 'The delicate ecosystem living at your roots dictates follicle resilience. Here is the biochemical argument for pure, unheated cold-pressed seed oils.',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Varun Kashyap',
      role: 'Biochemist & Ethnobotanist',
    },
    publishedAt: '2024-02-22',
    readTime: '6 min read',
    category: 'Hair Biology',
    contentParagraphs: [
      'For decades, mainstream hair care relied on synthetic silicones to coat damaged strands with immediate, artificial slip. While visually pleasing in the short term, synthetic polymers accumulate at follicular orifices, suffocating natural scalp respiration.',
      'The scalp is an extension of facial skin, possessing a dense concentration of sebaceous glands and microflora. Cold-pressed Golden Jojoba and Black Sesame Seed Oil share an almost identical lipid profile with human sebum.',
      'When infused with Rosemary Oleoresin and Bhringraj, these bio-compatible carriers transport active polyphenols directly into the follicular sheath without disrupting pH balance or clogging pores.',
      'The result is balanced cellular exfoliation, decreased microbial imbalances, and a resilient environment where strands can anchor with natural fortitude.',
    ],
    keyTakeaways: [
      'Jojoba wax esters mimic natural sebum for deep penetration',
      'Rosemary oleoresin stimulates micro-circulation without irritation',
      'Silicones create impermeable occlusive barriers that suffocate roots',
    ],
    relatedProductIds: ['prod-1', 'prod-2', 'prod-16'],
    relatedConcerns: ['hair-fall', 'dandruff'],
  },
  {
    id: 'post-3',
    slug: 'understanding-adaptogens-daily-stress',
    title: 'Understanding Adaptogens: The Science of Sustained Stamina',
    excerpt: 'Why adaptogenic herbs like Ashwagandha and Tulsi balance endocrine responses without the jittery highs and lows of caffeine.',
    coverImage: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
    author: {
      name: 'Dr. Shruti Sen',
      role: 'Head of Botanical Formulation',
    },
    publishedAt: '2024-02-14',
    readTime: '4 min read',
    category: 'Botanical Wisdom',
    contentParagraphs: [
      'Unlike central nervous system stimulants such as caffeine or refined sugar, which forcibly borrow energy from future cellular reserves, adaptogens exert a bidirectionally regulatory effect.',
      'Botanicals classified as adaptogens help the body adapt to biological and environmental stressors by moderating cortisol output from the adrenal glands.',
      'Standardized Withanolides from organically cultivated Ashwagandha support sustained resilience throughout challenging days, helping you maintain clear cognitive composure without agitation.',
    ],
    keyTakeaways: [
      'Adaptogens modulate the HPA axis rather than stimulating the heart',
      'Regular intake over 4–6 weeks yields compounding cellular stability',
      'Pairs synergistically with mindful morning hydration',
    ],
    relatedProductIds: ['prod-10', 'prod-15'],
    relatedConcerns: ['stress', 'energy', 'daily-wellness'],
  },
];
