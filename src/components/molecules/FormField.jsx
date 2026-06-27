import React from 'react';

export const FormField = ({ label, error, children, required = false, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-xs font-bold text-txt-muted uppercase tracking-wider select-none">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {children}
      {error && <span className="text-xs text-error font-medium mt-0.5">{error}</span>}
    </div>
  );
};
