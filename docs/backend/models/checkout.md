# 🛒 MODELO DE CHECKOUT
## Estruturas para Sistema de Checkout Completo

### 🎯 **Objetivo**
Definir os modelos de dados para suportar o sistema de checkout em 5 steps, incluindo validação de dados, cálculo de frete e processamento de pagamentos.

---

## 📋 **Modelo Principal - CheckoutSession**

### **Estrutura Base**
```json
{
  "id": "string",
  "userId": "string",
  "sessionId": "string",
  "status": "string",
  "currentStep": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "expiresAt": "datetime",
  "metadata": {
    "source": "string",
    "referrer": "string",
    "deviceInfo": "object"
  }
}
```

### **Status do Checkout**
- `initiated`: Iniciado
- `in_progress`: Em andamento
- `validated`: Dados validados
- `payment_processing`: Processando pagamento
- `completed`: Finalizado
- `cancelled`: Cancelado
- `expired`: Expirado

### **Steps do Checkout**
- `cart`: Carrinho
- `customer`: Dados pessoais
- `shipping`: Entrega
- `payment`: Pagamento
- `confirmation`: Confirmação

---

## 👤 **Modelo de Dados do Cliente - CustomerData**

### **Estrutura**
```json
{
  "id": "string",
  "checkoutId": "string",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "cpf": "string",
    "birthDate": "date"
  },
  "addresses": {
    "billing": "Address",
    "shipping": "Address"
  },
  "preferences": {
    "newsletter": "boolean",
    "marketing": "boolean",
    "communication": "string"
  },
  "validation": {
    "emailVerified": "boolean",
    "phoneVerified": "boolean",
    "cpfValidated": "boolean"
  }
}
```

### **Modelo de Endereço - Address**
```json
{
  "street": "string",
  "number": "string",
  "complement": "string",
  "neighborhood": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "country": "string",
  "reference": "string",
  "isDefault": "boolean"
}
```

---

## 📦 **Modelo do Carrinho - Cart**

### **Estrutura**
```json
{
  "id": "string",
  "checkoutId": "string",
  "items": [
    {
      "productId": "string",
      "variationId": "string",
      "quantity": "number",
      "unitPrice": "number",
      "totalPrice": "number",
      "discount": "number",
      "metadata": {
        "productName": "string",
        "productImage": "string",
        "variationDetails": "object"
      }
    }
  ],
  "summary": {
    "subtotal": "number",
    "discount": "number",
    "shipping": "number",
    "tax": "number",
    "total": "number"
  },
  "appliedCoupons": [
    {
      "code": "string",
      "discount": "number",
      "type": "string"
    }
  ]
}
```

---

## 🚚 **Modelo de Entrega - Shipping**

### **Estrutura**
```json
{
  "id": "string",
  "checkoutId": "string",
  "address": "Address",
  "options": [
    {
      "id": "string",
      "name": "string",
      "carrier": "string",
      "price": "number",
      "estimatedDays": "number",
      "tracking": "boolean",
      "insurance": "boolean",
      "selected": "boolean"
    }
  ],
  "selectedOption": "string",
  "calculation": {
    "weight": "number",
    "dimensions": {
      "length": "number",
      "width": "number",
      "height": "number"
    },
    "declaredValue": "number"
  },
  "restrictions": {
    "maxWeight": "number",
    "maxDimensions": "object",
    "restrictedRegions": ["string"]
  }
}
```

### **Tipos de Entrega**
- `standard`: Entrega padrão
- `express`: Entrega expressa
- `scheduled`: Entrega agendada
- `pickup`: Retirada em loja
- `same_day`: Entrega no mesmo dia

---

## 💳 **Modelo de Pagamento - Payment**

### **Estrutura**
```json
{
  "id": "string",
  "checkoutId": "string",
  "method": "string",
  "status": "string",
  "amount": "number",
  "installments": "number",
  "details": {
    "card": "CardInfo",
    "pix": "PixInfo",
    "boleto": "BoletoInfo",
    "transfer": "TransferInfo"
  },
  "processing": {
    "gateway": "string",
    "transactionId": "string",
    "authorizationCode": "string",
    "processedAt": "datetime"
  },
  "security": {
    "riskScore": "number",
    "fraudCheck": "boolean",
    "verification": "object"
  }
}
```

### **Métodos de Pagamento**
- `credit_card`: Cartão de crédito
- `debit_card`: Cartão de débito
- `pix`: PIX
- `boleto`: Boleto bancário
- `transfer`: Transferência bancária
- `wallet`: Carteira digital

### **Status de Pagamento**
- `pending`: Pendente
- `processing`: Processando
- `approved`: Aprovado
- `declined`: Recusado
- `cancelled`: Cancelado
- `refunded`: Reembolsado

### **Modelo de Cartão - CardInfo**
```json
{
  "brand": "string",
  "lastFour": "string",
  "holderName": "string",
  "expiryMonth": "number",
  "expiryYear": "number",
  "installments": "number",
  "token": "string"
}
```

### **Modelo PIX - PixInfo**
```json
{
  "qrCode": "string",
  "qrCodeImage": "string",
  "expiresAt": "datetime",
  "pixKey": "string"
}
```

---

## 🎫 **Modelo de Cupons - Coupon**

