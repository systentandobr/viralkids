import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Cart } from '../types/ecommerce.types';
import { useRouter } from '@/router';

interface UseCartReturn {
  cart: CartItem[];
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

const CART_STORAGE_KEY = 'viralkids_cart';

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { navigate } = useRouter();

  // Carregar carrinho do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  }, []);

  // Salvar carrinho no localStorage
  const saveCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, []);

  // Adicionar produto ao carrinho
  const addToCart = useCallback((
    product: Product, 
    quantity: number = 1,
    options?: { color?: string; size?: string }
  ) => {
    setCart(prevCart => {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id &&
        item.selectedColor === options?.color &&
        item.selectedSize === options?.size
      );

      let newCart: CartItem[];

      if (existingItemIndex >= 0) {
        // Atualizar quantidade do item existente
        newCart = prevCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Adicionar novo item
        const newItem: CartItem = {
          product,
          quantity,
          selectedColor: options?.color,
          selectedSize: options?.size,
          addedAt: new Date().toISOString()
        };
        newCart = [...prevCart, newItem];
      }

      saveCart(newCart);
      return newCart;
    });
  }, [saveCart]);

  // Remover produto do carrinho
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.product.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  }, [saveCart]);

  // Atualizar quantidade do produto
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, [removeFromCart, saveCart]);

  // Limpar carrinho
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  // Calcular subtotal
  const getCartSubtotal = useCallback(() => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }, [cart]);

  // Calcular total (incluindo frete e taxas se necessário)
  const getCartTotal = useCallback(() => {
    const subtotal = getCartSubtotal();
    // Aqui podemos adicionar cálculos de frete, taxas, descontos, etc.
    const shipping = 0; // Por enquanto sem frete
    const tax = 0; // Por enquanto sem taxas
    const discount = 0; // Por enquanto sem desconto
    
    return subtotal + shipping + tax - discount;
  }, [getCartSubtotal]);

  // Contar itens no carrinho
  const getCartItemsCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Verificar se produto está no carrinho
  const isInCart = useCallback((productId: string) => {
    return cart.some(item => item.product.id === productId);
  }, [cart]);

  // Obter quantidade de um produto específico no carrinho
  const getCartItemQuantity = useCallback((productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  const finishSale = useCallback(() => {
    // TODO: Implementar a lógica de finalizar a compra
    console.log('Finalizar Compra');
    // parseToCheckout(cart);
    navigate('#/checkout');
  }, []);

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