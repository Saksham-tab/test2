import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Link } from '../../lib/router';

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || siteConfig.announcements.length === 0) return null;

  const currentMessage = siteConfig.announcements[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % siteConfig.announcements.length);
  };

  return (
    <div className="bg-[#434D3D] text-[#FAF7F2] text-[11px] font-medium tracking-wide py-1.5 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6" /> {/* spacer for visual symmetry */}
        <div
          onClick={handleNext}
          className="flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 select-none text-center"
        >
          <span>{currentMessage}</span>
          <ChevronRight size={12} className="opacity-70 shrink-0" />
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#FAF7F2]/70 hover:text-[#FAF7F2] p-0.5 rounded transition-colors"
          aria-label="Dismiss announcement"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
