export type ChatRole = 'user' | 'assistant' | 'attendant';

export type MessageType = 'text' | 'image' | 'audio';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  type: MessageType;
  timestamp: Date;
  metadata?: {
    imageUrl?: string;
    imageBase64?: string;
    audioUrl?: string;
    audioBase64?: string;
    lead_id?: string;
    customer_id?: string;
    user_id?: string;
    unit_id?: string;
    [key: string]: any;
  };
}

export interface ChatSession {
  sessionId: string;
  leadId?: string;
  customerId?: string;
  userId?: string;
  unitId: string;
  stage?: string;
  createdAt: Date;
  lastMessageAt?: Date;
}

export interface ChatbotPageProps {
  defaultUnitId?: string;
  className?: string;
}

export interface ChatApiResponse {
  message: string;
  session_id: string;
  role: 'assistant' | 'attendant';
  role_name?: string;
  lead_data?: any;
  metadata?: Record<string, any>;
}
