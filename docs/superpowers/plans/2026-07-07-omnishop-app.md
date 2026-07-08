# OmniShop App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o app OmniShop — loja de produtos com React Native + Expo, consumindo fakestoreapi.com, com busca local, filtro por categoria, detalhes do produto, e favoritos persistidos em AsyncStorage, fiel ao design system Lumina Commerce.

**Architecture:** Expo Router para navegação file-based (2 tabs: Home + Favoritos), com um AppContext compartilhando estado de produtos e favoritos entre todas as telas. Hooks customizados (`useProducts`, `useFavorites`) encapsulam a lógica de negócio; componentes são puros e recebem tudo por props.

**Tech Stack:** React Native 0.81.5, Expo SDK 54, Expo Router 6, TypeScript, Axios, @react-native-async-storage/async-storage, @expo-google-fonts/inter, expo-image, react-native-reanimated, @expo/vector-icons (Ionicons)

---

## Mapa de Arquivos

### Criar
- `types/index.ts` — interfaces Product, Category, ProductRating
- `constants/colors.ts` — tokens de cor do design system
- `constants/typography.ts` — estilos de texto + constantes de espaçamento
- `services/api.ts` — Axios instance + funções getProducts, getProduct, getCategories
- `hooks/useProducts.ts` — estado de produtos, categorias, loading, error, filtros
- `hooks/useFavorites.ts` — CRUD de favoritos + AsyncStorage
- `context/AppContext.tsx` — Context único que expõe produtos + favoritos para todas as telas
- `components/RatingBadge.tsx` — estrela + nota + contagem
- `components/SkeletonCard.tsx` — placeholder animado (pulse) para loading
- `components/LoadingSpinner.tsx` — ActivityIndicator centralizado com card
- `components/ErrorState.tsx` — ícone de erro + mensagem + botão retry
- `components/EmptyState.tsx` — coração quebrado + texto + botão explorar
- `components/SearchBar.tsx` — TextInput com ícone de busca
- `components/CategoryChips.tsx` — ScrollView horizontal de chips
- `components/ProductCard.tsx` — card de produto com coração de favorito
- `app/product/[id].tsx` — tela de detalhes do produto
- `app/(tabs)/favorites.tsx` — tela de favoritos

### Modificar
- `app/_layout.tsx` — carregar fontes Inter, registrar rota product/[id], envolver com AppProvider
- `app/(tabs)/_layout.tsx` — 2 tabs (Home + Favoritos) com design system
- `app/(tabs)/index.tsx` — tela principal com lista, busca e filtros

### Deletar (boilerplate)
- `app/(tabs)/explore.tsx`
- `app/modal.tsx`
- `components/hello-wave.tsx`
- `components/parallax-scroll-view.tsx`
- `components/themed-text.tsx`
- `components/themed-view.tsx`
- `components/haptic-tab.tsx`
- `components/external-link.tsx`
- `components/ui/` (pasta inteira)
- `hooks/use-color-scheme.ts`
- `hooks/use-color-scheme.web.ts`
- `hooks/use-theme-color.ts`
- `constants/theme.ts`

---

## Task 1: Instalar dependências e limpar boilerplate

**Files:**
- Modify: `package.json` (via npm install)
- Delete: arquivos de boilerplate listados acima

- [ ] **Step 1: Instalar dependências obrigatórias e de design**

```bash
cd "c:/Users/FelipeMigueldosSanto/Documents/CSP/teste_tecnico_react_native/omnishop"
npx expo install axios @react-native-async-storage/async-storage @expo-google-fonts/inter
```

Aguarde o output: `✓ Dependencies installed`

- [ ] **Step 2: Deletar arquivos de boilerplate**

```bash
cd "c:/Users/FelipeMigueldosSanto/Documents/CSP/teste_tecnico_react_native/omnishop"
rm app/(tabs)/explore.tsx app/modal.tsx
rm components/hello-wave.tsx components/parallax-scroll-view.tsx components/themed-text.tsx components/themed-view.tsx components/haptic-tab.tsx components/external-link.tsx
rm -rf components/ui
rm hooks/use-color-scheme.ts hooks/use-color-scheme.web.ts hooks/use-theme-color.ts
rm constants/theme.ts
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: instalar dependências e remover boilerplate"
```

