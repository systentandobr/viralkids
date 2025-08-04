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

  // Processar resposta do usuário
  const processUserMessage = useCallback(async (text: string) => {
    // Adicionar mensagem do usuário
    addMessage(text, 'user');
    setLoading(true);

    try {
      if (!currentFlow || !currentStep) {
        // Se não há fluxo ativo, iniciar fluxo padrão
        startFlow(franchiseLeadFlow);
        return;
      }

      const flow = franchiseLeadFlow; // Em produção, buscar flow pelo ID
      const currentStepObj = flow.steps.find(step => step.id === currentStep);
      if (!currentStepObj) {
        throw new Error('Step não encontrado');
      }

      // Processar baseado no tipo do step
      let nextStepId = currentStepObj.nextStep;

      if (currentStepObj.type === 'question' || currentStepObj.type === 'form') {
        // Validar resposta se necessário
        if (currentStepObj.validation) {
          const isValid = validateInput(text, currentStepObj.validation);
          if (!isValid) {
            addMessage('Por favor, verifique sua resposta e tente novamente.', 'bot');
            setLoading(false);
            return;
          }
        }

        // Salvar dados do lead
        const fieldName = getFieldNameFromStep(currentStepObj);
        if (fieldName) {
          updateLeadData({ [fieldName]: text });
        }
      }

      // Verificar condições para próximo step
      if (currentStepObj.conditions) {
        for (const condition of currentStepObj.conditions) {
          if (evaluateCondition(condition, text, leadData)) {
            nextStepId = condition.nextStep;
            break;
          }
        }
      }

      // Ir para próximo step
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
        // Fim do fluxo - enviar dados para API
        await submitLead(leadData);
        addMessage(
          'Obrigado! Recebemos suas informações e entraremos em contato em breve. 🚀',
          'bot'
        );
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
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
      // TODO: Implementar chamada para API real
      console.log('Enviando lead:', leadData);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar store para salvar lead
      const leadToSave = {
        ...leadData,
        id: generateId(),
        source: 'chatbot',
        createdAt: new Date(),
        status: 'new' as const,
      };
      
      await saveLead(leadToSave);
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
