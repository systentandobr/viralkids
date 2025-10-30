# Sistema de Roles e Redirecionamento

## Visão Geral

Este sistema implementa um controle de acesso baseado em roles com redirecionamento automático após login.

## Roles Disponíveis

### Roles Administrativos
- `admin` - Administrador geral
- `sistema` - Usuário do sistema (acesso total)
- `system` - Usuário do sistema (acesso total)
- `support` - Suporte técnico

**Redirecionamento**: `/admin` (AdminDashboard)

### Roles de Franqueado
- `franchisee` - Franqueado padrão
- `gerente` - Gerente de franquia
- `franquia` - Franquia
- `franqueado` - Franqueado
- `parceiro` - Parceiro comercial
- `vendedor` - Vendedor

**Redirecionamento**: `/dashboard` (FranchiseeDashboard)

### Roles de Lead
- `lead` - Lead (usuário potencial)

**Redirecionamento**: `/` (Página inicial)

## Funcionalidades

### 1. Redirecionamento Automático
Após login bem-sucedido, o usuário é automaticamente redirecionado baseado em seu role:

```typescript
// Exemplo de uso
const { login, getUserRoleDisplayName, getDefaultRedirect } = useAuth();

// Após login, redirecionamento automático acontece
await login(credentials);

// Obter informações do role
const roleName = getUserRoleDisplayName(); // "Administrador", "Franqueado", etc.
const redirectPath = getDefaultRedirect(); // "/admin", "/dashboard", "/"
```

### 2. Validação de Acesso
O sistema valida automaticamente se o usuário tem permissão para acessar uma rota:

```typescript
// Rotas com proteção de role
{
  path: '/admin',
  component: AdminDashboard,
  requireAuth: true,
  allowedRoles: ['admin', 'support', 'sistema', 'system']
},
{
  path: '/dashboard',
  component: FranchiseeDashboard,
  requireAuth: true,
  allowedRoles: ['franchisee', 'gerente', 'franquia', 'franqueado', 'parceiro', 'vendedor']
}
```

### 3. Utilitários de Role

```typescript
// Verificar se é role administrativo
const isAdmin = isAdminRole(user.role);

// Verificar se é role de franqueado
const isFranchisee = isFranchiseeRole(user.role);

// Obter nome amigável do role
const displayName = getRoleDisplayName('sistema'); // "Sistema"

// Obter descrição do role
const description = getRoleDescription('franqueado'); // "Acesso ao painel do franqueado"
```

## Mapeamento de Roles da API

A API retorna roles em formato diferente, então fazemos o mapeamento:

```typescript
// API Response
{
  user: {
    roles: [
      {
        name: "system", // Mapeado para UserRole
        description: "Sistema - Acesso total a tudo",
        permissions: ["*"]
      }
    ]
  }
}

// Mapeamento no código
const userRole = authResult.user.roles?.[0]?.name || 'franchisee';
```

## Configuração

### Desabilitar Redirecionamento Automático
```typescript
const { login } = useAuth({ autoRedirect: false });
```

### Personalizar Redirecionamento
```typescript
// Após login, redirecionar manualmente
const { login, getDefaultRedirect } = useAuth({ autoRedirect: false });

await login(credentials);
const redirectPath = getDefaultRedirect();
navigate(redirectPath);
```

## Exemplos de Uso

### 1. Login com Redirecionamento Automático
```typescript
const { login, isLoading, error } = useAuth();

const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    // Redirecionamento automático baseado no role
  } catch (error) {
    console.error('Erro no login:', error);
  }
};
```

### 2. Verificação de Permissões
```typescript
const { user, hasRole } = useAuth();

// Verificar se pode acessar admin
if (hasRole('admin') || hasRole('sistema')) {
  // Mostrar opções administrativas
}

// Verificar se é franqueado
if (hasRole('franchisee') || hasRole('gerente')) {
  // Mostrar opções de franqueado
}
```

### 3. Exibição de Informações do Usuário
```typescript
const { user, getUserRoleDisplayName, getUserRoleDescription } = useAuth();

return (
  <div>
    <h2>{user?.name}</h2>
    <p>Role: {getUserRoleDisplayName()}</p>
    <p>Descrição: {getUserRoleDescription()}</p>
  </div>
);
```

## Segurança

- Todas as rotas protegidas verificam autenticação e roles
- Redirecionamento automático evita acesso não autorizado
- Mensagens de erro informativas para debugging
- Validação consistente em todo o sistema

## Debugging

Para debug, o sistema loga informações importantes:

```typescript
console.log(`Redirecionando usuário com role '${userRole}' para: ${redirectPath}`);
```

Isso ajuda a identificar problemas de redirecionamento e mapeamento de roles.
