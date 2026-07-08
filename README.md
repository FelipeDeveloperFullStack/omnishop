# OmniShop

Aplicativo mobile de catálogo de produtos desenvolvido com React Native e Expo como teste técnico. Consome a [Fake Store API](https://fakestoreapi.com) e permite listar, buscar, filtrar por categoria e favoritar produtos com persistência local.

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- **Expo Go** instalado no celular (iOS/Android) **ou** Android Emulator/iOS Simulator

---

## Instalação e Execução

```bash
git clone https://github.com/FelipeDeveloperFullStack/omnishop.git
cd omnishop
npm install
```

```bash
# Iniciar (Expo Go via QR Code)
npx expo start

# Emulador Android
npx expo start --android

# Simulador iOS
npx expo start --ios
```

Ao executar `npx expo start`, escaneie o QR Code com o Expo Go (Android) ou com a câmera nativa (iOS).

---

## Estrutura de Pastas

```
omnishop/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Configuração das abas (Produtos / Favoritos)
│   │   ├── index.tsx         # Tela de listagem de produtos
│   │   └── favorites.tsx     # Tela de favoritos
│   ├── product/
│   │   └── [id].tsx          # Tela de detalhe do produto
│   └── _layout.tsx           # Root layout (fontes, contexto, splash)
├── components/               # Componentes reutilizáveis
├── constants/                # Design tokens (cores, tipografia, espaçamentos)
├── context/
│   └── AppContext.tsx         # Estado global compartilhado
├── hooks/
│   ├── useFavorites.ts        # Lógica de favoritos + AsyncStorage
│   └── useProducts.ts         # Fetch de produtos + filtros
├── services/
│   └── api.ts                 # Camada de acesso à API (Axios)
└── types/                     # Tipos TypeScript globais
```

---

## Tecnologias Utilizadas

| Tecnologia                     | Versão | Uso                                        |
| ------------------------------ | ------ | ------------------------------------------ |
| React Native                   | 0.81.5 | Framework mobile                           |
| Expo                           | ~54.0  | SDK e toolchain                            |
| TypeScript                     | ~5.9   | Tipagem estática em todo o projeto         |
| Expo Router                    | ~6.0   | Navegação file-based                       |
| Axios                          | ^1.18  | Requisições HTTP à Fake Store API          |
| AsyncStorage                   | 2.2.0  | Persistência local dos favoritos           |
| expo-image                     | ~3.0   | Exibição de imagens com cache automático   |
| @expo-google-fonts/inter       | ^0.4.2 | Tipografia Inter (400, 600, 700)           |
| expo-haptics                   | ~15.0  | Feedback tátil ao favoritar/desfavoritar   |
| react-native-reanimated        | ~4.1   | Animações do SkeletonCard                  |
| react-native-safe-area-context | ~5.6   | Safe area em iOS e Android                 |
| react-native-gesture-handler   | ~2.28  | Suporte a gestos (base do Expo Router)     |
| react-native-svg               | 15.12  | Renderização de SVGs (lucide-react-native) |
| lucide-react-native            | ^1.23  | Ícones de produto e interface              |
| @expo/vector-icons             | ^15.0  | Ícones Ionicons (navegação, favoritos)     |

**API:** [fakestoreapi.com](https://fakestoreapi.com)

---

## Decisões Técnicas

### Expo Router com file-based routing

Padrão oficial do Expo SDK 54. A estrutura `app/(tabs)/` com `app/product/[id].tsx` torna a navegação legível e escalável sem configuração manual de stacks/tabs.

### AppContext para estado compartilhado

As tabs `index.tsx` e `favorites.tsx` são montadas simultaneamente. O `AppContext` centraliza os hooks `useProducts` e `useFavorites`, evitando chamadas duplicadas à API e mantendo o estado de favoritos sincronizado entre as telas sem prop drilling.

### FlatList virtualizada com numColumns={2}

A listagem de produtos usa `FlatList` com `numColumns={2}`, garantindo recycling automático de células. Os parâmetros `initialNumToRender`, `maxToRenderPerBatch` e `windowSize` controlam o volume de renderização por ciclo, reduzindo jank em dispositivos mais lentos.

### useMemo para filtros locais

Busca e filtro por categoria operam sobre os dados já carregados em memória. O `useMemo` garante que a lista filtrada só é recomputada quando `products`, `searchQuery` ou `selectedCategory` mudam, evitando recálculos desnecessários a cada re-render.

### ListHeaderComponent extraído em nível de módulo

O componente de cabeçalho da `FlatList` (busca + chips de categoria) é definido fora do componente pai para manter a referência estável. Isso evita que a `FlatList` desmonte e remonte o `TextInput` a cada keystroke, o que fecharia o teclado virtual.

### expo-image em vez de Image do React Native

Cache automático de imagens, transições suaves (`transition={300}`), suporte a `contentFit` e melhor performance geral no carregamento de imagens de produto vindas de URLs externas.

### Skeleton loading em vez de spinner genérico

O `SkeletonCard` (placeholder animado via `react-native-reanimated`) entrega feedback imediato sobre a estrutura da lista antes dos dados chegarem, reduzindo a percepção de latência.

### Design tokens centralizados

Cores, tipografia e espaçamentos estão em `constants/colors.ts` e `constants/typography.ts`. Isso garante consistência visual em toda a aplicação e facilita mudanças globais de tema em um único lugar.

### Layout responsivo para tablets

A tela de detalhe usa `useWindowDimensions` para detectar tablets (largura ≥ 768 dp) e ajusta o tamanho da imagem hero e a largura máxima do conteúdo. O botão de favorito também é centralizado e limitado em tablets.

### expo-haptics para feedback tátil

Ao favoritar ou desfavoritar um produto, o `expo-haptics` emite um feedback tátil leve (`impactAsync(Light)`), tornando a interação mais responsiva e satisfatória sem custo de performance.

---

## Limitações Conhecidas

- A API não possui autenticação; em produção, um backend próprio seria necessário.
- Os dados (títulos, categorias, descrições) estão em inglês — a API não oferece i18n.
- Não há paginação real: todos os produtos (~20 itens) são carregados em uma única requisição.
- Sem suporte a modo offline além dos IDs de favoritos já persistidos localmente.
- Sem testes automatizados (unitários ou E2E) no escopo deste teste técnico.

---

## Performance e Boas Práticas

- **FlatList virtualizada** com `numColumns={2}` e parâmetros de batch tuning para evitar jank
- **useMemo** nos filtros de busca e categoria para evitar recálculos desnecessários
- **useCallback** em todos os handlers de evento (toggle favorito, retry, refresh)
- **ListHeaderComponent** definido fora do escopo do pai para referência estável (evita unmount do TextInput)
- **expo-image** para cache e lazy loading de imagens externas
- **Skeleton loading** para reduzir percepção de latência no carregamento inicial
- **AsyncStorage** lido uma única vez no mount; escritas são assíncronas e não bloqueiam a UI
- **Design tokens** centralizados em `constants/` para consistência visual e facilidade de manutenção
- **expo-haptics** para feedback tátil sem overhead de performance
- **TypeScript strict** em todo o projeto com tipagem forte nos contratos de API e componentes
