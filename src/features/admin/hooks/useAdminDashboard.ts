import { useState, useEffect, useCallback } from 'react';
import { AdminDashboard, Lead, AdminFilters, LeadMetrics, FranchiseMetrics, LeadNote } from '../types';

interface UseAdminDashboardOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // em milissegundos
}

interface AdminDashboardState {
  dashboard: AdminDashboard | null;
  leads: Lead[];
  filteredLeads: Lead[];
  filters: AdminFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const STORAGE_KEY_LEADS = 'viralkids_admin_leads';
const STORAGE_KEY_DASHBOARD = 'viralkids_admin_dashboard';

// Dados simulados para desenvolvimento
const generateMockDashboard = (): AdminDashboard => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
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
        { source: 'Site', count: 156, percentage: 12.5, conversionRate: 24.4 },
        { source: 'Indicação', count: 77, percentage: 6.2, conversionRate: 35.1 }
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
      byPackage: [
        { package: 'starter', count: 43, percentage: 49.4, averageRevenue: 8500 },
        { package: 'premium', count: 28, percentage: 32.2, averageRevenue: 15200 },
        { package: 'master', count: 16, percentage: 18.4, averageRevenue: 28900 }
      ],
      byRegion: [
        { state: 'pernambuco', count: 28, percentage: 32.2, averagePerformance: 8.7 },
        { state: 'ceara', count: 24, percentage: 27.6, averagePerformance: 8.3 },
        { state: 'rio_grande_do_norte', count: 18, percentage: 20.7, averagePerformance: 8.9 },
        { state: 'paraiba', count: 10, percentage: 11.5, averagePerformance: 8.1 },
        { state: 'outros', count: 7, percentage: 8.0, averagePerformance: 7.8 }
      ],
      averagePerformance: 8.5,
      topPerformers: [
        { id: '1', name: 'Maria Silva', city: 'Natal', package: 'master', score: 9.8, revenue: 32500, tasksCompleted: 28 },
        { id: '2', name: 'João Santos', city: 'Petrolina', package: 'premium', score: 9.6, revenue: 18900, tasksCompleted: 25 },
        { id: '3', name: 'Ana Costa', city: 'Fortaleza', package: 'master', score: 9.4, revenue: 29800, tasksCompleted: 27 }
      ]
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
      forecast: [
        { month: 'Jan', predicted: 320000, actual: 315000, target: 350000 },
        { month: 'Fev', predicted: 340000, actual: 352000, target: 360000 },
        { month: 'Mar', predicted: 365000, actual: 387500, target: 380000 },
        { month: 'Abr', predicted: 385000, target: 400000 },
        { month: 'Mai', predicted: 410000, target: 420000 },
        { month: 'Jun', predicted: 435000, target: 450000 }
      ]
    },
    suppliers: {
      total: 142,
      verified: 98,
      byState: [
        { state: 'pernambuco', count: 45, percentage: 31.7 },
        { state: 'ceara', count: 38, percentage: 26.8 },
        { state: 'rio_grande_do_norte', count: 28, percentage: 19.7 },
        { state: 'paraiba', count: 18, percentage: 12.7 },
        { state: 'outros', count: 13, percentage: 9.2 }
      ],
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
        topPages: [
          { page: '/', views: 12345, uniqueViews: 9876, conversionRate: 4.2 },
          { page: '/franquia', views: 8765, uniqueViews: 6543, conversionRate: 12.3 },
          { page: '/produtos', views: 5432, uniqueViews: 4321, conversionRate: 2.1 }
        ],
        conversionRate: 3.8
      },
      chatbotMetrics: {
        totalConversations: 3456,
        completedFlows: 2134,
        averageFlowCompletion: 61.7,
        leadGeneration: 456,
        mostCommonQuestions: [
          { question: 'Informações sobre franquia', count: 1234, percentage: 35.7 },
          { question: 'Preços de produtos', count: 876, percentage: 25.3 },
          { question: 'Como começar', count: 654, percentage: 18.9 }
        ],
        userSatisfaction: 4.5
      },
      emailMetrics: {
        sentEmails: 15678,
        openRate: 28.4,
        clickRate: 6.7,
        unsubscribeRate: 0.8,
        bounceRate: 2.3,
        topCampaigns: [
          { campaign: 'Welcome Series', openRate: 34.2, clickRate: 8.9, conversions: 45 },
          { campaign: 'Monthly Newsletter', openRate: 26.8, clickRate: 5.4, conversions: 23 },
          { campaign: 'Product Launch', openRate: 31.5, clickRate: 7.8, conversions: 67 }
        ]
      },
      socialMedia: {
        instagram: { followers: 12456, growth: 8.7, engagement: 4.2, reach: 45678, leads: 324 },
        facebook: { followers: 8765, growth: 3.4, engagement: 2.8, reach: 23456, leads: 156 },
        tiktok: { followers: 5432, growth: 15.6, engagement: 6.8, reach: 34567, leads: 89 },
        whatsapp: { followers: 2345, growth: 12.3, engagement: 8.9, reach: 12345, leads: 234 }
      }
    },
    recentActivity: [
      {
        id: '1',
        type: 'lead',
        title: 'Novo lead qualificado',
        description: 'Maria Silva demonstrou interesse na franquia Master',
        actor: 'Chatbot',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        icon: '👤',
        severity: 'success'
      },
      {
        id: '2',
        type: 'franchise',
        title: 'Franquia ativada',
        description: 'João Santos completou o onboarding em Petrolina/PE',
        actor: 'Sistema',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        icon: '🏪',
        severity: 'success'
      },
      {
        id: '3',
        type: 'sale',
        title: 'Meta mensal atingida',
        description: 'Região Nordeste ultrapassou meta de vendas em 12%',
        actor: 'Sistema',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: '💰',
        severity: 'success'
      }
    ]
  };
};

