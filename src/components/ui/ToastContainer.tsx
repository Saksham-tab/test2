import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg border text-xs leading-relaxed transition-all duration-300 transform translate-y-0 ${
              isError
                ? 'bg-[#FDF4F2] border-[#F2C5BD] text-[#8D4733]'
                : isInfo
                ? 'bg-[#F5EFEB] border-[#D5CCC0] text-[#23201D]'
                : 'bg-[#F1F6EF] border-[#CDE0C8] text-[#34462E]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError ? (
                <AlertCircle size={15} className="text-[#A35843]" />
              ) : isInfo ? (
                <Info size={15} className="text-[#635F59]" />
              ) : (
                <CheckCircle2 size={15} className="text-[#434D3D]" />
              )}
            </div>

            <div className="flex-1 font-medium">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-current opacity-60 hover:opacity-100 p-0.5 rounded transition-opacity"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
