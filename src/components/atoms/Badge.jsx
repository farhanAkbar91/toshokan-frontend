import React from 'react';

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold select-none transition-all duration-200';
  const variants = {
    info: 'bg-brand-primary/15 text-brand-primary dark:text-[#3B82F6] border border-brand-primary/20',
    accent: 'bg-brand-accent/15 text-[#B45309] dark:text-[#FBBF24] border border-brand-accent/20',
    success: 'bg-success/15 text-success border border-success/20',
    error: 'bg-error/15 text-error border border-error/20',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
