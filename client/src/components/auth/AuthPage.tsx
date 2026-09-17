import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Package,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { tactileAudio } from '../../utils/audio';
import { CountryCodeDropdown } from '../common/CountryCodeDropdown';
import { type CountryCode, DEFAULT_COUNTRY } from '../../constants/countryCodes';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onBackToHome: () => void;
  onSuccess?: (mode?: 'signin' | 'signup') => void;
  onExploreCollection?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onBackToHome,
  onSuccess,
  onExploreCollection,
}) => {
  const { language, t } = useLanguage();
  const { login, register } = useAuth();
  const { showToast } = useNotification();
  const isAr = language === 'ar';

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter your email and password');
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

    try {
      let loggedInUser;
      if (mode === 'signin') {
        loggedInUser = await login(email.trim(), password);
      } else {
        const cleanPhone = phone.trim().replace(/^0+/, '');
        const fullPhone = cleanPhone ? `${selectedCountry.dialCode} ${cleanPhone}` : '';
        loggedInUser = await register(fullName.trim(), email.trim(), password, fullPhone);
      }

      setIsSubmitting(false);
      tactileAudio.playChime();
      const msg = mode === 'signin' ? t.loginSuccess : t.registerSuccess;
      setSuccessMessage(msg);

      setTimeout(() => {
        if (loggedInUser.role === 'admin' || loggedInUser.email.toLowerCase() === 'byhadab@gmail.com') {
          window.location.hash = 'admin';
        } else if (mode === 'signup') {
          onBackToHome();
        } else if (onSuccess) {
          onSuccess('signin');
        } else {
          onBackToHome();
        }
      }, 1000);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || (isAr ? 'حدث خطأ أثناء تسجيل الدخول' : 'Authentication failed'));
    }
  };

  return (
    <div className="min-h-screen bg-cream-200 text-brown-800 font-sans pb-24 selection:bg-blush-200 selection:text-brown-900 flex flex-col justify-between">
      {/* Sub-Header Bar with Back Navigation */}
      <div className="border-b border-brown-200/70 bg-cream-100/90 backdrop-blur-md sticky top-[53px] sm:top-[63px] z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brown-700 hover:text-burgundy-600 transition-colors min-h-[44px]"
          >
            <ArrowLeft
              size={14}
              className={`${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`}
            />
            <span>{t.backToHome}</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-brown-500">
            <ShieldCheck size={14} className="text-burgundy-600" />
            <span>{t.authBadge}</span>
          </div>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 w-full flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left / Editorial Brand Narrative Card (5 cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream-100 border border-brown-200 text-[10.5px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-600 shadow-warm-sm self-start">
              <Sparkles size={12} className="text-burgundy-600" />
              <span>{isAr ? 'عائلة هَدَب' : 'HADAB Community'}</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl text-brown-900 font-normal leading-tight">
                {isAr ? 'انضمي إلى عائلة هَدَب' : 'Join the HADAB Family'}
              </h2>
              <p className="text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                {isAr
                  ? 'مشروعنا المنزلي مقره الأردن ونشحن جميع القطع المحبوكة يدوياً مباشرة إلى الكويت. سجلي دخولك لمتابعة طلباتك.'
                  : 'Handmade crochet & knitwear crafted with care in Jordan and shipped directly to Kuwait. Sign in to track your orders.'}
              </p>
            </div>

            {/* Member Benefits List */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF6F0] border border-brown-200/50 shadow-sm">
                <div className="p-2 rounded-xl bg-[#EDE4D8]/80 text-brown-800 shrink-0 mt-0.5">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-brown-900 mb-0.5 tracking-wide">
                    {t.memberBenefit1}
                  </h3>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'إشعارات حصرية عند حياكة وتجهيز الدفعات الأرشيفية المحدودة قبل طرحها للعامة.'
                      : 'Private alerts when new seasonal colorways and single-maker batches are hooked.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF6F0] border border-brown-200/50 shadow-sm">
                <div className="p-2 rounded-xl bg-[#EDE4D8]/80 text-brown-800 shrink-0 mt-0.5">
                  <Heart size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-brown-900 mb-0.5 tracking-wide">
                    {t.memberBenefit2}
                  </h3>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'حقيبتك وقائمتك المفضلة محفوظة بأمان وتتنقل معك بسلاسة بين الهاتف والحاسوب.'
                      : 'Persistent bag and wishlist state effortlessly synced across your mobile and desktop.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF6F0] border border-brown-200/50 shadow-sm">
                <div className="p-2 rounded-xl bg-[#EDE4D8]/80 text-brown-800 shrink-0 mt-0.5">
                  <Layers size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-brown-900 mb-0.5 tracking-wide">
                    {t.memberBenefit3}
                  </h3>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'متابعة حية للقطع قيد الحياكة من الورشة في عمّان أو الكويت حتى وصولها إليك.'
                      : 'Direct oversight on bespoke pieces as they progress from raw thread to your doorstep.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Link to Collection */}
            {onExploreCollection && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onExploreCollection}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brown-700 hover:text-burgundy-600 transition-colors cursor-pointer"
                >
                  <span>{t.navCollection}</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Right / Interactive Form Card (7 cols on Desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
            <div className="bg-[#FAF6F0] rounded-[32px] sm:rounded-[36px] border border-brown-200/60 shadow-[0_12px_40px_rgba(61,45,37,0.06)] p-7 sm:p-12 w-full max-w-[500px]">
              
              {/* Segmented Mode Selector (Sign In vs Sign Up Pill like screenshot) */}
              <div className="flex rounded-full bg-[#EDE4D8]/80 p-1 border border-brown-200/50 mb-8">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className={`flex-1 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                      : 'text-brown-700/80 hover:text-brown-900'
                  }`}
                >
                  <span>{t.signInTab}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className={`flex-1 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                      : 'text-brown-700/80 hover:text-brown-900'
                  }`}
                >
                  <span>{t.signUpTab}</span>
                </button>
              </div>

              {/* Form Title & Subtitle */}
              <div className="mb-6">
                <h1 className="font-serif text-2xl sm:text-3xl text-brown-900 font-normal">
                  {mode === 'signin' ? t.signInTitle : t.signUpTitle}
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-brown-500 font-light leading-relaxed">
                  {mode === 'signin' ? t.signInSubtitle : t.signUpSubtitle}
                </p>
              </div>

              {/* Status Notifications */}
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name field (Sign Up Only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-800 mb-1.5">
                      {t.fullNameLabel} <span className="text-burgundy-500">*</span>
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
                        className={`w-full ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 rounded-2xl bg-[#F4EFEA] border border-brown-200/50 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/70 focus:bg-white transition-all`}
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-800 mb-1.5">
                    {t.emailLabel} <span className="text-burgundy-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail
                      size={16}
                      className={`absolute ${isAr ? 'right-4' : 'left-4'} text-brown-400 pointer-events-none`}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 rounded-2xl bg-[#F4EFEA] border border-brown-200/50 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/70 focus:bg-white transition-all`}
                    />
                  </div>
                </div>

                {/* Phone Number (Sign Up Optional) with Country Code Dropdown */}
                {mode === 'signup' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-800">
                        {t.phoneLabel}
                      </label>
                      <span className="text-[10px] text-brown-400 font-light">
                        {isAr ? selectedCountry.nameAr : selectedCountry.name}
                      </span>
                    </div>
                    <div className="relative flex items-center rounded-2xl bg-[#F4EFEA] border border-brown-200/50 focus-within:ring-2 focus-within:ring-blush-300/70 focus-within:bg-white focus-within:border-transparent transition-all">
                      <CountryCodeDropdown
                        selectedCountry={selectedCountry}
                        onSelectCountry={setSelectedCountry}
                        isAr={isAr}
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
                        placeholder={selectedCountry.sample || '9999 8888'}
                        className={`w-full py-3.5 ${
                          isAr ? 'pr-3 pl-4' : 'pl-3 pr-4'
                        } bg-transparent text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none`}
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-800">
                      {t.passwordLabel} <span className="text-burgundy-500">*</span>
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          tactileAudio.playScrubTick(300);
                          showToast(
                            isAr ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' : 'Password reset link sent to your email',
                            'success'
                          );
                        }}
                        className="text-[11px] text-brown-500 hover:text-burgundy-600 transition-colors font-light cursor-pointer"
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
                      className={`w-full ${isAr ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3.5 rounded-2xl bg-[#F4EFEA] border border-brown-200/50 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/70 focus:bg-white transition-all`}
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

                {/* Confirm Password (Sign Up Only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-brown-800 mb-1.5">
                      {t.confirmPasswordLabel} <span className="text-burgundy-500">*</span>
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
                        className={`w-full ${isAr ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3.5 rounded-2xl bg-[#F4EFEA] border border-brown-200/50 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light focus:outline-none focus:ring-2 focus:ring-blush-300/70 focus:bg-white transition-all`}
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

                {/* Remember Me Checkbox (Sign In) */}
                {mode === 'signin' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-brown-300 text-[#2E221B] focus:ring-[#2E221B] accent-[#2E221B] cursor-pointer"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-xs text-brown-600 font-light cursor-pointer select-none"
                    >
                      {t.rememberMe}
                    </label>
                  </div>
                )}

                {/* Terms Agreement notice (Sign Up) */}
                {mode === 'signup' && (
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed pt-1">
                    {t.termsNotice}{' '}
                    <span className="text-burgundy-600 font-medium underline cursor-pointer">
                      {t.termsLink}
                    </span>{' '}
                    &amp;{' '}
                    <span className="text-burgundy-600 font-medium underline cursor-pointer">
                      {t.privacyLink}
                    </span>
                    .
                  </p>
                )}

                {/* Submit Button (Deep Brown Pill Button) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl sm:rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-warm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{mode === 'signin' ? t.signInButton : t.signUpButton}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login Options */}
              <div className="mt-8 pt-6 border-t border-brown-200/50">
                <div className="text-center text-[10px] uppercase tracking-[0.24em] text-brown-400 font-medium mb-4">
                  {t.orContinueWith}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      tactileAudio.playScrubTick(360);
                      showToast(isAr ? 'تسجيل الدخول عبر Google متاح قريباً' : 'Google sign-in available soon', 'info');
                    }}
                    className="py-3 px-4 rounded-full border border-brown-200/70 bg-white hover:bg-[#FDFBF7] text-brown-800 text-xs font-medium transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      tactileAudio.playScrubTick(360);
                      showToast(isAr ? 'تسجيل الدخول عبر Apple متاح قريباً' : 'Apple sign-in available soon', 'info');
                    }}
                    className="py-3 px-4 rounded-full border border-brown-200/70 bg-white hover:bg-[#FDFBF7] text-brown-800 text-xs font-medium transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.66 1.37-.57.65-1.06 1.73-.93 2.76 1.03.08 2.07-.51 2.67-1.26z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              {/* Bottom Switcher link */}
              <div className="mt-6 text-center text-xs text-brown-600 font-light">
                {mode === 'signin' ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-burgundy-600 font-semibold hover:underline ms-1 cursor-pointer"
                >
                  {mode === 'signin' ? t.switchToSignUp : t.switchToSignIn}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
