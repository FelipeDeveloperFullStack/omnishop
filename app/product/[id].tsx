// app/product/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@/components/Icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProduct } from '@/services/api';
import { useAppContext } from '@/context/AppContext';
import { ErrorState } from '@/components/ErrorState';
import { RatingBadge } from '@/components/RatingBadge';
import { Product } from '@/types';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useAppContext();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  // Largura máxima do conteúdo em tablets — centraliza sem esticar
  const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.85, 860) : undefined;

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
        {/* Wrapper centralizado para tablets */}
        <View style={{ maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' }}>
          {/* Hero Image */}
          <View style={[styles.heroContainer, isTablet && styles.heroContainerTablet]}>
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
              <RatingBadge rate={product.rating.rate} count={product.rating.count} />
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
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <SafeAreaView>
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              favorited && styles.favoriteButtonActive,
              isTablet && styles.favoriteButtonTablet,
            ]}
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
    maxHeight: 480,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  heroContainerTablet: {
    maxHeight: 420,
    borderRadius: 16,
    overflow: 'hidden',
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
  favoriteButtonTablet: {
    maxWidth: 480,
    alignSelf: 'center',
  },
  favoriteButtonText: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
  },
});
