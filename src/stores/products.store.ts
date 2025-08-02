import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductCategory } from '@/pages/Ecommerce/types/ecommerce.types';

interface ProductsState {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  searchResults: Product[];
  searchQuery: string;
  currentProduct: Product | null;
}

interface ProductsActions {
  setProducts: (products: Product[]) => void;
  setCategories: (categories: ProductCategory[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchResults: (results: Product[], query: string) => void;
  setCurrentProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearSearchResults: () => void;
  refreshTimestamp: () => void;
  shouldRefresh: (maxAge?: number) => boolean;
  getFeaturedProducts: () => Product[];
  getExclusiveProducts: () => Product[];
  getNewProducts: () => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

type ProductsStore = ProductsState & ProductsActions;

// Cache por 5 minutos por padrão
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      products: [],
      categories: [],
      loading: false,
      error: null,
      lastFetched: null,
      searchResults: [],
      searchQuery: '',
      currentProduct: null,

      // Ações
      setProducts: (products: Product[]) => {
        set({ 
          products, 
          lastFetched: Date.now(),
          error: null 
        });
      },

      setCategories: (categories: ProductCategory[]) => {
        set({ categories });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error, loading: false });
      },

      setSearchResults: (results: Product[], query: string) => {
        set({ 
          searchResults: results, 
          searchQuery: query 
        });
      },

      setCurrentProduct: (product: Product | null) => {
        set({ currentProduct: product });
      },

      addProduct: (product: Product) => {
        set((state) => ({
          products: [...state.products, product]
        }));
      },

      updateProduct: (product: Product) => {
        set((state) => ({
          products: state.products.map(p => 
            p.id === product.id ? product : p
          ),
          currentProduct: state.currentProduct?.id === product.id 
            ? product 
            : state.currentProduct
        }));
      },

      removeProduct: (productId: string) => {
        set((state) => ({
          products: state.products.filter(p => p.id !== productId),
          currentProduct: state.currentProduct?.id === productId 
            ? null 
            : state.currentProduct
        }));
      },

      clearSearchResults: () => {
        set({ 
          searchResults: [], 
          searchQuery: '' 
        });
      },

      refreshTimestamp: () => {
        set({ lastFetched: Date.now() });
      },

      shouldRefresh: (maxAge: number = DEFAULT_CACHE_TIME) => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > maxAge;
      },

      getFeaturedProducts: () => {
        const { products } = get();
        return products.filter(product => product.isFeatured);
      },

      getExclusiveProducts: () => {
        const { products } = get();
        return products.filter(product => product.isExclusive);
      },

      getNewProducts: () => {
        const { products } = get();
        return products.filter(product => product.isNew);
      },

      getProductsByCategory: (categoryId: string) => {
        const { products } = get();
        return products.filter(product => product.category === categoryId);
      },

      getProductById: (id: string) => {
        const { products } = get();
        return products.find(product => product.id === id);
      },
    }),
    {
      name: 'viralkids-products-storage',
      storage: createJSONStorage(() => localStorage),
      // Não persistir loading, error e currentProduct
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        lastFetched: state.lastFetched,
        searchResults: state.searchResults,
        searchQuery: state.searchQuery,
      }),
      // Versão do storage para invalidar cache antigo
      version: 1,
    }
  )
);
