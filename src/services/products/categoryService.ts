import { httpClient } from '../api/httpClient';
import { ApiResponse } from '../api/types';
import {
  ProductCategory,
  CreateCategoryData,
  UpdateCategoryData,
} from '@/pages/Admin/Products/types';

const API_BASE = '/categories';

export class CategoryService {
  /**
   * Criar nova categoria
   */
  static async create(data: CreateCategoryData): Promise<ApiResponse<ProductCategory>> {
    return httpClient.post<ProductCategory>(API_BASE, data);
  }

  /**
   * Listar todas as categorias
   */
  static async list(): Promise<ApiResponse<ProductCategory[]>> {
    return httpClient.get<ProductCategory[]>(API_BASE);
  }

  /**
   * Buscar categoria por ID
   */
  static async getById(id: string): Promise<ApiResponse<ProductCategory>> {
    return httpClient.get<ProductCategory>(`${API_BASE}/${id}`);
  }

  /**
   * Atualizar categoria
   */
  static async update(
    id: string,
    data: UpdateCategoryData
  ): Promise<ApiResponse<ProductCategory>> {
    return httpClient.patch<ProductCategory>(`${API_BASE}/${id}`, data);
  }

  /**
   * Deletar categoria
   */
  static async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.delete<{ success: boolean }>(`${API_BASE}/${id}`);
  }
}

