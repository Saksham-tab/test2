import React from 'react';
import { brandConfig } from '../../config/brand';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ShieldCheck, Eye, HeartHandshake, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useRouter } from '../../lib/router';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="pb-24 space-y-16">
      {/* Hero */}
      <div className="relative bg-[#23201D] text-[#FAF7F2] py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <Breadcrumbs items={[{ label: 'Our Origin & Philosophy' }]} />
          <span className="text-xs uppercase tracking-widest text-[#D5CCC0] font-semibold block pt-2">
            The Philosophy of Sattva
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#FAF7F2] leading-tight">
            Wellness, thoughtfully made for modern daily rhythm.
          </h1>
          <p className="text-xs sm:text-sm text-[#D5CCC0] max-w-xl mx-auto leading-relaxed font-light">
            Founded with a singular conviction: that ancient botanical traditions can be translated into minimalist, biochemically rigorous formulations without synthetic fillers or mystical hype.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Origin Story */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8E8A83]">
            Our Origins
          </span>
          <h2 className="font-serif text-3xl font-light text-[#23201D]">
            Where Tradition Meets Biochemistry
          </h2>
          <p className="text-sm text-[#23201D] leading-relaxed font-light">
            In Sanskrit, <em>Sattva</em> signifies equilibrium, lightness, and truth. In modern wellness, however, consumers frequently encounter two disappointing extremes: old-world decoctions burdened by heavy chemical preservatives, or sterile lab brands stripped of botanical soul.
          </p>
          <p className="text-sm text-[#23201D] leading-relaxed font-light">
            We operate our formulation laboratory in Solan, nestled within the sub-Himalayan valleys of Himachal Pradesh. Here, we cold-press unrefined seed oils, extract full-spectrum whole herbs, and formulate small batches that respect both human biology and ecological cycles.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl space-y-2">
            <Eye size={22} className="text-[#434D3D]" />
            <h3 className="font-serif text-lg font-medium text-[#23201D]">Radical Transparency</h3>
            <p className="text-xs text-[#635F59] leading-relaxed">
              We declare 100% of our INCI ingredients on every bottle. No generic &ldquo;herbal base&rdquo; or undisclosed synthetic fragrances.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl space-y-2">
            <ShieldCheck size={22} className="text-[#434D3D]" />
            <h3 className="font-serif text-lg font-medium text-[#23201D]">No Invented Claims</h3>
            <p className="text-xs text-[#635F59] leading-relaxed">
              We do not invent pseudo-clinical statistics or false certifications. Every claim is grounded in documented pharmacognosy monographs.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl space-y-2">
            <Sparkles size={22} className="text-[#434D3D]" />
            <h3 className="font-serif text-lg font-medium text-[#23201D]">Small-Batch Integrity</h3>
            <p className="text-xs text-[#635F59] leading-relaxed">
              Our extracts and oils cure in small demijohns for up to 21 days, ensuring delicate phytonutrients remain intact without scorching heat.
            </p>
          </div>

          <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl space-y-2">
            <HeartHandshake size={22} className="text-[#434D3D]" />
            <h3 className="font-serif text-lg font-medium text-[#23201D]">Ethical Sourcing</h3>
            <p className="text-xs text-[#635F59] leading-relaxed">
              We collaborate with small-scale regenerative agriculturalists across Kashmir, Rajasthan, and Tamil Nadu, ensuring fair harvest compensation.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-[#F4EFEB] rounded-2xl border border-[#D5CCC0] text-center space-y-4">
          <h3 className="font-serif text-2xl font-light text-[#23201D]">
            Begin Your Mindful Ritual
          </h3>
          <p className="text-xs text-[#635F59] max-w-md mx-auto">
            Experience the harmony of cold-pressed oils, clarifying cleansers, and calming botanical teas.
          </p>
          <div>
            <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
              Browse the Apothecary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
