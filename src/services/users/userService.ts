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
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    unitId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  unitId?: string;
  phone?: string;
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
    return httpClient.get('/users/by-unit', {
      params: { unitId },
    });
  }

  /**
   * Buscar usuários disponíveis (sem unitId ou com unitId diferente)
   */
  static async searchAvailable(search: string): Promise<ApiResponse<User[]>> {
    return httpClient.get('/users/available', {
      params: { search },
    });
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
   * Deletar usuário
   */
  static async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/users/${id}`);
  }
}

