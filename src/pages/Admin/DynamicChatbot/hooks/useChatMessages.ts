import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatRole } from '../types';
import { ChatbotApiService, SendImageParams, SendAudioParams } from '../services/chatbotApi';
import { ChatSession } from '../types';

export interface UseChatMessagesParams {
  session: ChatSession | null;
  onError?: (error: string) => void;
}

export function useChatMessages({ session, onError }: UseChatMessagesParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar histórico quando sessão for inicializada
  useEffect(() => {
    if (session?.sessionId) {
      loadHistory();
    }
  }, [session?.sessionId]);

  const loadHistory = useCallback(async () => {
    if (!session?.sessionId) return;

    try {
      setIsLoading(true);
      const history = await ChatbotApiService.getSessionHistory(session.sessionId);
      setMessages(history);
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      onError?.(error.message || 'Erro ao carregar histórico');
    } finally {
      setIsLoading(false);
    }
  }, [session?.sessionId, onError]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendTextMessage = useCallback(
    async (content: string, role: 'user' | 'attendant' = 'user') => {
      if (!session || !content.trim() || isSending) return;

      // Garantir que sempre temos userId
      if (!session.userId) {
        console.error('Sessão sem userId - não é possível enviar mensagem');
        return;
      }

      setIsSending(true);

      try {
        // Adicionar mensagem do usuário imediatamente
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          role,
          content: content.trim(),
          type: 'text',
          timestamp: new Date(),
          metadata: {
            lead_id: session.leadId,
            customer_id: session.customerId,
            user_id: session.userId, // Sempre incluir
            unit_id: session.unitId,
          },
        };
        addMessage(userMessage);

        // Enviar para API - sempre incluir userId
        const response = await ChatbotApiService.sendTextMessage({
          message: content.trim(),
          sessionId: session.sessionId,
          unitId: session.unitId,
          leadId: session.leadId,
          customerId: session.customerId,
          userId: session.userId, // OBRIGATÓRIO
          role,
        });

        // Adicionar resposta
        const responseMessage: ChatMessage = {
          id: `response-${Date.now()}`,
          role: response.role,
          content: response.message,
          type: 'text',
          timestamp: new Date(),
          metadata: response.metadata,
        };
        addMessage(responseMessage);
      } catch (error: any) {
        console.error('Erro ao enviar mensagem:', error);
        onError?.(error.message || 'Erro ao enviar mensagem');
      } finally {
        setIsSending(false);
      }
    },
    [session, isSending, addMessage, onError]
  );

  const sendImageMessage = useCallback(
    async (
      image: string,
      imageType: 'base64' | 'url',
      caption?: string,
      role: 'user' | 'attendant' = 'user'
    ) => {
      if (!session || isSending) return;

      // Garantir que sempre temos userId
      if (!session.userId) {
        console.error('Sessão sem userId - não é possível enviar imagem');
        return;
      }

      setIsSending(true);

      try {
        // Adicionar mensagem do usuário com imagem
        const userMessage: ChatMessage = {
          id: `image-${Date.now()}`,
          role,
          content: caption || '[Imagem]',
          type: 'image',
          timestamp: new Date(),
          metadata: {
            imageBase64: imageType === 'base64' ? image : undefined,
            imageUrl: imageType === 'url' ? image : undefined,
            lead_id: session.leadId,
            customer_id: session.customerId,
            user_id: session.userId, // Sempre incluir
            unit_id: session.unitId,
          },
        };
        addMessage(userMessage);

        // Enviar para API - sempre incluir userId
        const params: SendImageParams = {
          message: caption || '[Imagem]',
          sessionId: session.sessionId,
          unitId: session.unitId,
          leadId: session.leadId,
          customerId: session.customerId,
          userId: session.userId, // OBRIGATÓRIO
          role,
          image,
          imageType,
        };

        const response = await ChatbotApiService.sendImageMessage(params);

        // Adicionar resposta
        const responseMessage: ChatMessage = {
          id: `response-${Date.now()}`,
          role: response.role,
          content: response.message,
          type: 'text',
          timestamp: new Date(),
          metadata: response.metadata,
        };
        addMessage(responseMessage);
      } catch (error: any) {
        console.error('Erro ao enviar imagem:', error);
        onError?.(error.message || 'Erro ao enviar imagem');
      } finally {
        setIsSending(false);
      }
    },
    [session, isSending, addMessage, onError]
  );

  const sendAudioMessage = useCallback(
    async (
      audio: string,
      audioType: 'base64' | 'url',
      transcription?: string,
      role: 'user' | 'attendant' = 'user'
    ) => {
      if (!session || isSending) return;

      // Garantir que sempre temos userId
      if (!session.userId) {
        console.error('Sessão sem userId - não é possível enviar áudio');
        return;
      }

      setIsSending(true);

      try {
        // Adicionar mensagem do usuário com áudio
        const userMessage: ChatMessage = {
          id: `audio-${Date.now()}`,
          role,
          content: transcription || '[Áudio]',
          type: 'audio',
          timestamp: new Date(),
          metadata: {
            audioBase64: audioType === 'base64' ? audio : undefined,
            audioUrl: audioType === 'url' ? audio : undefined,
            lead_id: session.leadId,
            customer_id: session.customerId,
            user_id: session.userId, // Sempre incluir
            unit_id: session.unitId,
          },
        };
        addMessage(userMessage);

        // Enviar para API - sempre incluir userId
        const params: SendAudioParams = {
          message: transcription || '[Áudio]',
          sessionId: session.sessionId,
          unitId: session.unitId,
          leadId: session.leadId,
          customerId: session.customerId,
          userId: session.userId, // OBRIGATÓRIO
          role,
          audio,
          audioType,
        };

        const response = await ChatbotApiService.sendAudioMessage(params);

        // Adicionar resposta
        const responseMessage: ChatMessage = {
          id: `response-${Date.now()}`,
          role: response.role,
          content: response.message,
          type: 'text',
          timestamp: new Date(),
          metadata: response.metadata,
        };
        addMessage(responseMessage);
      } catch (error: any) {
        console.error('Erro ao enviar áudio:', error);
        onError?.(error.message || 'Erro ao enviar áudio');
      } finally {
        setIsSending(false);
      }
    },
    [session, isSending, addMessage, onError]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    messagesEndRef,
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage,
    clearMessages,
    loadHistory,
  };
}
