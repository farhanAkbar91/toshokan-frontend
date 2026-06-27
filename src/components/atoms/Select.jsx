import React from 'react';

export const Select = ({ value, onChange, options = [], placeholder = 'Pilih opsi', name, required = false, className = '', ...props }) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        className={`w-full px-3 py-2.5 rounded-lg bg-bg-base border border-border-base text-txt-base focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200 text-sm appearance-none cursor-pointer ${className}`}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg-surface text-txt-base">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-txt-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
