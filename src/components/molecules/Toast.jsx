import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-brand-primary" />
  };

  const borderColors = {
    success: 'border-success/20 shadow-success/5',
    error: 'border-error/20 shadow-error/5',
    info: 'border-brand-primary/20 shadow-brand-primary/5'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-bg-surface border ${borderColors[type]} shadow-xl max-w-md animate-bounce-in`}>
      {icons[type]}
      <div className="flex-1 pr-2">
        <p className="text-sm font-semibold text-txt-base leading-snug">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-bg-base text-txt-muted hover:text-txt-base transition-colors cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
