import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  clickable?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

export default function Card({
  children,
  clickable = false,
  disabled = false,
  selected = false,
  className = '',
  ...props
}: CardProps) {
  const interactiveClass = clickable && !disabled
    ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-md'
    : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const selectedClass = selected ? 'border-[#3B5BA5] ring-2 ring-[#3B5BA5]/30' : 'border-gray-100';

  return (
    <div
      className={`
        bg-white rounded-2xl border-2 shadow-sm
        transition-all duration-200
        ${interactiveClass}
        ${disabledClass}
        ${selectedClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
