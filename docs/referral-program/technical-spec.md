# Especificação Técnica - Sistema Member Get Member

## 1. Arquitetura do Sistema

### 1.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Sales Page   │  │ Dashboard    │  │ Referral Components  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway                                  │
│              (NestJS - backend-monorepo)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Referral Module  │ │ Campaigns Module │ │ Rewards Module   │
│                  │ │                  │ │                  │
│ - Create/Track   │ │ - CRUD           │ │ - Process        │
│ - Complete       │ │ - Activate       │ │ - Approve        │
│ - Cancel         │ │ - Stats          │ │ - Pay            │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Referrals    │  │ Campaigns    │  │ Rewards              │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + TypeScript + Vite |
| State Management | Zustand + React Query |
| UI Components | Shadcn/UI + Tailwind CSS |
| Backend | NestJS (Node.js) |
| Database | MongoDB |
| Cache | Redis |
| Queue | Bull (Redis-based) |
| Notifications | Sistema interno + Email (Resend) |

## 2. Fluxos de Dados

### 2.1 Fluxo de Criação de Indicação

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Usuário │───▶│ Frontend│───▶│   API   │───▶│   DB    │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     │  1. Solicita │              │              │
     │     código   │              │              │
     │              │  2. POST     │              │
     │              │  /referrals  │              │
     │              │              │  3. Valida   │
     │              │              │     campanha │
     │              │              │              │
     │              │              │  4. Gera     │
     │              │              │     código   │
     │              │              │              │
     │              │  5. Retorna  │              │
     │              │     código   │              │
     │  6. Exibe    │              │              │
     │     código   │              │              │
     └──────────────┴──────────────┴──────────────┘
```

### 2.2 Fluxo de Conversão de Indicação

```
┌─────────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Indicado    │───▶│ Checkout│───▶│   API   │───▶│  Queue  │───▶│ Rewards │
└─────────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │                  │              │              │              │
     │  1. Aplica       │              │              │              │
     │     código       │              │              │              │
     │                  │  2. Valida   │              │              │
     │                  │     código   │              │              │
     │                  │              │  3. Confirma │              │
     │                  │              │     pedido   │              │
     │                  │              │              │  4. Processa │
     │                  │              │              │     reward   │
     │                  │              │              │              │
     │                  │              │              │              │  5. Notifica
     │                  │              │              │              │     usuários
     └──────────────────┴──────────────┴──────────────┴──────────────┘
```

### 2.3 Fluxo de Processamento de Recompensas

```
┌─────────────────────────────────────────────────────────────────┐
│                    Background Job (Bull Queue)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Recebe job de processamento de recompensa                   │
│                     │                                            │
│                     ▼                                            │
│  2. Valida elegibilidade                                        │
│     - Verifica status da indicação                              │
│     - Verifica limites do usuário                               │
│     - Verifica regras antifraude                                │
│                     │                                            │
│         ┌───────────┴───────────┐                               │
│         ▼                       ▼                               │
│    [Aprovado]              [Rejeitado]                          │
│         │                       │                               │
│         ▼                       ▼                               │
│  3a. Processa recompensa   3b. Cancela recompensa               │
│      - Cashback: credita       - Notifica usuário               │
│      - Desconto: gera cupom    - Log de auditoria               │
│      - Pontos: adiciona                                         │
│      - Prêmio: reserva                                          │
│         │                                                        │
│         ▼                                                        │
│  4. Notifica usuário                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Modelos de Dados

### 3.1 ReferralCampaign

```typescript
interface ReferralCampaign {
  _id: ObjectId;
  id: string; // UUID
  
  // Identificação
  franchiseId?: ObjectId; // null = campanha global
  name: string;
  description: string;
  slug: string; // URL-friendly
  
  // Configuração
  type: 'single-tier' | 'multi-tier' | 'hybrid';
  rewardTypes: ('cashback' | 'discount' | 'points' | 'physical')[];
  
  // Recompensas
  referrerReward: {
    type: 'cashback' | 'discount' | 'points' | 'physical';
    value: number;
    currency?: string; // BRL
    productId?: ObjectId; // para prêmios físicos
  };
  refereeReward?: {
    type: 'cashback' | 'discount' | 'points' | 'physical';
    value: number;
    currency?: string;
    productId?: ObjectId;
  };
  
  // Regras
  rules: {
    minPurchaseValue?: number;
    maxReferralsPerUser?: number;
    maxReferralsTotal?: number;
    expirationDays?: number;
    requireEmailVerification?: boolean;
    allowedProducts?: ObjectId[];
    excludedProducts?: ObjectId[];
  };
  
  // Status e Período
  status: 'draft' | 'active' | 'paused' | 'expired' | 'completed';
  startDate: Date;
  endDate: Date;
  
  // Métricas
  metrics: {
    totalReferrals: number;
    completedReferrals: number;
    totalRewardsValue: number;
    conversionRate: number;
  };
  
  // Metadados
  metadata: Record<string, any>;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Referral

```typescript
interface Referral {
  _id: ObjectId;
  id: string; // UUID
  
