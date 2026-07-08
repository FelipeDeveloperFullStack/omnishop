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

O prompt abaixo foi enviado após a aprovação da design spec, para iniciar o plano de implementação:

> "Com base na spec aprovada, crie o plano de implementação completo task-by-task. Cada task deve especificar os arquivos a criar ou modificar, o código exato de cada um e a mensagem de commit. Siga a ordem de dependências: tipos e constantes primeiro, depois serviços, hooks, contexto, componentes atômicos, componentes compostos e por fim as telas. Garanta que cada task seja atômica e que o app esteja funcional ao final de cada etapa."

A partir desse prompt, a IA gerou um plano com 21 tasks cobrindo toda a implementação. A execução foi feita via subagentes, um por tarefa, com commits atômicos em cada etapa.

## Ajustes Realizados Manualmente

- Verificação de compatibilidade de versões das dependências com Expo SDK 54
- Ajuste dos caminhos de arquivo para o sistema Windows
- Validação do comportamento do `AppContext` com múltiplas tabs montadas simultaneamente
- O cast `'auto' as any` no `marginTop` do ProductCard (limitação do tipo ViewStyle do React Native)
- Testes manuais no dispositivo para validar pull-to-refresh e persistência do AsyncStorage
