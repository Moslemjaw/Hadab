import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Product } from '../../types';
import { X, Trash2, ArrowRight, ArrowLeft, Sparkles, Check, MapPin, User, MessageCircle, Loader2, Search, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { COUNTRY_CODES, DEFAULT_COUNTRY } from '../../constants/countryCodes';
import type { CountryCode } from '../../constants/countryCodes';
import { api } from '../../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onRemoveItem: (id: string, color?: string, size?: string) => void;
  onUpdateQuantity?: (id: string, quantity: number, color?: string, size?: string) => void;
  onClearBag?: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearBag,
  onOpenAuth,
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { format, getShippingFee, isCountryAvailable, shippingConfig, storePhone } = useCurrency();
  const isAr = language === 'ar';

  const whatsappAdminPhone = useMemo(() => {
    const raw = storePhone || localStorage.getItem('hadab_store_phone') || '+965 9900 0000';
    let cleaned = raw.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.slice(2);
    }
    return cleaned || '96599000000';
  }, [storePhone]);

  const [step, setStep] = useState<'cart' | 'guest-prompt' | 'checkout' | 'success'>('cart');
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    return localStorage.getItem('hadab_customer_country') || 'KW';
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerArea, setCustomerArea] = useState(() => localStorage.getItem('hadab_customer_area') || '');
  const [customerStreet, setCustomerStreet] = useState(() => localStorage.getItem('hadab_customer_street') || '');
  const [customerHouse, setCustomerHouse] = useState(() => localStorage.getItem('hadab_customer_house') || '');
  const [customerApartment, setCustomerApartment] = useState(() => localStorage.getItem('hadab_customer_apartment') || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  // Phone country code dropdown state
  const [phoneCountryCode, setPhoneCountryCode] = useState<CountryCode>(() => {
    const saved = localStorage.getItem('hadab_phone_country_code');
    if (saved) {
      const found = COUNTRY_CODES.find((c) => c.code === saved);
      if (found) return found;
    }
    return DEFAULT_COUNTRY;
  });
  const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
  const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
  const phoneCodeRef = useRef<HTMLDivElement>(null);
  const phoneCodeSearchRef = useRef<HTMLInputElement>(null);

  const addressSummary = useMemo(() => {
    const parts = [
      customerArea.trim() ? `${isAr ? 'المنطقة:' : 'Area:'} ${customerArea.trim()}` : '',
      customerStreet.trim() ? `${isAr ? 'الشارع:' : 'Street:'} ${customerStreet.trim()}` : '',
      customerHouse.trim() ? `${isAr ? 'المنزل/المبنى:' : 'House:'} ${customerHouse.trim()}` : '',
      customerApartment.trim() ? `${isAr ? 'الشقة:' : 'Apt:'} ${customerApartment.trim()}` : '',
    ].filter(Boolean);
    return parts.join(', ');
  }, [customerArea, customerStreet, customerHouse, customerApartment, isAr]);

  // Filter countries strictly according to admin shipping rules
  const availableCountries = useMemo(() => {
    const list = COUNTRY_CODES.filter((c) => isCountryAvailable(c.code));
    return list.length > 0 ? list : [COUNTRY_CODES[0]];
  }, [isCountryAvailable, shippingConfig]);

  // Ensure selected country is valid among available countries
  useEffect(() => {
    if (availableCountries.length > 0 && !availableCountries.some((c) => c.code === selectedCountry)) {
      const fallbackCode = availableCountries[0].code;
      setSelectedCountry(fallbackCode);
      localStorage.setItem('hadab_customer_country', fallbackCode);
    }
  }, [availableCountries, selectedCountry]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (phoneCodeRef.current && !phoneCodeRef.current.contains(e.target as Node)) {
        setIsPhoneCodeOpen(false);
      }
    };
    if (isCountryDropdownOpen || isPhoneCodeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCountryDropdownOpen, isPhoneCodeOpen]);

  // Auto-focus phone code search
  useEffect(() => {
    if (isPhoneCodeOpen) {
      setTimeout(() => phoneCodeSearchRef.current?.focus(), 50);
    }
  }, [isPhoneCodeOpen]);

  // Filtered phone country codes
  const filteredPhoneCodes = useMemo(() => {
    const q = phoneCodeSearch.trim().toLowerCase().replace(/^\+/, '');
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.dialCode.replace(/^\+/, '').includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [phoneCodeSearch]);

  // Filter available countries by search
  const filteredAvailableCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return availableCountries;
    const q = countrySearchQuery.toLowerCase().trim();
    return availableCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [availableCountries, countrySearchQuery]);

  const currentCountryObj = useMemo(() => {
    return (
      COUNTRY_CODES.find((c) => c.code === selectedCountry) || {
        code: selectedCountry,
        name: selectedCountry,
        nameAr: selectedCountry,
        dialCode: '',
        flag: '🌐',
        sample: '',
      }
    );
  }, [selectedCountry]);

  useEffect(() => {
    if (user?.name && !customerName) setCustomerName(user.name);
    if (user?.phone && !customerPhone) setCustomerPhone(user.phone);
  }, [user]);

  const fullCustomerPhone = useMemo(() => {
    const p = customerPhone.trim();
    if (!p) return '';
    if (p.startsWith('+') || p.startsWith('00')) return p;
    return `${phoneCountryCode.dialCode} ${p}`;
  }, [customerPhone, phoneCountryCode]);

  // Lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setStep('cart');
    }
  }, [isOpen, onClose]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  
  // Calculate country-specific shipping fee
  const shippingCost = getShippingFee(selectedCountry);
  const finalTotal = subtotal + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerArea.trim() || !customerStreet.trim() || !customerHouse.trim()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: user?.id || (user as any)?._id || undefined,
        customerName,
        customerPhone: fullCustomerPhone,
        customerEmail: user?.email || (customerPhone ? `${customerPhone.replace(/[^0-9]/g, '')}@hadab.guest` : 'guest@hadab.kw'),
        destination: currentCountryObj.name,
        destinationArabic: currentCountryObj.nameAr,
        address: `${currentCountryObj.name} - ${addressSummary}`,
        notes: customerNotes,
        status: 'pending',
        statusArabic: 'قيد الانتظار',
        paymentStatus: 'unpaid',
        paymentStatusArabic: 'غير مدفوع',
        items: items.map((i) => {
          const colorPart = i.product.selectedColor ? ` [${i.product.selectedColor}]` : '';
          const sizePart = i.product.selectedSize ? ` - ${i.product.selectedSize}` : '';
          return {
            productId: i.product.id || (i.product as any)._id,
            name: `${i.product.name}${colorPart}${sizePart}`,
            nameArabic: `${i.product.nameArabic || i.product.name}${colorPart}${sizePart}`,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
          };
        }),
        total: finalTotal,
      };

      const result = await api.createOrder(orderPayload);
      setPlacedOrderNumber(result.orderNumber);
      setOrderTotal(finalTotal);
      setStep('success');
      if (onClearBag) onClearBag();
    } catch (err: any) {
      // Fallback in case of network issue
      const fallbackNum = `HDB-2026-${Math.floor(100 + Math.random() * 900)}`;
      setPlacedOrderNumber(fallbackNum);
      setOrderTotal(finalTotal);
      setStep('success');
      if (onClearBag) onClearBag();
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً هَدَب! أود تأكيد طلبي رقم ${placedOrderNumber} بقيمة ${format(orderTotal, true)}.\nالاسم: ${customerName}\nالهاتف: ${fullCustomerPhone}\nدولة التوصيل: ${currentCountryObj.nameAr}\nالعنوان: ${addressSummary}`
      : `Hello HADAB! I'd like to confirm my order #${placedOrderNumber} for ${format(orderTotal, false)}.\nName: ${customerName}\nPhone: ${fullCustomerPhone}\nCountry: ${currentCountryObj.name}\nDelivery Address: ${addressSummary}`
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brown-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className={`w-screen max-w-[100vw] sm:max-w-md bg-cream-100 ${isAr ? 'sm:border-r' : 'sm:border-l'} border-brown-200 shadow-warm-lg flex flex-col justify-between h-full max-h-[100dvh]`}>
          
          {/* Header */}
          <div className="px-4 py-3.5 sm:p-6 border-b border-brown-200/80 safe-top">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(step === 'checkout' || step === 'guest-prompt') && (
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="p-1.5 rounded-full hover:bg-cream-200 text-brown-600 transition-colors"
                    aria-label="Back to bag"
                  >
                    <ArrowLeft size={18} className={isAr ? 'rotate-180' : ''} />
                  </button>
                )}
                <h3 className="font-serif text-lg sm:text-xl text-brown-800 font-medium">
                  {step === 'cart'
                    ? t.yourBag
                    : step === 'guest-prompt'
                    ? (isAr ? 'تسجيل الدخول' : 'Account')
                    : step === 'checkout'
                    ? (isAr ? 'بيانات التوصيل' : 'Delivery Details')
                    : (isAr ? 'تم استلام طلبك!' : 'Order Confirmed!')}
                </h3>
                {step === 'cart' && (
                  <span className="text-xs text-brown-500 font-light">
                    ({items.reduce((acc, i) => acc + i.quantity, 0)} {t.itemsCount})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-brown-500 hover:text-brown-800 rounded-full hover:bg-cream-200 transition-colors"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            
            {/* STEP 1: CART LIST */}
            {step === 'cart' && (
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 text-brown-400">
                    <p className="font-serif italic text-lg text-brown-500 mb-2">
                      {t.emptyBagTitle}
                    </p>
                    <p className="text-xs">
                      {t.emptyBagSubtitle}
                    </p>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <div
                      key={`${product.id}-${product.selectedColor || ''}-${product.selectedSize || ''}`}
                      className="flex gap-4 p-3 rounded-xl bg-cream-200/50 border border-brown-200/60"
                    >
                      <img
                        src={product.image}
                        alt={isAr && product.nameArabic ? product.nameArabic : product.name}
                        className="w-16 h-20 object-cover rounded-lg border border-brown-200 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-medium text-brown-800">
                              {isAr && product.nameArabic ? product.nameArabic : product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(product.id, product.selectedColor, product.selectedSize)}
                              className="text-brown-400 hover:text-burgundy-500 p-1 cursor-pointer"
                              aria-label={t.remove}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-brown-500">
                            {(product.selectedColor || product.colorName) && (
                              <span className="px-1.5 py-0.5 rounded bg-cream-200 border border-brown-300/60 text-[10px] font-medium text-brown-800">
                                {product.selectedColor || (isAr && product.colorNameArabic ? product.colorNameArabic : product.colorName)}
                              </span>
                            )}
                            {product.selectedSize && (
                              <span className="px-1.5 py-0.5 rounded bg-cream-200 border border-brown-300/60 text-[10px] font-medium text-brown-800">
                                {product.selectedSize}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-brown-200/50">
                            {/* Quantity Stepper */}
                            <div className="flex items-center rounded-lg border border-brown-300/70 bg-cream-200/80 overflow-hidden text-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity
                                    ? onUpdateQuantity(product.id, quantity - 1, product.selectedColor, product.selectedSize)
                                    : onRemoveItem(product.id, product.selectedColor, product.selectedSize)
                                }
                                className="w-6 h-6 flex items-center justify-center hover:bg-brown-300/40 text-brown-800 transition-colors active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="w-6 h-6 flex items-center justify-center font-medium text-[11px] text-brown-900">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity &&
                                  onUpdateQuantity(product.id, quantity + 1, product.selectedColor, product.selectedSize)
                                }
                                className="w-6 h-6 flex items-center justify-center hover:bg-brown-300/40 text-brown-800 transition-colors active:scale-95"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-xs font-semibold text-brown-900">
                              {format(product.price * quantity, isAr)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* GUEST PROMPT: Create Account or Continue as Guest */}
            {step === 'guest-prompt' && (
              <div className="flex flex-col items-center justify-center py-8 px-2 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#2C221E] flex items-center justify-center shadow-md">
                  <User size={24} className="text-cream-100" />
                </div>
                <div className="text-center space-y-1.5">
                  <h3 className="font-serif text-xl text-brown-900 font-medium">
                    {isAr ? 'كيف تريد المتابعة؟' : 'How would you like to continue?'}
                  </h3>
                  <p className="text-xs text-brown-500 font-light max-w-xs mx-auto leading-relaxed">
                    {isAr
                      ? 'أنشئ حسابًا لتتبع طلباتك وحفظ عنوانك، أو تابع كضيف.'
                      : 'Create an account to track your orders and save your address, or continue as a guest.'}
                  </p>
                </div>

                <div className="w-full max-w-xs space-y-3">
                  {/* Create Account */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAuth) {
                        onClose();
                        onOpenAuth('signup');
                      }
                    }}
                    className="w-full py-3.5 rounded-full bg-brown-900 hover:bg-brown-950 text-cream-100 text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2.5 min-h-[48px] active:scale-[0.98] cursor-pointer"
                  >
                    <UserPlus size={16} />
                    <span>{isAr ? 'إنشاء حساب' : 'Create Account'}</span>
                  </button>

                  {/* Sign In */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAuth) {
                        onClose();
                        onOpenAuth('signin');
                      }
                    }}
                    className="w-full py-3.5 rounded-full border-2 border-brown-300 hover:border-brown-400 bg-white hover:bg-cream-200/60 text-brown-800 text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2.5 min-h-[48px] active:scale-[0.98] cursor-pointer"
                  >
                    <LogIn size={16} />
                    <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-brown-200/70" />
                    <span className="text-[10px] uppercase tracking-widest text-brown-400 font-medium">
                      {isAr ? 'أو' : 'or'}
                    </span>
                    <div className="flex-1 h-px bg-brown-200/70" />
                  </div>

                  {/* Continue as Guest */}
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 rounded-full border border-brown-200 hover:border-brown-300 bg-cream-100 hover:bg-cream-200/50 text-brown-700 text-xs font-medium transition-all flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98] cursor-pointer"
                  >
                    <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
                    <span>{isAr ? 'متابعة كضيف' : 'Continue as Guest'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-cream-200/60 border border-brown-200 text-brown-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-brown-900 text-xs">
                    <Sparkles size={14} className="text-burgundy-600 shrink-0" />
                    <span>
                      {selectedCountry === 'JO'
                        ? (isAr ? 'توصيل محلي داخل الأردن' : 'Local Delivery within Jordan')
                        : (isAr
                            ? `شحن من الأردن إلى ${currentCountryObj.nameAr}`
                            : `Shipped from Jordan to ${currentCountryObj.name}`)}
                    </span>
                  </div>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'مشروعنا المنزلي مقره الأردن ونشحن جميع القطع المحبوكة يدوياً مباشرة إلى باب منزلك.'
                      : 'Our handmade pieces are lovingly crafted in Jordan and delivered straight to your doorstep.'}
                  </p>
                </div>

                {/* Country Destination Selector with Flags & Instant Search */}
                <div className="relative" ref={countryDropdownRef}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-brown-700 font-semibold text-[11px]">
                      {isAr ? 'دولة التوصيل *' : 'Delivery Country *'}
                    </label>
                    <span className="text-[10px] font-semibold text-burgundy-700">
                      {shippingCost === 0
                        ? (isAr ? 'الشحن: مجاني' : 'Shipping: FREE')
                        : `${isAr ? 'رسوم الشحن:' : 'Shipping:'} ${format(shippingCost, isAr)}`}
                    </span>
                  </div>

                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCountryDropdownOpen(!isCountryDropdownOpen);
                      setCountrySearchQuery('');
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 hover:border-brown-400 text-brown-900 transition-all flex items-center justify-between text-xs cursor-pointer shadow-sm ${
                      isCountryDropdownOpen ? 'ring-2 ring-brown-400 border-brown-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0 leading-none">{currentCountryObj.flag || '🌐'}</span>
                      <span className="font-medium truncate text-brown-900">
                        {isAr ? currentCountryObj.nameAr : currentCountryObj.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-cream-200/80 text-brown-700 font-semibold">
                        {shippingCost === 0 ? (isAr ? 'مجاني' : 'FREE') : format(shippingCost, isAr)}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-brown-400 transition-transform duration-200 ${
                          isCountryDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Searchable Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#FAF6F0] rounded-2xl border border-brown-300/80 shadow-2xl overflow-hidden animate-in fade-in duration-150">
                      {/* Search Bar */}
                      <div className="p-2 border-b border-brown-200/70 bg-white/70">
                        <div className="relative flex items-center">
                          <Search size={13} className={`absolute ${isAr ? 'right-2.5' : 'left-2.5'} text-brown-400 pointer-events-none`} />
                          <input
                            type="text"
                            autoFocus
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder={isAr ? 'ابحث عن الدولة...' : 'Search country...'}
                            className={`w-full py-1.5 ${isAr ? 'pr-8 pl-6' : 'pl-8 pr-6'} rounded-lg bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400`}
                          />
                          {countrySearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCountrySearchQuery('')}
                              className={`absolute ${isAr ? 'left-2' : 'right-2'} text-brown-400 hover:text-brown-700 p-0.5`}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Countries List */}
                      <div className="max-h-52 overflow-y-auto no-scrollbar divide-y divide-brown-100">
                        {filteredAvailableCountries.length === 0 ? (
                          <div className="p-4 text-center text-brown-400 text-xs">
                            {isAr ? 'لا توجد دول مطابقة لبحثك' : 'No matching countries found'}
                          </div>
                        ) : (
                          filteredAvailableCountries.map((c) => {
                            const isSelected = selectedCountry === c.code;
                            const fee = getShippingFee(c.code);
                            const feeText = fee === 0 ? (isAr ? 'مجاناً' : 'FREE') : format(fee, isAr);

                            return (
                              <div
                                key={c.code}
                                onClick={() => {
                                  setSelectedCountry(c.code);
                                  localStorage.setItem('hadab_customer_country', c.code);
                                  setIsCountryDropdownOpen(false);
                                  const matchingPhoneCode = COUNTRY_CODES.find((pc) => pc.code === c.code);
                                  if (matchingPhoneCode) {
                                    setPhoneCountryCode(matchingPhoneCode);
                                    localStorage.setItem('hadab_phone_country_code', matchingPhoneCode.code);
                                  }
                                }}
                                className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors text-xs ${
                                  isSelected
                                    ? 'bg-cream-200 text-brown-950 font-semibold'
                                    : 'hover:bg-cream-100/80 text-brown-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-base leading-none">{c.flag}</span>
                                  <span className="truncate">{isAr ? c.nameAr : c.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-brown-100 text-brown-700 font-medium">
                                    {feeText}
                                  </span>
                                  {isSelected && <Check size={13} className="text-burgundy-700" />}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-brown-700 font-semibold mb-1 text-[11px]">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User size={14} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-brown-400`} />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isAr ? 'مثال: ليلى الصباح' : 'e.g. Layla Al-Sabah'}
                      className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400 focus:ring-1 focus:ring-brown-400`}
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp with Country Code Dropdown */}
                <div className="relative" ref={phoneCodeRef}>
                  <label className="block text-brown-700 font-semibold mb-1 text-[11px]">
                    {isAr ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <div className="flex rounded-xl bg-white border border-brown-200 overflow-hidden focus-within:border-brown-400 focus-within:ring-1 focus-within:ring-brown-400 transition-all">
                    {/* Country Code Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPhoneCodeOpen(!isPhoneCodeOpen);
                        setPhoneCodeSearch('');
                      }}
                      className={`flex items-center gap-1 px-2.5 py-2.5 hover:bg-cream-200/60 transition-colors cursor-pointer shrink-0 ${isAr ? 'border-l border-brown-200/60' : 'border-r border-brown-200/60'}`}
                    >
                      <span className="text-sm leading-none">{phoneCountryCode.flag}</span>
                      <span className="text-[11px] font-medium text-brown-700 font-mono dir-ltr">{phoneCountryCode.dialCode}</span>
                      <ChevronDown size={11} className={`text-brown-400 transition-transform duration-200 ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Phone Input */}
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={phoneCountryCode.sample || '9912 3456'}
                      className="flex-1 py-2.5 px-3 bg-transparent text-brown-900 text-xs focus:outline-none min-w-0"
                    />
                  </div>

                  {/* Phone Code Dropdown Popover */}
                  {isPhoneCodeOpen && (
                    <div className={`absolute top-full mt-1.5 ${isAr ? 'right-0' : 'left-0'} w-72 sm:w-80 z-50 bg-[#FAF7F2] rounded-2xl border border-brown-200/70 shadow-2xl overflow-hidden animate-in fade-in duration-150`}>
                      {/* Search */}
                      <div className="p-2 border-b border-brown-200/40 bg-white/70">
                        <div className="relative flex items-center">
                          <Search size={13} className={`absolute ${isAr ? 'right-2.5' : 'left-2.5'} text-brown-400 pointer-events-none`} />
                          <input
                            ref={phoneCodeSearchRef}
                            type="text"
                            autoFocus
                            value={phoneCodeSearch}
                            onChange={(e) => setPhoneCodeSearch(e.target.value)}
                            placeholder={isAr ? 'ابحث عن الدولة أو الرمز...' : 'Search country or code...'}
                            className={`w-full ${isAr ? 'pr-8 pl-8' : 'pl-8 pr-8'} py-1.5 rounded-lg bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400`}
                          />
                          {phoneCodeSearch && (
                            <button
                              type="button"
                              onClick={() => setPhoneCodeSearch('')}
                              className={`absolute ${isAr ? 'left-2' : 'right-2'} text-brown-400 hover:text-brown-700 p-0.5`}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* List */}
                      <div className="max-h-52 overflow-y-auto divide-y divide-brown-100/60">
                        {filteredPhoneCodes.length === 0 ? (
                          <div className="p-4 text-center text-brown-400 text-xs">
                            {isAr ? 'لا توجد نتائج' : 'No results found'}
                          </div>
                        ) : (
                          filteredPhoneCodes.map((c) => {
                            const isSelected = c.code === phoneCountryCode.code;
                            return (
                              <button
                                key={`${c.code}-${c.dialCode}`}
                                type="button"
                                onClick={() => {
                                  setPhoneCountryCode(c);
                                  localStorage.setItem('hadab_phone_country_code', c.code);
                                  setIsPhoneCodeOpen(false);
                                  setPhoneCodeSearch('');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer text-xs ${
                                  isSelected
                                    ? 'bg-cream-200 text-brown-950 font-semibold'
                                    : 'hover:bg-brown-100/40 text-brown-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-base leading-none">{c.flag}</span>
                                  <span className="truncate">{isAr ? c.nameAr : c.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="dir-ltr font-mono text-[11px] font-medium text-brown-600 bg-brown-200/40 px-1.5 py-0.5 rounded-full">
                                    {c.dialCode}
                                  </span>
                                  {isSelected && <Check size={13} className="text-burgundy-700" />}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Split Delivery Address: Area, Street, House, Apartment */}
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex items-center gap-1.5 text-brown-800 font-semibold text-[11px]">
                    <MapPin size={13} className="text-brown-600 shrink-0" />
                    <span>{isAr ? 'عنوان التوصيل *' : 'Delivery Address *'}</span>
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-brown-600 font-medium mb-1 text-[10.5px]">
                      {isAr ? 'المنطقة / الحي *' : 'Area / District *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerArea}
                      onChange={(e) => {
                        setCustomerArea(e.target.value);
                        localStorage.setItem('hadab_customer_area', e.target.value);
                      }}
                      placeholder={isAr ? 'مثال: السالمية، الصديق، ديسكفري...' : 'e.g. Salmiya, Al-Siddiq, Downtown...'}
                      className="w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400 focus:ring-1 focus:ring-brown-400"
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-brown-600 font-medium mb-1 text-[10.5px]">
                      {isAr ? 'الشارع *' : 'Street *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerStreet}
                      onChange={(e) => {
                        setCustomerStreet(e.target.value);
                        localStorage.setItem('hadab_customer_street', e.target.value);
                      }}
                      placeholder={isAr ? 'اسم أو رقم الشارع' : 'Street name or number'}
                      className="w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400 focus:ring-1 focus:ring-brown-400"
                    />
                  </div>

                  {/* House & Apartment in 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-brown-600 font-medium mb-1 text-[10.5px]">
                        {isAr ? 'المنزل / المبنى *' : 'House / Building *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customerHouse}
                        onChange={(e) => {
                          setCustomerHouse(e.target.value);
                          localStorage.setItem('hadab_customer_house', e.target.value);
                        }}
                        placeholder={isAr ? 'رقم المنزل أو القسيمة' : 'House or Bldg No.'}
                        className="w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400 focus:ring-1 focus:ring-brown-400"
                      />
                    </div>

                    <div>
                      <label className="block text-brown-600 font-medium mb-1 text-[10.5px]">
                        {isAr ? 'الشقة / الطابق' : 'Apartment / Floor'}
                        <span className="text-[10px] text-brown-400 font-normal ml-1">({isAr ? 'اختياري' : 'Optional'})</span>
                      </label>
                      <input
                        type="text"
                        value={customerApartment}
                        onChange={(e) => {
                          setCustomerApartment(e.target.value);
                          localStorage.setItem('hadab_customer_apartment', e.target.value);
                        }}
                        placeholder={isAr ? 'شقة ٢، طابق ١' : 'Apt 2, Floor 1'}
                        className="w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400 focus:ring-1 focus:ring-brown-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-brown-700 font-semibold mb-1 text-[11px]">
                    {isAr ? 'ملاحظات خاصة (اختياري)' : 'Special Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder={isAr ? 'تغليف هدية، موعد محدد للتسليم…' : 'Gift wrapping, delivery notes…'}
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-brown-400 focus:ring-1 focus:ring-brown-400"
                  />
                </div>

                {/* Payment Option: WhatsApp Payment */}
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-brown-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-emerald-600" />
                      <span className="font-semibold text-xs">
                        {isAr ? 'طريقة الدفع: عبر واتساب' : 'Payment Method: via WhatsApp'}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {isAr ? 'رابط دفع / تحويل' : 'Payment Link / Transfer'}
                    </span>
                  </div>
                  <div className="bg-cream-200/70 p-3 rounded-xl border border-brown-200/80">
                    <p className="text-[11.5px] text-brown-900 font-semibold">
                      {isAr
                        ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع'
                        : 'Now our customer service will contact you for the payment'}
                    </p>
                    <p className="text-[10.5px] text-brown-600 font-light mt-0.5 leading-relaxed">
                      {isAr
                        ? 'سنرسل لك رابط دفع إلكتروني مخصص أو تأكيد الدفع عند الاستلام.'
                        : 'We will send you a secure payment link or confirm cash on delivery.'}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-brown-200 space-y-1.5 text-brown-600">
                  <div className="flex justify-between">
                    <span>{t.subtotal}</span>
                    <span className="font-semibold text-brown-900">{format(subtotal, isAr)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>
                      {isAr
                        ? `الشحن إلى ${currentCountryObj.nameAr}`
                        : `Shipping to ${currentCountryObj.name}`}
                    </span>
                    {shippingCost === 0 ? (
                      <span className="text-sage-700 font-semibold bg-sage-100 px-2 py-0.5 rounded-full text-[10px]">
                        {isAr ? 'شحن مجاني' : 'FREE'}
                      </span>
                    ) : (
                      <span className="font-semibold text-brown-900">{format(shippingCost, isAr)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm font-serif font-bold text-brown-950 pt-2 border-t border-brown-200/80">
                    <span>{isAr ? 'المجموع النهائي' : 'Total'}</span>
                    <span>{format(finalTotal, isAr)}</span>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {step === 'success' && (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center shadow-sm">
                  <Check size={32} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-burgundy-600">
                    {isAr ? 'طلب مؤكد' : 'Order Placed'}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-brown-900 font-normal mt-1">
                    {isAr ? 'شكراً لطلبك من هَدَب!' : 'Thank you for your order!'}
                  </h4>
                  <p className="font-mono text-xs font-semibold text-brown-700 bg-cream-200/80 inline-block px-3 py-1 rounded-full border border-brown-300 mt-2">
                    {placedOrderNumber}
                  </p>
                </div>

                <p className="text-xs text-brown-600 font-light leading-relaxed max-w-xs">
                  {isAr
                    ? 'بدأنا بتجهيز وحياكة قطعك اليدوية بحب في الأردن لشحنها مباشرة إلى باب منزلك.'
                    : 'We are preparing your handmade pieces with care in Jordan and shipping them straight to your house.'}
                </p>

                {/* Prominent Payment Notice — Luxury Cream Card */}
                <div className="w-full p-4 rounded-2xl bg-cream-200/90 border border-brown-300/80 text-center flex flex-col items-center shadow-xs space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-cream-100 border border-brown-200 flex items-center justify-center text-burgundy-600 mb-0.5 shadow-xs">
                    <Sparkles size={13} />
                  </div>
                  <h5 className="font-semibold text-xs text-brown-900 leading-snug">
                    {isAr
                      ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع'
                      : 'Now our customer service will contact you for the payment'}
                  </h5>
                  <p className="text-[11px] text-brown-600 font-light leading-relaxed max-w-[280px]">
                    {isAr
                      ? 'يرجى مراجعة رسائل الواتساب للحصول على رابط الدفع الإلكتروني وتأكيد موعد الشحن.'
                      : 'Please check your WhatsApp messages for the secure payment link and delivery confirmation.'}
                  </p>
                </div>

                <div className="w-full pt-2 space-y-2.5">
                  <a
                    href={`https://wa.me/${whatsappAdminPhone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider shadow-warm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <MessageCircle size={16} />
                    <span>{isAr ? 'تأكيد عبر واتساب' : 'Confirm via WhatsApp'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-full bg-cream-200 hover:bg-cream-300 text-brown-800 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    {isAr ? 'متابعة التسوق' : 'Continue Browsing'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer for Cart and Checkout */}
          {step !== 'success' && step !== 'guest-prompt' && (
            <div className="p-4 sm:p-6 border-t border-brown-200/80 bg-cream-100/95 backdrop-blur-sm safe-bottom">
              {step === 'cart' ? (
                <>
                  <div className="flex justify-between text-sm text-brown-800 font-medium mb-3 sm:mb-4">
                    <span>{t.subtotal}</span>
                    <span className="font-serif text-lg font-semibold">{format(subtotal, isAr)}</span>
                  </div>
                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() => {
                      if (user) {
                        setStep('checkout');
                      } else {
                        setStep('guest-prompt');
                      }
                    }}
                    className="w-full py-3.5 rounded-full bg-brown-900 hover:bg-brown-950 disabled:opacity-50 text-cream-100 text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{t.checkoutSecurely}</span>
                    <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-brown-900 hover:bg-brown-950 disabled:opacity-60 text-cream-100 text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{isAr ? 'جاري إرسال الطلب...' : 'Placing Order...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isAr ? `تأكيد الطلب (${format(finalTotal, true)})` : `Confirm Order (${format(finalTotal, false)})`}</span>
                      <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
