// constants/typography.ts
import { TextStyle } from 'react-native';

export const Typography = {
  headlineXl: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
  headlineLg: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.24,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
  headlineLgMobile: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
  headlineMd: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  } satisfies TextStyle,
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  } satisfies TextStyle,
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  } satisfies TextStyle,
  labelMd: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.6,
    fontFamily: 'Inter_600SemiBold',
  } satisfies TextStyle,
  priceDisplay: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  } satisfies TextStyle,
};

export const Spacing = {
  base: 4,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
  containerPadding: 16,
  gutter: 12,
} as const;
