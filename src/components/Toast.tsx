import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-brand-primary/30 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 transition-all duration-300 animate-bounce-short">
      <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4" />
      </div>
      <p className="text-xs font-medium whitespace-nowrap">{message}</p>
    </div>
  );
};
