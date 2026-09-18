import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { FEATURED_PRODUCTS, SALE_PRODUCTS, CATEGORIES } from '../constants/mockData';
import type { Product, Category } from '../types';

interface ShopDataContextType {
  products: Product[];
  featuredProducts: Product[];
  saleProducts: Product[];
  categories: Category[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    try {
      const [prodsResult, catsResult] = await Promise.allSettled([
        api.getProducts(),
        api.getCategories(),
      ]);

      if (prodsResult.status === 'fulfilled' && Array.isArray(prodsResult.value) && prodsResult.value.length > 0) {
        setProducts(prodsResult.value);
      } else if (!hasFetched) {
        // Only use mockData on first load if API returned nothing
        setProducts([...FEATURED_PRODUCTS, ...SALE_PRODUCTS]);
      }

      if (catsResult.status === 'fulfilled' && Array.isArray(catsResult.value) && catsResult.value.length > 0) {
        const prods = prodsResult.status === 'fulfilled' && Array.isArray(prodsResult.value) ? prodsResult.value : [];
        setCategories(
          catsResult.value.map((c: any) => {
            const slug = c.slug || c.id || c._id;
            const matchingCount = prods.filter((p: any) => p.category === slug).length;
            return {
              id: slug,
              name: c.name,
              nameArabic: c.nameAr || c.nameArabic || c.name,
              description: c.description || '',
              descriptionArabic: c.descriptionAr || c.descriptionArabic || '',
              image: c.image || '/products/hadab-bag.jpg',
              count: matchingCount,
              color: c.color || '#D9B99B',
              accentBg: c.accentBg || 'bg-cream-100',
              accentBorder: c.accentBorder || 'border-brown-200',
            };
          })
        );
      } else if (!hasFetched) {
        setCategories(CATEGORIES);
      }

      setHasFetched(true);
    } catch (err) {
      console.error('[ShopData] Failed to fetch data:', err);
      if (!hasFetched) {
        setProducts([...FEATURED_PRODUCTS, ...SALE_PRODUCTS]);
        setCategories(CATEGORIES);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.isFeatured),
    [products]
  );

  const saleProducts = useMemo(
    () => products.filter((p) => p.isSale || (p.originalPrice && p.originalPrice > p.price)),
    [products]
  );

  return (
    <ShopDataContext.Provider
      value={{
        products,
        featuredProducts,
        saleProducts,
        categories,
        isLoading,
        refreshData: fetchData,
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};

export const useShopData = () => {
  const context = useContext(ShopDataContext);
  if (!context) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }
  return context;
};