---

## Task 2: Definição de tipos

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Criar pasta e arquivo de tipos**

```bash
mkdir -p types
```

- [ ] **Step 2: Escrever `types/index.ts`**

```typescript
// types/index.ts
export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export type Category = string;
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: nenhum erro (ou apenas erros de arquivos ainda não atualizados — serão resolvidos nas tarefas seguintes).

- [ ] **Step 4: Commit**

```bash
git add types/
git commit -m "feat: adicionar definições de tipos (Product, Category)"
```

---

## Task 3: Design System — Cores e Tipografia

**Files:**
- Create: `constants/colors.ts`
- Create: `constants/typography.ts`

- [ ] **Step 1: Escrever `constants/colors.ts`**

```typescript
// constants/colors.ts
export const Colors = {
  primary: '#0058be',
  onPrimary: '#ffffff',
  primaryContainer: '#2170e4',
  onPrimaryContainer: '#fefcff',
  primaryFixedDim: '#adc6ff',
  secondary: '#855300',
  onSecondary: '#ffffff',
  secondaryContainer: '#fea619',
  onSecondaryContainer: '#684000',
  tertiary: '#b61722',
  onTertiary: '#ffffff',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  surface: '#f9f9ff',
  surfaceBright: '#f9f9ff',
  surfaceDim: '#d3daea',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceContainerHigh: '#e2e8f8',
  surfaceContainerHighest: '#dce2f3',
  surfaceVariant: '#dce2f3',
  onSurface: '#151c27',
  onSurfaceVariant: '#424754',
  outline: '#727785',
  outlineVariant: '#c2c6d6',
  inverseSurface: '#2a313d',
  inverseOnSurface: '#ebf1ff',
  inversePrimary: '#adc6ff',
  surfaceTint: '#005ac2',
} as const;
```

- [ ] **Step 2: Escrever `constants/typography.ts`**

```typescript
// constants/typography.ts
import { TextStyle } from 'react-native';

export const Typography = {
  headlineXl: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
  headlineLg: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.24,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
  headlineLgMobile: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
  headlineMd: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  } satisfies TextStyle,
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  } satisfies TextStyle,
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  } satisfies TextStyle,
  labelMd: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.6,
    fontFamily: 'Inter_600SemiBold',
  } satisfies TextStyle,
  priceDisplay: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
};

export const Spacing = {
  base: 4,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
  containerPadding: 16,
  gutter: 12,
} as const;
```

- [ ] **Step 3: Commit**

```bash
git add constants/
git commit -m "feat: adicionar design system (cores e tipografia)"
```

---

## Task 4: Serviço de API

**Files:**
- Create: `services/api.ts`

- [ ] **Step 1: Criar pasta e arquivo**

```bash
mkdir -p services
```

- [ ] **Step 2: Escrever `services/api.ts`**

```typescript
// services/api.ts
import axios from 'axios';
import { Product, Category } from '@/types';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories');
  return data;
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/products/category/${encodeURIComponent(category)}`);
  return data;
}
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add services/
git commit -m "feat: adicionar serviço de API (axios + fakestoreapi)"
```

---

## Task 5: Hook useFavorites

**Files:**
- Create: `hooks/useFavorites.ts`

- [ ] **Step 1: Escrever `hooks/useFavorites.ts`**

```typescript
// hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@omnishop:favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          const parsed: number[] = JSON.parse(value);
          setFavoriteIds(new Set(parsed));
        }
      })
      .catch((e) => console.error('[useFavorites] load error', e));
  }, []);

  const persist = useCallback(async (ids: Set<number>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch (e) {
      console.error('[useFavorites] persist error', e);
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds]);

  return { favoriteIds, isFavorite, toggleFavorite };
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useFavorites.ts
git commit -m "feat: adicionar hook useFavorites com AsyncStorage"
```

---

## Task 6: Hook useProducts

**Files:**
- Create: `hooks/useProducts.ts`

- [ ] **Step 1: Escrever `hooks/useProducts.ts`**

```typescript
// hooks/useProducts.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts, getCategories } from '@/services/api';
import { Product, Category } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchData = useCallback(async () => {
    setError(false);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  return {
    products,
    categories,
    filteredProducts,
    loading,
    refreshing,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onRefresh,
    retry: fetchData,
  };
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useProducts.ts
git commit -m "feat: adicionar hook useProducts com filtros e pull-to-refresh"
```

