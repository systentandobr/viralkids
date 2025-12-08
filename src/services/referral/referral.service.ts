import type { 
    ReferralCampaign, 
    Referral, 
    Reward, 
    GlobalStats,
    CreateReferralRequest,
    CreateCampaignRequest
  } from '@/types/referral.types';
import { httpClient } from '@/services/api/httpClient';
import { API_ENDPOINTS } from '@/services/api/endpoints';
  
  // Mock data para desenvolvimento
  const mockCampaigns: ReferralCampaign[] = [
    {
      id: 'camp_1',
      name: 'Indique e Ganhe',
      description: 'Indique um amigo e ambos ganham R$20 de cashback na próxima compra!',
      slug: 'indique-e-ganhe',
      type: 'multi-tier',
      rewardTypes: ['cashback'],
      referrerReward: { type: 'cashback', value: 20, currency: 'BRL' },
      refereeReward: { type: 'cashback', value: 20, currency: 'BRL' },
      rules: {
        minPurchaseValue: 50,
        maxReferralsPerUser: 10,
        expirationDays: 30,
      },
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      metrics: {
        totalReferrals: 1250,
        completedReferrals: 890,
        totalRewardsValue: 35600,
        conversionRate: 71.2,
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
    },
    {
      id: 'camp_2',
      name: 'Amigo VIP',
      description: 'Ganhe 500 pontos por cada amigo que se cadastrar e fizer uma compra.',
      slug: 'amigo-vip',
      type: 'single-tier',
      rewardTypes: ['points'],
      referrerReward: { type: 'points', value: 500 },
      rules: {
        minPurchaseValue: 100,
        maxReferralsPerUser: 20,
        expirationDays: 60,
      },
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      metrics: {
        totalReferrals: 850,
        completedReferrals: 420,
        totalRewardsValue: 210000,
        conversionRate: 49.4,
      },
      createdAt: '2024-02-01',
      updatedAt: '2024-02-10',
    },
    {
      id: 'camp_3',
      name: 'Super Indicação',
      description: 'Indique 5 amigos e ganhe um produto exclusivo da coleção 3D!',
      slug: 'super-indicacao',
      type: 'hybrid',
      rewardTypes: ['physical', 'discount'],
      referrerReward: { type: 'physical', value: 1, productId: 'prod_kit_3d' },
      refereeReward: { type: 'discount', value: 15 },
      rules: {
        minPurchaseValue: 80,
        maxReferralsPerUser: 5,
        expirationDays: 45,
      },
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      metrics: {
        totalReferrals: 320,
        completedReferrals: 180,
        totalRewardsValue: 12500,
        conversionRate: 56.3,
      },
      createdAt: '2024-03-01',
      updatedAt: '2024-03-05',
    },
  ];
  
  const mockReferrals: Referral[] = [
    {
      id: 'ref_1',
      campaignId: 'camp_1',
      franchiseId: 'fr_1',
      referrerId: 'user_1',
      refereeId: 'user_2',
      orderId: 'order_1',
      referralCode: 'VIRAL-ABC1-2345',
      shortLink: 'vkids.link/abc123',
      status: 'completed',
      referrerReward: { type: 'cashback', value: 20, currency: 'BRL', status: 'paid', paidAt: '2024-01-20' },
      refereeReward: { type: 'cashback', value: 20, currency: 'BRL', status: 'paid', paidAt: '2024-01-20' },
      tracking: {
        sharedAt: '2024-01-10',
        sharedVia: 'whatsapp',
        registeredAt: '2024-01-15',
        completedAt: '2024-01-18',
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20',
    },
    {
      id: 'ref_2',
      campaignId: 'camp_2',
      franchiseId: 'fr_1',
      referrerId: 'user_1',
      referralCode: 'VIRAL-DEF2-6789',
      shortLink: 'vkids.link/def456',
      status: 'pending',
      referrerReward: { type: 'points', value: 500, status: 'pending' },
      tracking: {
        sharedAt: '2024-02-05',
        sharedVia: 'email',
      },
      createdAt: '2024-02-05',
      updatedAt: '2024-02-05',
    },
  ];
  
  const mockRewards: Reward[] = [
    {
      id: 'reward_1',
      referralId: 'ref_1',
      userId: 'user_1',
      campaignId: 'camp_1',
      type: 'cashback',
      value: 20,
      currency: 'BRL',
      status: 'paid',
      details: {
        walletId: 'wallet_1',
        transactionId: 'tx_123',
      },
      processing: {
        processedAt: '2024-01-19',
        approvedAt: '2024-01-19',
        paidAt: '2024-01-20',
      },
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20',
    },
  ];
  
  const mockGlobalStats: GlobalStats = {
    totalReferrals: 15420,
    totalRewardsPaid: 8750,
    totalRewardsValue: 245000,
    averageSalesIncrease: 38.5,
    activeFranchises: 142,
  };
  
  // Simula delay de API
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  class ReferralService {
    // === Campanhas ===
    
    async getCampaigns(filters?: { status?: string; franchiseId?: string }): Promise<ReferralCampaign[]> {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.franchiseId) params.append('franchiseId', filters.franchiseId);
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.REFERRAL_CAMPAIGNS.LIST}?${queryString}`
        : API_ENDPOINTS.REFERRAL_CAMPAIGNS.LIST;
      
      const response = await httpClient.get<{ data: ReferralCampaign[] }>(url);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao buscar campanhas');
      }
      
      // Se response.data é um array direto
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Se response.data tem propriedade data
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    }
  
    async getCampaignById(id: string): Promise<ReferralCampaign | null> {
      const response = await httpClient.get<ReferralCampaign>(
        API_ENDPOINTS.REFERRAL_CAMPAIGNS.DETAIL(id)
      );
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    }
  
    async getCampaignBySlug(slug: string): Promise<ReferralCampaign | null> {
      const response = await httpClient.get<ReferralCampaign>(
        API_ENDPOINTS.REFERRAL_CAMPAIGNS.BY_SLUG(slug)
      );
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    }
  
    async createCampaign(data: CreateCampaignRequest): Promise<ReferralCampaign> {
      await delay(500);
      const newCampaign: ReferralCampaign = {
        id: `camp_${Date.now()}`,
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'draft',
        metrics: {
          totalReferrals: 0,
          completedReferrals: 0,
          totalRewardsValue: 0,
          conversionRate: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCampaigns.push(newCampaign);
      return newCampaign;
    }
  
    async activateCampaign(id: string): Promise<ReferralCampaign> {
      await delay(300);
      const campaign = mockCampaigns.find(c => c.id === id);
      if (!campaign) throw new Error('Campanha não encontrada');
      campaign.status = 'active';
      campaign.updatedAt = new Date().toISOString();
      return campaign;
    }
  
    async pauseCampaign(id: string): Promise<ReferralCampaign> {
      await delay(300);
      const campaign = mockCampaigns.find(c => c.id === id);
      if (!campaign) throw new Error('Campanha não encontrada');
      campaign.status = 'paused';
      campaign.updatedAt = new Date().toISOString();
      return campaign;
    }
  
    // === Indicações ===
  
    async getReferrals(filters?: { userId?: string; campaignId?: string; status?: string }): Promise<Referral[]> {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('referrerId', filters.userId);
      if (filters?.campaignId) params.append('campaignId', filters.campaignId);
      if (filters?.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.REFERRALS.LIST}?${queryString}`
        : API_ENDPOINTS.REFERRALS.LIST;
      
      const response = await httpClient.get<{ data: Referral[] }>(url);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao buscar indicações');
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    }
  
    async getReferralByCode(code: string): Promise<Referral | null> {
      const response = await httpClient.get<Referral>(
        API_ENDPOINTS.REFERRALS.BY_CODE(code)
      );
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    }
  
    async createReferral(data: CreateReferralRequest): Promise<Referral> {
      const response = await httpClient.post<Referral>(
        API_ENDPOINTS.REFERRALS.CREATE,
        data
      );
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao criar indicação');
      }
      return response.data;
    }
  
    // === Recompensas ===
  
    async getRewards(filters?: { userId?: string; status?: string }): Promise<Reward[]> {
      if (filters?.userId) {
        const response = await httpClient.get<Reward[]>(
          API_ENDPOINTS.REWARDS.BY_USER(filters.userId)
        );
        if (!response.success || !response.data) {
          return [];
        }
        return Array.isArray(response.data) ? response.data : [];
      }
      
      // Buscar minhas recompensas
      const response = await httpClient.get<Reward[]>(API_ENDPOINTS.REWARDS.MY);
      if (!response.success || !response.data) {
        return [];
      }
      return Array.isArray(response.data) ? response.data : [];
    }
  
    async getRewardById(id: string): Promise<Reward | null> {
      const response = await httpClient.get<Reward>(
        API_ENDPOINTS.REWARDS.DETAIL(id)
      );
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    }
  
    // === Estatísticas ===
  
    async getGlobalStats(): Promise<GlobalStats> {
      // TODO: Implementar endpoint de estatísticas globais quando disponível
      // Por enquanto, retornar dados mockados ou calcular a partir das campanhas
      return mockGlobalStats;
    }
  
    async getCampaignStats(campaignId: string): Promise<ReferralCampaign['metrics'] | null> {
      const response = await httpClient.get<ReferralCampaign['metrics']>(
        API_ENDPOINTS.REFERRAL_CAMPAIGNS.STATS(campaignId)
      );
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    }
  }
  
  export const referralService = new ReferralService();
  