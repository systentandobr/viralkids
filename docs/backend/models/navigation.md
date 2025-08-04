# 🧭 MODELO DE NAVEGAÇÃO
## Estruturas para Rastreamento e Histórico de Navegação

### 🎯 **Objetivo**
Definir os modelos de dados para suportar o Navigation Store do frontend, incluindo rastreamento de produtos visitados, histórico de páginas e breadcrumbs.

---

## 📋 **Modelo Principal - NavigationSession**

### **Estrutura Base**
```json
{
  "id": "string",
  "userId": "string",
  "sessionId": "string",
  "startedAt": "datetime",
  "lastActivity": "datetime",
  "deviceInfo": {
    "userAgent": "string",
    "ip": "string",
    "deviceType": "string"
  },
  "status": "string"
}
```

### **Status da Sessão**
- `active`: Sessão ativa
- `expired`: Sessão expirada
- `closed`: Sessão fechada

---

## 👁️ **Modelo de Produtos Visitados - VisitedProduct**

### **Estrutura**
```json
{
  "id": "string",
  "userId": "string",
  "productId": "string",
  "visitedAt": "datetime",
  "duration": "number",
  "source": "string",
  "interactions": {
    "viewedImages": "boolean",
    "readDescription": "boolean",
    "checkedReviews": "boolean",
    "addedToCart": "boolean",
    "addedToWishlist": "boolean"
  },
  "metadata": {
    "referrer": "string",
    "searchTerm": "string",
    "category": "string"
  }
}
```

### **Fontes de Visita**
- `search`: Resultado de busca
- `category`: Navegação por categoria
- `related`: Produto relacionado
- `featured`: Produto em destaque
- `direct`: Acesso direto

### **Interações Rastreadas**
- `viewedImages`: Visualizou galeria de imagens
- `readDescription`: Leu descrição completa
- `checkedReviews`: Visualizou avaliações
- `addedToCart`: Adicionou ao carrinho
- `addedToWishlist`: Adicionou aos favoritos

---

## 📄 **Modelo de Páginas Visitadas - VisitedPage**

### **Estrutura**
```json
{
  "id": "string",
  "userId": "string",
  "sessionId": "string",
  "path": "string",
  "title": "string",
  "visitedAt": "datetime",
  "duration": "number",
  "referrer": "string",
  "pageType": "string",
  "metadata": {
    "queryParams": "object",
    "fragment": "string",
    "scrollDepth": "number"
  }
}
```

### **Tipos de Página**
- `home`: Página inicial
- `product`: Página de produto
- `category`: Página de categoria
- `search`: Página de busca
- `checkout`: Página de checkout
- `cart`: Carrinho de compras
- `profile`: Perfil do usuário

---

## 🍞 **Modelo de Breadcrumbs - Breadcrumb**

### **Estrutura**
```json
{
  "id": "string",
  "userId": "string",
  "sessionId": "string",
  "path": "string",
  "breadcrumbs": [
    {
      "label": "string",
      "path": "string",
      "isActive": "boolean",
      "order": "number"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### **Exemplo de Breadcrumbs**
```json
{
  "breadcrumbs": [
    {
      "label": "Home",
      "path": "/",
      "isActive": false,
      "order": 1
    },
    {
      "label": "Roupas",
      "path": "/categoria/roupas",
      "isActive": false,
      "order": 2
    },
    {
      "label": "Camisetas",
      "path": "/categoria/roupas/camisetas",
      "isActive": false,
      "order": 3
    },
    {
      "label": "Camiseta Azul",
      "path": "/produto/camiseta-azul",
      "isActive": true,
      "order": 4
    }
  ]
}
```

---

## 🔍 **Modelo de Buscas - SearchHistory**

### **Estrutura**
```json
{
  "id": "string",
  "userId": "string",
  "sessionId": "string",
  "query": "string",
  "searchedAt": "datetime",
  "resultsCount": "number",
  "filters": {
    "category": "string",
    "brand": "string",
    "priceMin": "number",
    "priceMax": "number",
    "rating": "number",
    "availability": "string"
  },
  "results": [
    {
      "productId": "string",
      "position": "number",
      "clicked": "boolean"
    }
  ],
  "metadata": {
    "searchType": "string",
    "autocomplete": "boolean"
  }
}
```

### **Tipos de Busca**
- `text`: Busca por texto
- `filter`: Busca por filtros
- `autocomplete`: Busca automática
- `voice`: Busca por voz

---

## 📊 **Modelo de Analytics de Navegação - NavigationAnalytics**

### **Estrutura**
```json
{
  "userId": "string",
  "sessionId": "string",
  "metrics": {
    "totalPages": "number",
    "totalProducts": "number",
    "totalSearches": "number",
    "sessionDuration": "number",
    "averagePageTime": "number",
    "bounceRate": "number",
    "conversionRate": "number"
  },
  "behavior": {
    "mostVisitedCategories": ["string"],
    "mostSearchedTerms": ["string"],
    "preferredPriceRange": {
      "min": "number",
      "max": "number"
    },
    "preferredBrands": ["string"]
  },
  "lastUpdated": "datetime"
}
```

---

## 🎯 **Modelo de Recomendações - UserRecommendations**

### **Estrutura**
```json
{
  "userId": "string",
  "recommendations": [
    {
      "productId": "string",
      "score": "number",
      "reason": "string",
      "type": "string",
      "generatedAt": "datetime"
    }
  ],
  "preferences": {
    "categories": ["string"],
    "brands": ["string"],
    "priceRange": {
      "min": "number",
      "max": "number"
    },
    "sizes": ["string"],
    "colors": ["string"]
  },
  "lastUpdated": "datetime"
}
```

### **Tipos de Recomendação**
- `viewed_together`: Visualizados juntos
- `bought_together`: Comprados juntos
- `similar_category`: Categoria similar
- `similar_price`: Preço similar
- `trending`: Produtos em alta
- `personalized`: Personalizado por IA

---

## 🔄 **Endpoints de Navegação**

### **Rastrear Visita de Produto**
```http
POST /api/v1.0/navigation/track/product
Content-Type: application/json