---

## Task 7: AppContext — Estado global compartilhado

**Files:**
- Create: `context/AppContext.tsx`

> **Por quê:** `index.tsx` e `favorites.tsx` são montadas simultaneamente como tabs. Sem contexto, teríamos dois `useProducts()` separados (duas chamadas de API) e dois `useFavorites()` (estado de favoritos fora de sincronia). O AppContext instancia cada hook uma vez e distribui via Context.

- [ ] **Step 1: Criar pasta e arquivo**

```bash
mkdir -p context
```

- [ ] **Step 2: Escrever `context/AppContext.tsx`**

```tsx
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
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add context/
git commit -m "feat: adicionar AppContext para compartilhar estado entre telas"
```

---

## Task 8: Componente RatingBadge

**Files:**
- Create: `components/RatingBadge.tsx`

- [ ] **Step 1: Escrever `components/RatingBadge.tsx`**

```tsx
// components/RatingBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Props {
  rate: number;
  count: number;
}

export function RatingBadge({ rate, count }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="star" size={14} color={Colors.secondaryContainer} />
      <Text style={styles.text}>
        {rate.toFixed(1)} ({count})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/RatingBadge.tsx
git commit -m "feat: adicionar componente RatingBadge"
```

---

## Task 9: Componente SkeletonCard

**Files:**
- Create: `components/SkeletonCard.tsx`

- [ ] **Step 1: Escrever `components/SkeletonCard.tsx`**

```tsx
// components/SkeletonCard.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.containerPadding * 2 - Spacing.gutter) / 2;

export function SkeletonCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.image} />
      <View style={styles.body}>
        <View style={styles.line1} />
        <View style={styles.line2} />
        <View style={styles.line3} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  body: {
    padding: Spacing.stackMd,
    gap: 8,
  },
  line1: {
    height: 10,
    width: '60%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
  },
  line2: {
    height: 12,
    width: '90%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
  },
  line3: {
    height: 16,
    width: '40%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
    marginTop: 4,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/SkeletonCard.tsx
git commit -m "feat: adicionar componente SkeletonCard com animação pulse"
```

---

## Task 10: Componente LoadingSpinner

**Files:**
- Create: `components/LoadingSpinner.tsx`

- [ ] **Step 1: Escrever `components/LoadingSpinner.tsx`**

```tsx
// components/LoadingSpinner.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

export function LoadingSpinner() {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>Carregando produtos...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  card: {
    alignItems: 'center',
    gap: Spacing.stackLg,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 32,
    paddingVertical: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  text: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/LoadingSpinner.tsx
git commit -m "feat: adicionar componente LoadingSpinner"
```

---

## Task 11: Componente ErrorState

**Files:**
- Create: `components/ErrorState.tsx`

- [ ] **Step 1: Escrever `components/ErrorState.tsx`**

```tsx
// components/ErrorState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

interface Props {
  onRetry: () => void;
  message?: string;
}

export function ErrorState({
  onRetry,
  message = 'Ocorreu um erro ao carregar os dados. Por favor, verifique sua conexão e tente novamente.',
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
      </View>
      <Text style={styles.title}>Ops! Algo deu errado</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color={Colors.onPrimary} />
        <Text style={styles.buttonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: Spacing.stackLg,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.stackLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: Spacing.stackSm,
    textAlign: 'center',
  },
  message: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.stackLg,
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/ErrorState.tsx
git commit -m "feat: adicionar componente ErrorState com botão retry"
```

---

## Task 12: Componente EmptyState

**Files:**
- Create: `components/EmptyState.tsx`

- [ ] **Step 1: Escrever `components/EmptyState.tsx`**

