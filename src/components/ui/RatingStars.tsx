import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCountText?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showCountText = true,
  className,
}) => {
  const starSize = size === 'sm' ? 12 : 15;

  return (
    <div className={cn('flex items-center gap-1.5 text-[#23201D]', className)}>
      <div className="flex items-center text-[#C59B27]" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={cn(
              star <= Math.round(rating)
                ? 'fill-[#C59B27] text-[#C59B27]'
                : 'text-[#D5CCC0]'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-[#23201D]">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && showCountText && (
        <span className="text-xs text-[#8E8A83]">({reviewCount})</span>
      )}
    </div>
  );
};
