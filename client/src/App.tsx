import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { ScrollExperience } from './components/scroll/ScrollExperience';
import { CollectionPage } from './components/shop/CollectionPage';
import { CategoriesPage } from './components/shop/CategoriesPage';
import { StoryPage } from './components/story/StoryPage';
import { AuthPage } from './components/auth/AuthPage';
import { ContactPage } from './components/contact/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ProductModal } from './components/shop/ProductModal';
import { FeaturedProductsSection } from './components/home/FeaturedProductsSection';
import { CategoryTilesSection } from './components/home/CategoryTilesSection';
import { Marquee } from './components/home/Marquee';
import type { Product } from './types';
import { useAuth, type UserProfile } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import { useLanguage } from './context/LanguageContext';
import { IosInstallBanner } from './components/common/IosInstallBanner';
import { registerServiceWorker, isStandalone } from './services/pushNotifications';

interface BagItem {
  product: Product;
  quantity: number;
}

// Helpers for account-specific cart persistence
const getActiveUserKey = (u?: UserProfile | null): string => {
  if (u?.id) return `user_${u.id}`;
  if (u?.email) return `user_${u.email.toLowerCase().trim()}`;
  try {
    const token = localStorage.getItem('hadab_token');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.id) return `user_${payload.id}`;
        if (payload.email) return `user_${payload.email.toLowerCase().trim()}`;
      }
    }
  } catch {}
  return 'guest';
};

const getCartStorageKey = (userKey: string) => `hadab_cart_${userKey}`;

const loadCartFromStorage = (userKey: string): BagItem[] => {
  try {
    const raw = localStorage.getItem(getCartStorageKey(userKey));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) => item && item.product && typeof item.quantity === 'number' && item.quantity > 0
        );
      }
    }
  } catch (e) {
    console.error('Failed to load cart for', userKey, e);
  }
  return [];
};