### **Estrutura**
```json
{
  "id": "string",
  "code": "string",
  "type": "string",
  "value": "number",
  "minOrderValue": "number",
  "maxDiscount": "number",
  "usageLimit": "number",
  "usedCount": "number",
  "validFrom": "datetime",
  "validTo": "datetime",
  "categories": ["string"],
  "products": ["string"],
  "excludedProducts": ["string"],
  "userLimit": "number",
  "firstTimeOnly": "boolean",
  "active": "boolean"
}
```

### **Tipos de Cupom**
- `percentage`: Desconto percentual
- `fixed`: Desconto fixo
- `free_shipping`: Frete grátis
- `buy_x_get_y`: Compre X leve Y

---

## 📋 **Modelo de Validação - Validation**

### **Estrutura**
```json
{
  "checkoutId": "string",
  "step": "string",
  "valid": "boolean",
  "errors": [
    {
      "field": "string",
      "message": "string",
      "code": "string"
    }
  ],
  "warnings": [
    {
      "field": "string",
      "message": "string",
      "code": "string"
    }
  ],
  "validatedAt": "datetime"
}
```

### **Códigos de Erro**
- `required_field`: Campo obrigatório
- `invalid_format`: Formato inválido
- `invalid_email`: E-mail inválido
- `invalid_cpf`: CPF inválido
- `invalid_phone`: Telefone inválido
- `invalid_zipcode`: CEP inválido
- `insufficient_stock`: Estoque insuficiente
- `invalid_coupon`: Cupom inválido
- `payment_declined`: Pagamento recusado

---

## 📊 **Modelo de Resumo - CheckoutSummary**

### **Estrutura**
```json
{
  "checkoutId": "string",
  "customer": "CustomerData",
  "cart": "Cart",
  "shipping": "Shipping",
  "payment": "Payment",
  "summary": {
    "subtotal": "number",
    "discount": "number",
    "shipping": "number",
    "tax": "number",
    "total": "number",
    "installments": "number",
    "installmentValue": "number"
  },
  "estimatedDelivery": "datetime",
  "terms": {
    "accepted": "boolean",
    "acceptedAt": "datetime",
    "ip": "string"
  }
}
```

---

## 🔄 **Endpoints de Checkout**

### **Iniciar Checkout**
```http
POST /api/v1.0/checkout/init
Content-Type: application/json

{
  "userId": "string",
  "cartItems": "array",
  "source": "string"
}
```

### **Atualizar Step**
```http
PUT /api/v1.0/checkout/{id}/step
Content-Type: application/json

{
  "step": "string",
  "data": "object"
}
```

### **Validar Dados**
```http
POST /api/v1.0/checkout/{id}/validate
Content-Type: application/json

{
  "step": "string",
  "data": "object"
}
```

### **Calcular Frete**
```http
POST /api/v1.0/checkout/{id}/shipping/calculate
Content-Type: application/json

{
  "zipCode": "string",
  "items": "array"
}
```

### **Aplicar Cupom**
```http
POST /api/v1.0/checkout/{id}/coupon
Content-Type: application/json

{
  "code": "string"
}
```

### **Processar Pagamento**
```http
POST /api/v1.0/checkout/{id}/payment
Content-Type: application/json

{
  "method": "string",
  "details": "object"
}
```

### **Finalizar Checkout**
```http
POST /api/v1.0/checkout/{id}/complete
Content-Type: application/json

{
  "termsAccepted": "boolean"
}
```

### **Obter Resumo**
```http
GET /api/v1.0/checkout/{id}/summary
```

---

## ✅ **Validações por Step**

### **Step 1 - Carrinho**
- Itens no carrinho
- Estoque disponível
- Preços atualizados
- Cupons válidos

### **Step 2 - Dados Pessoais**
- Nome completo
- E-mail válido
- Telefone válido
- CPF válido

### **Step 3 - Entrega**
- Endereço completo
- CEP válido
- Opção de frete selecionada
- Região atendida

### **Step 4 - Pagamento**
- Método selecionado
- Dados do cartão válidos
- Limite de crédito
- Antifraude aprovado

### **Step 5 - Confirmação**
- Termos aceitos
- Dados confirmados
- Pagamento processado
- Pedido criado

---

## 🔒 **Segurança**

### **Validações de Segurança**
- Verificação de CPF
- Validação de cartão
- Score de risco
- Verificação de endereço
- Proteção contra fraude

### **Dados Sensíveis**
- Dados de cartão criptografados
- CPF mascarado
- Logs de auditoria
- Conformidade PCI DSS

### **Rate Limiting**
- Máximo 5 tentativas de pagamento
- Bloqueio temporário após falhas
- Monitoramento de atividades suspeitas

---

## 📈 **Métricas de Checkout**

### **Indicadores de Conversão**
- Taxa de abandono por step
- Tempo médio de conclusão
- Métodos de pagamento preferidos
- Motivos de cancelamento

### **Indicadores de Performance**
- Tempo de resposta dos endpoints
- Taxa de erro por step
- Disponibilidade do sistema
- Tempo de processamento de pagamento

### **Indicadores de Negócio**
- Valor médio do pedido
- Frequência de compra
- Produtos mais abandonados
- Efetividade de cupons 