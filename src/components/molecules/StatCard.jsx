import React from 'react';

export const StatCard = ({ title, value, icon: Icon, description, className = '' }) => {
  return (
    <div className={`p-6 rounded-2xl bg-bg-surface border border-border-base flex items-center justify-between shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${className}`}>
      <div className="flex flex-col gap-1 text-left">
        <span className="text-xs font-semibold text-txt-muted uppercase tracking-wider">{title}</span>
        <span className="text-3xl font-black text-txt-base tracking-tight">{value}</span>
        {description && <span className="text-xs text-txt-muted mt-1">{description}</span>}
      </div>
      {Icon && (
        <div className="p-3.5 rounded-xl bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
