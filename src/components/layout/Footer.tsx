import React, { useState } from 'react';
import { brandConfig } from '../../config/brand';
import { siteConfig } from '../../config/site';
import { Link } from '../../lib/router';
import { newsletterSchema } from '../../lib/validation';
import { ArrowRight, Check } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const showToast = useUIStore((s) => s.showToast);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Please enter a valid email address');
      return;
    }

    setIsSubscribed(true);
    showToast('Welcome to our wellness circle. You will receive mindful dispatches.');
  };

  return (
    <footer className="bg-[#23201D] text-[#FAF7F2] border-t border-[#434D3D]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="pb-12 border-b border-[#434D3D]/50 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-widest text-[#D5CCC0] font-semibold">
              The Wellness Circle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2] mt-2">
              Better rituals. Better everyday.
            </h3>
            <p className="text-xs text-[#D5CCC0]/80 mt-2 max-w-md leading-relaxed">
              Mindful seasonal reflections, botanical wisdom, and early access to fresh small-batch formulations. Never spam.
            </p>
          </div>

          <div className="lg:col-span-6">
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#434D3D]/60 border border-[#606E58] rounded-md text-xs text-[#FAF7F2]">
                <Check size={16} className="text-[#C59B27]" />
                <span>You are subscribed to the Sattva &amp; Co. journal circle.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 rounded-md px-3.5 py-2.5 text-xs text-[#FAF7F2] placeholder:text-[#FAF7F2]/50 focus:outline-none focus:border-[#FAF7F2]/60"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-[#FAF7F2] text-[#23201D] hover:bg-[#EBE3D8] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-md transition-colors shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-[11px] text-[#F2C5BD]">{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl text-[#FAF7F2]">
                {brandConfig.name}
              </span>
            </Link>
            <p className="text-xs text-[#D5CCC0]/70 max-w-sm leading-relaxed">
              {brandConfig.tagline} Thoughtfully formulated hair, scalp, skin, sleep, and botanical herbal wellness essentials.
            </p>
            <div className="text-xs text-[#D5CCC0]/60 space-y-1 pt-1">
              <p>Customer Care: {brandConfig.supportEmail}</p>
              <p>Helpline: {brandConfig.supportPhone}</p>
              <p>Hours: {brandConfig.supportHours}</p>
            </div>
          </div>

          {/* Column: Shop */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D5CCC0] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D5CCC0]/80">
              {siteConfig.footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#FAF7F2] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Discover */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D5CCC0] mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D5CCC0]/80">
              {siteConfig.footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#FAF7F2] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Company & Policies */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D5CCC0] mb-4">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D5CCC0]/80">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#FAF7F2] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="pt-8 border-t border-[#434D3D]/40 space-y-4 text-[11px] text-[#D5CCC0]/50 leading-relaxed">
          <p>
            Regulatory Note: Statements made regarding our dietary supplements, botanical elixirs, and topical infusions have not been evaluated by the Food and Drug Administration or state licensing authorities as pharmaceutical cure or disease treatment. Our products are formulated for cosmetic and lifestyle wellness support. If you are pregnant, nursing, taking prescription medicines, or under physician supervision, consult a healthcare professional prior to use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[#D5CCC0]/60">
            <p>
              &copy; {new Date().getFullYear()} {brandConfig.name} All rights reserved. Crafted with botanical reverence.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/policies/privacy" className="hover:text-[#FAF7F2]">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/policies/terms" className="hover:text-[#FAF7F2]">
                Terms
              </Link>
              <span>·</span>
              <Link href="/policies/shipping" className="hover:text-[#FAF7F2]">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
