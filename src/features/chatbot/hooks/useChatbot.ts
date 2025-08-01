import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatFlow, LeadData, ChatbotState, ChatStep } from '../types';
import { generateId } from '../utils/helpers';
import { franchiseLeadFlow } from '../flows/franchiseFlow';

const initialState: ChatbotState = {
  isOpen: false,
  messages: [],
  currentFlow: undefined,
  currentStep: undefined,
  leadData: {},
  isLoading: false,
  error: null,
};

export const useChatbot = () => {
  const [state, setState] = useState<ChatbotState>(initialState);

  // Abrir/fechar chatbot
  const toggleChatbot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const openChatbot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
    if (state.messages.length === 0) {
      startFlow(franchiseLeadFlow);
    }
  }, [state.messages.length]);

  const closeChatbot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Adicionar mensagem
  const addMessage = useCallback((text: string, sender: 'user' | 'bot', type?: ChatMessage['type']) => {
    const message: ChatMessage = {
      id: generateId(),
      text,
      sender,
      timestamp: new Date(),
      type: type || 'text',
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    return message;
  }, []);

  // Iniciar fluxo de conversa
  const startFlow = useCallback((flow: ChatFlow) => {
    setState(prev => ({
      ...prev,
      currentFlow: flow,
      currentStep: flow.steps[0]?.id,
    }));

    // Enviar primeira mensagem do fluxo
    if (flow.steps[0]) {
      setTimeout(() => {
        addMessage(flow.steps[0].content, 'bot');
      }, 500);
    }
  }, [addMessage]);

  // Processar resposta do usuário
  const processUserMessage = useCallback(async (text: string) => {
    // Adicionar mensagem do usuário
    addMessage(text, 'user');

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (!state.currentFlow || !state.currentStep) {
        // Se não há fluxo ativo, iniciar fluxo padrão
        startFlow(franchiseLeadFlow);
        return;
      }

      const currentStep = state.currentFlow.steps.find(step => step.id === state.currentStep);
      if (!currentStep) {
        throw new Error('Step não encontrado');
      }

      // Processar baseado no tipo do step
      let nextStepId = currentStep.nextStep;

      if (currentStep.type === 'question' || currentStep.type === 'form') {
        // Validar resposta se necessário
        if (currentStep.validation) {
          const isValid = validateInput(text, currentStep.validation);
          if (!isValid) {
            addMessage('Por favor, verifique sua resposta e tente novamente.', 'bot');
            setState(prev => ({ ...prev, isLoading: false }));
            return;
          }
        }

        // Salvar dados do lead
        const fieldName = getFieldNameFromStep(currentStep);
        if (fieldName) {
          setState(prev => ({
            ...prev,
            leadData: {
              ...prev.leadData,
              [fieldName]: text,
            },
          }));
        }
      }

      // Verificar condições para próximo step
      if (currentStep.conditions) {
        for (const condition of currentStep.conditions) {
          if (evaluateCondition(condition, text, state.leadData)) {
            nextStepId = condition.nextStep;
            break;
          }
        }
      }

      // Ir para próximo step
      if (nextStepId) {
        const nextStep = state.currentFlow.steps.find(step => step.id === nextStepId);
        if (nextStep) {
          setState(prev => ({ ...prev, currentStep: nextStepId }));
          
          setTimeout(() => {
            addMessage(nextStep.content, 'bot');
            setState(prev => ({ ...prev, isLoading: false }));
          }, 1000);
        }
      } else {
        // Fim do fluxo - enviar dados para API
        await submitLead(state.leadData);
        addMessage(
          'Obrigado! Recebemos suas informações e entraremos em contato em breve. 🚀',
          'bot'
        );
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      setState(prev => ({
        ...prev,
        error: 'Desculpe, ocorreu um erro. Tente novamente.',
        isLoading: false,
      }));
    }
  }, [state.currentFlow, state.currentStep, state.leadData, addMessage, startFlow]);

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
      
      // Em desenvolvimento, apenas log
      localStorage.setItem('viralkids_lead', JSON.stringify({
        ...leadData,
        id: generateId(),
        source: 'chatbot',
        createdAt: new Date(),
        status: 'new',
      }));
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      throw error;
    }
  };

  // Limpar conversa
  const clearChat = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // Estado
    isOpen: state.isOpen,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    leadData: state.leadData,
    
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
