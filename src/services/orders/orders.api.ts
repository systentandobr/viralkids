import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface OrderItemInput {
  productId: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  unitId: string;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  items: OrderItemInput[];
  totals?: {
    subtotal?: number;
    discount?: number;
    cashbackRedeem?: number;
    delivery?: number;
    total?: number;
  };
  reserveTtlSeconds?: number; // TTL da reserva até pagamento
}

export interface OrderResponse {
  id: string;
  unitId: string;
  status: 'created' | 'reserved' | 'paid' | 'canceled' | 'failed';
  items: Array<OrderItemInput & { id: string }>;
  reservedUntil?: string;
  createdAt: string;
}

export const OrdersApi = {
  create(payload: CreateOrderRequest): Promise<ApiResponse<OrderResponse>> {
    return httpClient.post<OrderResponse>(API_ENDPOINTS.ORDERS.CREATE, payload);
  },

  getById(orderId: string): Promise<ApiResponse<OrderResponse>> {
    return httpClient.get<OrderResponse>(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  },

  cancel(orderId: string): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.post<{ success: boolean }>(API_ENDPOINTS.ORDERS.CANCEL(orderId));
  },
};


