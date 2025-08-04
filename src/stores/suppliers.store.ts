import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types importados da feature
export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  whatsapp: string;
  website?: string;
  instagram?: string;
  location: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  businessInfo: {
    segment: string;
    foundedYear: number;
    employeeCount: string;
    monthlyRevenue?: string;
    requiresCNPJ: boolean;
    minOrderValue: number;
    paymentTerms: string[];
    deliveryTime: string;
  };
  products: {
    categories: string[];
    brands: string[];
    totalProducts: number;
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
  rating: {
    overall: number;
    quality: number;
    delivery: number;
    service: number;
    totalReviews: number;
  };
  verified: boolean;
  featured: boolean;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierFilter {
  states?: string[];
  cities?: string[];
  verified?: boolean;
  featured?: boolean;
  rating?: number;
  requiresCNPJ?: boolean;
  categories?: string[];
  minOrderValue?: number;
  maxOrderValue?: number;
  search?: string;
}

export interface SupplierMetrics {
  totalSuppliers: number;
  verifiedSuppliers: number;
  averageRating: number;
  topStates: Array<{
    state: string;
    count: number;
    percentage: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recentContacts: number;
  activePartnerships: number;
}

interface SuppliersState {
  // Dados
  suppliers: Supplier[];
  filteredSuppliers: Supplier[];
  metrics: SupplierMetrics | null;
  
  // Filtros e busca
  currentFilter: SupplierFilter;
  searchTerm: string;
  
  // Estado da UI
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  
  // Cache
  cacheExpiration: number;
}

interface SuppliersActions {
  // Gerenciamento de dados
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  removeSupplier: (id: string) => void;
  
  // Filtros e busca
  setFilter: (filter: Partial<SupplierFilter>) => void;
  clearFilters: () => void;
  setSearchTerm: (term: string) => void;
  applyFilters: () => void;
  
  // Métricas
  calculateMetrics: () => void;
  
  // Utilitários
  getSupplierById: (id: string) => Supplier | undefined;
  getSuppliersByState: (state: string) => Supplier[];
  getSuppliersByCity: (city: string) => Supplier[];
  getFeaturedSuppliers: (limit?: number) => Supplier[];
  getVerifiedSuppliers: () => Supplier[];
  
  // Cache e carregamento
  shouldRefresh: () => boolean;
  refreshData: () => Promise<void>;
  importFromJson: (suppliersData: Supplier[]) => void;
  
  // Estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCache: () => void;
}

// Tempo de cache padrão: 1 hora
const DEFAULT_CACHE_TIME = 60 * 60 * 1000;

export const useSuppliersStore = create<SuppliersState & SuppliersActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      suppliers: [],
      filteredSuppliers: [],
      metrics: null,
      currentFilter: {},
      searchTerm: '',
      isLoading: false,
      error: null,
      lastUpdated: null,
      cacheExpiration: DEFAULT_CACHE_TIME,

      // Definir fornecedores
      setSuppliers: (suppliers: Supplier[]) => {
        set({
          suppliers,
          lastUpdated: Date.now()
        });
        
        // Aplicar filtros e calcular métricas
        const { applyFilters, calculateMetrics } = get();
        applyFilters();
        calculateMetrics();
      },

      // Adicionar fornecedor
      addSupplier: (supplier: Supplier) => {
        set(state => ({
          suppliers: [...state.suppliers, supplier],
          lastUpdated: Date.now()
        }));
        
        const { applyFilters, calculateMetrics } = get();
        applyFilters();
        calculateMetrics();
      },

      // Atualizar fornecedor
      updateSupplier: (id: string, updates: Partial<Supplier>) => {
        set(state => ({
          suppliers: state.suppliers.map(supplier =>
            supplier.id === id
              ? { ...supplier, ...updates, updatedAt: new Date() }
              : supplier
          ),
          lastUpdated: Date.now()
        }));
        
        const { applyFilters, calculateMetrics } = get();
        applyFilters();
        calculateMetrics();
      },

      // Remover fornecedor
      removeSupplier: (id: string) => {
        set(state => ({
          suppliers: state.suppliers.filter(supplier => supplier.id !== id),
          lastUpdated: Date.now()
        }));
        
        const { applyFilters, calculateMetrics } = get();
        applyFilters();
        calculateMetrics();
      },

      // Definir filtro
      setFilter: (filter: Partial<SupplierFilter>) => {
        set(state => ({
          currentFilter: { ...state.currentFilter, ...filter }
        }));
        
        // Aplicar filtros automaticamente
        get().applyFilters();
      },

      // Limpar filtros
      clearFilters: () => {
        set({ currentFilter: {}, searchTerm: '' });
        get().applyFilters();
      },

      // Definir termo de busca
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      // Aplicar filtros
      applyFilters: () => {
        const { suppliers, currentFilter, searchTerm } = get();
        let filtered = [...suppliers];

        // Busca por texto
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(supplier =>
            supplier.name.toLowerCase().includes(term) ||
            supplier.location.city.toLowerCase().includes(term) ||
            supplier.location.state.toLowerCase().includes(term) ||
            supplier.businessInfo.segment.toLowerCase().includes(term) ||
            supplier.products.categories.some(cat => cat.toLowerCase().includes(term))
          );
        }

        // Filtros específicos
        if (currentFilter.states?.length) {
          filtered = filtered.filter(s => 
            currentFilter.states!.includes(s.location.state)
          );
        }

        if (currentFilter.cities?.length) {
          filtered = filtered.filter(s => 
            currentFilter.cities!.includes(s.location.city)
          );
        }

        if (currentFilter.verified !== undefined) {
          filtered = filtered.filter(s => s.verified === currentFilter.verified);
        }

        if (currentFilter.featured !== undefined) {
          filtered = filtered.filter(s => s.featured === currentFilter.featured);
        }

        if (currentFilter.rating) {
          filtered = filtered.filter(s => s.rating.overall >= currentFilter.rating!);
        }

        if (currentFilter.requiresCNPJ !== undefined) {
          filtered = filtered.filter(s => 
            s.businessInfo.requiresCNPJ === currentFilter.requiresCNPJ
          );
        }

        if (currentFilter.categories?.length) {
          filtered = filtered.filter(s =>
            currentFilter.categories!.some(cat =>
              s.products.categories.includes(cat)
            )
          );
        }

        if (currentFilter.minOrderValue !== undefined) {
          filtered = filtered.filter(s =>
            s.businessInfo.minOrderValue >= currentFilter.minOrderValue!
          );
        }

        if (currentFilter.maxOrderValue !== undefined) {
          filtered = filtered.filter(s =>
            s.businessInfo.minOrderValue <= currentFilter.maxOrderValue!
          );
        }

        set({ filteredSuppliers: filtered });
      },

      // Calcular métricas
      calculateMetrics: () => {
        const { suppliers } = get();
        
        if (!suppliers.length) {
          set({ metrics: null });
          return;
        }

        const totalSuppliers = suppliers.length;
        const verifiedSuppliers = suppliers.filter(s => s.verified).length;
        const averageRating = suppliers.reduce((sum, s) => sum + s.rating.overall, 0) / totalSuppliers;

        // Contar por estado
        const stateCount: Record<string, number> = {};
        suppliers.forEach(s => {
          stateCount[s.location.state] = (stateCount[s.location.state] || 0) + 1;
        });

        const topStates = Object.entries(stateCount)
          .map(([state, count]) => ({
            state,
            count,
            percentage: (count / totalSuppliers) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Contar por categoria
        const categoryCount: Record<string, number> = {};
        suppliers.forEach(s => {
          s.products.categories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          });
        });

        const topCategories = Object.entries(categoryCount)
          .map(([category, count]) => ({
            category,
            count,
            percentage: (count / totalSuppliers) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const metrics: SupplierMetrics = {
          totalSuppliers,
          verifiedSuppliers,
          averageRating,
          topStates,
          topCategories,
          recentContacts: 0, // TODO: Implementar contagem real
          activePartnerships: suppliers.filter(s => s.status === 'active').length
        };

        set({ metrics });
      },

      // Obter fornecedor por ID
      getSupplierById: (id: string): Supplier | undefined => {
        return get().suppliers.find(s => s.id === id);
      },

      // Obter fornecedores por estado
      getSuppliersByState: (state: string): Supplier[] => {
        return get().suppliers.filter(s => s.location.state === state);
      },

      // Obter fornecedores por cidade
      getSuppliersByCity: (city: string): Supplier[] => {
        return get().suppliers.filter(s => s.location.city === city);
      },

      // Obter fornecedores em destaque
      getFeaturedSuppliers: (limit: number = 6): Supplier[] => {
        return get().suppliers
          .filter(s => s.featured)
          .slice(0, limit);
      },

      // Obter fornecedores verificados
      getVerifiedSuppliers: (): Supplier[] => {
        return get().suppliers.filter(s => s.verified);
      },

      // Verificar se deve fazer refresh
      shouldRefresh: (): boolean => {
        const { lastUpdated, cacheExpiration } = get();
        if (!lastUpdated) return true;
        return Date.now() - lastUpdated > cacheExpiration;
      },

      // Refresh dos dados
      refreshData: async (): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implementar chamada real para API
          // Por enquanto, simular carregamento
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Em produção, seria algo como:
          // const response = await suppliersApi.getAll();
          // get().setSuppliers(response.data);
          
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar fornecedores',
            isLoading: false
          });
        }
      },

      // Importar dados de JSON
      importFromJson: (suppliersData: Supplier[]) => {
        const processedSuppliers = suppliersData.map(supplier => ({
          ...supplier,
          createdAt: new Date(supplier.createdAt),
          updatedAt: new Date(supplier.updatedAt)
        }));

        get().setSuppliers(processedSuppliers);
      },

      // Gerenciar estado
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Limpar cache
      clearCache: () => {
        set({
          suppliers: [],
          filteredSuppliers: [],
          metrics: null,
          lastUpdated: null
        });
      }
    }),
    {
      name: 'viralkids-suppliers-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        suppliers: state.suppliers,
        currentFilter: state.currentFilter,
        lastUpdated: state.lastUpdated,
        cacheExpiration: state.cacheExpiration
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Converter datas de string para Date objects
        if (persistedState.suppliers) {
          persistedState.suppliers = persistedState.suppliers.map((supplier: any) => ({
            ...supplier,
            createdAt: new Date(supplier.createdAt),
            updatedAt: new Date(supplier.updatedAt)
          }));
        }
        return persistedState;
      }
    }
  )
);