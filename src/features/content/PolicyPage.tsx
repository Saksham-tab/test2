import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { brandConfig } from '../../config/brand';

export const PolicyPage: React.FC<{ policySlug: string }> = ({ policySlug }) => {
  const getPolicyContent = () => {
    switch (policySlug) {
      case 'shipping':
        return {
          title: 'Shipping & Delivery Policy',
          updated: 'March 2024',
          sections: [
            {
              heading: 'Domestic Delivery Timelines',
              body: 'All orders placed before 2:00 PM IST on business days are dispatched on the same day. Deliveries in tier-1 metro areas (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata) generally arrive in 2–3 business days. Regional and other locations take 4–6 business days.',
            },
            {
              heading: 'Delivery Charges & Free Shipping Threshold',
              body: `We offer complimentary express shipping on all domestic orders exceeding ₹${brandConfig.shipping.freeThreshold}. For orders below ₹${brandConfig.shipping.freeThreshold}, a flat fee of ₹${brandConfig.shipping.standardFee} is applied during checkout.`,
            },
            {
              heading: 'Packaging & Temperature Protection',
              body: 'All botanical oils, facial nectars, and whole flower teas are packaged in recyclable UV-protective amber glass or food-grade tins surrounded by biodegradable honeycomb kraft paper to prevent heat degradation during transit.',
            },
            {
              heading: 'Order Tracking',
              body: 'A real-time tracking link from our courier partners (Bluedart, Delhivery, or Xpressbees) is dispatched via SMS and email within 3 hours of package departure.',
            },
          ],
        };
      case 'returns':
        return {
          title: 'Returns & Exchange Policy',
          updated: 'March 2024',
          sections: [
            {
              heading: '14-Day Return Window for Unopened Items',
              body: 'We accept returns of unused, unopened items in original intact packaging within 14 days of receipt. Due to hygiene standards and botanical safety protocols, opened bottles, jars, or seals cannot be restocked.',
            },
            {
              heading: 'Damaged or Defective Bottles',
              body: 'If an item arrives damaged or broken during transit, email care@sattvaandco.in within 48 hours of delivery with a photo of the parcel. We will immediately dispatch a fresh replacement free of charge.',
            },
            {
              heading: 'Refund Process',
              body: 'Once received and verified at our Solan facility, refunds are initiated back to the original payment source within 3–5 business days.',
            },
          ],
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          updated: 'March 2024',
          sections: [
            {
              heading: 'Data Collection & Purpose',
              body: 'We collect minimal contact, delivery address, and order transaction details strictly to fulfill your purchases, provide shipping status updates, and provide personalized wellness suggestions.',
            },
            {
              heading: 'Zero Sale of Personal Data',
              body: 'We do not sell, rent, or trade your personal data to third-party data brokers. Payment information is securely encrypted by certified gateway partners and never stored on our servers.',
            },
            {
              heading: 'Cookies & Local Storage',
              body: 'We utilize localized browser storage solely to preserve your active cart items, wishlist, and recently viewed preparations between visits.',
            },
          ],
        };
      case 'terms':
      default:
        return {
          title: 'Terms of Service',
          updated: 'March 2024',
          sections: [
            {
              heading: 'General Terms of Sale',
              body: 'By placing an order on Sattva & Co., you agree to purchase items for personal, non-commercial use in accordance with applicable Indian laws and consumer regulations.',
            },
            {
              heading: 'Medical & Health Disclaimers',
              body: 'Our botanical products, teas, and topical oils are formulated for cosmetic and lifestyle wellness support. They do not constitute medical prescription, clinical diagnosis, or disease treatment. Always consult a licensed healthcare practitioner if pregnant or managing medical conditions.',
            },
            {
              heading: 'Product Pricing & Availability',
              body: 'All prices are listed in Indian Rupees (INR) and are inclusive of GST. We reserve the right to limit order quantities during seasonal harvests.',
            },
          ],
        };
    }
  };

  const policy = getPolicyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Policies', href: '/' },
          { label: policy.title },
        ]}
      />

      <div className="pb-4 border-b border-[#E8E2D8]">
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
          {policy.title}
        </h1>
        <span className="text-xs text-[#8E8A83] mt-1 block">
          Last revised: {policy.updated} · Sattva &amp; Co. Legal Circle
        </span>
      </div>

      <div className="space-y-8 text-xs text-[#23201D] leading-relaxed font-light">
        {policy.sections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-[#23201D]">
              {sec.heading}
            </h2>
            <p className="text-xs text-[#635F59] leading-relaxed">
              {sec.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
