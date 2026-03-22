import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: `
    bg-[#3B5BA5] text-white shadow-md
    hover:bg-[#2d4a8a] hover:shadow-lg hover:-translate-y-0.5
    active:translate-y-0 active:shadow-md
    disabled:bg-[#3B5BA5]/50 disabled:shadow-none disabled:translate-y-0
  `,
  secondary: `
    bg-white text-[#3B5BA5] border-2 border-[#3B5BA5] shadow-sm
    hover:bg-[#e8edf8] hover:shadow-md hover:-translate-y-0.5
    active:translate-y-0
    disabled:opacity-50 disabled:translate-y-0
  `,
  ghost: `
    bg-transparent text-[#3B5BA5]
    hover:bg-[#e8edf8]
    active:bg-[#d0d9f0]
    disabled:opacity-50
  `,
};

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 cursor-pointer
        disabled:cursor-not-allowed select-none
        ${variantClass[variant]}
        ${sizeClass[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
