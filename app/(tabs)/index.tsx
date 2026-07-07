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
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/typography';
import { Product } from '@/types';

// Componente extraído em nível de módulo para que o FlatList receba sempre
// a mesma referência de tipo de componente — evita desmontar/remontar o
// TextInput (e fechar o teclado) a cada keystroke.
function HomeListHeader() {
  const { searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory } =
    useAppContext();
  return (
    <View style={styles.listHeader}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </View>
  );
}

export default function HomeScreen() {
  const {
    filteredProducts,
    loading,
    refreshing,
    error,
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
        ListHeaderComponent={HomeListHeader}
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
