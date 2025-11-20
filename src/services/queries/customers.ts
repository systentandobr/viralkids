import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/features/auth';
import { CustomerService, Customer, CustomerFilters, CustomerStats, CreateCustomerData, UpdateCustomerData } from '../customers/customerService';

// Query keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: CustomerFilters) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
};

// Hook para listar clientes
export const useCustomers = (filters?: CustomerFilters) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...customerKeys.list(filters), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await CustomerService.list(filters);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar clientes');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter um cliente específico
export const useCustomer = (id: string) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...customerKeys.detail(id), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await CustomerService.getById(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar cliente');
      return resp.data;
    },
    enabled: !!id && !!unitId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter estatísticas
export const useCustomerStats = () => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...customerKeys.stats(), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await CustomerService.getStats();
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar estatísticas');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para criar cliente
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useMutation({
    mutationFn: async (data: CreateCustomerData) => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await CustomerService.create(data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao criar cliente');
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Hook para atualizar cliente
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCustomerData }) => {
      const resp = await CustomerService.update(id, data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao atualizar cliente');
      return resp.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Hook para deletar cliente
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await CustomerService.delete(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao deletar cliente');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

