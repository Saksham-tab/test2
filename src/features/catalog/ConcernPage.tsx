import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { concernsData } from '../../data/concerns';
import { productsData } from '../../data/products';
import { ritualsData } from '../../data/rituals';
import { faqsData } from '../../data/faqs';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/Button';
import { Link, useRouter } from '../../lib/router';

export const ConcernPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate } = useRouter();
  const concern = concernsData.find((c) => c.slug === slug);

  if (!concern) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#23201D]">Concern not found</h2>
        <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/shop')}>
          Browse All Concerns
        </Button>
      </div>
    );
  }

  const matchedProducts = productsData.filter((p) => p.concerns.includes(concern.slug) && p.active);
  const relatedRitual = ritualsData.find((r) => r.slug === concern.relatedRitualSlug) || ritualsData[0];
  const relatedFaqs = faqsData.slice(0, 3);
  const otherConcerns = concernsData.filter((c) => c.slug !== concern.slug).slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <div className="relative bg-[#23201D] text-[#FAF7F2] py-16 sm:py-20 overflow-hidden">
        <img
          src={concern.heroImage}
          alt={concern.name}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Concerns', href: '/shop' },
              { label: concern.name },
            ]}
          />
          <span className="text-xs uppercase tracking-widest text-[#D5CCC0] font-semibold block mt-4">
            Intentional Botanical Care
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#FAF7F2] mt-2">
            {concern.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#D5CCC0] mt-3 max-w-2xl leading-relaxed font-light">
            {concern.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Educational Lifestyle & Routine Advice */}
        <div className="p-6 sm:p-8 bg-[#F4EFEB] rounded-2xl border border-[#D5CCC0] space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase font-semibold text-[#A35843] tracking-wider">
            <Sparkles size={15} />
            <span>Foundational Lifestyle Guidance</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {concern.routineAdvice.map((tip, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex gap-3 items-start">
                <CheckCircle2 size={16} className="text-[#434D3D] shrink-0 mt-0.5" />
                <span className="text-xs text-[#23201D] leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Targeted Formulations */}
        <div>
          <div className="flex items-end justify-between pb-3 border-b border-[#E8E2D8] mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                Targeted Formulations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                Formulations for {concern.name}
              </h2>
            </div>
            <span className="text-xs text-[#8E8A83]">
              {matchedProducts.length} {matchedProducts.length === 1 ? 'solution' : 'solutions'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Related Ritual Spotlight */}
        {relatedRitual && (
          <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto">
                <img
                  src={relatedRitual.heroImage}
                  alt={relatedRitual.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                    Recommended Sequence
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#23201D] mt-1">
                    {relatedRitual.title}
                  </h3>
                  <p className="text-xs text-[#635F59] mt-2 leading-relaxed font-light">
                    {relatedRitual.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                  <span className="text-xs text-[#8E8A83]">
                    {relatedRitual.steps.length} Steps · {relatedRitual.durationMinutes} Minutes
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/rituals/${relatedRitual.slug}`)}
                    rightIcon={<ArrowRight size={13} />}
                  >
                    View Ritual Steps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        <div>
          <h3 className="font-serif text-2xl font-light text-[#23201D] mb-6 pb-2 border-b border-[#E8E2D8]">
            Frequently Addressed Questions
          </h3>
          <div className="space-y-4">
            {relatedFaqs.map((faq) => (
              <div key={faq.id} className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl">
                <h4 className="text-xs font-semibold text-[#23201D]">{faq.question}</h4>
                <p className="text-xs text-[#635F59] mt-1.5 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Concerns */}
        <div>
          <h3 className="font-serif text-xl font-light text-[#23201D] mb-4">
            Other Wellness Concerns
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherConcerns.map((c) => (
              <Link
                key={c.slug}
                href={`/concerns/${c.slug}`}
                className="p-4 bg-[#F4EFEB] rounded-xl border border-[#E8E2D8] hover:border-[#D5CCC0] text-center block transition-all"
              >
                <span className="text-xs font-medium text-[#23201D] block">{c.name}</span>
                <span className="text-[11px] text-[#8E8A83] mt-1 block">Explore &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
