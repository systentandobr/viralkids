import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/features/auth';
import {
  ConversationService,
  ConversationSession,
  ConversationsResponse,
  SessionFilters,
} from '../chatbot/conversationService';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  sessions: () => [...conversationKeys.all, 'sessions'] as const,
  sessionsByUnit: (unitId: string, filters?: SessionFilters) =>
    [...conversationKeys.sessions(), 'unit', unitId, filters] as const,
  sessionHistory: (sessionId: string) =>
    [...conversationKeys.all, 'history', sessionId] as const,
  leadConversations: (leadId: string) =>
    [...conversationKeys.all, 'lead', leadId] as const,
  customerConversations: (customerId: string) =>
    [...conversationKeys.all, 'customer', customerId] as const,
};

/**
 * Hook para listar sessões por unitId
 */
export const useSessionsByUnitId = (
  unitId: string | undefined,
  filters?: SessionFilters
) => {
  return useQuery({
    queryKey: conversationKeys.sessionsByUnit(unitId || '', filters),
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await ConversationService.getSessionsByUnitId(unitId, filters);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar sessões');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para buscar histórico completo de uma sessão
 */
export const useSessionHistory = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.sessionHistory(sessionId || ''),
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('sessionId não fornecido');
      }
      const resp = await ConversationService.getSessionHistory(sessionId);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar histórico');
      return resp.data;
    },
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar conversas de um lead
 */
export const useLeadConversations = (leadId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.leadConversations(leadId || ''),
    queryFn: async () => {
      if (!leadId) {
        throw new Error('leadId não fornecido');
      }
      const resp = await ConversationService.getLeadConversations(leadId);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar conversas do lead');
      return resp.data;
    },
    enabled: !!leadId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para buscar conversas de um cliente
 */
export const useCustomerConversations = (customerId: string | undefined) => {
  return useQuery({
    queryKey: conversationKeys.customerConversations(customerId || ''),
    queryFn: async () => {
      if (!customerId) {
        throw new Error('customerId não fornecido');
      }
      const resp = await ConversationService.getCustomerConversations(customerId);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar conversas do cliente');
      return resp.data;
    },
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};



