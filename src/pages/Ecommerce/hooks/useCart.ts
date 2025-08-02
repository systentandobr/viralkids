import { useCallback } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useRouter } from '@/router';
import { Product } from '../types/ecommerce.types';

interface UseCartReturn {
  cart: ReturnType<typeof useCartStore>['cart'];
  loading: boolean;
  addToCart: (product: Product, quantity?: number, options?: { color?: string; size?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  finishSale: () => void;
}

export const useCart = (): UseCartReturn => {
  const { navigate } = useRouter();
  
  // Usar as ações e estado da store
  const cart = useCartStore(state => state.cart);
  const loading = useCartStore(state => state.loading);
  const addToCart = useCartStore(state => state.addToCart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);
  const getCartTotal = useCartStore(state => state.getCartTotal);
  const getCartSubtotal = useCartStore(state => state.getCartSubtotal);
  const getCartItemsCount = useCartStore(state => state.getCartItemsCount);
  const isInCart = useCartStore(state => state.isInCart);
  const getCartItemQuantity = useCartStore(state => state.getCartItemQuantity);

  const finishSale = useCallback(() => {
    // TODO: Implementar a lógica de finalizar a compra
    console.log('Finalizar Compra');
    // parseToCheckout(cart);
    navigate('#/checkout');
  }, [navigate]);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartItemsCount,
    isInCart,
    getCartItemQuantity,
    finishSale,
  };
};
