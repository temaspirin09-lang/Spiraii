import { HTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card fade-in-up ${className}`} {...rest}>
      {children}
    </div>
  );
}
