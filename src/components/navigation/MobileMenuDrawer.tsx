import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, Sparkles, Heart, User, ShoppingBag } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { brandConfig } from '../../config/brand';
import { Link, useRouter } from '../../lib/router';
import { useUIStore } from '../../store/useUIStore';

export const MobileMenuDrawer: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const [activeSection, setActiveSection] = useState<'categories' | 'concerns' | 'rituals' | null>(null);
  const { navigate } = useRouter();

  if (!isMobileMenuOpen) return null;

  const toggleSection = (section: 'categories' | 'concerns' | 'rituals') => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleLinkClick = (href: string) => {
    closeMobileMenu();
    navigate(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#E8E2D8] flex items-center justify-between">
          <span className="font-serif text-xl tracking-tight text-[#23201D]">
            {brandConfig.name}
          </span>
          <button
            onClick={closeMobileMenu}
            className="p-1.5 text-[#635F59] hover:text-[#23201D] rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Highlights */}
        <div className="p-4 bg-[#F4EFEB] border-b border-[#E8E2D8]">
          <button
            onClick={() => handleLinkClick('/wellness-guide')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAF7F2] border border-[#D5CCC0] text-xs font-medium text-[#23201D]"
          >
            <div className="flex items-center gap-2 text-[#A35843]">
              <Sparkles size={16} />
              <span className="font-semibold text-[#23201D]">AI Wellness Guide</span>
            </div>
            <ChevronRight size={14} className="text-[#8E8A83]" />
          </button>
        </div>

        {/* Primary Links */}
        <div className="flex-1 p-4 space-y-1">
          <button
            onClick={() => handleLinkClick('/shop')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#23201D] hover:bg-[#EBE3D8] transition-colors"
          >
            Shop All Formulations
          </button>

          <button
            onClick={() => handleLinkClick('/shop?sort=bestselling')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-[#23201D] hover:bg-[#EBE3D8] transition-colors"
          >
            Best Sellers
          </button>

          {/* Accordion 1: Categories */}
          <div>
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-medium text-[#23201D] hover:bg-[#EBE3D8]"
            >
              <span>By Category</span>
              <ChevronDown
                size={16}
                className={`transition-transform text-[#8E8A83] ${
                  activeSection === 'categories' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeSection === 'categories' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#F4EFEB]/50 rounded-md my-1">
                {siteConfig.megaMenu.categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleLinkClick(`/categories/${c.slug}`)}
                    className="w-full text-left py-1.5 text-xs text-[#635F59] hover:text-[#23201D]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 2: Concerns */}
          <div>
            <button
              onClick={() => toggleSection('concerns')}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-medium text-[#23201D] hover:bg-[#EBE3D8]"
            >
              <span>By Concern</span>
              <ChevronDown
                size={16}
                className={`transition-transform text-[#8E8A83] ${
                  activeSection === 'concerns' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeSection === 'concerns' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#F4EFEB]/50 rounded-md my-1">
                {siteConfig.megaMenu.concerns.map((con) => (
                  <button
                    key={con.slug}
                    onClick={() => handleLinkClick(`/concerns/${con.slug}`)}
                    className="w-full text-left py-1.5 text-xs text-[#635F59] hover:text-[#23201D]"
                  >
                    {con.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accordion 3: Rituals */}
          <div>
            <button
              onClick={() => toggleSection('rituals')}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-medium text-[#23201D] hover:bg-[#EBE3D8]"
            >
              <span>Daily Rituals</span>
              <ChevronDown
                size={16}
                className={`transition-transform text-[#8E8A83] ${
                  activeSection === 'rituals' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeSection === 'rituals' && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#F4EFEB]/50 rounded-md my-1">
                {siteConfig.megaMenu.rituals.map((r) => (
                  <button
                    key={r.slug}
                    onClick={() => handleLinkClick(`/rituals/${r.slug}`)}
                    className="w-full text-left py-1.5 text-xs text-[#635F59] hover:text-[#23201D]"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#E8E2D8]">
            <button
              onClick={() => handleLinkClick('/ingredients')}
              className="w-full text-left py-2 px-3 text-xs text-[#635F59] hover:text-[#23201D]"
            >
              Ingredient Library
            </button>
            <button
              onClick={() => handleLinkClick('/journal')}
              className="w-full text-left py-2 px-3 text-xs text-[#635F59] hover:text-[#23201D]"
            >
              The Journal
            </button>
            <button
              onClick={() => handleLinkClick('/about')}
              className="w-full text-left py-2 px-3 text-xs text-[#635F59] hover:text-[#23201D]"
            >
              Our Origin & Values
            </button>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-4 border-t border-[#E8E2D8] bg-[#F4EFEB] flex items-center justify-around text-xs text-[#635F59]">
          <button
            onClick={() => handleLinkClick('/account')}
            className="flex flex-col items-center gap-1 hover:text-[#23201D]"
          >
            <User size={18} />
            <span>Account</span>
          </button>
          <button
            onClick={() => handleLinkClick('/wishlist')}
            className="flex flex-col items-center gap-1 hover:text-[#23201D]"
          >
            <Heart size={18} />
            <span>Wishlist</span>
          </button>
          <button
            onClick={() => {
              closeMobileMenu();
              openSearch();
            }}
            className="flex flex-col items-center gap-1 hover:text-[#23201D]"
          >
            <Sparkles size={18} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
