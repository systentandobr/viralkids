import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipos para chatbot e leads
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick_reply' | 'image' | 'file';
  metadata?: Record<string, any>;
}

interface LeadData {
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
  metadata?: Record<string, any>;
}

interface ChatbotSession {
  id: string;
  messages: ChatMessage[];
  currentFlow?: string;
  currentStep?: string;
  leadData: Partial<LeadData>;
  startedAt: Date;
  lastInteraction: Date;
  isCompleted: boolean;
}

interface ChatbotState {
  // Estado do chatbot
  isOpen: boolean;
  currentSession: ChatbotSession | null;
  isLoading: boolean;
  error: string | null;
  
  // Histórico e dados
  sessions: ChatbotSession[];
  leads: LeadData[];
  
  // Configurações
  autoSave: boolean;
  sessionTimeout: number; // em minutos
}

interface ChatbotActions {
  // Controle do chatbot
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Sessões
  createSession: () => ChatbotSession;
  endSession: () => void;
  getCurrentSession: () => ChatbotSession | null;
  getSessionHistory: () => ChatbotSession[];
  
  // Mensagens
  addMessage: (text: string, sender: 'user' | 'bot', type?: ChatMessage['type']) => void;
  clearMessages: () => void;
  
  // Leads
  updateLeadData: (data: Partial<LeadData>) => void;
  saveLead: () => Promise<void>;
  getLeads: () => LeadData[];
  getLeadById: (id: string) => LeadData | undefined;
  updateLead: (id: string, data: Partial<LeadData>) => void;
  deleteLead: (id: string) => void;
  
  // Fluxo de conversa
  setCurrentFlow: (flowId: string) => void;
  setCurrentStep: (stepId: string) => void;
  
  // Utilitários
  isSessionActive: () => boolean;
  cleanupOldSessions: () => void;
  exportLeads: () => LeadData[];
  importLeads: (leads: LeadData[]) => void;
}

