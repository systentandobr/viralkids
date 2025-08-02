import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/pages/Ecommerce/types/ecommerce.types';

interface CartState {
  cart: CartItem[];
  loading: boolean;
}

interface CartActions {
  addToCart: (product: Product, quantity?: number, options?: { color?: string; size?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  setLoading: (loading: boolean) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cart: [],
      loading: false,

      // Ações
      addToCart: (product: Product, quantity: number = 1, options?: { color?: string; size?: string }) => {
        set((state) => {
          // Verificar se o produto já está no carrinho
          const existingItemIndex = state.cart.findIndex(item => 
            item.product.id === product.id &&
            item.selectedColor === options?.color &&
            item.selectedSize === options?.size
          );

          let newCart: CartItem[];

          if (existingItemIndex >= 0) {
            // Atualizar quantidade do item existente
            newCart = state.cart.map((item, index) => 
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
            newCart = [...state.cart, newItem];
          }

          return { cart: newCart };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          cart: state.cart.filter(item => item.product.id !== productId)
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cart: state.cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartSubtotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          return total + (item.product.price * item.quantity);
        }, 0);
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        // Aqui podemos adicionar cálculos de frete, taxas, descontos, etc.
        const shipping = 0; // Por enquanto sem frete
        const tax = 0; // Por enquanto sem taxas
        const discount = 0; // Por enquanto sem desconto
        
        return subtotal + shipping + tax - discount;
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      isInCart: (productId: string) => {
        const { cart } = get();
        return cart.some(item => item.product.id === productId);
      },

      getCartItemQuantity: (productId: string) => {
        const { cart } = get();
        const item = cart.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'viralkids-cart-storage', // nome da chave no localStorage
      storage: createJSONStorage(() => localStorage), // usar localStorage
      // Serializar apenas o estado, não as ações
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
