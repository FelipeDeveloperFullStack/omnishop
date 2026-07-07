// app/(tabs)/favorites.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';
import { Product } from '@/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { products, loading, favoriteIds, isFavorite, toggleFavorite } = useAppContext();

  const favoriteProducts = products.filter((p) => favoriteIds.has(p.id));

  const handleExplore = useCallback(() => {
    router.push('/(tabs)' as any);
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
      <ScreenHeader title="Meus Favoritos" />
      {loading ? (
        <LoadingSpinner />
      ) : favoriteProducts.length === 0 ? (
        <EmptyState onExplore={handleExplore} />
      ) : (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          extraData={favoriteIds}
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
