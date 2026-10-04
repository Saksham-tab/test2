import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'clay';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wide text-xs uppercase';

  const sizeStyles = {
    sm: 'py-2 px-3 text-[11px] gap-1.5 rounded-md',
    md: 'py-2.5 px-5 text-xs gap-2 rounded-md',
    lg: 'py-3.5 px-7 text-xs gap-2.5 rounded-lg',
  };

  const variantStyles = {
    primary:
      'bg-[#434D3D] text-[#FAF7F2] hover:bg-[#343D2F] active:bg-[#2A3125] focus-visible:ring-[#434D3D] shadow-sm',
    secondary:
      'bg-[#FAF7F2] text-[#23201D] border border-[#D5CCC0] hover:bg-[#F2ECE3] active:bg-[#EAE0D3] focus-visible:ring-[#635F59]',
    outline:
      'border border-[#434D3D] text-[#434D3D] bg-transparent hover:bg-[#434D3D]/5 active:bg-[#434D3D]/10 focus-visible:ring-[#434D3D]',
    ghost:
      'bg-transparent text-[#23201D] hover:bg-[#23201D]/5 active:bg-[#23201D]/10 focus-visible:ring-[#23201D]',
    clay:
      'bg-[#A35843] text-[#FAF7F2] hover:bg-[#8D4733] active:bg-[#783C2A] focus-visible:ring-[#A35843] shadow-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
