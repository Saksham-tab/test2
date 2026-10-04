import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { productsData } from '../../data/products';
import { concernsData } from '../../data/concerns';
import { categoriesData } from '../../data/categories';
import { Link, useRouter } from '../../lib/router';
import { useUIStore } from '../../store/useUIStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { Product } from '../../types/product';
import { PriceTag } from '../ui/PriceTag';
import { analytics } from '../../lib/analytics';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useUIStore();
  const { recentSearches, recordSearch, clearSearches } = useHistoryStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Debounced search logic matching name, category, description, concerns, tags, ingredients
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setResults([]);
        return;
      }

      const matches = productsData.filter((p) => {
        if (!p.active) return false;
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q) ||
          p.concerns.some((c) => c.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.ingredients.some((i) => i.toLowerCase().includes(q))
        );
      });

      setResults(matches);
      analytics.track('search', { query: q, resultCount: matches.length });
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    recordSearch(query.trim());
    closeSearch();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    recordSearch(term);
  };

  const handleSelectProduct = (slug: string) => {
    if (query.trim()) {
      recordSearch(query.trim());
    }
    closeSearch();
    navigate(`/products/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF7F2]/98 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Search Bar */}
      <div className="border-b border-[#E8E2D8] bg-[#FAF7F2] py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Search size={22} className="text-[#8E8A83] shrink-0" />
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for? (e.g. hair fall, sleep tea, saffron, ceramides)"
              className="w-full bg-transparent text-lg sm:text-xl font-normal text-[#23201D] placeholder:text-[#8E8A83] focus:outline-none"
            />
          </form>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8E8A83] hover:text-[#23201D] p-1"
              aria-label="Clear query"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="text-xs uppercase font-medium text-[#635F59] hover:text-[#23201D] px-2.5 py-1.5 rounded-md hover:bg-[#EBE3D8] transition-colors ml-2"
          >
            Esc
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Ask Wellness Guide Entry */}
          <div className="bg-[#F4EFEB] border border-[#D5CCC0] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#A35843] flex items-center justify-center border border-[#E8E2D8]">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#23201D]">
                  Need personalized advice?
                </h4>
                <p className="text-xs text-[#635F59]">
                  Let our Wellness Guide match products to your specific goals &amp; routine.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                closeSearch();
                navigate('/wellness-guide');
              }}
              className="shrink-0 text-xs font-semibold text-[#A35843] hover:underline flex items-center gap-1"
            >
              <span>Open Guide</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Results View when user types */}
          {query.trim().length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider">
                  Products matching &ldquo;{query}&rdquo; ({results.length})
                </h3>
                {results.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    className="text-xs font-medium text-[#434D3D] hover:underline flex items-center gap-1"
                  >
                    <span>View all in Shop</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="group cursor-pointer flex gap-3 p-3 rounded-lg border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F4EFEB] transition-colors"
                    >
                      <div className="w-16 h-20 bg-[#EBE3D8] rounded-md overflow-hidden shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-medium block">
                            {product.category}
                          </span>
                          <h4 className="text-xs font-medium text-[#23201D] group-hover:text-[#434D3D] truncate">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-[#635F59] truncate mt-0.5">
                            {product.productType}
                          </p>
                        </div>
                        <PriceTag price={product.price} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#F4EFEB]/40 rounded-lg border border-dashed border-[#D5CCC0]">
                  <p className="text-sm text-[#23201D] font-medium">
                    No matching products found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-[#635F59] mt-1">
                    Try searching for concerns like &ldquo;hair fall&rdquo;, &ldquo;sleep&rdquo;, or ingredients like &ldquo;saffron&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      closeSearch();
                      navigate('/shop');
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#434D3D] hover:underline"
                  >
                    <span>Browse All Formulations</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Suggestions & Recents when input is empty */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider flex items-center gap-1.5">
                      <Clock size={13} />
                      <span>Recent Searches</span>
                    </h3>
                    <button
                      onClick={clearSearches}
                      className="text-[11px] text-[#8E8A83] hover:text-[#23201D]"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {recentSearches.map((term) => (
                      <li key={term}>
                        <button
                          onClick={() => handleSelectRecent(term)}
                          className="text-xs text-[#23201D] hover:text-[#434D3D] py-1 block w-full text-left transition-colors"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular Concerns */}
              <div>
                <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-3">
                  Shop by Concern
                </h3>
                <ul className="space-y-2">
                  {concernsData.slice(0, 5).map((c) => (
                    <li key={c.slug}>
                      <button
                        onClick={() => {
                          closeSearch();
                          navigate(`/concerns/${c.slug}`);
                        }}
                        className="text-xs text-[#23201D] hover:text-[#434D3D] flex items-center justify-between w-full py-1 text-left group"
                      >
                        <span>{c.name}</span>
                        <ChevronRight size={12} className="text-[#8E8A83] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Categories */}
              <div>
                <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-3">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {categoriesData.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => {
                          closeSearch();
                          navigate(`/categories/${cat.slug}`);
                        }}
                        className="text-xs text-[#23201D] hover:text-[#434D3D] flex items-center justify-between w-full py-1 text-left group"
                      >
                        <span>{cat.name}</span>
                        <ChevronRight size={12} className="text-[#8E8A83] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
