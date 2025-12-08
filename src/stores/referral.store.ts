import { create } from 'zustand';
import type { ReferralCampaign, Referral, Reward, GlobalStats } from '@/types/referral.types';

interface ReferralState {
  // Campanhas
  campaigns: ReferralCampaign[];
  activeCampaigns: ReferralCampaign[];
  selectedCampaign: ReferralCampaign | null;
  
  // Indicações do usuário atual
  myReferrals: Referral[];
  currentReferralCode: string | null;
  
  // Recompensas
  myRewards: Reward[];
  pendingRewards: Reward[];
  
  // Estatísticas globais
  globalStats: GlobalStats | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCampaigns: (campaigns: ReferralCampaign[]) => void;
  setActiveCampaigns: (campaigns: ReferralCampaign[]) => void;
  setSelectedCampaign: (campaign: ReferralCampaign | null) => void;
  setMyReferrals: (referrals: Referral[]) => void;
  setCurrentReferralCode: (code: string | null) => void;
  setMyRewards: (rewards: Reward[]) => void;
  setPendingRewards: (rewards: Reward[]) => void;
  setGlobalStats: (stats: GlobalStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addReferral: (referral: Referral) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  reset: () => void;
}

const initialState = {
  campaigns: [],
  activeCampaigns: [],
  selectedCampaign: null,
  myReferrals: [],
  currentReferralCode: null,
  myRewards: [],
  pendingRewards: [],
  globalStats: null,
  isLoading: false,
  error: null,
};

export const useReferralStore = create<ReferralState>((set) => ({
  ...initialState,
  
  setCampaigns: (campaigns) => set({ campaigns }),
  
  setActiveCampaigns: (campaigns) => set({ activeCampaigns: campaigns }),
  
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  
  setMyReferrals: (referrals) => set({ myReferrals: referrals }),
  
  setCurrentReferralCode: (code) => set({ currentReferralCode: code }),
  
  setMyRewards: (rewards) => set({ myRewards: rewards }),
  
  setPendingRewards: (rewards) => set({ 
    pendingRewards: rewards.filter(r => r.status === 'pending' || r.status === 'processing') 
  }),
  
  setGlobalStats: (stats) => set({ globalStats: stats }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addReferral: (referral) => set((state) => ({ 
    myReferrals: [...state.myReferrals, referral],
    currentReferralCode: referral.referralCode,
  })),
  
  updateReferral: (id, updates) => set((state) => ({
    myReferrals: state.myReferrals.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ),
  })),
  
  reset: () => set(initialState),
}));
