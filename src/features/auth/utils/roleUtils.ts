import { UserRole } from '../types';

// Mapeamento de roles para categorias de acesso
export const ROLE_CATEGORIES = {
  ADMIN: ['admin', 'sistema', 'system', 'support'] as UserRole[],
  FRANCHISEE: ['franchisee', 'gerente', 'franquia', 'franqueado', 'parceiro', 'vendedor'] as UserRole[],
  LEAD: ['lead'] as UserRole[]
} as const;

// Função para determinar se um role tem acesso administrativo
export const isAdminRole = (role: UserRole): boolean => {
  return ROLE_CATEGORIES.ADMIN.includes(role);
};

// Função para determinar se um role tem acesso de franqueado
export const isFranchiseeRole = (role: UserRole): boolean => {
  return ROLE_CATEGORIES.FRANCHISEE.includes(role);
};

// Função para determinar se um role é de lead
export const isLeadRole = (role: UserRole): boolean => {
  return ROLE_CATEGORIES.LEAD.includes(role);
};

// Função para obter o redirecionamento padrão baseado no role
export const getDefaultRedirectPath = (role: UserRole): string => {
  if (isAdminRole(role)) {
    return '/admin';
  }
  
  if (isFranchiseeRole(role)) {
    return '/dashboard';
  }
  
  if (isLeadRole(role)) {
    return '/';
  }
  
  // Fallback para usuários sem role definido
  return '/';
};

// Função para verificar se um usuário pode acessar uma rota específica
export const canAccessRoute = (userRole: UserRole, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Função para obter o nome amigável do role
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrador',
    sistema: 'Sistema',
    system: 'Sistema',
    support: 'Suporte',
    franchisee: 'Franqueado',
    gerente: 'Gerente',
    franquia: 'Franquia',
    franqueado: 'Franqueado',
    parceiro: 'Parceiro',
    vendedor: 'Vendedor',
    lead: 'Lead'
  };
  
  return roleNames[role] || role;
};

// Função para obter a descrição do role
export const getRoleDescription = (role: UserRole): string => {
  const roleDescriptions: Record<UserRole, string> = {
    admin: 'Acesso total ao sistema administrativo',
    sistema: 'Acesso total ao sistema (usuário do sistema)',
    system: 'Acesso total ao sistema (usuário do sistema)',
    support: 'Acesso ao painel de suporte e atendimento',
    franchisee: 'Acesso ao painel do franqueado',
    gerente: 'Acesso ao painel de gerenciamento',
    franquia: 'Acesso ao painel da franquia',
    franqueado: 'Acesso ao painel do franqueado',
    parceiro: 'Acesso ao painel do parceiro',
    vendedor: 'Acesso ao painel do vendedor',
    lead: 'Acesso limitado para leads'
  };
  
  return roleDescriptions[role] || 'Acesso padrão';
};
