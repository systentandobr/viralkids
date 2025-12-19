# Componente de Gerenciamento de Instruções RAG

Este componente permite gerenciar instruções RAG (Retrieval-Augmented Generation) que alimentam a base de conhecimento do chatbot.

## Funcionalidades

- ✅ Listar todas as instruções da unidade do usuário autenticado
- ✅ Criar instruções a partir de texto direto
- ✅ Criar instruções a partir de URLs (web scraping)
- ✅ Criar instruções a partir de PDFs (upload)
- ✅ Editar instruções existentes
- ✅ Excluir instruções
- ✅ Reindexar instruções no sistema RAG
- ✅ Visualizar status de processamento e indexação

## Uso

```tsx
import { RagInstructionsManager } from '@/components/rag-instructions';

function MyPage() {
  return (
    <div>
      <RagInstructionsManager />
    </div>
  );
}
```

## Componentes

### RagInstructionsManager

Componente principal que gerencia todas as instruções RAG.

**Props:** Nenhuma (usa o contexto do usuário autenticado para obter o unitId)

### AddInstructionDialog

Diálogo para adicionar novas instruções com três abas:
- **Texto**: Editor de texto simples para digitar instruções
- **URL**: Campo para inserir URL de página web ou PDF online
- **PDF**: Upload de arquivo PDF

**Props:**
- `open: boolean` - Controla se o diálogo está aberto
- `onClose: () => void` - Callback quando o diálogo é fechado
- `onSuccess: () => void` - Callback quando uma instrução é criada com sucesso

### EditInstructionDialog

Diálogo para editar instruções existentes.

**Props:**
- `open: boolean` - Controla se o diálogo está aberto
- `instruction: RagInstruction | null` - Instrução a ser editada
- `onClose: () => void` - Callback quando o diálogo é fechado
- `onSuccess: () => void` - Callback quando a instrução é atualizada com sucesso

### InstructionCard

Card para exibir informações de uma instrução.

**Props:**
- `instruction: RagInstruction` - Instrução a ser exibida
- `onEdit?: () => void` - Callback para editar
- `onDelete?: () => void` - Callback para excluir
- `onReindex?: () => void` - Callback para reindexar

## Serviço

O serviço `ragInstructionsService` está disponível em `@/services/api/rag-instructions.service.ts` e fornece os seguintes métodos:

- `findAll()` - Lista todas as instruções
- `findOne(id)` - Busca uma instrução por ID
- `findByUnitId(unitId)` - Busca instruções por unitId
- `createFromText(data)` - Cria instrução a partir de texto
- `createFromUrl(data)` - Cria instrução a partir de URL
- `createFromPdf(file, data)` - Cria instrução a partir de PDF
- `update(id, data)` - Atualiza uma instrução
- `delete(id)` - Deleta uma instrução
- `reindex(id)` - Reindexa uma instrução no RAG
- `getContext(unitId)` - Obtém contexto adicional

## Fluxo de Trabalho

1. **Criar Instrução**: O usuário clica em "Adicionar Instrução" e escolhe o tipo (texto, URL ou PDF)
2. **Processamento**: O backend processa o conteúdo:
   - Texto: Divide em chunks automaticamente
   - URL: Faz web scraping e extrai conteúdo
   - PDF: Extrai texto do PDF
3. **Indexação**: Se `indexInRAG` estiver ativado, o conteúdo é indexado no sistema RAG
4. **Visualização**: As instruções aparecem na lista com status de processamento e indexação

## Status de Processamento

- `pending` - Aguardando processamento
- `processing` - Em processamento
- `completed` - Processado com sucesso
- `failed` - Falha no processamento

## Status de Indexação

- **Indexada**: Instrução foi indexada no sistema RAG (ícone verde)
- **Não Indexada**: Instrução ainda não foi indexada (ícone amarelo)

## Limitações

- Upload de PDF limitado a 10MB
- Apenas arquivos PDF são aceitos no upload
- URLs devem ser válidas e acessíveis

## Integração com Backend

O componente se comunica com a API através dos endpoints definidos em `@/services/api/endpoints.ts`:

- `POST /rag-instructions/from-text`
- `POST /rag-instructions/from-url`
- `POST /rag-instructions/from-pdf`
- `GET /rag-instructions`
- `PUT /rag-instructions/:id`
- `DELETE /rag-instructions/:id`
- `POST /rag-instructions/:id/reindex`

O `unitId` é extraído automaticamente do token JWT do usuário autenticado.
