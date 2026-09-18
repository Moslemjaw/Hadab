import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, CheckCircle2, Lock, X } from 'lucide-react';
import { subscribeToPush, getCurrentSubscription, sendTestPush } from '../../services/pushNotifications';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminPushPrompt: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { user, login } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if device already has active push subscription
    getCurrentSubscription().then((sub) => {
      setIsSubscribed(!!sub);
    });
  }, []);

  // Don't show if already subscribed or user dismissed
  if (isSubscribed === true || isSubscribed === null || dismissed) {
    return null;
  }

  const handleOpenPrompt = () => {
    setErrorMsg('');
    setSuccessMsg('');
    // If already admin, subscribe right away
    if (user?.role === 'admin' || user?.email?.toLowerCase() === 'byhadab@gmail.com') {
      handleDirectSubscribe();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDirectSubscribe = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await subscribeToPush('admin');
      if (res.success) {
        setIsSubscribed(true);
        setSuccessMsg(isAr ? 'تم تفعيل الإشعارات بنجاح! تم إرسال إشعار تجريبي لشاشتك.' : 'Notifications activated! A test alert was sent.');
        try { await sendTestPush(); } catch {}
        setTimeout(() => setIsModalOpen(false), 2500);
      } else {
        if (res.error === 'ON_IOS_MUST_ADD_TO_HOME_SCREEN') {
          setErrorMsg(isAr ? 'لتفعيل الإشعارات على الآيفون، يجب إضافة الموقع للشاشة الرئيسية أولاً من زر المشاركة في سفاري.' : 'To enable notifications, please Add to Home Screen from Safari first.');
        } else {
          setErrorMsg(res.error || 'Failed to activate notifications');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error activating push');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminVerifyAndSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Login as admin first
      await login('byhadab@gmail.com', password);
      // Now subscribe device as admin
      const res = await subscribeToPush('admin');
      if (res.success) {
        setIsSubscribed(true);
        setSuccessMsg(isAr ? '🎉 تم تفعيل إشعارات الطلبات لهذا الآيفون بنجاح!' : '🎉 iPhone order notifications enabled successfully!');
        try { await sendTestPush(); } catch {}
        setTimeout(() => setIsModalOpen(false), 2500);
      } else {
        if (res.error === 'ON_IOS_MUST_ADD_TO_HOME_SCREEN') {
          setErrorMsg(isAr ? 'لتفعيل الإشعارات على الآيفون، يجب إضافة الموقع للشاشة الرئيسية أولاً من سفاري ثم فتحه كأيقونة تطبيق.' : 'Please add to Home Screen from Safari first to enable push.');
        } else {
          setErrorMsg(res.error || 'Permission denied or failed.');
        }
      }
    } catch (err: any) {
      setErrorMsg(isAr ? 'كلمة المرور غير صحيحة' : 'Invalid admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sleek Floating Prompt Bar for Store Owner on Mobile */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="fixed bottom-3 inset-x-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#2E221B] text-cream-100 rounded-2xl p-3.5 shadow-2xl border border-cream-200/20 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blush-300 text-brown-900 flex items-center justify-center shrink-0">
            <Bell size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-cream-100 truncate">
              {isAr ? 'إشعارات الطلبات الفورية' : 'Instant Order Notifications'}
            </div>
            <div className="text-[10px] text-cream-200/70 truncate">
              {isAr ? 'تصلك تنبيهات على شاشة القفل فور وصول أي طلب' : 'Get lock screen alerts when customers order'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenPrompt}
            className="px-3 py-1.5 rounded-xl bg-blush-300 hover:bg-blush-200 text-[#2E221B] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            {isAr ? 'تفعيل الآن' : 'Enable'}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-cream-200/50 hover:text-cream-100 transition-colors"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Admin Verification Modal */}
      {isModalOpen && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-[#FAF6F0] rounded-3xl p-6 w-full max-w-sm border border-brown-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#2E221B] text-cream-100 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-brown-900">
                    {isAr ? 'تفعيل إشعارات مسؤول المتجر' : 'Enable Store Owner Alerts'}
                  </h3>
                  <p className="text-[11px] text-brown-500 font-light">
                    {isAr ? 'لربط هذا الآيفون باستقبال طلبات المتجر' : 'Connect this iPhone to receive all new order alerts'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-brown-400 hover:text-brown-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-burgundy-50 border border-burgundy-200 text-burgundy-700 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {!successMsg && (
              <form onSubmit={handleAdminVerifyAndSubscribe} className="space-y-3.5">
                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-brown-700 mb-1">
                    {isAr ? 'كلمة مرور إدارة هَدَب' : 'Admin Password'}
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} text-brown-400`} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-[#2E221B]`}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-brown-500 leading-relaxed bg-cream-100 p-2.5 rounded-xl border border-brown-200/50">
                  {isAr
                    ? 'بعد الضغط على تفعيل، ستظهر لك نافذة من نظام الآبل تطلب السماح بالإشعارات، اضغط على "السماح" (Allow).'
                    : 'After tapping Enable, iOS will prompt you to Allow notifications. Tap Allow to complete setup.'}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#2E221B] hover:bg-brown-800 text-cream-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Bell size={14} />
                  <span>{loading ? (isAr ? 'جاري التفعيل...' : 'Activating...') : (isAr ? 'تفعيل الإشعارات على هذا الآيفون' : 'Activate on this iPhone')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
