# Gestão de Unidades (UnitId)

## Visão Geral

Cada usuário no sistema está vinculado a uma unidade (franquia) através do `unitId`. Este identificador é usado para:

- Filtrar dados automaticamente por unidade
- Garantir isolamento de dados entre franquias
- Controlar acesso a recursos específicos

## Estrutura do UnitId

O `unitId` segue o formato:
```
#PAÍS#ESTADO#CEP#NÚMERO_LOCAL
```

Exemplo: `#BR#SP#01001-000#0001`

## Como Funciona

### 1. No Login

Quando o usuário faz login, o sistema retorna:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "username": "...",
    "email": "...",
    "roles": [...],
    "profile": {
      "firstName": "...",
      "lastName": "...",
      "unitId": "#BR#SP#01001-000#0001",  // ✅ Sempre presente
      "location": {...}
    }
  }
}
```

### 2. No Backend

O `unitId` é:
- Extraído do token JWT automaticamente
- Injetado nas queries pelo `UnitIdInterceptor`
- Validado pelo `UnitScopeGuard` para garantir acesso apenas aos dados da própria unidade

### 3. No Frontend

O `unitId` é:
- Armazenado no estado do usuário autenticado
- Usado automaticamente em todas as queries React Query
- Filtra dados sem necessidade de passar manualmente

## Modificações no Architecture-Security

O endpoint `/api/v1/auth/login` foi modificado para garantir que o `unitId` seja sempre retornado no `profile` do usuário, mesmo que já esteja presente no objeto `user.profile`.

## Validação

- ✅ `unitId` é obrigatório no schema do usuário
- ✅ `unitId` é incluído no token JWT
- ✅ `unitId` é retornado no response do login
- ✅ `unitId` é validado em todas as operações

