import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Search,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Edit2,
  Trash2,
  Globe,
  Sparkles,
  Scissors,
  ArrowLeft,
  Users,
  Tag,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Bell,
  ChevronRight,
  GripVertical,
  Download,
  List as ListIcon,
  Grid as GridIcon,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Home,
  Check,
  Upload,
  LogOut,
  Printer,
  StickyNote,
  Ban,
  UserCheck,
  Smartphone,
  Send,
} from 'lucide-react';
import {
  subscribeToPush,
  unsubscribeFromPush,
  sendTestPush,
  getCurrentSubscription,
} from '../../services/pushNotifications';
import type { Product, ColorVariant } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useShopData } from '../../context/ShopDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '../../constants/currencies';
import { type ShippingConfig, type CountryShippingRate, DEFAULT_SHIPPING_CONFIG } from '../../constants/shipping';
import { COUNTRY_CODES } from '../../constants/countryCodes';
import { api } from '../../services/api';
import { tactileAudio } from '../../utils/audio';
import { useNotification } from '../../context/NotificationContext';
import { downloadOrderInvoicePdf } from '../../utils/invoiceGenerator';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: 'Jordan' | 'Kuwait' | 'UAE' | 'Saudi Arabia';
  destinationArabic: string;
  items: { product: Product; quantity: number }[];
  total: number;
  address?: string;
  notes?: string;
  status: string;
  statusArabic: string;
  paymentStatus?: 'unpaid' | 'contacting' | 'paid';
  paymentStatusArabic?: string;
  artisan: string;
  createdAt: string;
  createdAtRaw: string;
}

interface AdminDashboardProps {
  onBackToStore: () => void;
}

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'vip' | 'new';
  isDisabled?: boolean;
  rating: number;
}

interface CategoryRecord {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  pieceCount: number;
  description: string;
  descriptionAr: string;
  color: string;
  image?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { refreshData } = useShopData();
  const { baseCurrency, setBaseCurrency, shippingConfig, setShippingConfig, setStorePhone, refreshSettings } = useCurrency();
  const { showToast, confirmDialog, promptDialog } = useNotification();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings' | 'categories' | 'customers'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [customersList, setCustomersList] = useState<CustomerRecord[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [globalSearch, setGlobalSearch] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'new'>('all');

  // Load live data from MongoDB Atlas
  const fetchLiveData = async () => {
    try {
      const [liveProducts, liveOrders, liveCategories, liveCustomers] = await Promise.allSettled([
        api.getProducts(),
        api.getOrders(),
        api.getCategories(),
        api.getCustomers(),
      ]);

      const prods: Product[] =
        liveProducts.status === 'fulfilled' && Array.isArray(liveProducts.value)
          ? liveProducts.value
          : [];
      setProductsList(prods);

      if (liveOrders.status === 'fulfilled' && Array.isArray(liveOrders.value)) {
        setOrdersList(
          liveOrders.value.map((o: any) => ({
            id: o.id || o._id,
            orderNumber: o.orderNumber,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone || '',
            destination: o.destination || 'Kuwait',
            destinationArabic: o.destinationArabic || 'الكويت',
            address: o.address || '',
            notes: o.notes || '',
            total: o.total || 0,
            items: Array.isArray(o.items)
              ? o.items.map((it: any) => ({
                  product: it.product || {
                    id: it.productId || it.id || '',
                    name: it.name || 'Handmade Item',
                    nameArabic: it.nameArabic || it.name || 'قطعة يدوية',
                    price: it.price || 0,
                    image: it.image || '/products/hadab-bag.jpg',
                    category: it.category || 'Handmade',
                  },
                  quantity: it.quantity || 1,
                  // Also keep flat properties for direct access
                  name: it.name,
                  image: it.image,
                  price: it.price,
                }))
              : [],
            status: o.status || 'pending',
            statusArabic: o.statusArabic || '',
            paymentStatus: o.paymentStatus || 'unpaid',
            paymentStatusArabic: o.paymentStatusArabic || 'غير مدفوع',
            artisan: o.artisan || 'Hadab Team',
            createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent',
            createdAtRaw: o.createdAt || '',
          }))
        );
      } else {
        setOrdersList([]);
      }

      if (liveCategories.status === 'fulfilled' && Array.isArray(liveCategories.value)) {
        setCategoryList(
          liveCategories.value.map((c: any) => ({
            id: c.id || c._id,
            name: c.name,
            nameAr: c.nameAr || c.name,
            slug: c.slug,
            pieceCount: prods.filter((p: any) => p.category === c.slug).length,
            description: c.description || '',
            descriptionAr: c.descriptionAr || '',
            color: c.color || '#D9B99B',
            image: c.image || '/products/hadab-bag.jpg',
          }))
        );
      } else {
        setCategoryList([]);
      }

      if (liveCustomers.status === 'fulfilled' && Array.isArray(liveCustomers.value)) {
        setCustomersList(
          liveCustomers.value.map((u: any) => ({
            id: u.id || u._id,
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            country: u.country || 'Kuwait',
            totalOrders: u.totalOrders || 0,
            totalSpent: u.totalSpent || 0,
            lastOrderDate: u.lastOrderDate || 'No orders',
            status: u.status || 'new',
            isDisabled: Boolean(u.isDisabled),
            rating: u.rating || 5,
          }))
        );
      } else {
        setCustomersList([]);
      }
    } catch (err) {
      console.error('Error fetching live data from MongoDB:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);
  
  // UI States
  const [productView, setProductView] = useState<'grid' | 'list'>('grid');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  interface AdminSettings {
    notifications: boolean;
    maintenance: boolean;
    autoArchive: boolean;
    darkMode: boolean;
  }

  const [settingsState, setSettingsState] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('hadab_admin_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return {
      notifications: true,
      maintenance: false,
      autoArchive: true,
      darkMode: false,
    };
  });

  const [settingsCurrency, setSettingsCurrency] = useState(baseCurrency || 'KWD');
  const [settingsPhone, setSettingsPhone] = useState(() => localStorage.getItem('hadab_store_phone') || '+965 9900 0000');
  const [settingsEmail, setSettingsEmail] = useState(() => localStorage.getItem('hadab_email') || 'Byhadab@gmail.com');
  const [shippingRatesState, setShippingRatesState] = useState<CountryShippingRate[]>(
    () => shippingConfig?.rates || DEFAULT_SHIPPING_CONFIG.rates
  );
  const [shippingEnabledState, setShippingEnabledState] = useState<boolean>(
    () => shippingConfig?.enabled ?? true
  );
  const [isErasing, setIsErasing] = useState(false);

  // Add Specific Country Modal state
  const [isAddCountryModalOpen, setIsAddCountryModalOpen] = useState(false);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newCountryRate, setNewCountryRate] = useState<number>(4);
  const [newCountrySearch, setNewCountrySearch] = useState('');

