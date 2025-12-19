import { useState, useEffect, useCallback } from 'react';
import { ChatbotApiService } from '../services/chatbotApi';
import { ChatSession } from '../types';
import { getUrlParam } from '../utils/urlParams';

// Tentar importar store de autenticação
let useAuthStoreHook: any = null;
try {
  const authStoreModule = require('@/stores/auth.store');
  useAuthStoreHook = authStoreModule.useAuthStore;
} catch {
  // Store não disponível, continuar sem ela
}

export interface UseChatbotSessionParams {
  defaultUnitId?: string;
}

export function useChatbotSession({ defaultUnitId }: UseChatbotSessionParams = {}) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tentar obter user_id do store de autenticação
  let authUserId: string | undefined = undefined;
  try {
    if (useAuthStoreHook) {
      const user = useAuthStoreHook((state: any) => state.user);
      if (user?.id) {
        authUserId = user.id;
      }
    }
  } catch {
    // Ignorar erro se store não estiver disponível
  }

  // Extrair parâmetros da URL
  const urlLeadId = getUrlParam('leadId') || undefined;
  const urlUnitId = getUrlParam('unitId') || undefined;
  const urlCustomerId = getUrlParam('customerId') || undefined;
  const urlUserId = getUrlParam('userId') || undefined;
  const urlSessionId = getUrlParam('sessionId') || undefined;
  const urlStage = getUrlParam('stage') || undefined;

  // Determinar userId (prioridade: URL > Auth Context > gerar anônimo)
  // Se não tiver userId, gerar um ID anônimo baseado em localStorage
  const getOrCreateUserId = useCallback((): string => {
    if (urlUserId) return urlUserId;
    if (authUserId) return authUserId;
    
    // Gerar ou recuperar ID anônimo persistente
    if (typeof window !== 'undefined') {
      const storageKey = 'chatbot_anonymous_user_id';
      let anonymousId = localStorage.getItem(storageKey);
      if (!anonymousId) {
        anonymousId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(storageKey, anonymousId);
      }
      return anonymousId;
    }
    
    // Fallback para SSR
    return `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, [urlUserId, authUserId]);

  // Determinar unitId (prioridade: URL > prop > padrão)
  const unitId = urlUnitId || defaultUnitId || '#BR#ALL#SYSTEM#0001';

  const initializeSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Obter userId dentro do callback para garantir valor atualizado
    const userId = getOrCreateUserId();

    try {
      let sessionId = urlSessionId;
      let sessionFound = false;

      // Se temos sessionId na URL, verificar se pertence ao usuário atual
      if (sessionId) {
        // Verificar se a sessão pertence ao usuário
        // Por enquanto, assumir que sim se sessionId está na URL
        sessionFound = true;
      } else {
        // Buscar sessão existente OBRIGATORIAMENTE por user_id
        // Prioridade: user_id > lead_id > customer_id
        const findResult = await ChatbotApiService.findSession(
          unitId,
          urlLeadId, // lead_id opcional
          urlCustomerId, // customer_id opcional
          userId // user_id OBRIGATÓRIO
        );

        if (findResult.found && findResult.session_id) {
          sessionId = findResult.session_id;
          sessionFound = true;
        }
      }

      // Se não encontrou, criar nova sessão vinculada ao user_id
      if (!sessionId) {
        sessionId = ChatbotApiService.generateSessionId();
      }

      const newSession: ChatSession = {
        sessionId,
        leadId: urlLeadId,
        customerId: urlCustomerId,
        userId: userId, // Sempre incluir userId
        unitId,
        stage: urlStage,
        createdAt: new Date(),
      };

      setSession(newSession);
    } catch (err: any) {
      console.error('Erro ao inicializar sessão:', err);
      setError(err.message || 'Erro ao inicializar sessão');
      
      // Criar sessão anônima em caso de erro, mas sempre com userId
      const userId = getOrCreateUserId();
      const fallbackSession: ChatSession = {
        sessionId: ChatbotApiService.generateSessionId(),
        userId: userId,
        unitId,
        createdAt: new Date(),
      };
      setSession(fallbackSession);
    } finally {
      setIsLoading(false);
    }
  }, [unitId, urlLeadId, urlCustomerId, urlSessionId, urlStage, getOrCreateUserId]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const refreshSession = useCallback(() => {
    initializeSession();
  }, [initializeSession]);

  return {
    session,
    isLoading,
    error,
    refreshSession,
    unitId,
  };
}
