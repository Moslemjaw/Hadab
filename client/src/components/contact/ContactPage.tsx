import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { tactileAudio } from '../../utils/audio';
import { api } from '../../services/api';

interface ContactPageProps {
  onBackToHome: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenCustomerDashboard?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onOpenAuth,
  onOpenCustomerDashboard,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const isAr = language === 'ar';

  const [subject, setSubject] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast(
        isAr ? 'يرجى تسجيل الدخول أولاً لإرسال رسالة' : 'Please sign in to send a message',
        'info'
      );
      onOpenAuth('signin');
      return;
    }

    if (!subject.trim() || !message.trim()) {
      showToast(
        isAr ? 'يرجى تعبئة عنوان الرسالة ومحتواها' : 'Please provide a subject and message',
        'error'
      );
      return;
    }

    try {
      setIsSending(true);
      tactileAudio.playScrubTick(320);

      await api.sendMessage({
        subject: subject.trim(),
        message: message.trim(),
        orderNumber: orderNumber.trim(),
        senderName: user.name || user.email.split('@')[0],
        senderPhone: senderPhone.trim(),
      });

      tactileAudio.playChime();
      setSentSuccess(true);
      showToast(
        isAr
          ? 'تم إرسال رسالتك بنجاح! ستصلك إشعارات فورية عند رد فريقنا'
          : 'Message sent! Our artisan team will reply shortly',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to submit message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-brown-900 flex flex-col justify-between selection:bg-burgundy-600/20">
      {/* Top Editorial Bar */}
      <div className="border-b border-brown-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="group flex items-center gap-2 text-xs font-medium text-brown-700 hover:text-burgundy-600 transition-colors cursor-pointer"
          >
            <ArrowLeft
              size={14}
              className={`${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`}
            />
            <span>{isAr ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-brown-500">
            <Sparkles size={13} className="text-burgundy-600" />
            <span>{isAr ? 'تواصل معنا' : 'Contact Concierge'}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left / Editorial Info Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream-100 border border-brown-200 text-[10.5px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-600 shadow-warm-sm">
              <MessageSquare size={12} className="text-burgundy-600" />
              <span>{isAr ? 'فريق هَدَب' : 'HADAB Support'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl text-brown-900 font-normal leading-tight">
                {isAr ? 'نسعد دائماً بسماع صوتكِ' : 'We Would Love to Hear From You'}
              </h1>
              <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                {isAr
                  ? 'سواء كان لديكِ استفسار عن مقاسات أو خيوط قطعة معينة، طلب خاص، أو متابعة شحنتك، يمكنك مراسلتنا مباشرة وسنرد عليكِ في أقرب وقت.'
                  : 'Whether you have questions about custom colorways, bespoke sizing, or tracking an active crochet order, send us a note and we will respond promptly.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-brown-200/70 shadow-sm">
                <div className="p-2.5 rounded-xl bg-[#FAF6F0] text-burgundy-600 shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-brown-900 mb-0.5">
                    {isAr ? 'أوقات الرد والاستجابة' : 'Response Times'}
                  </h4>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'نرد على جميع الاستفسارات خلال 24 ساعة عبر رسائل لوحة التحكم الخاصة بكِ.'
                      : 'We typically review and respond to inquiries within 24 hours directly in your account dashboard.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-brown-200/70 shadow-sm">
                <div className="p-2.5 rounded-xl bg-[#FAF6F0] text-burgundy-600 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-brown-900 mb-0.5">
                    {isAr ? 'متابعة مباشرة في حسابكِ' : 'Track In Your Dashboard'}
                  </h4>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'جميع رسائلك وردود المتجر محفوظة ومرتبطة بحسابكِ لتتمكني من مراجعتها في أي وقت.'
                      : 'All messages and direct artisan replies are stored securely in your customer dashboard.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Message Form Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-warm-lg border border-brown-200/80 relative overflow-hidden">
              
              {!user ? (
                /* Unauthenticated State — Must Login Notice */
                <div className="text-center py-10 sm:py-14 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-brown-200 text-burgundy-600 mx-auto flex items-center justify-center shadow-inner">
                    <LogIn size={24} />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-brown-900">
                    {isAr ? 'تسجيل الدخول مطلوب للمراسلة' : 'Account Sign-In Required'}
                  </h3>
                  <p className="text-xs sm:text-sm text-brown-600 font-light max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? 'حرصاً على حفظ رسائلك وتتبع ردود فريق هَدَب في حسابك، يُرجى تسجيل الدخول أو إنشاء حساب جديد للبدء في التواصل.'
                      : 'To track replies and keep our conversations securely attached to your profile, please sign in or create an account.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenAuth('signin')}
                      className="px-6 py-2.5 rounded-full bg-[#2D2421] hover:bg-[#423430] text-cream-100 text-xs font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('signup')}
                      className="px-6 py-2.5 rounded-full border border-brown-300 text-brown-800 hover:bg-cream-100 text-xs font-medium transition-all active:scale-95 cursor-pointer"
                    >
                      {isAr ? 'إنشاء حساب' : 'Create Account'}
                    </button>
                  </div>
                </div>
              ) : sentSuccess ? (
                /* Success State */
                <div className="text-center py-10 sm:py-12 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-serif text-2xl text-brown-900">
                    {isAr ? 'تم استلام رسالتكِ بنجاح ✓' : 'Message Sent Successfully ✓'}
                  </h3>
                  <p className="text-xs sm:text-sm text-brown-600 font-light max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? 'تم إشعار إدارة هَدَب برسالتكِ. يمكنكِ متابعة حالة الرسالة وردود الفريق مباشرة من لوحة التحكم الخاصة بحسابكِ.'
                      : 'Our team was notified of your message. You can track status and our reply directly in your customer dashboard.'}
                  </p>
                  <div className="pt-3 flex items-center justify-center gap-3">
                    {onOpenCustomerDashboard && (
                      <button
                        type="button"
                        onClick={onOpenCustomerDashboard}
                        className="px-5 py-2.5 rounded-full bg-[#2D2421] hover:bg-[#423430] text-cream-100 text-xs font-medium transition-all cursor-pointer shadow-sm"
                      >
                        {isAr ? 'متابعة في لوحة التحكم' : 'View in Dashboard'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSentSuccess(false);
                        setSubject('');
                        setMessage('');
                        setOrderNumber('');
                      }}
                      className="px-5 py-2.5 rounded-full border border-brown-300 text-brown-800 hover:bg-cream-100 text-xs font-medium transition-all cursor-pointer"
                    >
                      {isAr ? 'إرسال رسالة أخرى' : 'Send Another'}
                    </button>
                  </div>
                </div>
              ) : (
                /* The Active Contact Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-brown-900 font-normal">
                      {isAr ? 'أرسلي رسالة مباشرة' : 'Send Us a Direct Message'}
                    </h3>
                    <p className="text-xs text-brown-500 font-light mt-1">
                      {isAr
                        ? `مرحباً ${user.name} (${user.email})`
                        : `Signed in as ${user.name} (${user.email})`}
                    </p>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-xs font-medium text-brown-800 mb-1.5">
                      {isAr ? 'عنوان الرسالة أو الموضوع *' : 'Subject *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={
                        isAr
                          ? 'مثال: استفسار عن مقاس حقيبة معينة / طلب لون خاص'
                          : 'e.g. Inquiring about tote bag dimensions or custom colorway'
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-[#FAF7F2] text-xs text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-1 focus:ring-burgundy-500 transition-all"
                    />
                  </div>

                  {/* Order Number & Phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-brown-800 mb-1.5">
                        {isAr ? 'رقم الطلب (اختياري)' : 'Order Number (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="e.g. HDB-9281"
                        className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-[#FAF7F2] text-xs text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-1 focus:ring-burgundy-500 transition-all uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brown-800 mb-1.5">
                        {isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="+965 9912 3456"
                        className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-[#FAF7F2] text-xs text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-1 focus:ring-burgundy-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label className="block text-xs font-medium text-brown-800 mb-1.5">
                      {isAr ? 'تفاصيل الرسالة *' : 'Message Details *'}
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isAr
                          ? 'اكتبي رسالتكِ هنا بكل وضوح...'
                          : 'Write your questions or special requests here...'
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-[#FAF7F2] text-xs text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-1 focus:ring-burgundy-500 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3.5 rounded-2xl bg-[#2D2421] hover:bg-[#423430] text-cream-100 text-xs font-medium transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          <span>{isAr ? 'إرسال الرسالة إلى إدارة هَدَب' : 'Send Message to HADAB'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
