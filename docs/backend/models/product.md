# 📦 MODELO DE PRODUTO
## Estruturas de Dados para Gestão de Produtos

### 🎯 **Objetivo**
Definir os modelos de dados para produtos, incluindo variações, avaliações e metadados necessários para o e-commerce.

---

## 📋 **Modelo Principal - Product**

### **Estrutura Base**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "brand": "string",
  "category": "string",
  "categoryPath": ["string"],
  "price": "number",
  "originalPrice": "number",
  "discount": "number",
  "images": ["string"],
  "thumbnail": "string",
  "rating": "number",
  "reviewCount": "number",
  "stock": "number",
  "sku": "string",
  "isActive": "boolean",
  "isNew": "boolean",
  "isFeatured": "boolean",
  "tags": ["string"],
  "specifications": "object",
  "materials": ["string"],
  "careInstructions": ["string"],
  "warranty": "string",
  "franchiseLocation": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### **Campos Obrigatórios**
- `id`: Identificador único do produto
- `name`: Nome do produto
- `price`: Preço atual
- `category`: Categoria principal
- `stock`: Quantidade em estoque
- `isActive`: Status de ativação

### **Campos Opcionais**
- `originalPrice`: Preço original (para promoções)
- `discount`: Percentual de desconto
- `images`: Array de URLs de imagens
- `rating`: Avaliação média (0-5)
- `reviewCount`: Número de avaliações
- `specifications`: Especificações técnicas
- `materials`: Lista de materiais
- `careInstructions`: Instruções de cuidado

---

## 🎨 **Modelo de Variações - ProductVariation**

### **Estrutura**
```json
{
  "id": "string",
  "productId": "string",
  "type": "string",
  "value": "string",
  "price": "number",
  "stock": "number",
  "available": "boolean",
  "sku": "string",
  "images": ["string"],
  "isDefault": "boolean"
}
```

### **Tipos de Variação**
- `color`: Cor do produto
- `size`: Tamanho
- `material`: Material
- `style`: Estilo/Modelo

### **Exemplo de Variações**
```json
{
  "variations": [
    {
      "type": "color",
      "value": "Azul",
      "price": 89.90,
      "stock": 15,
      "available": true
    },
    {
      "type": "size",
      "value": "M",
      "price": 89.90,
      "stock": 8,
      "available": true
    }
  ]
}
```

---

## ⭐ **Modelo de Avaliações - ProductReview**

### **Estrutura**
```json
{
  "id": "string",
  "productId": "string",
  "userId": "string",
  "rating": "number",
  "title": "string",
  "comment": "string",
  "images": ["string"],
  "pros": ["string"],
  "cons": ["string"],
  "verified": "boolean",
  "helpful": "number",
  "notHelpful": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### **Campos de Avaliação**
- `rating`: Nota de 1 a 5
- `title`: Título da avaliação
- `comment`: Comentário detalhado
- `images`: Fotos do produto
- `pros`: Pontos positivos
- `cons`: Pontos negativos
- `verified`: Compra verificada
- `helpful`: Votos úteis
- `notHelpful`: Votos não úteis

---

## 📏 **Modelo de Guia de Tamanhos - SizeGuide**

### **Estrutura**
```json
{
  "id": "string",
  "productId": "string",
  "category": "string",
  "measurements": {
    "chest": "number",
    "waist": "number",
    "hip": "number",
    "length": "number",
    "sleeve": "number"
  },
  "sizes": [
    {
      "size": "string",
      "measurements": "object",
      "recommendation": "string"
    }
  ],
  "instructions": "string",
  "unit": "string"
}
```

---

## 🔍 **Modelo de Busca - ProductSearch**

### **Parâmetros de Busca**
```json
{
  "query": "string",
  "category": "string",
  "brand": "string",
  "priceMin": "number",
  "priceMax": "number",
  "rating": "number",
  "inStock": "boolean",
  "sortBy": "string",
  "sortOrder": "string",
  "page": "number",
  "limit": "number",
  "filters": "object"
}
```

### **Opções de Ordenação**
- `price_asc`: Preço crescente
- `price_desc`: Preço decrescente
- `rating_desc`: Melhor avaliados
- `newest`: Mais recentes
- `popular`: Mais populares

### **Filtros Disponíveis**
```json
{
  "filters": {
    "colors": ["string"],
    "sizes": ["string"],
    "materials": ["string"],
    "priceRange": {
      "min": "number",
      "max": "number"
    },
    "availability": "string",
    "features": ["string"]
  }
}
```

---

## 📊 **Modelo de Produtos Relacionados - RelatedProducts**

### **Critérios de Relacionamento**
```json
{
  "productId": "string",
  "criteria": {
    "sameCategory": "boolean",
    "similarPrice": "boolean",
    "sameBrand": "boolean",
    "frequentlyBoughtTogether": "boolean",
    "viewedTogether": "boolean"
  },
  "limit": "number",
  "excludeIds": ["string"]
}
```

### **Resposta de Produtos Relacionados**
```json
{
  "relatedProducts": [
    {
      "product": "Product",
      "score": "number",
      "reason": "string"
    }
  ],
  "total": "number",
  "criteria": "object"
}
```

---

## 🚚 **Modelo de Entrega - Shipping**

### **Estrutura**
```json
{
  "productId": "string",
  "freeShipping": "boolean",
  "minOrderValue": "number",
  "estimatedDays": "number",
  "methods": [
    {
      "name": "string",
      "price": "number",
      "estimatedDays": "number",
      "available": "boolean"
    }
  ],
  "restrictions": {
    "regions": ["string"],
    "weight": "number",
    "dimensions": "object"
  }
}
```

---

## 📈 **Modelo de Analytics - ProductAnalytics**

### **Métricas de Produto**
```json
{
  "productId": "string",
  "views": "number",
  "uniqueViews": "number",
  "addToCart": "number",
  "purchases": "number",
  "conversionRate": "number",
  "averageRating": "number",
  "reviewCount": "number",
  "popularity": "number",
  "trending": "boolean",
  "lastUpdated": "datetime"
}
```

---

## 🔄 **Operações CRUD**

### **Criar Produto**
```http
POST /api/v1.0/products
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number"
}
```

### **Atualizar Produto**
```http
PUT /api/v1.0/products/{id}
Content-Type: application/json

{
  "name": "string",
  "price": "number",
  "stock": "number"
}
```

### **Buscar Produtos**
```http
GET /api/v1.0/products?query=string&category=string&priceMin=number&priceMax=number
```

### **Obter Produto**
```http
GET /api/v1.0/products/{id}
```

### **Produtos Relacionados**
```http
GET /api/v1.0/products/{id}/related?limit=number
```

---

## ✅ **Validações**

### **Campos Obrigatórios**
- Nome: mínimo 3 caracteres, máximo 100
- Preço: positivo, máximo 2 casas decimais
- Estoque: número inteiro não negativo
- Categoria: deve existir no sistema

### **Campos Opcionais**
- Descrição: máximo 1000 caracteres
- Imagens: máximo 10 URLs válidas
- Avaliação: entre 0 e 5
- Desconto: entre 0 e 100%

### **Regras de Negócio**
- Produto inativo não aparece em buscas
- Estoque zero marca como indisponível
- Preço original deve ser maior que preço atual
- SKU deve ser único por produto 