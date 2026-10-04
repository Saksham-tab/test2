# Sattva & Co. — Modern Botanical Wellness & Daily Rituals

A production-grade, original, premium wellness e-commerce application frontend built with **React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Zod**.

## Brand Vision & Ethos
Sattva & Co. crafts small-batch formulations for hair, scalp, skin, sleep, and holistic daily vitality. Rooted in traditional botanical wisdom and verified pharmacognosy monographs, free from synthetic fillers and invented claims.

---

## Architecture & Principles
1. **Catalog-Derived Price Integrity**: Cart storage in `localStorage` strictly contains item references (`{ productId, variantId, quantity }`). All prices, subtotals, shipping thresholds, and discounts are dynamically calculated via `src/lib/pricing.ts` from verified catalog data.
2. **Service Layer Abstraction**: Every domain (Products, Cart, Reviews, Payment, AI Recommendations, Chatbot) interfaces through typed contracts (`src/services/`). A headless backend or CMS can be plugged in without changing UI components.
3. **Deterministic AI Wellness Assistant**:
   - Heuristic intent and concern matcher grounded strictly in seed catalog data.
   - Built-in medical safety barrier (`src/ai/safety.ts`) detecting high-risk clinical keywords and returning professional healthcare cautions.
   - Grounded interactive Chatbot with seed-only answers and quick prompt suggestions.
4. **Anti-Slop Design Discipline**:
   - Warm editorial palette (`#FAF7F2` ivory, cream, muted olive, terracotta clay, deep charcoal text).
   - Cormorant Garamond serif paired with clean Plus Jakarta Sans.
   - Zero pill clutter: metadata is rendered with unboxed typographic separators (`·` or `/`).

---

## Setup & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```

## Running on Replit or Cloud Run
The dev server and preview environment bind to `0.0.0.0` and respect standard port configurations (Port 3000).
