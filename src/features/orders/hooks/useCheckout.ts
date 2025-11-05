import { useCallback, useMemo, useState } from 'react';
import { OrdersApi, CreateOrderRequest } from '@/services/orders/orders.api';
import { useCartStore } from '@/stores/cart.store';
import { useAuthContext } from '@/features/auth';

interface ReserveOptions {
  ttlSeconds?: number;
  cashbackRedeem?: number;
}

export const useCheckout = () => {
  const cart = useCartStore((s) => s.cart);
  const getCartSubtotal = useCartStore((s) => s.getCartSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [reservedUntil, setReservedUntil] = useState<string | null>(null);

  const canCheckout = useMemo(() => {
    return !!user?.unitId && cart.length > 0;
  }, [user?.unitId, cart.length]);

  const reserveOrder = useCallback(async (options: ReserveOptions = {}) => {
    if (!user?.unitId) {
      setError('Unidade não definida para o usuário.');
      return { success: false } as const;
    }
    if (cart.length === 0) {
      setError('Carrinho vazio.');
      return { success: false } as const;
    }

    setIsLoading(true);
    setError(null);
    try {
      const subtotal = getCartSubtotal();
      const payload: CreateOrderRequest = {
        unitId: user.unitId,
        items: cart.map((item) => ({
          productId: item.product.id,
          sku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        totals: {
          subtotal,
          cashbackRedeem: options.cashbackRedeem || 0,
          total: Math.max(subtotal - (options.cashbackRedeem || 0), 0),
        },
        reserveTtlSeconds: options.ttlSeconds ?? 900, // 15 minutos padrão
      };

      const resp = await OrdersApi.create(payload);
      if (!resp.success || !resp.data) {
        throw new Error(resp.error || 'Falha ao criar reserva do pedido');
      }

      setOrderId(resp.data.id);
      setReservedUntil(resp.data.reservedUntil || null);

      return { success: true, orderId: resp.data.id, reservedUntil: resp.data.reservedUntil } as const;
    } catch (e: any) {
      setError(e?.message || 'Erro ao reservar pedido');
      return { success: false } as const;
    } finally {
      setIsLoading(false);
    }
  }, [user?.unitId, cart, getCartSubtotal]);

  const clearReservation = useCallback(() => {
    setOrderId(null);
    setReservedUntil(null);
  }, []);

  const resetCheckout = useCallback(() => {
    clearReservation();
    clearCart();
    setError(null);
  }, [clearReservation, clearCart]);

  return {
    isLoading,
    error,
    orderId,
    reservedUntil,
    canCheckout,
    reserveOrder,
    clearReservation,
    resetCheckout,
  } as const;
};


