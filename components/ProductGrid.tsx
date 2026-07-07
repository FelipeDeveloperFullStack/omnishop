// components/ProductGrid.tsx
import React, { useCallback, ComponentType, ReactElement } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { Product } from '@/types';
import { Spacing } from '@/constants/typography';
import { getNumColumns, getHorizontalPadding } from '@/constants/layout';
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
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);
  const horizontalPadding = getHorizontalPadding(width);

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
      // key força remount quando numColumns muda (ex.: rotação de tela)
      key={`grid-${numColumns}`}
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      columnWrapperStyle={
        numColumns > 1
          ? { gap: Spacing.gutter, marginBottom: Spacing.gutter }
          : undefined
      }
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
        paddingBottom: Spacing.stackLg,
      }}
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
