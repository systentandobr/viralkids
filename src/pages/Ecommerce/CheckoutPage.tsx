import React, { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCheckout } from '@/features/orders/hooks/useCheckout';
import { useOrderActions } from '@/features/orders/hooks/useOrderActions';
import { useDelivery } from '@/features/delivery/hooks/useDelivery';
import { usePromotionPreview } from '@/features/promotions/hooks/usePromotions';
import { useWallet } from '@/features/cashback/hooks/useWallet';
import { WalletApi } from '@/services/wallet/wallet.api';

const Countdown: React.FC<{ until?: string | null }> = ({ until }) => {
  const [remaining, setRemaining] = useState<string>('');
  useEffect(() => {
    if (!until) return;
    const end = new Date(until).getTime();
    const id = setInterval(() => {
      const diff = end - Date.now();
      if (diff <= 0) {
        setRemaining('00:00');
        clearInterval(id);
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(id);
  }, [until]);
  if (!until) return null;
  return <Badge variant="outline">Reserva expira em {remaining}</Badge>;
};

const CheckoutPage: React.FC = () => {
  const cart = useCartStore((s) => s.cart);
  const getCartSubtotal = useCartStore((s) => s.getCartSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useMemo(() => getCartSubtotal(), [cart, getCartSubtotal]);

  const { reserveOrder, isLoading, error, orderId, reservedUntil, resetCheckout } = useCheckout();
  const { cancel, fetchById, waitForPaid } = useOrderActions();
  const { options, selected, setSelected, quote, dispatch, tracking, isLoading: deliveryLoading, error: deliveryError } = useDelivery();
  const { preview, isLoading: promoLoading, error: promoError, refresh: refreshPromos } = usePromotionPreview();
  const { balance, preview: cashbackPreview, previewRedeem, refreshBalance } = useWallet();
  const [redeemAmount, setRedeemAmount] = useState<number>(0);

  const handleReserve = async () => {
    await reserveOrder({ ttlSeconds: 900, cashbackRedeem: redeemAmount });
    await refreshPromos();
    await refreshBalance();
  };

  const cartSignature = useMemo(() => (
    cart.map(i => `${i.product.id}:${i.quantity}`).join('|')
  ), [cart]);

  useEffect(() => {
    // Atualiza preview de cashback quando altera valor ou carrinho
    previewRedeem(redeemAmount);
  }, [redeemAmount, previewRedeem, cartSignature]);

  const handleCancel = async () => {
    if (!orderId) return;
    const ok = await cancel(orderId);
    if (ok) resetCheckout();
  };

  const handleWaitPaid = async () => {
    if (!orderId) return;
    const paidOrder = await waitForPaid(orderId);
    if (paidOrder) {
      const amountToRedeem = cashbackPreview?.appliedAmount || redeemAmount || 0;
      if (amountToRedeem > 0) {
        await WalletApi.redeem({ orderId, amount: amountToRedeem });
        await refreshBalance();
      }
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="divide-y">
                {cart.map((item, idx) => (
                  <li key={`${item.product.id}-${item.selectedColor || 'nc'}-${item.selectedSize || 'ns'}-${idx}`} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-base text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">R$ {(item.product.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-3">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold">R$ {subtotal.toFixed(2)}</span>
              </div>
              {/* Wallet (cashback) */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Saldo Cashback</span>
                  <span className="font-semibold">R$ {(balance?.balance || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-32"
                    min={0}
                    max={balance?.balance || 0}
                    step={1}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(Math.max(0, Math.min(Number(e.target.value || 0), balance?.balance || 0)))}
                    placeholder="Resgatar"
                  />
                  <span className="text-base text-muted-foreground">Prévia total: R$ {(cashbackPreview?.totalAfterRedeem ?? subtotal).toFixed(2)}</span>
                </div>
              </div>
              {/* Promo preview */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Descontos (preview)</span>
                  <span className="font-semibold">{promoLoading ? '...' : `R$ ${(preview?.discountTotal || 0).toFixed(2)}`}</span>
                </div>
                {promoError && <p className="text-destructive text-base">{promoError}</p>}
                {preview?.promotions?.length ? (
                  <ul className="mt-2 space-y-1 text-base text-muted-foreground">
                    {preview.promotions.map((p) => (
                      <li key={p.id} className="flex items-center justify-between">
                        <span>{p.name}</span>
                        <span>- R$ {p.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-muted-foreground">Total (preview)</span>
                  <span className="text-lg font-bold">R$ {((preview?.total ?? subtotal) - (cashbackPreview?.appliedAmount || 0)).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button disabled={isLoading || cart.length === 0} onClick={handleReserve}>Reservar por 15 min</Button>
                {orderId && (
                  <>
                    <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                    <Button variant="secondary" onClick={handleWaitPaid}>Verificar pagamento</Button>
                  </>
                )}
                {reservedUntil && <Countdown until={reservedUntil} />}
              </div>
              {error && <p className="text-destructive text-base">{error}</p>}
            </>
          )}
        </CardContent>
      </Card>

      {orderId && (
        <Card>
          <CardHeader>
            <CardTitle>Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Button disabled={deliveryLoading} onClick={() => quote({ postalCode: '59000-000' })}>Cotar entrega</Button>
              {deliveryError && <span className="text-destructive text-base">{deliveryError}</span>}
            </div>
            {options.length > 0 && (
              <div className="space-y-2">
                {options.map((opt) => (
                  <div key={opt.id} className={`p-3 border rounded flex items-center justify-between ${selected?.id === opt.id ? 'border-primary' : ''}`}>
                    <div>
                      <p className="font-medium">{opt.provider} - {opt.method}</p>
                      <p className="text-base text-muted-foreground">R$ {opt.price.toFixed(2)} • {opt.etaDays} dia(s)</p>
                    </div>
                    <Button variant={selected?.id === opt.id ? 'secondary' : 'outline'} onClick={() => setSelected(opt)}>
                      {selected?.id === opt.id ? 'Selecionado' : 'Selecionar'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button disabled={!selected} onClick={() => dispatch(orderId)}>Despachar</Button>
              {tracking && <Badge variant="outline">Tracking: {tracking}</Badge>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CheckoutPage;


