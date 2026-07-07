// components/ProductGrid.tsx
import React, { useCallback, ComponentType, ReactElement } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Product } from '@/types';
import { Spacing } from '@/constants/typography';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  ListHeaderComponent?: ComponentType;
  refreshControl?: ReactElement;
}

export function ProductGrid({
  products,
  favoriteIds,
  isFavorite,
  onToggleFavorite,
  ListHeaderComponent,
  refreshControl,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={onToggleFavorite}
      />
    ),
    [isFavorite, onToggleFavorite],
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      extraData={favoriteIds}
      refreshControl={refreshControl}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={10}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: Spacing.stackLg,
  },
  row: {
    gap: Spacing.gutter,
    marginBottom: Spacing.gutter,
  },
});
