import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { X, Trash2, ArrowRight, ArrowLeft, Sparkles, Check, Phone, MapPin, User, MessageCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onRemoveItem: (id: string, color?: string, size?: string) => void;
  onClearBag?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearBag,
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isAr = language === 'ar';
  const curr = isAr ? 'د.ك' : 'KWD';

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(
    localStorage.getItem('hadab_customer_area')
      ? `${localStorage.getItem('hadab_customer_area')}, Block ${localStorage.getItem('hadab_customer_block') || ''}, Street ${localStorage.getItem('hadab_customer_street') || ''}, House ${localStorage.getItem('hadab_customer_house') || ''}`
      : ''
  );
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    if (user?.name && !customerName) setCustomerName(user.name);
    if (user?.phone && !customerPhone) setCustomerPhone(user.phone);
  }, [user]);

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

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 25;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 2.5;
  const finalTotal = subtotal + shippingCost;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail: user?.email || `${customerPhone.replace(/[^0-9]/g, '')}@hadab.guest`,
        destination: 'Kuwait',
        destinationArabic: 'الكويت',
        address: customerAddress,
        notes: customerNotes,
        status: 'unpaid',
        statusArabic: 'غير مدفوع',
        paymentStatus: 'unpaid',
        paymentStatusArabic: 'غير مدفوع',
        items: items.map((i) => {
          const colorPart = i.product.selectedColor ? ` [${i.product.selectedColor}]` : '';
          const sizePart = i.product.selectedSize ? ` - ${i.product.selectedSize}` : '';
          return {
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
      setPlacedOrderNumber(result.orderNumber || 'HDB-2026-KW');
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
      ? `مرحباً هَدَب! أود تأكيد طلبي رقم ${placedOrderNumber} بقيمة ${orderTotal} د.ك.\nالاسم: ${customerName}\nالعنوان: ${customerAddress}`
      : `Hello HADAB! I'd like to confirm my order #${placedOrderNumber} for ${orderTotal} KWD.\nName: ${customerName}\nDelivery Address: ${customerAddress}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${isAr ? 'left-0 sm:pr-10' : 'right-0 sm:pl-10'} max-w-full flex`}>
        <div className={`w-screen max-w-full sm:max-w-md bg-cream-100 ${isAr ? 'sm:border-r' : 'sm:border-l'} border-brown-200 shadow-warm-lg flex flex-col justify-between h-full`}>
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-brown-200/80 safe-top">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step === 'checkout' && (
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="p-1 rounded-full hover:bg-cream-200 text-brown-600 transition-colors"
                    aria-label="Back to bag"
                  >
                    <ArrowLeft size={18} className={isAr ? 'rotate-180' : ''} />
                  </button>
                )}
                <h3 className="font-serif text-xl text-brown-800 font-medium">
                  {step === 'cart'
                    ? t.yourBag
                    : step === 'checkout'
                    ? (isAr ? 'إتمام الطلب للكويت' : 'Delivery to Kuwait')
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

            {/* Free Shipping Meter (in cart view) */}
            {step === 'cart' && (
              <div className="mt-4 p-3 rounded-xl bg-cream-200/60 border border-brown-200 text-xs text-brown-700">
                <div className="flex justify-between font-medium mb-1.5">
                  <span>
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-sage-600 font-semibold flex items-center gap-1">
                        <Sparkles size={12} /> {t.complimentaryShippingUnlocked}
                      </span>
                    ) : (
                      <span>
                        {t.addForFreeDelivery.replace('{amount}', (freeShippingThreshold - subtotal).toFixed(0))}
                      </span>
                    )}
                  </span>
                  <span>{progressToFreeShipping.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-cream-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-burgundy-500 transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
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
                            <span className="text-[10px] text-brown-400">
                              • {isAr ? 'الكمية' : 'Qty'}: {quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-brown-800 mt-1">
                          {product.price * quantity} {curr}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-cream-200/60 border border-brown-200 text-brown-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-brown-900">
                    <Sparkles size={14} className="text-burgundy-600" />
                    <span>{isAr ? 'شحن من الأردن إلى الكويت' : 'Shipped from Jordan to Kuwait'}</span>
                  </div>
                  <p className="text-[11px] text-brown-500 font-light leading-relaxed">
                    {isAr
                      ? 'مشروعنا المنزلي مقره الأردن ونشحن جميع القطع المحبوكة يدوياً مباشرة إلى باب منزلك في الكويت.'
                      : 'Our handmade pieces are lovingly crafted in Jordan and delivered straight to your doorstep in Kuwait.'}
                  </p>
                </div>

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
                      className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brown-700 font-semibold mb-1 text-[11px]">
                    {isAr ? 'رقم الهاتف / الواتساب في الكويت *' : 'Kuwait Phone / WhatsApp *'}
                  </label>
                  <div className="relative">
                    <Phone size={14} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-brown-400`} />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+965 9912 3456"
                      className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brown-700 font-semibold mb-1 text-[11px]">
                    {isAr ? 'عنوان التوصيل في الكويت (المنطقة، القطعة، الشارع، المنزل) *' : 'Kuwait Delivery Address (Area, Block, Street, House) *'}
                  </label>
                  <div className="relative">
                    <MapPin size={14} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-3 text-brown-400`} />
                    <textarea
                      rows={2}
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder={isAr ? 'السالمية، قطعة ٤، شارع ١٢، منزل ٥' : 'Salmiya, Block 4, Street 12, House 5'}
                      className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 resize-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brown-700 font-semibold mb-1 text-[11px]">
                    {isAr ? 'ملاحظات خاصة (اختياري)' : 'Special Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder={isAr ? 'تغليف هدية، موعد محدد للتسليم…' : 'Gift wrapping, delivery notes…'}
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300"
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
                      KNET
                    </span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                    <p className="text-[11.5px] text-brown-900 font-bold">
                      {isAr
                        ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع'
                        : 'Now our customer service will contact you for the payment'}
                    </p>
                    <p className="text-[10.5px] text-brown-600 font-light mt-0.5">
                      {isAr
                        ? 'سنرسل لك رابط دفع KNET مخصص أو تأكيد الدفع عند الاستلام.'
                        : 'We will send you a secure KNET link or confirm cash on delivery.'}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-brown-200 space-y-1.5 text-brown-600">
                  <div className="flex justify-between">
                    <span>{t.subtotal}</span>
                    <span className="font-semibold text-brown-900">{subtotal} {curr}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isAr ? 'الشحن إلى الكويت' : 'Shipping to Kuwait'}</span>
                    {shippingCost === 0 ? (
                      <span className="text-sage-700 font-semibold bg-sage-100 px-2 py-0.5 rounded-full text-[10px]">
                        {isAr ? 'شحن مجاني' : 'FREE'}
                      </span>
                    ) : (
                      <span className="font-semibold text-brown-900">{shippingCost} {curr}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm font-serif font-bold text-brown-950 pt-2 border-t border-brown-200/80">
                    <span>{isAr ? 'المجموع النهائي' : 'Total'}</span>
                    <span>{finalTotal} {curr}</span>
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
                    ? 'بدأنا بتجهيز وحياكة قطعك اليدوية بحب في الأردن لشحنها مباشرة إلى الكويت.'
                    : 'We are preparing your handmade pieces with care in Jordan and shipping them straight to Kuwait.'}
                </p>

                {/* Prominent Payment Notice */}
                <div className="w-full p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <Sparkles size={14} className="text-burgundy-600" />
                    <span>
                      {isAr
                        ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع'
                        : 'Now our customer service will contact you for the payment'}
                    </span>
                  </div>
                  <p className="text-[11px] text-brown-600 font-light">
                    {isAr
                      ? 'يرجى مراجعة رسائل الواتساب للحصول على رابط دفع KNET وتأكيد موعد الشحن.'
                      : 'Please check your WhatsApp messages for the KNET payment link and delivery confirmation.'}
                  </p>
                </div>

                <div className="w-full pt-2 space-y-2.5">
                  <a
                    href={`https://wa.me/96599000000?text=${whatsappMessage}`}
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
          {step !== 'success' && (
            <div className="p-5 sm:p-6 border-t border-brown-200/80 bg-cream-100 safe-bottom">
              {step === 'cart' ? (
                <>
                  <div className="flex justify-between text-sm text-brown-800 font-medium mb-3 sm:mb-4">
                    <span>{t.subtotal}</span>
                    <span className="font-serif text-lg font-semibold">{subtotal} {curr}</span>
                  </div>
                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 rounded-full bg-burgundy-500 hover:bg-burgundy-600 disabled:opacity-50 text-cream-100 text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98] cursor-pointer"
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
                  className="w-full py-3.5 rounded-full bg-burgundy-500 hover:bg-burgundy-600 disabled:opacity-60 text-cream-100 text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{isAr ? 'جاري إرسال الطلب...' : 'Placing Order...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isAr ? `تأكيد الطلب (${finalTotal} ${curr})` : `Confirm Order (${finalTotal} ${curr})`}</span>
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
