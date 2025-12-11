import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  CUSTOMER = 'customer',
  LOST = 'lost',
}

export enum LeadSource {
  CHATBOT = 'chatbot',
  WEBSITE = 'website',
  WHATSAPP = 'whatsapp',
  FORM = 'form',
  REFERRAL = 'referral',
}

export interface Lead {
  id: string;
  unitId: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  source: LeadSource;
  status: LeadStatus;
  metadata?: Record<string, any>;
  tags: string[];
  notes: Array<{
    content: string;
    author: string;
    createdAt: Date;
  }>;
  contactedAt?: Date;
  qualifiedAt?: Date;
  convertedAt?: Date;
  customerId?: string;
  score: number;
  pipeline?: {
    stage: string;
    stageHistory: Array<{
      stage: string;
      enteredAt: Date;
      exitedAt?: Date;
    }>;
  };
  // Campos de integração com Referrals
  referralCode?: string;
  referralId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  tags?: string[];
  minScore?: number;
  maxScore?: number;
  page?: number;
  limit?: number;
  referralCode?: string;
  hasReferral?: boolean; // true para leads com referral, false para sem referral
}

export interface LeadPipelineStats {
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  total: number;
  conversionRate: number;
}

export interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  source?: LeadSource;
  metadata?: Record<string, any>;
  tags?: string[];
  score?: number;
  referralCode?: string;
  referralId?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  status?: LeadStatus;
  note?: string;
  pipeline?: {
    stage: string;
  };
}

export class LeadService {
  static async list(filters?: LeadFilters): Promise<ApiResponse<{
    data: Lead[];
    total: number;
    page: number;
    limit: number;
  }>> {
    return httpClient.get(API_ENDPOINTS.LEADS.LIST, {
      params: filters,
    });
  }

  static async getById(id: string): Promise<ApiResponse<Lead>> {
    return httpClient.get(API_ENDPOINTS.LEADS.DETAIL(id));
  }

  static async getPipelineStats(): Promise<ApiResponse<LeadPipelineStats>> {
    return httpClient.get(`${API_ENDPOINTS.LEADS.LIST}/pipeline/stats`);
  }

  static async create(data: CreateLeadData): Promise<ApiResponse<Lead>> {
    return httpClient.post(API_ENDPOINTS.LEADS.CREATE, data);
  }

  static async update(id: string, data: UpdateLeadData): Promise<ApiResponse<Lead>> {
    return httpClient.patch(API_ENDPOINTS.LEADS.UPDATE(id), data);
  }

  static async convertToCustomer(id: string, customerId: string): Promise<ApiResponse<Lead>> {
    return httpClient.patch(`${API_ENDPOINTS.LEADS.LIST}/${id}/convert`, { customerId });
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(API_ENDPOINTS.LEADS.DELETE(id));
  }
}

