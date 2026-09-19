import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
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
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  FileText,
  MessageSquare,
  Send,
} from 'lucide-react';
import { downloadOrderInvoicePdf } from '../../utils/invoiceGenerator';

interface CustomerDashboardProps {
  onBackToStore: () => void;
  onOpenCollection: () => void;
  onOpenContact?: () => void;
}

type OrderPaymentStatus = 'unpaid' | 'contacting' | 'paid';

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBackToStore,
  onOpenCollection,
  onOpenContact,
}) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const { format, storePhone } = useCurrency();
  const isAr = language === 'ar';

  const whatsappAdminPhone = useMemo(() => {
    const raw = storePhone || localStorage.getItem('hadab_store_phone') || '+965 9900 0000';
    let cleaned = raw.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.slice(2);
    }
    return cleaned || '96599000000';
  }, [storePhone]);

  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'address' | 'support' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Messages State
  const [myMessages, setMyMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [expandedMsgId, setExpandedMsgId] = useState<string | null>(null);

  // Address Form state
  const [area, setArea] = useState(localStorage.getItem('hadab_customer_area') || 'Salmiya');
  const [block, setBlock] = useState(localStorage.getItem('hadab_customer_block') || '4');
  const [street, setStreet] = useState(localStorage.getItem('hadab_customer_street') || '12');
  const [house, setHouse] = useState(localStorage.getItem('hadab_customer_house') || '5');
  const [addressSaved, setAddressSaved] = useState(false);

  // Country & phone state
  const [addressCountry, setAddressCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [addressPhoneDigits, setAddressPhoneDigits] = useState('9912 3456');

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || 'Valued Customer');
  const [profileCountry, setProfileCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [profilePhoneDigits, setProfilePhoneDigits] = useState('9912 3456');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Initialize phone from user
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
    fetchMyMessages();
  }, [user]);

  const fetchMyMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const msgs = await api.getMyMessages();
      setMyMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error('Failed to load user messages:', err);
      setMyMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const myOrders = await api.getMyOrders();
      if (myOrders && Array.isArray(myOrders) && myOrders.length > 0) {
        setOrders(myOrders);
        setExpandedOrderId(myOrders[0]._id || myOrders[0].orderNumber);
      } else {
        setOrders([]);
        setExpandedOrderId(null);
      }
    } catch (err) {
      console.error('Failed to load user orders:', err);
      setOrders([]);
      setExpandedOrderId(null);
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

  // Status Badge Helper: paid, contacting, unpaid (updated by admin)
  const getOrderPaymentBadge = (order: any) => {
    const raw = (order.paymentStatus || 'unpaid').toLowerCase();

    if (raw === 'paid') {
      return {
        key: 'paid' as OrderPaymentStatus,
        label: isAr ? 'تم الدفع' : 'Paid',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        dot: 'bg-emerald-500',
        icon: CheckCircle2,
      };
    }
    if (raw === 'contacting') {
      return {
        key: 'contacting' as OrderPaymentStatus,
        label: isAr ? 'جاري التواصل' : 'Contacting',
        bg: 'bg-sky-50 text-sky-800 border-sky-200/80',
        dot: 'bg-sky-500',
        icon: Clock,
      };
    }
    return {
      key: 'unpaid' as OrderPaymentStatus,
      label: isAr ? 'غير مدفوع' : 'Unpaid',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
      icon: AlertCircle,
    };
  };

  // Fulfillment badge (if order is in production/transit)
  const getFulfillmentPill = (status: string, _statusArabic?: string) => {
    switch (status) {
      case 'delivered':
        return {
          label: isAr ? 'تم التسليم' : 'Delivered',
          icon: CheckCircle2,
          color: 'text-emerald-700 bg-emerald-100/50',
        };
      case 'shipped':
        return {
          label: isAr ? 'تم الشحن' : 'Shipped',
          icon: Truck,
          color: 'text-sky-700 bg-sky-100/50',
        };
      case 'handmade':
      case 'finishing':
      case 'hooking':
        return {
          label: isAr ? 'حياكة يدوية' : 'Handmade',
          icon: Clock,
          color: 'text-amber-700 bg-amber-100/50',
        };
      case 'pending':
        return {
          label: isAr ? 'تم الاستلام' : 'Pending',
          icon: Clock,
          color: 'text-brown-700 bg-brown-100/50',
        };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream-200 text-brown-800 font-sans pb-24 selection:bg-blush-200 selection:text-brown-900">
      
      {/* Top Header Bar - Minimal & Airy */}
      <header className="sticky top-0 z-30 bg-cream-200/95 backdrop-blur-md border-b border-brown-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs text-brown-600 hover:text-brown-950 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft size={14} className={isAr ? 'rotate-180' : ''} />
            <span>{isAr ? 'المتجر' : 'Store'}</span>
          </button>

          <span className="font-serif text-lg tracking-wide text-brown-950 font-normal">
            HADAB
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCollection}
              className="px-3 py-1.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag size={12} />
              <span className="hidden sm:inline">{isAr ? 'المتجر' : 'Collection'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                onBackToStore();
              }}
              className="p-1.5 rounded-lg text-brown-400 hover:text-burgundy-700 transition-colors cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">

        {/* Clean, Uncluttered Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-brown-200/60 pb-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-brown-950 font-normal">
              {isAr ? `أهلاً بك، ${user?.name || 'ضيفنا الكريم'}` : `Welcome, ${user?.name || 'Dear Patron'}`}
            </h1>
            <p className="text-xs text-brown-500 font-light mt-1 flex items-center gap-2 flex-wrap">
              <span>{user?.email || 'customer@hadab.craft'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-burgundy-600" />
                <span>{(user as any)?.city || (user as any)?.country || (isAr ? 'عميل مميز' : 'Valued Patron')}</span>
              </span>
            </p>
          </div>

          {/* Inline Quick Summary Numbers */}
          <div className="flex items-center gap-4 text-xs text-brown-600 font-light pt-1 sm:pt-0">
            <span>
              <strong className="font-medium text-brown-900">{orders.length}</strong> {isAr ? 'طلب' : 'Orders'}
            </span>
            <span>•</span>
            <span>
              <strong className="font-medium text-brown-900">{activeOrdersCount}</strong> {isAr ? 'قيد التجهيز' : 'Active'}
            </span>
            <span>•</span>
            <span>
              <strong className="font-medium text-brown-900">{format(totalSpent, isAr)}</strong>
            </span>
          </div>
        </div>

        {/* Breathable Tabs Navigation */}
        <div className="flex items-center justify-between w-full border-b border-brown-200/50 pb-px overflow-x-auto custom-scrollbar gap-1 sm:gap-2">
          {[
            { id: 'orders', label: isAr ? 'الطلبات والمتابعة' : 'Orders & Tracking', icon: Package, count: orders.length },
            { id: 'messages', label: isAr ? 'رسائلي واستفساراتي' : 'My Messages', icon: MessageSquare, count: myMessages.length },
            { id: 'address', label: isAr ? 'عنوان التوصيل' : 'Delivery Address', icon: MapPin },
            { id: 'support', label: isAr ? 'خدمة العملاء' : 'Concierge & Payment', icon: MessageCircle },
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
                  tactileAudio.playScrubTick(340);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                  isActive
                    ? 'border-[#2A201B] text-brown-950 font-semibold'
                    : 'border-transparent text-brown-500 hover:text-brown-800 hover:border-brown-300/60'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans ${
                      isActive ? 'bg-[#2A201B] text-cream-100' : 'bg-brown-200/60 text-brown-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: ORDERS & TRACKING (Restructured, Spacious, Dynamic) */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-brown-500">
                {isAr ? 'قائمة الطلبات' : 'Order History'}
              </h2>
              <button
                type="button"
                onClick={fetchOrders}
                className="inline-flex items-center gap-1.5 text-xs text-brown-500 hover:text-brown-900 transition-colors cursor-pointer"
              >
                <RefreshCw size={11} className={isLoadingOrders ? 'animate-spin' : ''} />
                <span>{isAr ? 'تحديث' : 'Refresh'}</span>
              </button>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
              <div className="bg-white/60 rounded-2xl p-10 text-center border border-brown-200/50 space-y-3">
                <Package size={36} className="mx-auto text-brown-300 stroke-1" />
                <h3 className="font-serif text-base text-brown-900">
                  {isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}
                </h3>
                <button
                  type="button"
                  onClick={onOpenCollection}
                  className="px-5 py-2 rounded-full bg-[#2A201B] text-cream-100 text-xs font-medium cursor-pointer"
                >
                  {isAr ? 'تصفح المجموعة' : 'Explore Collection'}
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrderId === (order._id || order.orderNumber);
                const paymentBadge = getOrderPaymentBadge(order);
                const fulfillmentPill = getFulfillmentPill(order.status, order.statusArabic);

                return (
                  <div
                    key={order._id || order.orderNumber}
                    className="bg-white/80 rounded-2xl border border-brown-200/70 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Compact, Clean Card Header */}
                    <div
                      onClick={() => {
                        tactileAudio.playScrubTick(320);
                        setExpandedOrderId(isExpanded ? null : (order._id || order.orderNumber));
                      }}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-brown-50/40 transition-colors"
                    >
                      {/* Left: Order Number, Date & Status Badges */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cream-200/70 border border-brown-200/70 flex items-center justify-center shrink-0">
                          <Package size={17} className="text-brown-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs sm:text-sm font-bold text-brown-950">
                              {order.orderNumber}
                            </span>

                            {/* Payment Status Badge: paid, contacting, unpaid */}
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium border ${paymentBadge.bg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
                              <span>{paymentBadge.label}</span>
                            </span>

                            {/* Fulfillment status if active */}
                            {fulfillmentPill && (
                              <span
                                className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${fulfillmentPill.color}`}
                              >
                                <span>{fulfillmentPill.label}</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-brown-500 font-light mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-KW' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            • {order.items?.length || 1} {isAr ? 'قطع' : 'items'}
                          </div>
                        </div>
                      </div>

                      {/* Right: Total Price & Toggle */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-brown-100">
                        {order.items && order.items.length > 0 && (
                          <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                            {order.items.slice(0, 2).map((it: any, i: number) => {
                              const img = it.image || it.product?.image || '/products/hadab-bag.jpg';
                              const name = it.name || it.product?.name || 'Item';
                              return (
                                <img
                                  key={i}
                                  src={img}
                                  alt={name}
                                  className="w-7 h-7 rounded-lg object-cover border border-brown-200 bg-white"
                                />
                              );
                            })}
                          </div>
                        )}

                        <div className="text-end">
                          <span className="font-serif text-sm sm:text-base font-semibold text-brown-950">
                            {format(order.total, isAr)}
                          </span>
                        </div>

                        <div className="text-brown-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Clean Section (NO nested boxes!) */}
                    {isExpanded && (
                      <div className="border-t border-brown-200/50 bg-cream-100/60 p-4 sm:p-5 space-y-4 animate-fade-in text-xs">
                        
                        {/* Payment & Order Status Strip (Managed by Admin) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-white rounded-xl border border-brown-200/60 shadow-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${paymentBadge.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
                              <span>{isAr ? 'حالة الدفع:' : 'Payment:'} {paymentBadge.label}</span>
                            </span>
                            <span className="text-[11px] text-brown-500 font-light">
                              {paymentBadge.key === 'paid'
                                ? isAr ? 'تم تأكيد الدفع بنجاح' : 'Payment confirmed'
                                : paymentBadge.key === 'contacting'
                                ? isAr ? 'فريقنا يتواصل معك لإتمام الدفع' : 'Our team is coordinating with you'
                                : isAr ? 'سيتواصل معك فريقنا لإتمام الدفع' : 'Our team will contact you for the payment'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-brown-600">
                            <span className="text-brown-400 font-light">{isAr ? 'حالة الطلب:' : 'Fulfillment:'}</span>
                            <span className="font-semibold text-brown-800">
                              {order.status === 'delivered'
                                ? isAr ? 'تم التسليم' : 'Delivered'
                                : order.status === 'shipped'
                                ? isAr ? 'تم الشحن' : 'Shipped'
                                : order.status === 'handmade' || order.status === 'hooking' || order.status === 'finishing'
                                ? isAr ? 'حياكة يدوية' : 'Handmade'
                                : isAr ? 'تم الاستلام' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Ordered Items List */}
                        <div className="space-y-2">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-brown-400">
                            {isAr ? 'القطع' : 'Items'}
                          </div>
                          <div className="divide-y divide-brown-100 bg-white rounded-xl border border-brown-200/50 px-3">
                            {order.items?.map((item: any, i: number) => {
                              const img = item.image || item.product?.image || '/products/hadab-bag.jpg';
                              const name = item.name || item.product?.name || 'Handmade Piece';
                              const nameAr = item.nameArabic || item.product?.nameArabic || name;
                              const qty = item.quantity || 1;
                              const price = item.price ?? item.product?.price ?? 0;

                              return (
                                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={img}
                                      alt={name}
                                      className="w-10 h-10 object-cover rounded-lg border border-brown-200 shrink-0"
                                    />
                                    <div className="min-w-0 truncate">
                                      <div className="font-serif text-xs sm:text-sm text-brown-900 truncate">
                                        {isAr && nameAr ? nameAr : name}
                                      </div>
                                      <div className="text-[10.5px] text-brown-500 font-light">
                                        {isAr ? 'الكمية' : 'Qty'}: {qty}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="font-serif font-medium text-brown-900 shrink-0">
                                    {format(price * qty, isAr)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delivery Address & Invoice Download */}
                        <div className="pt-1 flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-brown-200/50">
                          <div className="text-[11px] text-brown-600 font-light flex-1 min-w-0">
                            <span className="font-semibold text-brown-800">{isAr ? 'العنوان: ' : 'Address: '}</span>
                            <span>{order.address || `${area}, Block ${block}, Street ${street}, House ${house}, Kuwait`}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadOrderInvoicePdf(order, isAr ? 'د.ك' : 'KD', storePhone);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2D2421] hover:bg-[#423430] text-white rounded-lg text-[11px] font-semibold transition-all shadow-xs cursor-pointer shrink-0"
                          >
                            <FileText size={12} />
                            <span>{isAr ? 'تحميل الفاتورة PDF' : 'Download Bill PDF'}</span>
                          </button>
                        </div>

                        {/* Minimal 4-Step Progress Line */}
                        <div className="pt-2 border-t border-brown-200/50">
                          <div className="grid grid-cols-4 gap-1 text-center">
                            {[
                              { title: isAr ? 'تم الاستلام' : 'Pending', active: true },
                              { title: isAr ? 'حياكة يدوية' : 'Handmade', active: ['handmade', 'hooking', 'finishing', 'shipped', 'delivered'].includes(order.status) },
                              { title: isAr ? 'تم الشحن' : 'Shipped', active: order.status === 'shipped' || order.status === 'delivered' },
                              { title: isAr ? 'تم التسليم' : 'Delivered', active: order.status === 'delivered' },
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5 ${
                                    step.active ? 'bg-[#2A201B] text-white' : 'bg-brown-200 text-brown-400'
                                  }`}
                                >
                                  {step.active ? <Check size={10} /> : idx + 1}
                                </div>
                                <span className="text-[10px] text-brown-700 font-medium">
                                  {step.title}
                                </span>
                              </div>
                            ))}
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

        {/* ============================================================ */}
        {/* TAB: CUSTOMER INQUIRIES & MESSAGES */}
        {/* ============================================================ */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg text-brown-950 font-normal">
                  {isAr ? 'رسائلي واستفساراتي' : 'My Inquiries & Messages'}
                </h2>
                <p className="text-xs text-brown-500 font-light mt-0.5">
                  {isAr
                    ? 'تابع استفساراتك الموجهة لإدارة هَدَب والردود الواردة عليها.'
                    : 'Track your submitted messages and view responses from the HADAB concierge team.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMyMessages}
                  className="inline-flex items-center gap-1.5 text-xs text-brown-500 hover:text-brown-900 transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-brown-100/50"
                >
                  <RefreshCw size={11} className={isLoadingMessages ? 'animate-spin' : ''} />
                  <span>{isAr ? 'تحديث' : 'Refresh'}</span>
                </button>
                {onOpenContact && (
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cream-100 bg-[#2A201B] hover:bg-brown-900 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shadow-xs"
                  >
                    <Send size={11} />
                    <span>{isAr ? 'رسالة جديدة' : 'New Message'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {isLoadingMessages ? (
              <div className="bg-white/60 rounded-2xl p-12 text-center border border-brown-200/50 space-y-3">
                <RefreshCw size={24} className="mx-auto text-brown-400 animate-spin" />
                <p className="text-xs text-brown-500 font-light">
                  {isAr ? 'جاري تحميل الرسائل...' : 'Loading messages...'}
                </p>
              </div>
            ) : myMessages.length === 0 ? (
              <div className="bg-white/60 rounded-2xl p-10 text-center border border-brown-200/50 space-y-3">
                <MessageSquare size={36} className="mx-auto text-brown-300 stroke-1" />
                <h3 className="font-serif text-base text-brown-900">
                  {isAr ? 'لا توجد رسائل سابقة' : 'No messages yet'}
                </h3>
                <p className="text-xs text-brown-500 font-light max-w-sm mx-auto">
                  {isAr
                    ? 'هل لديك أي استفسار أو طلب تفصيل خاص؟ يسعدنا تواصلك معنا دائماً.'
                    : 'Have an inquiry or custom crochet request? We would love to assist you.'}
                </p>
                {onOpenContact && (
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="px-5 py-2 rounded-full bg-[#2A201B] text-cream-100 text-xs font-medium cursor-pointer hover:bg-brown-900 transition-colors"
                  >
                    {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
                  </button>
                )}
              </div>
            ) : (
              myMessages.map((msg) => {
                const isExpanded = expandedMsgId === msg._id;
                const dateFormatted = msg.createdAt
                  ? new Date(msg.createdAt).toLocaleDateString(isAr ? 'ar-KW' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';

                const replyDateFormatted = msg.repliedAt
                  ? new Date(msg.repliedAt).toLocaleDateString(isAr ? 'ar-KW' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';

                // Status configuration
                let statusBadge = {
                  text: isAr ? 'قيد المراجعة' : 'Pending',
                  classes: 'bg-amber-50 text-amber-800 border-amber-200/70',
                };
                if (msg.status === 'in_progress') {
                  statusBadge = {
                    text: isAr ? 'جاري المتابعة' : 'In Progress',
                    classes: 'bg-blue-50 text-blue-800 border-blue-200/70',
                  };
                } else if (msg.status === 'resolved') {
                  statusBadge = {
                    text: isAr ? 'تم الرد' : 'Resolved',
                    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
                  };
                }

                return (
                  <div
                    key={msg._id}
                    className="bg-white/80 rounded-2xl border border-brown-200/70 shadow-xs overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => {
                        tactileAudio.playScrubTick(320);
                        setExpandedMsgId(isExpanded ? null : msg._id);
                      }}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-brown-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cream-200/70 border border-brown-200/70 flex items-center justify-center shrink-0">
                          <MessageSquare size={17} className="text-brown-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif text-sm font-medium text-brown-950">
                              {msg.subject}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge.classes}`}
                            >
                              {statusBadge.text}
                            </span>
                            {msg.orderNumber && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream-200/60 text-brown-800 border border-brown-200/50 font-mono">
                                #{msg.orderNumber}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-brown-400 font-light block mt-0.5">
                            {dateFormatted}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {msg.adminReply && (
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                            {isAr ? 'يوجد رد' : 'Reply received'}
                          </span>
                        )}
                        <span className="text-brown-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </div>

                    {/* Message Details Accordion */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-brown-100 space-y-4">
                        {/* Customer's Original Message */}
                        <div className="pt-3">
                          <span className="text-[11px] uppercase tracking-wider text-brown-400 font-medium block mb-1">
                            {isAr ? 'نص رسالتك' : 'Your Message'}
                          </span>
                          <p className="text-xs sm:text-sm text-brown-800 font-light leading-relaxed bg-brown-50/50 p-3.5 rounded-xl border border-brown-100 whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>

                        {/* Admin Reply or Pending Message */}
                        {msg.adminReply ? (
                          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                                  ✓
                                </div>
                                <span className="text-xs font-semibold text-emerald-950">
                                  {isAr ? 'رد إدارة هَدَب' : 'HADAB Concierge Reply'}
                                </span>
                              </div>
                              {replyDateFormatted && (
                                <span className="text-[10px] text-emerald-700 font-light">
                                  {replyDateFormatted}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-light whitespace-pre-wrap">
                              {msg.adminReply}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5">
                            <Clock size={15} className="text-amber-700 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 font-light leading-relaxed">
                              {isAr
                                ? 'رسالتك قيد المراجعة حالياً من قبل فريق خدمة العملاء، وسنقوم بالرد عليك هنا قريباً.'
                                : 'Your message is being reviewed by our concierge team. Our reply will appear here soon.'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: KUWAIT DELIVERY ADDRESS */}
        {/* ============================================================ */}
        {activeTab === 'address' && (
          <div className="bg-white/80 rounded-2xl p-5 sm:p-7 border border-brown-200/70 shadow-xs space-y-4">
            <div>
              <h2 className="font-serif text-lg text-brown-950 font-normal">
                {isAr ? 'عنوان التوصيل' : 'Delivery Address'}
              </h2>
              <p className="text-xs text-brown-500 font-light mt-0.5">
                {isAr
                  ? 'يتم استخدام هذا العنوان لتسليم جميع طلباتك المشحونة مباشرة إلى باب منزلك.'
                  : 'Used for direct doorstep delivery of all your handcrafted pieces.'}
              </p>
            </div>

            {addressSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{isAr ? 'تم حفظ العنوان بنجاح!' : 'Address saved successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-brown-700 text-[11px] mb-1">
                    {isAr ? 'المنطقة *' : 'Area *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Salmiya, Rawda..."
                    className="w-full py-2.5 px-3 rounded-xl bg-cream-50 border border-brown-200/70 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-brown-700 text-[11px] mb-1">
                    {isAr ? 'القطعة *' : 'Block *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full py-2.5 px-3 rounded-xl bg-cream-50 border border-brown-200/70 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-brown-700 text-[11px] mb-1">
                    {isAr ? 'الشارع *' : 'Street *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Salem Al Mubarak"
                    className="w-full py-2.5 px-3 rounded-xl bg-cream-50 border border-brown-200/70 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-brown-700 text-[11px] mb-1">
                    {isAr ? 'المنزل / العمارة *' : 'House / Building *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    placeholder="e.g. House 5"
                    className="w-full py-2.5 px-3 rounded-xl bg-cream-50 border border-brown-200/70 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-brown-700 text-[11px] mb-1">
                  {isAr ? 'رقم الهاتف / الواتساب *' : 'WhatsApp Phone *'}
                </label>
                <div className="relative flex items-center rounded-xl bg-cream-50 border border-brown-200/70 focus-within:ring-1 focus-within:ring-burgundy-500">
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
                      isAr ? 'pr-3 pl-3' : 'pl-3 pr-3'
                    } bg-transparent text-brown-900 text-xs font-light focus:outline-none`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium cursor-pointer transition-colors"
                >
                  {isAr ? 'حفظ العنوان' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CONCIERGE & PAYMENT FAQ */}
        {/* ============================================================ */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="bg-[#2A201B] text-cream-100 rounded-2xl p-6 sm:p-7 space-y-3 shadow-xs">
              <h3 className="font-serif text-xl sm:text-2xl font-normal">
                {isAr ? 'خدمة العملاء والدفع عبر الواتساب' : 'HADAB Personal Concierge'}
              </h3>
              <p className="text-xs text-cream-200/80 font-light leading-relaxed max-w-xl">
                {isAr
                  ? 'يتم التواصل معك عبر الواتساب لتأكيد خيارات الألوان وإرسال رابط الدفع الإلكتروني الرسمي والآمن.'
                  : 'Our team connects with you directly on WhatsApp to confirm custom details and send your official secure payment link.'}
              </p>
              <div className="pt-1 flex flex-wrap gap-2.5">
                <a
                  href={`https://wa.me/${whatsappAdminPhone}?text=${encodeURIComponent(isAr ? 'مرحباً هَدَب، أود التواصل مع خدمة العملاء بخصوص طلبي.' : 'Hello HADAB, I would like to connect with customer service regarding my order.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>{isAr ? 'محادثة الواتساب' : 'WhatsApp Concierge'}</span>
                </a>
                <a
                  href="mailto:Byhadab@gmail.com"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={14} />
                  <span>Byhadab@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/80 border border-brown-200/60 space-y-1">
                <div className="font-semibold text-brown-900">{isAr ? '1. حياكة يدوية' : '1. Handmade'}</div>
                <p className="text-[11px] text-brown-500 font-light">
                  {isAr ? 'تُحاك كل قطعة بعناية فائقة يدوياً.' : 'Crafted with immense care and attention to detail.'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 border border-brown-200/60 space-y-1">
                <div className="font-semibold text-brown-900">{isAr ? '2. دفع آمن' : '2. Secure Payment'}</div>
                <p className="text-[11px] text-brown-500 font-light">
                  {isAr ? 'رابط دفع إلكتروني معتمد يُرسل لك بالواتساب.' : 'Official secure payment link sent via WhatsApp.'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 border border-brown-200/60 space-y-1">
                <div className="font-semibold text-brown-900">{isAr ? '3. شحن دولي ومحلي' : '3. Express Delivery'}</div>
                <p className="text-[11px] text-brown-500 font-light">
                  {isAr ? 'شحن سريع وتوصيل لباب منزلك مباشرة.' : 'Express shipping straight to your door.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: ACCOUNT PROFILE */}
        {/* ============================================================ */}
        {activeTab === 'profile' && (
          <div className="bg-white/80 rounded-2xl p-5 sm:p-7 border border-brown-200/70 shadow-xs space-y-4">
            <div>
              <h2 className="font-serif text-lg text-brown-950 font-normal">
                {isAr ? 'الملف الشخصي' : 'Account Details'}
              </h2>
              <p className="text-xs text-brown-500 font-light mt-0.5">
                {isAr ? 'تحديث الاسم ورقم الهاتف المسجل.' : 'Update your personal name and contact details.'}
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{isAr ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-brown-700 text-[11px] mb-1">
                  {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-cream-50 border border-brown-200/70 text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label className="block font-medium text-brown-700 text-[11px] mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'customer@hadab.craft'}
                  className="w-full py-2.5 px-3 rounded-xl bg-brown-100/50 border border-brown-200/50 text-brown-500 cursor-not-allowed text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-brown-700 text-[11px] mb-1">
                  {isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                </label>
                <div className="relative flex items-center rounded-xl bg-cream-50 border border-brown-200/70 focus-within:ring-1 focus-within:ring-burgundy-500">
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
                      isAr ? 'pr-3 pl-3' : 'pl-3 pr-3'
                    } bg-transparent text-brown-900 text-xs font-light focus:outline-none`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-brown-100">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onBackToStore();
                  }}
                  className="text-burgundy-700 hover:text-burgundy-900 font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 rounded-full bg-[#2A201B] hover:bg-[#3D2D25] text-cream-100 text-xs font-medium cursor-pointer transition-colors"
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
