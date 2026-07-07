// constants/layout.ts
import { Spacing } from './typography';

// Número de colunas do grid baseado na largura da tela
export function getNumColumns(screenWidth: number): number {
  if (screenWidth >= 1024) return 4;
  if (screenWidth >= 768) return 3;
  return 2;
}

// Padding horizontal dos containers baseado na largura da tela
export function getHorizontalPadding(screenWidth: number): number {
  if (screenWidth >= 1024) return 32;
  if (screenWidth >= 768) return 24;
  return Spacing.containerPadding;
}

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
