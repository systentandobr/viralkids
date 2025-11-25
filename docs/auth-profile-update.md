# Atualização de Perfil do Usuário

## Endpoint Implementado

**PUT** `/auth/profile`

**Localização**: `architecture-security/src/modules/auth/auth.controller.ts`

**Autenticação**: Requer JWT Bearer Token

## Estrutura de Dados

### Request Body (UpdateUserProfileDto)

```typescript
{
  unitId?: string;                    // ID da unidade/franquia
  location?: {
    unitName?: string;                 // Nome da unidade
    address?: string;                   // Endereço
    localNumber?: string;              // Número local (identificador)
    complement?: string;              // Complemento
    neighborhood?: string;            // Bairro
    city?: string;                    // Cidade
    state?: string;                    // Estado/UF
    zipCode?: string;                  // CEP
    country?: string;                  // País (ISO-2)
    latitude?: number;                 // Latitude
    longitude?: number;               // Longitude
  };
  avatar?: string;                    // URL do avatar
  bio?: string;                       // Biografia (máx 500 caracteres)
  phone?: string;                     // Telefone
  dateOfBirth?: string;              // Data de nascimento (ISO date string)
}
```

### Response

Retorna o usuário atualizado no formato `LoginResponseDto['user']`:

```typescript
{
  id: string;
  email: string;
  username: string;
  roles: Array<{ name: string }>;
  profile: {
    firstName?: string;
    lastName?: string;
    unitId?: string;
    phone?: string;
    avatar?: string;
    location?: {
      // Dados de localização
    };
  };
}
```

## Implementação no Frontend

### AuthService

**Localização**: `src/services/auth/authService.ts`

**Método**: `updateProfile(data: UpdateUserProfileData)`

**Características**:
- Usa cliente HTTP específico para API de segurança
- Inclui header `X-API-Key` com a chave de API
- Inclui token JWT no header `Authorization`
- Atualiza automaticamente a store após sucesso

**Exemplo de uso**:
```typescript
import { AuthService } from '@/services/auth/authService';

await AuthService.updateProfile({
  unitId: 'franchise-id-123',
  phone: '+5511999999999',
  avatar: 'https://example.com/avatar.jpg',
  location: {
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01001-000',
    address: 'Rua Exemplo, 123',
  },
});
```

### useAuth Hook

**Localização**: `src/features/auth/hooks/useAuth.ts`

**Método**: `updateProfile(data)`

**Características**:
- Valida se usuário está autenticado
- Gerencia estado de loading e erros
- Atualiza store automaticamente
- Suporta atualização de `unitId` e `location`

**Exemplo de uso**:
```typescript
const { updateProfile, isLoading } = useAuth();

await updateProfile({
  unitId: 'franchise-id-123',
  phone: '+5511999999999',
  location: {
    city: 'São Paulo',
    state: 'SP',
  },
});
```

## Integração com Gerenciamento de Franquias

O endpoint `/auth/profile` pode ser usado para:

1. **Alocar usuário à franquia**: Atualizar `unitId` do usuário
2. **Atualizar localização**: Atualizar dados de localização do usuário
3. **Atualizar informações pessoais**: Avatar, telefone, bio, etc.

### Exemplo: Alocar usuário à franquia

```typescript
// No FranchiseUsersManager ou similar
const allocateUserToFranchise = async (userId: string, franchiseId: string) => {
  const { AuthService } = await import('@/services/auth/authService');
  
  await AuthService.updateProfile({
    unitId: franchiseId,
  });
};
```

## Validações

- ✅ Token JWT obrigatório (via `JwtAuthGuard`)
- ✅ `unitId` opcional, mas se fornecido deve ser válido
- ✅ `bio` máximo de 500 caracteres
- ✅ `dateOfBirth` deve ser uma data válida (ISO string)
- ✅ Campos de `location` são opcionais, mas se fornecidos devem ser válidos

## Endpoints Relacionados

- `PUT /auth/profile` - Atualizar perfil (este endpoint)
- `GET /user/profile` - Obter perfil do usuário atual
- `POST /users/{id}/unit` - Atualizar unitId específico (backend-monorepo)

## Notas Importantes

1. **API de Segurança**: O endpoint está na API de segurança (`architecture-security`), não na API principal
2. **Base URL**: Usa `ENV_CONFIG.SYS_SEGURANCA_BASE_URL`
3. **Autenticação**: Requer token JWT válido no header `Authorization`
4. **API Key**: Requer header `X-API-Key` com a chave de API
5. **unitId**: Se `location` for atualizado, o `unitId` pode ser recalculado automaticamente pelo backend

