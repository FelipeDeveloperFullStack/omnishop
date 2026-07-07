// components/RatingBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Props {
  rate: number;
  count: number;
}

export function RatingBadge({ rate, count }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.star}>★</Text>
      <Text style={styles.text}>
        {rate.toFixed(1)} ({count})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    fontSize: 14,
    lineHeight: 16,
    color: Colors.starYellow,
  },
  text: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
});
