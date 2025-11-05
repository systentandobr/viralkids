import { httpClient, ApiResponse } from '../api/httpClient';

export interface WalletBalanceResponse {
  userId: string;
  unitId: string;
  balance: number;
  currency: string;
}

export interface CashbackPreviewRequest {
  unitId: string;
  amount: number;
  subtotal: number;
}

export interface CashbackPreviewResponse {
  allowed: boolean;
  appliedAmount: number;
  subtotal: number;
  totalAfterRedeem: number;
}

export interface CashbackRedeemRequest {
  orderId: string;
  amount: number;
}

export interface CashbackRedeemResponse {
  success: boolean;
}

export const WalletApi = {
  getBalance(unitId: string): Promise<ApiResponse<WalletBalanceResponse>> {
    return httpClient.get<WalletBalanceResponse>('/wallet/balance', { params: { unitId } });
  },
  previewRedeem(payload: CashbackPreviewRequest): Promise<ApiResponse<CashbackPreviewResponse>> {
    return httpClient.post<CashbackPreviewResponse>('/cashback/preview', payload);
  },
  redeem(payload: CashbackRedeemRequest): Promise<ApiResponse<CashbackRedeemResponse>> {
    return httpClient.post<CashbackRedeemResponse>('/cashback/redeem', payload);
  },
};


