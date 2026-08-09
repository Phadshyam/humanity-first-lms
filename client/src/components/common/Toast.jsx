import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-forest-green text-surface border-green-soft/40',
    error: 'bg-terracotta text-surface border-terracotta-soft/40',
    info: 'bg-ink text-surface border-line-border'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 shrink-0" />,
    info: <Info className="w-5 h-5 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold font-heading max-w-sm ${styles[type] || styles.success}`}>
        {icons[type] || icons.success}
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-80 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
