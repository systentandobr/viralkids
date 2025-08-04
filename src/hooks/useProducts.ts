import { 
  useProducts as useProductsQuery, 
  useProduct as useProductQuery,
  useFeaturedProducts as useFeaturedProductsQuery,
  useProductSearch as useProductSearchQuery
} from '@/services/queries/products';
import { useFiltersStore } from '@/stores/filters.store';
import { useCartStore } from '@/stores/cart.store';
import type { ProductFilters, Product } from '@/services/queries/products';

// Hook wrapper que integra React Query com Zustand
export const useProducts = (filters?: ProductFilters) => {
  // Server state com React Query
  const queryResult = useProductsQuery(filters);
  
  // Client state com Zustand
  const { addItem, removeItem, updateQuantity, getCartItemsCount, isInCart } = useCartStore();

  return {
    // Server state
    products: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    
    // Client state (carrinho)
    addToCart: addItem,
    removeFromCart: removeItem,
    updateCartQuantity: updateQuantity,
    getCartItemsCount,
    isInCart,
    
    // Utilitários
    hasProducts: !!queryResult.data && queryResult.data.length > 0,
    productsCount: queryResult.data?.length || 0,
  };
};

// Hook wrapper para produto individual
export const useProduct = (id: string) => {
  // Server state com React Query
  const queryResult = useProductQuery(id);
  
  // Client state com Zustand
  const { addItem, isInCart } = useCartStore();

  return {
    // Server state
    product: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    
    // Client state (carrinho)
    addToCart: () => queryResult.data && addItem(queryResult.data),
    isInCart: queryResult.data ? isInCart(queryResult.data.id) : false,
    
    // Utilitários
    hasProduct: !!queryResult.data,
  };
};

// Hook para produtos filtrados (integração completa)
export const useFilteredProducts = (filters?: ProductFilters) => {
  // Server state com React Query
  const { data: products, isLoading, error } = useProductsQuery(filters);
  
  // Client state com Zustand
  const { filters: clientFilters } = useFiltersStore();
  const { addItem, removeItem, updateQuantity, getCartItemsCount, isInCart } = useCartStore();

  // Aplicar filtros do cliente se não foram fornecidos
  const appliedFilters = filters || clientFilters;

  // Filtrar produtos baseado nos filtros aplicados
  const filteredProducts = products?.filter(product => {
    // Filtro por categoria
    if (appliedFilters.category && product.category !== appliedFilters.category) {
      return false;
    }
    
    // Filtro por subcategoria
    if (appliedFilters.subcategory && product.subcategory !== appliedFilters.subcategory) {
      return false;
    }
    
    // Filtro por preço
    if (appliedFilters.priceRange) {
      const [min, max] = appliedFilters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    
    // Filtro por estoque
    if (appliedFilters.inStock && !product.inStock) {
      return false;
    }
    
    // Filtro por destaque
    if (appliedFilters.featured && !product.featured) {
      return false;
    }
    
    // Filtro por busca
    if (appliedFilters.search) {
      const searchTerm = appliedFilters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesDescription = product.description.toLowerCase().includes(searchTerm);
      const matchesCategory = product.category.toLowerCase().includes(searchTerm);
      
      if (!matchesName && !matchesDescription && !matchesCategory) {
        return false;
      }
    }
    
    return true;
  });

  // Ordenação
  const sortedProducts = filteredProducts?.sort((a, b) => {
    const sortBy = appliedFilters.sortBy || 'name';
    const sortOrder = appliedFilters.sortOrder || 'asc';
    
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return {
    // Server state
    products: sortedProducts,
    isLoading,
    error,
    
    // Client state (carrinho)
    addToCart: addItem,
    removeFromCart: removeItem,
    updateCartQuantity: updateQuantity,
    getCartItemsCount,
    isInCart,
    
    // Utilitários
    totalCount: sortedProducts?.length || 0,
    hasProducts: !!sortedProducts && sortedProducts.length > 0,
    filters: appliedFilters,
  };
};

// Hook para produtos em destaque
export const useFeaturedProducts = () => {
  const queryResult = useFeaturedProductsQuery();
  
  const { addItem, isInCart } = useCartStore();

  return {
    // Server state
    products: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    
    // Client state (carrinho)
    addToCart: addItem,
    isInCart,
    
    // Utilitários
    hasProducts: !!queryResult.data && queryResult.data.length > 0,
    productsCount: queryResult.data?.length || 0,
  };
};

// Hook para busca de produtos
export const useProductSearch = (query: string) => {
  const queryResult = useProductSearchQuery(query);
  
  const { addItem, isInCart } = useCartStore();

  return {
    // Server state
    products: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    
    // Client state (carrinho)
    addToCart: addItem,
    isInCart,
    
    // Utilitários
    hasResults: !!queryResult.data && queryResult.data.length > 0,
    resultsCount: queryResult.data?.length || 0,
    searchQuery: query,
  };
}; 