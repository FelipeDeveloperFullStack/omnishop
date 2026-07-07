// app/(tabs)/favorites.tsx
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { ProductGrid } from '@/components/ProductGrid';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';

export default function FavoritesScreen() {
  const router = useRouter();
  const { products, loading, favoriteIds, isFavorite, toggleFavorite } = useAppContext();

  const favoriteProducts = products.filter((p) => favoriteIds.has(p.id));

  const handleExplore = useCallback(() => {
    router.push('/(tabs)' as any);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Meus Favoritos" />
      {loading ? (
        <LoadingSpinner />
      ) : favoriteProducts.length === 0 ? (
        <EmptyState onExplore={handleExplore} />
      ) : (
        <ProductGrid
          products={favoriteProducts}
          favoriteIds={favoriteIds}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
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
});
