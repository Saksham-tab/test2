import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  disabled = false,
  className,
}) => {
  const isSm = size === 'sm';

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center border border-[#D5CCC0] rounded-md bg-[#FAF7F2] select-none',
        isSm ? 'h-7' : 'h-9',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
    >
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={handleDecrement}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center text-[#635F59] hover:text-[#23201D] hover:bg-[#EBE3D8] disabled:opacity-30 disabled:hover:bg-transparent rounded-l-md transition-colors',
          isSm ? 'w-7 h-full' : 'w-9 h-full'
        )}
      >
        <Minus size={isSm ? 12 : 14} />
      </button>

      <span
        className={cn(
          'text-center font-medium text-[#23201D] tabular-nums',
          isSm ? 'w-7 text-xs' : 'w-9 text-xs'
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        disabled={disabled || quantity >= max}
        onClick={handleIncrement}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center text-[#635F59] hover:text-[#23201D] hover:bg-[#EBE3D8] disabled:opacity-30 disabled:hover:bg-transparent rounded-r-md transition-colors',
          isSm ? 'w-7 h-full' : 'w-9 h-full'
        )}
      >
        <Plus size={isSm ? 12 : 14} />
      </button>
    </div>
  );
};
