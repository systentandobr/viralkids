import { useCallback } from 'react';
import { useChatbotStore } from '@/stores/chatbot.store';

// Re-exportar tipos para compatibilidade
export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick_reply' | 'image' | 'file';
};

export type LeadData = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  franchiseType?: 'starter' | 'premium' | 'master';
  experience?: 'none' | 'some' | 'experienced';
  budget?: string;
  timeToStart?: 'immediately' | '1_month' | '2_3_months' | 'still_deciding';
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  score?: number;
  tags: string[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
};

interface UseChatbotReturn {
  // Estado
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  leadData: Partial<LeadData>;
  
  // Ações
  toggleChatbot: () => void;
  openChatbot: () => void;
  closeChatbot: () => void;
  processUserMessage: (text: string) => Promise<void>;
  processQuickReply: (payload: string, text: string) => void;
  clearChat: () => void;
  startFlow: (flow: any) => void;
}

export const useChatbot = (): UseChatbotReturn => {
  // Estado da store
  const isOpen = useChatbotStore(state => state.isOpen);
  const isLoading = useChatbotStore(state => state.isLoading);
  const error = useChatbotStore(state => state.error);
  const currentSession = useChatbotStore(state => state.currentSession);
  
  // Ações da store
  const storeOpenChatbot = useChatbotStore(state => state.openChatbot);
  const storeCloseChatbot = useChatbotStore(state => state.closeChatbot);
  const storeToggleChatbot = useChatbotStore(state => state.toggleChatbot);
  const addMessage = useChatbotStore(state => state.addMessage);
  const updateLeadData = useChatbotStore(state => state.updateLeadData);
  const setLoading = useChatbotStore(state => state.setLoading);
  const setError = useChatbotStore(state => state.setError);
  const setCurrentFlow = useChatbotStore(state => state.setCurrentFlow);
  const setCurrentStep = useChatbotStore(state => state.setCurrentStep);
  const saveLead = useChatbotStore(state => state.saveLead);
  const clearMessages = useChatbotStore(state => state.clearMessages);
  const createSession = useChatbotStore(state => state.createSession);

  // Dados computados
  const messages = currentSession?.messages || [];
  const leadData = currentSession?.leadData || {};

  // Implementações para manter compatibilidade
  const openChatbot = useCallback(() => {
    storeOpenChatbot();
  }, [storeOpenChatbot]);

  const closeChatbot = useCallback(() => {
    storeCloseChatbot();
  }, [storeCloseChatbot]);

  const toggleChatbot = useCallback(() => {
    storeToggleChatbot();
  }, [storeToggleChatbot]);

  const processUserMessage = useCallback(async (text: string) => {
    // Adicionar mensagem do usuário
    addMessage(text, 'user');
    setLoading(true);

    try {
      // Simular processamento (em produção seria lógica real de IA/chatbot)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lógica básica de resposta (expandir conforme necessário)
      let botResponse = "Entendi! Como posso ajudar você?";
      
      if (text.toLowerCase().includes('franquia')) {
        botResponse = "Ótimo! Você tem interesse em nossa franquia. Qual é o seu nome?";
      } else if (text.toLowerCase().includes('preço')) {
        botResponse = "Nossos pacotes começam em R$ 2.997. Gostaria de saber mais detalhes?";
      } else if (text.includes('@')) {
        // Detectar email
        updateLeadData({ email: text });
        botResponse = "Perfeito! Salvei seu email. Qual é o seu telefone para contato?";
      } else if (text.match(/^\(\d{2}\)/)) {
        // Detectar telefone
        updateLeadData({ phone: text });
        botResponse = "Ótimo! Em qual cidade você está localizado?";
      }

      // Adicionar resposta do bot
      setTimeout(() => {
        addMessage(botResponse, 'bot');
        setLoading(false);
      }, 500);

      // Se temos dados suficientes, salvar lead
      if (leadData.email && leadData.phone) {
        try {
          await saveLead();
        } catch (error) {
          console.warn('Erro ao salvar lead:', error);
        }
      }

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      setError('Desculpe, ocorreu um erro. Tente novamente.');
      setLoading(false);
    }
  }, [addMessage, setLoading, setError, updateLeadData, leadData, saveLead]);

  const processQuickReply = useCallback((payload: string, text: string) => {
    // Processar resposta rápida
    processUserMessage(text);
  }, [processUserMessage]);

  const clearChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const startFlow = useCallback((flow: any) => {
    if (flow && flow.id) {
      setCurrentFlow(flow.id);
      
      // Iniciar primeiro step se existir
      if (flow.steps && flow.steps[0]) {
        setCurrentStep(flow.steps[0].id);
        
        // Enviar primeira mensagem
        setTimeout(() => {
          addMessage(flow.steps[0].content, 'bot');
        }, 500);
      }
    }
  }, [setCurrentFlow, setCurrentStep, addMessage]);

  return {
    // Estado
    isOpen,
    messages,
    isLoading,
    error,
    leadData,
    
    // Ações
    toggleChatbot,
    openChatbot,
    closeChatbot,
    processUserMessage,
    processQuickReply,
    clearChat,
    startFlow,
  };
};
