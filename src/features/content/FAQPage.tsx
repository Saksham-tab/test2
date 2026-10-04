import React, { useState } from 'react';
import { faqsData } from '../../data/faqs';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/useUIStore';

const CATEGORIES = [
  'All',
  'Orders & Shipping',
  'Formulations & Quality',
  'Safety & Ingestibles',
  'Rituals & Usage',
  'Returns',
] as const;

export const FAQPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const openChatbot = useUIStore((s) => s.openChatbot);

  const filteredFaqs = faqsData.filter((faq) => {
    if (selectedCat === 'All') return true;
    return faq.category === selectedCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-10">
      <Breadcrumbs items={[{ label: 'Help & FAQ' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
          Knowledge Base
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
          Frequently Addressed Questions
        </h1>
        <p className="text-xs text-[#635F59]">
          Clear, grounded answers regarding our delivery logistics, ingredients, and usage.
        </p>
      </div>

      {/* Category Pills/Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`text-xs py-1.5 px-3.5 rounded-full border transition-all ${
              selectedCat === cat
                ? 'bg-[#434D3D] text-[#FAF7F2] border-[#434D3D] font-medium'
                : 'bg-[#FAF7F2] text-[#635F59] border-[#D5CCC0] hover:bg-[#EBE3D8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4"
              >
                <span className="font-serif text-base font-medium text-[#23201D]">
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#8E8A83] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#635F59] leading-relaxed border-t border-[#E8E2D8]/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Callout */}
      <div className="p-6 bg-[#F4EFEB] rounded-2xl border border-[#D5CCC0] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#23201D]">
            Have a question not addressed here?
          </h3>
          <p className="text-xs text-[#635F59] mt-1">
            Our live Wellness Guide chatbot can answer specific ingredient &amp; shipping questions.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={openChatbot}
          leftIcon={<MessageSquare size={14} />}
        >
          Ask Wellness Guide
        </Button>
      </div>
    </div>
  );
};
