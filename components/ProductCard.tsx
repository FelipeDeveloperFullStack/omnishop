// components/ProductCard.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '@/types';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';
import { Shadows } from '@/constants/layout';
import { RatingBadge } from './RatingBadge';

interface Props {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export function ProductCard({ product, isFavorite, onToggleFavorite }: Props) {
  const handlePress = useCallback(() => {
    router.push(`/product/${product.id}` as any);
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
            color={isFavorite ? Colors.favoriteActive : Colors.onSurfaceVariant}
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
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
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
    ...Shadows.sm,
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
