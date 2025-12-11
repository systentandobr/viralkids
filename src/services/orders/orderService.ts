import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  unitId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status: 'processando' | 'enviado' | 'entregue' | 'cancelado';
  orderDate: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  trackingNumber?: string;
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  // Campos de integração com Referrals
  referralCode?: string;
  referralId?: string;
  referralReward?: {
    value: number;
    status: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFilters {
  search?: string;
  status?: 'processando' | 'enviado' | 'entregue' | 'cancelado';
  page?: number;
  limit?: number;
  hasReferral?: boolean; // true para pedidos com referral
}

export interface OrderStats {
  total: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export interface CreateOrderData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status?: 'processando' | 'enviado' | 'entregue' | 'cancelado';
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface UpdateOrderStatusData {
  status: 'processando' | 'enviado' | 'entregue' | 'cancelado';
  trackingNumber?: string;
}

export class OrderService {
  static async list(filters?: OrderFilters): Promise<ApiResponse<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
  }>> {
    return httpClient.get(API_ENDPOINTS.ORDERS.LIST, {
      params: filters,
    });
  }

  static async getById(id: string): Promise<ApiResponse<Order>> {
    return httpClient.get(API_ENDPOINTS.ORDERS.DETAIL(id));
  }

  static async getStats(): Promise<ApiResponse<OrderStats>> {
    return httpClient.get(`${API_ENDPOINTS.ORDERS.LIST}/stats`);
  }

  static async create(data: CreateOrderData): Promise<ApiResponse<Order>> {
    return httpClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
  }

  static async updateStatus(id: string, data: UpdateOrderStatusData): Promise<ApiResponse<Order>> {
    return httpClient.patch(`${API_ENDPOINTS.ORDERS.LIST}/${id}/status`, data);
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete(API_ENDPOINTS.ORDERS.DETAIL(id));
  }
}

