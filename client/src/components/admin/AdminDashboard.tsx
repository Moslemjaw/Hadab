import React, { useState, useMemo } from 'react';
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
  Star,
} from 'lucide-react';
import { FEATURED_PRODUCTS } from '../../constants/mockData';
import type { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { tactileAudio } from '../../utils/audio';

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
  status: 'pending' | 'hooking' | 'finishing' | 'shipped' | 'delivered';
  statusArabic: string;
  artisan: string;
  createdAt: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    orderNumber: 'HDB-2026-089',
    customerName: 'Layla Al-Sabah',
    customerEmail: 'layla.s@example.kw',
    customerPhone: '+965 9912 3456',
    destination: 'Kuwait',
    destinationArabic: 'الكويت',
    items: [{ product: FEATURED_PRODUCTS[0], quantity: 1 }],
    total: 135,
    status: 'hooking',
    statusArabic: 'قيد الحياكة اليدوية',
    artisan: 'Noor (Amman Atelier)',
    createdAt: 'Today, 11:20 AM',
  },
  {
    id: 'ord-102',
    orderNumber: 'HDB-2026-088',
    customerName: 'Tariq Al-Majali',
    customerEmail: 'tariq.m@example.jo',
    customerPhone: '+962 7 9876 5432',
    destination: 'Jordan',
    destinationArabic: 'الأردن',
    items: [{ product: FEATURED_PRODUCTS[1], quantity: 1 }, { product: FEATURED_PRODUCTS[3], quantity: 1 }],
    total: 310,
    status: 'finishing',
    statusArabic: 'تشطيب الأطراف والأرشيف',
    artisan: 'Rania (Kuwait Studio)',
    createdAt: 'Yesterday, 4:15 PM',
  },
  {
    id: 'ord-103',
    orderNumber: 'HDB-2026-087',
    customerName: 'Mona Al-Ghanim',
    customerEmail: 'mona.g@example.kw',
    customerPhone: '+965 5543 2109',
    destination: 'Kuwait',
    destinationArabic: 'الكويت',
    items: [{ product: FEATURED_PRODUCTS[2], quantity: 1 }],
    total: 68,
    status: 'shipped',
    statusArabic: 'تم الشحن مع الشحن السريع',
    artisan: 'Noor (Amman Atelier)',
    createdAt: 'Sep 13, 2026',
  },
  {
    id: 'ord-104',
    orderNumber: 'HDB-2026-086',
    customerName: 'Zeinab Farhan',
    customerEmail: 'zeinab.f@example.ae',
    customerPhone: '+971 50 123 4567',
    destination: 'UAE',
    destinationArabic: 'الإمارات',
    items: [{ product: FEATURED_PRODUCTS[0], quantity: 2 }],
    total: 270,
    status: 'delivered',
    statusArabic: 'تم التسليم بنجاح',
    artisan: 'Hala (Amman Atelier)',
    createdAt: 'Sep 11, 2026',
  },
];

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
  rating: number;
}

const MOCK_CUSTOMERS: CustomerRecord[] = [
  { id: 'c1', name: 'Layla Al-Sabah', email: 'layla.s@example.kw', phone: '+965 9912 3456', country: 'Kuwait', totalOrders: 4, totalSpent: 580, lastOrderDate: 'Today', status: 'vip', rating: 5 },
  { id: 'c2', name: 'Tariq Al-Majali', email: 'tariq.m@example.jo', phone: '+962 7 9876 5432', country: 'Jordan', totalOrders: 2, totalSpent: 310, lastOrderDate: 'Yesterday', status: 'active', rating: 5 },
  { id: 'c3', name: 'Mona Al-Ghanim', email: 'mona.g@example.kw', phone: '+965 5543 2109', country: 'Kuwait', totalOrders: 1, totalSpent: 68, lastOrderDate: 'Sep 13', status: 'new', rating: 4 },
  { id: 'c4', name: 'Zeinab Farhan', email: 'zeinab.f@example.ae', phone: '+971 50 123 4567', country: 'UAE', totalOrders: 3, totalSpent: 490, lastOrderDate: 'Sep 11', status: 'vip', rating: 5 },
  { id: 'c5', name: 'Sara Al-Rashidi', email: 'sara.r@example.kw', phone: '+965 6612 9981', country: 'Kuwait', totalOrders: 1, totalSpent: 135, lastOrderDate: 'Sep 9', status: 'new', rating: 5 },
  { id: 'c6', name: 'Hana Al-Zoubi', email: 'hana.z@example.jo', phone: '+962 7 1234 5678', country: 'Jordan', totalOrders: 2, totalSpent: 240, lastOrderDate: 'Sep 7', status: 'active', rating: 4 },
];

