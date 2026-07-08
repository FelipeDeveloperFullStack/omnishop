// components/RatingBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@/components/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Props {
  rate: number;
  count: number;
}

export function RatingBadge({ rate, count }: Props) {
  return (
    <View style={styles.container}>
      <FontAwesome name="star" size={13} color={Colors.starYellow} />
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
  text: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
});
