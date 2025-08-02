import { useEffect, useCallback } from 'react';
import { useProductsStore } from '@/stores/products.store';
import { Product, ProductCategory } from '../types/ecommerce.types';
import { ProductService } from '../services/product.service';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: ProductCategory[];
  featuredProducts: Product[];
  exclusiveProducts: Product[];
  newProducts: Product[];
  searchProducts: (query: string) => Promise<Product[]>;
  getProductsByCategory: (categoryId: string) => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product | null>;
  refreshProducts: () => void;
}

export const useProducts = (): UseProductsReturn => {
  // Usar as ações e estado da store
  const products = useProductsStore(state => state.products);
  const categories = useProductsStore(state => state.categories);
  const loading = useProductsStore(state => state.loading);
  const error = useProductsStore(state => state.error);
  const shouldRefresh = useProductsStore(state => state.shouldRefresh);
  const setProducts = useProductsStore(state => state.setProducts);
  const setCategories = useProductsStore(state => state.setCategories);
  const setLoading = useProductsStore(state => state.setLoading);
  const setError = useProductsStore(state => state.setError);
  const getFeaturedProducts = useProductsStore(state => state.getFeaturedProducts);
  const getExclusiveProducts = useProductsStore(state => state.getExclusiveProducts);
  const getNewProducts = useProductsStore(state => state.getNewProducts);
  const getProductsByCategoryStore = useProductsStore(state => state.getProductsByCategory);
  const getProductByIdStore = useProductsStore(state => state.getProductById);
  const setSearchResults = useProductsStore(state => state.setSearchResults);

  // Carregar produtos
  const loadProducts = useCallback(async (force: boolean = false) => {
    // Verificar se precisa atualizar os dados
    if (!force && !shouldRefresh()) {
      return; // Usar dados do cache
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Erro ao carregar produtos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [shouldRefresh, setLoading, setError, setProducts]);

  // Carregar categorias
  const loadCategories = useCallback(async () => {
    try {
      const response = await ProductService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  }, [setCategories]);

  // Buscar produtos
  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    try {
      const response = await ProductService.searchProducts(query);
      if (response.success) {
        setSearchResults(response.data.products, query);
        return response.data.products;
      }
      return [];
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      return [];
    }
  }, [setSearchResults]);

  // Obter produtos por categoria (primeiro verificar cache)
  const getProductsByCategory = useCallback(async (categoryId: string): Promise<Product[]> => {
    // Primeiro tentar obter do cache
    const cachedProducts = getProductsByCategoryStore(categoryId);
    if (cachedProducts.length > 0) {
      return cachedProducts;
    }

    // Se não encontrar no cache, buscar da API
    try {
      const response = await ProductService.getProductsByCategory(categoryId);
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Erro ao buscar produtos por categoria:', err);
      return [];
    }
  }, [getProductsByCategoryStore]);

  // Obter produto por ID (primeiro verificar cache)
  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    // Primeiro tentar obter do cache
    const cachedProduct = getProductByIdStore(id);
    if (cachedProduct) {
      return cachedProduct;
    }

    // Se não encontrar no cache, buscar da API
    try {
      const response = await ProductService.getProductById(id);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      return null;
    }
  }, [getProductByIdStore]);

  // Atualizar produtos (forçar busca nova)
  const refreshProducts = useCallback(() => {
    loadProducts(true);
  }, [loadProducts]);

  // Produtos calculados usando as funções da store
  const featuredProducts = getFeaturedProducts();
  const exclusiveProducts = getExclusiveProducts();
  const newProducts = getNewProducts();

  // Carregar dados iniciais
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return {
    products,
    loading,
    error,
    categories,
    featuredProducts,
    exclusiveProducts,
    newProducts,
    searchProducts,
    getProductsByCategory,
    getProductById,
    refreshProducts
  };
};
