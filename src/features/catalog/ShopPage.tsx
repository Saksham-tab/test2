import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, X, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { useRouter } from '../../lib/router';
import { productsData } from '../../data/products';
import { categoriesData } from '../../data/categories';
import { concernsData } from '../../data/concerns';
import { Product, ProductCategory, ProductConcern } from '../../types/product';
import { ProductCard } from '../../components/product/ProductCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'highest_rated', label: 'Highest Rated' },
];

const FORMAT_OPTIONS = [
  'All Formats',
  'Treatment Oil',
  'Liquid Cleanser',
  'Rich Cream',
  'Facial Serum',
  'Velvet Cream',
  'Loose Leaf Tea',
  'Vegetarian Capsules',
  'Soluble Powder',
  'Curated Boxed Set',
];

export const ShopPage: React.FC = () => {
  const { queryParams, navigate } = useRouter();

  // Read state from URL search params for shareable URLs
  const currentCategory = (queryParams.get('category') as ProductCategory) || undefined;
  const currentConcern = (queryParams.get('concern') as ProductConcern) || undefined;
  const currentSort = queryParams.get('sort') || 'recommended';
  const currentSearch = queryParams.get('search') || '';
  const currentFormat = queryParams.get('format') || '';
  const inStockOnly = queryParams.get('inStock') === 'true';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(currentFormat);
  const [priceMax, setPriceMax] = useState<number>(2500);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedFormat(currentFormat);
  }, [currentFormat]);

  const updateParam = (key: string, value?: string | boolean) => {
    const nextParams = new URLSearchParams(queryParams.toString());
    if (value === undefined || value === '' || value === false) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    navigate(`/shop?${nextParams.toString()}`);
  };

  const clearAllFilters = () => {
    navigate('/shop');
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = productsData.filter((p) => p.active);

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.concerns.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (currentCategory) {
      list = list.filter((p) => p.category === currentCategory);
    }

    if (currentConcern) {
      list = list.filter((p) => p.concerns.includes(currentConcern));
    }

    if (selectedFormat && selectedFormat !== 'All Formats') {
      list = list.filter((p) => p.format.toLowerCase() === selectedFormat.toLowerCase());
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    list = list.filter((p) => p.price <= priceMax);

    switch (currentSort) {
      case 'bestselling':
        return [...list].sort(
          (a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount
        );
      case 'newest':
        return [...list].sort(
          (a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)
        );
      case 'price_asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'highest_rated':
        return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case 'recommended':
      default:
        return [...list].sort(
          (a, b) => (b.isBestSeller ? 2 : 0) + b.rating - ((a.isBestSeller ? 2 : 0) + a.rating)
        );
    }
  }, [currentSearch, currentCategory, currentConcern, selectedFormat, inStockOnly, priceMax, currentSort]);

  const activeFilterCount =
    (currentCategory ? 1 : 0) +
    (currentConcern ? 1 : 0) +
    (selectedFormat && selectedFormat !== 'All Formats' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (priceMax < 2500 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <Breadcrumbs items={[{ label: 'Shop All Formulations' }]} />

      {/* Page Title & Context */}
      <div className="mt-2 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
            All Botanical Formulations
          </h1>
          <p className="text-xs sm:text-sm text-[#635F59] mt-1 max-w-xl">
            Mindfully harvested herbs and plant lipids formulated to support hair density, skin barrier strength, and peaceful circadian rhythm.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 py-2 px-3 bg-[#FAF7F2] border border-[#D5CCC0] rounded-md text-xs font-medium text-[#23201D]"
          >
            <SlidersHorizontal size={14} />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8E8A83] hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-md py-2 px-3 text-xs text-[#23201D] focus:outline-none focus:border-[#434D3D]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8E8A83]">Active filters:</span>
          {currentSearch && (
            <button
              onClick={() => updateParam('search', undefined)}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#23201D] px-2.5 py-1 rounded-md border border-[#D5CCC0]"
            >
              <span>Search: &ldquo;{currentSearch}&rdquo;</span>
              <X size={12} />
            </button>
          )}
          {currentCategory && (
            <button
              onClick={() => updateParam('category', undefined)}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#23201D] px-2.5 py-1 rounded-md border border-[#D5CCC0]"
            >
              <span>Category: {currentCategory}</span>
              <X size={12} />
            </button>
          )}
          {currentConcern && (
            <button
              onClick={() => updateParam('concern', undefined)}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#23201D] px-2.5 py-1 rounded-md border border-[#D5CCC0]"
            >
              <span>Concern: {currentConcern.replace('-', ' ')}</span>
              <X size={12} />
            </button>
          )}
          {selectedFormat && selectedFormat !== 'All Formats' && (
            <button
              onClick={() => {
                setSelectedFormat('');
                updateParam('format', undefined);
              }}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#23201D] px-2.5 py-1 rounded-md border border-[#D5CCC0]"
            >
              <span>Format: {selectedFormat}</span>
              <X size={12} />
            </button>
          )}
          {inStockOnly && (
            <button
              onClick={() => updateParam('inStock', undefined)}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#23201D] px-2.5 py-1 rounded-md border border-[#D5CCC0]"
            >
              <span>In Stock Only</span>
              <X size={12} />
            </button>
          )}
          {priceMax < 2500 && (
            <button
              onClick={() => setPriceMax(2500)}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#23201D] px-2.5 py-1 rounded-md border border-[#D5CCC0]"
            >
              <span>Under {formatPrice(priceMax)}</span>
              <X size={12} />
            </button>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#A35843] hover:underline font-medium ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 pr-4 border-r border-[#E8E2D8]">
          {/* Categories */}
          <div>
            <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => updateParam('category', undefined)}
                  className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                    !currentCategory
                      ? 'bg-[#EBF0E8] text-[#434D3D] font-semibold'
                      : 'text-[#635F59] hover:text-[#23201D]'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categoriesData.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                      currentCategory === cat.slug
                        ? 'bg-[#EBF0E8] text-[#434D3D] font-semibold'
                        : 'text-[#635F59] hover:text-[#23201D]'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Concerns */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-3">
              Concerns
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => updateParam('concern', undefined)}
                  className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                    !currentConcern
                      ? 'bg-[#EBF0E8] text-[#434D3D] font-semibold'
                      : 'text-[#635F59] hover:text-[#23201D]'
                  }`}
                >
                  All Concerns
                </button>
              </li>
              {concernsData.map((con) => (
                <li key={con.slug}>
                  <button
                    onClick={() => updateParam('concern', con.slug)}
                    className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                      currentConcern === con.slug
                        ? 'bg-[#EBF0E8] text-[#434D3D] font-semibold'
                        : 'text-[#635F59] hover:text-[#23201D]'
                    }`}
                  >
                    {con.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Format Selector */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-3">
              Formulation Format
            </h3>
            <select
              value={selectedFormat}
              onChange={(e) => {
                setSelectedFormat(e.target.value);
                updateParam('format', e.target.value === 'All Formats' ? undefined : e.target.value);
              }}
              className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md py-1.5 px-2.5 text-xs text-[#23201D] focus:outline-none"
            >
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="uppercase font-semibold text-[#8E8A83] tracking-wider">
                Max Price
              </span>
              <span className="font-semibold text-[#23201D]">{formatPrice(priceMax)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={2500}
              step={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#434D3D] cursor-pointer"
            />
          </div>

          {/* Stock Availability */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#23201D]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam('inStock', e.target.checked)}
                className="rounded accent-[#434D3D] w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#F4EFEB]/50 rounded-xl border border-dashed border-[#D5CCC0] p-8">
              <h3 className="font-serif text-xl text-[#23201D]">No formulations found</h3>
              <p className="text-xs text-[#635F59] mt-2 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any items matching your selected filter criteria. Try resetting filters to explore our full botanical apothecary.
              </p>
              <div className="mt-6">
                <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <h3 className="font-serif text-xl font-medium text-[#23201D]">
                Filter Catalog
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#635F59]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  {categoriesData.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`block w-full text-left py-1 text-xs ${
                        currentCategory === cat.slug ? 'font-semibold text-[#434D3D]' : 'text-[#635F59]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="pt-4 border-t border-[#E8E2D8]">
                <h4 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-2">
                  Concern
                </h4>
                <div className="space-y-1">
                  {concernsData.map((con) => (
                    <button
                      key={con.slug}
                      onClick={() => updateParam('concern', con.slug)}
                      className={`block w-full text-left py-1 text-xs ${
                        currentConcern === con.slug ? 'font-semibold text-[#434D3D]' : 'text-[#635F59]'
                      }`}
                    >
                      {con.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div className="pt-4 border-t border-[#E8E2D8]">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateParam('inStock', e.target.checked)}
                    className="accent-[#434D3D]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D8] flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
