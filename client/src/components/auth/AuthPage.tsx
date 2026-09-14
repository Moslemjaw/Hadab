import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Globe,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { tactileAudio } from '../../utils/audio';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onBackToHome: () => void;
  onSuccess?: () => void;
  onExploreCollection?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onBackToHome,
  onSuccess,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const isAr = language === 'ar';

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email, username, or phone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    tactileAudio.playScrubTick(320);
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(
        isAr
          ? 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور'
          : 'Please enter your username/email and password'
      );
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage(isAr ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
        return;
      }
    }

    setIsSubmitting(true);
    tactileAudio.playScrubTick(440);

    setTimeout(() => {
      setIsSubmitting(false);
      tactileAudio.playChime();
      const msg = mode === 'signin' ? t.loginSuccess : t.registerSuccess;
      setSuccessMessage(msg);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onBackToHome();
        }
      }, 1300);
    }, 850);
  };

  return (
    <div className="min-h-screen w-full bg-cream-50 text-brown-800 font-sans flex flex-col lg:flex-row select-none selection:bg-blush-200 selection:text-brown-900">
      {/* =========================================================================
          LEFT SIDE: EDITORIAL BRAND SHOWCASE WITH FRAME001 LOGO & SOFT GRADIENTS
      ========================================================================== */}
      <div className="relative w-full lg:w-1/2 min-h-[42vh] lg:min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-[#F5ECE2] via-[#EFE4D6] to-[#E9DDD0]">
        
        {/* Soft Fluid Organic Backing Shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blush-200/45 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-24 w-[28rem] h-[28rem] rounded-full bg-cream-200/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-cream-100/50 blur-2xl pointer-events-none" />

        {/* Ambient Subtle Fabric Pattern */}
        <div className="absolute inset-0 texture-subtle opacity-35 pointer-events-none" />

        {/* Centerpiece Showcase Container */}
        <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">
          
          {/* Framed Logo Pill Card (featuring frame 001 icon) */}
          <div className="relative mb-8 group">
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blush-300/40 via-cream-100/50 to-brown-300/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-56 sm:w-64 h-36 sm:h-40 rounded-[28px] bg-cream-100/90 backdrop-blur-xl border border-white/60 shadow-warm-lg flex flex-col items-center justify-center p-4 transition-transform duration-500 group-hover:scale-[1.02]">
              {/* ezgif-frame-001 as the centerpiece logo artwork */}
              <img
                src="/frames/ezgif-frame-001.jpg"
                alt="HADAB Motif"
                className="w-20 sm:w-24 h-20 sm:h-24 object-contain mix-blend-multiply transition-transform duration-700 group-hover:rotate-3"
              />
              <span className="font-serif italic text-sm text-brown-800 tracking-wider mt-1 font-medium">
                {isAr ? 'هَدَب للأتيليه' : 'hadab atelier'}
              </span>
            </div>
          </div>

          {/* Platform / Brand Title */}
          <h2 className="font-serif text-2xl sm:text-4xl text-brown-900 font-normal tracking-tight mb-3">
            {isAr ? 'مشغل الحرف البطيئة والنسيج اليدوي' : 'Slow Craft Crochet Atelier'}
          </h2>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed max-w-sm">
            {isAr
              ? 'بوابتكِ الحصرية لمتابعة حياكة القطع، والوصول المبكر إلى مجموعات الأرشيف المحدودة في الأردن والكويت.'
              : 'Discover numbered drop collections, track each deliberate stitch, and experience the quiet luxury of mindful craftsmanship.'}
          </p>
        </div>

        {/* Bottom subtle copyright / craft marker */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-[0.25em] text-brown-400 font-light">
          {isAr ? 'صُنعت باليد • غرزة تلو الأخرى' : 'Hooked by Hand • Jordan & Kuwait'}
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: CLEAN, MINIMALIST & SPACIOUS INPUTS FORM
      ========================================================================== */}
      <div className="relative w-full lg:w-1/2 min-h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-cream-50">
        
        {/* Top Floating Mini Bar (Home + Language Switcher) */}
        <div className="w-full flex items-center justify-end gap-2.5 mb-8 sm:mb-12">
          {/* Home Button */}
          <button
            type="button"
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200/90 border border-brown-200/70 text-brown-700 hover:text-brown-900 text-xs font-light tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            aria-label="Back to Home"
          >
            <Home size={13} className="text-brown-500" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200/90 border border-brown-200/70 text-brown-700 hover:text-brown-900 text-xs font-light tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe size={13} className="text-brown-500" />
            <span className={isAr ? 'font-sans' : 'font-arabic'}>
              {isAr ? 'English' : 'العربية'}
            </span>
          </button>
        </div>

        {/* Center Content: Form */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          
          {/* Headings */}
          <div className="mb-7">
            <h1 className="font-serif text-3xl sm:text-4xl text-brown-900 font-normal tracking-tight">
              {mode === 'signin' ? t.signInTitle : t.signUpTitle}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-brown-500 font-light leading-relaxed">
              {mode === 'signin'
                ? (isAr ? 'سجّلي دخولكِ إلى حسابك في مشغل هَدَب' : 'Sign in to your HADAB Atelier account')
                : (isAr ? 'أنشئي حسابكِ للوصول إلى تفاصيل الأرشيف' : 'Create an account to join the atelier circle')}
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-burgundy-50 border border-burgundy-200/80 text-burgundy-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-sage-100 border border-sage-400/50 text-brown-900 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 size={16} className="text-sage-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Clean Interactive Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-700 mb-1.5">
                  {t.fullNameLabel}
                </label>
                <div className="relative flex items-center">
                  <UserIcon
                    size={16}
                    className={`absolute ${isAr ? 'right-4' : 'left-4'} text-brown-400 pointer-events-none`}
                  />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className={`w-full ${
                      isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'
                    } py-3.5 rounded-2xl bg-[#EBE4DA]/75 focus:bg-cream-100 border border-brown-200/60 focus:border-brown-400 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/60 transition-all shadow-inner`}
                  />
                </div>
              </div>
            )}

            {/* Username / Email / Phone Input */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-700 mb-1.5">
                {isAr ? 'اسم المستخدم، البريد أو الهاتف' : 'Username, Email, or Phone'}
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={16}
                  className={`absolute ${isAr ? 'right-4' : 'left-4'} text-brown-400 pointer-events-none`}
                />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={mode === 'signin' ? 'user@hadab.craft' : t.emailPlaceholder}
                  className={`w-full ${
                    isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'
                  } py-3.5 rounded-2xl bg-[#EBE4DA]/75 focus:bg-cream-100 border border-brown-200/60 focus:border-brown-400 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/60 transition-all shadow-inner`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-700">
                  {t.passwordLabel}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      tactileAudio.playScrubTick(300);
                      alert(
                        isAr
                          ? 'تم إرسال تعليمات استعادة كلمة المرور إلى بريدك'
                          : 'Password recovery instructions sent to your email'
                      );
                    }}
                    className="text-[11px] text-burgundy-600 hover:text-burgundy-700 hover:underline font-light cursor-pointer"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock
                  size={16}
                  className={`absolute ${isAr ? 'right-4' : 'left-4'} text-brown-400 pointer-events-none`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${
                    isAr ? 'pr-11 pl-11' : 'pl-11 pr-11'
                  } py-3.5 rounded-2xl bg-[#EBE4DA]/75 focus:bg-cream-100 border border-brown-200/60 focus:border-brown-400 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/60 transition-all shadow-inner`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isAr ? 'left-3.5' : 'right-3.5'} p-1 text-brown-400 hover:text-brown-700 transition-colors cursor-pointer`}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-700 mb-1.5">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={16}
                    className={`absolute ${isAr ? 'right-4' : 'left-4'} text-brown-400 pointer-events-none`}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full ${
                      isAr ? 'pr-11 pl-11' : 'pl-11 pr-11'
                    } py-3.5 rounded-2xl bg-[#EBE4DA]/75 focus:bg-cream-100 border border-brown-200/60 focus:border-brown-400 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/60 transition-all shadow-inner`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isAr ? 'left-3.5' : 'right-3.5'} p-1 text-brown-400 hover:text-brown-700 transition-colors cursor-pointer`}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Elegant Gradient Action Button (like reference image) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4A4A3] via-[#BE7D7B] to-[#A05C5B] hover:opacity-95 text-white font-medium text-xs sm:text-sm tracking-wide shadow-warm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{mode === 'signin' ? t.signInTab : t.signUpTab}</span>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switcher: Don't have an account? Create account */}
          <div className="mt-8 text-center text-xs text-brown-600 font-light">
            {mode === 'signin' ? (
              <>
                <span>{isAr ? 'ليس لديكِ حساب؟' : "Don't have an account?"}</span>{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="text-burgundy-600 font-medium hover:underline ms-1 cursor-pointer"
                >
                  {isAr ? 'إنشاء حساب جديد' : 'Create account'}
                </button>
              </>
            ) : (
              <>
                <span>{isAr ? 'لديكِ حساب بالفعل؟' : 'Already have an account?'}</span>{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="text-burgundy-600 font-medium hover:underline ms-1 cursor-pointer"
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Minimal Copyright */}
        <div className="w-full text-center text-[11px] text-brown-400 font-light tracking-wider pt-6">
          © {new Date().getFullYear()} HADAB — JORDAN • KUWAIT
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
