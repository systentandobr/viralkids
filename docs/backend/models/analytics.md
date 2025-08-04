# 📊 MODELO DE ANALYTICS
## Estruturas para Dashboard de Métricas e Relatórios

### 🎯 **Objetivo**
Definir os modelos de dados para suportar o sistema de analytics, incluindo métricas de produtos, navegação, conversão e recomendações.

---

## 📋 **Modelo Principal - AnalyticsEvent**

### **Estrutura Base**
```json
{
  "id": "string",
  "userId": "string",
  "sessionId": "string",
  "eventType": "string",
  "eventData": "object",
  "timestamp": "datetime",
  "metadata": {
    "userAgent": "string",
    "ip": "string",
    "referrer": "string",
    "page": "string",
    "deviceType": "string"
  }
}
```

### **Tipos de Eventos**
- `page_view`: Visualização de página
- `product_view`: Visualização de produto
- `product_interaction`: Interação com produto
- `search`: Busca realizada
- `add_to_cart`: Adicionado ao carrinho
- `remove_from_cart`: Removido do carrinho
- `checkout_start`: Início do checkout
- `checkout_step`: Step do checkout
- `purchase`: Compra realizada
- `review_submitted`: Avaliação enviada

---

## 👁️ **Modelo de Métricas de Produto - ProductMetrics**

### **Estrutura**
```json
{
  "productId": "string",
  "period": "string",
  "views": {
    "total": "number",
    "unique": "number",
    "bySource": {
      "search": "number",
      "category": "number",
      "related": "number",
      "featured": "number",
      "direct": "number"
    }
  },
  "interactions": {
    "addToCart": "number",
    "removeFromCart": "number",
    "addToWishlist": "number",
    "share": "number",
    "review": "number"
  },
  "conversion": {
    "viewsToCart": "number",
    "cartToPurchase": "number",
    "viewsToPurchase": "number"
  },
  "revenue": {
    "total": "number",
    "averageOrderValue": "number",
    "unitsSold": "number"
  },
  "ratings": {
    "average": "number",
    "count": "number",
    "distribution": {
      "1": "number",
      "2": "number",
      "3": "number",
      "4": "number",
      "5": "number"
    }
  },
  "trending": {
    "score": "number",
    "rank": "number",
    "change": "number"
  }
}
```

---

## 🧭 **Modelo de Métricas de Navegação - NavigationMetrics**

### **Estrutura**
```json
{
  "userId": "string",
  "period": "string",
  "sessions": {
    "total": "number",
    "averageDuration": "number",
    "averagePages": "number",
    "bounceRate": "number"
  },
  "pages": {
    "mostVisited": [
      {
        "path": "string",
        "views": "number",
        "averageTime": "number"
      }
    ],
    "entryPages": [
      {
        "path": "string",
        "count": "number"
      }
    ],
    "exitPages": [
      {
        "path": "string",
        "count": "number"
      }
    ]
  },
  "search": {
    "totalSearches": "number",
    "uniqueTerms": "number",
    "mostSearched": [
      {
        "term": "string",
        "count": "number",
        "resultsCount": "number"
      }
    ],
    "noResults": [
      {
        "term": "string",
        "count": "number"
      }
    ]
  },
  "behavior": {
    "preferredCategories": ["string"],
    "preferredBrands": ["string"],
    "preferredPriceRange": {
      "min": "number",
      "max": "number"
    },
    "preferredSizes": ["string"],
    "preferredColors": ["string"]
  }
}
```

---

## 🛒 **Modelo de Métricas de Checkout - CheckoutMetrics**

### **Estrutura**
```json
{
  "period": "string",
  "funnel": {
    "cartViews": "number",
    "checkoutStarts": "number",
    "customerDataCompleted": "number",
    "shippingCompleted": "number",
    "paymentCompleted": "number",
    "purchases": "number"
  },
  "conversionRates": {
    "cartToCheckout": "number",
    "checkoutToCustomer": "number",
    "customerToShipping": "number",
    "shippingToPayment": "number",
    "paymentToPurchase": "number",
    "overall": "number"
  },
  "abandonment": {
    "totalAbandoned": "number",
    "abandonmentRate": "number",
    "byStep": {
      "cart": "number",
      "customer": "number",
      "shipping": "number",
      "payment": "number"
    },
    "reasons": [
      {
        "reason": "string",
        "count": "number"
      }
    ]
  },
  "performance": {
    "averageTimeToComplete": "number",
    "averageTimeByStep": {
      "cart": "number",
      "customer": "number",
      "shipping": "number",
      "payment": "number"
    },
    "mobileConversionRate": "number",
    "desktopConversionRate": "number"
  }
}
```

