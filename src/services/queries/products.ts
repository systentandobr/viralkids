import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';

// Tipos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  inStock: boolean;
  stockQuantity?: number;
  featured: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// Fetch Functions
const fetchProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const response = await httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, {
    params: filters
  });
  
  if (!response.success) {
    throw new Error(response.error || 'Erro ao buscar produtos');
  }
  
  return response.data || [];
};

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await httpClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  
  if (!response.success) {
    throw new Error(response.error || 'Erro ao buscar produto');
  }
  
  return response.data!;
};

const fetchProductCategories = async (): Promise<string[]> => {
  const response = await httpClient.get<string[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  
  if (!response.success) {
    throw new Error(response.error || 'Erro ao buscar categorias');
  }
  
  return response.data || [];
};

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const response = await httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.FEATURED);
  
  if (!response.success) {
    throw new Error(response.error || 'Erro ao buscar produtos em destaque');
  }
  
  return response.data || [];
};

const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH, {
    params: { q: query }
  });
  
  if (!response.success) {
    throw new Error(response.error || 'Erro ao buscar produtos');
  }
  
  return response.data || [];
};

// Query Hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: fetchProductCategories,
    staleTime: 30 * 60 * 1000, // 30 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: fetchFeaturedProducts,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 20 * 60 * 1000, // 20 minutos
  });
};

export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Mutation Hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductDto) => 
      httpClient.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalida e refetch da lista
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        // Adiciona o novo produto ao cache
        queryClient.setQueryData(
          productKeys.detail(response.data.id),
          response.data
        );
        // Invalida produtos em destaque
        queryClient.invalidateQueries({ queryKey: productKeys.featured() });
      }
    },
    onError: (error) => {
      console.error('Erro ao criar produto:', error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      httpClient.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data),
    onSuccess: (response, { id }) => {
      if (response.success && response.data) {
        // Atualiza o cache do produto
        queryClient.setQueryData(productKeys.detail(id), response.data);
        // Invalida a lista
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        // Invalida produtos em destaque
        queryClient.invalidateQueries({ queryKey: productKeys.featured() });
      }
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      httpClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id)),
    onSuccess: (response, id) => {
      if (response.success) {
        // Remove do cache
        queryClient.removeQueries({ queryKey: productKeys.detail(id) });
        // Invalida a lista
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        // Invalida produtos em destaque
        queryClient.invalidateQueries({ queryKey: productKeys.featured() });
      }
    },
    onError: (error) => {
      console.error('Erro ao deletar produto:', error);
    },
  });
};

// Hook utilitário para filtrar produtos
export const useFilteredProducts = (filters: ProductFilters) => {
  const { data: products, isLoading, error } = useProducts(filters);
  
  const filteredProducts = products?.filter(product => {
    // Filtro por categoria
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Filtro por subcategoria
    if (filters.subcategory && product.subcategory !== filters.subcategory) {
      return false;
    }
    
    // Filtro por preço
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    
    // Filtro por estoque
    if (filters.inStock && !product.inStock) {
      return false;
    }
    
    // Filtro por destaque
    if (filters.featured && !product.featured) {
      return false;
    }
    
    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
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
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';
    
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
    products: sortedProducts,
    isLoading,
    error,
    totalCount: sortedProducts?.length || 0,
  };
}; 