  const availableCountriesToAdd = useMemo(() => {
    const existingCodes = new Set(shippingRatesState.map((r) => r.countryCode.toUpperCase()));
    return COUNTRY_CODES.filter((c) => {
      if (existingCodes.has(c.code.toUpperCase())) return false;
      if (!newCountrySearch.trim()) return true;
      const q = newCountrySearch.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [shippingRatesState, newCountrySearch]);

  // Web Push Notification State for Store Owner
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [pushTestStatus, setPushTestStatus] = useState<string | null>(null);
  const [pushStats, setPushStats] = useState<{ total: number; admins: number; customers: number; iosDevices: number } | null>(null);

  useEffect(() => {
    getCurrentSubscription().then((sub) => {
      setIsPushSubscribed(!!sub);
    });
    api.getPushStats().then(setPushStats).catch(() => {});
  }, []);

  const handleTogglePush = async () => {
    setIsPushLoading(true);
    setPushTestStatus(null);
    try {
      if (isPushSubscribed) {
        await unsubscribeFromPush();
        setIsPushSubscribed(false);
        showToast(isAr ? 'تم إلغاء تفعيل الإشعارات على هذا الجهاز' : 'Push notifications disabled on this device', 'info');
      } else {
        const res = await subscribeToPush('admin');
        if (res.success) {
          setIsPushSubscribed(true);
          showToast(isAr ? 'تم تفعيل إشعارات الطلبات على الآيفون بنجاح!' : 'iPhone order push alerts enabled successfully!', 'success');
          api.getPushStats().then(setPushStats).catch(() => {});
        } else {
          if (res.error === 'ON_IOS_MUST_ADD_TO_HOME_SCREEN') {
            alert(isAr ? 'لتفعيل الإشعارات على الآيفون، يجب أولاً إضافة المتجر إلى الشاشة الرئيسية (Add to Home Screen) من متصفح سفاري ثم فتحه كأيقونة تطبيق.' : 'To enable notifications on iPhone, please first tap Share in Safari then select Add to Home Screen.');
          } else {
            alert(res.error || 'Failed to enable notifications');
          }
        }
      }
    } catch (e: any) {
      alert(e.message || 'Error configuring notifications');
    } finally {
      setIsPushLoading(false);
    }
  };

  const handleSendTestPush = async () => {
    setIsPushLoading(true);
    setPushTestStatus(null);
    try {
      await sendTestPush();
      setPushTestStatus(isAr ? 'تم إرسال إشعار تجريبي بنجاح! تفقد شاشة القفل' : 'Test alert sent! Check your iPhone lock screen');
      showToast(isAr ? 'تم إرسال إشعار تجريبي!' : 'Test notification sent!', 'success');
    } catch (e: any) {
      setPushTestStatus(e.message || 'Failed to send test push');
    } finally {
      setIsPushLoading(false);
    }
  };

  // Load settings from server on mount
  useEffect(() => {
    api.getSettings().then((s) => {
      if (s.baseCurrency) setSettingsCurrency(s.baseCurrency);
      if (s.storePhone) setSettingsPhone(s.storePhone);
      if (s.storeEmail) setSettingsEmail(s.storeEmail);
      if (s.shippingConfig) {
        if (Array.isArray(s.shippingConfig.rates)) setShippingRatesState(s.shippingConfig.rates);
        if (typeof s.shippingConfig.enabled === 'boolean') setShippingEnabledState(s.shippingConfig.enabled);
      }
    }).catch(() => {});
  }, []);

  // Modal States
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameAr, setCatNameAr] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catDescAr, setCatDescAr] = useState('');
  const [catImage, setCatImage] = useState('/products/hadab-bag.jpg');
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductNameAr, setNewProductNameAr] = useState('');
  const [newProductPrice, setNewProductPrice] = useState<number>(15);
  const [newProductCategory, setNewProductCategory] = useState<string>('bags');
  const [newProductTag, setNewProductTag] = useState('New Drop');
  const [newProductTagAr, setNewProductTagAr] = useState('إصدار جديد');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductDescriptionAr, setNewProductDescriptionAr] = useState('');
  const [newProductYarnType, setNewProductYarnType] = useState('100% Recycled Cotton Ribbon');
  const [newProductYarnTypeAr, setNewProductYarnTypeAr] = useState('خيط قطن معاد تدويره ١٠٠٪');
  const [newProductStitchDetail, setNewProductStitchDetail] = useState('Hand-hooked continuous stitch');
  const [newProductStitchDetailAr, setNewProductStitchDetailAr] = useState('حياكة يدوية متصلة');
  const [newProductColorVariants, setNewProductColorVariants] = useState<ColorVariant[]>([]);
  const [newProductImage, setNewProductImage] = useState<string>('/products/hadab-bag.jpg');
  const [newProductImages, setNewProductImages] = useState<string[]>([]);
  const [newProductColors, setNewProductColors] = useState<string>('');
  const [newProductSizes, setNewProductSizes] = useState<string>('');
  const [newProductDiscount, setNewProductDiscount] = useState<number>(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Filtered Data
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (p.nameArabic && p.nameArabic.includes(globalSearch));
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [productsList, globalSearch, selectedCategory]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(globalSearch.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        o.status === statusFilter ||
        (statusFilter === 'handmade' && (o.status === 'hooking' || o.status === 'finishing'));
      return matchesSearch && matchesStatus;
    });
  }, [ordersList, globalSearch, statusFilter]);
  
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(globalSearch.toLowerCase()) || c.email.toLowerCase().includes(globalSearch.toLowerCase());
      const matchesFilter = customerFilter === 'all' || c.status === customerFilter;
      return matchesSearch && matchesFilter;
    });
  }, [customersList, globalSearch, customerFilter]);

  // KPIs
  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = ordersList.filter((o) => o.status !== 'delivered').length;
  const inCraftCount = ordersList.filter((o) => o.status === 'handmade' || o.status === 'hooking' || o.status === 'finishing').length;

  // Dynamic 6-Month Revenue Data from orders
  const monthlyRevenueData = useMemo(() => {
    const now = new Date();
    const months: { monthIndex: number; year: number; month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = d.toLocaleString(isAr ? 'ar-EG' : 'en-US', { month: 'short' });
      months.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        month: mName,
        revenue: 0,
      });
    }

    ordersList.forEach((order) => {
      const orderDate = new Date(order.createdAtRaw);
      if (!isNaN(orderDate.getTime())) {
        const found = months.find(
          (m) => m.monthIndex === orderDate.getMonth() && m.year === orderDate.getFullYear()
        );
        if (found) {
          found.revenue += order.total;
        }
      }
    });

    const maxRevenue = Math.max(...months.map((m) => m.revenue), 10);
    return months.map((m) => ({
      month: m.month,
      revenue: m.revenue,
      label: `${m.revenue} ${isAr ? 'د.ك' : 'KD'}`,
      value: m.revenue > 0 ? Math.max(Math.round((m.revenue / maxRevenue) * 100), 10) : 4,
    }));
  }, [ordersList, isAr]);

  // Handlers
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    tactileAudio.playScrubTick(340);
    const statusLabels: Record<string, string> = {
      pending: isAr ? 'قيد الانتظار' : 'Pending',
      handmade: isAr ? 'حياكة يدوية' : 'Handmade',
      shipped: isAr ? 'تم الشحن' : 'Shipped',
      delivered: isAr ? 'تم التسليم' : 'Delivered',
      hooking: isAr ? 'حياكة يدوية' : 'Handmade',
      finishing: isAr ? 'حياكة يدوية' : 'Handmade',
    };

    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: nextStatus,
              statusArabic: statusLabels[nextStatus] || nextStatus,
            }
          : o
      )
    );

    try {
      await api.updateOrderStatus(orderId, {
        status: nextStatus,
        statusArabic: statusLabels[nextStatus] || nextStatus,
      });
    } catch (err) {
      console.error('Failed to sync order status to database:', err);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, nextPaymentStatus: 'unpaid' | 'contacting' | 'paid') => {
    tactileAudio.playScrubTick(360);
    const paymentLabels: Record<'unpaid' | 'contacting' | 'paid', string> = {
      unpaid: isAr ? 'غير مدفوع' : 'Unpaid',
      contacting: isAr ? 'جاري التواصل' : 'Contacting Customer',
      paid: isAr ? 'تم الدفع' : 'Paid',
    };

    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: nextPaymentStatus,
              paymentStatusArabic: paymentLabels[nextPaymentStatus],
            }
          : o
      )
    );

    try {
      await api.updateOrderStatus(orderId, {
        paymentStatus: nextPaymentStatus,
        paymentStatusArabic: paymentLabels[nextPaymentStatus],
      });
      if (nextPaymentStatus === 'contacting') {
        showToast(
          isAr
            ? 'تم إرسال إشعار للعميل لتفقّد رسائل الواتساب 📲'
            : 'Push alert sent to customer to check their WhatsApp messages 📲',
          'success'
        );
      }
    } catch (err) {
      console.error('Failed to sync payment status to database:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmed = await confirmDialog({
      title: isAr ? 'حذف القطعة' : 'Remove Piece',
      message: isAr ? 'هل أنتِ متأكدة من حذف هذه القطعة من المتجر؟' : 'Are you sure you want to remove this piece from the atelier?',
      confirmText: isAr ? 'حذف' : 'Remove',
      cancelText: isAr ? 'إلغاء' : 'Cancel',
      isDanger: true,
    });
    if (confirmed) {
      tactileAudio.playScrubTick(300);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      setSelectedProductIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      try {
        await api.deleteProduct(id);
        refreshData();
        showToast(isAr ? 'تم حذف القطعة بنجاح' : 'Piece removed successfully', 'success');
      } catch (err) {
        console.error('Failed to delete product from database:', err);
        showToast(isAr ? 'فشل حذف القطعة من السيرفر' : 'Failed to delete piece from database', 'error');
      }
    }
  };

  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.size === 0) return;
    const confirmed = await confirmDialog({
      title: isAr ? 'حذف القطع المحددة' : 'Delete Selected Pieces',
      message: isAr ? 'هل أنتِ متأكدة من حذف جميع القطع المحددة؟' : 'Are you sure you want to delete all selected pieces?',
      confirmText: isAr ? 'حذف الكل' : 'Delete All',
      cancelText: isAr ? 'إلغاء' : 'Cancel',
      isDanger: true,
    });
    if (confirmed) {
      tactileAudio.playScrubTick(300);
      const idsToDelete = Array.from(selectedProductIds);
      setProductsList(prev => prev.filter(p => !selectedProductIds.has(p.id)));
      setSelectedProductIds(new Set());

      for (const id of idsToDelete) {
        try {
          await api.deleteProduct(id);
        } catch (err) {
          console.error(`Failed to delete product ${id}:`, err);
        }
      }
      refreshData();
    }
  };

  const handleToggleDisableCustomer = async (customer: CustomerRecord) => {
    const isCurrentlyDisabled = Boolean(customer.isDisabled);
    const actionWord = isCurrentlyDisabled
      ? (isAr ? 'تفعيل' : 'enable')
      : (isAr ? 'تعطيل' : 'disable');
    const confirmed = await confirmDialog({
      title: isCurrentlyDisabled
        ? (isAr ? 'تفعيل حساب العميل' : 'Enable Customer Account')
        : (isAr ? 'تعطيل حساب العميل' : 'Disable Customer Account'),
      message: isAr
        ? `هل أنتِ متأكدة من ${actionWord} حساب العميل "${customer.name}"؟`
        : `Are you sure you want to ${actionWord} the account of "${customer.name}"?`,
      confirmText: isCurrentlyDisabled
        ? (isAr ? 'تفعيل الحساب' : 'Enable Account')
        : (isAr ? 'تعطيل الحساب' : 'Disable Account'),
      cancelText: isAr ? 'إلغاء' : 'Cancel',
      isDanger: !isCurrentlyDisabled,
    });

    if (confirmed) {
      tactileAudio.playScrubTick(320);
      try {
        await api.toggleDisableCustomer(customer.id);
        setCustomersList((prev) =>
          prev.map((c) =>
            c.id === customer.id ? { ...c, isDisabled: !isCurrentlyDisabled } : c
          )
        );
        showToast(
          isCurrentlyDisabled
            ? (isAr ? 'تم تفعيل حساب العميل بنجاح' : 'Customer account enabled')
            : (isAr ? 'تم تعطيل حساب العميل بنجاح' : 'Customer account disabled'),
          'success'
        );
      } catch (err: any) {
        console.error('Failed to toggle customer disabled state:', err);
        showToast(err.message || (isAr ? 'فشل تحديث حالة العميل' : 'Failed to update customer status'), 'error');
      }
    }
  };

  const handleDeleteCustomer = async (customer: CustomerRecord) => {
    const confirmed = await confirmDialog({
      title: isAr ? 'حذف العميل نهائياً' : 'Delete Customer Permanently',
      message: isAr
        ? `هل أنتِ متأكدة من حذف العميل "${customer.name}"؟ سيتم حذف حسابه نهائياً.`
        : `Are you sure you want to delete "${customer.name}"? This will permanently remove their account.`,
      confirmText: isAr ? 'حذف نهائياً' : 'Delete Permanently',
      cancelText: isAr ? 'إلغاء' : 'Cancel',
      isDanger: true,
    });

    if (confirmed) {
      tactileAudio.playScrubTick(300);
      try {
        await api.deleteCustomer(customer.id);
        setCustomersList((prev) => prev.filter((c) => c.id !== customer.id));
        if (expandedCustomerId === customer.id) {
          setExpandedCustomerId(null);
        }
        showToast(isAr ? 'تم حذف العميل بنجاح' : 'Customer deleted successfully', 'success');
      } catch (err: any) {
        console.error('Failed to delete customer:', err);
        showToast(err.message || (isAr ? 'فشل حذف العميل' : 'Failed to delete customer'), 'error');
      }
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllProducts = () => {
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    tactileAudio.playChime();

    const parsedColors = newProductColors
      ? newProductColors.split(',').map((c) => c.trim()).filter(Boolean)
      : [];
    const parsedSizes = newProductSizes
      ? newProductSizes.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const discountVal = Number(newProductDiscount) || 0;
    const originalPriceVal = discountVal > 0 ? Number(newProductPrice) : undefined;
    const finalPriceVal = discountVal > 0 ? Math.max(0, Number(newProductPrice) - discountVal) : Number(newProductPrice);

    const primaryImage = newProductImages.length > 0 ? newProductImages[0] : (newProductImage || '/products/hadab-bag.jpg');
    const secondImage = newProductImages.length > 1 ? newProductImages[1] : primaryImage;

    let effectiveColors = parsedColors;
    if (newProductColorVariants.length > 0) {
      const variantColorNames = newProductColorVariants.map((v) => v.name.trim()).filter(Boolean);
      effectiveColors = Array.from(new Set([...effectiveColors, ...variantColorNames]));
    }

    const firstVariant = newProductColorVariants[0];
    const defaultColorName = firstVariant?.name || effectiveColors[0] || 'Desert Oat';
    const defaultColorNameAr = firstVariant?.nameArabic || effectiveColors[0] || 'بيج صحراوي';
    const defaultColorHex = firstVariant?.colorHex || '#D6C7B2';

    const productPayload = {
      name: newProductName.trim(),
      nameArabic: newProductNameAr.trim() || undefined,
      price: finalPriceVal,
      originalPrice: originalPriceVal,
      discount: discountVal,
      colors: effectiveColors,
      sizes: parsedSizes,
      colorVariants: newProductColorVariants,
      category: newProductCategory,
      tag: newProductTag.trim() || 'New Drop',
      tagArabic: newProductTagAr.trim() || 'إصدار جديد',
      image: primaryImage,
      textureImage: secondImage,
      images: newProductImages.length > 0 ? newProductImages : [primaryImage],
      description: newProductDescription.trim() || 'Handmade crochet piece crafted with quality unbleached cotton cord.',
      descriptionArabic: newProductDescriptionAr.trim() || 'قطعة كروشيه يدوية مصنوعة بعناية من خيوط القطن الطبيعي.',
      stitchDetail: newProductStitchDetail.trim() || 'Hand-hooked continuous stitch',
      stitchDetailArabic: newProductStitchDetailAr.trim() || 'حياكة يدوية متصلة',
      yarnType: newProductYarnType.trim() || '100% Recycled Cotton Ribbon',
      yarnTypeArabic: newProductYarnTypeAr.trim() || 'خيط قطن معاد تدويره ١٠٠٪',
      colorName: defaultColorName,
      colorNameArabic: defaultColorNameAr,
      colorHex: defaultColorHex,
      isFeatured: editingProduct ? editingProduct.isFeatured : false,
      isSale: discountVal > 0,
      stockCount: 10,
    };

    const token = localStorage.getItem('hadab_token');
    if (!token) {
      showToast(isAr ? 'يرجى تسجيل الدخول كمسؤول أولاً لحفظ القطعة في قاعدة البيانات' : 'Admin sign-in required to save products to the database.', 'warning');
      return;
    }

    if (editingProduct) {
      try {
        const updated = await api.updateProduct(editingProduct.id, productPayload);
        setProductsList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        refreshData();
        showToast(isAr ? 'تم تحديث القطعة في قاعدة البيانات بنجاح ✓' : 'Product updated in database successfully ✓', 'success');
      } catch (err: any) {
        console.error('Failed to update product in database:', err);
        showToast(isAr ? `تعذر تحديث القطعة في قاعدة البيانات: ${err.message}` : `Failed to update piece in database: ${err.message}`, 'error');
        // Keep local optimistic update
        setProductsList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productPayload } : p))
        );
      }
    } else {
      try {
        const created = await api.createProduct(productPayload);
        setProductsList((prev) => [created, ...prev]);
        refreshData();
        showToast(isAr ? 'تمت إضافة القطعة إلى قاعدة البيانات بنجاح ✓' : 'Product saved to database successfully ✓', 'success');
      } catch (err: any) {
        console.error('Failed to create product in database:', err);
        showToast(isAr ? `تنبيه: تعذر الحفظ في قاعدة البيانات (${err.message})، تم الحفظ محلياً` : `Warning: Failed to save to database (${err.message}). Saved locally.`, 'warning');
        const fallbackId = `custom-${Date.now()}`;
        setProductsList((prev) => [{ ...productPayload, id: fallbackId } as Product, ...prev]);
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgressText(
          isAr
            ? `جاري رفع الصورة ${i + 1} من ${files.length}...`
            : `Uploading image ${i + 1} of ${files.length}...`
        );
        const res = await api.uploadImage(files[i]);
        if (res?.url) {
          uploadedUrls.push(res.url);
        }
      }

      setNewProductImages((prev) => {
        const combined = [...prev, ...uploadedUrls];
        if (combined.length > 0) {
          setNewProductImage(combined[0]);
        }
        return combined;
      });

      tactileAudio.playChime();
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast(err.message || (isAr ? 'فشل رفع الصورة' : 'Image upload failed'), 'error');
    } finally {
      setIsUploadingImage(false);
      setUploadProgressText('');
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewProductImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToRemove);
      setNewProductImage(filtered.length > 0 ? filtered[0] : '/products/hadab-bag.jpg');
      return filtered;
    });
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setNewProductImages((prev) => {
      if (indexToPrimary <= 0 || indexToPrimary >= prev.length) return prev;
      const target = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      const reordered = [target, ...rest];
      setNewProductImage(reordered[0]);
      return reordered;
    });
  };

  const handleAddColorVariant = () => {
    setNewProductColorVariants((prev) => [
      ...prev,
      {
        name: '',
        nameArabic: '',
        colorHex: '#D6C7B2',
        images: [],
      },
    ]);
  };

  const handleRemoveColorVariant = (index: number) => {
    setNewProductColorVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateColorVariant = (index: number, field: keyof ColorVariant, value: any) => {
    setNewProductColorVariants((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleToggleImageForColorVariant = (variantIndex: number, imgUrl: string) => {
    setNewProductColorVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== variantIndex) return variant;
        const exists = variant.images.includes(imgUrl);
        const nextImages = exists
          ? variant.images.filter((img) => img !== imgUrl)
          : [...variant.images, imgUrl];
        return { ...variant, images: nextImages };
      })
    );
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setNewProductName('');
    setNewProductNameAr('');
    setNewProductPrice(15);
    setNewProductColors('');
    setNewProductSizes('');
    setNewProductDiscount(0);
    setNewProductCategory('bags');
    setNewProductTag('New Drop');
    setNewProductTagAr('إصدار جديد');
    setNewProductDescription('Handmade crochet piece crafted with quality unbleached cotton cord.');
    setNewProductDescriptionAr('قطعة كروشيه يدوية مصنوعة بعناية من خيوط القطن الطبيعي.');
    setNewProductYarnType('100% Recycled Cotton Ribbon');
    setNewProductYarnTypeAr('خيط قطن معاد تدويره ١٠٠٪');
    setNewProductStitchDetail('Hand-hooked continuous stitch');
    setNewProductStitchDetailAr('حياكة يدوية متصلة');
    setNewProductColorVariants([]);
    setNewProductImage('/products/hadab-bag.jpg');
    setNewProductImages([]);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductNameAr(product.nameArabic || '');
    // If product had discount and originalPrice, restore the base price
    const basePrice = product.originalPrice ? product.originalPrice : product.price;
    setNewProductPrice(basePrice);
    setNewProductColors(product.colors ? product.colors.join(', ') : (product.colorName ? product.colorName : ''));
    setNewProductSizes(product.sizes ? product.sizes.join(', ') : '');
    const disc = product.discount !== undefined ? product.discount : (product.originalPrice ? (product.originalPrice - product.price) : 0);
    setNewProductDiscount(disc);
    setNewProductCategory(product.category);
    setNewProductTag(product.tag || 'New Drop');
    setNewProductTagAr(product.tagArabic || 'إصدار جديد');
    setNewProductDescription(product.description || '');
    setNewProductDescriptionAr(product.descriptionArabic || '');
    setNewProductYarnType(product.yarnType || '100% Recycled Cotton Ribbon');
    setNewProductYarnTypeAr(product.yarnTypeArabic || 'خيط قطن معاد تدويره ١٠٠٪');
    setNewProductStitchDetail(product.stitchDetail || 'Hand-hooked continuous stitch');
    setNewProductStitchDetailAr(product.stitchDetailArabic || 'حياكة يدوية متصلة');
    setNewProductColorVariants(product.colorVariants && product.colorVariants.length > 0 ? product.colorVariants : []);
    setNewProductImage(product.image || '/products/hadab-bag.jpg');
    const existingImages = product.images && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : ['/products/hadab-bag.jpg']);
    setNewProductImages(existingImages);
    setIsProductModalOpen(true);
  };
  
  // Persist settings toggles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hadab_admin_settings', JSON.stringify(settingsState));
  }, [settingsState]);

  // Save Preferences handler
  const handleSavePreferences = async () => {
    const shippingPayload: ShippingConfig = {
      enabled: shippingEnabledState,
      rates: shippingRatesState,
      restOfWorldRate: shippingRatesState.find((r) => r.countryCode === 'REST')?.rate ?? 5,
    };

    try {
      await api.updateSettings({
        baseCurrency: settingsCurrency,
        storePhone: settingsPhone,
        storeEmail: settingsEmail,
        shippingConfig: shippingPayload,
      });
      // Update CurrencyContext so the whole app picks up the changes
      setBaseCurrency(settingsCurrency as CurrencyCode);
      setShippingConfig(shippingPayload);
      setStorePhone(settingsPhone);
      await refreshSettings();
      // Also keep localStorage in sync
      localStorage.setItem('hadab_currency', settingsCurrency);
      localStorage.setItem('hadab_store_phone', settingsPhone);
      localStorage.setItem('hadab_email', settingsEmail);
      localStorage.setItem('hadab_admin_settings', JSON.stringify(settingsState));
      localStorage.setItem('hadab_shipping_config', JSON.stringify(shippingPayload));
      tactileAudio.playChime();
      showToast(isAr ? 'تم حفظ إعدادات المتجر ورسوم الشحن بنجاح ✓' : 'Settings and shipping fees saved successfully ✓', 'success');
    } catch (err) {
      // Fallback to localStorage only
      localStorage.setItem('hadab_currency', settingsCurrency);
      localStorage.setItem('hadab_store_phone', settingsPhone);
      localStorage.setItem('hadab_email', settingsEmail);
      localStorage.setItem('hadab_shipping_config', JSON.stringify(shippingPayload));
      setBaseCurrency(settingsCurrency as CurrencyCode);
      setShippingConfig(shippingPayload);
      tactileAudio.playChime();
      showToast(isAr ? 'تم حفظ الإعدادات محلياً ✓' : 'Settings saved locally ✓', 'success');
    }
  };

  // Erase All Data handler
  const handleEraseData = async () => {
    const confirmMessage = isAr
      ? 'هل أنت متأكد؟ سيتم حذف جميع المنتجات والطلبات وبيانات العملاء نهائياً مع الاحتفاظ بالتصنيفات وحساب الأدمن. اكتب "DELETE" للتأكيد.'
      : 'Are you sure? This will delete all products, orders, and customers while preserving categories and the admin account. Type "DELETE" to confirm.';
    
    const input = await promptDialog({
      title: isAr ? 'مسح بيانات المتجر' : 'Erase Store Data',
      message: confirmMessage,
      placeholder: 'DELETE',
      confirmText: isAr ? 'مسح نهائي' : 'Erase All',
      cancelText: isAr ? 'إلغاء' : 'Cancel',
    });

    if (input !== 'DELETE') {
      if (input !== null) {
        showToast(isAr ? 'لم يتم تأكيد الحذف. لم يتم مسح أي شيء.' : 'Confirmation not matched. Nothing was deleted.', 'warning');
      }
      return;
    }

    setIsErasing(true);
    try {
      const result = await api.eraseAllData();
      // Clear local state (preserve categories)
      setProductsList([]);
      setOrdersList([]);
      setCustomersList([]);
      tactileAudio.playScrubTick(200);
      showToast(
        isAr
          ? `تم مسح البيانات بنجاح: ${result.deleted?.products || 0} منتج، ${result.deleted?.orders || 0} طلب، ${result.deleted?.customers || 0} عميل.`
          : `Data erased: ${result.deleted?.products || 0} products, ${result.deleted?.orders || 0} orders, ${result.deleted?.customers || 0} customers.`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || (isAr ? 'فشل مسح البيانات' : 'Failed to erase data'), 'error');
    } finally {
      setIsErasing(false);
    }
  };

  // Export customers as CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Country', 'Orders', 'Total Spent (KD)', 'Status'];
    const rows = filteredCustomers.map(c => [
      c.name,
      c.email,
      c.phone,
      c.country,
      String(c.totalOrders),
      String(c.totalSpent),
      c.status,
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hadab-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    tactileAudio.playChime();
  };

  // Category delete with API sync
  const handleDeleteCategory = async (catId: string) => {
    const confirmed = await confirmDialog({
      title: isAr ? 'حذف التصنيف' : 'Remove Category',
      message: isAr ? 'هل تريدين حذف هذا التصنيف من المتجر؟' : 'Are you sure you want to remove this category?',
      confirmText: isAr ? 'حذف' : 'Remove',
      cancelText: isAr ? 'إلغاء' : 'Cancel',
      isDanger: true,
    });
    if (confirmed) {
      tactileAudio.playScrubTick(300);
      setCategoryList((prev) => prev.filter((c) => c.id !== catId));
      try {
        await api.deleteCategory(catId);
        refreshData();
        showToast(isAr ? 'تم حذف التصنيف بنجاح' : 'Category removed successfully', 'success');
      } catch (err) {
        console.error('Failed to delete category from database:', err);
        showToast(isAr ? 'فشل حذف التصنيف من السيرفر' : 'Failed to delete category from database', 'error');
      }
    }
  };

  const getBreadcrumbLabel = () => {
    const map: Record<string, string> = {
      overview: isAr ? 'لوحة المؤشرات' : 'Dashboard Overview',
      products: isAr ? 'كتالوج المنتجات' : 'Products Catalog',
      orders: isAr ? 'الطلبات' : 'Orders',
      categories: isAr ? 'التصنيفات' : 'Categories',
      customers: isAr ? 'العملاء' : 'Customers',
      settings: isAr ? 'إعدادات المتجر' : 'Store Settings',
    };
    return map[activeTab] || '';
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB] text-[#2E221B] font-sans selection:bg-blush-200 selection:text-brown-900 flex flex-col md:flex-row relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* =========================================================================
          1. SIDEBAR NAVIGATION
      ========================================================================== */}
      <aside
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 28px)',
        }}
        className={`
          fixed inset-y-0 ${isAr ? 'right-0' : 'left-0'} z-50 md:static w-72 
          bg-gradient-to-b from-[#261C16] to-[#1A120E] text-[#EFE4D6] px-5 
          flex flex-col justify-between shrink-0 border-e border-[#3D2D25] shadow-2xl md:shadow-xl
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : (isAr ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
        `}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#3D2D25]/70">
            <button
              type="button"
              onClick={() => {
                tactileAudio.playScrubTick(300);
                setActiveTab('overview');
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className="flex items-center gap-3 text-left cursor-pointer group"
              title={isAr ? 'الذهاب للوحة المؤشرات' : 'Go to Dashboard Overview'}
            >
              <div className="h-10 px-2.5 rounded-2xl bg-cream-100/10 border border-cream-200/20 flex items-center justify-center shrink-0">
                <img
                  src={isAr ? '/arabic.png' : '/PNG-HADAB-CREAM.png'}
                  alt="HADAB"
                  className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="font-serif tracking-widest text-lg font-bold block text-[#FAF6F0] group-hover:text-blush-200 transition-colors">HADAB</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-blush-200 block">{isAr ? 'إدارة المتجر' : 'Store Admin'}</span>
              </div>
            </button>
            <button className="md:hidden p-1.5 text-brown-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: isAr ? 'لوحة المؤشرات' : 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: isAr ? 'كتالوج المنتجات' : 'Products Catalog', icon: Package, count: productsList.length },
              { id: 'orders', label: isAr ? 'الطلبات' : 'Orders', icon: ShoppingBag, count: activeOrdersCount, pulse: activeOrdersCount > 0 },
              { id: 'categories', label: isAr ? 'التصنيفات' : 'Categories', icon: Tag, count: categoryList.length },
              { id: 'customers', label: isAr ? 'العملاء' : 'Customers', icon: Users, count: customersList.length },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    tactileAudio.playScrubTick(320);
                    setActiveTab(item.id as any);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#3D2D25] text-white shadow-sm border border-brown-700/60 font-semibold'
                      : 'text-[#C9B9A9] hover:bg-white/5 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={`transition-colors ${isActive ? 'text-blush-200' : 'text-[#A08E80] group-hover:text-[#EFE4D6]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.pulse && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-blush-400 animate-pulse" />
                    )}
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-blush-300/20 text-blush-200' : 'bg-white/10 text-[#C9B9A9] group-hover:bg-white/20 group-hover:text-white'}`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            
            <div className="my-4 border-t border-[#3D2D25]/50 pt-2">
              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(320);
                  setActiveTab('settings');
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#3D2D25] text-white shadow-sm border border-brown-700/60 font-semibold'
                    : 'text-[#C9B9A9] hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={16} className={`transition-colors ${activeTab === 'settings' ? 'text-blush-200' : 'text-[#A08E80] group-hover:text-[#EFE4D6]'}`} />
                  <span>{isAr ? 'إعدادات المتجر' : 'Store Settings'}</span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-[#3D2D25]/70 space-y-2">
          {/* Language Switch */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9B9A9] hover:text-white text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe size={14} />
              <span>{isAr ? 'اللغة الحالية' : 'Language'}</span>
            </div>
            <span className="font-semibold text-[11px] text-blush-200">{isAr ? 'العربية' : 'English'}</span>
          </button>

          {/* Return to Public Storefront */}
          <button
            type="button"
            onClick={() => {
              tactileAudio.playScrubTick(300);
              setIsSidebarOpen(false);
              onBackToStore();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs uppercase tracking-[0.16em] font-bold text-[#2E221B] bg-blush-300 hover:bg-blush-200 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <ArrowLeft size={15} className={isAr ? 'rotate-180' : ''} />
            <span>{isAr ? 'العودة للمتجر الرئيسي' : 'Return to Store'}</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN ADMIN CONTENT WORKSPACE
      ========================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden bg-[#F7F2EB]">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-brown-200/60 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <button className="md:hidden p-2 -ml-2 rounded-lg hover:bg-cream-100 text-brown-700" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-[10.5px] uppercase tracking-wider text-brown-400 font-medium">
              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(300);
                  onBackToStore();
                }}
                className="hover:text-brown-900 transition-colors cursor-pointer p-0.5"
                title={isAr ? 'العودة للمتجر' : 'Back to Store'}
              >
                <Home size={12} />
              </button>
              <ChevronRight size={12} className={isAr ? 'rotate-180' : ''} />
              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(300);
                  setActiveTab('overview');
                }}
                className="hover:text-brown-900 transition-colors cursor-pointer"
              >
                Admin
              </button>
              <ChevronRight size={12} className={isAr ? 'rotate-180' : ''} />
              <span className="text-brown-900 font-semibold">{getBreadcrumbLabel()}</span>
            </div>
            
            {/* Global Search */}
            <div className="flex-1 max-w-sm ml-auto sm:ml-4 relative">
              <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} text-brown-400`} />
              <input
                type="text"
                placeholder={isAr ? 'بحث عام...' : 'Global search...'}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className={`w-full bg-cream-50 border border-brown-200 rounded-full py-1.5 ${isAr ? 'pr-8 pl-4' : 'pl-8 pr-4'} text-xs focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 transition-all`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(300);
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsUserMenuOpen(false);
                }}
                title={isAr ? `${activeOrdersCount} طلبات نشطة` : `${activeOrdersCount} active orders`}
                className="relative p-2 rounded-full hover:bg-cream-100 text-brown-600 transition-colors cursor-pointer"
              >
                <Bell size={18} />
                {activeOrdersCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-burgundy-500 border border-white animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 bg-[#FAF6F0] rounded-2xl shadow-xl border border-brown-200/80 p-4 z-50 animate-in fade-in zoom-in-95 duration-200`}>
                    <div className="flex items-center justify-between pb-3 border-b border-brown-200/60 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell size={15} className="text-burgundy-600" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-brown-900">
                          {isAr ? 'الإشعارات الحية' : 'Live Notifications'}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-burgundy-100 text-burgundy-700 font-semibold">
                        {activeOrdersCount} {isAr ? 'جديد' : 'Active'}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {ordersList.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => {
                            tactileAudio.playScrubTick(320);
                            setActiveTab('orders');
                            setIsNotificationsOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-white/70 hover:bg-cream-100 border border-brown-100 transition-all cursor-pointer flex items-start gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-burgundy-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs font-semibold text-brown-900">
                              <span className="truncate">{order.customerName}</span>
                              <span className="text-[10px] text-brown-500 font-mono">{order.orderNumber}</span>
                            </div>
                            <p className="text-[11px] text-brown-600 truncate mt-0.5">
                              {order.items.map((i) => i.product.name).join(', ')}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-brown-400 mt-1">
                              <span>${order.total}</span>
                              <span>{order.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {ordersList.length === 0 && (
                        <div className="text-center py-6 text-xs text-brown-400">
                          {isAr ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-brown-200/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          tactileAudio.playScrubTick(320);
                          setActiveTab('orders');
                          setIsNotificationsOpen(false);
                        }}
                        className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 transition-colors uppercase tracking-wider"
                      >
                        {isAr ? 'عرض جميع الطلبات ←' : 'View All Orders →'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-6 w-px bg-brown-200/60 hidden sm:block"></div>

            {/* User Profile with Interactive Dropdown */}
            <div className="relative">
              <div
                onClick={() => {
                  tactileAudio.playScrubTick(320);
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-3 cursor-pointer group"
                title={isAr ? 'قائمة الحساب' : 'Account Menu'}
              >
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-brown-900 leading-none mb-1 group-hover:text-burgundy-700 transition-colors">
                    {user?.name || 'HADAB Master'}
                  </div>
                  <div className="text-[10px] text-brown-500 uppercase tracking-wider leading-none">
                    {user?.email || 'Byhadab@gmail.com'}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cream-200 to-blush-100 border border-brown-300 flex items-center justify-center font-serif text-xs font-bold text-brown-900 shadow-sm group-hover:ring-2 ring-offset-2 ring-[#F7F2EB] ring-brown-200 transition-all">
                  {user?.email ? user.email.slice(0, 2).toUpperCase() : 'HB'}
                </div>
              </div>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-2 w-56 bg-[#FAF6F0] rounded-2xl shadow-xl border border-brown-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-200`}>
                    <div className="px-3 py-2 border-b border-brown-200/60 mb-1">
                      <div className="text-xs font-bold text-brown-900">{user?.name || 'HADAB Master'}</div>
                      <div className="text-[10px] text-brown-500 truncate">{user?.email || 'Byhadab@gmail.com'}</div>
                      <div className="mt-1 inline-block text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-200 text-brown-700 font-semibold">
                        {isAr ? 'مدير المتجر' : 'Store Admin'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        tactileAudio.playScrubTick(320);
                        setActiveTab('settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brown-700 hover:bg-cream-100 hover:text-brown-900 transition-colors text-left"
                    >
                      <Settings size={14} className="text-brown-500" />
                      <span>{isAr ? 'إعدادات المتجر' : 'Store Settings'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        tactileAudio.playScrubTick(300);
                        toggleLanguage();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-brown-700 hover:bg-cream-100 hover:text-brown-900 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe size={14} className="text-brown-500" />
                        <span>{isAr ? 'اللغة' : 'Language'}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-burgundy-600">{isAr ? 'العربية' : 'English'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        tactileAudio.playScrubTick(300);
                        setIsUserMenuOpen(false);
                        onBackToStore();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brown-700 hover:bg-cream-100 hover:text-brown-900 transition-colors text-left"
                    >
                      <Home size={14} className="text-brown-500" />
                      <span>{isAr ? 'العودة للمتجر الرئيسي' : 'Return to Public Store'}</span>
                    </button>

                    <div className="my-1 border-t border-brown-200/60" />

                    <button
                      type="button"
                      onClick={() => {
                        tactileAudio.playScrubTick(300);
                        logout();
                        setIsUserMenuOpen(false);
                        onBackToStore();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {isLoadingData && (
          <div className="h-0.5 bg-gradient-to-r from-blush-300 via-burgundy-500 to-sage-400 animate-pulse w-full"></div>
        )}

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="mb-6">
             <h1 className="font-serif text-2xl text-brown-950 font-normal">
              {activeTab === 'overview' && (isAr ? 'نظرة عامة على المتجر' : 'Store Overview & Performance')}
              {activeTab === 'products' && (isAr ? 'إدارة المنتجات والمخزون' : 'Products & Catalog Management')}
              {activeTab === 'orders' && (isAr ? 'إدارة طلبات المتجر' : 'Store Orders & Fulfillment')}
              {activeTab === 'settings' && (isAr ? 'إعدادات المتجر' : 'Store Settings')}
              {activeTab === 'categories' && (isAr ? 'إدارة التصنيفات' : 'Product Categories')}
              {activeTab === 'customers' && (isAr ? 'قاعدة العملاء' : 'Customer Directory')}
            </h1>
            <p className="text-xs text-brown-500 font-light mt-1">
              {activeTab === 'overview' && (isAr ? 'متابعة حية للمبيعات والطلبات وأداء المتجر' : 'Live tracking for store sales, performance, and orders')}
              {activeTab === 'products' && (isAr ? 'إدارة المنتجات وتفاصيل القطع والأسعار' : 'Manage your store products, descriptions, and pricing')}
              {activeTab === 'orders' && (isAr ? 'تتبع حالات الطلبات والشحن للعملاء' : 'Track orders status, shipping, and customer fulfillment')}
            </p>
          </div>

          {/* =====================================================================
              TAB 1: OVERVIEW DASHBOARD
          ====================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-brown-500 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
                    <div className="p-2 rounded-xl bg-sage-100 text-sage-600 group-hover:scale-110 transition-transform"><DollarSign size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">{totalRevenue.toLocaleString()} {isAr ? 'د.ك' : 'KD'}</div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-sage-600 font-medium">
                      <TrendingUp size={13} />
                      <span>+18.4% {isAr ? 'مقارنة بالشهر الماضي' : 'vs last month'}</span>
                    </div>
                    {/* CSS Mini Sparkline/Progress */}
                    <div className="w-full h-1 bg-brown-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sage-400 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-brown-500 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'طلبات قيد الحياكة' : 'Active In-Stitch'}</span>
                    <div className="p-2 rounded-xl bg-blush-100 text-burgundy-600 group-hover:scale-110 transition-transform"><Scissors size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">{inCraftCount}</div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="text-[11px] text-brown-500 font-light">
                      {isAr ? 'محبوكة حالياً بواسطة الحرفيين' : 'Handcrafted by our artisans'}
                    </div>
                    <div className="w-full h-1 bg-brown-100 rounded-full overflow-hidden flex">
                       <div className="h-full bg-blush-400" style={{ width: '40%' }}></div>
                       <div className="h-full bg-amber-300" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-brown-500 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'القطع المتاحة' : 'Archived Pieces'}</span>
                    <div className="p-2 rounded-xl bg-cream-200 text-brown-700 group-hover:scale-110 transition-transform"><Package size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">{productsList.length}</div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="text-[11px] text-brown-500 font-light">
                      {isAr ? 'عبر ٤ تصنيفات رئيسية' : 'Across 4 signature families'}
                    </div>
                    <div className="w-full h-1 bg-brown-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brown-400 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div>
                <h3 className="font-serif text-base text-brown-900 font-medium mb-3">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: isAr ? 'إضافة قطعة' : 'Add New Piece', icon: Plus, action: () => { setActiveTab('products'); setTimeout(openNewProductModal, 100); } },
                    { label: isAr ? 'مراجعة الطلبات' : 'Review Orders', icon: ListIcon, action: () => setActiveTab('orders') },
                    { label: isAr ? 'إدارة التصنيفات' : 'Manage Categories', icon: Tag, action: () => setActiveTab('categories') },
                    { label: isAr ? 'إدارة العملاء' : 'View Customers', icon: Users, action: () => setActiveTab('customers') },
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white border border-brown-200/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-brown-300 transition-all text-xs font-semibold text-brown-700 uppercase tracking-wider"
                    >
                      <btn.icon size={14} />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Charts & Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CSS Bar Chart */}
                <div className="lg:col-span-1 bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6 flex flex-col">
                   <h3 className="font-serif text-lg text-brown-900 font-medium mb-1">
                      {isAr ? 'الأداء الشهري' : 'Revenue by Month'}
                    </h3>
                    <p className="text-[11px] text-brown-500 font-light mb-6">Past 6 months overview</p>
                    
                    <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto border-b border-brown-200 pb-2">
                      {monthlyRevenueData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group w-full">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-brown-700 bg-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                            {d.label}
                          </div>
                          <div className="w-full max-w-[2rem] bg-gradient-to-t from-brown-200 to-brown-300 group-hover:from-blush-200 group-hover:to-blush-300 rounded-t-sm transition-all duration-300" style={{ height: `${d.value}%` }}></div>
                          <div className="text-[10px] text-brown-500 font-medium">{d.month}</div>
                        </div>
                      ))}
                    </div>
                </div>

                {/* Recent Orders Overview Table */}
                <div className="lg:col-span-2 bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-serif text-lg text-brown-900 font-medium">
                        {isAr ? 'أحدث طلبات المتجر' : 'Recent Orders'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold uppercase tracking-[0.15em] text-brown-600 hover:text-brown-900 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>

                  {ordersList.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-brown-400">
                      <ShoppingBag size={32} className="mb-2 opacity-40 text-brown-500" />
                      <p className="text-sm font-medium text-brown-700">{isAr ? 'لا توجد طلبات جديدة حالياً' : 'No recent orders yet'}</p>
                      <p className="text-xs text-brown-400 mt-0.5">{isAr ? 'ستظهر الطلبات الجديدة هنا فور إتمام العملاء للشراء' : 'New customer orders will appear here in real time'}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-brown-200/60 text-brown-500 text-[10px] uppercase tracking-[0.16em]">
                            <th className="pb-3 font-semibold">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                            <th className="pb-3 font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                            <th className="pb-3 font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                            <th className="pb-3 font-semibold text-end">{isAr ? 'المجموع' : 'Total'}</th>
                            <th className="pb-3 font-semibold text-center"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brown-100">
                          {ordersList.slice(0, 4).map((order) => (
                            <tr key={order.id} className="group hover:bg-white/50 transition-colors">
                              <td className="py-4 font-mono text-brown-900 font-medium">{order.orderNumber}</td>
                              <td className="py-4">
                                <span className="font-medium text-brown-900 block">{order.customerName}</span>
                                <span className="text-[10px] text-brown-400 font-light">{order.destination}</span>
                              </td>
                              <td className="py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${
                                    order.status === 'handmade' || order.status === 'hooking' || order.status === 'finishing'
                                      ? 'bg-blush-50 text-burgundy-700 border border-blush-200'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                      : order.status === 'delivered'
                                      ? 'bg-sage-50 text-sage-800 border border-sage-200'
                                      : 'bg-cream-100 text-brown-700 border border-brown-200'
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  <span>{isAr ? order.statusArabic : order.status}</span>
                                </span>
                              </td>
                              <td className="py-4 text-end font-medium text-brown-900 font-serif text-sm">
                                {order.total} {isAr ? 'د.ك' : 'KD'}
                              </td>
                              <td className="py-4 text-center">
                                <button onClick={() => {setActiveTab('orders'); setExpandedOrderId(order.id);}} className="p-1.5 rounded-lg text-brown-400 hover:text-brown-900 hover:bg-brown-100 transition-colors opacity-0 group-hover:opacity-100">
                                  <ArrowUpRight size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 2: PRODUCTS CATALOG MANAGEMENT
          ====================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Top Controls Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FAF6F0] p-3 sm:p-4 rounded-3xl border border-brown-200/60 shadow-sm">
                
                {/* Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                  {['all', ...categoryList.map((c) => c.slug)].map((cat) => {
                    const matchedCat = categoryList.find(c => c.slug === cat);
                    const label = cat === 'all' ? (isAr ? 'الكل' : 'All') : (isAr && matchedCat ? matchedCat.nameAr : matchedCat ? matchedCat.name : cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          tactileAudio.playScrubTick(300);
                          setSelectedCategory(cat);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                            : 'bg-transparent text-brown-600 hover:bg-brown-200/50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Bulk Actions & View Toggle */}
                <div className="flex items-center gap-3 ml-auto shrink-0 border-t md:border-t-0 border-brown-200/50 pt-3 md:pt-0">
                  {selectedProductIds.size > 0 && (
                    <div className="flex items-center gap-2 mr-2 animate-in fade-in">
                      <span className="text-xs text-brown-600 font-medium">{selectedProductIds.size} selected</span>
                      <button onClick={handleBulkDeleteProducts} className="p-1.5 rounded-lg text-burgundy-600 hover:bg-burgundy-50 transition-colors" title="Delete Selected">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center bg-cream-50 rounded-xl border border-brown-200 p-0.5">
                    <button 
                      onClick={() => setProductView('grid')} 
                      className={`p-1.5 rounded-lg transition-colors ${productView === 'grid' ? 'bg-white shadow-sm text-brown-900' : 'text-brown-400 hover:text-brown-600'}`}
                    >
                      <GridIcon size={14} />
                    </button>
                    <button 
                      onClick={() => setProductView('list')} 
                      className={`p-1.5 rounded-lg transition-colors ${productView === 'list' ? 'bg-white shadow-sm text-brown-900' : 'text-brown-400 hover:text-brown-600'}`}
                    >
                      <ListIcon size={14} />
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={openNewProductModal}
                    className="px-4 py-2 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-[10.5px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">{isAr ? 'إضافة قطعة' : 'Add Piece'}</span>
                  </button>
                </div>
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#FAF6F0] rounded-3xl border border-brown-200/60 border-dashed">
                  <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brown-400 mb-4">
                    <Package size={24} />
                  </div>
                  <h3 className="font-serif text-lg text-brown-900 mb-1">
                    {productsList.length === 0 ? (isAr ? 'كتالوج المنتجات فارغ حالياً' : 'No handcrafted pieces yet') : (isAr ? 'لا توجد قطع مطابقة' : 'No matching pieces found')}
                  </h3>
                  <p className="text-xs text-brown-500 max-w-sm mb-5 font-light">
                    {productsList.length === 0
                      ? (isAr ? 'ابدأ بإضافة أول قطعة كروشيه يدوية إلى المتجر مع صور كلاوديناري والأسعار بالدينار الكويتي.' : 'Add your first handcrafted crochet piece with Cloudinary photos, KWD pricing, and category.')
                      : (isAr ? 'جرّب تغيير التصنيف أو مصطلح البحث للعثور على المنتجات المطلوبة.' : 'Try adjusting your filters or search query to find what you need.')}
                  </p>
                  {productsList.length === 0 && (
                    <button
                      type="button"
                      onClick={openNewProductModal}
                      className="px-6 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{isAr ? 'إضافة أول قطعة' : 'Add First Piece'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Product Grid View */}
              {productView === 'grid' && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.has(p.id);
                    return (
                      <div key={p.id} className={`bg-[#FAF6F0] rounded-3xl border shadow-sm p-3.5 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'border-blush-300 ring-1 ring-blush-300' : 'border-brown-200/60'}`}>
                        <div>
                          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-cream-200 mb-4 border border-brown-200/40 cursor-pointer" onClick={() => toggleProductSelection(p.id)}>
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            
                            {/* Checkbox overlay */}
                            <div className={`absolute top-2.5 right-2.5 w-5 h-5 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-blush-400 text-white' : 'bg-white/80 text-transparent opacity-0 group-hover:opacity-100 hover:bg-white border border-brown-200'}`}>
                              <Check size={12} />
                            </div>

                            {p.tag && (
                              <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-full bg-[#2E221B]/85 text-cream-100 text-[9px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                                {isAr ? p.tagArabic || p.tag : p.tag}
                              </span>
                            )}
                            
                            {/* Stock Indicator */}
                            <span className="absolute bottom-2.5 start-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/90 text-brown-900 text-[9px] uppercase tracking-wider font-semibold shadow-sm backdrop-blur-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse"></span>
                              In Stock
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-2 mb-1 px-1">
                            <h4 className="font-serif text-[15px] text-brown-950 font-normal leading-snug">
                              {isAr ? p.nameArabic || p.name : p.name}
                            </h4>
                            <span className="font-serif text-sm font-semibold text-brown-900 whitespace-nowrap">{p.price} {isAr ? 'د.ك' : 'KD'}</span>
                          </div>

                          <p className="text-[11px] text-brown-500 font-light line-clamp-2 leading-relaxed mb-3 px-1">
                            {isAr ? p.descriptionArabic || p.description : p.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-auto border-t border-brown-200/50 flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-brown-500">
                            <span className="w-2.5 h-2.5 rounded-full border border-brown-200 shadow-inner" style={{ backgroundColor: p.colorHex || '#D6C7B2' }} />
                            <span>{p.category}</span>
                          </div>

                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); openEditProductModal(p); }}
                              className="p-1.5 rounded-lg hover:bg-brown-100 text-brown-400 hover:text-brown-900 transition-colors cursor-pointer"
                              title="Edit Piece"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p.id); }}
                              className="p-1.5 rounded-lg hover:bg-burgundy-50 text-brown-300 hover:text-burgundy-600 transition-colors cursor-pointer"
                              title="Delete Piece"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Product List View */}
              {productView === 'list' && filteredProducts.length > 0 && (
                <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brown-200 bg-cream-50/50 text-brown-500 text-[10px] uppercase tracking-[0.16em]">
                        <th className="py-3 px-4 w-10">
                          <button onClick={selectAllProducts} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedProductIds.size === filteredProducts.length ? 'bg-blush-400 border-blush-400 text-white' : 'bg-white border-brown-300 text-transparent'}`}>
                            <Check size={10} />
                          </button>
                        </th>
                        <th className="py-3 px-4 font-semibold">{isAr ? 'القطعة' : 'Piece'}</th>
                        <th className="py-3 px-4 font-semibold">{isAr ? 'التصنيف' : 'Category'}</th>
                        <th className="py-3 px-4 font-semibold">{isAr ? 'السعر' : 'Price'}</th>
                        <th className="py-3 px-4 font-semibold">{isAr ? 'المخزون' : 'Status'}</th>
                        <th className="py-3 px-4 text-end"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-100">
                      {filteredProducts.map((p) => {
                        const isSelected = selectedProductIds.has(p.id);
                        return (
                          <tr key={p.id} className={`group transition-colors ${isSelected ? 'bg-blush-50/30' : 'hover:bg-white/50'}`}>
                            <td className="py-3 px-4">
                               <button onClick={() => toggleProductSelection(p.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blush-400 border-blush-400 text-white' : 'bg-white border-brown-300 text-transparent'}`}>
                                <Check size={10} />
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-brown-200/50" />
                                <div>
                                  <div className="font-serif text-sm text-brown-900">{p.name}</div>
                                  <div className="text-[10px] text-brown-500">{p.colorName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded bg-cream-100 text-[10px] uppercase tracking-wider text-brown-700">{p.category}</span>
                            </td>
                            <td className="py-3 px-4 font-serif font-medium text-brown-900">{p.price} {isAr ? 'د.ك' : 'KD'}</td>
                            <td className="py-3 px-4">
                               <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium text-sage-700 bg-sage-50 border border-sage-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-sage-400"></span> In Stock
                              </span>
                            </td>
                            <td className="py-3 px-4 text-end">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditProductModal(p)} className="p-1.5 rounded-lg text-brown-400 hover:text-brown-900 hover:bg-brown-100"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded-lg text-brown-300 hover:text-burgundy-600 hover:bg-burgundy-50"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 3: ORDERS TRACKING
          ====================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Order Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {['all', 'pending', 'handmade', 'shipped', 'delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      tactileAudio.playScrubTick(300);
                      setStatusFilter(st);
                    }}
                    className={`px-4 py-2 rounded-full text-[10.5px] font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                        : 'bg-[#FAF6F0] text-brown-600 border border-brown-200/60 hover:bg-cream-200'
                    }`}
                  >
                    {st === 'all'
                      ? (isAr ? 'جميع الطلبات' : 'All Orders')
                      : st === 'pending'
                      ? (isAr ? 'قيد الانتظار' : 'Pending')
                      : st === 'handmade'
                      ? (isAr ? 'حياكة يدوية' : 'Handmade')
                      : st === 'shipped'
                      ? (isAr ? 'تم الشحن' : 'Shipped')
                      : (isAr ? 'تم التسليم' : 'Delivered')}
                  </button>
                ))}
              </div>

              {/* Empty State */}
              {filteredOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#FAF6F0] rounded-3xl border border-brown-200/60 border-dashed">
                  <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brown-400 mb-4">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="font-serif text-lg text-brown-900 mb-1">No orders found</h3>
                  <p className="text-xs text-brown-500 max-w-sm">No bespoke orders match the current status filter.</p>
                </div>
              )}

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  
                  // Timeline logic
                  const stages = ['pending', 'handmade', 'shipped', 'delivered'];
                  const cleanStatus = (order.status === 'hooking' || order.status === 'finishing')
                    ? 'handmade'
                    : stages.includes(order.status)
                    ? order.status
                    : 'pending';
                  const currentIndex = stages.indexOf(cleanStatus);

                  return (
                    <div key={order.id} className={`bg-[#FAF6F0] rounded-3xl border transition-all duration-300 ${isExpanded ? 'border-brown-300 shadow-md' : 'border-brown-200/60 shadow-sm hover:border-brown-300'}`}>
                      
                      {/* Compact Header (Always visible) */}
                      <div 
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <div className={`p-2.5 rounded-2xl flex items-center justify-center ${
                            order.status === 'delivered' ? 'bg-sage-100 text-sage-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-cream-200 text-brown-600'
                          }`}>
                            {order.status === 'delivered' ? <CheckCircle2 size={18} /> : 
                             order.status === 'shipped' ? <Truck size={18} /> : 
                             <Clock size={18} />}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-bold text-brown-900">{order.orderNumber}</span>
                              <span className="text-[10px] text-brown-400 font-light">{order.createdAt}</span>
                            </div>
                            <div className="text-xs text-brown-600 font-medium">
                              {order.customerName} <span className="font-light mx-1">•</span> {order.destination}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:w-auto w-full border-t sm:border-t-0 border-brown-200/50 pt-3 sm:pt-0">
                           {/* Payment Status Badge */}
                           <span
                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                               order.paymentStatus === 'paid'
                                 ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                 : order.paymentStatus === 'contacting'
                                 ? 'bg-sky-50 text-sky-800 border-sky-200'
                                 : 'bg-amber-50 text-amber-800 border-amber-200'
                             }`}
                           >
                             <span className={`w-1.5 h-1.5 rounded-full ${
                               order.paymentStatus === 'paid'
                                 ? 'bg-emerald-500'
                                 : order.paymentStatus === 'contacting'
                                 ? 'bg-sky-500'
                                 : 'bg-amber-500'
                             }`} />
                             {order.paymentStatus === 'paid'
                               ? isAr ? 'تم الدفع' : 'Paid'
                               : order.paymentStatus === 'contacting'
                               ? isAr ? 'جاري التواصل' : 'Contacting'
                               : isAr ? 'غير مدفوع' : 'Unpaid'}
                           </span>

                           {/* Order Fulfillment Status Badge */}
                           <span
                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                               order.status === 'handmade' || order.status === 'hooking' || order.status === 'finishing' ? 'bg-blush-100 text-burgundy-700' : 
                               order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                               order.status === 'delivered' ? 'bg-sage-100 text-sage-800' :
                               'bg-cream-100 text-brown-600'
                             }`}
                           >
                             {order.status === 'pending'
                               ? isAr ? 'قيد الانتظار' : 'Pending'
                               : order.status === 'handmade' || order.status === 'hooking' || order.status === 'finishing'
                               ? isAr ? 'حياكة يدوية' : 'Handmade'
                               : order.status === 'shipped'
                               ? isAr ? 'تم الشحن' : 'Shipped'
                               : order.status === 'delivered'
                               ? isAr ? 'تم التسليم' : 'Delivered'
                               : order.status}
                           </span>
                            
                           <div className="flex items-center gap-4">
                             <div className="font-serif text-lg font-bold text-brown-900">{order.total} {isAr ? 'د.ك' : 'KD'}</div>
                             <button className="text-brown-400 hover:text-brown-900 p-1">
                               {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                             </button>
                           </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-brown-200/50 animate-in slide-in-from-top-2 fade-in duration-300">
                          
                          {/* Visual Timeline */}
                          <div className="py-6 px-4 mb-6 bg-white/50 rounded-2xl border border-brown-100">
                            <div className="relative flex items-center justify-between">
                              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-brown-100 z-0"></div>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blush-300 z-0 transition-all duration-700" style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}></div>
                              
                              {stages.map((stage, idx) => {
                                const isCompleted = idx <= currentIndex;
                                const isCurrent = idx === currentIndex;
                                return (
                                  <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
                                      isCompleted ? 'bg-blush-400 border-blush-400 text-white' : 'bg-white border-brown-200 text-transparent'
                                    } ${isCurrent ? 'ring-4 ring-blush-100' : ''}`}>
                                      {isCompleted && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span className={`absolute top-8 text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${isCompleted ? 'text-brown-900' : 'text-brown-400'}`}>
                                      {stage === 'pending'
                                        ? (isAr ? 'قيد الانتظار' : 'Pending')
                                        : stage === 'handmade'
                                        ? (isAr ? 'حياكة يدوية' : 'Handmade')
                                        : stage === 'shipped'
                                        ? (isAr ? 'تم الشحن' : 'Shipped')
                                        : (isAr ? 'تم التسليم' : 'Delivered')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Order Details */}
                            <div>
                              <h4 className="text-[10px] uppercase tracking-wider font-bold text-brown-500 mb-3">Order Details</h4>
                              <div className="space-y-3">
                                {order.items.map((it: any, idx: number) => {
                                  const prod = it.product || it;
                                  const prodName = prod.name || it.name || 'Custom Piece';
                                  const prodImage = prod.image || it.image || '/products/hadab-bag.jpg';
                                  const prodCategory = prod.category || it.category || 'Handmade';
                                  const prodQty = it.quantity || 1;

                                  return (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-brown-100 shadow-sm">
                                      <img src={prodImage} alt={prodName} className="w-12 h-12 rounded-lg object-cover" />
                                      <div className="flex-1 text-xs">
                                        <div className="font-semibold text-brown-900">{prodName}</div>
                                        <div className="text-[10px] text-brown-500 mt-0.5">{isAr ? 'التصنيف:' : 'Category:'} {prodCategory}</div>
                                      </div>
                                      <div className="text-xs font-medium text-brown-900 bg-cream-50 px-2 py-1 rounded">
                                        {isAr ? 'الكمية:' : 'Qty:'} {prodQty}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Order Financial Breakdown: Subtotal, Delivery Fee, Total */}
                              {(() => {
                                const itemsSubtotal = order.items.reduce((sum: number, it: any) => {
                                  const p = Number(it.price ?? it.product?.price ?? 0);
                                  const q = Number(it.quantity || 1);
                                  return sum + (p * q);
                                }, 0);
                                const deliveryFee = Math.max(0, Number(order.total) - itemsSubtotal);
                                return (
                                  <div className="mt-3 p-3 bg-cream-50/80 rounded-xl border border-brown-200/60 text-xs space-y-1.5">
                                    <div className="flex justify-between text-brown-500 text-[11px]">
                                      <span>{isAr ? 'مجموع القطع:' : 'Items Subtotal:'}</span>
                                      <span className="font-semibold text-brown-800">{itemsSubtotal.toFixed(2)} {isAr ? 'د.ك' : 'KD'}</span>
                                    </div>
                                    <div className="flex justify-between text-brown-500 text-[11px]">
                                      <span>{isAr ? `رسوم التوصيل (${order.destination}):` : `Delivery Fee (${order.destination}):`}</span>
                                      <span className={`font-semibold ${deliveryFee > 0 ? 'text-brown-800' : 'text-emerald-700'}`}>
                                        {deliveryFee > 0 ? `${deliveryFee.toFixed(2)} ${isAr ? 'د.ك' : 'KD'}` : (isAr ? 'مجاني' : 'Free')}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-brown-900 font-bold pt-1.5 border-t border-brown-200/70 text-xs">
                                      <span>{isAr ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                                      <span className="font-serif text-sm text-brown-950">{Number(order.total).toFixed(2)} {isAr ? 'د.ك' : 'KD'}</span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Customer & Management */}
                            <div className="space-y-6">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-brown-500">
                                    {isAr ? 'معلومات العميل والتوصيل' : 'Customer & Delivery Info'}
                                  </h4>
                                  <button
                                    onClick={() => downloadOrderInvoicePdf(order, isAr ? 'د.ك' : 'KD', settingsPhone, settingsEmail)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brown-900 hover:bg-brown-800 text-white rounded-lg text-[11px] font-semibold transition-all shadow-xs hover:shadow cursor-pointer"
                                  >
                                    <Printer size={12} />
                                    <span>{isAr ? 'تحميل الفاتورة PDF' : 'Download PDF Bill'}</span>
                                  </button>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-brown-200/80 shadow-xs text-xs space-y-3">
                                  {/* Contact Row */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pb-3 border-b border-brown-100">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-brown-600 shrink-0">
                                        <Users size={13} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[10px] text-brown-400 font-medium leading-none mb-0.5">{isAr ? 'الاسم' : 'Name'}</div>
                                        <div className="font-semibold text-brown-900 truncate">{order.customerName}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-brown-600 shrink-0">
                                        <Phone size={13} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[10px] text-brown-400 font-medium leading-none mb-0.5">{isAr ? 'الهاتف' : 'Phone'}</div>
                                        <a href={`tel:${order.customerPhone}`} className="font-mono font-medium text-brown-800 hover:text-brown-950 transition-colors">
                                          {order.customerPhone || 'N/A'}
                                        </a>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-brown-600 shrink-0">
                                        <Mail size={13} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[10px] text-brown-400 font-medium leading-none mb-0.5">{isAr ? 'البريد' : 'Email'}</div>
                                        <a href={`mailto:${order.customerEmail}`} className="text-brown-700 hover:underline truncate block">
                                          {order.customerEmail}
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Delivery Destination & Address */}
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-1.5 text-brown-800 font-semibold text-[11px]">
                                        <MapPin size={13} className="text-burgundy-700" />
                                        <span>{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-full bg-cream-200/70 text-brown-800 text-[10px] font-bold">
                                        {order.destination}
                                      </span>
                                    </div>

                                    {order.address ? (
                                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-brown-200/60">
                                        {(() => {
                                          // Clean up prefix if exists
                                          let clean = order.address.replace(/^[^-]+-\s*/, '').trim();
                                          if (!clean) clean = order.address;
                                          const segments = clean.split(',').map((s) => s.trim()).filter(Boolean);

                                          return (
                                            <div className="flex flex-wrap gap-2 items-center">
                                              {segments.map((seg, i) => {
                                                const colonIdx = seg.indexOf(':');
                                                if (colonIdx > -1) {
                                                  const label = seg.slice(0, colonIdx).trim();
                                                  const val = seg.slice(colonIdx + 1).trim();
                                                  return (
                                                    <div key={i} className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-brown-200/70 shadow-2xs text-[11px]">
                                                      <span className="text-brown-400 text-[10px] font-bold uppercase">{label}:</span>
                                                      <span className="font-semibold text-brown-900">{val}</span>
                                                    </div>
                                                  );
                                                }
                                                return (
                                                  <div key={i} className="inline-flex items-center bg-white px-2.5 py-1 rounded-lg border border-brown-200/70 shadow-2xs text-[11px] font-medium text-brown-900">
                                                    {seg}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <div className="text-[11px] text-brown-400 italic bg-cream-50 p-2.5 rounded-xl border border-brown-100">
                                        {isAr ? 'لم يُسجل عنوان تفصيلي للطلب' : 'No detailed address recorded for this order'}
                                      </div>
                                    )}
                                  </div>

                                  {/* Notes (if available) */}
                                  {order.notes && (
                                    <div className="pt-2 border-t border-brown-100/70">
                                      <div className="flex items-start gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70">
                                        <StickyNote size={13} className="text-amber-700 shrink-0 mt-0.5" />
                                        <div className="text-[11px]">
                                          <span className="font-bold text-amber-900">{isAr ? 'ملاحظات العميل: ' : 'Customer Notes: '}</span>
                                          <span className="text-amber-950 font-medium">{order.notes}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] uppercase tracking-wider font-bold text-brown-500 mb-3">
                                  {isAr ? 'إدارة الطلب والدفع' : 'Order & Payment Management'}
                                </h4>
                                <div className="flex flex-col gap-3 bg-cream-50/50 p-4 rounded-xl border border-brown-100">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-brown-500">{isAr ? 'الموقع المسؤول:' : 'Fulfillment Hub:'}</span>
                                    <span className="font-semibold text-brown-900">{order.artisan}</span>
                                  </div>
                                  
                                  <div className="h-px bg-brown-200/50"></div>
                                  
                                   {/* Payment Status Dropdown (Admin Only) */}
                                   <div className="flex items-center justify-between gap-2">
                                     <span className="text-xs font-semibold text-brown-700">
                                       {isAr ? 'حالة الدفع:' : 'Payment Status:'}
                                     </span>
                                     <select
                                       value={order.paymentStatus || 'unpaid'}
                                       onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value as any)}
                                       className={`flex-1 max-w-[150px] px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer shadow-xs focus:outline-none transition-colors ${
                                         (order.paymentStatus || 'unpaid') === 'paid'
                                           ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                           : (order.paymentStatus || 'unpaid') === 'contacting'
                                           ? 'bg-sky-50 border-sky-300 text-sky-800'
                                           : 'bg-amber-50 border-amber-300 text-amber-800'
                                       }`}
                                     >
                                       <option value="unpaid">{isAr ? 'غير مدفوع' : 'Unpaid'}</option>
                                       <option value="contacting">{isAr ? 'جاري التواصل' : 'Contacting'}</option>
                                       <option value="paid">{isAr ? 'تم الدفع' : 'Paid'}</option>
                                     </select>
                                   </div>

                                   {/* Order Fulfillment Status Dropdown (Admin Only) */}
                                   <div className="flex items-center justify-between gap-2">
                                     <span className="text-xs font-semibold text-brown-700">
                                       {isAr ? 'حالة الطلب:' : 'Order Status:'}
                                     </span>
                                     <select
                                       value={order.status === 'hooking' || order.status === 'finishing' ? 'handmade' : stages.includes(order.status) ? order.status : 'pending'}
                                       onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                       className="flex-1 max-w-[150px] px-2.5 py-1.5 rounded-lg bg-white border border-brown-300 text-xs font-semibold text-brown-900 focus:outline-none focus:border-blush-400 cursor-pointer shadow-xs"
                                     >
                                       <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                                       <option value="handmade">{isAr ? 'حياكة يدوية' : 'Handmade'}</option>
                                       <option value="shipped">{isAr ? 'تم الشحن' : 'Shipped'}</option>
                                       <option value="delivered">{isAr ? 'تم التسليم' : 'Delivered'}</option>
                                     </select>
                                   </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* =====================================================================
              TAB 5: CATEGORIES MANAGEMENT
          ====================================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCatNameEn(''); setCatNameAr(''); setCatDescEn(''); setCatDescAr('');
                    setCatImage('/products/hadab-bag.jpg');
                    setIsCatModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-[10.5px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isAr ? 'إضافة تصنيف' : 'New Category'}</span>
                </button>
              </div>

              {/* Category Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryList.map((cat) => (
                  <div key={cat.id} className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-5 flex flex-col gap-4 group hover:border-brown-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="cursor-grab active:cursor-grabbing text-brown-300 hover:text-brown-500 hidden sm:block">
                          <GripVertical size={16} />
                        </div>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: cat.color + '30', border: `1px solid ${cat.color}50` }}>
                          <Tag size={20} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <h3 className="font-serif text-base text-brown-950 font-medium leading-snug">
                            {isAr ? cat.nameAr : cat.name}
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brown-400">/{cat.slug}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setCatNameEn(cat.name); setCatNameAr(cat.nameAr);
                            setCatDescEn(cat.description); setCatDescAr(cat.descriptionAr);
                            setCatImage(cat.image || '/products/hadab-bag.jpg');
                            setIsCatModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white text-brown-400 hover:text-brown-900 transition-colors shadow-sm border border-transparent hover:border-brown-100"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          title={isAr ? 'حذف التصنيف' : 'Delete Category'}
                          className="p-1.5 rounded-lg hover:bg-burgundy-50 text-brown-300 hover:text-burgundy-600 transition-colors shadow-sm border border-transparent hover:border-burgundy-100 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 bg-cream-50/50 rounded-xl p-3 border border-brown-100/50">
                      <p className="text-[11.5px] text-brown-600 font-light leading-relaxed line-clamp-3">
                        {isAr ? cat.descriptionAr : cat.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-brown-500 font-medium uppercase tracking-wider">
                        <strong className="text-brown-900 text-sm font-serif mr-1">{cat.pieceCount}</strong>
                        Pieces
                      </span>
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory(cat.slug); setActiveTab('products'); }}
                        className="text-[10px] font-bold uppercase tracking-wider text-brown-600 hover:text-brown-900 bg-white px-3 py-1.5 rounded-full border border-brown-200 shadow-sm flex items-center gap-1 transition-all hover:shadow"
                      >
                        <span>Manage</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 6: CUSTOMER DIRECTORY
          ====================================================================== */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF6F0] p-3 rounded-3xl border border-brown-200/60 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                  {(['all', 'active', 'new'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setCustomerFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        customerFilter === f
                          ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                          : 'bg-transparent text-brown-600 hover:bg-brown-200/50'
                      }`}
                    >
                      {f === 'all' ? (isAr ? 'الكل' : 'All') : f === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'جديد' : 'New')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-brown-500 font-medium">
                    {filteredCustomers.length} {isAr ? 'عميل' : filteredCustomers.length === 1 ? 'customer' : 'customers'}
                  </span>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-brown-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-brown-600 hover:text-brown-900 shadow-sm transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>{isAr ? 'تصدير كملف CSV' : 'Export CSV'}</span>
                  </button>
                </div>
              </div>

              {/* Customers List/Table */}
              {filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#FAF6F0] rounded-3xl border border-brown-200/60 border-dashed">
                  <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brown-400 mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="font-serif text-lg text-brown-900 mb-1">
                    {customersList.length === 0 ? (isAr ? 'لا يوجد عملاء مسجلين حالياً' : 'No registered customers yet') : (isAr ? 'لا توجد نتائج مطابقة' : 'No matching customers')}
                  </h3>
                  <p className="text-xs text-brown-500 max-w-sm font-light">
                    {customersList.length === 0
                      ? (isAr ? 'سيظهر العملاء وحساباتهم وسجل طلباتهم هنا بمجرد تسجيل المشترين للطلبات.' : 'Customer accounts, contact info, and purchase history will appear here once orders are placed.')
                      : (isAr ? 'جرّب تعديل خيارات الفلترة أو البحث للعثور على العميل المطلوب.' : 'Try adjusting your filters or search terms.')}
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-brown-200/80 bg-cream-50/50 text-brown-500 text-[10px] uppercase tracking-[0.14em]">
                        <th className="px-5 py-4 font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                        <th className="px-5 py-4 font-semibold hidden md:table-cell">{isAr ? 'التواصل' : 'Contact'}</th>
                        <th className="px-5 py-4 text-center font-semibold">{isAr ? 'الطلبات' : 'Orders'}</th>
                        <th className="px-5 py-4 text-end font-semibold">{isAr ? 'الإنفاق الكلي' : 'Total Spent'}</th>
                        <th className="px-5 py-4 text-center font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                        <th className="px-5 py-4 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-100">
                      {filteredCustomers.map((customer, idx) => {
                        const isExpanded = expandedCustomerId === customer.id;
                        const isDisabled = Boolean(customer.isDisabled);
                        // Pseudo-random colors based on index for avatars
                        const colors = ['bg-blush-100 text-burgundy-700', 'bg-sage-100 text-sage-800', 'bg-amber-100 text-amber-800', 'bg-blue-100 text-blue-800', 'bg-cream-200 text-brown-800'];
                        const colorClass = colors[idx % colors.length];

                        return (
                          <React.Fragment key={customer.id}>
                            <tr
                              className={`hover:bg-white/50 transition-colors cursor-pointer ${
                                isExpanded ? 'bg-white/50' : ''
                              } ${isDisabled ? 'opacity-60 bg-stone-100/60' : ''}`}
                              onClick={() => setExpandedCustomerId(isExpanded ? null : customer.id)}
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-xs font-bold shrink-0 ${colorClass}`}>
                                    {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-brown-900 text-sm">{customer.name}</span>
                                      {isDisabled && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">
                                          {isAr ? 'معطل' : 'Disabled'}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-brown-400 font-light flex items-center gap-1 mt-0.5">
                                      <MapPin size={10} /> {customer.country}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 hidden md:table-cell">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 text-brown-600"><Mail size={12} />{customer.email}</div>
                                  <div className="flex items-center gap-1.5 text-brown-400"><Phone size={12} />{customer.phone}</div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-center">
                                <span className="font-semibold text-brown-900 bg-cream-50 px-2 py-1 rounded">{customer.totalOrders}</span>
                              </td>
                              <td className="px-5 py-4 text-end font-serif font-semibold text-brown-900 text-base">{customer.totalSpent} {isAr ? 'د.ك' : 'KD'}</td>
                              <td className="px-5 py-4 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  isDisabled
                                    ? 'bg-red-100 text-red-700'
                                    : customer.status === 'active'
                                    ? 'bg-sage-100 text-sage-800'
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {isDisabled
                                    ? (isAr ? 'معطل' : 'Disabled')
                                    : customer.status === 'active'
                                    ? (isAr ? 'نشط' : 'Active')
                                    : (isAr ? 'جديد' : 'New')}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-center text-brown-400">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </td>
                            </tr>
                            
                            {/* Expandable row detail: Quick Actions in One Horizontal Row */}
                            {isExpanded && (
                              <tr className="bg-white/80 border-b-2 border-brown-200">
                                <td colSpan={6} className="px-5 py-5">
                                  <div className="w-full">
                                    <div className="text-[10px] uppercase font-bold text-brown-400 tracking-wider mb-3">
                                      {isAr ? 'الإجراءات السريعة' : 'Quick Actions'}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                                      {/* 1. View Orders */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          tactileAudio.playScrubTick(320);
                                          setGlobalSearch(customer.email);
                                          setActiveTab('orders');
                                        }}
                                        className="px-3.5 py-2.5 bg-cream-50 hover:bg-cream-100 border border-brown-200/50 rounded-xl text-xs font-medium text-brown-800 transition-all flex items-center justify-between cursor-pointer shadow-xs hover:border-brown-300"
                                      >
                                        <span className="truncate">{isAr ? 'سجل الطلبات' : 'Order History'}</span>
                                        <ArrowUpRight size={13} className="text-brown-400 shrink-0 ml-1" />
                                      </button>

                                      {/* 2. WhatsApp */}
                                      <a
                                        href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isAr ? `مرحباً ${customer.name}، معك متجر هَدَب للأشغال اليدوية الكروشيه.` : `Hello ${customer.name}, this is HADAB handmade crochet shop.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-3.5 py-2.5 bg-cream-50 hover:bg-emerald-50/70 border border-brown-200/50 hover:border-emerald-300 rounded-xl text-xs font-medium text-brown-800 hover:text-emerald-800 transition-all flex items-center justify-between cursor-pointer shadow-xs"
                                      >
                                        <span className="truncate">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                                        <Phone size={13} className="text-emerald-600 shrink-0 ml-1" />
                                      </a>

                                      {/* 3. Email */}
                                      <a
                                        href={`mailto:${customer.email}?subject=${encodeURIComponent(isAr ? 'عرض خاص من هَدَب' : 'Special Offer from HADAB')}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-3.5 py-2.5 bg-cream-50 hover:bg-cream-100 border border-brown-200/50 rounded-xl text-xs font-medium text-brown-800 transition-all flex items-center justify-between cursor-pointer shadow-xs hover:border-brown-300"
                                      >
                                        <span className="truncate">{isAr ? 'إرسال إيميل' : 'Send Email'}</span>
                                        <Mail size={13} className="text-brown-500 shrink-0 ml-1" />
                                      </a>

                                      {/* 4. Disable / Enable Customer */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleDisableCustomer(customer);
                                        }}
                                        className={`px-3.5 py-2.5 border rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer shadow-xs ${
                                          isDisabled
                                            ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                                            : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                                        }`}
                                      >
                                        <span className="truncate">
                                          {isDisabled ? (isAr ? 'تفعيل الحساب' : 'Enable') : (isAr ? 'تعطيل الحساب' : 'Disable')}
                                        </span>
                                        {isDisabled ? (
                                          <UserCheck size={13} className="text-emerald-600 shrink-0 ml-1" />
                                        ) : (
                                          <Ban size={13} className="text-amber-700 shrink-0 ml-1" />
                                        )}
                                      </button>

                                      {/* 5. Delete Customer */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCustomer(customer);
                                        }}
                                        className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl text-xs font-medium text-red-700 transition-all flex items-center justify-between cursor-pointer shadow-xs"
                                      >
                                        <span className="truncate">{isAr ? 'حذف العميل' : 'Delete'}</span>
                                        <Trash2 size={13} className="text-red-500 shrink-0 ml-1" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 7: STORE SETTINGS
          ====================================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6 pb-12">
              
              {/* General Preferences */}
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-brown-200/50 bg-white/50">
                  <h3 className="font-serif text-lg text-brown-900 font-medium">General Preferences</h3>
                  <p className="text-xs text-brown-500 font-light mt-0.5">Control pricing currency, shipping rules, and contact info.</p>
                </div>
                
                <div className="p-6 space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-brown-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">{isAr ? 'العملة الأساسية' : 'Default Currency'}</label>
                      <select
                        value={settingsCurrency}
                        onChange={(e) => setSettingsCurrency(e.target.value as CurrencyCode)}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 cursor-pointer"
                      >
                        {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code} ({c.symbolAr}) — {isAr ? c.nameAr : c.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[9px] text-brown-400 mt-1">{isAr ? 'جميع الأسعار في المتجر ستُعرض بهذه العملة كأساس' : 'All product prices are stored in this currency'}</p>
                    </div>
                    <div>
                      <label className="block text-brown-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">{isAr ? 'رقم هاتف هَدَب / واتساب المتجر' : 'HADAB Phone Number'}</label>
                      <div className="relative">
                        <Phone size={14} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-brown-400`} />
                        <input
                          type="tel"
                          value={settingsPhone}
                          onChange={(e) => setSettingsPhone(e.target.value)}
                          placeholder="+965 9900 0000"
                          className={`w-full py-2.5 ${isAr ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300`}
                        />
                      </div>
                      <p className="text-[9px] text-brown-400 mt-1">{isAr ? 'رقم التواصل المعتمد للطلبات والاستفسارات' : 'Official contact & WhatsApp number for customer orders'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-brown-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">{isAr ? 'بريد استفسارات المتجر' : 'Store Inquiries Email'}</label>
                    <input
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300"
                    />
                  </div>
                </div>
              </div>

              {/* Country-Based Shipping Fees */}
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-brown-200/50 bg-white/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-brown-900 font-medium">
                      {isAr ? 'رسوم التوصيل حسب الدولة' : 'Shipping Fees by Country'}
                    </h3>
                    <p className="text-xs text-brown-500 font-light mt-0.5">
                      {isAr
                        ? `حدد تكلفة الشحن لكل دولة بـ (${settingsCurrency}). يمكن تشغيل أو إيقاف الخاصية بالكامل.`
                        : `Set shipping fees per destination country in (${settingsCurrency}). Toggle feature on or off.`}
                    </p>
                  </div>
                  
                  {/* Master Feature Toggle (On / Off) */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-brown-700">
                      {shippingEnabledState ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Disabled')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShippingEnabledState(!shippingEnabledState)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                        shippingEnabledState ? 'bg-emerald-600' : 'bg-brown-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                          shippingEnabledState ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {!shippingEnabledState && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0 text-amber-600" />
                      <span>
                        {isAr
                          ? 'رسوم الشحن معطلة حالياً. سيتم احتساب الشحن مجاناً لكافة الطلبات.'
                          : 'Country shipping fees are currently disabled. Shipping will show as free.'}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {shippingRatesState.map((countryRate, idx) => (
                      <div
                        key={countryRate.countryCode}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          countryRate.enabled
                            ? 'bg-white border-brown-200/80 shadow-warm-xs'
                            : 'bg-brown-50/50 border-brown-200/40 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-brown-900">
                              {isAr ? countryRate.countryNameAr : countryRate.countryName}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-200 text-brown-600">
                              {countryRate.countryCode}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Row Enable Toggle */}
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={countryRate.enabled}
                                onChange={(e) => {
                                  const next = [...shippingRatesState];
                                  next[idx] = { ...countryRate, enabled: e.target.checked };
                                  setShippingRatesState(next);
                                }}
                                className="rounded border-brown-300 text-burgundy-600 focus:ring-burgundy-500 w-3.5 h-3.5"
                              />
                              <span className="text-[10px] text-brown-500 font-medium">
                                {isAr ? 'تفعيل' : 'Enable'}
                              </span>
                            </label>

                            {!['KW', 'JO', 'SA', 'AE', 'QA', 'BH', 'OM', 'REST'].includes(countryRate.countryCode) && (
                              <button
                                type="button"
                                onClick={() => {
                                  tactileAudio.playScrubTick();
                                  setShippingRatesState((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="p-1 rounded-lg text-brown-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title={isAr ? 'حذف الدولة' : 'Remove country'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brown-600 font-medium whitespace-nowrap">
                            {isAr ? 'الرسوم:' : 'Fee:'}
                          </span>
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brown-400 font-bold text-xs">
                              {settingsCurrency}
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              disabled={!countryRate.enabled}
                              value={countryRate.rate}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const next = [...shippingRatesState];
                                next[idx] = { ...countryRate, rate: isNaN(val) ? 0 : val };
                                setShippingRatesState(next);
                              }}
                              className="w-full py-1.5 pl-12 pr-3 rounded-xl bg-white border border-brown-200 text-brown-900 text-xs font-semibold focus:outline-none focus:border-burgundy-500 disabled:bg-brown-100/50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Specific Country Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        tactileAudio.playScrubTick();
                        setNewCountryCode('');
                        setNewCountrySearch('');
                        setNewCountryRate(4);
                        setIsAddCountryModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brown-900 hover:bg-brown-950 text-cream-100 text-xs font-medium tracking-wide transition-all shadow-warm-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة دولة مخصصة للشحن' : 'Add Specific Country'}</span>
                    </button>
                  </div>

                  <p className="text-[10.5px] text-brown-500 italic pt-1">
                    {isAr
                      ? `* يتم حساب رسوم الشحن بعملة المتجر الأساسية (${settingsCurrency}) وتحويلها تلقائياً لعملة العميل عند الدفع.`
                      : `* Shipping fees are configured in base currency (${settingsCurrency}) and automatically converted to the customer's selected display currency.`}
                  </p>
                </div>
              </div>

              {/* Add Country Modal */}
              {isAddCountryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/40 backdrop-blur-sm animate-fade-in">
                  <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl border border-brown-200/80 shadow-warm-xl overflow-hidden p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-brown-200/50">
                      <div>
                        <h3 className="font-serif text-lg text-brown-900 font-medium">
                          {isAr ? 'إضافة دولة لقائمة الشحن' : 'Add Country to Shipping'}
                        </h3>
                        <p className="text-xs text-brown-500 font-light mt-0.5">
                          {isAr
                            ? 'اختر الدولة وحدد تكلفة الشحن المخصصة لها'
                            : 'Select a country and set its specific shipping rate'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddCountryModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-cream-200/60 hover:bg-cream-300/60 text-brown-600 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="py-4 space-y-4">
                      {/* Search Countries */}
                      <div>
                        <label className="block text-xs font-semibold text-brown-700 mb-1.5">
                          {isAr ? 'البحث عن دولة' : 'Search Country'}
                        </label>
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" />
                          <input
                            type="text"
                            value={newCountrySearch}
                            onChange={(e) => setNewCountrySearch(e.target.value)}
                            placeholder={isAr ? 'ابحث بالاسم أو الرمز...' : 'Search by name or code...'}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500"
                          />
                        </div>
                      </div>

                      {/* Country List */}
                      <div>
                        <label className="block text-xs font-semibold text-brown-700 mb-1.5">
                          {isAr ? 'اختر الدولة' : 'Select Country'}
                        </label>
                        <div className="max-h-48 overflow-y-auto rounded-xl border border-brown-200 bg-white divide-y divide-brown-100">
                          {availableCountriesToAdd.length === 0 ? (
                            <div className="p-4 text-center text-xs text-brown-400">
                              {isAr ? 'لا توجد دول متبقية للإضافة' : 'No available countries found'}
                            </div>
                          ) : (
                            availableCountriesToAdd.map((c) => {
                              const isSelected = newCountryCode === c.code;
                              return (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => setNewCountryCode(c.code)}
                                  className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors ${
                                    isSelected
                                      ? 'bg-brown-100/70 text-brown-950 font-medium'
                                      : 'hover:bg-cream-100/70 text-brown-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-base">{c.flag}</span>
                                    <span className="text-xs">
                                      {isAr ? c.nameAr : c.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-200/80 text-brown-600">
                                    {c.code}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Shipping Fee Input */}
                      <div>
                        <label className="block text-xs font-semibold text-brown-700 mb-1.5">
                          {isAr ? `رسوم الشحن (${settingsCurrency})` : `Shipping Fee (${settingsCurrency})`}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 font-bold text-xs">
                            {settingsCurrency}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={newCountryRate}
                            onChange={(e) => setNewCountryRate(Number(e.target.value) || 0)}
                            className="w-full pl-14 pr-3 py-2 text-xs rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="pt-4 border-t border-brown-200/50 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddCountryModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-brown-600 hover:bg-cream-200/60 transition-colors"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        disabled={!newCountryCode}
                        onClick={() => {
                          const countryMeta = COUNTRY_CODES.find((c) => c.code === newCountryCode);
                          if (!countryMeta) return;
                          const newEntry: CountryShippingRate = {
                            countryCode: countryMeta.code,
                            countryName: countryMeta.name,
                            countryNameAr: countryMeta.nameAr,
                            rate: newCountryRate,
                            enabled: true,
                          };
                          setShippingRatesState((prev) => {
                            const restIdx = prev.findIndex((r) => r.countryCode === 'REST');
                            if (restIdx !== -1) {
                              const next = [...prev];
                              next.splice(restIdx, 0, newEntry);
                              return next;
                            }
                            return [...prev, newEntry];
                          });
                          tactileAudio.playChime();
                          showToast(
                            isAr
                              ? `تمت إضافة ${countryMeta.nameAr} لقائمة الشحن بنجاح`
                              : `Added ${countryMeta.name} to shipping rates successfully`,
                            'success'
                          );
                          setIsAddCountryModalOpen(false);
                        }}
                        className="px-5 py-2 rounded-xl bg-brown-900 hover:bg-brown-950 disabled:opacity-40 disabled:hover:bg-brown-900 text-cream-100 text-xs font-medium tracking-wide transition-all shadow-warm-xs"
                      >
                        {isAr ? 'إضافة الدولة' : 'Add Country'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* System Toggles */}
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-brown-200/50 bg-white/50">
                  <h3 className="font-serif text-lg text-brown-900 font-medium">{isAr ? 'إعدادات النظام والأتمتة' : 'System Configuration'}</h3>
                  <p className="text-xs text-brown-500 font-light mt-0.5">{isAr ? 'تفعيل الإشعارات وتحديثات المتجر' : 'Toggle automation and notification features.'}</p>
                </div>
                
                <div className="divide-y divide-brown-100">
                  {[
                    { id: 'notifications', label: isAr ? 'إشعارات الطلبات' : 'Push Notifications', desc: isAr ? 'تلقي تنبيهات عند استلام طلبات كروشيه جديدة' : 'Receive alerts for new custom orders and artisan updates.' },
                    { id: 'autoArchive', label: isAr ? 'أرشفة الطلبات المسلمة' : 'Auto-Archive Shipped', desc: isAr ? 'أرشفة الطلبات تلقائياً بعد التسليم بـ ٣٠ يوماً' : 'Automatically move orders to archive 30 days after delivery.' },
                    { id: 'maintenance', label: isAr ? 'وضع الصيانة' : 'Maintenance Mode', desc: isAr ? 'إخفاء المتجر مؤقتاً أثناء تحديث التشكيلات' : 'Hide storefront from public while updating collections.' }
                  ].map((setting) => (
                    <div key={setting.id} className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-brown-900 mb-0.5">{setting.label}</div>
                        <div className="text-[11px] text-brown-500">{setting.desc}</div>
                      </div>
                      
                      {/* Toggle Switch */}
                      <button 
                        type="button"
                        onClick={() => {
                          tactileAudio.playScrubTick(340);
                          setSettingsState(prev => ({ ...prev, [setting.id]: !prev[setting.id as keyof typeof settingsState] }));
                        }}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${settingsState[setting.id as keyof typeof settingsState] ? 'bg-blush-400' : 'bg-brown-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${settingsState[setting.id as keyof typeof settingsState] ? 'left-6' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Web Push & iPhone PWA Notifications Card */}
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-brown-200/50 bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#2E221B] text-cream-100 flex items-center justify-center shrink-0">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-brown-900 font-medium">
                        {isAr ? 'إشعارات الطلبات على الآيفون (Web Push)' : 'iPhone Push Notifications (Web Push)'}
                      </h3>
                      <p className="text-xs text-brown-500 font-light mt-0.5">
                        {isAr ? 'استلام إشعار على شاشة القفل فور قيام أي عميل بالطلب، حتى لو كان الموقع مغلقاً' : 'Receive instant lock-screen alerts for every new order even when HADAB is closed.'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                    isPushSubscribed ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-brown-200/50 text-brown-700 border border-brown-300"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isPushSubscribed ? "bg-emerald-500 animate-pulse" : "bg-brown-400"}`} />
                    {isPushSubscribed ? (isAr ? 'مفعل على هذا الجهاز' : 'Active on this Device') : (isAr ? 'غير مفعل' : 'Not Active')}
                  </span>
                </div>

                <div className="p-6 space-y-6 text-xs">
                  {/* How it works on iOS */}
                  <div className="bg-cream-100/60 p-4 rounded-2xl border border-brown-200/50 space-y-2">
                    <div className="font-semibold text-brown-900 text-xs flex items-center gap-2">
                      <Smartphone size={15} className="text-brown-700" />
                      <span>{isAr ? 'متطلبات إشعارات الآيفون (iOS 16.4+):' : 'Apple iOS Push Requirements (iOS 16.4+):'}</span>
                    </div>
                    <p className="text-brown-600 text-[11.5px] leading-relaxed">
                      {isAr
                        ? 'تتيح آبل استقبال الإشعارات عبر الويب للمواقع المضافة إلى الشاشة الرئيسية (Add to Home Screen). إذا كنت تتصفح من سفاري، أضف المتجر لشاشتك الرئيسية ثم افتحه واضغط تفعيل الإشعارات لتصلك التنبيهات دائماً.'
                        : 'Apple requires websites to be added to the iPhone Home Screen (Add to Home Screen) to deliver push notifications to the lock screen.'}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  {pushStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3.5 rounded-2xl border border-brown-100 text-center">
                        <div className="text-[10px] uppercase font-bold text-brown-400 mb-1">{isAr ? "إجمالي الأجهزة" : "Total Devices"}</div>
                        <div className="font-serif text-lg font-bold text-brown-900">{pushStats.total}</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-brown-100 text-center">
                        <div className="text-[10px] uppercase font-bold text-brown-400 mb-1">{isAr ? "أجهزة الإدارة" : "Admin Devices"}</div>
                        <div className="font-serif text-lg font-bold text-emerald-800">{pushStats.admins}</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-brown-100 text-center">
                        <div className="text-[10px] uppercase font-bold text-brown-400 mb-1">{isAr ? "أجهزة آيفون" : "iOS Devices"}</div>
                        <div className="font-serif text-lg font-bold text-sky-800">{pushStats.iosDevices}</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-brown-100 text-center">
                        <div className="text-[10px] uppercase font-bold text-brown-400 mb-1">{isAr ? "أجهزة العملاء" : "Customer Devices"}</div>
                        <div className="font-serif text-lg font-bold text-brown-700">{pushStats.customers}</div>
                      </div>
                    </div>
                  )}

                  {/* Feedback status message */}
                  {pushTestStatus && (
                    <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>{pushTestStatus}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTogglePush}
                      disabled={isPushLoading}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                        isPushSubscribed
                          ? "bg-brown-200/80 hover:bg-brown-300 text-brown-800 border border-brown-300"
                          : "bg-[#2E221B] hover:bg-brown-800 text-cream-100"
                      }`}
                    >
                      <Smartphone size={15} />
                      <span>
                        {isPushLoading
                          ? (isAr ? 'جاري المعالجة...' : 'Processing...')
                          : isPushSubscribed
                          ? (isAr ? 'إلغاء التفعيل على هذا الجهاز' : 'Unsubscribe This Device')
                          : (isAr ? 'تفعيل إشعارات الطلبات على الآيفون' : 'Enable iPhone Order Push Alerts')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendTestPush}
                      disabled={isPushLoading}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-cream-100 border border-brown-200 text-brown-800 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Send size={14} className="text-brown-600" />
                      <span>{isAr ? 'إرسال إشعار تجريبي (Test Push)' : 'Send Test Notification'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-burgundy-50/50 rounded-3xl border border-burgundy-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-burgundy-200/50 bg-white/30">
                  <h3 className="font-serif text-lg text-burgundy-900 font-medium flex items-center gap-2">
                    <AlertCircle size={18} className="text-burgundy-600"/>
                    {isAr ? 'منطقة الحذف الشامل' : 'Danger Zone'}
                  </h3>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-burgundy-900 mb-1">{isAr ? 'مسح بيانات المتجر' : 'Delete Store Data'}</div>
                    <div className="text-xs text-burgundy-700/70 max-w-md">
                      {isAr
                        ? 'حذف جميع المنتجات والطلبات والتصنيفات والعملاء نهائياً مع الاحتفاظ بحساب الإدارة فقط. لا يمكن التراجع عن هذا الإجراء.'
                        : 'Permanently remove all products, orders, categories, and customer accounts except the admin account. This action cannot be undone.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isErasing}
                    onClick={handleEraseData}
                    className="px-4 py-2 bg-white border border-burgundy-300 text-burgundy-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-burgundy-600 hover:text-white transition-colors shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {isErasing ? (isAr ? 'جاري الحذف...' : 'Erasing Data...') : (isAr ? 'مسح جميع البيانات' : 'Erase Data')}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-8 py-3 rounded-full bg-[#2E221B] text-cream-100 text-[11px] font-bold uppercase tracking-wider shadow-md hover:bg-[#3D2D25] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {isAr ? 'حفظ التغييرات' : 'Save Preferences'}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          PRODUCT ADD / EDIT MODAL
      ========================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-brown-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] rounded-[28px] sm:rounded-[36px] border border-brown-200 shadow-2xl p-5 sm:p-7 max-w-2xl w-full max-h-[92vh] overflow-y-auto transform transition-all no-scrollbar">
            
            <div className="flex items-start justify-between pb-4 border-b border-brown-200/80 mb-5">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-brown-950 font-normal">
                  {editingProduct ? (isAr ? 'تعديل تفاصيل القطعة اليدوية' : 'Edit Handmade Piece') : (isAr ? 'إضافة قطعة يدوية جديدة' : 'Add New Handcrafted Piece')}
                </h3>
                <p className="text-xs text-brown-500 font-light mt-0.5">
                  {isAr ? 'حددي تفاصيل القطعة، الألوان والصور والمواصفات ليراها العملاء في المتجر' : 'Configure piece details, colors, photos, and craft specifications for the storefront'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-200 text-brown-600 hover:text-brown-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-brown-200/40">
                  <Package size={14} className="text-burgundy-600" />
                  <span className="text-[11px] uppercase tracking-wider font-bold text-brown-800">
                    {isAr ? 'المعلومات الأساسية' : 'Basic Information'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="e.g. The Corded Tassel Pouch"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      الاسم (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={newProductNameAr}
                      onChange={(e) => setNewProductNameAr(e.target.value)}
                      placeholder="مثال: حقيبة الشرّابات المنسوجة"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      {isAr ? `السعر (${baseCurrency}) *` : `Price (${baseCurrency}) *`}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-brown-500">{baseCurrency}</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="any"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(Number(e.target.value))}
                        className="w-full py-2 pl-12 pr-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 cursor-pointer focus:outline-none focus:border-burgundy-500 shadow-sm"
                    >
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {isAr ? cat.nameAr : cat.name} ({cat.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      {isAr ? `خصم اختياري (${baseCurrency})` : `Discount (${baseCurrency})`}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-brown-500">-{baseCurrency}</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={newProductDiscount}
                        onChange={(e) => setNewProductDiscount(Number(e.target.value))}
                        placeholder="0"
                        className="w-full py-2 pl-14 pr-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                      />
                    </div>
                    {newProductDiscount > 0 && (
                      <span className="text-[9px] text-burgundy-600 font-semibold mt-0.5 block">
                        {isAr ? `السعر بعد الخصم: ${Math.max(0, newProductPrice - newProductDiscount)} ${baseCurrency}` : `After: ${Math.max(0, newProductPrice - newProductDiscount)} ${baseCurrency}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Badge / Tag (English)
                    </label>
                    <input
                      type="text"
                      value={newProductTag}
                      onChange={(e) => setNewProductTag(e.target.value)}
                      placeholder="e.g. New Drop / Signature Piece / Best Seller"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      شارة القطعة (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={newProductTagAr}
                      onChange={(e) => setNewProductTagAr(e.target.value)}
                      placeholder="مثال: إصدار جديد / قطعة مميزة / الأكثر طلباً"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CRAFT DETAILS & DESCRIPTIONS */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-brown-200/40">
                  <Sparkles size={14} className="text-burgundy-600" />
                  <span className="text-[11px] uppercase tracking-wider font-bold text-brown-800">
                    {isAr ? 'الوصف ومواصفات الحرفة اليدوية' : 'Description & Craft Specifications'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      placeholder="Detailed craftsmanship narrative, soft cotton texture, styling recommendations..."
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      الوصف (بالعربية)
                    </label>
                    <textarea
                      rows={3}
                      value={newProductDescriptionAr}
                      onChange={(e) => setNewProductDescriptionAr(e.target.value)}
                      placeholder="وصف القطعة باللغة العربية، نعومة الخيوط، الاستخدام اليومي..."
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Yarn Material (English)
                    </label>
                    <input
                      type="text"
                      value={newProductYarnType}
                      onChange={(e) => setNewProductYarnType(e.target.value)}
                      placeholder="e.g. 100% Recycled Cotton Ribbon"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      نوع الخيط (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={newProductYarnTypeAr}
                      onChange={(e) => setNewProductYarnTypeAr(e.target.value)}
                      placeholder="مثال: خيط قطن معاد تدويره ١٠٠٪"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Crochet Stitch / Technique (English)
                    </label>
                    <input
                      type="text"
                      value={newProductStitchDetail}
                      onChange={(e) => setNewProductStitchDetail(e.target.value)}
                      placeholder="e.g. Hand-hooked continuous stitch"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                      تقنية الغرزة (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={newProductStitchDetailAr}
                      onChange={(e) => setNewProductStitchDetailAr(e.target.value)}
                      placeholder="مثال: حياكة يدوية متصلة ومشدودة"
                      className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRODUCT PHOTOS */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-brown-200/40">
                  <div className="flex items-center gap-2">
                    <Upload size={14} className="text-burgundy-600" />
                    <span className="text-[11px] uppercase tracking-wider font-bold text-brown-800">
                      {isAr ? 'صور المنتج' : 'Product Photos'}
                    </span>
                  </div>
                  {newProductImages.length > 0 && (
                    <span className="text-[10px] text-brown-500 font-semibold">
                      {newProductImages.length} {isAr ? 'صور مرفوعة' : 'photos uploaded'}
                    </span>
                  )}
                </div>

                <label className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-dashed border-brown-300 hover:border-burgundy-500 bg-white/70 hover:bg-white cursor-pointer transition-all group shadow-sm">
                  <Upload size={16} className="text-brown-500 group-hover:text-burgundy-600 transition-colors" />
                  <span className="text-xs text-brown-800 font-medium">
                    {isUploadingImage
                      ? (uploadProgressText || (isAr ? 'جاري رفع الصور...' : 'Uploading photos...'))
                      : (isAr ? '+ رفع صور إضافية للقطعة (يمكنك تحديد عدة صور)' : '+ Add product photos (select multiple)')}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>

                {newProductImages.length > 0 ? (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
                    {newProductImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group/thumb w-16 h-16 rounded-xl overflow-hidden border border-brown-300 shrink-0 bg-cream-100 shadow-sm"
                      >
                        <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                        {idx === 0 ? (
                          <span className="absolute bottom-0 inset-x-0 bg-brown-900/90 text-cream-100 text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                            {isAr ? 'الرئيسية' : 'Cover'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            title={isAr ? 'تعيين كصورة رئيسية' : 'Set as primary photo'}
                            className="absolute bottom-0 inset-x-0 bg-burgundy-600/95 hover:bg-burgundy-700 text-cream-100 text-[8px] font-bold text-center py-0.5 uppercase opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                          >
                            {isAr ? 'رئيسية' : 'Make Cover'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title={isAr ? 'حذف الصورة' : 'Remove photo'}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brown-900/80 hover:bg-burgundy-600 text-cream-100 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  newProductImage && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-brown-300 shrink-0 bg-cream-100">
                        <img src={newProductImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-brown-500 font-light">
                        {isAr ? 'الصورة الافتراضية للقطعة' : 'Default piece photo'}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* SECTION 4: MULTI-COLORS & COLOR-TO-IMAGE LINKING */}
              <div className="space-y-3.5 bg-cream-100/70 p-4 rounded-2xl border border-brown-200/80">
                <div className="flex items-center justify-between pb-1 border-b border-brown-200/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-burgundy-600 border border-white" />
                    <span className="text-[11px] uppercase tracking-wider font-bold text-brown-900">
                      {isAr ? 'الألوان وربط الصور بكل لون' : 'Colors & Color-to-Photo Linking'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColorVariant}
                    className="px-2.5 py-1 rounded-lg bg-brown-900 hover:bg-brown-800 text-cream-100 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={12} />
                    <span>{isAr ? 'إضافة لون جديد' : 'Add Color Variant'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-brown-600 font-light leading-relaxed">
                  {isAr
                    ? 'أضيفي خيارات الألوان المتوفرة للقطعة وحددي الصور الخاصة بكل لون، بحيث عندما يختار العميل اللون تظهر له صوره فوراً.'
                    : 'Add color variants and assign photos to each color so customers see the matching photos when selecting that color.'}
                </p>

                {/* Color Variants List */}
                {newProductColorVariants.length > 0 ? (
                  <div className="space-y-3 pt-1">
                    {newProductColorVariants.map((variant, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-3 rounded-xl bg-white border border-brown-200/80 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brown-500">
                            {isAr ? `اللون #${vIdx + 1}` : `Color Variant #${vIdx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColorVariant(vIdx)}
                            className="text-brown-400 hover:text-burgundy-600 p-1 transition-colors"
                            title={isAr ? 'حذف هذا اللون' : 'Remove color'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[9px] uppercase font-bold text-brown-600 mb-1">
                              Color Name (EN) *
                            </label>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => handleUpdateColorVariant(vIdx, 'name', e.target.value)}
                              placeholder="e.g. Burgundy"
                              className="w-full py-1.5 px-2.5 rounded-lg bg-cream-50 border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-burgundy-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-bold text-brown-600 mb-1">
                              اسم اللون (بالعربية)
                            </label>
                            <input
                              type="text"
                              value={variant.nameArabic || ''}
                              onChange={(e) => handleUpdateColorVariant(vIdx, 'nameArabic', e.target.value)}
                              placeholder="مثال: عنابي"
                              className="w-full py-1.5 px-2.5 rounded-lg bg-cream-50 border border-brown-200 text-brown-900 text-xs focus:outline-none focus:border-burgundy-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-bold text-brown-600 mb-1">
                              {isAr ? 'درجة اللون (Hex)' : 'Color Swatch (Hex)'}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={variant.colorHex || '#D6C7B2'}
                                onChange={(e) => handleUpdateColorVariant(vIdx, 'colorHex', e.target.value)}
                                className="w-8 h-8 rounded-lg border border-brown-300 cursor-pointer p-0.5 bg-white"
                              />
                              <input
                                type="text"
                                value={variant.colorHex || '#D6C7B2'}
                                onChange={(e) => handleUpdateColorVariant(vIdx, 'colorHex', e.target.value)}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-cream-50 border border-brown-200 text-brown-900 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Photo Assignment for this Color */}
                        {newProductImages.length > 0 && (
                          <div className="pt-2 border-t border-brown-100">
                            <label className="block text-[9px] uppercase font-bold text-brown-600 mb-1.5">
                              {isAr
                                ? 'اضغطي على الصور الخاصة بهذا اللون لربطها به:'
                                : 'Click photos to assign to this color:'}
                            </label>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                              {newProductImages.map((imgUrl, pIdx) => {
                                const isAssigned = variant.images?.includes(imgUrl);
                                return (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleToggleImageForColorVariant(vIdx, imgUrl)}
                                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                                      isAssigned
                                        ? 'border-burgundy-600 ring-2 ring-burgundy-300 scale-105'
                                        : 'border-brown-200 opacity-60 hover:opacity-100'
                                    }`}
                                  >
                                    <img src={imgUrl} alt={`Option ${pIdx + 1}`} className="w-full h-full object-cover" />
                                    {isAssigned && (
                                      <div className="absolute inset-0 bg-burgundy-900/30 flex items-center justify-center">
                                        <Check size={14} className="text-white drop-shadow" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 px-4 rounded-xl bg-white/60 border border-dashed border-brown-200 text-brown-500">
                    <span className="text-xs">
                      {isAr
                        ? 'لم تتم إضافة ألوان منفصلة بعد. انقري على "+ إضافة لون جديد" بالأعلى لربط الصور بالألوان.'
                        : 'No color variants added yet. Click "+ Add Color Variant" above to link photos with colors.'}
                    </span>
                  </div>
                )}

                {/* Comma-separated Colors Fallback */}
                <div className="pt-2">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                    {isAr ? 'أو أدخلي أسماء الألوان كنص (مفصولة بفواصل)' : 'Or enter colors as text (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={newProductColors}
                    onChange={(e) => setNewProductColors(e.target.value)}
                    placeholder={isAr ? 'مثال: بيج, عنابي, زيتوني' : 'e.g. Desert Oat, Burgundy, Forest Olive'}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                  />
                </div>
              </div>

              {/* SECTION 5: SIZES */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-brown-200/40">
                  <Scissors size={14} className="text-burgundy-600" />
                  <span className="text-[11px] uppercase tracking-wider font-bold text-brown-800">
                    {isAr ? 'المقاسات المتاحة' : 'Available Sizes'}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1">
                    {isAr ? 'المقاسات (مفصولة بفواصل)' : 'Sizes (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={newProductSizes}
                    onChange={(e) => setNewProductSizes(e.target.value)}
                    placeholder={isAr ? 'مثال: Small, Medium, Large أو موحّد' : 'e.g. Small, Medium, Large or One Size'}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-burgundy-500 shadow-sm"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-brown-500 font-medium">
                      {isAr ? 'خيارات سريعة:' : 'Quick Presets:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewProductSizes(isAr ? 'مقاس موحّد' : 'One Size')}
                      className="px-2 py-0.5 rounded-full bg-cream-200 hover:bg-cream-300 text-brown-700 text-[10px] transition-colors"
                    >
                      {isAr ? 'مقاس موحّد' : 'One Size'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProductSizes(isAr ? 'صغير, متوسط, كبير' : 'Small, Medium, Large')}
                      className="px-2 py-0.5 rounded-full bg-cream-200 hover:bg-cream-300 text-brown-700 text-[10px] transition-colors"
                    >
                      {isAr ? 'صغير, متوسط, كبير' : 'Small, Medium, Large'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProductSizes(isAr ? 'ميني, عادي' : 'Mini, Regular')}
                      className="px-2 py-0.5 rounded-full bg-cream-200 hover:bg-cream-300 text-brown-700 text-[10px] transition-colors"
                    >
                      {isAr ? 'ميني, عادي' : 'Mini, Regular'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brown-200 mt-6">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-brown-600 hover:text-brown-900 hover:bg-brown-100 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check size={14} />
                  <span>{editingProduct ? (isAr ? 'حفظ تعديلات القطعة' : 'Update Piece') : (isAr ? 'إضافة إلى المتجر' : 'Add to Collection')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD / EDIT MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] rounded-[32px] border border-brown-200 shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all">
            <h3 className="font-serif text-xl text-brown-950 font-normal mb-1">
              {editingCategory ? (isAr ? 'تعديل التصنيف' : 'Edit Category') : (isAr ? 'إضافة تصنيف جديد' : 'Add New Category')}
            </h3>
            <p className="text-xs text-brown-500 font-light mb-6">
              {isAr ? 'ادخل اسم التصنيف والوصف' : 'Enter the category name and description'}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                tactileAudio.playChime();
                const slug = catNameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const catPayload = {
                  name: catNameEn,
                  nameAr: catNameAr || catNameEn,
                  description: catDescEn,
                  descriptionAr: catDescAr || catDescEn,
                  slug: editingCategory ? editingCategory.slug : slug,
                  color: editingCategory ? editingCategory.color : '#C9B99B',
                  image: catImage || '/products/hadab-bag.jpg',
                };

                if (editingCategory) {
                  setCategoryList((prev) =>
                    prev.map((c) =>
                      c.id === editingCategory.id
                        ? { ...c, ...catPayload }
                        : c
                    )
                  );
                  try {
                    await api.updateCategory(editingCategory.id, catPayload);
                    refreshData();
                    showToast(isAr ? 'تم تحديث التصنيف بنجاح ✓' : 'Category updated successfully ✓', 'success');
                  } catch (err: any) {
                    console.error('Failed to update category in DB:', err);
                    showToast(isAr ? `تعذر تحديث التصنيف في السيرفر: ${err.message}` : `Failed to update category: ${err.message}`, 'error');
                  }
                } else {
                  try {
                    const created = await api.createCategory(catPayload);
                    setCategoryList((prev) => [
                      ...prev,
                      {
                        id: created.id || created._id,
                        name: created.name,
                        nameAr: created.nameAr,
                        slug: created.slug,
                        pieceCount: 0,
                        description: created.description,
                        descriptionAr: created.descriptionAr,
                        color: created.color || '#C9B99B',
                        image: created.image || catImage || '/products/hadab-bag.jpg',
                      },
                    ]);
                    refreshData();
                    showToast(isAr ? 'تمت إضافة التصنيف بنجاح ✓' : 'Category created successfully ✓', 'success');
                  } catch (err: any) {
                    console.error('Failed to create category in DB, saving locally:', err);
                    showToast(isAr ? `تنبيه: تعذر الحفظ في قاعدة البيانات (${err.message})، تم الحفظ محلياً` : `Warning: Failed to save to database (${err.message}). Saved locally.`, 'warning');
                    setCategoryList((prev) => [
                      ...prev,
                      { id: `cat-${Date.now()}`, ...catPayload, pieceCount: 0 },
                    ]);
                  }
                }
                setIsCatModalOpen(false);
                setEditingCategory(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1.5">Name (English) *</label>
                <input type="text" required value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} placeholder="e.g. Bags & Totes" className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1.5">الاسم (بالعربية)</label>
                <input type="text" value={catNameAr} onChange={(e) => setCatNameAr(e.target.value)} placeholder="مثال: الحقائب والشنط" className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1.5">Category Photo (Cloudinary)</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-dashed border-brown-300 hover:border-burgundy-500 bg-white/60 cursor-pointer transition-colors">
                    <Upload size={14} className="text-brown-500" />
                    <span className="text-xs text-brown-700 font-medium">
                      {isUploadingCatImage ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'اختيار صورة للتصنيف' : 'Upload category image')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingCatImage}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingCatImage(true);
                        try {
                          const res = await api.uploadImage(file);
                          setCatImage(res.url);
                          tactileAudio.playChime();
                        } catch (err: any) {
                          showToast(err.message || (isAr ? 'فشل رفع الصورة' : 'Image upload failed'), 'error');
                        } finally {
                          setIsUploadingCatImage(false);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {catImage && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-brown-300 shrink-0 bg-cream-100">
                      <img src={catImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1.5">Description (English)</label>
                <textarea rows={2} value={catDescEn} onChange={(e) => setCatDescEn(e.target.value)} placeholder="Short description…" className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 resize-none focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-brown-700 mb-1.5">الوصف (بالعربية)</label>
                <textarea rows={2} value={catDescAr} onChange={(e) => setCatDescAr(e.target.value)} placeholder="وصف مختصر…" className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-brown-200 text-brown-900 resize-none focus:outline-none focus:border-blush-300 focus:ring-1 focus:ring-blush-300 shadow-sm" />
              </div>
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brown-200/60 mt-6">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-brown-600 hover:text-brown-900 hover:bg-brown-100 transition-colors cursor-pointer">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                  {editingCategory ? (isAr ? 'حفظ التعديلات' : 'Update Category') : (isAr ? 'إضافة التصنيف' : 'Add Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
