import React from 'react';
import { ArrowRight, Clock, User, CheckCircle2 } from 'lucide-react';
import { journalData } from '../../data/journal';
import { productsData } from '../../data/products';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { Link, useRouter } from '../../lib/router';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';

export const JournalPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const { navigate } = useRouter();

  // Single Article View
  if (slug) {
    const article = journalData.find((a) => a.slug === slug);

    if (!article) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-2xl text-[#23201D]">Article Not Found</h2>
          <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/journal')}>
            Return to The Journal
          </Button>
        </div>
      );
    }

    const relatedProducts = productsData.filter((p) =>
      article.relatedProductIds.includes(p.id)
    );

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'The Journal', href: '/journal' },
            { label: article.title },
          ]}
        />

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8E8A83] font-semibold">
            <span>{article.category}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#23201D] leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs text-[#635F59]">
            <div className="w-8 h-8 rounded-full bg-[#EBE3D8] text-[#434D3D] flex items-center justify-center font-semibold">
              <User size={14} />
            </div>
            <div>
              <span className="font-semibold text-[#23201D] block">{article.author.name}</span>
              <span className="text-[11px] text-[#8E8A83]">{article.author.role} · {formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#EBE3D8]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Callout */}
        <div className="p-6 bg-[#F4EFEB] rounded-xl border border-[#D5CCC0] space-y-2.5">
          <h3 className="text-xs uppercase font-semibold text-[#A35843] tracking-wider">
            Key Insights &amp; Scientific Takeaways
          </h3>
          <div className="space-y-1.5">
            {article.keyTakeaways.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#23201D]">
                <CheckCircle2 size={14} className="text-[#434D3D] shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body Paragraphs - Typed content blocks, no raw HTML */}
        <div className="space-y-5 text-sm text-[#23201D] leading-relaxed font-light">
          {article.contentParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Related Formulations Mentioned in Article */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-[#E8E2D8] space-y-6">
            <h3 className="font-serif text-2xl font-light text-[#23201D]">
              Formulations Mentioned in This Dispatch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Journal Index View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'The Journal' }]} />

      <div className="mt-2 mb-10 pb-4 border-b border-[#E8E2D8]">
        <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
          Circadian Rhythms &amp; Botanical Science
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D] mt-1">
          The Sattva &amp; Co. Journal
        </h1>
        <p className="text-xs sm:text-sm text-[#635F59] mt-2 max-w-2xl leading-relaxed">
          Essays on chronobiology, scalp microflora, adaptogenic biochemistry, and the intentional design of daily ceremonies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {journalData.map((article) => (
          <Link
            key={article.slug}
            href={`/journal/${article.slug}`}
            className="group flex flex-col bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#D5CCC0] rounded-xl overflow-hidden transition-all shadow-xs"
          >
            <div className="aspect-[16/10] bg-[#EBE3D8] overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-[#8E8A83] uppercase tracking-wider font-semibold">
                  <span>{article.category}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#23201D] group-hover:text-[#434D3D] mt-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-[#635F59] mt-2 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs font-semibold text-[#434D3D]">
                <span>Read Dispatch</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
