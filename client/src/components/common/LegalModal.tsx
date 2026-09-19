import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Truck, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type LegalDocType = 'privacy' | 'terms' | 'shipping' | 'returns';

interface LegalModalProps {
  initialDoc?: LegalDocType;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialDoc = 'privacy',
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialDoc);

  // Sync activeTab when initialDoc changes on open
  React.useEffect(() => {
    if (initialDoc) {
      setActiveTab(initialDoc);
    }
  }, [initialDoc, isOpen]);

  if (!isOpen) return null;

  const tabs: { id: LegalDocType; labelEn: string; labelAr: string; icon: any }[] = [
    { id: 'privacy', labelEn: 'Privacy Policy', labelAr: 'سياسة الخصوصية', icon: ShieldCheck },
    { id: 'terms', labelEn: 'Terms of Service', labelAr: 'الشروط والأحكام', icon: FileText },
    { id: 'shipping', labelEn: 'Shipping Policy', labelAr: 'سياسة الشحن والتوصيل', icon: Truck },
    { id: 'returns', labelEn: 'Returns & Exchanges', labelAr: 'الاسترجاع والاستبدال', icon: RotateCcw },
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 xs:p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-brown-200/80 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-brown-200/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EDE4D8] flex items-center justify-center text-burgundy-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-medium text-brown-900 leading-tight">
                {isAr ? 'المعلومات القانونية والسياسات' : 'Legal & Store Policies'}
              </h2>
              <p className="text-[11px] text-brown-500 font-light">
                {isAr ? 'مشروع هَدَب للمشغولات اليدوية • الكويت' : 'HADAB Handmade Crochet • Kuwait'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-brown-400 hover:text-brown-700 hover:bg-brown-100/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#EFE6DA] border-b border-brown-300/70 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-brown-900 text-cream-100 shadow-md'
                    : 'bg-white/80 hover:bg-white text-brown-800 hover:text-brown-950 border border-brown-300/80 hover:border-brown-400'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-cream-200' : 'text-brown-600'} />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Content (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-brown-800 leading-relaxed font-light">
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-serif text-brown-900 font-semibold mb-2">
                  {isAr ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
                </h3>
                <p className="text-brown-500 text-[11px] mb-3">
                  {isAr ? 'آخر تحديث: سبتمبر 2026' : 'Last Updated: September 2026'}
                </p>
                <p>
                  {isAr
                    ? 'في هَدَب (HADAB)، نحرص بأقصى درجات العناية على حماية خصوصية عملائنا وسلامة معلوماتهم الشخصية. توضح هذه السياسة كيف نجمع ونستخدم ونحمي بياناتك عند زيارة موقعنا أو الطلب منه.'
                    : 'At HADAB, we are committed to safeguarding our clients’ privacy and ensuring the security of their personal information. This policy explains how we collect, handle, and protect your information when engaging with our platform.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '1. ما هي البيانات التي نجمعها؟' : '1. Information We Collect'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-brown-600 ps-1">
                  <li>
                    {isAr
                      ? 'الاسم، رقم الهاتف، والبريد الإلكتروني عند التسجيل أو تقديم طلب.'
                      : 'Full Name, Phone Number, and Email Address during account creation or checkout.'}
                  </li>
                  <li>
                    {isAr
                      ? 'عنوان التوصيل السكني أو المكتبي (الدولة، المدينة، المنطقة، القطعة، الشارع، ورقم المبنى).'
                      : 'Delivery address details (Country, City, Block, Street, and Building numbers).'}
                  </li>
                  <li>
                    {isAr
                      ? 'سجل المشتريات وقوائم الرغبات المفضلة لتسهيل تجربة تسوقك.'
                      : 'Purchase history and saved wishlist items to personalize your shopping experience.'}
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '2. سرية وأمان وسائل الدفع' : '2. Payment Security & Processing'}
                </h4>
                <p>
                  {isAr
                    ? 'نحن لا نخزن بيانات بطاقاتك الائتمانية أو بطاقات KNET على خوادمنا نهائياً. تتم جميع المعاملات المالية عبر بوابات دفع آمنة ومشفرة وفق أعلى معايير الحماية المصرفية العالمية.'
                    : 'We never store your credit card or KNET debit card details on our local servers. All payment transactions are securely encrypted and processed directly via accredited global and local payment gateways.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '3. عدم مشاركة أو بيع البيانات' : '3. Non-Disclosure & Data Sharing'}
                </h4>
                <p>
                  {isAr
                    ? 'نحن لا نبيع أو نؤجر أو نتاجر ببياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية. تتم مشاركة بيانات العنوان ورقم الهاتف فقط مع شركة الشحن والتوصيل المعتمدة لإيصال طلبك بنجاح.'
                    : 'We do not sell, rent, or trade your personal information to third-party marketing entities. Information is shared strictly with our contracted shipping carriers to fulfill and deliver your handmade parcels.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-serif text-brown-900 font-semibold mb-2">
                  {isAr ? 'الشروط والأحكام العامة' : 'Terms of Service'}
                </h3>
                <p className="text-brown-500 text-[11px] mb-3">
                  {isAr ? 'آخر تحديث: سبتمبر 2026' : 'Last Updated: September 2026'}
                </p>
                <p>
                  {isAr
                    ? 'باستخدامك لموقع هَدَب (HADAB) أو إتمام أي عملية شراء، فإنك توافق على الالتزام بالشروط والأحكام التالية المنظمة لخدمات متجرنا المستقل.'
                    : 'By accessing the HADAB web experience or finalizing any purchase, you agree to be bound by the terms and conditions outlined below.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '1. طبيعة المنتجات المصنوعة يدوياً' : '1. Nature of Handmade Goods'}
                </h4>
                <p>
                  {isAr
                    ? 'جميع قطع هَدَب تُحاك وتُصنع يدوياً بحب وعناية فائقة. نظراً للطبيعة اليدوية الحرفية، قد توجد اختلافات طفيفة وطبيعية جداً في الغرز أو درجات الخيوط بين كل قطعة وأخرى، وهو ما يمنح كل قطعة تميزها وأصالتها الفردية.'
                    : 'All HADAB creations are hooked and finished entirely by hand with pure attention to detail. Due to the bespoke artisan process, subtle variations in stitching, gauge, or yarn colorway dye lots are natural and celebrate each item’s distinct individuality.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '2. حقوق الملكية الفكرية' : '2. Intellectual Property'}
                </h4>
                <p>
                  {isAr
                    ? 'جميع التصاميم، الصور، النصوص، والشعارات المعروضة على موقع هَدَب هي ملكية حصرية للعلامة التجارية ومحمية بموجب قوانين حماية الملكية الفكرية. يُمنع منعاً باتاً استنساخها أو استخدامها لأغراض تجارية دون إذن كتابي مسبق.'
                    : 'All visual photography, design silhouettes, text content, and branding motifs on HADAB are the proprietary property of the brand and protected by international intellectual property laws.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '3. الأسعار وتوفر المنتجات' : '3. Pricing & Availability'}
                </h4>
                <p>
                  {isAr
                    ? 'الأسعار معروضة بالدينار الكويتي أو العملات الخليجية/الدولية حسب اختيارك. نحتفظ بالحق في تعديل الأسعار أو إيقاف أي منتج في أي وقت دون إشعار مسبق تبعاً لتوفر الخيوط والمواد الأولية.'
                    : 'Prices are listed in KWD and convertible to major GCC/international currencies. We reserve the right to modify prices or retire specific yarn runs without prior notice based on raw supply.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-serif text-brown-900 font-semibold mb-2">
                  {isAr ? 'سياسة الشحن وأوقات التجهيز والتسليم' : 'Shipping & Delivery Policy'}
                </h3>
                <p className="text-brown-500 text-[11px] mb-3">
                  {isAr ? 'شحن وتوصيل لجميع الدول (داخل الكويت وكافة أنحاء العالم)' : 'Worldwide delivery across all countries'}
                </p>
              </div>

              {/* Delivery Timelines Card */}
              <div className="p-4 rounded-2xl bg-[#F5EDE1] border border-brown-200 space-y-3">
                <div className="font-semibold text-brown-900 text-xs sm:text-sm flex items-center gap-2">
                  <Truck size={15} className="text-burgundy-600" />
                  <span>{isAr ? 'المدد الزمنية للتجهيز والتوصيل (لكافة الدول)' : 'Delivery Timelines (All Countries)'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white/80 p-3.5 rounded-xl border border-brown-200/70">
                    <div className="font-semibold text-brown-900 mb-1">
                      {isAr ? 'القطع الجاهزة للشحن' : 'Ready-to-Ship Pieces'}
                    </div>
                    <div className="text-brown-600 leading-relaxed">
                      {isAr ? 'تستغرق من ٥ إلى ٧ أيام عمل لجميع الدول.' : 'Delivered within 5 to 7 business days to all countries.'}
                    </div>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-brown-200/70">
                    <div className="font-semibold text-brown-900 mb-1">
                      {isAr ? 'القطع المخصصة (حسب الطلب)' : 'Custom & Made-to-Order'}
                    </div>
                    <div className="text-brown-600 leading-relaxed">
                      {isAr ? 'تستغرق من ٧ إلى ١٤ يوم عمل لجميع الدول.' : 'Delivered within 7 to 14 business days to all countries.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? 'رسوم الشحن والتوصيل (حسب الدولة في صفحة الدفع)' : 'Shipping & Delivery Fees (Calculated by Country at Checkout)'}
                </h4>
                <p>
                  {isAr
                    ? 'يتم تحديد واحتساب رسوم الشحن والتوصيل بدقة وبشكل تلقائي وفقاً للدولة التي تختارينها أثناء إتمام الطلب في صفحة الدفع. تظهر لكِ التكلفة الإجمالية بوضوح وشفافية قبل تأكيد الدفع.'
                    : 'Shipping rates are calculated dynamically based on the destination country selected during checkout. The applicable rate will be clearly displayed before completing your payment.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? 'تجهيز الطلبات وتتبع الشحنات' : 'Fulfillment & Order Tracking'}
                </h4>
                <p>
                  {isAr
                    ? 'نشحن كافة الطلبات مباشرة من مشغلنا في دولة الكويت إلى جميع محافظات الكويت ومختلف دول العالم عبر شركات البريد والشحن السريع المعتمدة. عند إرسال طلبكِ، يتم تزويدك برقم ورابط تتبع مباشر لمتابعة خط سير الشحنة حتى باب منزلك.'
                    : 'All orders are securely packed and dispatched directly from our studio in Kuwait across all local governorates and worldwide to all countries via premier tracked couriers. Upon dispatch, a live tracking link will be provided so you can monitor your parcel’s journey to your doorstep.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? 'الرسوم الجمركية والضرائب الدولية' : 'Customs Duties & Import Fees'}
                </h4>
                <p>
                  {isAr
                    ? 'قد تخضع الشحنات الدولية لرسوم جمركية أو ضرائب استيراد محددة من قبل سلطات بلد المستلم، وتقع مسؤولية هذه الرسوم على عاتق المستلم وفقاً للأنظمة المحلية لدولته.'
                    : 'International shipments may be subject to import duties and VAT levied by the destination country’s customs authority. Such fees are the responsibility of the recipient.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base sm:text-lg font-serif text-brown-900 font-semibold mb-2">
                  {isAr ? 'سياسة الاستبدال والاسترجاع' : 'Returns & Exchanges Policy'}
                </h3>
                <p className="text-brown-500 text-[11px] mb-3">
                  {isAr ? 'مشغولات يدوية مصممة ومحبوكة خصيصاً لكِ' : 'Handcrafted artisanal crochet creations'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5EDE1] border border-brown-200 space-y-1.5">
                <div className="font-semibold text-brown-900 text-xs sm:text-sm flex items-center gap-2">
                  <RotateCcw size={15} className="text-burgundy-600" />
                  <span>{isAr ? 'سياسة البيع النهائي والاسترجاع' : 'All Sales Final Policy'}</span>
                </div>
                <p className="text-brown-700">
                  {isAr
                    ? 'نظراً للطبيعة الحرفية الخاصة لمنتجات "هَدَب" وكونها مشغولة يدوياً بالكامل (Handmade Crochet)، لا يوجد استرجاع أو استبدال نهائياً، باستثناء الحالات التي يكون فيها عيب مصنعي أو مشكلة في المنتج واردة من جانبنا.'
                    : 'Due to the delicate handmade and artisanal nature of HADAB creations, all sales are final. We do not accept returns or exchanges except in the case of a product defect or an issue originating from our side.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '1. عدم وجود استرجاع أو استبدال' : '1. No Returns or Exchanges'}
                </h4>
                <p>
                  {isAr
                    ? 'جميع قطع هَدَب تُحاك وتُصنع يدوياً بعناية فائقة. لذلك، لا يمكن إرجاع أو استبدال المنتجات بعد استلامها بناءً على رغبة العميل أو تغيير اختياره.'
                    : 'Every HADAB piece is meticulously crafted by hand. Consequently, items cannot be returned or exchanged due to a change of mind, personal preference, or styling decisions.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '2. الاستثناء: عيب مصنعي أو مشكلة من طرفنا' : '2. Exceptions: Product Defects & Store Errors'}
                </h4>
                <p>
                  {isAr
                    ? 'الحالة الوحيدة المؤهلة للاسترجاع أو الاستبدال هي استلام منتج يحتوي على عيب مصنعي واضح، أو تلف عند الاستلام، أو استلام قطعة مختلفة عن طلبكِ نتيجة خطأ من جانبنا. في هذه الحالة، نتحمل كامل المسؤولية لمعالجة الأمر فوراً عبر استبدال القطعة أو إرجاعها واسترداد كامل المبلغ.'
                    : 'The only exception eligible for return, exchange, or refund is if an item arrives with a genuine manufacturing defect, damage upon arrival, or if an incorrect item was delivered due to an error from our side. In such cases, HADAB assumes full responsibility to promptly replace the item or issue a full refund.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-brown-900 text-xs sm:text-sm">
                  {isAr ? '3. آلية الإبلاغ واسترداد المبلغ' : '3. Reporting an Issue & Refunds'}
                </h4>
                <p>
                  {isAr
                    ? 'في حال وجود أي عيب أو خطأ من جانبنا، يُرجى إشعارنا خلال 48 ساعة من تاريخ استلام الشحنة عبر صفحة "تواصل معنا" أو مراسلتنا عبر البريد الإلكتروني (Byhadab@gmail.com) مع توضيح رقم الطلب وإرفاق صور واضحة توضح المشكلة. عند التحقق، تتكفل "هَدَب" بكافة تكاليف الشحن والتوصيل، ويتم استرداد كامل المبلغ إلى وسيلة الدفع الأصلية خلال 3 إلى 7 أيام عمل.'
                    : 'If you encounter an issue or defect from our side, please notify us within 48 hours of delivery receipt via our "Contact Us" page or email at Byhadab@gmail.com, including your order number and clear photos showing the issue. Once verified, HADAB will cover all return/replacement transit expenses, and full refunds are issued to your original payment method within 3 to 7 business days.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-brown-200/70 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-brown-500 font-light">
            {isAr ? 'لأي استفسارات قانونية: ' : 'Questions or inquiries: '}
            <a href="mailto:Byhadab@gmail.com" className="text-burgundy-600 font-medium hover:underline">
              Byhadab@gmail.com
            </a>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-brown-900 hover:bg-brown-800 text-cream-100 text-xs font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
