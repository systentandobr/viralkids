import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipos para dashboard administrativo
interface AdminDashboard {
  overview: {
    totalLeads: number;
    newLeadsToday: number;
    activeFranchises: number;
    totalRevenue: number;
    monthlyGrowth: number;
    conversionRate: number;
    averageTicket: number;
    customerSatisfaction: number;
  };
  leads: {
    total: number;
    newToday: number;
    qualified: number;
    converted: number;
    conversionRate: number;
    averageResponseTime: number;
    leadsBySource: Array<{
      source: string;
      count: number;
      percentage: number;
      conversionRate: number;
    }>;
    leadsByStatus: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    leadsByPackage: Array<{
      package: string;
      count: number;
      percentage: number;
      averageValue: number;
    }>;
    recentLeads: Lead[];
  };
  franchises: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    newThisMonth: number;
    byPackage: Array<{
      package: string;
      count: number;
      percentage: number;
      averageRevenue: number;
    }>;
    byRegion: Array<{
      state: string;
      count: number;
      percentage: number;
      averagePerformance: number;
    }>;
    averagePerformance: number;
    topPerformers: Array<{
      id: string;
      name: string;
      city: string;
      package: string;
      score: number;
      revenue: number;
      tasksCompleted: number;
    }>;
  };
  sales: {
    totalRevenue: number;
    monthlyRevenue: number;
    franchiseFees: number;
    royalties: number;
    productsRevenue: number;
    trainingRevenue: number;
    growth: {
      monthlyGrowth: number;
      quarterlyGrowth: number;
      yearlyGrowth: number;
      targetAchievement: number;
    };
    forecast: Array<{
      month: string;
      predicted: number;
      actual?: number;
      target: number;
    }>;
  };
  suppliers: {
    total: number;
    verified: number;
    byState: Array<{
      state: string;
      count: number;
      percentage: number;
    }>;
    averageRating: number;
    newPartnerships: number;
    activeContracts: number;
  };
  performance: {
    websiteTraffic: {
      totalVisits: number;
      uniqueVisitors: number;
      pageViews: number;
      bounceRate: number;
      averageSessionDuration: number;
      topPages: Array<{
        page: string;
        views: number;
        uniqueViews: number;
        conversionRate: number;
      }>;
      conversionRate: number;
    };
    chatbotMetrics: {
      totalConversations: number;
      completedFlows: number;
      averageFlowCompletion: number;
      leadGeneration: number;
      mostCommonQuestions: Array<{
        question: string;
        count: number;
        percentage: number;
      }>;
      userSatisfaction: number;
    };
    emailMetrics: {
      sentEmails: number;
      openRate: number;
      clickRate: number;
      unsubscribeRate: number;
      bounceRate: number;
      topCampaigns: Array<{
        campaign: string;
        openRate: number;
        clickRate: number;
        conversions: number;
      }>;
    };
    socialMedia: {
      instagram: {
        followers: number;
        growth: number;
        engagement: number;
        reach: number;
        leads: number;
      };
      facebook: {
        followers: number;
        growth: number;
        engagement: number;
        reach: number;
        leads: number;
      };
      tiktok: {
        followers: number;
        growth: number;
        engagement: number;
        reach: number;
        leads: number;
      };
      whatsapp: {
        followers: number;
        growth: number;
        engagement: number;
        reach: number;
        leads: number;
      };
    };
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    actor: string;
    timestamp: Date;
    icon: string;
    severity: 'success' | 'warning' | 'error' | 'info';
  }>;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  franchiseType: 'starter' | 'premium' | 'master';
  experience: 'none' | 'some' | 'experienced';
  budget: string;
  timeToStart: 'immediately' | '1_month' | '2_3_months' | 'still_deciding';
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  score: number;
  tags: string[];
  notes: Array<{
    id: string;
    content: string;
    author: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  region?: string[];
  package?: string[];
  status?: string[];
  source?: string[];
}

interface AdminState {
  // Dados principais
  dashboard: AdminDashboard | null;
  leads: Lead[];
  filteredLeads: Lead[];
  
  // Filtros e configurações
  filters: AdminFilters;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Estado da aplicação
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Cache e otimizações
  cacheExpiry: number; // em milissegundos
  lastFetched: number | null;
}

interface AdminActions {
  // Dados
  setDashboard: (dashboard: AdminDashboard) => void;
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Filtros
  setFilters: (filters: Partial<AdminFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  
  // Estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAutoRefresh: (autoRefresh: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  
  // Cache
  shouldRefresh: () => boolean;
  refreshData: () => void;
  clearCache: () => void;
  
  // Utilitários para leads
  getLeadById: (id: string) => Lead | undefined;
  getLeadsByStatus: (status: Lead['status']) => Lead[];
  getTodayLeads: () => Lead[];
  getLeadsBySource: (source: string) => Lead[];
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  addLeadNote: (id: string, note: Omit<Lead['notes'][0], 'id'>) => void;
  
  // Analytics
  getMetrics: () => {
    totalLeads: number;
    todayLeads: number;
    conversionRate: number;
    averageScore: number;
  };
  
  // Export/Import
  exportLeads: () => Lead[];
  importLeads: (leads: Lead[]) => void;
  exportDashboard: () => AdminDashboard | null;
}

type AdminStore = AdminState & AdminActions;

const initialFilters: AdminFilters = {
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    end: new Date(),
  },
};

