import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-brand-primary text-white hover:brightness-110 shadow-sm shadow-brand-primary/20',
    secondary: 'bg-bg-surface border border-border-base text-txt-base hover:bg-bg-base',
    accent: 'bg-brand-accent text-[#0F172A] hover:brightness-110 shadow-sm shadow-brand-accent/20',
    danger: 'bg-error text-white hover:brightness-110 shadow-sm shadow-error/20',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
