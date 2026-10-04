import React from 'react';
import { ArrowRight, Check, Clock, Sparkles } from 'lucide-react';
import { ritualsData } from '../../data/rituals';
import { productsData } from '../../data/products';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { Link, useRouter } from '../../lib/router';
import { useCartStore } from '../../store/useCartStore';

export const RitualDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate } = useRouter();
  const ritual = ritualsData.find((r) => r.slug === slug);
  const addItem = useCartStore((s) => s.addItem);

  if (!ritual) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#23201D]">Ritual not found</h2>
        <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/shop')}>
          Browse Rituals
        </Button>
      </div>
    );
  }

  // Resolve products for steps
  const stepProducts = ritual.steps.map((step) => ({
    step,
    product: productsData.find((p) => p.id === step.productId),
  }));

  const totalIndividualPrice = stepProducts.reduce(
    (acc, curr) => acc + (curr.product ? curr.product.price : 0),
    0
  );

  const discountRate = ritual.bundleDiscountPercent || 0;
  const bundleSavings = Math.round((totalIndividualPrice * discountRate) / 100);
  const bundlePrice = totalIndividualPrice - bundleSavings;

  const handleAddEntireRitual = () => {
    ritual.productIds.forEach((id) => {
      addItem(id, undefined, 1, false);
    });
    navigate('/cart');
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative bg-[#23201D] text-[#FAF7F2] py-16 sm:py-24 overflow-hidden">
        <img
          src={ritual.heroImage}
          alt={ritual.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Rituals', href: '/shop?category=rituals' },
              { label: ritual.title },
            ]}
          />
          <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-widest text-[#D5CCC0] font-semibold">
            <span>{ritual.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {ritual.durationMinutes} Minutes
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#FAF7F2] mt-2 max-w-3xl">
            {ritual.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#D5CCC0] mt-3 max-w-2xl leading-relaxed font-light">
            {ritual.subtitle}. {ritual.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="clay"
              size="lg"
              onClick={handleAddEntireRitual}
              rightIcon={<ArrowRight size={14} />}
            >
              Add Entire Ritual ({formatPrice(bundlePrice)})
            </Button>
            {discountRate > 0 && (
              <span className="text-xs text-[#FAF7F2]/80">
                Includes {discountRate}% bundle savings vs purchasing separately
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Numbered Steps Sequence */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
            Step-by-Step Ceremony
          </span>
          <h2 className="font-serif text-3xl font-light text-[#23201D] mt-1">
            How to Perform the Ritual
          </h2>
          <p className="text-xs text-[#635F59] mt-2">
            Allow yourself this unhurried window. Approach each step with gentle awareness and breath.
          </p>
        </div>

        <div className="space-y-8">
          {stepProducts.map(({ step, product }) => (
            <div
              key={step.stepNumber}
              className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#D5CCC0] shadow-xs flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Step Badge */}
              <div className="w-10 h-10 rounded-full bg-[#434D3D] text-[#FAF7F2] text-sm font-semibold flex items-center justify-center shrink-0">
                0{step.stepNumber}
              </div>

              {/* Step info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-serif text-xl font-medium text-[#23201D]">
                    {step.name}
                  </h3>
                  <span className="text-xs text-[#8E8A83] font-medium bg-[#F4EFEB] px-2.5 py-0.5 rounded-full border border-[#E8E2D8]">
                    {step.timing}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#23201D] leading-relaxed">
                  {step.action}
                </p>

                <div className="p-3 bg-[#EBF0E8] rounded-lg text-xs text-[#34462E] flex items-start gap-2">
                  <Sparkles size={14} className="shrink-0 mt-0.5 text-[#434D3D]" />
                  <span>
                    <strong>Mindful Practitioner Tip: </strong>
                    {step.tip}
                  </span>
                </div>

                {/* Paired Product Card snippet */}
                {product && (
                  <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-14 rounded-md object-cover bg-[#EBE3D8] shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-xs font-semibold text-[#23201D] hover:underline truncate block"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] text-[#635F59]">
                          {formatPrice(product.price)} · {product.size}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addItem(product.id, undefined, 1, true)}
                    >
                      + Add Step
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Box: Add Complete Ritual */}
        <div className="p-8 bg-[#F4EFEB] rounded-2xl border border-[#D5CCC0] text-center space-y-4">
          <h3 className="font-serif text-2xl font-light text-[#23201D]">
            Embrace the Complete {ritual.title}
          </h3>
          <p className="text-xs text-[#635F59] max-w-md mx-auto leading-relaxed">
            All formulations in this ritual are calibrated to harmonize together. Includes the printed step ritual card.
          </p>
          <div className="font-serif text-2xl font-semibold text-[#23201D]">
            {formatPrice(bundlePrice)}{' '}
            {discountRate > 0 && (
              <span className="text-xs text-[#8E8A83] font-sans font-normal line-through">
                {formatPrice(totalIndividualPrice)}
              </span>
            )}
          </div>
          <div>
            <Button variant="clay" size="lg" onClick={handleAddEntireRitual}>
              Add Entire Ritual to Basket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
