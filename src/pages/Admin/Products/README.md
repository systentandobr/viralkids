# 📦 Sistema de Gerenciamento de Produtos Afiliados

Sistema completo para cadastro e processamento automático de produtos afiliados via webscraping.

## 🎯 Funcionalidades Implementadas

### ✅ Frontend (React/TypeScript)

1. **Gerenciamento de Categorias**
   - Componente `CategoryManager` com dialog
   - Criar, editar, remover categorias
   - Listagem com status e contagem de produtos
   - Suporte a seleção múltipla

2. **Cadastro de Produtos Afiliados**
   - Componente `AffiliateProductForm`
   - Detecção automática de plataforma
   - Validação de URL
   - Integração com gerenciamento de categorias

3. **Status de Processamento**
   - Componente `ProcessingStatusTab` com abas
   - Métricas em tempo real
   - Filtros por status e plataforma
   - Botão de retry para produtos falhados
   - Atualização automática a cada 5 segundos

4. **Integração com API**
   - Serviços `CategoryService` e `AffiliateProductService`
   - React Query para cache e sincronização
   - Toasts para feedback do usuário

### ✅ Backend Node.js (NestJS)

1. **Schema e DTOs**
   - `AffiliateProductSchema` com MongoDB
   - DTOs para criação, atualização e query
   - Validação de dados

2. **Service Layer**
   - `AffiliateProductService` com lógica de negócio
   - Integração com Python Scraper API
   - Processamento assíncrono em background
   - Retry logic automático

3. **Controller**
   - Endpoints RESTful completos
   - Autenticação JWT
   - Filtros e paginação
   - Endpoint de métricas

### ✅ Backend Python (FastAPI)

1. **Product Scraper Agent**
   - Classe `ProductScraperAgent` usando Agno
   - Suporte a múltiplas plataformas
   - Webscraping com BeautifulSoup
   - Enriquecimento de dados com AI

2. **API Endpoints**
   - `/scrape` - Scraping síncrono
   - `/scrape/async` - Scraping assíncrono
   - Health check

## 🔄 Fluxo Completo

```
1. Usuário cadastra produto afiliado no frontend
   ↓
2. Frontend → POST /affiliate-products (Node.js)
   ↓
3. Node.js cria registro com status "pending"
   ↓
4. Node.js → POST /scrape (Python)
   ↓
5. Python faz webscraping do link
   ↓
6. Python retorna dados estruturados
   ↓
7. Node.js cria produto completo na collection
   ↓
8. Status atualizado para "completed"
   ↓
9. Frontend atualiza automaticamente (React Query)
```

## 📋 Próximos Passos

### Backend Node.js

1. **Criar endpoints de categorias** (se ainda não existir):
   ```typescript
   GET    /categories
   POST   /categories
   PATCH  /categories/:id
   DELETE /categories/:id
   ```

2. **Configurar variáveis de ambiente**:
   ```env
   SCRAPER_API_URL=http://localhost:8002
   ```

3. **Instalar dependências**:
   ```bash
   npm install axios
   ```

### Backend Python

1. **Instalar dependências**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar variáveis de ambiente**:
   ```env
   SCRAPER_PORT=8002
   GROQ_API_KEY=sua-chave-aqui
   ```

3. **Iniciar servidor**:
   ```bash
   python api_product_scraper.py
   ```

### Frontend

1. **Configurar endpoints da API** em `src/services/api/endpoints.ts`:
   ```typescript
   AFFILIATE_PRODUCTS: {
     LIST: '/affiliate-products',
     CREATE: '/affiliate-products',
     METRICS: '/affiliate-products/metrics',
     RETRY: (id: string) => `/affiliate-products/${id}/retry`,
   },
   CATEGORIES: {
     LIST: '/categories',
     CREATE: '/categories',
     UPDATE: (id: string) => `/categories/${id}`,
     DELETE: (id: string) => `/categories/${id}`,
   },
   ```

2. **Verificar se React Query está configurado** no `App.tsx` ou `providers.tsx`

## 🧪 Testando

1. **Iniciar Python Scraper**:
   ```bash
   cd backend-monorepo/python/viralkids
   python api_product_scraper.py
   ```

2. **Iniciar Node.js API**:
   ```bash
   cd backend-monorepo/nodejs/apis/apps/sys-produtos
   npm run start:dev
   ```

3. **Iniciar Frontend**:
   ```bash
   pnpm dev
   ```

4. **Testar fluxo**:
   - Acessar `/admin/products`
   - Ir para aba "Produtos Afiliados"
   - Cadastrar um produto com URL válida
   - Verificar status na aba "Status Processamento"

## 📝 Notas Importantes

- O webscraping pode falhar se a estrutura HTML do site mudar
- Alguns sites podem bloquear requisições automatizadas
- Recomenda-se usar proxies ou rate limiting em produção
- O Agno é usado para enriquecer dados, mas pode ser opcional
- O processamento é assíncrono para não bloquear a API

## 🔒 Segurança

- Todos os endpoints requerem autenticação JWT
- Validação de URLs e dados de entrada
- Rate limiting recomendado
- Sanitização de dados extraídos

