// app/(tabs)/favorites.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';
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
      <View style={styles.topBar}>
        <Text style={styles.title}>Meus Favoritos</Text>
      </View>
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
