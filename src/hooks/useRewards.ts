import { useQuery } from '@tanstack/react-query';
import { referralService } from '@/services/referral/referral.service';
import { useReferralStore } from '@/stores/referral.store';

export function useRewards(filters?: { userId?: string; status?: string }) {
  const { setMyRewards, setPendingRewards } = useReferralStore();

  return useQuery({
    queryKey: ['rewards', filters],
    queryFn: async () => {
      const rewards = await referralService.getRewards(filters);
      setMyRewards(rewards);
      setPendingRewards(rewards);
      return rewards;
    },
  });
}

export function useMyRewards() {
  const { setMyRewards, setPendingRewards } = useReferralStore();

  return useQuery({
    queryKey: ['my-rewards'],
    queryFn: async () => {
      // Em produção, userId viria do auth
      const rewards = await referralService.getRewards({ userId: 'user_current' });
      setMyRewards(rewards);
      setPendingRewards(rewards);
      return rewards;
    },
  });
}

export function useRewardById(id: string) {
  return useQuery({
    queryKey: ['reward', id],
    queryFn: () => referralService.getRewardById(id),
    enabled: !!id,
  });
}

export function usePendingRewards() {
  return useQuery({
    queryKey: ['pending-rewards'],
    queryFn: () => referralService.getRewards({ status: 'pending' }),
  });
}
