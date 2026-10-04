import React, { useState, useEffect } from 'react';
import { Sparkles, Check, AlertTriangle, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { useRouter } from '../../lib/router';
import { concernsData } from '../../data/concerns';
import { ProductConcern } from '../../types/product';
import { AIRecommendationResponse } from '../../types/ai';
import { recommendationService } from '../../services/recommendationService';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { PriceTag } from '../../components/ui/PriceTag';
import { RatingStars } from '../../components/ui/RatingStars';
import { useCartStore } from '../../store/useCartStore';
import { analytics } from '../../lib/analytics';

const QUICK_CHIPS: { label: string; concern: ProductConcern }[] = [
  { label: 'Hair Fall & Density', concern: 'hair-fall' },
  { label: 'Scalp Flakes & Balance', concern: 'dandruff' },
  { label: 'Dry Skin & Barrier', concern: 'skin-barrier' },
  { label: 'Deep Restful Sleep', concern: 'sleep-quality' },
  { label: 'Daily Stress & Calm', concern: 'stress' },
  { label: 'Digestion Harmony', concern: 'digestion' },
  { label: 'Daily Vitality', concern: 'daily-wellness' },
];

export const WellnessGuidePage: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const initialQuery = queryParams.get('query') || '';

  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedConcerns, setSelectedConcerns] = useState<ProductConcern[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'night' | 'both'>('both');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationResponse | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    analytics.track('ai_guide_opened');
    if (initialQuery) {
      handleGetRecommendations(initialQuery, []);
    }
  }, [initialQuery]);

  const toggleConcern = (c: ProductConcern) => {
    if (selectedConcerns.includes(c)) {
      setSelectedConcerns(selectedConcerns.filter((item) => item !== c));
    } else {
      setSelectedConcerns([...selectedConcerns, c]);
    }
  };

  const handleGetRecommendations = async (overrideQuery?: string, overrideConcerns?: ProductConcern[]) => {
    const q = overrideQuery !== undefined ? overrideQuery : queryText;
    const concerns = overrideConcerns !== undefined ? overrideConcerns : selectedConcerns;

    setIsLoading(true);
    setResult(null);

    try {
      const resp = await recommendationService.getRecommendations({
        query: q,
        concerns,
        timeOfDay,
      });
      setResult(resp);
      analytics.track('ai_recommendation_generated', {
        concernsCount: concerns.length,
        hasQuery: Boolean(q.trim()),
        resultsCount: resp.matchedProducts.length,
      });
    } catch {
      setResult({
        intent: 'General inquiry',
        identifiedConcerns: [],
        matchedProducts: [],
        disclaimer: "We couldn't complete your personalized recommendation right now. You can browse our collections instead.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQueryText('');
    setSelectedConcerns([]);
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Personalized Wellness Guide' }]} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto my-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase font-semibold text-[#A35843] tracking-widest bg-[#F7EDE9] px-3 py-1 rounded-full border border-[#F2C5BD]">
          <Sparkles size={14} />
          <span>Grounded Product Discovery Assistant</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#23201D]">
          Find your botanical alignment.
        </h1>
        <p className="text-xs sm:text-sm text-[#635F59] font-light leading-relaxed">
          Select the wellness goals you want to prioritize or describe how you feel in your own words. We pair your needs directly with small-batch formulations grounded in verified botanical monographs.
        </p>
      </div>

      {/* Interactive Questionnaire Section */}
      <div className="p-6 sm:p-8 bg-[#F4EFEB] rounded-2xl border border-[#D5CCC0] space-y-6">
        {/* Concern Chips */}
        <div>
          <label className="block text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-2.5">
            1. Select Your Primary Goals
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => {
              const isSelected = selectedConcerns.includes(chip.concern);
              return (
                <button
                  key={chip.concern}
                  type="button"
                  onClick={() => toggleConcern(chip.concern)}
                  className={`text-xs py-2 px-3.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#434D3D] text-[#FAF7F2] border-[#434D3D] font-medium shadow-xs'
                      : 'bg-[#FAF7F2] text-[#23201D] border-[#D5CCC0] hover:bg-[#EBE3D8]'
                  }`}
                >
                  {isSelected && <span className="mr-1.5">✓</span>}
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Free text query */}
        <div>
          <label className="block text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-2.5">
            2. Or Describe What You Are Experiencing (Optional)
          </label>
          <textarea
            rows={3}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="e.g. My scalp feels tight after swimming, and my hair sheds when brushing... or looking for an evening unwind without melatonin."
            className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-lg p-3.5 text-xs text-[#23201D] placeholder:text-[#8E8A83] focus:outline-none focus:border-[#434D3D] leading-relaxed resize-none"
          />
        </div>

        {/* Time of day preference */}
        <div>
          <label className="block text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-2.5">
            3. Routine Timing Focus
          </label>
          <div className="flex gap-2">
            {(['morning', 'night', 'both'] as const).map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimeOfDay(time)}
                className={`flex-1 py-2 text-xs uppercase tracking-wider rounded-md border text-center transition-all ${
                  timeOfDay === time
                    ? 'bg-[#434D3D] text-[#FAF7F2] border-[#434D3D] font-medium'
                    : 'bg-[#FAF7F2] text-[#635F59] border-[#D5CCC0] hover:bg-[#EBE3D8]'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <Button
            variant="clay"
            size="lg"
            isLoading={isLoading}
            onClick={() => handleGetRecommendations()}
            rightIcon={<ArrowRight size={14} />}
          >
            Get My Recommendations
          </Button>

          {(selectedConcerns.length > 0 || queryText.trim()) && (
            <button
              onClick={handleReset}
              className="text-xs text-[#8E8A83] hover:text-[#23201D] flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-12 space-y-6">
          <div className="h-6 w-48 bg-[#EAE2D5] rounded-md animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-[#F4EFEB] rounded-xl border border-[#E8E2D8] space-y-3 animate-pulse">
                <div className="aspect-[4/3] bg-[#EAE2D5] rounded-md" />
                <div className="h-4 w-3/4 bg-[#EAE2D5] rounded" />
                <div className="h-3 w-1/2 bg-[#EAE2D5] rounded" />
                <div className="h-12 w-full bg-[#EAE2D5] rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results View */}
      {result && !isLoading && (
        <div className="mt-12 space-y-8 animate-in fade-in duration-300">
          {/* Safety Caution Notice if high-risk medical words detected */}
          {result.safetyCaution ? (
            <div className="p-6 bg-[#FDF4F2] border border-[#F2C5BD] rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-[#8D4733] font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle size={16} />
                <span>Clinical Precaution Advisory</span>
              </div>
              <p className="text-xs text-[#8D4733] leading-relaxed">
                {result.safetyCaution}
              </p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/shop')}>
                Browse General Collections
              </Button>
            </div>
          ) : result.matchedProducts.length > 0 ? (
            <>
              {/* Intent Header */}
              <div className="pb-3 border-b border-[#E8E2D8] flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                    Personalized Alignment
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                    Your Tailored Formulations
                  </h2>
                </div>
                <span className="text-xs text-[#434D3D] font-medium bg-[#EBF0E8] px-2.5 py-1 rounded-full">
                  {result.matchedProducts.length} Verified Recommendations
                </span>
              </div>

              {/* Cards with "Why this may fit you" checkmarks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.matchedProducts.map(({ product, reason }) => (
                  <div
                    key={product.id}
                    className="p-5 bg-[#FAF7F2] rounded-xl border border-[#D5CCC0] flex flex-col justify-between shadow-xs hover:border-[#434D3D] transition-colors"
                  >
                    <div>
                      {/* Product image */}
                      <div
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="aspect-[4/3] rounded-lg overflow-hidden bg-[#EBE3D8] mb-3 cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-semibold">
                        {product.category} · {reason.headline}
                      </span>
                      <h3
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="font-serif text-lg font-medium text-[#23201D] hover:text-[#434D3D] cursor-pointer mt-0.5 line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <div className="mt-1">
                        <PriceTag price={product.price} size="sm" />
                      </div>

                      {/* "Why this may fit you" section */}
                      <div className="mt-4 pt-3 border-t border-[#E8E2D8] space-y-1.5">
                        <span className="text-[11px] font-semibold text-[#434D3D] block">
                          Why this may fit you:
                        </span>
                        {reason.reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#635F59]">
                            <Check size={13} className="text-[#434D3D] shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add to Basket Action */}
                    <div className="mt-5 pt-3 border-t border-[#E8E2D8]/60 grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/products/${product.slug}`)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="clay"
                        size="sm"
                        onClick={() => {
                          addItem(product.id, undefined, 1, true);
                          analytics.track('ai_recommendation_clicked', { productId: product.id });
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-[#F4EFEB] rounded-xl text-[11px] text-[#635F59] leading-relaxed border border-[#E8E2D8]">
                <strong>Notice: </strong>
                {result.disclaimer}
              </div>
            </>
          ) : (
            /* Empty or Failure State */
            <div className="text-center py-16 bg-[#F4EFEB] rounded-xl border border-dashed border-[#D5CCC0] p-6">
              <h3 className="font-serif text-xl text-[#23201D]">
                We couldn&apos;t complete your personalized recommendation right now.
              </h3>
              <p className="text-xs text-[#635F59] mt-2 max-w-sm mx-auto leading-relaxed">
                You can browse our collections instead, explore by specific concern, or speak with our live interactive chatbot.
              </p>
              <div className="mt-6">
                <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
                  Browse Shop
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