const generateMockLeads = (): Lead[] => {
  const leads: Lead[] = [];
  const cities = ['Natal', 'Petrolina', 'Fortaleza', 'Itapipoca', 'João Pessoa', 'Campina Grande'];
  const packages = ['starter', 'premium', 'master'] as const;
  const statuses = ['new', 'contacted', 'qualified', 'converted'] as const;
  const sources = ['chatbot', 'instagram', 'whatsapp', 'site', 'indicacao'];
  const experiences = ['none', 'some', 'experienced'] as const;

  for (let i = 0; i < 50; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    leads.push({
      id: `lead_${i + 1}`,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@email.com`,
      phone: `(84) 9999-${String(i + 1000).padStart(4, '0')}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      franchiseType: packages[Math.floor(Math.random() * packages.length)],
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      budget: `R$ ${(Math.random() * 10000 + 2000).toFixed(0)}`,
      timeToStart: ['immediately', '1_month', '2_3_months', 'still_deciding'][Math.floor(Math.random() * 4)],
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: Math.floor(Math.random() * 100),
      tags: [],
      notes: [],
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
    });
  }

  return leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const useAdminDashboard = ({ 
  autoRefresh = false, 
  refreshInterval = 30000 
}: UseAdminDashboardOptions = {}) => {
  const [state, setState] = useState<AdminDashboardState>({
    dashboard: null,
    leads: [],
    filteredLeads: [],
    filters: {
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    },
    loading: false,
    error: null,
    lastUpdated: null
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshDashboard();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [state.leads, state.filters]);

  const loadDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Tentar carregar do localStorage
      const savedDashboard = localStorage.getItem(STORAGE_KEY_DASHBOARD);
      const savedLeads = localStorage.getItem(STORAGE_KEY_LEADS);

      let dashboard: AdminDashboard;
      let leads: Lead[];

      if (savedDashboard && savedLeads) {
        dashboard = JSON.parse(savedDashboard);
        leads = JSON.parse(savedLeads).map((lead: any) => ({
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt)
        }));
      } else {
        // Gerar dados simulados
        dashboard = generateMockDashboard();
        leads = generateMockLeads();

        // Salvar no localStorage
        localStorage.setItem(STORAGE_KEY_DASHBOARD, JSON.stringify(dashboard));
        localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
      }

      // Atualizar leads recentes no dashboard
      dashboard.leads.recentLeads = leads.slice(0, 10);

      setState(prev => ({
        ...prev,
        dashboard,
        leads,
        loading: false,
        lastUpdated: new Date()
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar dados do dashboard',
        loading: false
      }));
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...state.leads];

    // Filtro por data
    filtered = filtered.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= state.filters.dateRange.start && 
             leadDate <= state.filters.dateRange.end;
    });

    // Filtro por região
    if (state.filters.region && state.filters.region.length > 0) {
      filtered = filtered.filter(lead => 
        state.filters.region!.includes(lead.city)
      );
    }

    // Filtro por pacote
    if (state.filters.package && state.filters.package.length > 0) {
      filtered = filtered.filter(lead => 
        state.filters.package!.includes(lead.franchiseType)
      );
    }

    // Filtro por status
    if (state.filters.status && state.filters.status.length > 0) {
      filtered = filtered.filter(lead => 
        state.filters.status!.includes(lead.status)
      );
    }

    // Filtro por fonte
    if (state.filters.source && state.filters.source.length > 0) {
      filtered = filtered.filter(lead => 
        state.filters.source!.includes(lead.source)
      );
    }

    setState(prev => ({ ...prev, filteredLeads: filtered }));
  }, [state.leads, state.filters]);

  const setFilters = useCallback((newFilters: Partial<AdminFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }
      }
    }));
  }, []);

  const refreshDashboard = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const updateLeadStatus = useCallback((leadId: string, newStatus: Lead['status']) => {
    setState(prev => {
      const updatedLeads = prev.leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, updatedAt: new Date() }
          : lead
      );

      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));

      return {
        ...prev,
        leads: updatedLeads
      };
    });
  }, []);

  const addLeadNote = useCallback((leadId: string, note: Omit<LeadNote, 'id'>) => {
    setState(prev => {
      const updatedLeads = prev.leads.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              notes: [...lead.notes, { ...note, id: `note_${Date.now()}` }],
              updatedAt: new Date() 
            }
          : lead
      );

      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updatedLeads));

      return {
        ...prev,
        leads: updatedLeads
      };
    });
  }, []);

  const getLeadById = useCallback((id: string): Lead | undefined => {
    return state.leads.find(lead => lead.id === id);
  }, [state.leads]);

  const getLeadsByStatus = useCallback((status: Lead['status']): Lead[] => {
    return state.filteredLeads.filter(lead => lead.status === status);
  }, [state.filteredLeads]);

  const getTodayLeads = useCallback((): Lead[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    return state.leads.filter(lead => 
      lead.createdAt >= today && lead.createdAt < tomorrow
    );
  }, [state.leads]);

  return {
    // Estado
    dashboard: state.dashboard,
    leads: state.filteredLeads,
    allLeads: state.leads,
    filters: state.filters,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,

    // Ações
    setFilters,
    clearFilters,
    refreshDashboard,
    updateLeadStatus,
    addLeadNote,

    // Utilitários
    getLeadById,
    getLeadsByStatus,
    getTodayLeads
  };
};
