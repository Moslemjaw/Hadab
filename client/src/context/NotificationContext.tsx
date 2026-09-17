import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { tactileAudio } from '../utils/audio';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export interface PromptOptions {
  title?: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

interface NotificationContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  confirmDialog: (options: ConfirmOptions | string) => Promise<boolean>;
  promptDialog: (options: PromptOptions | string) => Promise<string | null>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const [promptState, setPromptState] = useState<{
    isOpen: boolean;
    options: PromptOptions;
    value: string;
    resolve: (val: string | null) => void;
  } | null>(null);

  const promptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promptState?.isOpen) {
      setTimeout(() => {
        promptInputRef.current?.focus();
        promptInputRef.current?.select();
      }, 50);
    }
  }, [promptState?.isOpen]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    title?: string,
    duration: number = 3800
  ) => {
    tactileAudio.playScrubTick(type === 'error' ? 240 : 380);
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    setToasts((prev) => [...prev, { id, message, type, title, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const confirmDialog = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    tactileAudio.playScrubTick(320);
    const opts: ConfirmOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options: opts,
        resolve: (val: boolean) => {
          setConfirmState(null);
          resolve(val);
        },
      });
    });
  }, []);

  const promptDialog = useCallback((options: PromptOptions | string): Promise<string | null> => {
    tactileAudio.playScrubTick(320);
    const opts: PromptOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      setPromptState({
        isOpen: true,
        options: opts,
        value: opts.defaultValue || '',
        resolve: (val: string | null) => {
          setPromptState(null);
          resolve(val);
        },
      });
    });
  }, []);

  // Intercept window.alert, window.confirm, and window.prompt as a graceful safety net
  useEffect(() => {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    window.alert = (msg?: any) => {
      const text = String(msg ?? '');
      const isSuccess = text.includes('✓') || text.toLowerCase().includes('success');
      const isError = text.toLowerCase().includes('fail') || text.toLowerCase().includes('error');
      showToast(text, isSuccess ? 'success' : isError ? 'error' : 'info');
    };

    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';

  return (
    <NotificationContext.Provider value={{ showToast, confirmDialog, promptDialog }}>
      {children}

      {/* Floating Atelier Toasts Container */}
      <div 
        className="fixed top-4 sm:top-6 inset-x-0 z-[9999] pointer-events-none flex flex-col items-center gap-2.5 px-4 max-w-md mx-auto"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = 'text-cream-200 bg-brown-800';
          let borderAccent = 'border-brown-700/80';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            iconColor = 'text-sage-400 bg-sage-950/60';
            borderAccent = 'border-sage-800/60';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            iconColor = 'text-rose-300 bg-rose-950/60';
            borderAccent = 'border-rose-900/60';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-300 bg-amber-950/60';
            borderAccent = 'border-amber-900/60';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto w-full max-w-sm rounded-2xl bg-[#241A15]/95 backdrop-blur-md text-cream-100 p-3.5 sm:p-4 shadow-2xl shadow-brown-950/50 border ${borderAccent} flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-3`}
            >
              <div className={`p-1.5 rounded-xl shrink-0 ${iconColor}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                {toast.title && (
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-cream-100 leading-tight mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-cream-200/90 leading-relaxed font-light break-words">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-cream-400 hover:text-cream-100 p-1 -mt-1 -mr-1 transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Luxury Confirmation Modal */}
      {confirmState?.isOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-brown-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={() => confirmState.resolve(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#FAF6F0] border border-brown-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#2C221E] flex items-center justify-center shadow-md">
              <img src="/motif-cream.png" alt="HADAB" className="w-6 h-6 object-contain" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl text-brown-900 font-normal">
                {confirmState.options.title || (isRtl ? 'تأكيد الإجراء' : 'Confirm Action')}
              </h3>
              <p className="text-xs sm:text-sm text-brown-600 leading-relaxed max-w-xs mx-auto">
                {confirmState.options.message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(280);
                  confirmState.resolve(false);
                }}
                className="px-5 py-2.5 rounded-full border border-brown-300 hover:border-brown-400 bg-white hover:bg-[#F5EFEB] text-brown-800 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                {confirmState.options.cancelText || (isRtl ? 'إلغاء' : 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(400);
                  confirmState.resolve(true);
                }}
                className={`px-6 py-2.5 rounded-full text-cream-100 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md ${
                  confirmState.options.isDanger
                    ? 'bg-burgundy-700 hover:bg-burgundy-800'
                    : 'bg-brown-900 hover:bg-brown-950'
                }`}
              >
                {confirmState.options.confirmText || (isRtl ? 'تأكيد' : 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Prompt Modal */}
      {promptState?.isOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-brown-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={() => promptState.resolve(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#FAF6F0] border border-brown-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#2C221E] flex items-center justify-center shadow-md">
              <img src="/motif-cream.png" alt="HADAB" className="w-6 h-6 object-contain" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl text-brown-900 font-normal">
                {promptState.options.title || (isRtl ? 'تأكيد الإجراء' : 'Confirmation')}
              </h3>
              <p className="text-xs sm:text-sm text-brown-600 leading-relaxed">
                {promptState.options.message}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                tactileAudio.playScrubTick(400);
                promptState.resolve(promptState.value);
              }}
              className="space-y-4"
            >
              <input
                ref={promptInputRef}
                type="text"
                value={promptState.value}
                onChange={(e) => setPromptState((prev) => prev ? { ...prev, value: e.target.value } : null)}
                placeholder={promptState.options.placeholder || ''}
                className="w-full px-4 py-2.5 rounded-2xl border border-brown-300 bg-white text-brown-900 text-sm focus:outline-none focus:ring-2 focus:ring-brown-500 shadow-inner"
              />

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    tactileAudio.playScrubTick(280);
                    promptState.resolve(null);
                  }}
                  className="px-5 py-2.5 rounded-full border border-brown-300 hover:border-brown-400 bg-white hover:bg-[#F5EFEB] text-brown-800 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  {promptState.options.cancelText || (isRtl ? 'إلغاء' : 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brown-900 hover:bg-brown-950 text-cream-100 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  {promptState.options.confirmText || (isRtl ? 'تأكيد' : 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return ctx;
};
