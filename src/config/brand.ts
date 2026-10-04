export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  descriptor: string;
  currency: string;
  currencyCode: string;
  locale: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  foundedYear: number;
  socials: {
    instagram: string;
    pinterest: string;
    youtube: string;
  };
  shipping: {
    freeThreshold: number;
    standardFee: number;
    expressFee: number;
  };
}

export const brandConfig: BrandConfig = {
  name: 'Sattva & Co.',
  shortName: 'Sattva',
  tagline: 'Modern wellness rituals rooted in nature and designed for everyday life.',
  descriptor: 'Consciously crafted botanical formulations for hair, scalp, skin, sleep, and holistic daily vitality.',
  currency: '₹',
  currencyCode: 'INR',
  locale: 'en-IN',
  supportEmail: 'care@sattvaandco.in',
  supportPhone: '+91 800 245 8899',
  supportHours: 'Mon – Sat, 9:00 AM – 6:00 PM IST',
  foundedYear: 2024,
  socials: {
    instagram: 'https://instagram.com/sattvaandco',
    pinterest: 'https://pinterest.com/sattvaandco',
    youtube: 'https://youtube.com/@sattvaandco',
  },
  shipping: {
    freeThreshold: 999,
    standardFee: 99,
    expressFee: 199,
  },
};