```tsx
// components/EmptyState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

interface Props {
  onExplore: () => void;
}

export function EmptyState({ onExplore }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="heart-dislike-outline" size={56} color={Colors.secondaryContainer} />
      </View>
      <Text style={styles.title}>Sua lista está vazia</Text>
      <Text style={styles.message}>
        Você ainda não adicionou nenhum produto aos seus favoritos. Que tal explorar nossa loja e
        encontrar algo que você ame?
      </Text>
      <TouchableOpacity style={styles.button} onPress={onExplore} activeOpacity={0.8}>
        <Ionicons name="search" size={18} color={Colors.onPrimary} />
        <Text style={styles.buttonText}>Explorar Produtos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: Spacing.stackLg,
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.stackLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    ...Typography.headlineLgMobile,
    color: Colors.onSurface,
    marginBottom: Spacing.stackSm,
    textAlign: 'center',
  },
  message: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.stackLg,
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    minHeight: 48,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: 240,
    justifyContent: 'center',
  },
  buttonText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/EmptyState.tsx
git commit -m "feat: adicionar componente EmptyState para lista de favoritos vazia"
```

---

## Task 13: Componente SearchBar

**Files:**
- Create: `components/SearchBar.tsx`

- [ ] **Step 1: Escrever `components/SearchBar.tsx`**

```tsx
// components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={Colors.onSurfaceVariant} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar produtos..."
        placeholderTextColor={Colors.onSurfaceVariant}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.onSurface,
    paddingVertical: 0,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/SearchBar.tsx
git commit -m "feat: adicionar componente SearchBar"
```

---

## Task 14: Componente CategoryChips

**Files:**
- Create: `components/CategoryChips.tsx`

- [ ] **Step 1: Escrever `components/CategoryChips.tsx`**

```tsx
// components/CategoryChips.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '@/types';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Props {
  categories: Category[];
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, selected === null && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        <Text style={[styles.chipText, selected === null && styles.chipTextActive]}>Tudo</Text>
      </TouchableOpacity>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.chip, selected === cat && styles.chipActive]}
          onPress={() => onSelect(cat)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
  chipTextActive: {
    color: Colors.onPrimary,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add components/CategoryChips.tsx
git commit -m "feat: adicionar componente CategoryChips com scroll horizontal"
```

---

## Task 15: Componente ProductCard

**Files:**
- Create: `components/ProductCard.tsx`

- [ ] **Step 1: Escrever `components/ProductCard.tsx`**

```tsx
// components/ProductCard.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '@/types';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';
import { RatingBadge } from './RatingBadge';

interface Props {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.containerPadding * 2 - Spacing.gutter) / 2;

export function ProductCard({ product, isFavorite, onToggleFavorite }: Props) {
  const handlePress = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [product.id]);

  const handleFavorite = useCallback(() => {
    onToggleFavorite(product.id);
  }, [product.id, onToggleFavorite]);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleFavorite}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? Colors.error : Colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.category} numberOfLines={1}>
            {product.category.toUpperCase()}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
        </View>
        <View style={styles.footer}>
          <RatingBadge rate={product.rating.rate} count={product.rating.count} />
          <Text style={styles.price}>$ {product.price.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerLow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(249,249,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  body: {
    padding: Spacing.stackMd,
    gap: Spacing.stackSm,
    flex: 1,
  },
  category: {
    ...Typography.labelMd,
    color: Colors.secondary,
    marginBottom: 4,
  },
  title: {
    ...Typography.bodyMd,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  footer: {
    marginTop: 'auto' as any,
  },
  price: {
    ...Typography.priceDisplay,
    color: Colors.primary,
    marginTop: 4,
  },
});
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: adicionar componente ProductCard com coração de favorito"
```

---

## Task 16: Root Layout

**Files:**
- Modify: `app/_layout.tsx`

> **Atenção:** Este arquivo registra as fontes Inter, envolve o app com `AppProvider`, e declara a rota `product/[id]` como stack screen.

- [ ] **Step 1: Reescrever `app/_layout.tsx`**

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppProvider } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </AppProvider>
  );
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: configurar root layout com fontes Inter e AppProvider"
```

---

## Task 17: Tab Layout

**Files:**
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Reescrever `app/(tabs)/_layout.tsx`**

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.onPrimaryContainer,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarActiveBackgroundColor: Colors.primaryContainer,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopColor: Colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    ...Typography.labelMd,
    marginTop: 2,
  },
  tabItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add "app/(tabs)/_layout.tsx"
git commit -m "feat: configurar tab layout com 2 abas (Home e Favoritos)"
```

---

## Task 18: Tela Home (Lista de Produtos)

**Files:**
- Modify: `app/(tabs)/index.tsx`

