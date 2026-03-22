import type { ReactNode } from 'react';
import type { Category } from '../types';

type Color = 'blue' | 'orange' | 'green' | 'red' | 'gray' | 'category';

interface BadgeProps {
  children: ReactNode;
  color?: Color;
  category?: Category;
  size?: 'sm' | 'md';
  className?: string;
}

const colorClass: Record<Color, string> = {
  blue:     'bg-[#e8edf8] text-[#3B5BA5]',
  orange:   'bg-orange-100 text-[#FF6B35]',
  green:    'bg-emerald-100 text-emerald-700',
  red:      'bg-red-100 text-red-600',
  gray:     'bg-gray-100 text-gray-500',
  category: '',
};

const categoryColor: Record<Category, string> = {
  KOREAN_HISTORY: 'bg-amber-100 text-amber-700',
  SCIENCE:        'bg-emerald-100 text-emerald-700',
  ENGLISH:        'bg-violet-100 text-violet-700',
};

const sizeClass = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  color = 'blue',
  category,
  size = 'md',
  className = '',
}: BadgeProps) {
  const resolvedColor =
    color === 'category' && category ? categoryColor[category] : colorClass[color];

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        ${resolvedColor}
        ${sizeClass[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
