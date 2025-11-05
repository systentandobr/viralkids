import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface DeliveryQuoteRequest {
  address: {
    postalCode: string;
    street?: string;
    number?: string;
    complement?: string;
    city?: string;
    state?: string;
  };
  items: Array<{ productId: string; quantity: number; weight?: number; dimensions?: { l: number; w: number; h: number } }>;
  unitId: string;
}

export interface DeliveryOption {
  id: string;
  provider: string;
  method: string;
  price: number;
  etaDays: number;
}

export interface DeliveryQuoteResponse {
  options: DeliveryOption[];
}

export interface DeliveryDispatchRequest {
  orderId: string;
  optionId: string;
}

export interface DeliveryDispatchResponse {
  success: boolean;
  tracking?: string;
}

export const DeliveryApi = {
  quote(payload: DeliveryQuoteRequest): Promise<ApiResponse<DeliveryQuoteResponse>> {
    return httpClient.post<DeliveryQuoteResponse>(API_ENDPOINTS.DELIVERY.QUOTE, payload);
  },

  dispatch(payload: DeliveryDispatchRequest): Promise<ApiResponse<DeliveryDispatchResponse>> {
    return httpClient.post<DeliveryDispatchResponse>(API_ENDPOINTS.DELIVERY.DISPATCH, payload);
  },
};


