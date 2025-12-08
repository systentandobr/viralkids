import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { referralService } from '@/services/referral/referral.service';
import { useReferralStore } from '@/stores/referral.store';
import type { CreateCampaignRequest } from '@/types/referral.types';

export function useReferralCampaigns(filters?: { status?: string; franchiseId?: string }) {
  const { setCampaigns, setActiveCampaigns } = useReferralStore();

  return useQuery({
    queryKey: ['referral-campaigns', filters],
    queryFn: async () => {
      const campaigns = await referralService.getCampaigns(filters);
      setCampaigns(campaigns);
      setActiveCampaigns(campaigns.filter(c => c.status === 'active'));
      return campaigns;
    },
  });
}

export function useActiveCampaigns() {
  const { setActiveCampaigns } = useReferralStore();

  return useQuery({
    queryKey: ['referral-campaigns', { status: 'active' }],
    queryFn: async () => {
      const campaigns = await referralService.getCampaigns({ status: 'active' });
      setActiveCampaigns(campaigns);
      return campaigns;
    },
  });
}

export function useCampaignById(id: string) {
  const { setSelectedCampaign } = useReferralStore();

  return useQuery({
    queryKey: ['referral-campaign', id],
    queryFn: async () => {
      const campaign = await referralService.getCampaignById(id);
      setSelectedCampaign(campaign);
      return campaign;
    },
    enabled: !!id,
  });
}

export function useCampaignBySlug(slug: string) {
  const { setSelectedCampaign } = useReferralStore();

  return useQuery({
    queryKey: ['referral-campaign-slug', slug],
    queryFn: async () => {
      const campaign = await referralService.getCampaignBySlug(slug);
      setSelectedCampaign(campaign);
      return campaign;
    },
    enabled: !!slug,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => referralService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
    },
  });
}

export function useActivateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => referralService.activateCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => referralService.pauseCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
    },
  });
}

export function useGlobalStats() {
  const { setGlobalStats } = useReferralStore();

  return useQuery({
    queryKey: ['referral-global-stats'],
    queryFn: async () => {
      const stats = await referralService.getGlobalStats();
      setGlobalStats(stats);
      return stats;
    },
  });
}