- [ ] **Step 1: Reescrever `app/(tabs)/index.tsx`**

```tsx
// app/(tabs)/index.tsx
import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChips } from '@/components/CategoryChips';
import { SkeletonCard } from '@/components/SkeletonCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';
import { Product } from '@/types';

const SKELETON_COUNT = 6;

export default function HomeScreen() {
  const {
    filteredProducts,
    categories,
    loading,
    refreshing,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onRefresh,
    retry,
    isFavorite,
    toggleFavorite,
  } = useAppContext();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [isFavorite, toggleFavorite],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <CategoryChips
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>
    ),
    [searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory],
  );

  const TopBar = (
    <View style={styles.topBar}>
      <Ionicons name="menu" size={24} color={Colors.onSurfaceVariant} />
      <Text style={styles.appTitle}>OmniShop</Text>
      <Ionicons name="bag-outline" size={24} color={Colors.onSurfaceVariant} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {TopBar}
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {TopBar}
        <ErrorState onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {TopBar}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={10}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerPadding,
    paddingVertical: Spacing.stackSm,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  appTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.primary,
  },
  listHeader: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: Spacing.stackLg,
    paddingBottom: Spacing.stackMd,
    gap: Spacing.stackMd,
  },
  listContent: {
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: Spacing.stackLg,
  },
  row: {
    gap: Spacing.gutter,
    marginBottom: Spacing.gutter,
  },
});
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/(tabs)/index.tsx"
git commit -m "feat: implementar tela Home com lista, busca, filtros e pull-to-refresh"
```

---

## Task 19: Tela de Favoritos

**Files:**
- Create: `app/(tabs)/favorites.tsx`
- Delete: `app/(tabs)/explore.tsx` (se ainda existir)

- [ ] **Step 1: Escrever `app/(tabs)/favorites.tsx`**

```tsx
// app/(tabs)/favorites.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';
import { Product } from '@/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { products, favoriteIds, isFavorite, toggleFavorite } = useAppContext();

  const favoriteProducts = products.filter((p) => favoriteIds.has(p.id));

  const handleExplore = useCallback(() => {
    router.push('/(tabs)/');
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [isFavorite, toggleFavorite],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Meus Favoritos</Text>
      </View>
      {favoriteProducts.length === 0 ? (
        <EmptyState onExplore={handleExplore} />
      ) : (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          initialNumToRender={6}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerPadding,
    paddingVertical: Spacing.stackSm,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: Spacing.stackLg,
    paddingBottom: Spacing.stackLg,
  },
  row: {
    gap: Spacing.gutter,
    marginBottom: Spacing.gutter,
  },
});
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/(tabs)/favorites.tsx"
git commit -m "feat: implementar tela de Favoritos com estado vazio"
```

---

## Task 20: Tela de Detalhes do Produto

**Files:**
- Create: `app/product/[id].tsx`

- [ ] **Step 1: Criar pasta e arquivo**

```bash
mkdir -p "app/product"
```

- [ ] **Step 2: Escrever `app/product/[id].tsx`**

