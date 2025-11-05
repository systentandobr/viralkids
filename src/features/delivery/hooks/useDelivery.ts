import { useCallback, useState } from 'react';
import { DeliveryApi, DeliveryOption } from '@/services/delivery/delivery.api';
import { useAuthContext } from '@/features/auth';
import { useCartStore } from '@/stores/cart.store';

export const useDelivery = () => {
  const { user } = useAuthContext();
  const cart = useCartStore((s) => s.cart);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [selected, setSelected] = useState<DeliveryOption | null>(null);
  const [tracking, setTracking] = useState<string | null>(null);

  const quote = useCallback(async (address: { postalCode: string; city?: string; state?: string }) => {
    if (!user?.unitId) {
      setError('Unidade não definida para o usuário.');
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        address,
        unitId: user.unitId,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      };
      const resp = await DeliveryApi.quote(payload);
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Erro ao cotar delivery');
      setOptions(resp.data.options || []);
      setSelected(null);
      return true;
    } catch (e: any) {
      setError(e?.message || 'Erro ao cotar delivery');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.unitId, cart]);

  const dispatch = useCallback(async (orderId: string, optionId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const id = optionId || selected?.id;
      if (!id) throw new Error('Nenhuma opção de delivery selecionada');
      const resp = await DeliveryApi.dispatch({ orderId, optionId: id });
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Erro ao despachar delivery');
      setTracking(resp.data.tracking || null);
      return true;
    } catch (e: any) {
      setError(e?.message || 'Erro ao despachar delivery');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selected]);

  return {
    isLoading,
    error,
    options,
    selected,
    setSelected,
    tracking,
    quote,
    dispatch,
  } as const;
};


