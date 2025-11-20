import { useCallback, useMemo } from 'react';
import { useChatbotStore } from '@/stores/chatbot.store';
import { ChatMessage, ChatFlow, LeadData, ChatStep } from '../types';
import { generateId } from '../utils/helpers';
import { franchiseLeadFlow } from '../flows/franchiseFlow';

export const useChatbot = () => {
  // Estado da store - usando seletores simples para evitar loops
  const isOpen = useChatbotStore(state => state.isOpen);
  const isLoading = useChatbotStore(state => state.isLoading);
  const error = useChatbotStore(state => state.error);
  const currentFlow = useChatbotStore(state => state.currentSession?.currentFlow);
  const currentStep = useChatbotStore(state => state.currentSession?.currentStep);
  const currentSession = useChatbotStore(state => state.currentSession);
  
  // Cachear valores derivados para evitar re-renders desnecessários
  const messages = useMemo(() => currentSession?.messages || [], [currentSession?.messages]);
  const leadData = useMemo(() => currentSession?.leadData || {}, [currentSession?.leadData]);
  
  // Ações da store
  const storeToggleChatbot = useChatbotStore(state => state.toggleChatbot);
  const storeOpenChatbot = useChatbotStore(state => state.openChatbot);
  const storeCloseChatbot = useChatbotStore(state => state.closeChatbot);
  const addMessage = useChatbotStore(state => state.addMessage);
  const setCurrentFlow = useChatbotStore(state => state.setCurrentFlow);
  const setCurrentStep = useChatbotStore(state => state.setCurrentStep);
  const updateLeadData = useChatbotStore(state => state.updateLeadData);
  const setLoading = useChatbotStore(state => state.setLoading);
  const setError = useChatbotStore(state => state.setError);
  const clearMessages = useChatbotStore(state => state.clearMessages);
  const saveLead = useChatbotStore(state => state.saveLead);

  // Abrir/fechar chatbot
  const toggleChatbot = useCallback(() => {
    storeToggleChatbot();
  }, [storeToggleChatbot]);

  const openChatbot = useCallback(() => {
    storeOpenChatbot();
    if (messages.length === 0) {
      startFlow(franchiseLeadFlow);
    }
  }, [storeOpenChatbot, messages.length]);

  const closeChatbot = useCallback(() => {
    storeCloseChatbot();
  }, [storeCloseChatbot]);

  // Iniciar fluxo de conversa
  const startFlow = useCallback((flow: ChatFlow) => {
    setCurrentFlow(flow.id);
    setCurrentStep(flow.steps[0]?.id);

    // Enviar primeira mensagem do fluxo
    if (flow.steps[0]) {
      setTimeout(() => {
        addMessage(flow.steps[0].content, 'bot');
      }, 500);
    }
  }, [setCurrentFlow, setCurrentStep, addMessage]);

  // Processar resposta do usuário usando Agno Agent
  const processUserMessage = useCallback(async (text: string) => {
    // Adicionar mensagem do usuário
    addMessage(text, 'user');
    setLoading(true);

    try {
      // Usar ChatbotService para enviar mensagem ao agente Agno
      const { ChatbotService } = await import('@/services/chatbot/chatbotService');
      
      const sessionId = currentSession?.id || `session_${Date.now()}`;
      
      const response = await ChatbotService.processUserInput(
        text,
        currentFlow,
        leadData
      );

      if (response.success && response.data) {
        // Adicionar resposta do bot
        addMessage(response.data.message, 'bot');
        
        // Atualizar dados do lead se detectados
        if (response.data.metadata?.leadData) {
          updateLeadData(response.data.metadata.leadData);
        }
        
        // Se o agente detectou que coletou informações suficientes, submeter lead
        if (response.data.metadata?.shouldSubmitLead && leadData.name && leadData.email && leadData.phone) {
          await submitLead(leadData);
        }
      } else {
        // Fallback para fluxo manual se API falhar
        await processManualFlow(text);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      // Fallback para fluxo manual
      await processManualFlow(text);
    }
  }, [currentFlow, currentStep, leadData, addMessage, setLoading, setError, updateLeadData, setCurrentStep, currentSession]);

  // Processar fluxo manual (fallback)
  const processManualFlow = useCallback(async (text: string) => {
    try {
      if (!currentFlow || !currentStep) {
        startFlow(franchiseLeadFlow);
        return;
      }

      const flow = franchiseLeadFlow;
      const currentStepObj = flow.steps.find(step => step.id === currentStep);
      if (!currentStepObj) {
        throw new Error('Step não encontrado');
      }

      let nextStepId = currentStepObj.nextStep;

      if (currentStepObj.type === 'question' || currentStepObj.type === 'form') {
        if (currentStepObj.validation) {
          const isValid = validateInput(text, currentStepObj.validation);
          if (!isValid) {
            addMessage('Por favor, verifique sua resposta e tente novamente.', 'bot');
            setLoading(false);
            return;
          }
        }

        const fieldName = getFieldNameFromStep(currentStepObj);
        if (fieldName) {
          updateLeadData({ [fieldName]: text });
        }
      }

      if (currentStepObj.conditions) {
        for (const condition of currentStepObj.conditions) {
          if (evaluateCondition(condition, text, leadData)) {
            nextStepId = condition.nextStep;
            break;
          }
        }
      }

      if (nextStepId) {
        const nextStep = flow.steps.find(step => step.id === nextStepId);
        if (nextStep) {
          setCurrentStep(nextStepId);
          setTimeout(() => {
            addMessage(nextStep.content, 'bot');
            setLoading(false);
          }, 1000);
        }
      } else {
        await submitLead(leadData);
        addMessage(
          'Obrigado! Recebemos suas informações e entraremos em contato em breve. 🚀',
          'bot'
        );
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro no fluxo manual:', error);
      setError('Desculpe, ocorreu um erro. Tente novamente.');
      setLoading(false);
    }
  }, [currentFlow, currentStep, leadData, addMessage, startFlow, setLoading, setError, updateLeadData, setCurrentStep]);

  // Processar quick reply
  const processQuickReply = useCallback((payload: string, text: string) => {
    processUserMessage(text);
  }, [processUserMessage]);

  // Validar input
  const validateInput = (input: string, validation: any): boolean => {
    if (validation.required && (!input || input.trim().length === 0)) {
      return false;
    }

    if (validation.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    }

    if (validation.type === 'phone') {
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return phoneRegex.test(input);
    }

    if (validation.minLength && input.length < validation.minLength) {
      return false;
    }

    if (validation.maxLength && input.length > validation.maxLength) {
      return false;
    }

    return true;
  };

  // Obter nome do campo baseado no step
  const getFieldNameFromStep = (step: ChatStep): string | null => {
    const stepFieldMap: Record<string, string> = {
      'name-step': 'name',
      'email-step': 'email',
      'phone-step': 'phone',
      'city-step': 'city',
      'franchise-type-step': 'franchiseType',
      'experience-step': 'experience',
      'budget-step': 'budget',
      'timeToStart-step': 'timeToStart',
    };

    return stepFieldMap[step.id] || null;
  };

  // Avaliar condição
  const evaluateCondition = (condition: any, userInput: string, leadData: Partial<LeadData>): boolean => {
    const value = condition.field === 'userInput' ? userInput : leadData[condition.field as keyof LeadData];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'contains':
        return typeof value === 'string' && value.toLowerCase().includes(condition.value.toLowerCase());
      case 'greater':
        return Number(value) > condition.value;
      case 'less':
        return Number(value) < condition.value;
      default:
        return false;
    }
  };

  // Enviar lead para API
  const submitLead = async (leadData: Partial<LeadData>) => {
    try {
      const { LeadService } = await import('@/services/leads/leadService');
      const { LeadSource } = await import('@/services/leads/leadService');
      
      // Validar dados mínimos
      if (!leadData.name || !leadData.email || !leadData.phone) {
        throw new Error('Dados incompletos para criar lead');
      }
      
      // Criar lead via API
      const response = await LeadService.create({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city,
        source: LeadSource.CHATBOT,
        metadata: {
          franchiseType: leadData.franchiseType,
          experience: leadData.experience,
          budget: leadData.budget,
          timeToStart: leadData.timeToStart,
          chatbotSessionId: currentSession?.id,
        },
      });
      
      if (response.success) {
        // Salvar também na store local
        const leadToSave = {
          ...leadData,
          id: response.data?.id || generateId(),
          source: 'chatbot',
          createdAt: new Date(),
          status: 'new' as const,
        };
        
        await saveLead(leadToSave);
      }
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      throw error;
    }
  };

  // Limpar conversa
  const clearChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

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
