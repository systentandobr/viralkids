import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/features/auth';
import { FranchiseService, Franchise, FranchiseFilters, FranchiseMetrics, RegionalTrend, CreateFranchiseData, UpdateFranchiseData } from '../franchise/franchiseService';

// Query keys
export const franchiseKeys = {
  all: ['franchises'] as const,
  lists: () => [...franchiseKeys.all, 'list'] as const,
  list: (filters?: FranchiseFilters) => [...franchiseKeys.lists(), filters] as const,
  details: () => [...franchiseKeys.all, 'detail'] as const,
  detail: (id: string) => [...franchiseKeys.details(), id] as const,
  metrics: (id: string) => [...franchiseKeys.detail(id), 'metrics'] as const,
  regionalTrends: () => [...franchiseKeys.all, 'regional-trends'] as const,
};

// Hook para listar franquias
export const useFranchises = (filters?: FranchiseFilters) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...franchiseKeys.list(filters), unitId || 'no-unit'],
    queryFn: async () => {
      const resp = await FranchiseService.list(filters);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar franquias');
      return resp.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter uma franquia específica
export const useFranchise = (id: string) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...franchiseKeys.detail(id), unitId || 'no-unit'],
    queryFn: async () => {
      const resp = await FranchiseService.getById(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar franquia');
      return resp.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para obter métricas de uma franquia
export const useFranchiseMetrics = (id: string) => {
  const { user } = useAuthContext();
  const unitId = user?.unitId;

  return useQuery({
    queryKey: [...franchiseKeys.metrics(id), unitId || 'no-unit'],
    queryFn: async () => {
      const resp = await FranchiseService.getMetrics(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar métricas');
      return resp.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obter tendências regionais
export const useRegionalTrends = () => {
  return useQuery({
    queryKey: franchiseKeys.regionalTrends(),
    queryFn: async () => {
      const resp = await FranchiseService.getRegionalTrends();
      if (!resp.success) throw new Error(resp.error || 'Erro ao buscar tendências regionais');
      return resp.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para criar franquia
export const useCreateFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFranchiseData) => {
      const resp = await FranchiseService.create(data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao criar franquia');
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.regionalTrends() });
    },
  });
};

// Hook para atualizar franquia
export const useUpdateFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFranchiseData }) => {
      const resp = await FranchiseService.update(id, data);
      if (!resp.success) throw new Error(resp.error || 'Erro ao atualizar franquia');
      return resp.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.regionalTrends() });
    },
  });
};

// Hook para deletar franquia
export const useDeleteFranchise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await FranchiseService.delete(id);
      if (!resp.success) throw new Error(resp.error || 'Erro ao deletar franquia');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: franchiseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: franchiseKeys.regionalTrends() });
    },
  });
};

