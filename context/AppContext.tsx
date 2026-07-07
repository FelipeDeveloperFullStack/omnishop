// context/AppContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useFavorites } from '@/hooks/useFavorites';
import { Product, Category } from '@/types';

interface AppContextValue {
  // Products
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  loading: boolean;
  refreshing: boolean;
  error: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
  onRefresh: () => Promise<void>;
  retry: () => Promise<void>;
  // Favorites
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const productsState = useProducts();
  const favoritesState = useFavorites();

  return (
    <AppContext.Provider value={{ ...productsState, ...favoritesState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside <AppProvider>');
  }
  return ctx;
}
