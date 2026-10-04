import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('animate-pulse bg-[#EAE2D5]/70 rounded-md', className)}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="aspect-[4/5] w-full rounded-md" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-1/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
};
