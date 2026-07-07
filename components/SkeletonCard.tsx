// components/SkeletonCard.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/typography';
import { Shadows } from '@/constants/layout';

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
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.md,
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
