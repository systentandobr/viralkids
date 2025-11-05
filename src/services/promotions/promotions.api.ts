import { httpClient, ApiResponse } from '../api/httpClient';

export interface PromotionPreviewItem {
  productId: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

export interface PromotionPreviewRequest {
  unitId: string;
  items: PromotionPreviewItem[];
}

export interface PromotionApplied {
  id: string;
  name: string;
  type: 'percent' | 'fixed' | 'bundle';
  amount: number; // desconto aplicado em valor
}

export interface PromotionPreviewResponse {
  subtotal: number;
  discountTotal: number;
  total: number;
  promotions: PromotionApplied[];
}

export const PromotionsApi = {
  preview(payload: PromotionPreviewRequest): Promise<ApiResponse<PromotionPreviewResponse>> {
    // Endpoint a ser alinhado no backend: /api/v1/promotions/preview
    return httpClient.post<PromotionPreviewResponse>('/promotions/preview', payload);
  },
};


