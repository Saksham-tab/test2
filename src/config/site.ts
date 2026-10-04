import { CouponRule } from '../types/cart';

export const siteConfig = {
  announcements: [
    'Complimentary cold-pressed botanical mini with all orders above ₹1,499',
    'Free domestic express shipping on orders over ₹999 across India',
    'Rooted in certified herbal wisdom · Sustainably wildcrafted botanicals',
  ],
  coupons: [
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minSubtotal: 500,
      description: '10% off your first holistic order',
    },
    {
      code: 'RITUAL15',
      discountType: 'percentage',
      discountValue: 15,
      minSubtotal: 1800,
      description: '15% off curated ritual sets & orders above ₹1,800',
    },
    {
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 0,
      freeShipping: true,
      description: 'Free domestic express shipping with no minimum',
    },
    {
      code: 'SATTVA200',
      discountType: 'fixed',
      discountValue: 200,
      minSubtotal: 1200,
      description: '₹200 flat savings on orders above ₹1,200',
    },
  ] as CouponRule[],
  megaMenu: {
    categories: [
      { name: 'Hair & Scalp', slug: 'hair', desc: 'Root-nourishing oils, herbal cleansers & masks' },
      { name: 'Face & Skin', slug: 'face', desc: 'Barrier serums, cold-pressed oils & hydrators' },
      { name: 'Body Care', slug: 'body', desc: 'Botanical washes, herbal scrubs & bath soaks' },
      { name: 'Sleep & Rest', slug: 'sleep', desc: 'Infusions, pillow mists & calming adaptogens' },
      { name: 'Herbal Supplements', slug: 'supplements', desc: 'Ingestibles for vitality, stress & immunity' },
      { name: 'Ritual Bundles', slug: 'rituals', desc: 'Synergistic kits with mindful step guides' },
    ],
    concerns: [
      { name: 'Hair Fall & Density', slug: 'hair-fall', desc: 'Scalp stimulation & follicle nutrition' },
      { name: 'Scalp Flakes & Dandruff', slug: 'dandruff', desc: 'Clarifying botanicals with zero stripping' },
      { name: 'Dry Skin & Barrier Repair', slug: 'skin-barrier', desc: 'Plant ceramides & essential fatty acids' },
      { name: 'Sleep Quality & Night Stress', slug: 'sleep-quality', desc: 'Circadian balance & restorative calming' },
      { name: 'Digestion & Gut Comfort', slug: 'digestion', desc: 'Herbal triphala & metabolic harmony' },
      { name: 'Daily Vitality & Immunity', slug: 'daily-wellness', desc: 'Adaptogenic balance for daily stamina' },
    ],
    rituals: [
      { name: 'Morning Awakening Ritual', slug: 'morning-awakening', steps: 3, time: '10 mins' },
      { name: 'Night Rest & Reset Ritual', slug: 'night-rest-reset', steps: 4, time: '15 mins' },
      { name: 'Weekly Scalp Rejuvenation', slug: 'weekly-scalp-nourishment', steps: 3, time: '30 mins' },
      { name: 'Radiant Barrier Care', slug: 'radiant-skin-barrier', steps: 3, time: '8 mins' },
    ],
    featured: {
      title: 'The Sleep & Circadian Set',
      subtitle: 'Evening herbal infusion paired with calming temple oil',
      slug: 'night-ritual-bundle',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    },
  },
  footerLinks: {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'Best Sellers', href: '/shop?sort=bestselling' },
      { name: 'Rituals & Kits', href: '/shop?category=rituals' },
      { name: 'Sleep & Night Care', href: '/concerns/sleep-quality' },
      { name: 'Hair & Scalp Health', href: '/concerns/hair-fall' },
      { name: 'Herbal Supplements', href: '/categories/supplements' },
    ],
    discover: [
      { name: 'AI Wellness Guide', href: '/wellness-guide' },
      { name: 'Ingredient Library', href: '/ingredients' },
      { name: 'Curated Rituals', href: '/shop?category=rituals' },
      { name: 'The Journal', href: '/journal' },
      { name: 'Track Order', href: '/account/orders' },
    ],
    company: [
      { name: 'Our Philosophy & Origin', href: '/about' },
      { name: 'Help & FAQ', href: '/faq' },
      { name: 'Customer Care & Contact', href: '/contact' },
      { name: 'Shipping Policy', href: '/policies/shipping' },
      { name: 'Returns & Exchange', href: '/policies/returns' },
      { name: 'Privacy Policy', href: '/policies/privacy' },
      { name: 'Terms of Service', href: '/policies/terms' },
    ],
  },
};
