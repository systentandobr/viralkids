import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

// Interfaces para o chatbot
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
  metadata?: Record<string, any>;
}

export interface ChatHistory {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'closed';
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  city: string;
  franchiseType?: string;
  experience?: string;
  budget?: string;
  timeToStart?: string;
  source: 'chatbot' | 'website' | 'whatsapp';
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
}

export interface ChatbotResponse {
  message: string;
  quickReplies?: string[];
  nextStep?: string;
  metadata?: Record<string, any>;
}

// Classe do serviço de chatbot
export class ChatbotService {
  // Enviar mensagem para o chatbot
  static async sendMessage(
    message: string, 
    sessionId?: string,
    context?: Record<string, any>
  ): Promise<ApiResponse<ChatbotResponse>> {
    const payload = {
      message,
      sessionId,
      context,
    };
    
    return httpClient.post<ChatbotResponse>(API_ENDPOINTS.CHATBOT.SEND_MESSAGE, payload);
  }

  // Obter histórico de conversas
  static async getHistory(sessionId?: string): Promise<ApiResponse<ChatHistory[]>> {
    const params = sessionId ? { sessionId } : {};
    return httpClient.get<ChatHistory[]>(API_ENDPOINTS.CHATBOT.GET_HISTORY, { params });
  }

  // Submeter lead do chatbot
  static async submitLead(leadData: LeadData): Promise<ApiResponse<{ id: string }>> {
    return httpClient.post<{ id: string }>(API_ENDPOINTS.CHATBOT.SUBMIT_LEAD, leadData);
  }

  // Processar resposta do usuário usando Agno Agent
  static async processUserInput(
    userInput: string,
    currentFlow?: string,
    leadData?: Partial<LeadData>
  ): Promise<ApiResponse<ChatbotResponse & { metadata?: { leadData?: any; shouldSubmitLead?: boolean } }>> {
    const sessionId = this.generateSessionId();
    
    const payload = {
      message: userInput,
      session_id: sessionId,
      context: {
        currentFlow,
        leadData,
        ...leadData,
      },
    };

    // Chamar API do agente Agno (backend Python)
    const agnoApiUrl = import.meta.env.VITE_AGNO_API_URL || 'http://localhost:8001';
    
    try {
      const response = await fetch(`${agnoApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar mensagem');
      }

      const data = await response.json();
      
      // Detectar se deve submeter lead baseado na resposta
      const shouldSubmitLead = this._shouldSubmitLead(data.lead_data, leadData);
      
      return {
        success: true,
        data: {
          message: data.message,
          quickReplies: [],
          metadata: {
            leadData: data.lead_data,
            shouldSubmitLead,
            sessionId: data.session_id,
          },
        },
      };
    } catch (error) {
      console.error('Erro ao chamar Agno Agent:', error);
      // Fallback para API padrão
      return httpClient.post<ChatbotResponse>(API_ENDPOINTS.CHATBOT.SEND_MESSAGE, {
        userInput,
        currentFlow,
        leadData,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private static _shouldSubmitLead(
    detectedLeadData: any,
    currentLeadData?: Partial<LeadData>
  ): boolean {
    // Verificar se temos informações mínimas para criar lead
    const hasName = detectedLeadData?.name || currentLeadData?.name;
    const hasEmail = detectedLeadData?.email || currentLeadData?.email;
    const hasPhone = detectedLeadData?.phone || currentLeadData?.phone;
    
    return !!(hasName && hasEmail && hasPhone);
  }

  // Iniciar nova conversa
  static async startConversation(
    initialMessage?: string,
    context?: Record<string, any>
  ): Promise<ApiResponse<{ sessionId: string; response: ChatbotResponse }>> {
    const payload = {
      action: 'start',
      initialMessage,
      context,
    };

    return httpClient.post<{ sessionId: string; response: ChatbotResponse }>(
      API_ENDPOINTS.CHATBOT.SEND_MESSAGE, 
      payload
    );
  }

  // Finalizar conversa
  static async endConversation(sessionId: string): Promise<ApiResponse<void>> {
    const payload = {
      action: 'end',
      sessionId,
    };

    return httpClient.post<void>(API_ENDPOINTS.CHATBOT.SEND_MESSAGE, payload);
  }

  // Obter estatísticas do chatbot
  static async getStats(): Promise<ApiResponse<{
    totalConversations: number;
    activeConversations: number;
    totalLeads: number;
    conversionRate: number;
  }>> {
    return httpClient.get('/chatbot/stats');
  }

  // Gerar ID único para sessão
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validar dados do lead
  static validateLeadData(leadData: Partial<LeadData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!leadData.name || leadData.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!leadData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      errors.push('E-mail inválido');
    }

    if (!leadData.phone || leadData.phone.trim().length < 10) {
      errors.push('Telefone inválido');
    }

    if (!leadData.city || leadData.city.trim().length < 2) {
      errors.push('Cidade deve ter pelo menos 2 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
} 