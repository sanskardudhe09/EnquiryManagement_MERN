import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  const icon = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl ${bgColor} animate-in slide-in-from-top-5 backdrop-blur-sm min-w-[300px]`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity duration-200 p-1 rounded hover:bg-black/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
