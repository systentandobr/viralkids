import { useCallback, useState } from 'react';
import { InventoryApi, ReplenishPlanResponse } from '@/services/inventory/inventory.api';
import { useAuthContext } from '@/features/auth';

export const useReplenishmentPlan = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<ReplenishPlanResponse | null>(null);

  const generate = useCallback(async () => {
    if (!user?.unitId) {
      setError('Unidade não definida para o usuário.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const resp = await InventoryApi.replenishPlan({ unitId: user.unitId });
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Erro ao gerar plano de reposição');
      setPlan(resp.data);
      return true;
    } catch (e: any) {
      setError(e?.message || 'Erro ao gerar plano de reposição');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.unitId]);

  return { isLoading, error, plan, generate } as const;
};


