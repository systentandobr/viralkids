import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/features/auth';
import { OrderService, Order, OrderFilters, OrderStats, CreateOrderData, UpdateOrderStatusData } from '../orders/orderService';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};

// Hook para listar pedidos
export const useOrders = (filters?: OrderFilters) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...orderKeys.list(filters), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await OrderService.list(filters);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar pedidos');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter um pedido específico
export const useOrder = (id: string) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...orderKeys.detail(id), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await OrderService.getById(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar pedido');
      return resp.data;
    },
    enabled: !!id && !!unitId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter estatísticas
export const useOrderStats = () => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...orderKeys.stats(), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await OrderService.getStats();
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar estatísticas');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para criar pedido
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await OrderService.create(data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao criar pedido');
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

// Hook para atualizar status do pedido
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderStatusData }) => {
      const resp = await OrderService.updateStatus(id, data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao atualizar status do pedido');
      return resp.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

// Hook para deletar pedido
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await OrderService.delete(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao deletar pedido');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