---

## 💰 **Modelo de Métricas de Vendas - SalesMetrics**

### **Estrutura**
```json
{
  "period": "string",
  "revenue": {
    "total": "number",
    "averageOrderValue": "number",
    "byPaymentMethod": {
      "credit_card": "number",
      "pix": "number",
      "boleto": "number"
    },
    "byCategory": [
      {
        "category": "string",
        "revenue": "number",
        "orders": "number"
      }
    ]
  },
  "orders": {
    "total": "number",
    "newCustomers": "number",
    "returningCustomers": "number",
    "averageItemsPerOrder": "number"
  },
  "products": {
    "topSellers": [
      {
        "productId": "string",
        "name": "string",
        "unitsSold": "number",
        "revenue": "number"
      }
    ],
    "trending": [
      {
        "productId": "string",
        "name": "string",
        "growth": "number"
      }
    ]
  },
  "customers": {
    "new": "number",
    "returning": "number",
    "lifetimeValue": "number",
    "retentionRate": "number"
  }
}
```

---

## 🎯 **Modelo de Recomendações - RecommendationMetrics**

### **Estrutura**
```json
{
  "period": "string",
  "performance": {
    "totalRecommendations": "number",
    "clicks": "number",
    "clickThroughRate": "number",
    "conversions": "number",
    "conversionRate": "number",
    "revenue": "number"
  },
  "byType": {
    "viewed_together": {
      "impressions": "number",
      "clicks": "number",
      "ctr": "number",
      "conversions": "number"
    },
    "bought_together": {
      "impressions": "number",
      "clicks": "number",
      "ctr": "number",
      "conversions": "number"
    },
    "similar_category": {
      "impressions": "number",
      "clicks": "number",
      "ctr": "number",
      "conversions": "number"
    },
    "personalized": {
      "impressions": "number",
      "clicks": "number",
      "ctr": "number",
      "conversions": "number"
    }
  },
  "topRecommendations": [
    {
      "productId": "string",
      "name": "string",
      "impressions": "number",
      "clicks": "number",
      "ctr": "number",
      "conversions": "number",
      "revenue": "number"
    }
  ],
  "accuracy": {
    "precision": "number",
    "recall": "number",
    "f1Score": "number"
  }
}
```

---

## 📈 **Modelo de Dashboard - DashboardData**

### **Estrutura**
```json
{
  "period": "string",
  "summary": {
    "totalRevenue": "number",
    "totalOrders": "number",
    "totalCustomers": "number",
    "averageOrderValue": "number",
    "conversionRate": "number"
  },
  "trends": {
    "revenue": [
      {
        "date": "string",
        "value": "number"
      }
    ],
    "orders": [
      {
        "date": "string",
        "value": "number"
      }
    ],
    "customers": [
      {
        "date": "string",
        "value": "number"
      }
    ]
  },
  "topProducts": [
    {
      "id": "string",
      "name": "string",
      "views": "number",
      "sales": "number",
      "revenue": "number"
    }
  ],
  "topCategories": [
    {
      "name": "string",
      "views": "number",
      "sales": "number",
      "revenue": "number"
    }
  ],
  "searchInsights": {
    "totalSearches": "number",
    "topTerms": [
      {
        "term": "string",
        "count": "number"
      }
    ],
    "noResults": [
      {
        "term": "string",
        "count": "number"
      }
    ]
  },
  "recommendations": {
    "totalImpressions": "number",
    "totalClicks": "number",
    "clickThroughRate": "number",
    "totalRevenue": "number"
  }
}
```

---

## 🔄 **Endpoints de Analytics**

### **Enviar Evento**
```http
POST /api/v1.0/analytics/events
Content-Type: application/json

{
  "userId": "string",
  "eventType": "string",
  "eventData": "object",
  "metadata": "object"
}
```

