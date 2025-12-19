import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'attendant';
  content: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface ConversationSession {
  sessionId: string;
  firstMessageAt: string;
  lastMessageAt: string;
  messageCount: number;
  history: ConversationMessage[];
}

export interface ConversationsResponse {
  sessions: ConversationSession[];
}

export interface SessionFilters {
  limit?: number;
  offset?: number;
  leadId?: string;
  customerId?: string;
}

export class ConversationService {
  /**
   * Lista sessões por unitId
   */
  static async getSessionsByUnitId(
    unitId: string,
    filters?: SessionFilters
  ): Promise<ApiResponse<ConversationsResponse>> {
    return httpClient.get(`/sessions/unit/${unitId}`, {
      params: filters,
    });
  }

  /**
   * Busca histórico completo de uma sessão
   */
  static async getSessionHistory(sessionId: string): Promise<ApiResponse<{
    session_id: string;
    messages: ConversationMessage[];
  }>> {
    return httpClient.get(`/sessions/${sessionId}/history`);
  }

  /**
   * Busca conversas de um lead
   */
  static async getLeadConversations(leadId: string): Promise<ApiResponse<ConversationsResponse>> {
    return httpClient.get(API_ENDPOINTS.LEADS.DETAIL(leadId) + '/conversations');
  }

  /**
   * Busca conversas de um cliente
   */
  static async getCustomerConversations(customerId: string): Promise<ApiResponse<ConversationsResponse>> {
    return httpClient.get(API_ENDPOINTS.CUSTOMERS.DETAIL(customerId) + '/conversations');
  }
}



