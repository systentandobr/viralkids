import { ChatApiResponse, ChatMessage, ChatRole } from '../types';

const PYTHON_API_URL = import.meta.env.VITE_AGNO_API_URL || import.meta.env.VITE_PYTHON_CHATBOT_API_URL || 'http://localhost:7001';

export interface SendMessageParams {
  message: string;
  sessionId: string;
  unitId: string;
  leadId?: string;
  customerId?: string;
  userId?: string;
  role?: 'user' | 'attendant';
  context?: Record<string, any>;
}

export interface SendImageParams extends SendMessageParams {
  image: string; // base64 ou URL
  imageType: 'base64' | 'url';
}

export interface SendAudioParams extends SendMessageParams {
  audio: string; // base64 ou URL
  audioType: 'base64' | 'url';
}

export class ChatbotApiService {
  /**
   * Envia mensagem de texto
   */
  static async sendTextMessage(params: SendMessageParams): Promise<ChatApiResponse> {
    const response = await fetch(`${PYTHON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        session_id: params.sessionId,
        unit_id: params.unitId,
        lead_id: params.leadId,
        customer_id: params.customerId,
        user_id: params.userId,
        role: params.role || 'user',
        context: params.context,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erro ao enviar mensagem' }));
      throw new Error(error.detail || error.message || 'Erro ao enviar mensagem');
    }

    return response.json();
  }

  /**
   * Envia mensagem com imagem
   */
  static async sendImageMessage(params: SendImageParams): Promise<ChatApiResponse> {
    const response = await fetch(`${PYTHON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message || '[Imagem]',
        session_id: params.sessionId,
        unit_id: params.unitId,
        lead_id: params.leadId,
        customer_id: params.customerId,
        user_id: params.userId,
        role: params.role || 'user',
        context: {
          ...params.context,
          hasImage: true,
          imageType: params.imageType,
          image: params.image,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erro ao enviar imagem' }));
      throw new Error(error.detail || error.message || 'Erro ao enviar imagem');
    }

    return response.json();
  }

  /**
   * Envia mensagem com áudio
   */
  static async sendAudioMessage(params: SendAudioParams): Promise<ChatApiResponse> {
    const response = await fetch(`${PYTHON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message || '[Áudio]',
        session_id: params.sessionId,
        unit_id: params.unitId,
        lead_id: params.leadId,
        customer_id: params.customerId,
        user_id: params.userId,
        role: params.role || 'user',
        context: {
          ...params.context,
          hasAudio: true,
          audioType: params.audioType,
          audio: params.audio,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erro ao enviar áudio' }));
      throw new Error(error.detail || error.message || 'Erro ao enviar áudio');
    }

    return response.json();
  }

  /**
   * Busca sessão existente por identificadores
   * Prioridade: user_id (obrigatório) > lead_id > customer_id
   */
  static async findSession(
    unitId: string,
    leadId?: string,
    customerId?: string,
    userId?: string
  ): Promise<{ session_id: string | null; found: boolean }> {
    try {
      const params = new URLSearchParams({ unit_id: unitId });
      
      // user_id é OBRIGATÓRIO para filtrar corretamente
      if (userId) {
        params.append('user_id', userId);
      }
      
      // Parâmetros opcionais
      if (leadId) params.append('lead_id', leadId);
      if (customerId) params.append('customer_id', customerId);

      const response = await fetch(`${PYTHON_API_URL}/sessions/find?${params.toString()}`);

      if (!response.ok) {
        return { session_id: null, found: false };
      }

      const result = await response.json();
      
      // Verificar se a sessão encontrada realmente pertence ao user_id
      if (result.found && result.session_id && userId) {
        // Buscar detalhes da sessão para validar
        try {
          const sessionResponse = await fetch(`${PYTHON_API_URL}/sessions/${result.session_id}`);
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            // Verificar se o userId da sessão corresponde
            if (sessionData.session?.userId !== userId) {
              // Sessão não pertence ao usuário, retornar não encontrada
              return { session_id: null, found: false };
            }
          }
        } catch {
          // Se não conseguir validar, assumir que está ok
        }
      }

      return result;
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      return { session_id: null, found: false };
    }
  }

  /**
   * Busca histórico de uma sessão
   */
  static async getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${PYTHON_API_URL}/sessions/${sessionId}/history`);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const messages = data.messages || [];

      return messages.map((msg: any) => ({
        id: `${msg.timestamp || Date.now()}-${Math.random()}`,
        role: msg.role as ChatRole,
        content: msg.content || '',
        type: this.detectMessageType(msg),
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        metadata: msg.metadata || {},
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  /**
   * Detecta o tipo de mensagem baseado no conteúdo/metadata
   */
  private static detectMessageType(msg: any): MessageType {
    if (msg.metadata?.imageUrl || msg.metadata?.imageBase64) return 'image';
    if (msg.metadata?.audioUrl || msg.metadata?.audioBase64) return 'audio';
    return 'text';
  }

  /**
   * Gera um novo session ID
   */
  static generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