### **Obter Dashboard**
```http
GET /api/v1.0/analytics/dashboard?period=string&userId=string
```

### **Obter Métricas de Produto**
```http
GET /api/v1.0/analytics/products/{id}/metrics?period=string
```

### **Obter Métricas de Navegação**
```http
GET /api/v1.0/analytics/navigation/metrics?userId=string&period=string
```

### **Obter Métricas de Checkout**
```http
GET /api/v1.0/analytics/checkout/metrics?period=string
```

### **Obter Métricas de Vendas**
```http
GET /api/v1.0/analytics/sales/metrics?period=string
```

### **Obter Métricas de Recomendações**
```http
GET /api/v1.0/analytics/recommendations/metrics?period=string
```

### **Obter Relatório Personalizado**
```http
POST /api/v1.0/analytics/reports
Content-Type: application/json

{
  "type": "string",
  "filters": "object",
  "period": "string",
  "groupBy": "string"
}
```

---

## 📊 **Tipos de Relatórios**

### **Relatório de Produtos**
- Visualizações por período
- Conversão por produto
- Produtos mais vendidos
- Produtos abandonados
- Avaliações e reviews

### **Relatório de Navegação**
- Páginas mais visitadas
- Fluxo de navegação
- Tempo de permanência
- Taxa de rejeição
- Buscas realizadas

### **Relatório de Checkout**
- Funnel de conversão
- Abandono por step
- Tempo de conclusão
- Métodos de pagamento
- Motivos de cancelamento

### **Relatório de Vendas**
- Receita por período
- Pedidos por categoria
- Clientes novos vs recorrentes
- Valor médio do pedido
- Crescimento mensal

### **Relatório de Recomendações**
- Performance por tipo
- Taxa de clique
- Conversão por recomendação
- Receita gerada
- Precisão do algoritmo

---

## 📈 **Métricas de Performance**

### **Indicadores de Negócio (KPIs)**
- **Receita Total**: Soma de todas as vendas
- **Taxa de Conversão**: Visitas que resultam em compra
- **Valor Médio do Pedido**: Receita total / Número de pedidos
- **Taxa de Abandono**: Checkouts iniciados mas não finalizados
- **Lifetime Value**: Valor total do cliente ao longo do tempo

### **Indicadores de Produto**
- **Visualizações**: Número de vezes que o produto foi visto
- **Taxa de Conversão**: Visualizações que resultam em compra
- **Tempo de Permanência**: Tempo médio na página do produto
- **Avaliação Média**: Nota média dos reviews
- **Ranking de Popularidade**: Posição do produto em relação aos outros

### **Indicadores de Navegação**
- **Sessões**: Número de visitas únicas
- **Páginas por Sessão**: Média de páginas visitadas
- **Tempo de Sessão**: Duração média das visitas
- **Taxa de Rejeição**: Sessões com apenas uma página
- **Páginas de Saída**: Páginas onde os usuários saem

### **Indicadores de Recomendação**
- **Impressões**: Número de vezes que recomendações foram mostradas
- **Taxa de Clique**: Clicks em recomendações / Impressões
- **Taxa de Conversão**: Compras de produtos recomendados
- **Receita por Recomendação**: Valor gerado por cada recomendação
- **Precisão**: Acerto do algoritmo de recomendação

---

## 🔒 **Segurança e Privacidade**

### **Anonimização de Dados**
- IPs anonimizados após 30 dias
- User Agents sem informações pessoais
- Dados agregados para relatórios
- Conformidade com LGPD

### **Controle de Acesso**
- Relatórios por nível de acesso
- Dados sensíveis mascarados
- Logs de auditoria
- Limitação de consultas

### **Retenção de Dados**
- Eventos detalhados: 90 dias
- Métricas agregadas: 2 anos
- Relatórios: 5 anos
- Backup: 7 anos

---

## 🚀 **Otimizações**

### **Cache**
- Dashboard em cache (15 minutos)
- Relatórios em cache (1 hora)
- Métricas agregadas em cache (6 horas)
- Cache por usuário e período

### **Performance**
- Índices em campos de data
- Particionamento por período
- Compressão de dados históricos
- Consultas otimizadas

### **Escalabilidade**
- Sharding por período
- Replicação de leitura
- Processamento em lote
- Arquitetura de eventos 