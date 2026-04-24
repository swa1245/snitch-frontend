import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)', transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                min-w-[320px] max-w-md px-6 py-4 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] 
                backdrop-blur-xl border flex items-center justify-between gap-6 relative overflow-hidden
                ${toast.type === 'success' ? 'bg-black/90 border-[#FFD700]/30' : 'bg-red-950/90 border-red-500/30'}
              `}>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] italic">
                    {toast.type === 'success' ? 'System Protocol: Success' : 'System Protocol: Error'}
                  </p>
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">
                    {toast.message}
                  </p>
                </div>
                
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-white/40 hover:text-white transition-colors text-xs font-light"
                >
                  ✕
                </button>

                {/* Animated progress bar */}
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-px ${toast.type === 'success' ? 'bg-[#FFD700]' : 'bg-red-500'}`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
