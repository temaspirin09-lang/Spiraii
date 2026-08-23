'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'accent' | 'text';
  compact?: boolean;
}

export function Button({ variant = 'accent', compact, className = '', children, ...rest }: ButtonProps) {
  const variantClass =
    variant === 'solid' ? 'btn-solid' : variant === 'ghost' ? 'btn-ghost' : variant === 'text' ? 'btn-text' : 'btn-accent';
  return (
    <button className={`btn ${variantClass} ${compact ? 'btn-compact' : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}
