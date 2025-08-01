# Serviços da Viral Kids

Esta pasta contém toda a camada de serviços da aplicação Viral Kids, organizada de forma modular e escalável.

## Estrutura

```
src/services/
├── api/                    # Cliente HTTP e configurações base
│   ├── httpClient.ts      # Cliente HTTP centralizado
│   └── config.ts          # Configurações da API
├── auth/                  # Serviços de autenticação
│   └── authService.ts     # Login, registro, gerenciamento de tokens
├── chatbot/               # Serviços do chatbot
│   └── chatbotService.ts  # Mensagens, leads, conversas
├── franchise/             # Serviços de franquias
│   └── franchiseService.ts # CRUD de franquias, aplicações
├── products/              # Serviços de produtos
│   └── productService.ts  # CRUD de produtos, categorias
└── index.ts               # Exportações centralizadas
```

## Serviços Disponíveis

### 1. AuthService
Gerencia autenticação e autorização dos usuários.

**Funcionalidades:**
- Login/Logout
- Registro de usuários
- Refresh de tokens
- Gerenciamento de perfil
- Esqueci minha senha
- Validação de tokens

**Uso:**
```typescript
import { AuthService } from '@/services';

// Login
const response = await AuthService.login({ email, password });

// Verificar se está autenticado
const isAuth = AuthService.isAuthenticated();
```

### 2. ChatbotService
Gerencia interações com o chatbot e leads.

**Funcionalidades:**
- Envio de mensagens
- Histórico de conversas
- Submissão de leads
- Processamento de respostas
- Armazenamento local (fallback)

**Uso:**
```typescript
import { ChatbotService } from '@/services';

// Enviar mensagem
const response = await ChatbotService.sendMessage('Olá!');

// Submeter lead
const lead = await ChatbotService.submitLead(leadData);
```

### 3. FranchiseService
Gerencia operações relacionadas a franquias.

**Funcionalidades:**
- CRUD de franquias
- Aplicações para franquias
- Estatísticas e métricas
- Filtros e busca
- Validação de dados

**Uso:**
```typescript
import { FranchiseService } from '@/services';

// Listar franquias
const franchises = await FranchiseService.listFranchises();

// Aplicar para franquia
const application = await FranchiseService.applyForFranchise(data);
```

### 4. ProductService
Gerencia operações relacionadas a produtos.

**Funcionalidades:**
- CRUD de produtos
- Categorias e subcategorias
- Busca e filtros
- Avaliações
- Upload de imagens
- Estatísticas

**Uso:**
```typescript
import { ProductService } from '@/services';

// Listar produtos
const products = await ProductService.listProducts();

// Buscar produtos
const results = await ProductService.searchProducts('brinquedo');
```

## Cliente HTTP

O `httpClient` é uma instância centralizada do Axios com:

- Interceptors para autenticação automática
- Tratamento de erros centralizado
- Timeout configurável
- Suporte a upload de arquivos
- Refresh automático de tokens

## Configuração

### Variáveis de Ambiente
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Endpoints
Todos os endpoints estão centralizados em `config.ts` para fácil manutenção.

## Padrões Utilizados

1. **Singleton Pattern**: Cada serviço é uma classe estática
2. **Repository Pattern**: Abstração da camada de dados
3. **Factory Pattern**: Criação de instâncias padronizadas
4. **Observer Pattern**: Notificações de mudanças de estado

## Tratamento de Erros

Todos os serviços retornam uma resposta padronizada:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
```

## Validação

Cada serviço possui métodos de validação para garantir a integridade dos dados:

```typescript
// Exemplo de validação
const validation = AuthService.validateLoginData(credentials);
if (!validation.isValid) {
  console.error(validation.errors);
}
```

## Fallback Local

Alguns serviços (como o ChatbotService) possuem armazenamento local como fallback quando a API não está disponível.

## Inicialização

Para inicializar todos os serviços:

```typescript
import { ServiceProvider } from '@/services';

// No início da aplicação
ServiceProvider.initialize();
```

## Limpeza de Dados

Para limpar todos os dados locais:

```typescript
ServiceProvider.clearAllData();
```

## Contribuição

Ao adicionar novos serviços:

1. Crie a pasta do serviço em `src/services/`
2. Implemente a classe do serviço
3. Adicione as interfaces TypeScript
4. Exporte no `index.ts`
5. Documente no README
6. Adicione testes unitários

## Testes

Cada serviço deve ter testes unitários cobrindo:
- Casos de sucesso
- Casos de erro
- Validações
- Fallbacks locais 