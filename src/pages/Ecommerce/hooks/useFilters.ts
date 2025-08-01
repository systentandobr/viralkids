import { useState, useEffect, useMemo } from 'react';
import { Product, ProductFilters } from '../types/ecommerce.types';

interface UseFiltersReturn {
  filters: ProductFilters;
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  activeFiltersCount: number;
}

const defaultFilters: ProductFilters = {
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  brand: undefined,
  inStock: undefined,
  minAge: undefined,
  maxAge: undefined,
  colors: [],
  sizes: [],
  rating: undefined,
  isNew: undefined,
  isFeatured: undefined,
  franchiseId: undefined,
  tags: []
};

export const useFilters = (products: Product[]): UseFiltersReturn => {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

  // Atualizar filtro específico
  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Resetar todos os filtros
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Contar filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    Object.keys(filters).forEach(key => {
      const filterKey = key as keyof ProductFilters;
      const value = filters[filterKey];

      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) count++;
        } else if (typeof value === 'boolean') {
          if (value === true) count++;
        } else {
          count++;
        }
      }
    });

    return count;
  }, [filters]);

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