const saveCartToStorage = (userKey: string, items: BagItem[]) => {
  try {
    localStorage.setItem(getCartStorageKey(userKey), JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart for', userKey, e);
  }
};

export function App() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useNotification();
  const { isArabic: isAr } = useLanguage();
  const [currentView, setCurrentView] = useState<'home' | 'collection' | 'categories' | 'story' | 'contact' | 'auth' | 'admin' | 'customer'>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [collectionCategory, setCollectionCategory] = useState<string>('all');
  
  // Initialize cart synchronously from the active user's saved cart (or guest cart)
  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    return loadCartFromStorage(getActiveUserKey());
  });

  const currentUserKey = getActiveUserKey(user);
  const prevUserKeyRef = useRef(currentUserKey);

  // When user signs in, signs out, or switches account, load their specific cart
  useEffect(() => {
    const prevKey = prevUserKeyRef.current;
    if (prevKey !== currentUserKey) {
      // If user just logged in from guest session, merge any guest cart items into user's account
      if (prevKey === 'guest' && currentUserKey !== 'guest') {
        const guestItems = loadCartFromStorage('guest');
        const userItems = loadCartFromStorage(currentUserKey);
        
        const merged = [...userItems];
        for (const gItem of guestItems) {
          const existingIdx = merged.findIndex(
            (item) =>
              item.product.id === gItem.product.id &&
              item.product.selectedColor === gItem.product.selectedColor &&
              item.product.selectedSize === gItem.product.selectedSize
          );
          if (existingIdx !== -1) {
            merged[existingIdx].quantity += gItem.quantity;
          } else {
            merged.push(gItem);
          }
        }

        setBagItems(merged);
        saveCartToStorage(currentUserKey, merged);
        localStorage.removeItem(getCartStorageKey('guest'));
      } else {
        // Switched account or logged out: load this account's saved cart
        const saved = loadCartFromStorage(currentUserKey);
        setBagItems(saved);
      }

      prevUserKeyRef.current = currentUserKey;
    }
  }, [currentUserKey]);

  // Persist cart to active user's localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(currentUserKey, bagItems);
  }, [currentUserKey, bagItems]);

  // Register PWA Service Worker on initial load
  useEffect(() => {
    registerServiceWorker();
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#about' || hash === '#story' || hash === '#our-story') {
        setCurrentView('story');
      } else if (hash === '#categories') {
        setCurrentView('categories');
      } else if (hash === '#collection' || hash === '#shop') {
        setCurrentView('collection');
      } else if (hash === '#contact' || hash === '#contact-us' || hash === '#support' || hash === '#help') {
        setCurrentView('contact');
      } else if (hash === '#signin' || hash === '#login') {
        setAuthMode('signin');
        setCurrentView('auth');
      } else if (hash === '#signup' || hash === '#register') {
        setAuthMode('signup');
        setCurrentView('auth');
      } else if (hash === '#account' || hash === '#customer' || hash === '#orders' || hash === '#profile') {
        setCurrentView('customer');
      } else if (hash === '#auth') {
        setCurrentView('auth');
      } else if (hash === '#admin' || hash === '#dashboard') {
        setCurrentView('admin');
      } else if (hash === '#store' || hash === '#shop-home') {
        setCurrentView('home');
      } else if (hash === '' || hash === '#' || hash === '#home') {
        const isSavedAdmin = localStorage.getItem('hadab_is_admin') === 'true' || document.cookie.includes('hadab_is_admin=true');
        const userExplicitlyExitedAdmin = sessionStorage.getItem('hadab_exit_admin') === 'true';
        if (isStandalone() && isSavedAdmin && !userExplicitlyExitedAdmin) {
          setCurrentView('admin');
          window.location.hash = 'admin';
        } else {
          setCurrentView('home');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAddToBag = (product: Product) => {
    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.product.selectedColor === product.selectedColor &&
          item.product.selectedSize === product.selectedSize
      );
      if (existingIndex !== -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(
      isAr
        ? `تمت إضافة "${product.name}" إلى السلة`
        : `"${product.name}" has been added to your bag`,
      'success',
      isAr ? 'أُضيف إلى السلة ✓' : 'Added to Bag ✓',
      3000
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
    if (quantity <= 0) {
      handleRemoveFromBag(productId, selectedColor, selectedSize);
      return;
    }
    setBagItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.product.selectedColor === selectedColor &&
        item.product.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveFromBag = (productId: string, selectedColor?: string, selectedSize?: string) => {
    setBagItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.product.selectedColor === selectedColor &&
            item.product.selectedSize === selectedSize
          )
      )
    );
  };

  const handleOpenCollection = (catId: string = 'all') => {
    setCollectionCategory(catId);
    setCurrentView('collection');
    window.location.hash = 'collection';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategories = (catId?: string) => {
    if (catId) {
      handleOpenCollection(catId);
      return;
    }
    setCurrentView('categories');
    window.location.hash = 'categories';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    sessionStorage.setItem('hadab_exit_admin', 'true');
    setCurrentView('home');
    window.location.hash = 'store';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStory = () => {
    setCurrentView('story');
    window.location.hash = 'story';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    setCurrentView('contact');
    window.location.hash = 'contact';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    if (user) {
      if (isAdmin) {
        handleOpenAdmin();
      } else {
        setCurrentView('customer');
        window.location.hash = 'account';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setAuthMode(mode);
    setCurrentView('auth');
    window.location.hash = mode === 'signup' ? 'signup' : 'signin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    sessionStorage.removeItem('hadab_exit_admin');
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    handleOpenCollection('all');
  };

  const totalBagCount = bagItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-cream-200 text-brown-700 font-sans selection:bg-blush-200 selection:text-brown-900">
      {/* Sticky Luxury Navbar — hidden only for admin & customer portal (they have their own headers) */}
      {currentView !== 'admin' && currentView !== 'customer' && (
        <Navbar
          cartCount={totalBagCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCollection={handleOpenCollection}
          onOpenCategories={handleOpenCategories}
          onGoHome={handleGoHome}
          onOpenStory={handleOpenStory}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={handleOpenAdmin}
          currentPage={
            currentView === 'story'
              ? 'story'
              : currentView === 'collection'
              ? 'collection'
              : currentView === 'categories'
              ? 'categories'
              : currentView === 'auth'
              ? 'auth'
              : 'home'
          }
        />
      )}

      {/* Main Experience */}
      <main className="flex-grow">
        {currentView === 'home' ? (
          <div className="flex flex-col">
            {/* Cinematic Bag Intro Hero (stops at the bag frame) */}
            <ScrollExperience
              onAddToBag={handleAddToBag}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onExploreCatalog={scrollToCatalog}
              onSelectCategory={(catId) => handleOpenCollection(catId)}
            />

            {/* Infinite Marquee Strip */}
            <Marquee />

            {/* Curated Pieces & Collections Experience */}
            <div id="shop-showcase" className="relative z-10 bg-cream-200">
              <FeaturedProductsSection
                onAddToBag={handleAddToBag}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onExploreCatalog={() => handleOpenCollection('all')}
              />
              <CategoryTilesSection
                onSelectCategory={(catId) => handleOpenCollection(catId)}
              />
            </div>
          </div>
        ) : currentView === 'collection' ? (
          /* Dedicated Full Shop / Collection Page with Search, Category Tabs, Price & Discount Filters */
          <CollectionPage
            key={collectionCategory}
            initialCategory={collectionCategory}
            onBackToHome={handleGoHome}
            onAddToBag={handleAddToBag}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        ) : currentView === 'categories' ? (
          /* Dedicated Categories Page */
          <CategoriesPage
            onBackToHome={handleGoHome}
            onSelectCategory={(catId) => handleOpenCollection(catId)}
          />
        ) : currentView === 'story' ? (
          /* Dedicated Our Story Page */
          <StoryPage
            onBackToHome={handleGoHome}
            onExploreCollection={() => handleOpenCollection('all')}
            onOpenCategories={handleOpenCategories}
          />
        ) : currentView === 'contact' ? (
          /* Dedicated Contact Us Page */
          <ContactPage
            onBackToHome={handleGoHome}
            onOpenAuth={() => {
              setAuthMode('signin');
              setCurrentView('auth');
              window.location.hash = 'signin';
            }}
            onOpenCustomerDashboard={() => {
              setCurrentView('customer');
              window.location.hash = 'account';
            }}
          />
        ) : currentView === 'admin' ? (
          /* Full-Screen Admin Dashboard */
          <AdminDashboard
            onBackToStore={handleGoHome}
          />
        ) : currentView === 'customer' ? (
          /* Customer Portal: Order history, Kuwait address, WhatsApp payment & support */
          <CustomerDashboard
            onBackToStore={handleGoHome}
            onOpenCollection={() => handleOpenCollection('all')}
            onOpenContact={handleOpenContact}
          />
        ) : (
          /* Dedicated Sign In / Sign Up Page */
          <AuthPage
            initialMode={authMode}
            onBackToHome={handleGoHome}
            onSuccess={(completedMode?: 'signin' | 'signup') => {
              const token = localStorage.getItem('hadab_token');
              let isUserAdmin = false;
              if (token) {
                try {
                  const p = JSON.parse(atob(token.split('.')[1]));
                  if (p.email?.toLowerCase() === 'byhadab@gmail.com' || p.role === 'admin') {
                    isUserAdmin = true;
                  }
                } catch {}
              }
              if (isUserAdmin || isAdmin) {
                handleOpenAdmin();
              } else if (completedMode === 'signup') {
                handleGoHome();
              } else {
                setCurrentView('customer');
                window.location.hash = 'account';
              }
            }}
            onExploreCollection={() => handleOpenCollection('all')}
          />
        )}
      </main>

      {/* Warm Brown Footer — hidden for admin & customer portals */}
      {currentView !== 'admin' && currentView !== 'customer' && (
        <Footer
          onOpenCollection={handleOpenCollection}
          onOpenCategories={handleOpenCategories}
          onOpenStory={handleOpenStory}
          onGoHome={handleGoHome}
          onOpenContact={handleOpenContact}
        />
      )}

      {/* Interactive Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={bagItems}
        onRemoveItem={handleRemoveFromBag}
        onUpdateQuantity={handleUpdateQuantity}
        onClearBag={() => setBagItems([])}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setCurrentView('auth');
        }}
      />

      {/* High-Resolution Product Inspector Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
      />

      {/* iOS Safari Add-to-Home-Screen Guidance */}
      <IosInstallBanner />
    </div>
  );
}

export default App;
