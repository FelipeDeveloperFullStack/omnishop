// app/(tabs)/index.tsx
import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/context/AppContext';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChips } from '@/components/CategoryChips';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';

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
    favoriteIds,
    isFavorite,
    toggleFavorite,
  } = useAppContext();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="OmniShop" />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="OmniShop" />
        <ErrorState onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="OmniShop" />
      <ProductGrid
        products={filteredProducts}
        favoriteIds={favoriteIds}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        ListHeaderComponent={HomeListHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  listHeader: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: Spacing.stackLg,
    paddingBottom: Spacing.stackMd,
    gap: Spacing.stackMd,
  },
});
