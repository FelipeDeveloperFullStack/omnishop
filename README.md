# OmniShop

Aplicativo mobile desenvolvido com React Native e Expo como teste técnico.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go instalado no celular (iOS/Android) **ou** Android Emulator/iOS Simulator

## Instalação

```bash
git clone <repo-url>
cd omnishop
npm install
```

## Execução

```bash
# Expo Go (celular físico via QR Code)
npx expo start

# Emulador Android
npx expo start --android

# Simulador iOS
npx expo start --ios
```

Escaneie o QR Code com o Expo Go (Android) ou a câmera (iOS).

## Tecnologias

| Tecnologia                | Versão | Uso                      |
| ------------------------- | ------ | ------------------------ |
| React Native              | 0.81.5 | Framework mobile         |
| Expo                      | ~54.0  | SDK e toolchain          |
| TypeScript                | ~5.9   | Tipagem estática         |
| Expo Router               | ~6.0   | Navegação file-based     |
| Axios                     | ^1.x   | Requisições HTTP         |
| AsyncStorage              | ^2.x   | Persistência local       |
| Inter (expo-google-fonts) | latest | Tipografia               |
| expo-image                | ~3.0   | Exibição de imagens      |
| react-native-reanimated   | ~4.1   | Animações (SkeletonCard) |

**API:** [fakestoreapi.com](https://fakestoreapi.com)

## Decisões Técnicas

### Expo Router (file-based routing)

Escolhido por ser o padrão atual do Expo SDK 54, integra React Navigation nativamente via sistema de arquivos. A estrutura `app/(tabs)/` com `app/product/[id].tsx` é legível e escalável.

### AppContext para estado compartilhado

`index.tsx` e `favorites.tsx` são montadas simultaneamente como tabs. O `AppContext` centraliza os hooks `useProducts` e `useFavorites` para evitar chamadas duplicadas à API e manter favoritos em sincronia entre telas.

### FlatList com numColumns={2}

Garante recycling de células (virtual list), essencial para listas longas. Utiliza `initialNumToRender`, `maxToRenderPerBatch` e `windowSize` para controle fino de renderização.

### useMemo para filtros locais

Busca e filtro por categoria são operações locais sobre os dados já carregados. O `useMemo` garante que a lista filtrada só é recalculada quando `products`, `searchQuery` ou `selectedCategory` mudam.

### expo-image em vez de Image do RN

Cache automático de imagens, transições suaves, suporte a `contentFit`, e melhor performance geral no carregamento de imagens de produto.

### Skeleton loading em vez de spinner

O skeleton (placeholder animado) dá feedback imediato ao usuário sobre a estrutura da lista antes dos dados chegarem, reduzindo a percepção de latência.

## Limitações Conhecidas

- A API não tem autenticação; em produção, um backend próprio seria necessário.
- Os dados da API estão em inglês (títulos, categorias, descrições).
- Não há paginação real — todos os produtos são carregados de uma vez (~20 itens).
- Sem modo offline além dos favoritos persistidos.
- O spinner duplo do protótipo HTML usa SVG; foi substituído por `ActivityIndicator` nativo para evitar a dependência `react-native-svg`.

## Performance e Boas Práticas

- **FlatList virtualizada** com `numColumns={2}` para listas de produtos
- **useMemo** nos filtros de busca e categoria
- **useCallback** nos handlers de toggle favorito e refresh
- **expo-image** para cache e lazy loading de imagens
- **Skeleton** para loading state com melhor percepção de velocidade
- **AsyncStorage** lido uma única vez no mount; escritas são assíncronas e não bloqueiam a UI
- **TypeScript strict** em todo o projeto
