import { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { ScrollExperience } from './components/scroll/ScrollExperience';
import { CollectionPage } from './components/shop/CollectionPage';
import { CategoriesPage } from './components/shop/CategoriesPage';
import { StoryPage } from './components/story/StoryPage';
import { AuthPage } from './components/auth/AuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ProductModal } from './components/shop/ProductModal';
import type { Product } from './types';
import { FEATURED_PRODUCTS } from './constants/mockData';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'collection' | 'categories' | 'story' | 'auth' | 'admin' | 'customer'>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [collectionCategory, setCollectionCategory] = useState<string>('all');
  const [bagItems, setBagItems] = useState<{ product: Product; quantity: number }[]>([
    { product: FEATURED_PRODUCTS[0], quantity: 1 },
  ]);
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
      } else if (hash === '' || hash === '#' || hash === '#home') {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAddToBag = (product: Product) => {
    setBagItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromBag = (productId: string) => {
    setBagItems((prev) => prev.filter((item) => item.product.id !== productId));
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
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStory = () => {
    setCurrentView('story');
    window.location.hash = 'story';
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
          /* Cinematic 36-Frame Scroll Stage: Hero -> Brand Line -> Featured Products -> Categories */
          <ScrollExperience
            onAddToBag={handleAddToBag}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onExploreCatalog={scrollToCatalog}
            onSelectCategory={(catId) => handleOpenCollection(catId)}
          />
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
          />
        ) : (
          /* Dedicated Sign In / Sign Up Page */
          <AuthPage
            initialMode={authMode}
            onBackToHome={handleGoHome}
            onSuccess={() => {
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
        />
      )}

      {/* Interactive Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={bagItems}
        onRemoveItem={handleRemoveFromBag}
        onClearBag={() => setBagItems([])}
      />

      {/* High-Resolution Product Inspector Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
      />
    </div>
  );
}

export default App;
