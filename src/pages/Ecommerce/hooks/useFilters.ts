import { useMemo } from 'react';
import { useFiltersStore } from '@/stores/filters.store';
import { Product, ProductFiltersType } from '../types/ecommerce.types';

interface UseFiltersReturn {
  filters: ProductFiltersType;
  updateFilter: (key: keyof ProductFiltersType, value: any) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  activeFiltersCount: number;
}

export const useFilters = (products: Product[]): UseFiltersReturn => {
  // Usar as ações e estado da store
  const filters = useFiltersStore(state => state.filters);
  const updateFilter = useFiltersStore(state => state.updateFilter);
  const resetFilters = useFiltersStore(state => state.resetFilters);
  const getActiveFiltersCount = useFiltersStore(state => state.getActiveFiltersCount);

  // Calcular filtros ativos usando a função da store
  const activeFiltersCount = getActiveFiltersCount();

  // Aplicar filtros aos produtos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro por categoria
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filtro por preço mínimo
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }

      // Filtro por preço máximo
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      // Filtro por marca
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Filtro por disponibilidade em estoque
      if (filters.inStock === true && !product.inStock) {
        return false;
      }

      // Filtro por idade mínima
      if (filters.minAge !== undefined && product.minAge !== undefined && product.minAge < filters.minAge) {
        return false;
      }

      // Filtro por idade máxima
      if (filters.maxAge !== undefined && product.maxAge !== undefined && product.maxAge > filters.maxAge) {
        return false;
      }

      // Filtro por cores
      if (filters.colors && filters.colors.length > 0) {
        if (!product.colors || !filters.colors.some(color => product.colors!.includes(color))) {
          return false;
        }
      }

      // Filtro por tamanhos
      if (filters.sizes && filters.sizes.length > 0) {
        if (!product.sizes || !filters.sizes.some(size => product.sizes!.includes(size))) {
          return false;
        }
      }

      // Filtro por avaliação mínima
      if (filters.rating !== undefined && product.rating < filters.rating) {
        return false;
      }

      // Filtro por produtos novos
      if (filters.isNew === true && !product.isNew) {
        return false;
      }

      // Filtro por produtos em destaque
      if (filters.isFeatured === true && !product.isFeatured) {
        return false;
      }

      // Filtro por franquia
      if (filters.franchiseId && product.franchiseId !== filters.franchiseId) {
        return false;
      }

      // Filtro por tags
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => product.tags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredProducts,
    activeFiltersCount
  };
};
