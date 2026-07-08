// components/Icon.tsx
//
// Wrapper sobre @expo/vector-icons que garante que a prop `color` seja aplicada
// corretamente no Fabric renderer (Nova Arquitetura) do Android.
//
// Contexto: `create-icon-set.js` constrói o style array como:
//   [{ fontSize, color }, userStyle, { fontFamily, fontWeight, fontStyle }, {}]
// Quando `userStyle` é undefined, o Fabric descarta o `color` da posição 0.
// Injetar `{ color }` em `userStyle` resolve o problema em todas as plataformas.
import {
  Ionicons as BaseIonicons,
  FontAwesome as BaseFontAwesome,
} from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IoniconsProps = ComponentProps<typeof BaseIonicons>;
type FontAwesomeProps = ComponentProps<typeof BaseFontAwesome>;

export function Ionicons({ color, style, ...props }: IoniconsProps) {
  return (
    <BaseIonicons
      color={color}
      style={[{ color }, style as any]}
      {...props}
    />
  );
}

export function FontAwesome({ color, style, ...props }: FontAwesomeProps) {
  return (
    <BaseFontAwesome
      color={color}
      style={[{ color }, style as any]}
      {...props}
    />
  );
}
