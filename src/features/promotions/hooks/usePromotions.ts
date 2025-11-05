import { useCallback, useState } from 'react';
import { PromotionsApi, PromotionPreviewResponse } from '@/services/promotions/promotions.api';
import { useAuthContext } from '@/features/auth';
import { useCartStore } from '@/stores/cart.store';

export const usePromotionPreview = () => {
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PromotionPreviewResponse | null>(null);

  const refresh = useCallback(async () => {
    if (!user?.unitId || cart.length === 0) {
      setPreview(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const currentCart = useCartStore.getState().cart;
      const payload = {
        unitId: user.unitId,
        items: currentCart.map((i) => ({
          productId: i.product.id,
          sku: i.product.sku,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      };
      const resp = await PromotionsApi.preview(payload);
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Erro ao pré-visualizar promoções');
      setPreview(resp.data);
    } catch (e: any) {
      setError(e?.message || 'Erro ao pré-visualizar promoções');
    } finally {
      setIsLoading(false);
    }
  }, [user?.unitId]);

  return { isLoading, error, preview, refresh } as const;
};


