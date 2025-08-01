import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/config';

// Interfaces para franquias
export interface Franchise {
  id: string;
  name: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  location: {
    city: string;
    state: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  type: 'standard' | 'premium' | 'express';
  createdAt: Date;
  updatedAt: Date;
  metrics?: {
    totalSales: number;
    totalOrders: number;
    averageRating: number;
    customerCount: number;
  };
}

export interface FranchiseApplication {
  id: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
  };
  franchiseType: 'standard' | 'premium' | 'express';
  experience: string;
  budget: string;
  timeToStart: string;
  status: 'pending' | 'approved' | 'rejected' | 'interviewed';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface CreateFranchiseData {
  name: string;
  ownerId: string;
  location: {
    city: string;
    state: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  type: 'standard' | 'premium' | 'express';
}

export interface UpdateFranchiseData {
  name?: string;
  location?: {
    city: string;
    state: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status?: 'active' | 'inactive' | 'suspended';
}

export interface FranchiseFilters {
  status?: string;
  type?: string;
  state?: string;
  city?: string;
  search?: string;
}

export interface FranchiseStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  byType: {
    standard: number;
    premium: number;
    express: number;
  };
  byState: Record<string, number>;
  topPerformers: Franchise[];
}

// Classe do serviço de franquias
export class FranchiseService {
  // Listar franquias
  static async listFranchises(filters?: FranchiseFilters): Promise<ApiResponse<Franchise[]>> {
    const params = filters ? { ...filters } : {};
    return httpClient.get<Franchise[]>(API_ENDPOINTS.FRANCHISE.LIST, { params });
  }

  // Obter detalhes de uma franquia
  static async getFranchise(id: string): Promise<ApiResponse<Franchise>> {
    return httpClient.get<Franchise>(API_ENDPOINTS.FRANCHISE.DETAILS(id));
  }

  // Criar nova franquia
  static async createFranchise(data: CreateFranchiseData): Promise<ApiResponse<Franchise>> {
    return httpClient.post<Franchise>(API_ENDPOINTS.FRANCHISE.CREATE, data);
  }

  // Atualizar franquia
  static async updateFranchise(id: string, data: UpdateFranchiseData): Promise<ApiResponse<Franchise>> {
    return httpClient.put<Franchise>(API_ENDPOINTS.FRANCHISE.UPDATE(id), data);
  }

  // Deletar franquia
  static async deleteFranchise(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.FRANCHISE.DELETE(id));
  }

  // Aplicar para franquia
  static async applyForFranchise(application: Omit<FranchiseApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ id: string }>> {
    return httpClient.post<{ id: string }>(API_ENDPOINTS.FRANCHISE.APPLY, application);
  }

  // Obter estatísticas das franquias
  static async getFranchiseStats(): Promise<ApiResponse<FranchiseStats>> {
    return httpClient.get<FranchiseStats>('/franchise/stats');
  }

  // Obter franquias por localização
  static async getFranchisesByLocation(city: string, state: string): Promise<ApiResponse<Franchise[]>> {
    return httpClient.get<Franchise[]>(`/franchise/location/${state}/${city}`);
  }

  // Obter franquias próximas
  static async getNearbyFranchises(lat: number, lng: number, radius: number = 50): Promise<ApiResponse<Franchise[]>> {
    return httpClient.get<Franchise[]>(`/franchise/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  // Ativar/desativar franquia
  static async toggleFranchiseStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<ApiResponse<Franchise>> {
    return httpClient.patch<Franchise>(`/franchise/${id}/status`, { status });
  }

  // Obter aplicações de franquia
  static async getFranchiseApplications(status?: string): Promise<ApiResponse<FranchiseApplication[]>> {
    const params = status ? { status } : {};
    return httpClient.get<FranchiseApplication[]>('/franchise/applications', { params });
  }

  // Atualizar status de aplicação
  static async updateApplicationStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected' | 'interviewed',
    notes?: string
  ): Promise<ApiResponse<FranchiseApplication>> {
    return httpClient.patch<FranchiseApplication>(`/franchise/applications/${id}`, { status, notes });
  }

  // Obter métricas de uma franquia
  static async getFranchiseMetrics(id: string, period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    sales: number;
    orders: number;
    customers: number;
    rating: number;
    growth: number;
    period: string;
  }>> {
    return httpClient.get(`/franchise/${id}/metrics?period=${period}`);
  }

  // Exportar dados das franquias
  static async exportFranchises(format: 'csv' | 'excel' = 'csv'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return httpClient.get<{ downloadUrl: string }>(`/franchise/export?format=${format}`);
  }

  // Validar dados de franquia
  static validateFranchiseData(data: Partial<CreateFranchiseData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nome da franquia deve ter pelo menos 3 caracteres');
    }

    if (!data.location?.city || data.location.city.trim().length < 2) {
      errors.push('Cidade é obrigatória');
    }

    if (!data.location?.state || data.location.state.trim().length < 2) {
      errors.push('Estado é obrigatório');
    }

    if (!data.location?.address || data.location.address.trim().length < 10) {
      errors.push('Endereço deve ter pelo menos 10 caracteres');
    }

    if (!data.type || !['standard', 'premium', 'express'].includes(data.type)) {
      errors.push('Tipo de franquia inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validar dados de aplicação
  static validateApplicationData(data: Partial<FranchiseApplication>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.applicant?.name || data.applicant.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!data.applicant?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.applicant.email)) {
      errors.push('E-mail inválido');
    }

    if (!data.applicant?.phone || data.applicant.phone.trim().length < 10) {
      errors.push('Telefone inválido');
    }

    if (!data.applicant?.city || data.applicant.city.trim().length < 2) {
      errors.push('Cidade é obrigatória');
    }

    if (!data.applicant?.state || data.applicant.state.trim().length < 2) {
      errors.push('Estado é obrigatório');
    }

    if (!data.franchiseType || !['standard', 'premium', 'express'].includes(data.franchiseType)) {
      errors.push('Tipo de franquia inválido');
    }

    if (!data.experience || data.experience.trim().length < 10) {
      errors.push('Experiência deve ter pelo menos 10 caracteres');
    }

    if (!data.budget || data.budget.trim().length < 5) {
      errors.push('Orçamento é obrigatório');
    }

    if (!data.timeToStart || data.timeToStart.trim().length < 5) {
      errors.push('Prazo para início é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Obter tipos de franquia disponíveis
  static getFranchiseTypes(): Array<{ value: string; label: string; description: string; investment: string }> {
    return [
      {
        value: 'standard',
        label: 'Franquia Padrão',
        description: 'Modelo completo com todos os recursos',
        investment: 'R$ 50.000 - R$ 100.000',
      },
      {
        value: 'premium',
        label: 'Franquia Premium',
        description: 'Modelo avançado com recursos exclusivos',
        investment: 'R$ 100.000 - R$ 200.000',
      },
      {
        value: 'express',
        label: 'Franquia Express',
        description: 'Modelo simplificado para início rápido',
        investment: 'R$ 25.000 - R$ 50.000',
      },
    ];
  }
} 