{
  "userId": "string",
  "productId": "string",
  "source": "string",
  "interactions": "object",
  "metadata": "object"
}
```

### **Rastrear Visita de Página**
```http
POST /api/v1.0/navigation/track/page
Content-Type: application/json

{
  "userId": "string",
  "path": "string",
  "title": "string",
  "pageType": "string",
  "duration": "number",
  "metadata": "object"
}
```

### **Salvar Busca**
```http
POST /api/v1.0/navigation/search
Content-Type: application/json

{
  "userId": "string",
  "query": "string",
  "filters": "object",
  "resultsCount": "number",
  "results": "array"
}
```

### **Obter Histórico**
```http
GET /api/v1.0/navigation/history?userId=string&type=string&limit=number
```

### **Obter Produtos Visitados**
```http
GET /api/v1.0/navigation/visited-products?userId=string&limit=number
```

### **Obter Recomendações**
```http
GET /api/v1.0/navigation/recommendations?userId=string&limit=number
```

---

## 📈 **Métricas de Performance**

### **Indicadores de Navegação**
- **Tempo médio de sessão**: Duração média das sessões
- **Páginas por sessão**: Média de páginas visitadas
- **Taxa de rejeição**: Sessões com apenas uma página
- **Conversão por fonte**: Taxa de conversão por origem
- **Produtos mais visualizados**: Ranking de produtos

### **Indicadores de Busca**
- **Termos mais buscados**: Palavras-chave populares
- **Taxa de cliques**: Clicks em resultados de busca
- **Busca sem resultados**: Termos sem correspondência
- **Busca por voz**: Uso de busca por voz

### **Indicadores de Recomendação**
- **Taxa de aceitação**: Produtos recomendados comprados
- **Score médio**: Pontuação média das recomendações
- **Diversidade**: Variedade de produtos recomendados
- **Personalização**: Efetividade da personalização

---

## 🔒 **Segurança e Privacidade**

### **Dados Sensíveis**
- IP do usuário (anônimo após 30 dias)
- User Agent (sem informações pessoais)
- Histórico de navegação (com consentimento)

### **Retenção de Dados**
- Sessões: 90 dias
- Histórico de produtos: 1 ano
- Buscas: 6 meses
- Analytics agregados: 2 anos

### **Conformidade LGPD**
- Consentimento explícito para tracking
- Direito de exclusão de dados
- Portabilidade de dados
- Transparência no uso

---

## 🚀 **Otimizações**

### **Cache**
- Histórico recente em cache (5 minutos)
- Recomendações em cache (15 minutos)
- Analytics agregados em cache (1 hora)

### **Performance**
- Índices em campos de busca
- Particionamento por data
- Compressão de dados históricos
- Limpeza automática de dados antigos

### **Escalabilidade**
- Sharding por usuário
- Replicação de leitura
- CDN para dados estáticos
- Load balancing por região 