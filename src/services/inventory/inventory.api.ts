import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface InventoryAvailabilityRequest {
  productIds: string[];
  unitId: string;
}

export interface InventoryAvailabilityItem {
  productId: string;
  onHand: number;
  reserved: number;
  incomingConfirmed: number;
  virtualAvailable: number; // onHand - reserved + incomingConfirmed
  safetyStock?: number;
}

export type InventoryAvailabilityResponse = InventoryAvailabilityItem[];

export interface ReplenishPlanRequest {
  unitId: string;
}

export interface ReplenishSuggestionLine {
  productId: string;
  sku: string;
  suggestedQty: number;
  reason: 'below_safety' | 'projected_demand' | 'stockout_risk';
}

export interface ReplenishPlanResponse {
  unitId: string;
  suggestions: ReplenishSuggestionLine[];
  generatedAt: string;
}

export const InventoryApi = {
  availability(payload: InventoryAvailabilityRequest): Promise<ApiResponse<InventoryAvailabilityResponse>> {
    return httpClient.get<InventoryAvailabilityResponse>(API_ENDPOINTS.INVENTORY.AVAILABILITY, {
      params: { productIds: payload.productIds.join(','), unitId: payload.unitId },
    });
  },

  replenishPlan(payload: ReplenishPlanRequest): Promise<ApiResponse<ReplenishPlanResponse>> {
    return httpClient.post<ReplenishPlanResponse>(API_ENDPOINTS.INVENTORY.REPLENISH_PLAN, payload);
  },
};


