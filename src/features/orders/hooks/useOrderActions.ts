import { useCallback, useState } from 'react';
import { OrdersApi } from '@/services/orders/orders.api';

type OrderStatus = 'created' | 'reserved' | 'paid' | 'canceled' | 'failed';

export const useOrderActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchById = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await OrdersApi.getById(orderId);
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Erro ao buscar pedido');
      return resp.data;
    } catch (e: any) {
      setError(e?.message || 'Erro ao buscar pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await OrdersApi.cancel(orderId);
      if (!resp.success) throw new Error(resp.error || 'Erro ao cancelar pedido');
      return true;
    } catch (e: any) {
      setError(e?.message || 'Erro ao cancelar pedido');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Observação: confirmação real costuma ocorrer via webhook de pagamento.
  // Este helper refaz o fetch para refletir status atualizado.
  const waitForPaid = useCallback(async (orderId: string, { retries = 10, intervalMs = 3000 } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      for (let i = 0; i < retries; i++) {
        const order = await OrdersApi.getById(orderId);
        if (order.success && order.data && order.data.status === 'paid') {
          return order.data;
        }
        await new Promise(r => setTimeout(r, intervalMs));
      }
      throw new Error('Pagamento não confirmado no tempo esperado');
    } catch (e: any) {
      setError(e?.message || 'Erro ao aguardar confirmação');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchById,
    cancel,
    waitForPaid,
  } as const;
};


