# Gerenciamento de Usuários por Franquia

## Hierarquia de Dados

```
Domain: 'viralkids-web' (fixo para todas as franquias)
  └── Franchise (unitId = franchise.id)
      └── User (user.profile.unitId = franchise.unitId)
```

## Estrutura

### 1. Domain
- **Valor fixo**: `viralkids-web`
- **Configuração**: `src/config/env.ts` → `ENV_CONFIG.SYS_SEGURANCA_DOMAIN`
- **Uso**: Sempre usado no login via `useAuth`

### 2. Franchise (Franquia)
- **Campo `unitId`**: Identificador único da franquia
- **Relacionamento**: `franchise.unitId` é usado como referência pelos usuários
- **Regra**: Ao criar franquia, o `unitId` deve ser igual ao `franchise.id` ou gerado automaticamente

### 3. User (Usuário)
- **Campo `unitId`**: Referência à franquia (`user.profile.unitId`)
- **Relacionamento**: Usuário pertence a uma franquia através do `unitId`
- **Regra**: Ao alocar usuário à franquia, atualizar `user.profile.unitId = franchise.unitId`

## Componentes Implementados

### FranchiseUsersManager
**Localização**: `src/pages/Admin/Franchisees/components/FranchiseUsersManager.tsx`

**Funcionalidades**:
- Listar usuários de uma franquia específica
- Buscar usuários disponíveis (sem unitId ou com unitId diferente)
- Alocar usuário à franquia (atualizar unitId)
- Remover usuário da franquia (limpar unitId)
- Visualizar status e papéis dos usuários

**Uso**:
```tsx
<FranchiseUsersManager
  franchise={franchise}
  onUserAllocated={() => {
    // Callback quando usuário é alocado/removido
  }}
/>
```

### UserService
**Localização**: `src/services/users/userService.ts`

**Métodos principais**:
- `listByUnitId(unitId)`: Listar usuários de uma franquia
- `searchAvailable(search)`: Buscar usuários disponíveis
- `updateUnitId(userId, { unitId, role })`: Alocar/remover usuário de franquia

## Integração no FranchisesManagement

O componente `FranchisesManagement` agora inclui:
- Botão para gerenciar usuários de cada franquia
- Exibição do `FranchiseUsersManager` quando uma franquia é selecionada
- Visualização do `unitId` da franquia

## Endpoints da API

### Usuários
- `GET /users/by-unit?unitId={unitId}` - Listar usuários por franquia
- `GET /users/available?search={search}` - Buscar usuários disponíveis
- `PATCH /users/{userId}/unit` - Atualizar unitId do usuário

**Payload para atualizar unitId**:
```json
{
  "unitId": "franchise-id-123" | null,
  "role": "franchisee" // opcional
}
```

## Fluxo de Alocação de Usuário

1. **Selecionar Franquia**: Clicar no botão de usuários na tabela de franquias
2. **Buscar Usuário**: Digitar email ou nome do usuário (mínimo 3 caracteres)
3. **Selecionar Usuário**: Clicar no usuário da lista de resultados
4. **Definir Papel**: Selecionar papel na franquia (franqueado, gerente, vendedor, etc.)
5. **Confirmar**: Clicar em "Alocar Usuário"
6. **Resultado**: Usuário é atualizado com `unitId` da franquia

## Validações

- ✅ Domain sempre é `viralkids-web` no login
- ✅ `unitId` da franquia é obrigatório
- ✅ Usuário só pode pertencer a uma franquia por vez
- ✅ Ao remover usuário, `unitId` é definido como `null`

## Próximos Passos

1. Implementar endpoints no backend para:
   - Listar usuários por unitId
   - Buscar usuários disponíveis
   - Atualizar unitId do usuário

2. Adicionar validações:
   - Verificar se franquia existe antes de alocar
   - Verificar se usuário já está alocado em outra franquia
   - Validar permissões para alocar usuários

3. Melhorias de UX:
   - Adicionar loading states
   - Melhorar feedback visual
   - Adicionar confirmação antes de remover

