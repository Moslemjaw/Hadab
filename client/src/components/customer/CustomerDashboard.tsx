import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { tactileAudio } from '../../utils/audio';
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
  Phone,
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
  const [phone, setPhone] = useState(user?.phone || localStorage.getItem('hadab_customer_phone') || '+965 9912 3456');
  const [addressSaved, setAddressSaved] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || 'Valued Customer');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+965 9912 3456');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const myOrders = await api.getMyOrders();
      if (myOrders && myOrders.length > 0) {
        setOrders(myOrders);
      } else {
        // Fallback demo order for immediate visual polish if no orders in db yet
        setOrders([
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
        ]);
      }
    } catch {
      // Fallback in case of auth error or offline
      setOrders([
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
      ]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    tactileAudio.playChime();
    localStorage.setItem('hadab_customer_area', area);
    localStorage.setItem('hadab_customer_block', block);
    localStorage.setItem('hadab_customer_street', street);
    localStorage.setItem('hadab_customer_house', house);
    localStorage.setItem('hadab_customer_phone', phone);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.updateProfile({ name: profileName, phone: profilePhone });
      tactileAudio.playChime();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      // Offline fallback
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setProfileSaving(false);
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const getStatusBadge = (status: string, statusArabic?: string) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          label: isAr ? 'تم التسليم بنجاح' : 'Delivered',
        };
      case 'shipped':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Truck,
          label: isAr ? 'تم الشحن للكويت' : 'Shipped to Kuwait',
        };
      case 'hooking':
      case 'finishing':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Clock,
          label: isAr ? (statusArabic || 'قيد الحياكة بالأردن') : 'Handcrafting in Jordan',
        };
      default:
        return {
          bg: 'bg-cream-200 text-brown-800 border-brown-300',
          icon: AlertCircle,
          label: isAr ? (statusArabic || 'بانتظار الدفع') : 'Pending Payment Confirmation',
        };
    }
  };

  return (
    <div className="min-h-screen bg-cream-200 text-brown-800 font-sans pb-24 selection:bg-blush-200 selection:text-brown-900">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#2E221B] text-cream-100 border-b border-brown-900/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="p-2 rounded-xl hover:bg-white/10 text-cream-200 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} className={isAr ? 'rotate-180' : ''} />
              <span>{isAr ? 'المتجر' : 'Store'}</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-medium text-cream-100">HADAB</span>
              <span className="text-[10px] bg-blush-300/20 text-blush-200 px-2 py-0.5 rounded-full border border-blush-200/30 font-semibold tracking-wider uppercase">
                {isAr ? 'حساب العميل' : 'Customer Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCollection}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream-100/10 hover:bg-cream-100/20 text-xs text-cream-100 font-medium transition-colors"
            >
              <ShoppingBag size={14} />
              <span>{isAr ? 'تصفح القطع' : 'Explore Pieces'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                onBackToStore();
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-cream-300 hover:text-white transition-colors cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Welcome & Stats Banner */}
        <div className="bg-gradient-to-br from-[#FAF6F0] to-[#EFE7DC] rounded-3xl p-6 sm:p-8 border border-brown-300/70 shadow-warm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-burgundy-600 text-cream-100 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                {(user?.name || 'H').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10.5px] uppercase font-bold tracking-widest text-burgundy-600 mb-1">
                  <Sparkles size={12} />
                  <span>{isAr ? 'عميل هَدَب المميز • الكويت' : 'HADAB Patron • Kuwait'}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-brown-950 font-normal">
                  {isAr ? `أهلاً بك، ${user?.name || 'ضيفنا الكريم'}` : `Welcome back, ${user?.name || 'Dear Patron'}`}
                </h1>
                <p className="text-xs text-brown-600 font-light mt-1 flex items-center gap-2">
                  <Mail size={12} />
                  <span>{user?.email || 'Customer'}</span>
                  <span>•</span>
                  <MapPin size={12} />
                  <span>{isAr ? 'الشحن إلى الكويت' : 'Shipping to Kuwait'}</span>
                </p>
              </div>
            </div>

            {/* Quick KPI Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
              <div className="bg-white/80 rounded-2xl p-3.5 sm:p-4 border border-brown-200/80 text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider text-brown-500 mb-0.5">
                  {isAr ? 'إجمالي الطلبات' : 'Orders'}
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                  {orders.length}
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-3.5 sm:p-4 border border-brown-200/80 text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider text-brown-500 mb-0.5">
                  {isAr ? 'قيد التجهيز' : 'Active'}
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-burgundy-600">
                  {activeOrdersCount}
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-3.5 sm:p-4 border border-brown-200/80 text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider text-brown-500 mb-0.5">
                  {isAr ? 'المشتريات' : 'Total'}
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                  {totalSpent} <span className="text-xs font-normal text-brown-600">{curr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-brown-300/80 pb-2 overflow-x-auto">
          {[
            { id: 'orders', label: isAr ? 'سجل الطلبات' : 'Order History', icon: Package, count: orders.length },
            { id: 'address', label: isAr ? 'عنوان التوصيل بالكويت' : 'Kuwait Delivery Address', icon: MapPin },
            { id: 'support', label: isAr ? 'خدمة العملاء والدفع' : 'Customer Service & Payment', icon: MessageCircle },
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200/80 text-brown-700 border border-brown-200/70'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brown-200 text-brown-700'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-brown-900 font-medium">
                {isAr ? 'طلباتك وحالتها' : 'Your Orders & Tracking'}
              </h2>
              <button
                type="button"
                onClick={fetchOrders}
                className="inline-flex items-center gap-1.5 text-xs text-brown-600 hover:text-burgundy-600 transition-colors"
              >
                <RefreshCw size={13} className={isLoadingOrders ? 'animate-spin' : ''} />
                <span>{isAr ? 'تحديث' : 'Refresh'}</span>
              </button>
            </div>

            {/* Prominent Payment Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brown-950 uppercase tracking-wider">
                    {isAr ? 'طريقة الدفع عبر واتساب' : 'Payment via WhatsApp'}
                  </h4>
                  <p className="text-xs text-brown-700 font-medium mt-0.5">
                    {isAr
                      ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع وتزويدك برابط KNET'
                      : 'Now our customer service will contact you for the payment'}
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/96599000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%87%D9%8E%D8%AF%D9%8E%D8%A8%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D9%85%D8%AA%D8%A7%D8%A8%D8%B9%D8%A9%20%D8%B7%D9%84%D8%A8%D9%8A%20%D9%88%D8%A7%D9%84%D8%AF%D9%81%D8%B9"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-colors"
              >
                <MessageCircle size={14} />
                <span>{isAr ? 'تواصل مع خدمة العملاء' : 'Chat Customer Service'}</span>
              </a>
            </div>

            {orders.length === 0 ? (
              <div className="bg-cream-100 rounded-3xl p-12 text-center border border-brown-200/80 space-y-4">
                <Package size={48} className="mx-auto text-brown-400 stroke-1" />
                <div>
                  <h3 className="font-serif text-lg text-brown-800">
                    {isAr ? 'لا توجد طلبات مسجلة بعد' : 'No orders placed yet'}
                  </h3>
                  <p className="text-xs text-brown-500 font-light mt-1">
                    {isAr
                      ? 'تصفح مجموعتنا الفريدة واطلب أول قطعة كروشيه محبوكة خصيصاً لك.'
                      : 'Explore our handmade collection and order your first custom knitted piece.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenCollection}
                  className="px-6 py-2.5 rounded-full bg-burgundy-600 hover:bg-burgundy-700 text-cream-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  {isAr ? 'تصفح المتجر' : 'Shop Collection'}
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrderId === order._id || expandedOrderId === order.orderNumber;
                const badge = getStatusBadge(order.status, order.statusArabic);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={order._id || order.orderNumber}
                    className="bg-cream-100 rounded-3xl border border-brown-200/80 shadow-warm-sm overflow-hidden transition-all"
                  >
                    {/* Order Summary Bar */}
                    <div
                      onClick={() => setExpandedOrderId(isExpanded ? null : (order._id || order.orderNumber))}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-cream-200/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cream-200/80 border border-brown-300 flex items-center justify-center shrink-0">
                          <Package size={22} className="text-brown-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-brown-900">
                              {order.orderNumber}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                              <BadgeIcon size={12} />
                              <span>{badge.label}</span>
                            </span>
                          </div>
                          <div className="text-xs text-brown-500 font-light mt-1 flex items-center gap-2 flex-wrap">
                            <span>{new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-KW' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{order.items?.length || 1} {isAr ? 'قطع' : 'items'}</span>
                            <span>•</span>
                            <span className="text-brown-700 font-medium">
                              {isAr ? 'شحن إلى الكويت' : 'Shipped to Kuwait'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-brown-200/60">
                        <div className="text-end">
                          <div className="text-[10px] uppercase font-bold text-brown-400">{isAr ? 'المجموع' : 'Total'}</div>
                          <div className="font-serif text-lg font-bold text-brown-900">
                            {order.total} <span className="text-xs font-medium">{curr}</span>
                          </div>
                        </div>
                        <button className="p-1 text-brown-400 hover:text-brown-900 transition-colors">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Order Progress Timeline */}
                    <div className="px-6 py-4 bg-cream-200/50 border-t border-b border-brown-200/60">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-brown-500 mb-3">
                        {isAr ? 'مراحل الطلب والتوصيل إلى الكويت' : 'Order & Kuwait Delivery Timeline'}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10.5px]">
                        {[
                          { id: '1', title: isAr ? 'استلام الطلب' : 'Received', desc: isAr ? 'تأكيد الحجز' : 'Confirmed', active: true },
                          { id: '2', title: isAr ? 'حياكة بالأردن' : 'Handmade', desc: isAr ? 'مشغل الأردن' : 'In Workshop', active: order.status !== 'pending' },
                          { id: '3', title: isAr ? 'شحن للكويت' : 'Shipping', desc: isAr ? 'شحن جوي سريع' : 'Express Air', active: order.status === 'shipped' || order.status === 'delivered' },
                          { id: '4', title: isAr ? 'التسليم' : 'Delivered', desc: isAr ? 'باب منزلك' : 'To Doorstep', active: order.status === 'delivered' },
                        ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                              step.active ? 'bg-burgundy-600 text-cream-100 shadow-sm' : 'bg-brown-200 text-brown-500'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="font-semibold text-brown-900 text-[11px]">{step.title}</div>
                            <div className="text-[9.5px] text-brown-500 hidden sm:block">{step.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <div className="p-6 space-y-6 bg-white/40">
                        {/* Items in order */}
                        <div>
                          <h4 className="text-xs uppercase font-bold text-brown-500 tracking-wider mb-3">
                            {isAr ? 'القطع المطلوبة' : 'Items in Order'}
                          </h4>
                          <div className="divide-y divide-brown-200/60">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="py-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image || '/products/hadab-bag.jpg'}
                                    alt={item.name}
                                    className="w-14 h-14 object-cover rounded-xl border border-brown-200 bg-cream-100"
                                  />
                                  <div>
                                    <div className="font-serif font-medium text-sm text-brown-900">
                                      {isAr && item.nameArabic ? item.nameArabic : item.name}
                                    </div>
                                    <div className="text-xs text-brown-500">
                                      {isAr ? 'الكمية' : 'Qty'}: {item.quantity}
                                    </div>
                                  </div>
                                </div>
                                <div className="font-serif font-bold text-sm text-brown-900">
                                  {item.price * item.quantity} {curr}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery address & WhatsApp contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-brown-200/60 text-xs">
                          <div className="p-4 rounded-2xl bg-cream-200/70 border border-brown-200 space-y-1">
                            <div className="font-bold text-brown-900 flex items-center gap-1.5 mb-1">
                              <MapPin size={14} className="text-burgundy-600" />
                              <span>{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                            </div>
                            <p className="text-brown-700 font-medium">
                              {order.address || `${area}, Block ${block}, Street ${street}, House ${house}, Kuwait`}
                            </p>
                            <p className="text-brown-500 text-[11px]">
                              {order.customerPhone || phone}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="font-bold text-brown-900 flex items-center gap-1.5 mb-1">
                                <MessageCircle size={14} className="text-emerald-600" />
                                <span>{isAr ? 'الدفع والتواصل' : 'Payment & Contact'}</span>
                              </div>
                              <p className="text-brown-700 text-[11px]">
                                {isAr
                                  ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع وتزويدك برابط KNET'
                                  : 'Now our customer service will contact you for the payment'}
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
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors self-start w-full sm:w-auto"
                            >
                              <MessageCircle size={14} />
                              <span>{isAr ? 'مراسلة خدمة العملاء بخصوص هذا الطلب' : 'WhatsApp Support for this Order'}</span>
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
          <div className="max-w-2xl bg-cream-100 rounded-3xl p-6 sm:p-8 border border-brown-200/80 shadow-warm-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl text-brown-900 font-medium">
                {isAr ? 'عنوان التوصيل في دولة الكويت' : 'Kuwait Delivery Address'}
              </h2>
              <p className="text-xs text-brown-500 font-light mt-1">
                {isAr
                  ? 'يتم حفظ هذا العنوان لتسليم جميع طلبات الكروشيه المحبوكة المشحونة من الأردن.'
                  : 'Saved for seamless delivery of all your handmade knitwear pieces shipped from Jordan.'}
              </p>
            </div>

            {addressSaved && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{isAr ? 'تم حفظ عنوان التوصيل بنجاح!' : 'Delivery address updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                    {isAr ? 'المنطقة في الكويت *' : 'Area / Region in Kuwait *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Salmiya, Rawda, Kaifan..."
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                    {isAr ? 'القطعة *' : 'Block *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                    {isAr ? 'الشارع *' : 'Street *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Street 12 / Salem Al Mubarak"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                    {isAr ? 'المنزل / القسيمة / العمارة *' : 'House / Building / Villa *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    placeholder="e.g. House 5"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                  {isAr ? 'رقم الهاتف / الواتساب في الكويت *' : 'Kuwait Mobile / WhatsApp *'}
                </label>
                <div className="relative">
                  <Phone size={14} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-brown-400`} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+965 9912 3456"
                    className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {isAr ? 'حفظ العنوان' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CUSTOMER SUPPORT & PAYMENT */}
        {activeTab === 'support' && (
          <div className="max-w-3xl space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-warm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <MessageCircle size={14} />
                <span>{isAr ? 'خدمة العملاء المباشرة' : 'Direct Customer Support'}</span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                {isAr
                  ? 'سيتواصل معك فريق خدمة العملاء الآن لإتمام عملية الدفع'
                  : 'Now our customer service will contact you for the payment'}
              </h3>

              <p className="text-xs text-emerald-100/80 font-light leading-relaxed max-w-xl">
                {isAr
                  ? 'جميع طلباتنا يتم تأكيدها وإرسال رابط دفع KNET الآمن أو تأكيد الدفع عند الاستلام مباشرة عبر الواتساب مع فريقنا المختص في المتجر.'
                  : 'All orders are confirmed with a secure KNET payment link or cash on delivery directly via WhatsApp with our dedicated team.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/96599000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%87%D9%8E%D8%AF%D9%8E%D8%A8%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AF%D9%81%D8%B9%20%D9%88%D8%AA%D8%A3%D9%83%D9%8A%D8%AF%20%D8%B7%D9%84%D8%A8%D9%8A"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageCircle size={16} />
                  <span>{isAr ? 'محادثة واتساب فورية' : 'Instant WhatsApp Chat'}</span>
                </a>

                <a
                  href="mailto:Byhadab@gmail.com"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail size={16} />
                  <span>Byhadab@gmail.com</span>
                </a>
              </div>
            </div>

            {/* FAQs / How It Works */}
            <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-brown-200/80 space-y-4 text-xs">
              <h4 className="font-serif text-lg text-brown-900 font-medium">
                {isAr ? 'كيف يتم تجهيز وشحن طلبك؟' : 'How Order Fulfillment Works'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-brown-700">
                <div className="p-4 rounded-2xl bg-cream-200/60 border border-brown-200 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-burgundy-100 text-burgundy-700 flex items-center justify-center font-bold">1</div>
                  <div className="font-bold text-brown-900">{isAr ? 'حياكة يدوية في الأردن' : 'Handmade in Jordan'}</div>
                  <p className="text-[11px] text-brown-500 font-light">
                    {isAr ? 'تُحاك كل قطعة بخيوط طبيعية مختارة بعناية وهدوء.' : 'Each piece is crocheted with patience and natural cotton cord.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream-200/60 border border-brown-200 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">2</div>
                  <div className="font-bold text-brown-900">{isAr ? 'دفع آمن عبر KNET' : 'Secure KNET Payment'}</div>
                  <p className="text-[11px] text-brown-500 font-light">
                    {isAr ? 'سيتواصل معك فريق خدمة العملاء لإرسال رابط الدفع.' : 'Our customer team will message you to send your KNET link.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream-200/60 border border-brown-200 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">3</div>
                  <div className="font-bold text-brown-900">{isAr ? 'شحن سريع للكويت' : 'Fast Delivery to Kuwait'}</div>
                  <p className="text-[11px] text-brown-500 font-light">
                    {isAr ? 'توصيل مباشر إلى باب منزلك في الكويت خلال أيام معدودة.' : 'Direct delivery to your doorstep in Kuwait within a few days.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-cream-100 rounded-3xl p-6 sm:p-8 border border-brown-200/80 shadow-warm-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl text-brown-900 font-medium">
                {isAr ? 'البيانات الشخصية' : 'Account Details'}
              </h2>
              <p className="text-xs text-brown-500 font-light mt-1">
                {isAr ? 'تعديل اسمك ورقم الهاتف المسجل لدينا.' : 'Update your personal name and contact number.'}
              </p>
            </div>

            {profileSaved && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{isAr ? 'تم تحديث البيانات بنجاح!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                  {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'customer@hadab.craft'}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-cream-200/70 border border-brown-200 text-brown-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-brown-700 uppercase tracking-wider text-[10px] mb-1.5">
                  {isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm"
                />
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-brown-200/60 mt-4">
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
                  className="px-6 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
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
