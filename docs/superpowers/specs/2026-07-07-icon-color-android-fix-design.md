# Design Spec: Correção de Cores de Ícones no Android

**Data:** 2026-07-07  
**Status:** Aprovado  
**Escopo:** 2 arquivos — `app.json` e `app/_layout.tsx`

---

## Problema

O aplicativo apresenta inconsistência visual entre Expo Web e Android (Expo Go):

- Ícone de estrela de avaliação (`FontAwesome`) não renderiza na cor amarela (`#F59E0B`) no Android.
- Ícone de coração favorito (`Ionicons`) não renderiza na cor vermelha (`#EF4444`) quando marcado como favorito no Android.
- Na web, ambos funcionam corretamente.

---

## Causa Raiz

### Diferença de renderização Web vs Android

| Plataforma | Renderizador de ícones | Suporte a `color` prop |
|---|---|---|
| Web | SVG embutido no bundle JS | Nativo — funciona sempre |
| Android (Expo Go) | Caractere de font TrueType | Depende do font ser carregado corretamente |

### Carregamento duplicado dos fonts de ícones

Em `app/_layout.tsx`, os fonts de ícones são carregados manualmente:

```tsx
const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  ...Ionicons.font,      // ← redundante
  ...FontAwesome.font,   // ← redundante
});
```

O Expo Go (SDK 54) já inclui os fonts de `@expo/vector-icons` pré-bundled. Carregar novamente via `useFonts` do `@expo-google-fonts/inter` registra os fonts com identificadores potencialmente conflitantes no runtime nativo do Android. Isso faz com que o `color` prop dos componentes `Ionicons` e `FontAwesome` não seja aplicado corretamente.

### Interferência potencial do `userInterfaceStyle: "automatic"`

O projeto define `"userInterfaceStyle": "automatic"` no `app.json`, mas não implementa nenhum conjunto de cores para tema escuro (sem `Colors.dark`, sem `useColorScheme`, sem adaptações). Isso abre espaço para que o sistema Android interfira no modo de cor esperado pelo app se o dispositivo estiver em dark mode.

---

## Solução

### Mudança 1: `app.json`

**a) Fixar `userInterfaceStyle` para `"light"`**

O design system do projeto tem apenas um conjunto de cores (tema claro). Fixar o modo elimina interferência do sistema operacional.

```diff
- "userInterfaceStyle": "automatic",
+ "userInterfaceStyle": "light",
```

**b) Adicionar plugin `expo-font` com os fonts dos ícones**

Embute os fonts de ícones diretamente no bundle nativo como assets — a abordagem idiomática do Expo SDK 54 para fonts customizadas em builds nativos.

```json
["expo-font", {
  "fonts": [
    "./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf",
    "./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf"
  ]
}]
```

### Mudança 2: `app/_layout.tsx`

Remover `...Ionicons.font` e `...FontAwesome.font` do `useFonts`. Os fonts são agora gerenciados pelo plugin `expo-font` no `app.json` (builds nativos) e pelo Expo Go pré-bundled (desenvolvimento).

```tsx
const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  // Removidos: ...Ionicons.font, ...FontAwesome.font
});
```

Remover também os imports `Ionicons` e `FontAwesome` do `_layout.tsx`, já que não são mais usados nesse arquivo.

---

## Componentes Sem Mudanças

Os componentes `RatingBadge.tsx` e `ProductCard.tsx` estão corretos — o `color` prop é aplicado adequadamente. A lógica de estado em `useFavorites.ts` com `AsyncStorage` está correta.

---

## Resultado Esperado

- Estrela de avaliação renderiza em amarelo (`#F59E0B`) tanto na web quanto no Android.
- Coração favorito renderiza em vermelho (`#EF4444`) quando marcado, em ambas as plataformas.
- App segue o design system consistentemente em todas as plataformas.

---

## Arquivos Modificados

| Arquivo | Tipo de mudança |
|---|---|
| `app.json` | Adicionar plugin `expo-font`, mudar `userInterfaceStyle` |
| `app/_layout.tsx` | Remover fonts de ícones do `useFonts`, remover imports não usados |
