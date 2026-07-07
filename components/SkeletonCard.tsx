// components/SkeletonCard.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.containerPadding * 2 - Spacing.gutter) / 2;

export function SkeletonCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.image} />
      <View style={styles.body}>
        <View style={styles.line1} />
        <View style={styles.line2} />
        <View style={styles.line3} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  body: {
    padding: Spacing.stackMd,
    gap: 8,
  },
  line1: {
    height: 10,
    width: '60%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
  },
  line2: {
    height: 12,
    width: '90%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
  },
  line3: {
    height: 16,
    width: '40%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
    marginTop: 4,
  },
});
