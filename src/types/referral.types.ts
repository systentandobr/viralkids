// Tipos do Sistema de Indicação Member Get Member

export type CampaignType = 'single-tier' | 'multi-tier' | 'hybrid';
export type RewardType = 'cashback' | 'discount' | 'points' | 'physical';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'expired' | 'completed';
export type ReferralStatus = 'pending' | 'registered' | 'completed' | 'cancelled' | 'expired';
export type RewardStatus = 'pending' | 'processing' | 'approved' | 'paid' | 'cancelled' | 'expired';

export interface RewardConfig {
  type: RewardType;
  value: number;
  currency?: string;
  productId?: string;
}

export interface CampaignRules {
  minPurchaseValue?: number;
  maxReferralsPerUser?: number;
  maxReferralsTotal?: number;
  expirationDays?: number;
  requireEmailVerification?: boolean;
}

export interface ReferralCampaign {
  id: string;
  franchiseId?: string;
  name: string;
  description: string;
  slug: string;
  type: CampaignType;
  rewardTypes: RewardType[];
  referrerReward: RewardConfig;
  refereeReward?: RewardConfig;
  rules?: CampaignRules;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  metrics: CampaignMetrics;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  requireEmailVerification?: boolean;
}

export interface CampaignMetrics {
  totalReferrals: number;
  completedReferrals: number;
  totalRewardsValue: number;
  conversionRate: number;
}


export interface ReferralReward {
  type: string;
  value: number;
  currency?: string;
  status: RewardStatus;
  paidAt?: string;
  rewardId?: string;
}

export interface ReferralTracking {
  sharedAt?: string;
  sharedVia?: 'whatsapp' | 'email' | 'link' | 'social';
  registeredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  expiredAt?: string;
}

export interface Referral {
  id: string;
  campaignId: string;
  franchiseId: string;
  referrerId: string;
  refereeId?: string;
  orderId?: string;
  referralCode: string;
  shortLink?: string;
  status: ReferralStatus;
  referrerReward: ReferralReward;
  refereeReward?: ReferralReward;
  tracking: ReferralTracking;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  referralId: string;
  userId: string;
  campaignId: string;
  type: RewardType;
  value: number;
  currency?: string;
  status: RewardStatus;
  details: {
    walletId?: string;
    transactionId?: string;
    couponCode?: string;
    couponExpiresAt?: string;
    pointsAccountId?: string;
    productId?: string;
    shippingAddress?: object;
    trackingCode?: string;
  };
  processing: {
    scheduledAt?: string;
    processedAt?: string;
    approvedBy?: string;
    approvedAt?: string;
    paidAt?: string;
    cancelledAt?: string;
    cancelledBy?: string;
    cancelReason?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GlobalStats {
  totalReferrals: number;
  totalRewardsPaid: number;
  totalRewardsValue: number;
  averageSalesIncrease: number;
  activeFranchises: number;
}

export interface CreateReferralRequest {
  campaignId: string;
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  type: CampaignType;
  rewardTypes: RewardType[];
  referrerReward: RewardConfig;
  refereeReward?: RewardConfig;
  rules?: CampaignRules;
  startDate: string;
  endDate: string;
  franchiseId?: string;
}
