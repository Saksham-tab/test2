import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Link } from '../../lib/router';

export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF7F2] border-b border-[#D5CCC0] shadow-xl z-40 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Column 1: By Category */}
          <div className="col-span-3">
            <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-4 pb-2 border-b border-[#E8E2D8]">
              By Category
            </h3>
            <ul className="space-y-3">
              {siteConfig.megaMenu.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="text-sm font-medium text-[#23201D] group-hover:text-[#434D3D] transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-[#8E8A83] group-hover:text-[#635F59] transition-colors leading-tight">
                      {cat.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: By Concern */}
          <div className="col-span-3">
            <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-4 pb-2 border-b border-[#E8E2D8]">
              By Concern
            </h3>
            <ul className="space-y-3">
              {siteConfig.megaMenu.concerns.map((con) => (
                <li key={con.slug}>
                  <Link
                    href={`/concerns/${con.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="text-sm font-medium text-[#23201D] group-hover:text-[#434D3D] transition-colors">
                      {con.name}
                    </div>
                    <div className="text-[11px] text-[#8E8A83] group-hover:text-[#635F59] transition-colors leading-tight">
                      {con.desc}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: By Ritual */}
          <div className="col-span-3">
            <h3 className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider mb-4 pb-2 border-b border-[#E8E2D8]">
              Curated Rituals
            </h3>
            <ul className="space-y-3">
              {siteConfig.megaMenu.rituals.map((rit) => (
                <li key={rit.slug}>
                  <Link
                    href={`/rituals/${rit.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="text-sm font-medium text-[#23201D] group-hover:text-[#434D3D] transition-colors">
                      {rit.name}
                    </div>
                    <div className="text-[11px] text-[#8E8A83] group-hover:text-[#635F59] transition-colors">
                      {rit.steps} Steps · {rit.time}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#E8E2D8]">
              <Link
                href="/wellness-guide"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A35843] hover:text-[#8D4733] transition-colors"
              >
                <Sparkles size={13} />
                <span>Personalized Wellness Guide</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Column 4: Featured Story Panel */}
          <div className="col-span-3 bg-[#F4EFEB] p-5 rounded-lg border border-[#E8E2D8] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#A35843] tracking-wider">
                Featured Botanical Story
              </span>
              <h4 className="font-serif text-lg font-medium text-[#23201D] mt-1 leading-snug">
                {siteConfig.megaMenu.featured.title}
              </h4>
              <p className="text-xs text-[#635F59] mt-2 leading-relaxed">
                {siteConfig.megaMenu.featured.subtitle}
              </p>
            </div>

            <div className="mt-4">
              <div className="aspect-[4/3] rounded-md overflow-hidden mb-3">
                <img
                  src={siteConfig.megaMenu.featured.image}
                  alt={siteConfig.megaMenu.featured.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                href={`/products/${siteConfig.megaMenu.featured.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#434D3D] hover:underline"
              >
                <span>View Evening Set</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
