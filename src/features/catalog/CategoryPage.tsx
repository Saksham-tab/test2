import React, { useMemo } from 'react';
import { categoriesData } from '../../data/categories';
import { productsData } from '../../data/products';
import { ProductCategory } from '../../types/product';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { Link, useRouter } from '../../lib/router';
import { Button } from '../../components/ui/Button';

export const CategoryPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate } = useRouter();
  const categoryInfo = categoriesData.find((c) => c.slug === slug);

  const matchedProducts = useMemo(() => {
    return productsData.filter((p) => p.category === slug && p.active);
  }, [slug]);

  if (!categoryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#23201D]">Category not found</h2>
        <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/shop')}>
          Browse All Formulations
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Category Hero Banner */}
      <div className="relative bg-[#23201D] text-[#FAF7F2] py-16 sm:py-24 overflow-hidden">
        <img
          src={categoryInfo.heroImage}
          alt={categoryInfo.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Shop', href: '/shop' },
              { label: categoryInfo.name },
            ]}
          />
          <span className="text-xs uppercase tracking-widest text-[#D5CCC0] font-semibold block mt-4">
            Botanical Collection
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#FAF7F2] mt-2">
            {categoryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#D5CCC0] mt-3 max-w-xl leading-relaxed font-light">
            {categoryInfo.description}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8] mb-8">
          <span className="text-xs text-[#8E8A83] font-medium">
            Showing {matchedProducts.length} {matchedProducts.length === 1 ? 'formulation' : 'formulations'}
          </span>
          <Link href="/shop" className="text-xs font-semibold text-[#434D3D] hover:underline">
            View All Categories &rarr;
          </Link>
        </div>

        {matchedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F4EFEB] rounded-xl border border-[#D5CCC0]">
            <p className="text-sm text-[#23201D]">
              New seasonal batches currently curing for this category.
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/shop')}>
              Browse Available Formulations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
