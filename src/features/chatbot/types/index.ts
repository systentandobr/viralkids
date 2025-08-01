// Types para o sistema de chatbot
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'image' | 'form';
  metadata?: Record<string, any>;
}

export interface QuickReply {
  id: string;
  text: string;
  payload: string;
  action?: () => void;
}

export interface ChatFlow {
  id: string;
  name: string;
  steps: ChatStep[];
  triggers: string[];
}

export interface ChatStep {
  id: string;
  type: 'message' | 'question' | 'form' | 'condition';
  content: string;
  quickReplies?: QuickReply[];
  nextStep?: string;
  conditions?: ChatCondition[];
  validation?: FormValidation;
}

export interface ChatCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: any;
  nextStep: string;
}

export interface FormValidation {
  required?: boolean;
  type?: 'email' | 'phone' | 'text' | 'number';
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export interface LeadData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  franchiseType: 'starter' | 'premium' | 'master';
  experience: 'none' | 'some' | 'experienced';
  budget: string;
  timeToStart: string;
  source: string;
  createdAt?: Date;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  currentFlow?: ChatFlow;
  currentStep?: string;
  leadData: Partial<LeadData>;
  isLoading: boolean;
  error: string | null;
}

export interface ChatbotConfig {
  greetingMessage: string;
  fallbackMessage: string;
  apiEndpoint: string;
  enableTyping: boolean;
  typingDelay: number;
  maxMessages: number;
}
