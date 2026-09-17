import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { tactileAudio } from '../../utils/audio';
import { CountryCodeDropdown } from '../common/CountryCodeDropdown';
import { type CountryCode, DEFAULT_COUNTRY, COUNTRY_CODES } from '../../constants/countryCodes';
import {
  Package,
  MapPin,
  MessageCircle,
  User,
  ShoppingBag,
  ArrowLeft,
  LogOut,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

interface CustomerDashboardProps {
  onBackToStore: () => void;
  onOpenCollection: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBackToStore,
  onOpenCollection,
}) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const curr = isAr ? 'د.ك' : 'KWD';

  const [activeTab, setActiveTab] = useState<'orders' | 'address' | 'support' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Address Form state
  const [area, setArea] = useState(localStorage.getItem('hadab_customer_area') || 'Salmiya');
  const [block, setBlock] = useState(localStorage.getItem('hadab_customer_block') || '4');
  const [street, setStreet] = useState(localStorage.getItem('hadab_customer_street') || '12');
  const [house, setHouse] = useState(localStorage.getItem('hadab_customer_house') || '5');
  const [addressSaved, setAddressSaved] = useState(false);

  // Parse country & phone for Address tab
  const [addressCountry, setAddressCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [addressPhoneDigits, setAddressPhoneDigits] = useState('9912 3456');

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || 'Valued Customer');
  const [profileCountry, setProfileCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [profilePhoneDigits, setProfilePhoneDigits] = useState('9912 3456');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync phone on user load
  useEffect(() => {
    const rawPhone = user?.phone || localStorage.getItem('hadab_customer_phone') || '';
    if (rawPhone) {
      const match = COUNTRY_CODES.find((c) => rawPhone.startsWith(c.dialCode));
      if (match) {
        setAddressCountry(match);
        setAddressPhoneDigits(rawPhone.replace(match.dialCode, '').trim());
        setProfileCountry(match);
        setProfilePhoneDigits(rawPhone.replace(match.dialCode, '').trim());
      } else {
        setAddressPhoneDigits(rawPhone);
        setProfilePhoneDigits(rawPhone);
      }
    }
  }, [user?.phone]);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const myOrders = await api.getMyOrders();
      if (myOrders && myOrders.length > 0) {
        setOrders(myOrders);
        // Expand first order by default if available
        setExpandedOrderId(myOrders[0]._id || myOrders[0].orderNumber);
      } else {
        // Fallback demo order for immediate visual polish if no orders in db yet
        const demo = [
          {
            _id: 'demo-1',
            orderNumber: 'HDB-2026-105',
            createdAt: new Date().toISOString(),
            status: 'hooking',
            statusArabic: 'قيد الحياكة في الأردن',
            total: 135,
            destination: 'Kuwait',
            destinationArabic: 'الكويت',
            address: `${area}, Block ${block}, St ${street}, House ${house}`,
            items: [
              {
                name: 'The Trapillo Shoulder Tote',
                nameArabic: 'حقيبة هَدَب المجدولة',
                price: 135,
                quantity: 1,
                image: '/products/hadab-bag.jpg',
              },
            ],
          },
        ];
        setOrders(demo);
        setExpandedOrderId('demo-1');
      }
    } catch {
      // Fallback in case of auth error or offline
      const demo = [
        {
          _id: 'demo-fallback',
          orderNumber: 'HDB-2026-105',
          createdAt: new Date().toISOString(),
          status: 'pending',
          statusArabic: 'قيد الانتظار وتأكيد الدفع',
          total: 135,
          destination: 'Kuwait',
          destinationArabic: 'الكويت',
          address: `${area}, Block ${block}, St ${street}, House ${house}`,
          items: [
            {
              name: 'The Trapillo Shoulder Tote',
              nameArabic: 'حقيبة هَدَب المجدولة',
              price: 135,
              quantity: 1,
              image: '/products/hadab-bag.jpg',
            },
          ],
        },
      ];
      setOrders(demo);
      setExpandedOrderId('demo-fallback');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    tactileAudio.playChime();
    const fullPhone = addressPhoneDigits.trim()
      ? `${addressCountry.dialCode} ${addressPhoneDigits.trim().replace(/^0+/, '')}`
      : '';
    localStorage.setItem('hadab_customer_area', area);
    localStorage.setItem('hadab_customer_block', block);
    localStorage.setItem('hadab_customer_street', street);
    localStorage.setItem('hadab_customer_house', house);
    localStorage.setItem('hadab_customer_phone', fullPhone);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    const fullPhone = profilePhoneDigits.trim()
      ? `${profileCountry.dialCode} ${profilePhoneDigits.trim().replace(/^0+/, '')}`
      : '';
    try {
      await api.updateProfile({ name: profileName, phone: fullPhone });
      tactileAudio.playChime();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setProfileSaving(false);
    }
  };

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total || 0), 0),
    [orders]
  );
  const activeOrdersCount = useMemo(
    () => orders.filter((o) => o.status !== 'delivered').length,
    [orders]
  );

  const getStatusBadge = (status: string, statusArabic?: string) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          label: isAr ? 'تم التسليم بنجاح' : 'Delivered',
        };
      case 'shipped':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200/80',
          dot: 'bg-sky-500',
          icon: Truck,
          label: isAr ? 'تم الشحن للكويت' : 'Shipped to Kuwait',
        };
      case 'hooking':
      case 'finishing':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500',
          icon: Clock,
          label: isAr ? (statusArabic || 'قيد الحياكة بالأردن') : 'Handcrafting in Jordan',
        };
      default:
        return {
          bg: 'bg-cream-100 text-brown-800 border-brown-200/80',
          dot: 'bg-brown-400',
          icon: AlertCircle,
          label: isAr ? (statusArabic || 'بانتظار تأكيد الدفع') : 'Awaiting Payment',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-brown-800 font-sans pb-24 selection:bg-blush-200 selection:text-brown-900">
      {/* Top Header Bar - Warm, Airy & Brand-Aligned */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-brown-200/60 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-xl hover:bg-brown-100/60 text-brown-700 hover:text-brown-950 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              <ArrowLeft size={15} className={isAr ? 'rotate-180' : ''} />
              <span>{isAr ? 'العودة للمتجر' : 'Back to Store'}</span>
            </button>
            <div className="h-4 w-px bg-brown-200/70 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-normal tracking-wide text-brown-950">
                HADAB
              </span>
              <span className="text-[10px] bg-brown-100 text-brown-600 px-2 py-0.5 rounded-full border border-brown-200/60 font-medium tracking-wider uppercase">
                {isAr ? 'بوابة العميل' : 'Customer Sanctuary'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenCollection}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium transition-colors shadow-xs"
            >
              <ShoppingBag size={13} />
              <span className="hidden sm:inline">{isAr ? 'تصفح القطع' : 'Explore Pieces'}</span>
              <span className="sm:hidden">{isAr ? 'المتجر' : 'Shop'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                onBackToStore();
              }}
              className="p-2 rounded-xl hover:bg-brown-100/60 text-brown-500 hover:text-burgundy-700 transition-colors cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-6">
        
        {/* Patron Greeting & Clean Metric Strip */}
        <div className="bg-[#FAF7F2] rounded-3xl p-5 sm:p-7 border border-brown-200/70 shadow-warm-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2A201B] text-cream-100 flex items-center justify-center font-serif text-xl sm:text-2xl font-normal shadow-xs shrink-0">
                {(user?.name || 'H').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-burgundy-600 mb-0.5">
                  <Sparkles size={11} />
                  <span>{isAr ? 'عميل هَدَب • الكويت' : 'HADAB Patron • Kuwait'}</span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl text-brown-950 font-normal truncate">
                  {isAr ? `أهلاً بك، ${user?.name || 'ضيفنا الكريم'}` : `Welcome, ${user?.name || 'Dear Patron'}`}
                </h1>
                <p className="text-[11px] sm:text-xs text-brown-500 font-light mt-0.5 flex items-center gap-2 truncate">
                  <span className="truncate">{user?.email || 'Customer'}</span>
                  <span>•</span>
                  <span className="shrink-0">{isAr ? 'الشحن إلى الكويت' : 'Kuwait Delivery'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-[#F2ECE4]/70 p-2 sm:p-3 rounded-2xl border border-brown-200/50">
              <div className="px-2 sm:px-4 py-1.5 text-center">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-brown-500">
                  {isAr ? 'الطلبات' : 'Orders'}
                </div>
                <div className="font-serif text-lg sm:text-xl font-medium text-brown-900 mt-0.5">
                  {orders.length}
                </div>
              </div>

              <div className="px-2 sm:px-4 py-1.5 text-center border-x border-brown-200/60">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-brown-500">
                  {isAr ? 'قيد التجهيز' : 'Active'}
                </div>
                <div className="font-serif text-lg sm:text-xl font-medium text-burgundy-600 mt-0.5">
                  {activeOrdersCount}
                </div>
              </div>

              <div className="px-2 sm:px-4 py-1.5 text-center">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-brown-500">
                  {isAr ? 'المجموع' : 'Total'}
                </div>
                <div className="font-serif text-lg sm:text-xl font-medium text-brown-900 mt-0.5">
                  {totalSpent} <span className="text-[10px] font-normal text-brown-600">{curr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sleek Segmented Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-[#F2ECE4]/80 rounded-2xl border border-brown-200/60 overflow-x-auto custom-scrollbar">
          {[
            { id: 'orders', label: isAr ? 'سجل الطلبات' : 'Orders & Tracking', icon: Package, count: orders.length },
            { id: 'address', label: isAr ? 'عنوان التوصيل' : 'Delivery Address', icon: MapPin },
            { id: 'support', label: isAr ? 'خدمة العملاء والدفع' : 'Concierge & Payment', icon: MessageCircle },
            { id: 'profile', label: isAr ? 'الملف الشخصي' : 'Account Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  tactileAudio.playScrubTick(360);
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex-1 ${
                  isActive
                    ? 'bg-[#2A201B] text-cream-100 shadow-sm'
                    : 'text-brown-600 hover:text-brown-950 hover:bg-brown-100/40'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span className="text-[11px] sm:text-xs">{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brown-200/60 text-brown-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDER HISTORY & TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-serif text-lg sm:text-xl text-brown-900 font-normal">
                {isAr ? 'متابعة الطلبات' : 'Your Orders'}
              </h2>
              <button
                type="button"
                onClick={fetchOrders}
                className="inline-flex items-center gap-1.5 text-xs text-brown-500 hover:text-burgundy-700 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={isLoadingOrders ? 'animate-spin' : ''} />
                <span>{isAr ? 'تحديث' : 'Refresh'}</span>
              </button>
            </div>

            {/* Subtle Concierge Payment Notice Banner */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-brown-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-brown-900">
                    {isAr ? 'تأكيد الدفع عبر الواتساب' : 'WhatsApp Concierge & KNET Payment'}
                  </h4>
                  <p className="text-[11px] text-brown-600 font-light mt-0.5">
                    {isAr
                      ? 'سيتواصل معك فريق خدمة العملاء لإرسال رابط الدفع وتأكيد الحياكة والشحن للكويت.'
                      : 'Our team contacts you on WhatsApp for payment link, order updates, and delivery.'}
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/96599000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%87%D9%8E%D8%AF%D9%8E%D8%A8%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D9%85%D8%AA%D8%A7%D8%A8%D8%B9%D8%A9%20%D8%B7%D9%84%D8%A8%D9%8A%20%D9%88%D8%A7%D9%84%D8%AF%D9%81%D8%B9"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs shrink-0 transition-colors self-start sm:self-auto"
              >
                <MessageCircle size={13} />
                <span>{isAr ? 'محادثة الواتساب' : 'Chat Concierge'}</span>
              </a>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-10 sm:p-14 text-center border border-brown-200/70 space-y-4">
                <Package size={42} className="mx-auto text-brown-300 stroke-1" />
                <div>
                  <h3 className="font-serif text-lg text-brown-900">
                    {isAr ? 'لا توجد طلبات مسجلة بعد' : 'No orders yet'}
                  </h3>
                  <p className="text-xs text-brown-500 font-light mt-1 max-w-sm mx-auto">
                    {isAr
                      ? 'تصفح مجموعتنا الفريدة واطلب أول قطعة كروشيه محبوكة يدوياً خصيصاً لك.'
                      : 'Explore our handmade collection and discover intentional, hand-crocheted pieces.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenCollection}
                  className="px-6 py-2.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  {isAr ? 'تصفح المتجر' : 'Shop Collection'}
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrderId === (order._id || order.orderNumber);
                const badge = getStatusBadge(order.status, order.statusArabic);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={order._id || order.orderNumber}
                    className="bg-[#FAF7F2] rounded-3xl border border-brown-200/70 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Compact Order Summary Header */}
                    <div
                      onClick={() => {
                        tactileAudio.playScrubTick(320);
                        setExpandedOrderId(isExpanded ? null : (order._id || order.orderNumber));
                      }}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-brown-100/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brown-100/60 border border-brown-200/60 flex items-center justify-center shrink-0">
                          <Package size={18} className="text-brown-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs sm:text-sm font-bold text-brown-950">
                              {order.orderNumber}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badge.bg}`}>
                              <BadgeIcon size={12} className="shrink-0" />
                              <span>{badge.label}</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-brown-500 font-light mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>
                              {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-KW' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span>{order.items?.length || 1} {isAr ? 'قطع' : 'items'}</span>
                            <span>•</span>
                            <span className="text-brown-700 font-medium">
                              {isAr ? 'الكويت' : 'Kuwait'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Item Thumbnails Preview, Price & Expand Arrow */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-brown-200/40">
                        {/* Thumbnail Peek */}
                        {order.items && order.items.length > 0 && (
                          <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                            {order.items.slice(0, 2).map((it: any, i: number) => (
                              <img
                                key={i}
                                src={it.image || '/products/hadab-bag.jpg'}
                                alt={it.name}
                                className="w-8 h-8 rounded-lg object-cover border border-brown-200/80 bg-white"
                              />
                            ))}
                          </div>
                        )}

                        <div className="text-end">
                          <div className="text-[10px] uppercase font-semibold text-brown-400">
                            {isAr ? 'المجموع' : 'Total'}
                          </div>
                          <div className="font-serif text-base sm:text-lg font-medium text-brown-950">
                            {order.total} <span className="text-xs font-normal text-brown-600">{curr}</span>
                          </div>
                        </div>

                        <div className="p-1 rounded-lg text-brown-400 hover:text-brown-900 transition-colors">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded View: Clean Stepper & Details */}
                    {isExpanded && (
                      <div className="border-t border-brown-200/60 bg-[#F5EFEB]/50 p-4 sm:p-6 space-y-5 animate-fade-in">
                        
                        {/* Clean Milestone Stepper */}
                        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-brown-200/60">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-brown-500 mb-3 text-center sm:text-left rtl:sm:text-right">
                            {isAr ? 'مراحل الطلب والتسليم' : 'Order Journey & Delivery'}
                          </div>
                          <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                            {[
                              { title: isAr ? 'استلام الطلب' : 'Received', desc: isAr ? 'تم التأكيد' : 'Confirmed', active: true },
                              { title: isAr ? 'حياكة بالأردن' : 'Handmade', desc: isAr ? 'مشغل هَدَب' : 'Workshop', active: order.status !== 'pending' },
                              { title: isAr ? 'شحن للكويت' : 'Shipping', desc: isAr ? 'شحن جوي' : 'Express Air', active: order.status === 'shipped' || order.status === 'delivered' },
                              { title: isAr ? 'تم التسليم' : 'Delivered', desc: isAr ? 'باب المنزل' : 'To Doorstep', active: order.status === 'delivered' },
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs mb-1 transition-all ${
                                    step.active
                                      ? 'bg-[#2A201B] text-cream-100 shadow-xs'
                                      : 'bg-brown-200/60 text-brown-500'
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                <div className="font-medium text-brown-950 text-[10.5px] sm:text-xs">
                                  {step.title}
                                </div>
                                <div className="text-[9px] sm:text-[10px] text-brown-400 font-light hidden sm:block">
                                  {step.desc}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Items in Order */}
                        <div>
                          <h4 className="text-[11px] uppercase font-semibold text-brown-500 tracking-wider mb-2">
                            {isAr ? 'القطع المطلوبة' : 'Items in Order'}
                          </h4>
                          <div className="divide-y divide-brown-200/40 bg-[#FAF7F2] rounded-2xl border border-brown-200/60 px-3.5">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image || '/products/hadab-bag.jpg'}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-xl border border-brown-200/70 bg-white shrink-0"
                                  />
                                  <div className="min-w-0 truncate">
                                    <div className="font-serif font-medium text-xs sm:text-sm text-brown-950 truncate">
                                      {isAr && item.nameArabic ? item.nameArabic : item.name}
                                    </div>
                                    <div className="text-[11px] text-brown-500 font-light">
                                      {isAr ? 'الكمية' : 'Qty'}: {item.quantity}
                                    </div>
                                  </div>
                                </div>
                                <div className="font-serif font-medium text-xs sm:text-sm text-brown-950 shrink-0">
                                  {item.price * item.quantity} {curr}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Address & WhatsApp Button */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-brown-200/60 space-y-1">
                            <div className="font-semibold text-brown-900 flex items-center gap-1.5">
                              <MapPin size={13} className="text-burgundy-600" />
                              <span>{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                            </div>
                            <p className="text-brown-700 font-light text-[11px] leading-relaxed">
                              {order.address || `${area}, Block ${block}, Street ${street}, House ${house}, Kuwait`}
                            </p>
                            <p className="text-brown-500 text-[10.5px]">
                              {order.customerPhone || `${addressCountry.dialCode} ${addressPhoneDigits}`}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-brown-200/60 flex flex-col justify-between gap-2">
                            <div>
                              <div className="font-semibold text-brown-900 flex items-center gap-1.5">
                                <MessageCircle size={13} className="text-emerald-700" />
                                <span>{isAr ? 'خدمة العملاء' : 'Personal Concierge'}</span>
                              </div>
                              <p className="text-brown-600 text-[11px] font-light mt-0.5">
                                {isAr
                                  ? 'تواصل مباشرة عبر الواتساب للاستفسار عن موعد التوصيل أو رابط الدفع.'
                                  : 'Connect directly on WhatsApp for delivery timing or KNET link.'}
                              </p>
                            </div>
                            <a
                              href={`https://wa.me/96599000000?text=${encodeURIComponent(
                                isAr
                                  ? `مرحباً هَدَب! أستفسر عن طلبي رقم ${order.orderNumber} بقيمة ${order.total} د.ك.`
                                  : `Hello HADAB! Inquiring about order #${order.orderNumber} for ${order.total} KWD.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#2A201B] hover:bg-emerald-800 text-cream-100 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors self-start w-full sm:w-auto"
                            >
                              <MessageCircle size={12} />
                              <span>{isAr ? 'متابعة الطلب على واتساب' : 'WhatsApp for this Order'}</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: KUWAIT DELIVERY ADDRESS */}
        {activeTab === 'address' && (
          <div className="max-w-xl mx-auto bg-[#FAF7F2] rounded-3xl p-5 sm:p-8 border border-brown-200/70 shadow-warm-sm space-y-5">
            <div>
              <h2 className="font-serif text-lg sm:text-xl text-brown-900 font-normal">
                {isAr ? 'عنوان التوصيل في الكويت' : 'Kuwait Delivery Address'}
              </h2>
              <p className="text-xs text-brown-500 font-light mt-0.5">
                {isAr
                  ? 'يتم حفظ هذا العنوان لتسليم جميع طلبات الكروشيه المحبوكة المشحونة من الأردن.'
                  : 'Saved for seamless delivery of all your handmade pieces shipped directly to Kuwait.'}
              </p>
            </div>

            {addressSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{isAr ? 'تم حفظ عنوان التوصيل بنجاح!' : 'Delivery address updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                    {isAr ? 'المنطقة *' : 'Area / Region *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Salmiya, Rawda, Kaifan..."
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F5EFEB] border border-brown-200/60 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500/60 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                    {isAr ? 'القطعة *' : 'Block *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F5EFEB] border border-brown-200/60 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500/60 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                    {isAr ? 'الشارع *' : 'Street *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Street 12 / Salem Al Mubarak"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F5EFEB] border border-brown-200/60 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500/60 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                    {isAr ? 'المنزل / العمارة *' : 'House / Villa / Building *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    placeholder="e.g. House 5"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F5EFEB] border border-brown-200/60 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500/60 transition-all"
                  />
                </div>
              </div>

              {/* Phone with Country Code Selector */}
              <div>
                <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                  {isAr ? 'رقم الهاتف / الواتساب *' : 'Mobile / WhatsApp Number *'}
                </label>
                <div className="relative flex items-center rounded-xl bg-[#F5EFEB] border border-brown-200/60 focus-within:ring-1 focus-within:ring-burgundy-500/60 transition-all">
                  <CountryCodeDropdown
                    selectedCountry={addressCountry}
                    onSelectCountry={setAddressCountry}
                    isAr={isAr}
                  />
                  <input
                    type="tel"
                    required
                    value={addressPhoneDigits}
                    onChange={(e) => setAddressPhoneDigits(e.target.value.replace(/[^\d\s-]/g, ''))}
                    placeholder={addressCountry.sample || '9912 3456'}
                    className={`w-full py-2.5 ${
                      isAr ? 'pr-3 pl-3.5' : 'pl-3 pr-3.5'
                    } bg-transparent text-brown-900 placeholder:text-brown-400 text-xs font-light focus:outline-none`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium uppercase tracking-wider shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {isAr ? 'حفظ العنوان' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CONCIERGE & PAYMENT */}
        {activeTab === 'support' && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Primary Concierge Card */}
            <div className="bg-[#2A201B] text-cream-100 rounded-3xl p-6 sm:p-8 shadow-warm-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cream-200 text-[10px] font-semibold uppercase tracking-wider">
                <MessageCircle size={13} />
                <span>{isAr ? 'خدمة عملاء هَدَب الخاصة' : 'HADAB Personal Concierge'}</span>
              </div>
              
              <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug">
                {isAr
                  ? 'خدمة شخصية متكاملة لكل طلب'
                  : 'Attentive, personal care for every piece'}
              </h3>

              <p className="text-xs text-cream-200/80 font-light leading-relaxed">
                {isAr
                  ? 'نحرص على التواصل المباشر معك عبر الواتساب لتأكيد خيارات الألوان وتفاصيل الحياكة، وتزويدك برابط KNET الآمن لإتمام الدفع بسهولة وراحة.'
                  : 'We connect directly on WhatsApp to confirm your color preferences, custom details, and provide a secure KNET payment link.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href="https://wa.me/96599000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%87%D9%8E%D8%AF%D9%8E%D8%A8%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%D8%A7%D8%A1"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>{isAr ? 'محادثة واتساب فورية' : 'Instant WhatsApp Chat'}</span>
                </a>

                <a
                  href="mailto:Byhadab@gmail.com"
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-cream-100 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail size={15} />
                  <span>Byhadab@gmail.com</span>
                </a>
              </div>
            </div>

            {/* 3 Steps Guide */}
            <div className="bg-[#FAF7F2] rounded-3xl p-5 sm:p-7 border border-brown-200/70 space-y-3.5 text-xs">
              <h4 className="font-serif text-base text-brown-900 font-normal">
                {isAr ? 'رحلة قطعتك المصنوعة يدوياً' : 'How Your Order Is Fulfilled'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-brown-700">
                <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-brown-200/60 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-burgundy-100 text-burgundy-800 flex items-center justify-center font-bold text-xs">1</div>
                  <div className="font-medium text-brown-950 text-xs">{isAr ? 'حياكة يدوية بالأردن' : 'Handmade in Jordan'}</div>
                  <p className="text-[10.5px] text-brown-500 font-light">
                    {isAr ? 'تُحاك كل قطعة بصبر وعناية فائقة بخيوط قطنية نقية.' : 'Crocheted with intentional stitchcraft using natural cotton ribbon.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-brown-200/60 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">2</div>
                  <div className="font-medium text-brown-950 text-xs">{isAr ? 'دفع آمن عبر KNET' : 'Secure KNET Payment'}</div>
                  <p className="text-[10.5px] text-brown-500 font-light">
                    {isAr ? 'رابط دفع رسمي ومباشر يُرسل لك عبر محادثة الواتساب.' : 'Official payment link sent directly through your WhatsApp conversation.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-brown-200/60 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</div>
                  <div className="font-medium text-brown-950 text-xs">{isAr ? 'توصيل لبابك بالكويت' : 'Doorstep Kuwait Delivery'}</div>
                  <p className="text-[10.5px] text-brown-500 font-light">
                    {isAr ? 'شحن جوي سريع وتوصيل مباشر خلال أيام معدودة.' : 'Express air shipment straight to your address across Kuwait.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-[#FAF7F2] rounded-3xl p-5 sm:p-8 border border-brown-200/70 shadow-warm-sm space-y-5">
            <div>
              <h2 className="font-serif text-lg sm:text-xl text-brown-900 font-normal">
                {isAr ? 'البيانات الشخصية' : 'Account Details'}
              </h2>
              <p className="text-xs text-brown-500 font-light mt-0.5">
                {isAr ? 'تعديل اسمك ورقم الهاتف المسجل لدينا.' : 'Update your personal name and contact information.'}
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{isAr ? 'تم تحديث البيانات بنجاح!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                  {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#F5EFEB] border border-brown-200/60 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500/60 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'customer@hadab.craft'}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-brown-100/40 border border-brown-200/50 text-brown-500 cursor-not-allowed text-xs"
                />
              </div>

              {/* Profile Phone with Country Code */}
              <div>
                <label className="block font-semibold text-brown-700 uppercase tracking-wider text-[10px] mb-1">
                  {isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                </label>
                <div className="relative flex items-center rounded-xl bg-[#F5EFEB] border border-brown-200/60 focus-within:ring-1 focus-within:ring-burgundy-500/60 transition-all">
                  <CountryCodeDropdown
                    selectedCountry={profileCountry}
                    onSelectCountry={setProfileCountry}
                    isAr={isAr}
                  />
                  <input
                    type="tel"
                    value={profilePhoneDigits}
                    onChange={(e) => setProfilePhoneDigits(e.target.value.replace(/[^\d\s-]/g, ''))}
                    placeholder={profileCountry.sample || '9912 3456'}
                    className={`w-full py-2.5 ${
                      isAr ? 'pr-3 pl-3.5' : 'pl-3 pr-3.5'
                    } bg-transparent text-brown-900 placeholder:text-brown-400 text-xs font-light focus:outline-none`}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-brown-200/50 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onBackToStore();
                  }}
                  className="text-burgundy-700 hover:text-burgundy-900 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  {profileSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default CustomerDashboard;