const initialState: AdminState = {
  dashboard: null,
  leads: [],
  filteredLeads: [],
  filters: initialFilters,
  autoRefresh: false,
  refreshInterval: 30000, // 30 segundos
  loading: false,
  error: null,
  lastUpdated: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutos
  lastFetched: null,
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters de dados
      setDashboard: (dashboard) => {
        set({
          dashboard,
          lastUpdated: new Date(),
          lastFetched: Date.now(),
          error: null,
        });
      },

      setLeads: (leads) => {
        set({
          leads,
          lastUpdated: new Date(),
          lastFetched: Date.now(),
        });
        // Aplicar filtros após carregar leads
        get().applyFilters();
      },

      addLead: (lead) => {
        set((state) => ({
          leads: [lead, ...state.leads],
          lastUpdated: new Date(),
        }));
        get().applyFilters();
      },

      updateLead: (id, data) => {
        set((state) => ({
          leads: state.leads.map(lead =>
            lead.id === id
              ? { ...lead, ...data, updatedAt: new Date() }
              : lead
          ),
          lastUpdated: new Date(),
        }));
        get().applyFilters();
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter(lead => lead.id !== id),
          lastUpdated: new Date(),
        }));
        get().applyFilters();
      },

      // Filtros
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
        get().applyFilters();
      },

      clearFilters: () => {
        set({ filters: initialFilters });
        get().applyFilters();
      },

      applyFilters: () => {
        const { leads, filters } = get();
        let filtered = [...leads];

        // Filtro por data
        filtered = filtered.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          return leadDate >= filters.dateRange.start && 
                 leadDate <= filters.dateRange.end;
        });

        // Filtro por região
        if (filters.region && filters.region.length > 0) {
          filtered = filtered.filter(lead => 
            filters.region!.includes(lead.city)
          );
        }

        // Filtro por pacote
        if (filters.package && filters.package.length > 0) {
          filtered = filtered.filter(lead => 
            filters.package!.includes(lead.franchiseType)
          );
        }

        // Filtro por status
        if (filters.status && filters.status.length > 0) {
          filtered = filtered.filter(lead => 
            filters.status!.includes(lead.status)
          );
        }

        // Filtro por fonte
        if (filters.source && filters.source.length > 0) {
          filtered = filtered.filter(lead => 
            filters.source!.includes(lead.source)
          );
        }

        set({ filteredLeads: filtered });
      },

      // Estado
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),

      // Cache
      shouldRefresh: () => {
        const { lastFetched, cacheExpiry } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > cacheExpiry;
      },

      refreshData: () => {
        // Esta função seria chamada pelos componentes para forçar atualização
        set({
          lastFetched: null, // Força nova busca
          loading: true,
        });
      },

      clearCache: () => {
        set({
          dashboard: null,
          leads: [],
          filteredLeads: [],
          lastFetched: null,
          lastUpdated: null,
        });
      },

      // Utilitários para leads
      getLeadById: (id) => {
        return get().leads.find(lead => lead.id === id);
      },

      getLeadsByStatus: (status) => {
        return get().filteredLeads.filter(lead => lead.status === status);
      },

      getTodayLeads: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        return get().leads.filter(lead => 
          lead.createdAt >= today && lead.createdAt < tomorrow
        );
      },

      getLeadsBySource: (source) => {
        return get().filteredLeads.filter(lead => lead.source === source);
      },

      updateLeadStatus: (id, status) => {
        get().updateLead(id, { status });
      },

      addLeadNote: (id, note) => {
        const lead = get().getLeadById(id);
        if (lead) {
          const newNote = {
            ...note,
            id: `note_${Date.now()}`,
          };
          
          get().updateLead(id, {
            notes: [...lead.notes, newNote],
          });
        }
      },

      // Analytics
      getMetrics: () => {
        const { filteredLeads } = get();
        const today = get().getTodayLeads();
        const converted = filteredLeads.filter(l => l.status === 'converted');
        
        return {
          totalLeads: filteredLeads.length,
          todayLeads: today.length,
          conversionRate: filteredLeads.length > 0 
            ? (converted.length / filteredLeads.length) * 100 
            : 0,
          averageScore: filteredLeads.length > 0
            ? filteredLeads.reduce((sum, l) => sum + l.score, 0) / filteredLeads.length
            : 0,
        };
      },

      // Export/Import
      exportLeads: () => get().leads,

      importLeads: (leads) => {
        set((state) => ({
          leads: [...state.leads, ...leads],
          lastUpdated: new Date(),
        }));
        get().applyFilters();
      },

      exportDashboard: () => get().dashboard,
    }),
    {
      name: 'viralkids-admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persistir dados importantes mas não estado temporário
        leads: state.leads.slice(-1000), // Manter apenas os últimos 1000 leads
        filters: state.filters,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        cacheExpiry: state.cacheExpiry,
        // Dashboard não é persistido pois pode mudar frequentemente
      }),
      version: 1,
    }
  )
);