type ChatbotStore = ChatbotState & ChatbotActions;

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialState: ChatbotState = {
  isOpen: false,
  currentSession: null,
  isLoading: false,
  error: null,
  sessions: [],
  leads: [],
  autoSave: true,
  sessionTimeout: 30, // 30 minutos
};

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Controle do chatbot
      openChatbot: () => {
        const currentSession = get().getCurrentSession();
        if (!currentSession) {
          get().createSession();
        }
        set({ isOpen: true });
      },

      closeChatbot: () => {
        set({ isOpen: false });
      },

      toggleChatbot: () => {
        const { isOpen } = get();
        if (isOpen) {
          get().closeChatbot();
        } else {
          get().openChatbot();
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Sessões
      createSession: () => {
        const session: ChatbotSession = {
          id: generateId(),
          messages: [],
          leadData: {
            source: 'chatbot',
            status: 'new',
            tags: [],
            notes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          startedAt: new Date(),
          lastInteraction: new Date(),
          isCompleted: false,
        };

        set((state) => ({
          currentSession: session,
          sessions: [...state.sessions, session],
        }));

        return session;
      },

      endSession: () => {
        const { currentSession } = get();
        if (currentSession) {
          // Marcar sessão como completa
          const updatedSession = {
            ...currentSession,
            isCompleted: true,
            lastInteraction: new Date(),
          };

          set((state) => ({
            currentSession: null,
            sessions: state.sessions.map(s => 
              s.id === currentSession.id ? updatedSession : s
            ),
          }));

          // Auto-salvar lead se houver dados suficientes
          if (get().autoSave && currentSession.leadData.email) {
            get().saveLead();
          }
        }
      },

      getCurrentSession: () => get().currentSession,

      getSessionHistory: () => get().sessions,

      // Mensagens
      addMessage: (text, sender, type = 'text') => {
        const { currentSession } = get();
        if (!currentSession) {
          get().createSession();
        }

        const message: ChatMessage = {
          id: generateId(),
          text,
          sender,
          timestamp: new Date(),
          type,
        };

        set((state) => {
          const session = state.currentSession!;
          const updatedSession = {
            ...session,
            messages: [...session.messages, message],
            lastInteraction: new Date(),
          };

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map(s => 
              s.id === session.id ? updatedSession : s
            ),
          };
        });
      },

      clearMessages: () => {
        set((state) => {
          if (state.currentSession) {
            const updatedSession = {
              ...state.currentSession,
              messages: [],
              lastInteraction: new Date(),
            };

            return {
              currentSession: updatedSession,
              sessions: state.sessions.map(s => 
                s.id === state.currentSession!.id ? updatedSession : s
              ),
            };
          }
          return state;
        });
      },

      // Leads
      updateLeadData: (data) => {
        set((state) => {
          if (state.currentSession) {
            const updatedSession = {
              ...state.currentSession,
              leadData: {
                ...state.currentSession.leadData,
                ...data,
                updatedAt: new Date(),
              },
              lastInteraction: new Date(),
            };

            return {
              currentSession: updatedSession,
              sessions: state.sessions.map(s => 
                s.id === state.currentSession!.id ? updatedSession : s
              ),
            };
          }
          return state;
        });
      },

      saveLead: async () => {
        const { currentSession, leads } = get();
        if (!currentSession || !currentSession.leadData.email) {
          throw new Error('Dados insuficientes para salvar lead');
        }

        try {
          const leadData: LeadData = {
            id: generateId(),
            ...currentSession.leadData,
            source: currentSession.leadData.source || 'chatbot',
            status: currentSession.leadData.status || 'new',
            tags: currentSession.leadData.tags || [],
            notes: currentSession.leadData.notes || [],
            createdAt: currentSession.leadData.createdAt || new Date(),
            updatedAt: new Date(),
          } as LeadData;

          // Verificar se lead já existe (por email)
          const existingLeadIndex = leads.findIndex(l => l.email === leadData.email);
          
          if (existingLeadIndex >= 0) {
            // Atualizar lead existente
            set((state) => ({
              leads: state.leads.map(l => 
                l.email === leadData.email ? { ...l, ...leadData } : l
              ),
            }));
          } else {
            // Adicionar novo lead
            set((state) => ({
              leads: [...state.leads, leadData],
            }));
          }

          console.log('Lead salvo com sucesso:', leadData);
        } catch (error) {
          console.error('Erro ao salvar lead:', error);
          throw error;
        }
      },

      getLeads: () => get().leads,

      getLeadById: (id) => get().leads.find(l => l.id === id),

      updateLead: (id, data) => {
        set((state) => ({
          leads: state.leads.map(l => 
            l.id === id 
              ? { ...l, ...data, updatedAt: new Date() }
              : l
          ),
        }));
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter(l => l.id !== id),
        }));
      },

      // Fluxo de conversa
      setCurrentFlow: (flowId) => {
        set((state) => {
          if (state.currentSession) {
            const updatedSession = {
              ...state.currentSession,
              currentFlow: flowId,
              lastInteraction: new Date(),
            };

            return {
              currentSession: updatedSession,
              sessions: state.sessions.map(s => 
                s.id === state.currentSession!.id ? updatedSession : s
              ),
            };
          }
          return state;
        });
      },

      setCurrentStep: (stepId) => {
        set((state) => {
          if (state.currentSession) {
            const updatedSession = {
              ...state.currentSession,
              currentStep: stepId,
              lastInteraction: new Date(),
            };

            return {
              currentSession: updatedSession,
              sessions: state.sessions.map(s => 
                s.id === state.currentSession!.id ? updatedSession : s
              ),
            };
          }
          return state;
        });
      },

      // Utilitários
      isSessionActive: () => {
        const { currentSession, sessionTimeout } = get();
        if (!currentSession) return false;
        
        const timeoutMs = sessionTimeout * 60 * 1000;
        const timeSinceLastInteraction = Date.now() - currentSession.lastInteraction.getTime();
        
        return timeSinceLastInteraction < timeoutMs;
      },

      cleanupOldSessions: () => {
        const { sessions, sessionTimeout } = get();
        const cutoffTime = Date.now() - (sessionTimeout * 60 * 1000 * 24); // 24x o timeout
        
        set({
          sessions: sessions.filter(s => 
            s.lastInteraction.getTime() > cutoffTime || !s.isCompleted
          ),
        });
      },

      exportLeads: () => get().leads,

      importLeads: (leads) => {
        set((state) => ({
          leads: [...state.leads, ...leads],
        }));
      },
    }),
    {
      name: 'viralkids-chatbot-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions.slice(-10), // Manter apenas as 10 sessões mais recentes
        leads: state.leads,
        autoSave: state.autoSave,
        sessionTimeout: state.sessionTimeout,
      }),
      version: 1,
    }
  )
);
