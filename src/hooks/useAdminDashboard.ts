import { useCallback, useEffect } from 'react';
import { useAdminStore } from '@/stores/admin.store';

// Re-exportar tipos para compatibilidade  
export type AdminDashboard = ReturnType<typeof useAdminStore>['dashboard'];
export type Lead = Parameters<ReturnType<typeof useAdminStore>['addLead']>[0];
export type AdminFilters = ReturnType<typeof useAdminStore>['filters'];

interface UseAdminDashboardReturn {
  // Dados
  dashboard: AdminDashboard;
  leads: Lead[];
  allLeads: Lead[];
  filters: AdminFilters;
  
  // Estado
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Ações
  setFilters: (filters: Partial<AdminFilters>) => void;
  clearFilters: () => void;
  refreshDashboard: () => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLeadNote: (leadId: string, note: { content: string; author: string; createdAt: Date }) => void;

  // Utilitários
  getLeadById: (id: string) => Lead | undefined;
  getLeadsByStatus: (status: Lead['status']) => Lead[];
  getTodayLeads: () => Lead[];
}

interface UseAdminDashboardOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useAdminDashboard = ({ 
  autoRefresh = false, 
  refreshInterval = 30000 
}: UseAdminDashboardOptions = {}): UseAdminDashboardReturn => {

  // Estado da store
  const dashboard = useAdminStore(state => state.dashboard);
  const leads = useAdminStore(state => state.filteredLeads);
  const allLeads = useAdminStore(state => state.leads);
  const filters = useAdminStore(state => state.filters);
  const loading = useAdminStore(state => state.loading);
  const error = useAdminStore(state => state.error);
  const lastUpdated = useAdminStore(state => state.lastUpdated);
  
  // Ações da store
  const storeSetFilters = useAdminStore(state => state.setFilters);
  const storeClearFilters = useAdminStore(state => state.clearFilters);
  const storeUpdateLead = useAdminStore(state => state.updateLead);
  const storeAddLeadNote = useAdminStore(state => state.addLeadNote);
  const storeGetLeadById = useAdminStore(state => state.getLeadById);
  const storeGetLeadsByStatus = useAdminStore(state => state.getLeadsByStatus);
  const storeGetTodayLeads = useAdminStore(state => state.getTodayLeads);
  const shouldRefresh = useAdminStore(state => state.shouldRefresh);
  const setLoading = useAdminStore(state => state.setLoading);
  const setError = useAdminStore(state => state.setError);
  const setDashboard = useAdminStore(state => state.setDashboard);
  const setLeads = useAdminStore(state => state.setLeads);

  // Mock data generators (mover para serviços em produção)
  const generateMockDashboard = useCallback(() => {
    const mockDashboard = {
      overview: {
        totalLeads: 1247,
        newLeadsToday: 23,
        activeFranchises: 87,
        totalRevenue: 2359600,
        monthlyGrowth: 18.5,
        conversionRate: 23.7,
        averageTicket: 4997,
        customerSatisfaction: 4.7
      },
      leads: {
        total: 1247,
        newToday: 23,
        qualified: 412,
        converted: 296,
        conversionRate: 23.7,
        averageResponseTime: 4.3,
        leadsBySource: [
          { source: 'Chatbot', count: 456, percentage: 36.6, conversionRate: 28.2 },
          { source: 'Instagram', count: 324, percentage: 26.0, conversionRate: 21.5 },
          { source: 'WhatsApp', count: 234, percentage: 18.8, conversionRate: 19.7 },
        ],
        leadsByStatus: [
          { status: 'new', count: 156, percentage: 12.5 },
          { status: 'contacted', count: 383, percentage: 30.7 },
          { status: 'qualified', count: 412, percentage: 33.0 },
          { status: 'converted', count: 296, percentage: 23.7 }
        ],
        leadsByPackage: [
          { package: 'starter', count: 623, percentage: 50.0, averageValue: 2997 },
          { package: 'premium', count: 374, percentage: 30.0, averageValue: 4997 },
          { package: 'master', count: 250, percentage: 20.0, averageValue: 7997 }
        ],
        recentLeads: []
      },
      franchises: {
        total: 87,
        active: 82,
        pending: 3,
        suspended: 2,
        newThisMonth: 12,
        byPackage: [],
        byRegion: [],
        averagePerformance: 8.5,
        topPerformers: []
      },
      sales: {
        totalRevenue: 2359600,
        monthlyRevenue: 387500,
        franchiseFees: 459600,
        royalties: 1152000,
        productsRevenue: 648000,
        trainingRevenue: 100000,
        growth: {
          monthlyGrowth: 18.5,
          quarterlyGrowth: 42.3,
          yearlyGrowth: 156.7,
          targetAchievement: 94.2
        },
        forecast: []
      },
      suppliers: {
        total: 142,
        verified: 98,
        byState: [],
        averageRating: 4.3,
        newPartnerships: 8,
        activeContracts: 124
      },
      performance: {
        websiteTraffic: {
          totalVisits: 24567,
          uniqueVisitors: 18432,
          pageViews: 89234,
          bounceRate: 34.2,
          averageSessionDuration: 4.7,
          topPages: [],
          conversionRate: 3.8
        },
        chatbotMetrics: {
          totalConversations: 3456,
          completedFlows: 2134,
          averageFlowCompletion: 61.7,
          leadGeneration: 456,
          mostCommonQuestions: [],
          userSatisfaction: 4.5
        },
        emailMetrics: {
          sentEmails: 15678,
          openRate: 28.4,
          clickRate: 6.7,
          unsubscribeRate: 0.8,
          bounceRate: 2.3,
          topCampaigns: []
        },
        socialMedia: {
          instagram: { followers: 12456, growth: 8.7, engagement: 4.2, reach: 45678, leads: 324 },
          facebook: { followers: 8765, growth: 3.4, engagement: 2.8, reach: 23456, leads: 156 },
          tiktok: { followers: 5432, growth: 15.6, engagement: 6.8, reach: 34567, leads: 89 },
          whatsapp: { followers: 2345, growth: 12.3, engagement: 8.9, reach: 12345, leads: 234 }
        }
      },
      recentActivity: []
    };

    return mockDashboard;
  }, []);

  const generateMockLeads = useCallback(() => {
    const mockLeads: Lead[] = [];
    const cities = ['Natal', 'Petrolina', 'Fortaleza', 'Itapipoca', 'João Pessoa', 'Campina Grande'];
    const packages = ['starter', 'premium', 'master'] as const;
    const statuses = ['new', 'contacted', 'qualified', 'converted'] as const;
    const sources = ['chatbot', 'instagram', 'whatsapp', 'site', 'indicacao'];
    const experiences = ['none', 'some', 'experienced'] as const;

    for (let i = 0; i < 50; i++) {
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      mockLeads.push({
        id: `lead_${i + 1}`,
        name: `Lead ${i + 1}`,
        email: `lead${i + 1}@email.com`,
        phone: `(84) 9999-${String(i + 1000).padStart(4, '0')}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        franchiseType: packages[Math.floor(Math.random() * packages.length)],
        experience: experiences[Math.floor(Math.random() * experiences.length)],
        budget: `R$ ${(Math.random() * 10000 + 2000).toFixed(0)}`,
        timeToStart: ['immediately', '1_month', '2_3_months', 'still_deciding'][Math.floor(Math.random() * 4)] as any,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        tags: [],
        notes: [],
        createdAt,
        updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
      });
    }

    return mockLeads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, []);

  // Carregar dados
  const loadDashboardData = useCallback(async () => {
    if (loading) return; // Evitar carregamentos múltiplos

    setLoading(true);
    setError(null);

    try {
      // Em produção, buscar da API
      // Por enquanto, usar dados simulados
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockDashboard = generateMockDashboard();
      const mockLeads = generateMockLeads();

      setDashboard(mockDashboard);
      setLeads(mockLeads);

    } catch (error) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, generateMockDashboard, generateMockLeads, setLoading, setError, setDashboard, setLeads]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (shouldRefresh()) {
        loadDashboardData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, shouldRefresh, loadDashboardData]);

  // Carregar dados iniciais
  useEffect(() => {
    if (!dashboard || shouldRefresh()) {
      loadDashboardData();
    }
  }, [dashboard, shouldRefresh, loadDashboardData]);

  // Implementações das funções
  const setFilters = useCallback((newFilters: Partial<AdminFilters>) => {
    storeSetFilters(newFilters);
  }, [storeSetFilters]);

  const clearFilters = useCallback(() => {
    storeClearFilters();
  }, [storeClearFilters]);

  const refreshDashboard = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const updateLeadStatus = useCallback((leadId: string, status: Lead['status']) => {
    storeUpdateLead(leadId, { status });
  }, [storeUpdateLead]);

  const addLeadNote = useCallback((leadId: string, note: { content: string; author: string; createdAt: Date }) => {
    storeAddLeadNote(leadId, note);
  }, [storeAddLeadNote]);

  const getLeadById = useCallback((id: string) => {
    return storeGetLeadById(id);
  }, [storeGetLeadById]);

  const getLeadsByStatus = useCallback((status: Lead['status']) => {
    return storeGetLeadsByStatus(status);
  }, [storeGetLeadsByStatus]);

  const getTodayLeads = useCallback(() => {
    return storeGetTodayLeads();
  }, [storeGetTodayLeads]);

  return {
    // Dados
    dashboard,
    leads,
    allLeads,
    filters,
    
    // Estado
    loading,
    error,
    lastUpdated,

    // Ações
    setFilters,
    clearFilters,
    refreshDashboard,
    updateLeadStatus,
    addLeadNote,

    // Utilitários
    getLeadById,
    getLeadsByStatus,
    getTodayLeads,
  };
};
