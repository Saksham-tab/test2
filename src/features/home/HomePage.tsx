import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';
import { productsData } from '../../data/products';
import { concernsData } from '../../data/concerns';
import { categoriesData } from '../../data/categories';
import { ritualsData } from '../../data/rituals';
import { ingredientsData } from '../../data/ingredients';
import { reviewsData } from '../../data/reviews';
import { journalData } from '../../data/journal';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [guideInput, setGuideInput] = useState('');
  const addItem = useCartStore((s) => s.addItem);

  const bestSellers = productsData.filter((p) => p.isBestSeller);
  const featuredRitual = ritualsData[0]; // Weekly Scalp & Follicle Rejuvenation
  const featuredStoryProduct = productsData.find((p) => p.slug === 'daily-glow-barrier-serum') || productsData[3];
  const spotlightIngredients = ingredientsData.slice(0, 4);
  const recentArticles = journalData.slice(0, 3);
  const demoReviews = reviewsData.slice(0, 3);

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideInput.trim()) {
      navigate('/wellness-guide');
      return;
    }
    navigate(`/wellness-guide?query=${encodeURIComponent(guideInput.trim())}`);
  };

  const handleChipClick = (chipText: string) => {
    navigate(`/wellness-guide?query=${encodeURIComponent(chipText)}`);
  };

  const handleAddEntireRitual = () => {
    featuredRitual.productIds.forEach((id) => {
      addItem(id, undefined, 1, false);
    });
    navigate('/cart');
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 3. Hero Section: Asymmetrical Editorial Layout */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Rooted in Nature · Designed for Life
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#23201D] leading-[1.1]">
              Wellness, thoughtfully made.
            </h1>
            <p className="text-sm sm:text-base text-[#635F59] max-w-lg leading-relaxed font-light">
              Modern botanical rituals rooted in plant biochemistry and designed for everyday life. Thoughtfully formulated hair, scalp, skin, sleep, and restorative daily essentials.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/shop')}
                rightIcon={<ArrowRight size={14} />}
              >
                Shop Formulations
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/wellness-guide')}
                leftIcon={<Sparkles size={14} className="text-[#A35843]" />}
              >
                Find What Fits Me
              </Button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#8E8A83] border-t border-[#E8E2D8]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#434D3D]" />
                100% Vegetarian
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#434D3D]" />
                Zero Harsh Synthetics
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#434D3D]" />
                Small-Batch Infused
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative grid grid-cols-12 gap-3 sm:gap-4">
              <div className="col-span-8 aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Evening botanical calming ritual"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-4 flex flex-col gap-3 sm:gap-4">
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1608248597359-00109968a35d?auto=format&fit=crop&w=600&q=80"
                    alt="Botanical Scalp Treatment Oil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[1/1] rounded-xl overflow-hidden bg-[#EBE3D8] p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-semibold">
                    Small-Batch
                  </span>
                  <p className="font-serif text-sm font-medium text-[#23201D] leading-snug">
                    Slow-infused botanicals over 21 sunrise cycles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop by Need: "What are you looking for today?" 8 large visual tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E8E2D8]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Intentional Care
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
              What are you looking for today?
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#434D3D] hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            <span>View All Collections</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {concernsData.slice(0, 8).map((concern) => (
            <Link
              key={concern.slug}
              href={`/concerns/${concern.slug}`}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-[#EBE3D8] shadow-xs flex flex-col justify-end p-4 transition-transform hover:-translate-y-0.5"
            >
              <img
                src={concern.heroImage}
                alt={concern.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="relative z-10 text-[#FAF7F2]">
                <h3 className="font-serif text-lg sm:text-xl font-medium leading-snug">
                  {concern.name}
                </h3>
                <p className="text-[11px] text-[#FAF7F2]/80 mt-1 line-clamp-1 font-light">
                  {concern.shortDesc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Best Sellers: Horizontal Rail (swipe on mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E8E2D8]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Community Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
              Most Cherished Formulations
            </h2>
          </div>
          <Link
            href="/shop?sort=bestselling"
            className="text-xs font-semibold text-[#434D3D] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. AI Wellness Guide Teaser: Textarea & Suggestion Chips */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEB] border border-[#D5CCC0] rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#A35843] mb-2">
              <Sparkles size={14} />
              <span>Grounded Product Discovery</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D]">
              Not sure what you need? Tell us what you&apos;re looking for.
            </h2>
            <p className="text-xs sm:text-sm text-[#635F59] mt-2 font-light leading-relaxed">
              Describe your current hair, skin, sleep, or daily wellness state in your own words. Our guide analyzes your routine goals and pairs you with verified formulations.
            </p>

            <form onSubmit={handleGuideSubmit} className="mt-6 space-y-4">
              <textarea
                value={guideInput}
                onChange={(e) => setGuideInput(e.target.value)}
                rows={3}
                placeholder="e.g. My hair feels brittle and I have dry scalp flakes... or I want an evening tea that helps me unplug after screen work."
                className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-lg p-3.5 text-xs text-[#23201D] placeholder:text-[#8E8A83] focus:outline-none focus:border-[#434D3D] leading-relaxed resize-none"
              />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#8E8A83] mr-1">Suggestions:</span>
                {[
                  'My hair has been falling a lot',
                  'I need help building a night routine',
                  'My skin feels dry and tight',
                  'I want something for general wellness',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="text-[11px] bg-[#FAF7F2] hover:bg-[#EBE3D8] text-[#635F59] border border-[#D5CCC0] px-3 py-1 rounded-full transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="clay"
                  size="md"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Get My Recommendations
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Shop by Category: Editorial Grid with Varied Tile Sizes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-3 border-b border-[#E8E2D8]">
          <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
            Categorical Exploration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {categoriesData.map((cat, idx) => {
            const isWide = idx === 0 || idx === 3;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`group relative rounded-xl overflow-hidden bg-[#EBE3D8] shadow-xs flex flex-col justify-end p-6 min-h-[260px] ${
                  isWide ? 'md:col-span-8' : 'md:col-span-4'
                }`}
              >
                <img
                  src={cat.heroImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 text-[#FAF7F2]">
                  <span className="text-[10px] uppercase tracking-wider text-[#FAF7F2]/80 font-medium">
                    {cat.itemCount} Formulations
                  </span>
                  <h3 className="font-serif text-2xl font-medium mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#FAF7F2]/80 mt-1 max-w-sm line-clamp-2 font-light">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 8. Rituals Preview: Step-Based Visual Preview + Add Entire Ritual to Cart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative aspect-[4/5] lg:aspect-auto">
              <img
                src={featuredRitual.heroImage}
                alt={featuredRitual.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-xs px-3 py-1 rounded-sm text-xs font-semibold text-[#434D3D] uppercase tracking-wider border border-[#D5CCC0]">
                Featured Ritual · {featuredRitual.durationMinutes} Minutes
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                  Mindful Sequencing
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                  {featuredRitual.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#635F59] mt-2 leading-relaxed font-light">
                  {featuredRitual.description}
                </p>

                {/* Numbered Steps */}
                <div className="mt-6 space-y-4">
                  {featuredRitual.steps.map((step) => (
                    <div key={step.stepNumber} className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-full bg-[#434D3D] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </span>
                      <div className="text-xs">
                        <div className="font-semibold text-[#23201D] flex items-center gap-2">
                          <span>{step.name}</span>
                          <span className="text-[#8E8A83] font-normal">({step.timing})</span>
                        </div>
                        <p className="text-[#635F59] mt-0.5 leading-relaxed">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E2D8] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#8E8A83]">Complete 3-step system</span>
                  <div className="font-serif text-xl font-medium text-[#23201D]">
                    {formatPrice(2460)}{' '}
                    <span className="text-xs text-[#8E8A83] line-through font-sans">
                      {formatPrice(2890)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate(`/rituals/${featuredRitual.slug}`)}
                  >
                    View Ritual Guide
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleAddEntireRitual}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Add Entire Ritual to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Featured Product Story: Large imagery, narrative, key ingredients */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
            <img
              src={featuredStoryProduct.images[0]}
              alt={featuredStoryProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#A35843] font-semibold">
              The Formulation Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D] leading-tight">
              {featuredStoryProduct.name}
            </h2>
            <p className="text-sm text-[#635F59] leading-relaxed font-light">
              {featuredStoryProduct.description}
            </p>

            {/* Key Ingredients Callout */}
            <div className="pt-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8E8A83] mb-3">
                Key Bioactive Botanicals
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {featuredStoryProduct.keyIngredients.map((item) => (
                  <div key={item.name} className="p-3 bg-[#F4EFEB] rounded-lg border border-[#E8E2D8]">
                    <span className="text-xs font-semibold text-[#23201D] block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#635F59] mt-0.5 block leading-tight">
                      {item.purpose}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/products/${featuredStoryProduct.slug}`)}
                rightIcon={<ArrowRight size={14} />}
              >
                Discover the Nectar
              </Button>
              <span className="font-serif text-xl font-medium text-[#23201D]">
                {formatPrice(featuredStoryProduct.price)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Why Trust Us: Transparency, safe checkout, clear usage, NO invented certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEB] rounded-2xl p-8 sm:p-12 border border-[#E8E2D8]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Our Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
              Formulated with Radical Transparency
            </h2>
            <p className="text-xs sm:text-sm text-[#635F59] mt-2 font-light">
              We list 100% of our INCI ingredients on every box and bottle. No hidden silicones, no synthetic masking agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
              <Eye size={20} className="text-[#434D3D] mb-3" />
              <h3 className="text-sm font-semibold text-[#23201D]">Full INCI Transparency</h3>
              <p className="text-xs text-[#635F59] mt-1.5 leading-relaxed">
                Every carrier, extract, and plant preservative is declared clearly with its botanical Latin binomial.
              </p>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
              <ShieldCheck size={20} className="text-[#434D3D] mb-3" />
              <h3 className="text-sm font-semibold text-[#23201D]">Zero Harsh Additives</h3>
              <p className="text-xs text-[#635F59] mt-1.5 leading-relaxed">
                Free of sulfates, synthetic parabens, artificial fragrance oils, silicones, and phthalates.
              </p>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
              <CheckCircle2 size={20} className="text-[#434D3D] mb-3" />
              <h3 className="text-sm font-semibold text-[#23201D]">Clear Usage Guidance</h3>
              <p className="text-xs text-[#635F59] mt-1.5 leading-relaxed">
                Step-by-step application guidance, frequency instructions, and safety cautions on every label.
              </p>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
              <HeartHandshake size={20} className="text-[#434D3D] mb-3" />
              <h3 className="text-sm font-semibold text-[#23201D]">Attentive Customer Care</h3>
              <p className="text-xs text-[#635F59] mt-1.5 leading-relaxed">
                Direct access to our formulation team via email and phone. We assist your journey thoughtfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Community / Reviews: Clearly Labeled Demo Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-3 border-b border-[#E8E2D8] flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Customer Experiences (Demo Data)
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
              Reflections from the Community
            </h2>
          </div>
          <span className="text-[11px] text-[#8E8A83] hidden sm:block">
            Verified Purchase Perspectives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col justify-between"
            >
              <div>
                <RatingStars rating={rev.rating} size="sm" showCountText={false} />
                <h4 className="font-serif text-base font-medium text-[#23201D] mt-2 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs text-[#635F59] mt-2 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#23201D]">{rev.author}</span>
                  <span className="text-[#8E8A83] text-[11px] block">{rev.location}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#434D3D] font-medium bg-[#EBF0E8] px-2 py-0.5 rounded-xs">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Ingredient Spotlight: 3 to 4 ingredients linking to library */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E8E2D8]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              Pharmacognosy &amp; Nature
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
              Ingredient Spotlight
            </h2>
          </div>
          <Link
            href="/ingredients"
            className="text-xs font-semibold text-[#434D3D] hover:underline flex items-center gap-1"
          >
            <span>Complete Ingredient Library</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlightIngredients.map((ing) => (
            <Link
              key={ing.slug}
              href={`/ingredients/${ing.slug}`}
              className="group flex flex-col bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#D5CCC0] rounded-xl overflow-hidden transition-all"
            >
              <div className="aspect-[4/3] bg-[#EBE3D8] overflow-hidden">
                <img
                  src={ing.imageUrl}
                  alt={ing.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-semibold block">
                    {ing.origin}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#23201D] group-hover:text-[#434D3D] mt-0.5">
                    {ing.name}
                  </h3>
                  <p className="text-[11px] italic text-[#8E8A83]">
                    {ing.botanicalName}
                  </p>
                  <p className="text-xs text-[#635F59] mt-2 line-clamp-2 leading-relaxed">
                    {ing.description}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#E8E2D8]/60 text-[11px] font-semibold text-[#A35843] flex items-center gap-1">
                  <span>Explore botanical profile</span>
                  <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 13. Journal Preview: 3 Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#E8E2D8]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
              The Journal
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
              Dispatches on Living Well
            </h2>
          </div>
          <Link
            href="/journal"
            className="text-xs font-semibold text-[#434D3D] hover:underline flex items-center gap-1"
          >
            <span>Read All Articles</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group flex flex-col bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#D5CCC0] rounded-xl overflow-hidden transition-all"
            >
              <div className="aspect-[16/10] bg-[#EBE3D8] overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#8E8A83] uppercase tracking-wider font-medium">
                    <span>{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#23201D] group-hover:text-[#434D3D] mt-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#635F59] mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60 text-xs font-semibold text-[#434D3D] flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
