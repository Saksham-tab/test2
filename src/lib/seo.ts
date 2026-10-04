import { brandConfig } from '../config/brand';
import { Product } from '../types/product';

export function generateProductJsonLd(product: Product, url: string) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: brandConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: brandConfig.currencyCode,
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

export function generateBreadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandConfig.name,
    url: 'https://sattvaandco.in',
    logo: 'https://sattvaandco.in/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: brandConfig.supportPhone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      brandConfig.socials.instagram,
      brandConfig.socials.pinterest,
      brandConfig.socials.youtube,
    ],
  };
}
