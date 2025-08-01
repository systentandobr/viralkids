import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/config';

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

  // Processar resposta do usuário e gerar resposta do bot
  static async processUserInput(
    userInput: string,
    currentFlow?: string,
    leadData?: Partial<LeadData>
  ): Promise<ApiResponse<ChatbotResponse>> {
    const payload = {
      userInput,
      currentFlow,
      leadData,
      timestamp: new Date().toISOString(),
    };

    return httpClient.post<ChatbotResponse>(API_ENDPOINTS.CHATBOT.SEND_MESSAGE, payload);
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

  // Salvar conversa localmente (fallback)
  static saveConversationLocally(sessionId: string, messages: ChatMessage[]): void {
    try {
      const conversations = this.getLocalConversations();
      conversations[sessionId] = {
        id: sessionId,
        messages,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active' as const,
      };
      
      localStorage.setItem('viralkids_chatbot_conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Erro ao salvar conversa localmente:', error);
    }
  }

  // Obter conversas salvas localmente
  static getLocalConversations(): Record<string, ChatHistory> {
    try {
      const conversationsStr = localStorage.getItem('viralkids_chatbot_conversations');
      return conversationsStr ? JSON.parse(conversationsStr) : {};
    } catch (error) {
      console.error('Erro ao obter conversas locais:', error);
      return {};
    }
  }

  // Salvar lead localmente (fallback)
  static saveLeadLocally(leadData: LeadData): void {
    try {
      const leads = this.getLocalLeads();
      const newLead = {
        ...leadData,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'new' as const,
      };
      
      leads.push(newLead);
      localStorage.setItem('viralkids_chatbot_leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Erro ao salvar lead localmente:', error);
    }
  }

  // Obter leads salvos localmente
  static getLocalLeads(): (LeadData & { id: string; createdAt: string; status: string })[] {
    try {
      const leadsStr = localStorage.getItem('viralkids_chatbot_leads');
      return leadsStr ? JSON.parse(leadsStr) : [];
    } catch (error) {
      console.error('Erro ao obter leads locais:', error);
      return [];
    }
  }

  // Limpar dados locais
  static clearLocalData(): void {
    localStorage.removeItem('viralkids_chatbot_conversations');
    localStorage.removeItem('viralkids_chatbot_leads');
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