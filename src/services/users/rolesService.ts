import { httpClient, ApiResponse } from '../api/httpClient';
import { UserRole } from '@/features/auth/types';
import { getRoleDisplayName, getRoleDescription } from '@/features/auth/utils/roleUtils';

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Lista de roles disponíveis baseada nos tipos do sistema
const AVAILABLE_ROLES: UserRole[] = [
  'admin',
  'sistema',
  'system',
  'support',
  'franchisee',
  'gerente',
  'franquia',
  'franqueado',
  'parceiro',
  'vendedor',
  'lead',
];

// Permissões disponíveis organizadas por recurso
const AVAILABLE_PERMISSIONS: Permission[] = [
  // Dashboard
  { id: '1', name: 'dashboard:read', description: 'Visualizar dashboard', resource: 'dashboard', action: 'read' },
  { id: '2', name: 'dashboard:write', description: 'Gerenciar dashboard', resource: 'dashboard', action: 'write' },
  
  // Usuários
  { id: '3', name: 'users:read', description: 'Visualizar usuários', resource: 'users', action: 'read' },
  { id: '4', name: 'users:create', description: 'Criar usuários', resource: 'users', action: 'create' },
  { id: '5', name: 'users:update', description: 'Atualizar usuários', resource: 'users', action: 'update' },
  { id: '6', name: 'users:delete', description: 'Deletar usuários', resource: 'users', action: 'delete' },
  { id: '7', name: 'users:manage-roles', description: 'Gerenciar roles de usuários', resource: 'users', action: 'manage-roles' },
  
  // Produtos
  { id: '8', name: 'products:read', description: 'Visualizar produtos', resource: 'products', action: 'read' },
  { id: '9', name: 'products:create', description: 'Criar produtos', resource: 'products', action: 'create' },
  { id: '10', name: 'products:update', description: 'Atualizar produtos', resource: 'products', action: 'update' },
  { id: '11', name: 'products:delete', description: 'Deletar produtos', resource: 'products', action: 'delete' },
  
  // Pedidos
  { id: '12', name: 'orders:read', description: 'Visualizar pedidos', resource: 'orders', action: 'read' },
  { id: '13', name: 'orders:create', description: 'Criar pedidos', resource: 'orders', action: 'create' },
  { id: '14', name: 'orders:update', description: 'Atualizar pedidos', resource: 'orders', action: 'update' },
  { id: '15', name: 'orders:cancel', description: 'Cancelar pedidos', resource: 'orders', action: 'cancel' },
  
  // Clientes
  { id: '16', name: 'customers:read', description: 'Visualizar clientes', resource: 'customers', action: 'read' },
  { id: '17', name: 'customers:create', description: 'Criar clientes', resource: 'customers', action: 'create' },
  { id: '18', name: 'customers:update', description: 'Atualizar clientes', resource: 'customers', action: 'update' },
  
  // Leads
  { id: '19', name: 'leads:read', description: 'Visualizar leads', resource: 'leads', action: 'read' },
  { id: '20', name: 'leads:create', description: 'Criar leads', resource: 'leads', action: 'create' },
  { id: '21', name: 'leads:update', description: 'Atualizar leads', resource: 'leads', action: 'update' },
  
  // Franquias
  { id: '22', name: 'franchises:read', description: 'Visualizar franquias', resource: 'franchises', action: 'read' },
  { id: '23', name: 'franchises:create', description: 'Criar franquias', resource: 'franchises', action: 'create' },
  { id: '24', name: 'franchises:update', description: 'Atualizar franquias', resource: 'franchises', action: 'update' },
  
  // Perfil
  { id: '25', name: 'profile:read', description: 'Visualizar perfil', resource: 'profile', action: 'read' },
  { id: '26', name: 'profile:update', description: 'Atualizar perfil', resource: 'profile', action: 'update' },
  
  // Tarefas
  { id: '27', name: 'tasks:read', description: 'Visualizar tarefas', resource: 'tasks', action: 'read' },
  { id: '28', name: 'tasks:complete', description: 'Completar tarefas', resource: 'tasks', action: 'complete' },
  
  // Fornecedores
  { id: '29', name: 'suppliers:read', description: 'Visualizar fornecedores', resource: 'suppliers', action: 'read' },
];

