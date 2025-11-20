# Arquitetura: Relação Unit/UnitID com Usuário Autenticado

## Decisão Arquitetural

### Onde implementar a relação Unit/UnitID?

**Recomendação: Manter separado entre os dois sistemas**

#### 1. **architecture-security** (Responsabilidade: Autenticação e Autorização)
- ✅ **Manter**: Relação User → unitId no `user.profile.unitId`
- ✅ **Responsabilidade**: Armazenar qual unidade/franquia o usuário pertence
- ✅ **Incluir no JWT**: O `unitId` deve ser incluído no payload do token JWT durante o login
- ❌ **NÃO fazer**: Lógica de negócio de franquias, CRUD de unidades, métricas

**Estrutura atual:**
```typescript
// user.schema.ts (architecture-security)
profile: {
  unitId: string; // Referência à franquia/unidade
  location: { ... },
  firstName: string;
  // ...
}
```

#### 2. **backend-monorepo** (Responsabilidade: Lógica de Negócio)
- ✅ **Manter**: Módulo completo de Franchises com CRUD, métricas, tendências
- ✅ **Responsabilidade**: Gerenciar todas as operações de negócio relacionadas a franquias
- ✅ **Usar unitId do JWT**: Extrair `unitId` do token para filtrar dados automaticamente
- ❌ **NÃO fazer**: Gerenciar autenticação ou armazenar dados de usuário

**Estrutura atual:**
```typescript
// franchise.schema.ts (backend-monorepo)
{
  unitId: string; // ID único da franquia (referenciado pelo user.profile.unitId)
  name: string;
  owner: { ... },
  location: { ... },
  metrics: { ... }
}
```

## Fluxo de Dados

```
┌─────────────────────────┐
│  architecture-security  │
│                         │
│  User.profile.unitId   │ ───┐
│  (armazenado no DB)     │    │
└─────────────────────────┘    │
                               │ Referência
                               │
                               ▼
┌─────────────────────────┐   │
│   backend-monorepo      │   │
│                         │   │
│  Franchise.unitId       │ ◄──┘
│  (usado para filtrar)   │
│                         │
│  Customers.unitId       │
│  Orders.unitId          │
│  Products.unitId        │
└─────────────────────────┘
```

## Vantagens desta Abordagem

1. **Separação de Responsabilidades**
   - architecture-security: Foco em segurança e autenticação
   - backend-monorepo: Foco em lógica de negócio

2. **Desacoplamento**
   - Mudanças no módulo de franquias não afetam autenticação
   - Mudanças na autenticação não afetam lógica de negócio

3. **Escalabilidade**
   - Cada sistema pode escalar independentemente
   - Facilita manutenção e evolução

4. **Reutilização**
   - architecture-security pode ser usado por outros projetos
   - backend-monorepo pode ter múltiplos contextos de negócio

## Implementação Atual

### ✅ Já Implementado

1. **architecture-security**:
   - `user.profile.unitId` armazenado no schema
   - `unitId` incluído no JWT token (via `generateTokens`)

2. **backend-monorepo**:
   - `UnitIdInterceptor`: Injeta `unitId` automaticamente nas queries
   - `@UnitScope()` decorator: Aplica guards e interceptors
   - Módulos Customers, Orders, Franchises filtram por `unitId`

### 🔄 Melhorias Sugeridas

1. **Validação de Integridade**:
   - Criar endpoint em backend-monorepo para validar se `unitId` existe
   - Chamar durante registro/atualização de usuário em architecture-security

2. **Sincronização**:
   - Quando criar nova franquia em backend-monorepo, garantir que `unitId` seja único
   - Notificar architecture-security sobre novas franquias (opcional)

3. **Cache**:
   - Cachear relação unitId → Franchise no backend-monorepo
   - Reduzir consultas ao banco

## Conclusão

**Manter a implementação atual**: A relação User → unitId deve permanecer no `architecture-security`, enquanto toda a lógica de negócio de franquias permanece no `backend-monorepo`. Esta separação mantém os sistemas desacoplados e facilita manutenção futura.

