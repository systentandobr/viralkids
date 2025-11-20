import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/features/auth';
import { LeadService, Lead, LeadFilters, LeadPipelineStats, CreateLeadData, UpdateLeadData } from '../leads/leadService';

// Query keys
export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (filters?: LeadFilters) => [...leadKeys.lists(), filters] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
  pipelineStats: () => [...leadKeys.all, 'pipeline-stats'] as const,
};

// Hook para listar leads
export const useLeads = (filters?: LeadFilters) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...leadKeys.list(filters), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await LeadService.list(filters);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar leads');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter um lead específico
export const useLead = (id: string) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...leadKeys.detail(id), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await LeadService.getById(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar lead');
      return resp.data;
    },
    enabled: !!id && !!unitId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter estatísticas do pipeline
export const useLeadPipelineStats = () => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...leadKeys.pipelineStats(), unitId || 'no-unit'],
    queryFn: async () => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await LeadService.getPipelineStats();
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar estatísticas');
      return resp.data;
    },
    enabled: !!unitId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para criar lead
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useMutation({
    mutationFn: async (data: CreateLeadData) => {
      if (!unitId) {
        throw new Error('unitId não encontrado');
      }
      const resp = await LeadService.create(data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao criar lead');
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.pipelineStats() });
    },
  });
};

// Hook para atualizar lead
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadData }) => {
      const resp = await LeadService.update(id, data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao atualizar lead');
      return resp.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: leadKeys.pipelineStats() });
    },
  });
};

// Hook para converter lead em cliente
export const useConvertLeadToCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, customerId }: { id: string; customerId: string }) => {
      const resp = await LeadService.convertToCustomer(id, customerId);
      if (!resp.success) throw new Error(resp.error || 'Erro ao converter lead');
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.pipelineStats() });
      // Invalidar também a lista de clientes
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Hook para deletar lead
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await LeadService.delete(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao deletar lead');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.pipelineStats() });
    },
  });
};

