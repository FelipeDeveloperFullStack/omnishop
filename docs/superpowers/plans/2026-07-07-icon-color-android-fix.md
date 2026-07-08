# Correção de Cores de Ícones no Android — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer os ícones `FontAwesome` (estrela) e `Ionicons` (coração) renderizarem com as cores corretas no Android (Expo Go), igualando o comportamento já correto do Expo Web.

**Architecture:** Remover o carregamento duplicado dos fonts de ícones do `useFonts` (conflito com os fonts pré-bundled do Expo Go) e adicionar o plugin `expo-font` no `app.json` para embutir os fonts nativamente em builds de produção. Fixar `userInterfaceStyle` para `"light"` já que o design system não tem variante dark.

**Tech Stack:** Expo SDK 54, `@expo/vector-icons` v15, `expo-font` plugin, `@expo-google-fonts/inter`

---

## Mapa de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `app.json` | Modificar | Config nativa: adicionar plugin `expo-font`, fixar `userInterfaceStyle` |
| `app/_layout.tsx` | Modificar | Root layout: remover fonts de ícones do `useFonts`, remover imports não usados |

---

### Task 1: Atualizar `app.json`

**Files:**
- Modify: `app.json`

- [ ] **Step 1: Abrir `app.json` e verificar estado atual**

O arquivo deve conter:
```json
"userInterfaceStyle": "automatic",
```
e a lista de plugins sem `expo-font`.

- [ ] **Step 2: Substituir `userInterfaceStyle` e adicionar plugin `expo-font`**

Substituir:
```json
"userInterfaceStyle": "automatic",
```
por:
```json
"userInterfaceStyle": "light",
```

Na lista `"plugins"`, adicionar o plugin `expo-font` **antes** do `expo-splash-screen`. A lista final de plugins deve ficar:

```json
"plugins": [
  "expo-router",
  [
    "expo-font",
    {
      "fonts": [
        "./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf",
        "./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf"
      ]
    }
  ],
  [
    "expo-splash-screen",
    {
      "image": "./assets/images/splash-icon.png",
      "imageWidth": 200,
      "resizeMode": "contain",
      "backgroundColor": "#ffffff",
      "dark": {
        "backgroundColor": "#000000"
      }
    }
  ]
]
```

- [ ] **Step 3: Verificar que o JSON continua válido**

Rodar:
```bash
node -e "require('./app.json')" && echo "JSON válido"
```
Esperado: `JSON válido`

- [ ] **Step 4: Commit**

```bash
git add app.json
git commit -m "fix(android): adiciona expo-font plugin e fixa userInterfaceStyle=light"
```

---

### Task 2: Atualizar `app/_layout.tsx`

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Abrir `app/_layout.tsx` e identificar os pontos de mudança**

Localizar:
1. Os imports de `Ionicons` e `FontAwesome`:
   ```tsx
   import { Ionicons, FontAwesome } from '@expo/vector-icons';
   ```
2. Os spreads dentro do `useFonts`:
   ```tsx
   ...Ionicons.font,
   ...FontAwesome.font,
   ```

- [ ] **Step 2: Remover os spreads dos fonts de ícones do `useFonts`**

O bloco `useFonts` deve ficar:

```tsx
const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
});
```

- [ ] **Step 3: Remover o import de `Ionicons` e `FontAwesome` do `_layout.tsx`**

O arquivo `_layout.tsx` usa `Ionicons` e `FontAwesome` **apenas** para os spreads de font (removidos no passo anterior). Eles continuam importados e usados corretamente nos componentes individuais (`ProductCard.tsx`, `RatingBadge.tsx`, `app/(tabs)/_layout.tsx`, etc.) — não mexer nesses outros arquivos.

Remover a linha:
```tsx
import { Ionicons, FontAwesome } from '@expo/vector-icons';
```

O arquivo final `app/_layout.tsx` deve ficar:

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 4: Verificar ausência de erros de lint**

```bash
npx expo lint
```
Esperado: sem erros relacionados a imports não usados.

- [ ] **Step 5: Commit**

```bash
git add app/_layout.tsx
git commit -m "fix(android): remove carregamento duplicado dos fonts de ícones do useFonts"
```

---

### Task 3: Verificação Manual no Expo Go

- [ ] **Step 1: Reiniciar o servidor Expo com cache limpo**

```bash
npx expo start --clear
```

O flag `--clear` garante que o Metro bundler não use cache antigo dos fonts.

- [ ] **Step 2: Abrir o app no Expo Go no Android**

Escanear o QR code normalmente.

- [ ] **Step 3: Verificar as correções**

| Elemento | Esperado |
|---|---|
| Ícone de estrela em qualquer card | Amarelo (`#F59E0B`) |
| Ícone de coração (não favorito) | Cinza (`#424754`) |
| Ícone de coração (favorito marcado) | Vermelho (`#EF4444`) |
| Tab bar — aba ativa | Azul (`#0058be`) |
| Tab bar — aba inativa | Cinza (`#424754`) |
| App em dispositivo com dark mode ativo | Tema claro (não afetado pelo sistema) |

- [ ] **Step 4: Verificar paridade com a web**

Rodar `npx expo start --web` e confirmar que o comportamento visual é idêntico ao Android após a correção.
