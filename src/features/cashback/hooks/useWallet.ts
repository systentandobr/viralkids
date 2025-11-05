import { useCallback, useEffect, useState } from 'react';
import { WalletApi, WalletBalanceResponse, CashbackPreviewResponse } from '@/services/wallet/wallet.api';
import { useAuthContext } from '@/features/auth';
import { useCartStore } from '@/stores/cart.store';

export const useWallet = () => {
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalanceResponse | null>(null);
  const [preview, setPreview] = useState<CashbackPreviewResponse | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!user?.unitId) return;
    setIsLoading(true);
    setError(null);
    try {
      const resp = await WalletApi.getBalance(user.unitId);
      if (!resp.success || !resp.data) throw new Error(resp.error || 'Erro ao buscar saldo');
      setBalance(resp.data);
    } catch (e: any) {
      setError(e?.message || 'Erro ao buscar saldo');
    } finally {
      setIsLoading(false);
    }
  }, [user?.unitId]);

  const previewRedeem = useCallback(async (amount: number) => {
    if (!user?.unitId) return;
    const currentCart = useCartStore.getState().cart;
    const subtotal = currentCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const resp = await WalletApi.previewRedeem({ unitId: user.unitId, amount, subtotal });
    if (resp.success && resp.data) setPreview(resp.data);
    else setPreview(null);
  }, [user?.unitId]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return { isLoading, error, balance, preview, refreshBalance, previewRedeem } as const;
};


