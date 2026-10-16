'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import UiIcon from '@/components/UiIcon';

const ToastContext = createContext({
  showToast: () => {}
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = '', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" id="toastContainer">
        {toasts.map(t => {
          const icon = t.type === 'success' ? 'checkCircle' : t.type === 'danger' ? 'alertCircle' : 'info';
          return (
            <div key={t.id} className={`toast ${t.type}`}>
              <span className="toast-icon">
                <UiIcon name={icon} />
              </span>
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