export class RolesService {
  /**
   * Buscar roles disponíveis da API
   * Retorna roles com suas permissões associadas
   */
  static async getAvailableRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await httpClient.get<Role[]>('/roles');
      
      if (response.success && response.data) {
        // Normalizar dados da API para o formato esperado
        const roles: Role[] = Array.isArray(response.data) 
          ? response.data.map((role: any) => ({
              id: role.id || role.name,
              name: role.name,
              displayName: role.displayName || getRoleDisplayName(role.name),
              description: role.description || getRoleDescription(role.name),
              permissions: role.permissions || [],
            }))
          : [];
        
        return {
          success: true,
          data: roles,
        };
      }

      // Fallback para dados estáticos se API não retornar dados
      const roles: Role[] = AVAILABLE_ROLES.map((roleName) => ({
        id: roleName,
        name: roleName,
        displayName: getRoleDisplayName(roleName),
        description: getRoleDescription(roleName),
        permissions: [],
      }));

      return {
        success: true,
        data: roles,
      };
    } catch (error: any) {
      console.error('Erro ao buscar roles da API, usando fallback estático:', error);
      // Fallback para dados estáticos em caso de erro
      const roles: Role[] = AVAILABLE_ROLES.map((roleName) => ({
        id: roleName,
        name: roleName,
        displayName: getRoleDisplayName(roleName),
        description: getRoleDescription(roleName),
        permissions: [],
      }));

      return {
        success: true,
        data: roles,
      };
    }
  }

  /**
   * Buscar role específico por ID com suas permissões associadas
   */
  static async getRoleById(id: string): Promise<ApiResponse<Role>> {
    try {
      const response = await httpClient.get<Role>(`/roles/${id}`);
      
      if (response.success && response.data) {
        const roleData = response.data as any;
        const role: Role = {
          id: roleData.id || roleData.name,
          name: roleData.name,
          displayName: roleData.displayName || getRoleDisplayName(roleData.name),
          description: roleData.description || getRoleDescription(roleData.name),
          permissions: roleData.permissions || [],
        };

        return {
          success: true,
          data: role,
        };
      }

      // Fallback: buscar da lista estática
      const roleName = AVAILABLE_ROLES.find((r) => r === id);
      if (roleName) {
        return {
          success: true,
          data: {
            id: roleName,
            name: roleName,
            displayName: getRoleDisplayName(roleName),
            description: getRoleDescription(roleName),
            permissions: [],
          },
        };
      }

      return {
        success: false,
        error: 'Role não encontrado',
        data: undefined,
      };
    } catch (error: any) {
      console.error('Erro ao buscar role por ID:', error);
      return {
        success: false,
        error: error?.message || 'Erro ao buscar role',
        data: undefined,
      };
    }
  }

  /**
   * Buscar roles com permissões associadas
   * Alias para getAvailableRoles que garante que permissões estão incluídas
   */
  static async getRolesWithPermissions(): Promise<ApiResponse<Role[]>> {
    return this.getAvailableRoles();
  }

  /**
   * Buscar permissões disponíveis da API
   * Tenta buscar da API, com fallback para lista estática
   */
  static async getAvailablePermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      // Tentar buscar da API se endpoint existir
      const response = await httpClient.get<Permission[]>('/permissions');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Normalizar dados da API
        const permissions: Permission[] = response.data.map((perm: any) => ({
          id: perm.id || perm.name,
          name: perm.name,
          description: perm.description || perm.name,
          resource: perm.resource || perm.name.split(':')[0],
          action: perm.action || perm.name.split(':')[1] || 'read',
        }));

        return {
          success: true,
          data: permissions,
        };
      }

      // Fallback para lista estática se API não retornar dados
      return {
        success: true,
        data: AVAILABLE_PERMISSIONS,
      };
    } catch (error: any) {
      console.error('Erro ao buscar permissões da API, usando fallback estático:', error);
      // Fallback para lista estática em caso de erro
      return {
        success: true,
        data: AVAILABLE_PERMISSIONS,
      };
    }
  }

  /**
   * Buscar permissões por recurso
   */
  static async getPermissionsByResource(resource: string): Promise<ApiResponse<Permission[]>> {
    const response = await this.getAvailablePermissions();
    if (response.success && response.data) {
      const filtered = response.data.filter((p) => p.resource === resource);
      return {
        success: true,
        data: filtered,
      };
    }
    return response;
  }
}