  // Relacionamentos
  campaignId: ObjectId;
  franchiseId: ObjectId;
  referrerId: ObjectId; // quem indicou
  refereeId?: ObjectId; // quem foi indicado (preenchido após cadastro)
  orderId?: ObjectId; // pedido que completou a indicação
  
  // Código
  referralCode: string; // único, formato: XXXX-XXXX-XXXX
  shortLink?: string; // link curto para compartilhamento
  
  // Status
  status: 'pending' | 'registered' | 'completed' | 'cancelled' | 'expired';
  
  // Recompensas
  referrerReward: {
    type: string;
    value: number;
    currency?: string;
    status: 'pending' | 'processing' | 'paid' | 'cancelled';
    paidAt?: Date;
    rewardId?: ObjectId;
  };
  refereeReward?: {
    type: string;
    value: number;
    currency?: string;
    status: 'pending' | 'processing' | 'paid' | 'cancelled';
    paidAt?: Date;
    rewardId?: ObjectId;
  };
  
  // Tracking
  tracking: {
    sharedAt?: Date;
    sharedVia?: 'whatsapp' | 'email' | 'link' | 'social';
    registeredAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    expiredAt?: Date;
  };
  
  // Antifraude
  fraud: {
    score: number; // 0-100
    flags: string[];
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: ObjectId;
  };
  
