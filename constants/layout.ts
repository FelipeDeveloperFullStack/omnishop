// constants/layout.ts
import { Dimensions } from 'react-native';
import { Spacing } from './typography';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const CARD_WIDTH =
  (SCREEN_WIDTH - Spacing.containerPadding * 2 - Spacing.gutter) / 2;

export const Shadows = {
  sm: {
    shadowColor: '#000' as const,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000' as const,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000' as const,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;