interface CategoryRecord {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  pieceCount: number;
  description: string;
  descriptionAr: string;
  color: string;
}

const MOCK_CATEGORIES: CategoryRecord[] = [
  { id: 'cat-1', name: 'Bags & Totes', nameAr: 'الحقائب والشنط', slug: 'bags', pieceCount: 0, description: 'Hand-hooked totes, shoulder bags, and market baskets from 100% natural cotton cord.', descriptionAr: 'حقائب محبوكة يدوياً من خيوط القطن الطبيعي', color: '#D9B99B' },
  { id: 'cat-2', name: 'Wearables', nameAr: 'الملابس', slug: 'clothing', pieceCount: 0, description: 'Crochet vests, tops and wraps made to order in Amman & Kuwait ateliers.', descriptionAr: 'سترات وملابس كروشيه مصنوعة بالطلب', color: '#A3B99B' },
  { id: 'cat-3', name: 'Hats & Headwear', nameAr: 'القبعات والأغطية', slug: 'headwear', pieceCount: 0, description: 'Sun hats, bucket styles, and brimmed silhouettes woven from natural yarn.', descriptionAr: 'قبعات يدوية من الخيوط الطبيعية', color: '#C9B99B' },
  { id: 'cat-4', name: 'Accessories', nameAr: 'الإكسسوارات', slug: 'pouches', pieceCount: 0, description: 'Pouches, coin purses, keychains and micro-accessories.', descriptionAr: 'حقائب صغيرة، محافظ ومفاتيح حرفية', color: '#B9C9CB' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'artisans' | 'settings' | 'categories' | 'customers'>('overview');
  const [productsList, setProductsList] = useState<Product[]>(FEATURED_PRODUCTS);
  const [ordersList, setOrdersList] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'vip' | 'active' | 'new'>('all');
  const [categoryList, setCategoryList] = useState<CategoryRecord[]>(() =>
    MOCK_CATEGORIES.map((cat) => ({
      ...cat,
      pieceCount: FEATURED_PRODUCTS.filter((p) => p.category === cat.slug).length,
    }))
  );
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameAr, setCatNameAr] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catDescAr, setCatDescAr] = useState('');


  // Modal State for adding/editing product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductNameAr, setNewProductNameAr] = useState('');
  const [newProductPrice, setNewProductPrice] = useState<number>(120);
  const [newProductCategory, setNewProductCategory] = useState<'bags' | 'clothing' | 'accessories' | 'headwear' | 'pouches'>('bags');
  const [newProductTag, setNewProductTag] = useState('New Drop');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameArabic && p.nameArabic.includes(searchQuery));
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [productsList, searchQuery, selectedCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ordersList, searchQuery, statusFilter]);

  // KPIs
  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = ordersList.filter((o) => o.status !== 'delivered').length;
  const inCraftCount = ordersList.filter((o) => o.status === 'hooking' || o.status === 'finishing').length;

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderItem['status']) => {
    tactileAudio.playScrubTick(340);
    setOrdersList((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const statusLabels: Record<OrderItem['status'], string> = {
            pending: isAr ? 'قيد الانتظار' : 'Pending',
            hooking: isAr ? 'قيد الحياكة اليدوية' : 'Hooking in Progress',
            finishing: isAr ? 'تشطيب الأطراف والأرشيف' : 'Finishing & Wrapping',
            shipped: isAr ? 'تم الشحن' : 'Dispatched',
            delivered: isAr ? 'تم التسليم' : 'Delivered',
          };
          return { ...o, status: nextStatus, statusArabic: statusLabels[nextStatus] };
        }
        return o;
      })
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(isAr ? 'هل أنتِ متأكدة من حذف هذه القطعة من المتجر؟' : 'Are you sure you want to remove this piece?')) {
      tactileAudio.playScrubTick(300);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    tactileAudio.playChime();

    if (editingProduct) {
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: newProductName,
                nameArabic: newProductNameAr || newProductName,
                price: Number(newProductPrice),
                category: newProductCategory,
                tag: newProductTag,
              }
            : p
        )
      );
    } else {
      const newEntry: Product = {
        id: `custom-${Date.now()}`,
        name: newProductName,
        nameArabic: newProductNameAr || newProductName,
        price: Number(newProductPrice),
        category: newProductCategory,
        image: '/products/hadab-bag.jpg',
        textureImage: '/products/hadab-bag.jpg',
        tag: newProductTag,
        description: 'Bespoke hand-hooked piece crafted with unbleached cotton ribbon.',
        descriptionArabic: 'قطعة حرفية محبوكة يدوياً من خيوط القطن الطبيعي غير المعالج.',
        stitchDetail: 'Single-crochet ribbing with reinforced base tension.',
        yarnType: '100% Cotton Ribbon',
        colorName: 'Desert Oat',
        colorHex: '#D6C7B2',
      };
      setProductsList((prev) => [newEntry, ...prev]);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setNewProductName('');
    setNewProductNameAr('');
    setNewProductPrice(120);
    setNewProductCategory('bags');
    setNewProductTag('Atelier New');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductNameAr(product.nameArabic || '');
    setNewProductPrice(product.price);
    setNewProductCategory(product.category);
    setNewProductTag(product.tag || 'Classic');
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB] text-[#2E221B] font-sans selection:bg-blush-200 selection:text-brown-900 flex flex-col md:flex-row">
      {/* =========================================================================
          1. SIDEBAR NAVIGATION
      ========================================================================== */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#261C16] text-[#EFE4D6] p-5 flex flex-col justify-between shrink-0 border-e border-[#3D2D25] shadow-xl z-20">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#3D2D25]/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFE4D6] p-1.5 flex items-center justify-center shadow-md">
                <img src="/frames/ezgif-frame-001.jpg" alt="HADAB" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div>
                <span className="font-serif tracking-widest text-lg font-bold block text-[#FAF6F0]">HADAB</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-blush-200 block">Atelier Studio Admin</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: isAr ? 'لوحة المؤشرات' : 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'products', label: isAr ? 'كتالوج المنتجات' : 'Pieces Catalog', icon: Package, count: productsList.length },
              { id: 'orders', label: isAr ? 'طلبات الحياكة' : 'Bespoke Orders', icon: ShoppingBag, count: activeOrdersCount },
              { id: 'categories', label: isAr ? 'التصنيفات' : 'Categories', icon: Tag, count: categoryList.length },
              { id: 'customers', label: isAr ? 'العملاء' : 'Customers', icon: Users, count: MOCK_CUSTOMERS.length },
              { id: 'artisans', label: isAr ? 'المشاغل والحرفيون' : 'Atelier Workshops', icon: Scissors },
              { id: 'settings', label: isAr ? 'إعدادات المتجر' : 'Store Settings', icon: Settings },
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
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs uppercase tracking-[0.14em] font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#3D2D25] text-white shadow-sm border border-brown-700/60 font-semibold'
                      : 'text-[#C9B9A9] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-blush-200' : 'text-[#A08E80]'} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-blush-300/20 text-blush-200' : 'bg-white/10 text-[#C9B9A9]'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
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
            onClick={onBackToStore}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-[0.15em] font-semibold text-blush-200 hover:bg-blush-300/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className={isAr ? 'rotate-180' : ''} />
            <span>{isAr ? 'العودة للمتجر الرئيسي' : 'Return to Store'}</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN ADMIN CONTENT WORKSPACE
      ========================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-brown-200/60 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-brown-950 font-normal">
              {activeTab === 'overview' && (isAr ? 'نظرة عامة على المشغل' : 'Atelier Overview & Performance')}
              {activeTab === 'products' && (isAr ? 'إدارة كتالوج القطع اليدوية' : 'Handcrafted Pieces Catalog')}
              {activeTab === 'orders' && (isAr ? 'متابعة الطلبات المخصصة' : 'Custom Orders & Stitch Progress')}
              {activeTab === 'artisans' && (isAr ? 'شبكة المشاغل (عمّان والكويت)' : 'Artisans & Workshops Network')}
              {activeTab === 'settings' && (isAr ? 'إعدادات المتجر' : 'Store & Atelier Preferences')}
              {activeTab === 'categories' && (isAr ? 'إدارة التصنيفات' : 'Product Categories')}
              {activeTab === 'customers' && (isAr ? 'قاعدة العملاء' : 'Customer Directory')}
            </h1>
            <p className="text-xs text-brown-500 font-light mt-0.5">
              {isAr ? 'متابعة حية للإنتاج البطيء، المبيعات والشحن المباشر' : 'Live tracking for deliberate slow-craft batches and delivery'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {activeTab === 'products' && (
              <button
                type="button"
                onClick={openNewProductModal}
                className="px-4 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>{isAr ? 'إضافة قطعة جديدة' : 'New Piece'}</span>
              </button>
            )}
            {activeTab === 'categories' && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCatNameEn(''); setCatNameAr(''); setCatDescEn(''); setCatDescAr('');
                  setIsCatModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>{isAr ? 'إضافة تصنيف' : 'New Category'}</span>
              </button>
            )}

            <div className="w-9 h-9 rounded-full bg-cream-200 border border-brown-300 flex items-center justify-center font-serif text-xs font-bold text-brown-900">
              HJ
            </div>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* =====================================================================
              TAB 1: OVERVIEW DASHBOARD
          ====================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-brown-500 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
                    <div className="p-2 rounded-xl bg-sage-100 text-sage-600"><DollarSign size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">${totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-sage-600 mt-2 font-medium">
                    <TrendingUp size={13} />
                    <span>+18.4% {isAr ? 'مقارنة بالشهر الماضي' : 'vs last month'}</span>
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-brown-500 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'طلبات قيد الحياكة' : 'Active In-Stitch'}</span>
                    <div className="p-2 rounded-xl bg-blush-100 text-burgundy-600"><Scissors size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">{inCraftCount}</div>
                  <div className="text-[11px] text-brown-500 mt-2 font-light">
                    {isAr ? 'محبوكة حالياً بواسطة الحرفيين' : 'Hand-hooked in Jordan & Kuwait'}
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-brown-500 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'القطع المتاحة في الأرشيف' : 'Archived Pieces'}</span>
                    <div className="p-2 rounded-xl bg-cream-200 text-brown-700"><Package size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">{productsList.length}</div>
                  <div className="text-[11px] text-brown-500 mt-2 font-light">
                    {isAr ? 'عبر ٤ تصنيفات رئيسية' : 'Across 4 signature families'}
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-brown-200/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-brown-500 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">{isAr ? 'معدل رضا المشترين' : 'Artisan Rating'}</span>
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700"><Sparkles size={16} /></div>
                  </div>
                  <div className="font-serif text-3xl font-medium text-brown-900">4.98 / 5.0</div>
                  <div className="text-[11px] text-brown-500 mt-2 font-light">
                    {isAr ? 'بناءً على طلبات التسليم المؤكدة' : '100% verified slow craft reviews'}
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview Table */}
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-serif text-lg text-brown-900 font-medium">
                      {isAr ? 'أحدث طلبات المشغل الحرفية' : 'Recent Bespoke Orders'}
                    </h3>
                    <p className="text-xs text-brown-500 font-light mt-0.5">
                      {isAr ? 'متابعة حالة النسيج، التغليف الأرشيفي والشحن' : 'Track hooking stage, wrapping, and international dispatch'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-burgundy-600 hover:text-burgundy-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'عرض الكل' : 'View All Orders'}</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-brown-200/60 text-brown-500 text-[10.5px] uppercase tracking-[0.16em]">
                        <th className="pb-3 font-semibold">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                        <th className="pb-3 font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                        <th className="pb-3 font-semibold">{isAr ? 'الوجهة' : 'Destination'}</th>
                        <th className="pb-3 font-semibold">{isAr ? 'الحالة' : 'Craft Status'}</th>
                        <th className="pb-3 font-semibold text-end">{isAr ? 'المجموع' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-200/40">
                      {ordersList.slice(0, 4).map((order) => (
                        <tr key={order.id} className="hover:bg-cream-100/50 transition-colors">
                          <td className="py-3.5 font-mono text-brown-900 font-medium">{order.orderNumber}</td>
                          <td className="py-3.5">
                            <span className="font-medium text-brown-900 block">{order.customerName}</span>
                            <span className="text-[11px] text-brown-500 font-light">{order.customerEmail}</span>
                          </td>
                          <td className="py-3.5 text-brown-700">{isAr ? order.destinationArabic : order.destination}</td>
                          <td className="py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-medium ${
                                order.status === 'hooking'
                                  ? 'bg-blush-100 text-burgundy-700'
                                  : order.status === 'finishing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-sage-100 text-sage-800'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{isAr ? order.statusArabic : order.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 text-end font-medium text-brown-900 font-serif text-sm">
                            ${order.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 2: PRODUCTS CATALOG MANAGEMENT
          ====================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF6F0] p-4 rounded-3xl border border-brown-200/60 shadow-sm">
                <div className="relative flex-1 max-w-md flex items-center">
                  <Search size={16} className={`absolute ${isAr ? 'right-3.5' : 'left-3.5'} text-brown-400`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'ابحث عن قطعة أو كود...' : 'Search pieces by title, yarn or stitch...'}
                    className={`w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-2xl bg-cream-50 border border-brown-200 text-xs focus:outline-none focus:ring-2 focus:ring-blush-300`}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {['all', 'bags', 'clothing', 'headwear', 'pouches'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        tactileAudio.playScrubTick(300);
                        setSelectedCategory(cat);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                          : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
                      }`}
                    >
                      {cat === 'all'
                        ? isAr
                          ? 'الكل'
                          : 'All'
                        : cat === 'bags'
                        ? isAr
                          ? 'الحقائب'
                          : 'Bags'
                        : cat === 'clothing'
                        ? isAr
                          ? 'الملابس'
                          : 'Wearables'
                        : cat === 'headwear'
                        ? isAr
                          ? 'القبعات'
                          : 'Hats'
                        : isAr
                        ? 'إكسسوارات'
                        : 'Accessories'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-4 flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div>
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-200 mb-3.5 border border-brown-200/40">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {p.tag && (
                          <span className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-full bg-[#2E221B]/85 text-cream-100 text-[9.5px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                            {isAr ? p.tagArabic || p.tag : p.tag}
                          </span>
                        )}
                        <span className="absolute bottom-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/90 text-brown-900 text-[10px] font-mono shadow-sm">
                          {p.category}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-serif text-base text-brown-950 font-normal leading-snug">
                          {isAr ? p.nameArabic || p.name : p.name}
                        </h4>
                        <span className="font-serif text-base font-semibold text-brown-900 whitespace-nowrap">${p.price}</span>
                      </div>

                      <p className="text-[11px] text-brown-500 font-light line-clamp-2 leading-relaxed mb-3">
                        {isAr ? p.descriptionArabic || p.description : p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brown-200/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-brown-500">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.colorHex || '#D6C7B2' }} />
                        <span>{isAr ? p.colorNameArabic || p.colorName : p.colorName}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 rounded-xl hover:bg-cream-200 text-brown-700 hover:text-brown-950 transition-colors cursor-pointer"
                          title="Edit Piece"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-xl hover:bg-burgundy-50 text-brown-400 hover:text-burgundy-600 transition-colors cursor-pointer"
                          title="Delete Piece"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 3: ORDERS TRACKING & ARTISAN PROGRESS
          ====================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['all', 'hooking', 'finishing', 'shipped', 'delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      tactileAudio.playScrubTick(300);
                      setStatusFilter(st);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.14em] transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                        : 'bg-[#FAF6F0] text-brown-600 border border-brown-200/60 hover:bg-cream-200'
                    }`}
                  >
                    {st === 'all'
                      ? isAr
                        ? 'جميع الطلبات'
                        : 'All Orders'
                      : st === 'hooking'
                      ? isAr
                        ? 'قيد الحياكة'
                        : 'Hooking'
                      : st === 'finishing'
                      ? isAr
                        ? 'التشطيب والأرشيف'
                        : 'Finishing'
                      : st === 'shipped'
                      ? isAr
                        ? 'تم الشحن'
                        : 'Dispatched'
                      : isAr
                      ? 'تم التسليم'
                      : 'Delivered'}
                  </button>
                ))}
              </div>

              {/* Orders List Cards */}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brown-200/60">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-brown-900">{order.orderNumber}</span>
                          <span className="text-[10px] text-brown-400 font-light">{order.createdAt}</span>
                        </div>
                        <div className="text-xs text-brown-600 font-light mt-1">
                          <span className="font-semibold text-brown-900">{order.customerName}</span> • {order.customerEmail} • {order.customerPhone}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-brown-500 font-light">
                          {isAr ? 'المشغل المكلف:' : 'Assigned Atelier:'} <strong className="font-medium text-brown-900">{order.artisan}</strong>
                        </span>
                        <div className="font-serif text-lg font-semibold text-brown-900 ms-3">${order.total}</div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Items */}
                      <div className="flex items-center gap-3 overflow-x-auto">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-cream-100/70 px-3 py-1.5 rounded-2xl border border-brown-200/50">
                            <img src={it.product.image} alt={it.product.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="text-xs">
                              <span className="font-medium text-brown-900 block truncate max-w-[150px]">{isAr ? it.product.nameArabic || it.product.name : it.product.name}</span>
                              <span className="text-[10px] text-brown-500">Qty: {it.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status changer buttons */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brown-500 font-light me-1">{isAr ? 'تحديث المرحلة:' : 'Advance Stage:'}</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className="px-3 py-1.5 rounded-xl bg-cream-50 border border-brown-300 text-xs font-medium text-brown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 cursor-pointer"
                        >
                          <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                          <option value="hooking">{isAr ? 'قيد الحياكة' : 'Hooking'}</option>
                          <option value="finishing">{isAr ? 'التشطيب والتغليف' : 'Finishing & Wrapping'}</option>
                          <option value="shipped">{isAr ? 'تم الشحن' : 'Dispatched'}</option>
                          <option value="delivered">{isAr ? 'تم التسليم' : 'Delivered'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 4: ARTISANS & WORKSHOPS
          ====================================================================== */}
          {activeTab === 'artisans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blush-100 flex items-center justify-center font-serif text-lg font-bold text-burgundy-700">JO</div>
                    <div>
                      <h3 className="font-serif text-lg text-brown-900 font-medium">{isAr ? 'مشغل عمّان الحرفي' : 'Amman Atelier Hub'}</h3>
                      <p className="text-xs text-brown-500 font-light">Amman, Jordan • 6 Master Hookers</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sage-100 text-sage-800 text-[10px] font-semibold uppercase tracking-wider">Active</span>
                </div>
                <p className="text-xs text-brown-600 font-light leading-relaxed">
                  {isAr
                    ? 'متخصص في حياكة حبال القطن الصافي غير المعالج، صباغة الخيوط النباتية، وحياكة حقائب الكتف الصلبة.'
                    : 'Specialized in raw unbleached braided cotton cords, plant-dying vats, and signature tote structures.'}
                </p>
                <div className="pt-2 border-t border-brown-200/50 flex items-center justify-between text-xs text-brown-500">
                  <span>Current Queue: <strong>7 pieces</strong></span>
                  <span>Lead Time: <strong>4-6 days</strong></span>
                </div>
              </div>

              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center font-serif text-lg font-bold text-sage-800">KW</div>
                    <div>
                      <h3 className="font-serif text-lg text-brown-900 font-medium">{isAr ? 'أتيليه الكويت للتصميم' : 'Kuwait Design Studio'}</h3>
                      <p className="text-xs text-brown-500 font-light">Kuwait City, Kuwait • 4 Master Artisans</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sage-100 text-sage-800 text-[10px] font-semibold uppercase tracking-wider">Active</span>
                </div>
                <p className="text-xs text-brown-600 font-light leading-relaxed">
                  {isAr
                    ? 'مركز التصميم والهياكل المعاصرة، وإكسسوارات الكروشيه المحدودة، والتغليف الأرشيفي الفاخر.'
                    : 'Center for contemporary silhouette prototyping, micro-accessories, and bespoke VIP archival boxing.'}
                </p>
                <div className="pt-2 border-t border-brown-200/50 flex items-center justify-between text-xs text-brown-500">
                  <span>Current Queue: <strong>5 pieces</strong></span>
                  <span>Lead Time: <strong>3-5 days</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 5: STORE SETTINGS
          ====================================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-6 max-w-2xl space-y-6">
              <div>
                <h3 className="font-serif text-lg text-brown-900 font-medium">{isAr ? 'إعدادات المشغل والمتجر' : 'Atelier Configuration'}</h3>
                <p className="text-xs text-brown-500 font-light mt-0.5">Control pricing currency, shipping rules, and studio archive drop alerts.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-brown-700 font-semibold mb-1 uppercase tracking-wider text-[10.5px]">Default Currency</label>
                  <select className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900">
                    <option value="USD">USD ($) - International</option>
                    <option value="KWD">KWD (د.ك) - Kuwait Dinar</option>
                    <option value="JOD">JOD (د.أ) - Jordan Dinar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brown-700 font-semibold mb-1 uppercase tracking-wider text-[10.5px]">Complimentary Shipping Threshold ($)</label>
                  <input type="number" defaultValue={200} className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900" />
                </div>

                <div>
                  <label className="block text-brown-700 font-semibold mb-1 uppercase tracking-wider text-[10.5px]">Atelier Inquiries Email</label>
                  <input type="email" defaultValue="atelier@hadab.craft" className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900" />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      tactileAudio.playChime();
                      alert(isAr ? 'تم حفظ إعدادات المشغل بنجاح' : 'Settings saved successfully');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#2E221B] text-cream-100 text-xs font-semibold uppercase tracking-[0.15em] shadow-sm hover:bg-[#3D2D25] cursor-pointer"
                  >
                    {isAr ? 'حفظ التغييرات' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 6: CATEGORIES MANAGEMENT
          ====================================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Category Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {categoryList.map((cat) => (
                  <div key={cat.id} className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: cat.color + '40' }}>
                          <Tag size={18} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <h3 className="font-serif text-base text-brown-950 font-medium leading-snug">
                            {isAr ? cat.nameAr : cat.name}
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brown-400">/{cat.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setCatNameEn(cat.name);
                            setCatNameAr(cat.nameAr);
                            setCatDescEn(cat.description);
                            setCatDescAr(cat.descriptionAr);
                            setIsCatModalOpen(true);
                          }}
                          className="p-1.5 rounded-xl hover:bg-cream-200 text-brown-600 hover:text-brown-950 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(isAr ? 'هل تريد حذف هذا التصنيف؟' : 'Remove this category?')) {
                              tactileAudio.playScrubTick(300);
                              setCategoryList((prev) => prev.filter((c) => c.id !== cat.id));
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-burgundy-50 text-brown-300 hover:text-burgundy-600 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-brown-500 font-light leading-relaxed">
                      {isAr ? cat.descriptionAr : cat.description}
                    </p>

                    <div className="pt-3 border-t border-brown-200/50 flex items-center justify-between">
                      <span className="text-xs text-brown-500 font-light">
                        {isAr ? 'عدد القطع:' : 'Pieces:'}{' '}
                        <strong className="text-brown-900 font-semibold">{cat.pieceCount}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory(cat.slug); setActiveTab('products'); }}
                        className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{isAr ? 'عرض القطع' : 'View Pieces'}</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 7: CUSTOMER DIRECTORY
          ====================================================================== */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: isAr ? 'إجمالي العملاء' : 'Total Customers', value: MOCK_CUSTOMERS.length, color: 'bg-cream-200 text-brown-700' },
                  { label: isAr ? 'عملاء VIP' : 'VIP Members', value: MOCK_CUSTOMERS.filter(c => c.status === 'vip').length, color: 'bg-blush-100 text-burgundy-700' },
                  { label: isAr ? 'عملاء جدد' : 'New Customers', value: MOCK_CUSTOMERS.filter(c => c.status === 'new').length, color: 'bg-sage-100 text-sage-800' },
                  { label: isAr ? 'متوسط الإنفاق' : 'Avg. Spend', value: `$${Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / MOCK_CUSTOMERS.length)}`, color: 'bg-amber-100 text-amber-800' },
                ].map((kpi, i) => (
                  <div key={i} className={`${kpi.color} rounded-3xl p-4 border border-brown-200/40`}>
                    <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold opacity-70 mb-1">{kpi.label}</div>
                    <div className="font-serif text-2xl font-medium">{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Search + Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#FAF6F0] p-4 rounded-3xl border border-brown-200/60 shadow-sm">
                <div className="relative flex-1 max-w-sm flex items-center">
                  <Search size={15} className={`absolute ${isAr ? 'right-3.5' : 'left-3.5'} text-brown-400`} />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder={isAr ? 'ابحث عن عميل...' : 'Search by name or email...'}
                    className={`w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-2xl bg-cream-50 border border-brown-200 text-xs focus:outline-none focus:ring-2 focus:ring-blush-300`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {(['all', 'vip', 'active', 'new'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setCustomerFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        customerFilter === f
                          ? 'bg-[#2E221B] text-cream-100 shadow-sm'
                          : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
                      }`}
                    >
                      {f === 'all' ? (isAr ? 'الكل' : 'All') : f === 'vip' ? 'VIP' : f === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'جديد' : 'New')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-[#FAF6F0] rounded-3xl border border-brown-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-brown-200/60 bg-cream-100/50 text-brown-500 text-[10.5px] uppercase tracking-[0.14em]">
                        <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                        <th className="px-5 py-3.5 text-start font-semibold hidden md:table-cell">{isAr ? 'التواصل' : 'Contact'}</th>
                        <th className="px-5 py-3.5 text-start font-semibold hidden sm:table-cell">{isAr ? 'الدولة' : 'Country'}</th>
                        <th className="px-5 py-3.5 text-center font-semibold">{isAr ? 'الطلبات' : 'Orders'}</th>
                        <th className="px-5 py-3.5 text-end font-semibold">{isAr ? 'الإنفاق الكلي' : 'Total Spent'}</th>
                        <th className="px-5 py-3.5 text-center font-semibold">{isAr ? 'التقييم' : 'Rating'}</th>
                        <th className="px-5 py-3.5 text-center font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-200/40">
                      {MOCK_CUSTOMERS
                        .filter(c => {
                          const matchSearch = c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase());
                          const matchFilter = customerFilter === 'all' || c.status === customerFilter;
                          return matchSearch && matchFilter;
                        })
                        .map((customer) => (
                          <tr key={customer.id} className="hover:bg-cream-100/60 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#EDE4D8] flex items-center justify-center font-serif text-xs font-bold text-brown-700 shrink-0">
                                  {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-medium text-brown-900">{customer.name}</div>
                                  <div className="text-[10px] text-brown-400 font-light">{customer.lastOrderDate}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 text-brown-600"><Mail size={11} />{customer.email}</div>
                                <div className="flex items-center gap-1.5 text-brown-400"><Phone size={11} />{customer.phone}</div>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5 text-brown-600"><MapPin size={11} />{customer.country}</div>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="font-semibold text-brown-900">{customer.totalOrders}</span>
                            </td>
                            <td className="px-5 py-4 text-end font-serif font-semibold text-brown-900 text-sm">${customer.totalSpent}</td>
                            <td className="px-5 py-4 text-center">
                              <div className="flex items-center justify-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={11} className={i < customer.rating ? 'text-amber-400 fill-amber-400' : 'text-brown-200'} />
                                ))}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                customer.status === 'vip'
                                  ? 'bg-amber-100 text-amber-800'
                                  : customer.status === 'active'
                                  ? 'bg-sage-100 text-sage-800'
                                  : 'bg-blue-50 text-blue-700'
                              }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {customer.status === 'vip' ? 'VIP' : customer.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'جديد' : 'New')}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          PRODUCT ADD / EDIT MODAL
      ========================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF6F0] rounded-[32px] border border-brown-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full">
            <h3 className="font-serif text-xl text-brown-950 font-normal mb-1">
              {editingProduct ? (isAr ? 'تعديل بيانات القطعة' : 'Edit Atelier Piece') : (isAr ? 'إضافة قطعة يدوية جديدة' : 'Add New Handcrafted Piece')}
            </h3>
            <p className="text-xs text-brown-500 font-light mb-6">
              {isAr ? 'أدخلي تفاصيل القطعة الحرفية، السعر والتصنيف لإضافتها في المتجر' : 'Enter craft details, price, and category to update the storefront'}
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. The Corded Tassel Pouch"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900"
                />
              </div>

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">الاسم (بالعربية)</label>
                <input
                  type="text"
                  value={newProductNameAr}
                  onChange={(e) => setNewProductNameAr(e.target.value)}
                  placeholder="مثال: حقيبة الشرّابات المنسوجة"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">Category *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900 cursor-pointer"
                  >
                    <option value="bags">Bags & Totes</option>
                    <option value="clothing">Wearables</option>
                    <option value="headwear">Hats & Headwear</option>
                    <option value="pouches">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">Archive Badge Tag</label>
                <input
                  type="text"
                  value={newProductTag}
                  onChange={(e) => setNewProductTag(e.target.value)}
                  placeholder="e.g. Signature Piece / New Drop"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs text-brown-600 hover:text-brown-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm cursor-pointer"
                >
                  {editingProduct ? 'Update Piece' : 'Add to Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm">
          <div className="bg-[#FAF6F0] rounded-[32px] border border-brown-200 shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="font-serif text-xl text-brown-950 font-normal mb-1">
              {editingCategory ? (isAr ? 'تعديل التصنيف' : 'Edit Category') : (isAr ? 'إضافة تصنيف جديد' : 'Add New Category')}
            </h3>
            <p className="text-xs text-brown-500 font-light mb-6">
              {isAr ? 'ادخل اسم التصنيف والوصف' : 'Enter the category name and description'}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                tactileAudio.playChime();
                if (editingCategory) {
                  setCategoryList((prev) =>
                    prev.map((c) =>
                      c.id === editingCategory.id
                        ? { ...c, name: catNameEn, nameAr: catNameAr, description: catDescEn, descriptionAr: catDescAr }
                        : c
                    )
                  );
                } else {
                  const slug = catNameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  setCategoryList((prev) => [
                    ...prev,
                    { id: `cat-${Date.now()}`, name: catNameEn, nameAr: catNameAr, slug, pieceCount: 0, description: catDescEn, descriptionAr: catDescAr, color: '#C9B99B' },
                  ]);
                }
                setIsCatModalOpen(false);
                setEditingCategory(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">Name (English) *</label>
                <input type="text" required value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} placeholder="e.g. Bags & Totes" className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900" />
              </div>
              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">الاسم (بالعربية)</label>
                <input type="text" value={catNameAr} onChange={(e) => setCatNameAr(e.target.value)} placeholder="مثال: الحقائب والشنط" className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900" />
              </div>
              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">Description (English)</label>
                <textarea rows={2} value={catDescEn} onChange={(e) => setCatDescEn(e.target.value)} placeholder="Short description…" className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900 resize-none" />
              </div>
              <div>
                <label className="block text-[10.5px] uppercase tracking-wider font-semibold text-brown-700 mb-1">الوصف (بالعربية)</label>
                <textarea rows={2} value={catDescAr} onChange={(e) => setCatDescAr(e.target.value)} placeholder="وصف مختصر…" className="w-full py-2.5 px-3.5 rounded-xl bg-cream-50 border border-brown-200 text-brown-900 resize-none" />
              </div>
              <div className="pt-3 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2.5 rounded-full text-xs text-brown-600 hover:text-brown-900 cursor-pointer">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-full bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm cursor-pointer">
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
