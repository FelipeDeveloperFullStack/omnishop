# OmniShop App — Design Spec

**Data:** 2026-07-07  
**Projeto:** Teste técnico React Native — OmniShop  
**Status:** Aprovado

---

## 1. Visão Geral

Aplicativo React Native com Expo que consome a API pública [fakestoreapi.com](https://fakestoreapi.com) para exibir uma loja de produtos com funcionalidades de busca, filtro por categoria, visualização de detalhes e lista de favoritos persistidos localmente.

---

## 2. Tecnologias Obrigatórias

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.34 | Toolchain / SDK |
| TypeScript | ~5.9.2 | Tipagem estática |
| Expo Router | ~6.0.23 | React Navigation (file-based) |
| Axios | latest | HTTP client para a API |
| AsyncStorage | latest | Persistência local de favoritos |
| Inter (expo-font) | via Google Fonts | Tipografia do design system |

---

## 3. Estrutura de Arquivos

```
app/
  _layout.tsx                  ← Root layout (fontes, SafeArea, StatusBar)
  (tabs)/
    _layout.tsx                ← Tab Navigator (2 abas: Home e Favoritos)
    index.tsx                  ← Tela de Produtos (lista principal)
    favorites.tsx              ← Tela de Favoritos
  product/
    [id].tsx                   ← Tela de Detalhes do Produto

constants/
  colors.ts                    ← Tokens de cor do design system
  typography.ts                ← Estilos de texto (headline-lg, body-md, etc.)

services/
  api.ts                       ← Axios instance + funções de fetch da API

hooks/
  useProducts.ts               ← Estado de produtos + categorias + loading/error
  useFavorites.ts              ← CRUD de favoritos + AsyncStorage

components/
  ProductCard.tsx              ← Card de produto (grid 2 colunas)
  SearchBar.tsx                ← Input de busca com ícone
  CategoryChips.tsx            ← Chips de categoria (ScrollView horizontal)
  SkeletonCard.tsx             ← Placeholder animado para loading
  ErrorState.tsx               ← Tela de erro com ícone e botão retry
  EmptyState.tsx               ← Estado vazio (para tela de favoritos)
  LoadingSpinner.tsx           ← Spinner centralizado (dois anéis animados)
  RatingBadge.tsx              ← Exibe estrela + nota + contagem
```

---

## 4. Design System (Lumina Commerce)

### 4.1 Cores

```ts
// constants/colors.ts
export const Colors = {
  primary:                   '#0058be',
  onPrimary:                 '#ffffff',
  primaryContainer:          '#2170e4',
  onPrimaryContainer:        '#fefcff',
  secondary:                 '#855300',
  onSecondary:               '#ffffff',
  secondaryContainer:        '#fea619',   // estrelas de rating
  tertiary:                  '#b61722',
  error:                     '#ba1a1a',   // coração de favorito ativo
  onError:                   '#ffffff',
  errorContainer:            '#ffdad6',
  surface:                   '#f9f9ff',   // background geral
  surfaceContainerLowest:    '#ffffff',   // cards
  surfaceContainerLow:       '#f0f3ff',   // input background
  surfaceContainer:          '#e7eefe',
  surfaceContainerHigh:      '#e2e8f8',
  surfaceContainerHighest:   '#dce2f3',
  onSurface:                 '#151c27',
  onSurfaceVariant:          '#424754',
  outlineVariant:            '#c2c6d6',
  outline:                   '#727785',
  inverseSurface:            '#2a313d',
  inverseOnSurface:          '#ebf1ff',
};
```

### 4.2 Tipografia

Fonte: **Inter** (carregada via `expo-font` + `useFonts`).

| Token | Size | Weight | Line Height |
|---|---|---|---|
| `headline-xl` | 32px | 700 | 40px |
| `headline-lg` | 24px | 700 | 32px |
| `headline-lg-mobile` | 20px | 700 | 28px |
| `headline-md` | 18px | 600 | 24px |
| `body-lg` | 16px | 400 | 24px |
| `body-md` | 14px | 400 | 20px |
| `label-md` | 12px | 600 | 16px |
| `price-display` | 20px | 700 | 24px |

### 4.3 Espaçamento (base 4px)

| Token | Valor |
|---|---|
| `stack-sm` | 8px |
| `stack-md` | 16px |
| `stack-lg` | 24px |
| `container-padding` | 16px |
| `gutter` | 12px (gap entre colunas do grid) |

### 4.4 Bordas Arredondadas

| Escala | Valor |
|---|---|
| Pequeno (tags, checkboxes) | 4px |
| Padrão (cards, inputs, botões) | 12px |
| Chips de categoria | 9999px (pill) |
| Bottom sheets, banners | 16–24px |

### 4.5 Elevação / Sombras

- **Cards:** `shadowOffset: {0, 4}`, `shadowRadius: 12`, `shadowOpacity: 0.05`
- **Header:** mesma sombra, aplicada para baixo
- **Bottom Nav:** sombra para cima, mesma intensidade

---

## 5. Telas

### 5.1 Tela de Produtos (Home)

**Header fixo (sticky):**
- Background: `surface` com sombra suave
- Título centralizado: "OmniShop" em `headline-lg-mobile`, cor `primary`
- Ícone de menu (esquerda) e ícone de carrinho (direita) em `onSurfaceVariant`

**Corpo:**
- `SearchBar`: campo branco, borda `outlineVariant`, ícone `search` à esquerda, placeholder "Buscar produtos..." em `onSurfaceVariant`
- `CategoryChips`: ScrollView horizontal, chip "Tudo" (ativo: `primary` + texto branco, inativo: `surfaceContainerHigh` + `onSurfaceVariant`), chips de cada categoria da API
- Grid 2 colunas, gutter 12px, `ProductCard` para cada produto

**Estados:**
- **Loading:** `SkeletonCard` em grid 2×3 (6 placeholders animados com pulse)
- **Erro:** `ErrorState` com ícone `error` em `errorContainer`, mensagem amigável, botão "Tentar Novamente" pill
- **Pull to Refresh:** `RefreshControl` nativo com cor `primary`

### 5.2 ProductCard

- Background: `surfaceContainerLowest` (branco)
- Border radius: 12px
- Sombra suave
- Imagem quadrada (aspect-ratio 1:1), `object-fit: contain`, background `surfaceContainerLow`
- Botão coração no canto superior direito: fundo `surface/80` (semitransparente), ícone `favorite` — inativo: outline `onSurfaceVariant`, ativo: filled `error`
- Badge de categoria: `label-md`, cor `secondary`, uppercase
- Título: `body-md` semibold, máximo 2 linhas com ellipsis
- Rating: ícone estrela filled `secondaryContainer`, texto `label-md` em `onSurfaceVariant`
- Preço: `price-display`, cor `primary`

### 5.3 Tela de Detalhes do Produto

**Header fixo:**
- Botão `arrow_back` (esquerda), título "Detalhes" centralizado em `primary`, espaço vazio (direita)

**Imagem hero:**
- Largura total, aspect ratio 1:1
- Abaixo da imagem: painel branco com `borderTopRadius: 16px`, `marginTop: -16px`, `z-index > imagem`

**Painel de detalhes:**
- Badge de categoria (pill `surfaceContainer` + texto `primary`)
- Rating à direita: estrela `secondaryContainer` + texto
- Título: `headline-lg-mobile`
- Preço: `price-display`, cor `primary`
- Divisor: 1px `outlineVariant/30`
- Seção "Sobre o Produto": título `headline-md`, texto `body-md` em `onSurfaceVariant`

**Botão fixo na base:**
- Altura 48px, fundo `primary` (#0058be), texto branco, border radius 12px
- Texto muda entre "Adicionar aos Favoritos" e "Remover dos Favoritos" conforme estado
- Ícone `favorite` (filled quando ativo)

### 5.4 Tela de Favoritos

**Header fixo:**
- Título centralizado "Meus Favoritos" em `primary`

**Com produtos:**
- Mesma grid 2 colunas do Home, mas sem SearchBar e CategoryChips
- Ícone do coração sempre filled/vermelho (todos são favoritos)

**Estado vazio:**
- Ícone `heart_broken` em círculo com borda `surfaceVariant`, fundo `surfaceContainerLowest`
- Título: "Sua lista está vazia"
- Texto: "Você ainda não adicionou nenhum produto..."
- Botão "Explorar Produtos" → navega para tab Home

### 5.5 Loading State

- Overlay centralizado com fundo `surface/80` + blur
- Container branco, border radius 12px, sombra
- Dois SVG circulares animados: anel externo `outlineVariant`, anel interno `primary` com `stroke-dasharray`
- Texto: "Carregando produtos..." em `body-lg`, cor `onSurfaceVariant`

### 5.6 Error State

- Container centralizado
- Círculo `errorContainer` (96px) com ícone `error` filled em `error`
- Título: "Ops! Algo deu errado" — `headline-md`
- Texto: mensagem amigável — `body-md` em `onSurfaceVariant`
- Botão pill `primary` "Tentar Novamente" com ícone `refresh`

---

## 6. Navegação

Expo Router com tab navigation (2 abas):

| Tab | Ícone inativo | Ícone ativo | Rota |
|---|---|---|---|
| Home | `home` (outline) | `home` (filled) | `/(tabs)/` |
| Favoritos | `favorite` (outline) | `favorite` (filled) | `/(tabs)/favorites` |

**Tab ativo:** background `primaryContainer`, texto `onPrimary` (pill/rounded-lg)  
**Tab inativo:** sem background, texto `onSurfaceVariant`

**Navegação para detalhes:** `router.push('/product/[id]')` — rota de stack sobre as tabs

---

## 7. Serviços e Hooks

### 7.1 `services/api.ts`

```ts
import axios from 'axios';
const api = axios.create({ baseURL: 'https://fakestoreapi.com' });
// Funções: getProducts(), getProduct(id), getCategories(), getProductsByCategory(cat)
```

### 7.2 `hooks/useProducts.ts`

Estado gerenciado: `products`, `categories`, `loading`, `error`, `refresh`.  
Lógica: fetch inicial, filtro local por nome (busca), filtro por categoria, pull-to-refresh via callback `onRefresh`.

### 7.3 `hooks/useFavorites.ts`

AsyncStorage key: `@omnishop:favorites`  
Persiste `Set<number>` de IDs de produtos favoritos.  
API pública: `favorites[]`, `isFavorite(id)`, `toggleFavorite(id)`.

---

## 8. Performance e Boas Práticas

- **FlatList** com `numColumns={2}` em vez de ScrollView manual (recycling de células, `keyExtractor`, `initialNumToRender`)
- **useMemo** para filtros locais (busca + categoria) — evita refiltragem a cada render
- **useCallback** em handlers como `onRefresh`, `onToggleFavorite`
- **expo-image** (já instalado) no lugar de `<Image>` do RN — melhor cache e performance
- Skeleton em vez de spinner durante carregamento inicial — percepção de velocidade
- Busca local (não dispara nova requisição) — baixa latência
- AsyncStorage lido uma única vez no mount do hook; escritas são assíncronas e não bloqueiam a UI

---

## 9. Tratamento de Erros

- Qualquer falha no Axios é capturada e transforma o estado em `error: true`
- Usuário vê `ErrorState` com botão "Tentar Novamente" que chama `refetch()`
- Favoritos: falha no AsyncStorage é capturada silenciosamente com `console.error` (não crítico para UX)

---

## 10. Documentação Obrigatória

### README.md
- Instruções de execução (`npx expo start`)
- Tecnologias e versões
- Decisões técnicas (Expo Router, FlatList, expo-image, useMemo)
- Limitações (API sem autenticação, sem paginação real, dados em inglês)
- Performance e boas práticas

### AI.md
- Ferramentas utilizadas: Cursor (Claude Sonnet 4.6)
- Partes do desenvolvimento assistidas por IA: design spec, arquitetura, código base
- Exemplo de prompt
- Ajustes realizados manualmente
