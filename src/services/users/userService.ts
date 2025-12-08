import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  unitId?: string;
  roles?: Array<{
    id?: string;
    name: string;
    description?: string;
    permissions?: string[];
    isSystem?: boolean;
    isActive?: boolean;
  } | string>;
  permissions?: string[] | Array<{
    id?: string;
    name: string;
    description?: string;
    resource?: string;
    action?: string;
  }>;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    unitId?: string;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface AllUsersAvailableResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  zipCode: string;
  localNumber: string;
  unitName: string;
  address: string;
  complement: string;
  neighborhood: string;
  city: string;
  latitude: number;
  longitude: number;
  unitId?: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  unitId?: string | null;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  unitId?: string;
  page?: number;
  limit?: number;
}

export class UserService {
  /**
   * Listar usuários
   */
  static async list(filters?: UserFilters): Promise<ApiResponse<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }>> {
    return httpClient.get(API_ENDPOINTS.USERS.LIST || '/users', {
      params: filters,
    });
  }

  /**
   * Buscar usuários por unitId (franquia)
   */
  static async listByUnitId(unitId: string): Promise<ApiResponse<User[]>> {
    const response = await httpClient.get<{ data: User[]; total: number; page?: number; limit?: number }>('/users/by-unit', {
      params: { unitId },
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao buscar usuários por unitId');
    }
    
    // O backend retorna { data: [...], total: 1, page: 1, limit: 50 }
    // Precisamos extrair o array 'data' de dentro do objeto
    if (response.data && typeof response.data === 'object') {
      // Se response.data tem uma propriedade 'data' que é um array, usar ela
      if ('data' in response.data && Array.isArray((response.data as any).data)) {
        return {
          success: true,
          data: (response.data as any).data as User[],
        };
      }
      // Se response.data já é um array, usar diretamente
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data as User[],
        };
      }
    }
    
    // Caso padrão: retornar array vazio se não conseguir extrair
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Buscar usuários disponíveis (sem unitId ou com unitId diferente)
   * O backend filtra automaticamente por domain e unitId do usuário autenticado
   */
  static async searchAllUsersAvailable(search: string): Promise<ApiResponse<User[]>> {
    const response = await httpClient.get<User[] | AllUsersAvailableResponse>('/users/available', {
      params: { search },
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Erro ao buscar usuários disponíveis');
    }

    // Se a resposta já é um array, retornar diretamente
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
      };
    }

    // Se a resposta tem estrutura { data: [], total, page, limit }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const dataObj = response.data as AllUsersAvailableResponse;
      return {
        success: true,
        data: Array.isArray(dataObj.data) ? dataObj.data : [],
      };
    }

    // Caso padrão: retornar array vazio
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Obter usuário por ID
   */
  static async getById(id: string): Promise<ApiResponse<User>> {
    return httpClient.get(`/users/${id}`);
  }

  /**
   * Criar novo usuário
   */
  static async create(data: CreateUserData): Promise<ApiResponse<User>> {
    return httpClient.post('/users', data);
  }

  /**
   * Atualizar usuário
   */
  static async update(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return httpClient.patch(`/users/${id}`, data);
  }

  /**
   * Atualizar unitId do usuário (alocar/remover de franquia)
   */
  static async updateUnitId(
    userId: string,
    data: { unitId: string | null; role?: string }
  ): Promise<ApiResponse<User>> {
    return httpClient.patch(`/users/${userId}/unit`, data);
  }

  /**
   * Atualizar roles e permissões do usuário
   */
  static async updateRoles(
    userId: string,
    data: { roles?: string[]; permissions?: string[] }
  ): Promise<ApiResponse<User>> {
    return httpClient.patch(`/users/${userId}/roles`, data);
  }

  /**
   * Deletar usuário
   */
  static async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/users/${id}`);
  }
}

