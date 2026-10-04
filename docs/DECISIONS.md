# Architectural and Design Decisions — Sattva & Co.

This document records the foundational product design, architectural, and UX decisions made for the Sattva & Co. premium wellness e-commerce platform.

## 1. Brand Identity & Copy Tone
- **Brand Name**: Sattva & Co.
- **Tagline**: Modern botanical wellness rooted in nature and designed for everyday life.
- **Currency & Locale**: INR (`₹`), en-IN locale format with formatted lakh/thousand separators.
- **Tone**: Editorial, grounded, transparent, scientific yet warm. Free of pseudo-clinical hype, clichéd mysticism, or unsubstantiated medical claims.

## 2. Technical Stack & State Isolation
- **Frontend Framework**: Vite + React 19 + TypeScript with App-Router-style deep-link client routing (`/`, `/shop`, `/products/:slug`, `/categories/:slug`, `/concerns/:slug`, `/rituals/:slug`, `/wellness-guide`, `/ingredients/:slug`, `/journal/:slug`, `/cart`, `/checkout`, `/order-confirmation`, `/wishlist`, `/account`, `/about`, `/contact`, `/faq`, `/policies/:slug`).
- **State Layer**: Zustand with `persist` middleware for Cart, Wishlist, Recently Viewed, Placed Orders, and UI settings.
- **Price Integrity Principle**: Cart stores only `{ productId, variantId, quantity }`. All prices, discounts, subtotal, and shipping calculations are dynamically re-derived from catalog seed data via `lib/pricing.ts`. Prices stored in localStorage are never trusted.
- **Service Layer Abstraction**: UI components interface with typed contracts (`ProductService`, `CartService`, `RecommendationService`, `ChatService`, `ReviewService`, `PaymentService`). Mock implementations read seed data and simulate network latencies, so a headless CMS or backend can be swapped in without modifying UI components.

## 3. Design System & Anti-Slop Discipline
- **Zero Pill Metatag Clutter**: Categories, tags, publication dates, and routine steps are rendered as clean, unboxed editorial typography with subtle separators (`·` or `—`), strictly avoiding candy badge pills.
- **Interactive Segmented Controls**: Filters and tabs are designed as tactile segmented buttons with distinct active states rather than decorative pills.
- **Palette**: Warm ivory (`#FAF7F2`), cream surface (`#FFFFFF`), sand tones (`#EBE3D8`), muted olive (`#434D3D`, `#5B6853`), deep terracotta clay (`#A35843`), and charcoal text (`#23201D`). WCAG AA compliant.
- **Typography**: Cormorant Garamond for display headlines; Plus Jakarta Sans for UI, prices, navigation, and body copy.

## 4. AI & Regulatory Safety Layer
- **Deterministic Product Discovery**: The Wellness Guide and interactive Chatbot run on an intent-parsing, concern-matching, and safety-checking heuristic engine grounded strictly in seed data.
- **Strict Medical Boundary**: The safety guard detects high-risk keywords (pregnancy, severe pain, chronic prescription drugs, clinical cures) and explicitly advises consultation with a licensed healthcare practitioner, refusing to generate medical prescriptions or drug dosages.
- **Regulatory Disclaimers**: Ingestibles feature clear labels, storage guidelines, batch info, and standard dietary supplement disclaimers.

## 5. Shipping & Payment Mocks
- **Free Shipping Threshold**: Free domestic delivery on orders over ₹999; flat ₹99 for orders below ₹999.
- **Checkout Flows**: Multi-step checkout supporting Indian pincode delivery estimation (Zone 1: Metro 2-3 days, Zone 2: Rest of India 4-6 days), Cash on Delivery (COD), UPI QR/ID, and Card mock gateways with clean error handling and order confirmation.
