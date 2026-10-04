import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ingredientsData } from '../../data/ingredients';
import { productsData } from '../../data/products';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { Link, useRouter } from '../../lib/router';
import { Button } from '../../components/ui/Button';

export const IngredientsPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const { navigate } = useRouter();

  // If specific ingredient slug requested
  if (slug) {
    const ingredient = ingredientsData.find((ing) => ing.slug === slug);

    if (!ingredient) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-2xl text-[#23201D]">Ingredient Not Found</h2>
          <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/ingredients')}>
            View Ingredient Library
          </Button>
        </div>
      );
    }

    const featuredProducts = productsData.filter((p) =>
      ingredient.featuredInProductIds.includes(p.id)
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
        <Breadcrumbs
          items={[
            { label: 'Ingredient Library', href: '/ingredients' },
            { label: ingredient.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-[#EBE3D8] border border-[#E8E2D8]">
            <img
              src={ingredient.imageUrl}
              alt={ingredient.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Botanical Monograph · Origin: {ingredient.origin}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
              {ingredient.name}
            </h1>
            <p className="text-sm italic text-[#635F59]">
              {ingredient.botanicalName}
            </p>
            <p className="text-xs sm:text-sm text-[#23201D] leading-relaxed font-light pt-2">
              {ingredient.description}
            </p>

            <div className="pt-4 space-y-2">
              <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider">
                Documented Botanical Actions
              </h3>
              <div className="space-y-1.5">
                {ingredient.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#23201D]">
                    <CheckCircle2 size={14} className="text-[#434D3D] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#F4EFEB] rounded-xl border border-[#E8E2D8] text-xs text-[#635F59] leading-relaxed mt-4">
              <strong className="text-[#23201D] block mb-1">Historical Lineage:</strong>
              {ingredient.historicalContext}
            </div>
          </div>
        </div>

        {/* Featured Formulations Containing this Ingredient */}
        {featuredProducts.length > 0 && (
          <div className="pt-8 border-t border-[#E8E2D8] space-y-6">
            <h2 className="font-serif text-2xl font-light text-[#23201D]">
              Formulations Featuring {ingredient.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Library Index View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Botanical Ingredient Library' }]} />

      <div className="mt-2 mb-10 pb-4 border-b border-[#E8E2D8]">
        <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
          Transparency &amp; Pharmacognosy
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D] mt-1">
          Our Botanical Monograph Library
        </h1>
        <p className="text-xs sm:text-sm text-[#635F59] mt-2 max-w-2xl leading-relaxed">
          Explore the bioactive plant extracts, unheated carrier seed oils, and adaptogens that comprise our formulations. Sourced directly from regenerative small-scale growers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredientsData.map((ing) => (
          <Link
            key={ing.slug}
            href={`/ingredients/${ing.slug}`}
            className="group flex flex-col bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#D5CCC0] rounded-xl overflow-hidden transition-all shadow-xs"
          >
            <div className="aspect-[16/10] bg-[#EBE3D8] overflow-hidden">
              <img
                src={ing.imageUrl}
                alt={ing.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-semibold block">
                  {ing.origin}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#23201D] group-hover:text-[#434D3D] mt-0.5">
                  {ing.name}
                </h3>
                <p className="text-[11px] italic text-[#8E8A83]">
                  {ing.botanicalName}
                </p>
                <p className="text-xs text-[#635F59] mt-2 line-clamp-2 leading-relaxed">
                  {ing.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs font-semibold text-[#A35843]">
                <span>Read Monograph</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
