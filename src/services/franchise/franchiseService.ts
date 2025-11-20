import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface FranchiseLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'physical' | 'digital';
}

export interface FranchiseTerritory {
  city: string;
  state: string;
  exclusive: boolean;
  radius?: number;
}

export interface FranchiseMetrics {
  totalOrders: number;
  totalSales: number;
  totalLeads: number;
  conversionRate: number;
  averageTicket: number;
  customerCount: number;
  growthRate: number;
  lastMonthSales: number;
  lastMonthOrders: number;
  lastMonthLeads: number;
}

export interface Franchise {
  id: string;
  unitId: string;
  name: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  location: FranchiseLocation;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  type: 'standard' | 'premium' | 'express';
  territory?: FranchiseTerritory;
  metrics?: FranchiseMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegionalTrend {
  region: string;
  state: string;
  franchisesCount: number;
  totalSales: number;
  growthRate: number;
  averageTicket: number;
  leadsCount: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface FranchiseFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  type?: 'standard' | 'premium' | 'express';
  state?: string[];
  city?: string[];
  page?: number;
  limit?: number;
}

export interface CreateFranchiseData {
  unitId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  location: FranchiseLocation;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  type?: 'standard' | 'premium' | 'express';
  territory?: FranchiseTerritory;
}

export interface UpdateFranchiseData extends Partial<CreateFranchiseData> {}

export class FranchiseService {
  static async list(filters?: FranchiseFilters): Promise<ApiResponse<{
    data: Franchise[];
    total: number;
    page: number;
    limit: number;
  }>> {
    return httpClient.get(API_ENDPOINTS.FRANCHISES.LIST, {
      params: filters,
    });
  }

  static async getById(id: string): Promise<ApiResponse<Franchise>> {
    return httpClient.get(API_ENDPOINTS.FRANCHISES.DETAIL(id));
  }

  static async getMetrics(id: string): Promise<ApiResponse<FranchiseMetrics>> {
    return httpClient.get(API_ENDPOINTS.FRANCHISES.METRICS(id));
  }

  static async getRegionalTrends(): Promise<ApiResponse<RegionalTrend[]>> {
    return httpClient.get(API_ENDPOINTS.FRANCHISES.REGIONAL_TRENDS);
  }

  static async create(data: CreateFranchiseData): Promise<ApiResponse<Franchise>> {
    return httpClient.post(API_ENDPOINTS.FRANCHISES.CREATE, data);
  }

  static async update(id: string, data: UpdateFranchiseData): Promise<ApiResponse<Franchise>> {
    return httpClient.patch(API_ENDPOINTS.FRANCHISES.UPDATE(id), data);
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(API_ENDPOINTS.FRANCHISES.DELETE(id));
  }
}
