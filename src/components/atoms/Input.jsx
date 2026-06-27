import React from 'react';

export const Input = ({ type = 'text', value, onChange, placeholder, name, required = false, className = '', ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      required={required}
      className={`w-full px-3 py-2.5 rounded-lg bg-bg-base border border-border-base text-txt-base placeholder:text-txt-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200 text-sm ${className}`}
      {...props}
    />
  );
};
