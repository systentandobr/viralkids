import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProductFiltersType } from '@/pages/Ecommerce/types/ecommerce.types';

interface FiltersState {
  filters: ProductFiltersType;
}

interface FiltersActions {
  updateFilter: (key: keyof ProductFiltersType, value: any) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
}

type FiltersStore = FiltersState & FiltersActions;

const defaultFilters: ProductFiltersType = {
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

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      filters: defaultFilters,

      // Ações
      updateFilter: (key: keyof ProductFiltersType, value: any) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      getActiveFiltersCount: () => {
        const { filters } = get();
        let count = 0;

        Object.keys(filters).forEach(key => {
          const filterKey = key as keyof ProductFiltersType;
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
      },
    }),
    {
      name: 'viralkids-filters-storage', // nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
      // Serializar apenas os filtros
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
