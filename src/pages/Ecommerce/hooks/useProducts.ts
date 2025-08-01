import { useState, useEffect, useCallback } from 'react';
import { Product, ProductCategory, ProductFilters, ProductSort } from '../types/ecommerce.types';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar produtos
  const loadProducts = useCallback(async () => {
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
  }, []);

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
  }, []);

  // Buscar produtos
  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    try {
      const response = await ProductService.searchProducts(query);
      return response.success ? response.data.products : [];
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      return [];
    }
  }, []);

  // Obter produtos por categoria
  const getProductsByCategory = useCallback(async (categoryId: string): Promise<Product[]> => {
    try {
      const response = await ProductService.getProductsByCategory(categoryId);
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Erro ao buscar produtos por categoria:', err);
      return [];
    }
  }, []);

  // Obter produto por ID
  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await ProductService.getProductById(id);
      return response.success ? response.data : null;
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      return null;
    }
  }, []);

  // Atualizar produtos
  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Produtos em destaque
  const featuredProducts = products.filter(product => product.isFeatured);

  // Produtos exclusivos
  const exclusiveProducts = products.filter(product => product.isExclusive);

  // Produtos novos
  const newProducts = products.filter(product => product.isNew);

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