  // Metadados
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 Reward

```typescript
interface Reward {
  _id: ObjectId;
  id: string; // UUID
  
  // Relacionamentos
  referralId: ObjectId;
  userId: ObjectId;
  campaignId: ObjectId;
  
  // Tipo e Valor
  type: 'cashback' | 'discount' | 'points' | 'physical';
  value: number;
  currency?: string;
  
  // Status
  status: 'pending' | 'processing' | 'approved' | 'paid' | 'cancelled' | 'expired';
  
  // Detalhes por tipo
  details: {
    // Para cashback
    walletId?: ObjectId;
    transactionId?: string;
    
    // Para desconto
    couponCode?: string;
    couponExpiresAt?: Date;
    
    // Para pontos
    pointsAccountId?: ObjectId;
    
    // Para prêmio físico
    productId?: ObjectId;
    shippingAddress?: object;
    trackingCode?: string;
  };
  
  // Processamento
  processing: {
    scheduledAt?: Date;
    processedAt?: Date;
    approvedBy?: ObjectId;
    approvedAt?: Date;
    paidAt?: Date;
    cancelledAt?: Date;
    cancelledBy?: ObjectId;
    cancelReason?: string;
  };
  
  // Metadados
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

## 4. Endpoints da API

### 4.1 Campanhas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/referral-campaigns` | Criar campanha | Admin |
| GET | `/referral-campaigns` | Listar campanhas | Public |
| GET | `/referral-campaigns/:id` | Detalhes da campanha | Public |
| GET | `/referral-campaigns/franchise/:franchiseId` | Campanhas por franquia | Auth |
| PATCH | `/referral-campaigns/:id` | Atualizar campanha | Admin |
| DELETE | `/referral-campaigns/:id` | Deletar campanha | Admin |
| POST | `/referral-campaigns/:id/activate` | Ativar campanha | Admin |
| POST | `/referral-campaigns/:id/pause` | Pausar campanha | Admin |
| GET | `/referral-campaigns/:id/stats` | Estatísticas | Admin |

### 4.2 Indicações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/referrals` | Criar indicação (gerar código) | Auth |
| GET | `/referrals` | Listar indicações | Admin |
| GET | `/referrals/:id` | Detalhes da indicação | Auth |
| GET | `/referrals/code/:code` | Buscar por código | Public |
| GET | `/referrals/user/:userId` | Indicações do usuário | Auth |
| GET | `/referrals/my` | Minhas indicações | Auth |
| POST | `/referrals/:id/complete` | Completar indicação | System |
| POST | `/referrals/:id/cancel` | Cancelar indicação | Auth |
| GET | `/referrals/campaign/:campaignId/stats` | Stats da campanha | Admin |

### 4.3 Recompensas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/rewards/process` | Processar recompensa | System |
| GET | `/rewards/user/:userId` | Recompensas do usuário | Auth |
| GET | `/rewards/my` | Minhas recompensas | Auth |
| GET | `/rewards/pending` | Recompensas pendentes | Admin |
| POST | `/rewards/:id/approve` | Aprovar recompensa | Admin |
| POST | `/rewards/:id/cancel` | Cancelar recompensa | Admin |
| GET | `/rewards/:id` | Detalhes da recompensa | Auth |

## 5. Integrações

### 5.1 Sistema de Pedidos

```typescript
// Hook no módulo de pedidos
@Injectable()
export class OrderReferralIntegration {
  async onOrderCreated(order: Order) {
    if (order.referralCode) {
      await this.referralService.validateCode(order.referralCode);
      await this.referralService.applyToOrder(order);
    }
  }
  
  async onOrderCompleted(order: Order) {
    if (order.referralId) {
      await this.referralService.completeReferral(order.referralId, order._id);
    }
  }
  
  async onOrderCancelled(order: Order) {
    if (order.referralId) {
      await this.rewardService.cancelByOrder(order._id);
    }
  }
}
```

### 5.2 Sistema de Notificações

```typescript
// Eventos de notificação
enum ReferralNotificationEvent {
  REFERRAL_CREATED = 'referral.created',
  REFERRAL_REGISTERED = 'referral.registered',
  REFERRAL_COMPLETED = 'referral.completed',
  REFERRAL_EXPIRED = 'referral.expired',
  REWARD_PENDING = 'reward.pending',
  REWARD_APPROVED = 'reward.approved',
  REWARD_PAID = 'reward.paid',
  CAMPAIGN_EXPIRING = 'campaign.expiring',
}

// Templates de notificação
const notificationTemplates = {
  [ReferralNotificationEvent.REFERRAL_COMPLETED]: {
    title: 'Indicação Completada! 🎉',
    body: 'Sua indicação para {{refereeName}} foi completada. Sua recompensa de {{rewardValue}} está sendo processada.',
    channels: ['email', 'push', 'in-app'],
  },
  // ...
};
```

### 5.3 Sistema de Analytics

```typescript
// Eventos de tracking
interface ReferralAnalyticsEvent {
  event: string;
  campaignId: string;
  referralId?: string;
  userId?: string;
  properties: Record<string, any>;
  timestamp: Date;
}

// Métricas calculadas
interface CampaignMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalRegistrations: number;
  totalConversions: number;
  conversionRate: number;
  averageOrderValue: number;
  totalRevenueGenerated: number;
  totalRewardsPaid: number;
  roi: number;
  costPerAcquisition: number;
}
```

## 6. Segurança e Antifraude

### 6.1 Validações

```typescript
interface FraudValidation {
  // Validações de IP
  checkDuplicateIP(referrerId: string, refereeIP: string): boolean;
  
  // Validações de dispositivo
  checkDeviceFingerprint(referrerId: string, refereeFingerprint: string): boolean;
  
  // Validações de comportamento
  checkAbnormalPatterns(userId: string): boolean;
  
  // Validações de email
  checkDisposableEmail(email: string): boolean;
  
  // Score de fraude
  calculateFraudScore(referral: Referral): number;
}
```

### 6.2 Rate Limiting

```typescript
const rateLimits = {
  createReferral: { window: '1h', max: 10 },
  validateCode: { window: '1m', max: 20 },
  completeReferral: { window: '1h', max: 5 },
};
```

## 7. Performance e Cache

### 7.1 Estratégia de Cache

```typescript
const cacheStrategy = {
  // Campanhas ativas - cache longo
  activeCampaigns: { ttl: 3600, key: 'campaigns:active' },
  
  // Detalhes de campanha - cache médio
  campaignDetails: { ttl: 300, key: 'campaign:{id}' },
  
  // Código de referral - cache curto
  referralCode: { ttl: 60, key: 'referral:code:{code}' },
  
  // Stats - cache curto com invalidação
  campaignStats: { ttl: 60, key: 'campaign:{id}:stats' },
};
```

### 7.2 Índices do MongoDB

```javascript
// Índices para performance
db.referrals.createIndex({ referralCode: 1 }, { unique: true });
db.referrals.createIndex({ referrerId: 1, status: 1 });
db.referrals.createIndex({ campaignId: 1, status: 1 });
db.referrals.createIndex({ createdAt: -1 });

db.referral_campaigns.createIndex({ status: 1, startDate: 1, endDate: 1 });
db.referral_campaigns.createIndex({ franchiseId: 1, status: 1 });

db.rewards.createIndex({ userId: 1, status: 1 });
db.rewards.createIndex({ referralId: 1 });
db.rewards.createIndex({ status: 1, 'processing.scheduledAt': 1 });
```

---

*Documento atualizado em: {{DATA_ATUAL}}*
*Versão: 1.0*
