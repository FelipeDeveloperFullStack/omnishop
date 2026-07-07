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
