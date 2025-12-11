import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface ReferralAnalytics {
  // Métricas de conversão
  landingPageConversionRate: number; // Visitas → Leads
  leadConversionRate: number; // Leads → Clientes
  referralConversionRate: number; // Indicações → Novos Clientes
  
  // Métricas de aquisição
  cac: number; // Custo de Aquisição de Cliente
  ltv: number; // Lifetime Value de clientes indicados
  ltvCacRatio: number; // LTV/CAC ratio
  
  // Métricas de campanhas
  averageCampaignROI: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalReferrals: number;
  completedReferrals: number;
  
  // Métricas de recompensas
  totalRewardsPaid: number;
  totalRewardsValue: number;
  averageRewardValue: number;
  pendingRewards: number;
  
  // Métricas de engajamento
  averageReferralsPerCustomer: number;
  topIndicatorsCount: number;
  reactivationRate: number;
  
  // Evolução temporal (últimos 30 dias)
  dailyMetrics: Array<{
    date: string;
    visits: number;
    leads: number;
    customers: number;
    referrals: number;
    completedReferrals: number;
    revenue: number;
  }>;
  
  // Comparativo de campanhas
  campaignComparison: Array<{
    campaignId: string;
    campaignName: string;
    totalReferrals: number;
    completedReferrals: number;
    conversionRate: number;
    roi: number;
    totalRevenue: number;
  }>;
  
  // Distribuição de recompensas
  rewardDistribution: {
    cashback: number;
    points: number;
    discount: number;
    physical: number;
  };
}

export interface ReferralFunnelData {
  visits: number;
  leads: number;
  customers: number;
  referrals: number;
  completedReferrals: number;
  orders: number;
  rewards: number;
  conversionRates: {
    visitsToLeads: number;
    leadsToCustomers: number;
    customersToReferrals: number;
    referralsToCompleted: number;
    completedToOrders: number;
    ordersToRewards: number;
  };
}

export class ReferralAnalyticsService {
  static async getAnalytics(filters?: {
    startDate?: string;
    endDate?: string;
    franchiseId?: string;
  }): Promise<ApiResponse<ReferralAnalytics>> {
    return httpClient.get('/admin/referrals/analytics', {
      params: filters,
    });
  }

  static async getFunnelData(filters?: {
    startDate?: string;
    endDate?: string;
    franchiseId?: string;
  }): Promise<ApiResponse<ReferralFunnelData>> {
    return httpClient.get('/admin/referrals/funnel', {
      params: filters,
    });
  }

  static async getCohortAnalysis(filters?: {
    startDate?: string;
    endDate?: string;
    franchiseId?: string;
  }): Promise<ApiResponse<any>> {
    return httpClient.get('/admin/referrals/cohorts', {
      params: filters,
    });
  }

  static async getLeadReferralStats(): Promise<ApiResponse<{
    totalLeads: number;
    leadsWithReferral: number;
    leadsWithoutReferral: number;
    conversionRateByReferral: {
      withReferral: number;
      withoutReferral: number;
    };
  }>> {
    return httpClient.get('/admin/leads/referral-stats');
  }
}

