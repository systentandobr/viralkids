import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'customer_inactive' | 'customer_vip' | 'new_customer' | 'low_conversion' | 'pending_reward';
    conditions: Record<string, any>;
  };
  action: {
    type: 'create_campaign' | 'send_notification' | 'assign_task' | 'update_status';
    config: Record<string, any>;
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRecommendation {
  type: 'campaign' | 'reward' | 'alert';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export class ReferralAutomationService {
  static async getAutomations(filters?: {
    enabled?: boolean;
    franchiseId?: string;
  }): Promise<ApiResponse<AutomationRule[]>> {
    return httpClient.get('/admin/referrals/automations', {
      params: filters,
    });
  }

  static async createAutomation(data: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AutomationRule>> {
    return httpClient.post('/admin/referrals/automations', data);
  }

  static async updateAutomation(id: string, data: Partial<AutomationRule>): Promise<ApiResponse<AutomationRule>> {
    return httpClient.patch(`/admin/referrals/automations/${id}`, data);
  }

  static async deleteAutomation(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(`/admin/referrals/automations/${id}`);
  }

  static async getRecommendations(filters?: {
    franchiseId?: string;
    type?: string;
  }): Promise<ApiResponse<AutomationRecommendation[]>> {
    return httpClient.get('/admin/referrals/automations/recommendations', {
      params: filters,
    });
  }

  static async executeAutomation(id: string): Promise<ApiResponse<any>> {
    return httpClient.post(`/admin/referrals/automations/${id}/execute`);
  }
}

