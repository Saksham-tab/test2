import React from 'react';
import { cn, formatPrice } from '../../lib/utils';

export interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  compareAtPrice,
  size = 'md',
  className,
}) => {
  const hasDiscount = Boolean(compareAtPrice && compareAtPrice > price);
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100)
    : 0;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-medium',
    xl: 'text-2xl font-serif font-medium',
  };

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('text-[#23201D] font-medium tracking-tight', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-xs text-[#8E8A83] line-through">
            {formatPrice(compareAtPrice!)}
          </span>
          <span className="text-[11px] text-[#A35843] font-medium tracking-tight">
            ({discountPercent}% off)
          </span>
        </>
      )}
    </div>
  );
};
