import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface Customer {
  id: string;
  unitId: string;
  name: string;
  email: string;
  phone?: string;
  totalPurchases: number;
  totalSpent: number;
  status: 'vip' | 'ativo' | 'novo';
  firstPurchaseAt?: Date;
  lastPurchaseAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFilters {
  search?: string;
  status?: 'vip' | 'ativo' | 'novo';
  page?: number;
  limit?: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  vip: number;
  new: number;
  averageTicket: number;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  status?: 'vip' | 'ativo' | 'novo';
  totalPurchases?: number;
  totalSpent?: number;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  isActive?: boolean;
}

export class CustomerService {
  static async list(filters?: CustomerFilters): Promise<ApiResponse<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
  }>> {
    return httpClient.get(API_ENDPOINTS.CUSTOMERS?.LIST || '/customers', {
      params: filters,
    });
  }

  static async getById(id: string): Promise<ApiResponse<Customer>> {
    return httpClient.get(`${API_ENDPOINTS.CUSTOMERS?.LIST || '/customers'}/${id}`);
  }

  static async getStats(): Promise<ApiResponse<CustomerStats>> {
    return httpClient.get(`${API_ENDPOINTS.CUSTOMERS?.LIST || '/customers'}/stats`);
  }

  static async create(data: CreateCustomerData): Promise<ApiResponse<Customer>> {
    return httpClient.post(API_ENDPOINTS.CUSTOMERS?.LIST || '/customers', data);
  }

  static async update(id: string, data: UpdateCustomerData): Promise<ApiResponse<Customer>> {
    return httpClient.patch(`${API_ENDPOINTS.CUSTOMERS?.LIST || '/customers'}/${id}`, data);
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`${API_ENDPOINTS.CUSTOMERS?.LIST || '/customers'}/${id}`);
  }
}

