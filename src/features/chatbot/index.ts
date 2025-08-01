// Exportações principais da feature de chatbot
export { Chatbot } from './components/Chatbot';
export { useChatbot } from './hooks/useChatbot';
export type { 
  ChatMessage, 
  ChatFlow, 
  LeadData, 
  ChatbotState,
  ChatbotConfig,
  QuickReply,
  ChatStep
} from './types';
export { franchiseLeadFlow, supportFlow, productInfoFlow, selectFlow } from './flows/franchiseFlow';
export * from './utils/helpers';