```tsx
// app/product/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProduct } from '@/services/api';
import { useAppContext } from '@/context/AppContext';
import { ErrorState } from '@/components/ErrorState';
import { Product } from '@/types';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useAppContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const productId = Number(id);
  const favorited = product ? isFavorite(productId) : false;

  const fetchProduct = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const data = await getProduct(productId);
      setProduct(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(productId);
  }, [productId, toggleFavorite]);

  const Header = (
    <SafeAreaView style={styles.headerSafe}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.headerRight} />
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {Header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        {Header}
        <ErrorState onRetry={fetchProduct} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Header}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            contentFit="contain"
            transition={300}
          />
        </View>

        {/* Details Panel */}
        <View style={styles.panel}>
          {/* Category + Rating row */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={Colors.secondaryContainer} />
              <Text style={styles.ratingText}>
                {product.rating.rate.toFixed(1)} ({product.rating.count} avaliações)
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Price */}
          <Text style={styles.price}>$ {product.price.toFixed(2)}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>Sobre o Produto</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <SafeAreaView>
          <TouchableOpacity
            style={[styles.favoriteButton, favorited && styles.favoriteButtonActive]}
            onPress={handleToggleFavorite}
            activeOpacity={0.85}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={Colors.onPrimary}
            />
            <Text style={styles.favoriteButtonText}>
              {favorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSafe: {
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerPadding,
    paddingVertical: Spacing.stackSm,
    height: 56,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  panel: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: Spacing.stackMd,
    gap: Spacing.stackMd,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  categoryText: {
    ...Typography.labelMd,
    color: Colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
  title: {
    ...Typography.headlineLgMobile,
    color: Colors.onSurface,
  },
  price: {
    ...Typography.priceDisplay,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.4,
  },
  sectionTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: Spacing.stackMd,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginBottom: Spacing.stackSm,
  },
  favoriteButtonActive: {
    backgroundColor: Colors.error,
  },
  favoriteButtonText: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
  },
});
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Testar o app**

```bash
npx expo start --clear
```

Verificar manualmente:
- [ ] Home carrega lista de produtos em grid 2 colunas
- [ ] Loading spinner aparece durante carregamento inicial
- [ ] Chips de categoria filtram produtos corretamente
- [ ] Campo de busca filtra por nome em tempo real
- [ ] Pull to refresh funciona
- [ ] Tocar no coração marca/desmarca favorito (coração vermelho = favorito)
- [ ] Tocar no card navega para tela de detalhes
- [ ] Tela de detalhes exibe imagem, título, preço, categoria, rating, descrição
- [ ] Botão de favorito na tela de detalhes funciona e persiste
- [ ] Tab Favoritos exibe apenas os produtos marcados
- [ ] Estado vazio aparece quando não há favoritos
- [ ] Favoritos persistem após fechar e reabrir o app

- [ ] **Step 5: Commit**

```bash
git add "app/product/"
git commit -m "feat: implementar tela de Detalhes do Produto"
```

---

## Task 21: Documentação (README.md e AI.md)

**Files:**
- Modify: `README.md`
- Create: `AI.md`

- [ ] **Step 1: Reescrever `README.md`**

```markdown
# OmniShop

Aplicativo mobile de e-commerce desenvolvido com React Native e Expo como teste técnico.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go instalado no celular (iOS/Android) **ou** Android Emulator/iOS Simulator

## Instalação

```bash
git clone <repo-url>
cd omnishop
npm install
```

## Execução

```bash
# Expo Go (celular físico via QR Code)
npx expo start

# Emulador Android
npx expo start --android

# Simulador iOS
npx expo start --ios
```

Escaneie o QR Code com o Expo Go (Android) ou a câmera (iOS).

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0 | SDK e toolchain |
| TypeScript | ~5.9 | Tipagem estática |
| Expo Router | ~6.0 | Navegação file-based |
| Axios | ^1.x | Requisições HTTP |
| AsyncStorage | ^2.x | Persistência local |
| Inter (expo-google-fonts) | latest | Tipografia |
| expo-image | ~3.0 | Exibição de imagens |
| react-native-reanimated | ~4.1 | Animações (SkeletonCard) |

