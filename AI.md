# AI.md — Uso de Inteligência Artificial no Desenvolvimento

## Ferramenta Utilizada

**Cursor IDE** com o modelo **Claude Sonnet 4.6** (Anthropic), acessado via interface de chat do Cursor com o skill `/brainstorming` e `/writing-plans`.

## Partes do Desenvolvimento Assistidas por IA

| Etapa | Descrição |
|---|---|
| **Design spec** | A IA analisou os protótipos HTML e o DESIGN.md, extraiu os tokens do design system e redigiu o documento de especificação completo (`docs/superpowers/specs/`) |
| **Plano de implementação** | A IA criou o plano task-by-task com código completo para cada arquivo (`docs/superpowers/plans/`) |
| **Código base** | Todo o código foi gerado a partir do plano, com os componentes, hooks, serviços e telas do app |
| **Decisões de arquitetura** | AppContext, useMemo nos filtros, FlatList com numColumns, substituição do SVG por ActivityIndicator |

## Exemplo de Prompt Utilizado

> "Preciso construir um app React Native com Expo e TypeScript que consuma a API pública fakestoreapi.com. O app deve ter tela de listagem de produtos com busca local por nome, filtro por categoria carregado da API, tela de detalhes do produto com imagem, título, preço, descrição e avaliação, e tela de favoritos com persistência via AsyncStorage. Siga fielmente os protótipos HTML e o design system fornecidos. Use Axios para as chamadas HTTP, Expo Router para navegação, e implemente pull-to-refresh, loading skeleton, e mensagem de erro com retry. Antes de começar, crie a branch feature/omnishop-app."

A partir desse prompt inicial, a IA analisou os protótipos HTML e o `DESIGN.md`, propôs a arquitetura do projeto (design spec) e, após aprovação, gerou o plano de implementação task-by-task com código completo para cada arquivo. A execução foi feita via subagentes, um por tarefa, com commits atômicos.

## Ajustes Realizados Manualmente

- Verificação de compatibilidade de versões das dependências com Expo SDK 54
- Ajuste dos caminhos de arquivo para o sistema Windows
- Validação do comportamento do `AppContext` com múltiplas tabs montadas simultaneamente
- O cast `'auto' as any` no `marginTop` do ProductCard (limitação do tipo ViewStyle do React Native)
- Testes manuais no dispositivo para validar pull-to-refresh e persistência do AsyncStorage
