import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, Sparkles } from 'lucide-react';
import { brandConfig } from '../../config/brand';
import { Link, useRouter } from '../../lib/router';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';
import { MegaMenu } from '../navigation/MegaMenu';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { path } = useRouter();

  const itemCount = useCartStore((s) => s.calculation.itemCount);
  const wishlistCount = useWishlistStore((s) => s.wishlistProductIds.length);
  const { openCart, openSearch, openMobileMenu } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs py-3 border-b border-[#E8E2D8]'
          : 'bg-[#FAF7F2] py-4 border-b border-[#E8E2D8]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={openMobileMenu}
              className="p-1.5 -ml-1.5 text-[#23201D] hover:text-[#434D3D] rounded-md transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Brand Logo & Editorial Typography */}
          <div className="flex items-center">
            <Link href="/" className="group flex flex-col items-start">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#23201D] group-hover:text-[#434D3D] transition-colors leading-none">
                {brandConfig.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#8E8A83] font-medium hidden sm:block mt-0.5">
                Botanical Wellness &amp; Daily Rituals
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide text-[#23201D]">
            <Link
              href="/shop"
              className={`hover:text-[#434D3D] transition-colors py-1 relative ${
                path === '/shop' ? 'text-[#434D3D] font-semibold' : ''
              }`}
            >
              Shop All
            </Link>

            {/* Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <button
                type="button"
                className="hover:text-[#434D3D] transition-colors py-1 flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <span>Collections</span>
              </button>
            </div>

            <Link
              href="/shop?sort=bestselling"
              className="hover:text-[#434D3D] transition-colors py-1"
            >
              Best Sellers
            </Link>

            <Link
              href="/ingredients"
              className={`hover:text-[#434D3D] transition-colors py-1 ${
                path.startsWith('/ingredients') ? 'text-[#434D3D] font-semibold' : ''
              }`}
            >
              Ingredients
            </Link>

            <Link
              href="/journal"
              className={`hover:text-[#434D3D] transition-colors py-1 ${
                path.startsWith('/journal') ? 'text-[#434D3D] font-semibold' : ''
              }`}
            >
              The Journal
            </Link>

            <Link
              href="/wellness-guide"
              className="inline-flex items-center gap-1.5 text-[#A35843] hover:text-[#8D4733] transition-colors py-1 font-semibold"
            >
              <Sparkles size={13} />
              <span>Wellness Guide</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-1.5 text-[#23201D] hover:text-[#434D3D] transition-colors rounded-full"
              aria-label="Search catalog"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="hidden sm:flex relative p-1.5 text-[#23201D] hover:text-[#A35843] transition-colors rounded-full"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#A35843] text-[#FAF7F2] text-[10px] font-medium rounded-full flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="hidden sm:flex p-1.5 text-[#23201D] hover:text-[#434D3D] transition-colors rounded-full"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-1.5 text-[#23201D] hover:text-[#434D3D] transition-colors rounded-full"
              aria-label={`Shopping basket with ${itemCount} items`}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#434D3D] text-[#FAF7F2] text-[10px] font-semibold rounded-full flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />
    </header>
  );
};
