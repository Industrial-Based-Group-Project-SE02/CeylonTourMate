import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200'
  }[type];

  const textColor = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-amber-800'
  }[type];

  const iconColor = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-amber-500'
  }[type];

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={`w-5 h-5 ${iconColor}`} />;
      case 'error':
        return <AlertCircle className={`w-5 h-5 ${iconColor}`} />;
      case 'warning':
        return <AlertCircle className={`w-5 h-5 ${iconColor}`} />;
      case 'info':
      default:
        return <Info className={`w-5 h-5 ${iconColor}`} />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md border rounded-lg shadow-lg ${bgColor} animate-in fade-in slide-in-from-right-4 z-50`}>
      <div className={`p-4 flex items-start gap-3 ${textColor}`}>
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default Toast;