**API:** [fakestoreapi.com](https://fakestoreapi.com)

## Decisões Técnicas

### Expo Router (file-based routing)
Escolhido por ser o padrão atual do Expo SDK 54, integra React Navigation nativamente via sistema de arquivos. A estrutura `app/(tabs)/` com `app/product/[id].tsx` é legível e escalável.

### AppContext para estado compartilhado
`index.tsx` e `favorites.tsx` são montadas simultaneamente como tabs. O `AppContext` centraliza os hooks `useProducts` e `useFavorites` para evitar chamadas duplicadas à API e manter favoritos em sincronia entre telas.

### FlatList com numColumns={2}
Garante recycling de células (virtual list), essencial para listas longas. Utiliza `initialNumToRender`, `maxToRenderPerBatch` e `windowSize` para controle fino de renderização.

### useMemo para filtros locais
Busca e filtro por categoria são operações locais sobre os dados já carregados. O `useMemo` garante que a lista filtrada só é recalculada quando `products`, `searchQuery` ou `selectedCategory` mudam.

### expo-image em vez de Image do RN
Cache automático de imagens, transições suaves, suporte a `contentFit`, e melhor performance geral no carregamento de imagens de produto.

### Skeleton loading em vez de spinner
O skeleton (placeholder animado) dá feedback imediato ao usuário sobre a estrutura da lista antes dos dados chegarem, reduzindo a percepção de latência.

## Limitações Conhecidas

- A API não tem autenticação; em produção, um backend próprio seria necessário.
- Os dados da API estão em inglês (títulos, categorias, descrições).
- Não há paginação real — todos os produtos são carregados de uma vez (~20 itens).
- Sem modo offline além dos favoritos persistidos.
- O spinner duplo do protótipo HTML usa SVG; foi substituído por `ActivityIndicator` nativo para evitar a dependência `react-native-svg`.

## Performance e Boas Práticas

- **FlatList virtualizada** com `numColumns={2}` para listas de produtos
- **useMemo** nos filtros de busca e categoria
- **useCallback** nos handlers de toggle favorito e refresh
- **expo-image** para cache e lazy loading de imagens
- **Skeleton** para loading state com melhor percepção de velocidade
- **AsyncStorage** lido uma única vez no mount; escritas são assíncronas e não bloqueiam a UI
- **TypeScript strict** em todo o projeto
```

- [ ] **Step 2: Criar `AI.md`**

```markdown
# AI.md — Uso de Inteligência Artificial no Desenvolvimento

## Ferramenta Utilizada

**Cursor IDE** com o modelo **Claude Sonnet 4.6** (Anthropic), acessado via interface de chat do Cursor com o skill `/brainstorming` e `/writing-plans`.

## Partes do Desenvolvimento Assistidas por IA

| Etapa | Descrição |
|---|---|
| **Design spec** | A IA analisou os protótipos HTML e o DESIGN.md, extraiu os tokens do design system e redigiu o documento de especificação completo (`docs/superpowers/specs/`) |
| **Plano de implementação** | A IA criou o plano task-by-task com código completo para cada arquivo (`docs/superpowers/plans/`) |
| **Código base** | Todo o código foi gerado a partir do plano, com os componentes, hooks, serviços e telas do app |
| **Decisões de arquitetura** | AppContext, useMemo nos filtros, FlatList com numColumns, substituição do SVG por ActivityIndicator |

## Exemplo de Prompt Utilizado

> "Sim" — resposta de aprovação ao design proposto pela IA após a fase de brainstorming.

O prompt principal foi o próprio enunciado do teste técnico com as instruções das telas, tecnologias obrigatórias, e a referência aos protótipos HTML e DESIGN.md.

## Ajustes Realizados Manualmente

- Verificação de compatibilidade de versões das dependências com Expo SDK 54
- Ajuste dos caminhos de arquivo para o sistema Windows (barras e aspas)
- Validação do comportamento do `AppContext` com múltiplas tabs montadas simultaneamente
- Ajuste do `tabBarActiveBackgroundColor` (pill do tab ativo) pois a solução via CSS do protótipo HTML não tem equivalente direto no React Native Tabs
- Testes manuais no dispositivo para validar pull-to-refresh e persistência do AsyncStorage
```

- [ ] **Step 3: Commit final**

```bash
git add README.md AI.md
git commit -m "docs: adicionar README.md e AI.md com instruções e decisões técnicas"
```

---

## Checklist de Verificação Final

Antes de considerar o projeto completo, verificar:

- [ ] `npx tsc --noEmit` passa sem erros
- [ ] App abre sem crashes no Expo Go
- [ ] Tela Home: lista carrega, busca funciona, filtros funcionam, pull-to-refresh funciona
- [ ] Loading state aparece durante carregamento inicial
- [ ] Error state aparece se a API falhar (pode testar desligando o Wi-Fi)
- [ ] Botão "Tentar Novamente" refaz a requisição
- [ ] ProductCard exibe imagem, categoria, título, rating e preço
- [ ] Coração no card marca/desmarca favorito com feedback visual imediato
- [ ] Tela de Detalhes: imagem hero, badge de categoria, rating, título, preço, descrição, botão de favorito fixo na base
- [ ] Tab Favoritos: mostra apenas produtos favoritados
- [ ] Estado vazio com botão "Explorar Produtos" navegando para Home
- [ ] Favoritos persistem após fechar o app completamente
- [ ] Design fiel ao protótipo: cores primárias (#0058be), estrelas âmbar, coração vermelho, tipografia Inter
