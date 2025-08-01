import { useState, useEffect, useCallback } from 'react';
import { Supplier, SupplierFilter, SupplierMetrics } from '../types';
import { getAllSuppliersData } from '../data/suppliersData';

interface UseSuppliersOptions {
  autoLoad?: boolean;
}

interface SuppliersState {
  suppliers: Supplier[];
  filteredSuppliers: Supplier[];
  loading: boolean;
  error: string | null;
  metrics: SupplierMetrics | null;
  currentFilter: SupplierFilter;
}

const STORAGE_KEY = 'viralkids_suppliers';

export const useSuppliers = ({ autoLoad = true }: UseSuppliersOptions = {}) => {
  const [state, setState] = useState<SuppliersState>({
    suppliers: [],
    filteredSuppliers: [],
    loading: false,
    error: null,
    metrics: null,
    currentFilter: {}
  });

  // Carregar fornecedores do localStorage ou importar JSONs
  useEffect(() => {
    if (autoLoad) {
      loadSuppliersFromJson();
    }
  }, [autoLoad]);

  // Aplicar filtros sempre que mudarem
  useEffect(() => {
    applyFilters();
  }, [state.suppliers, state.currentFilter]);

  const loadSuppliersFromJson = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    console.log('loadSuppliersFromJson');
    
    try {
      // Carregar dados do localStorage primeiro
      const savedSuppliers = localStorage.getItem(STORAGE_KEY);
      const allSuppliers: Supplier[] = savedSuppliers ? JSON.parse(savedSuppliers) : [];

      // Se já temos dados salvos, usar eles
      if (allSuppliers.length > 0) {
        setState(prev => ({
          ...prev,
          suppliers: allSuppliers,
          loading: false,
          metrics: calculateMetrics(allSuppliers)
        }));
        return;
      }

      // Carregar dados dos arquivos JSON
      console.log('Carregando dados dos arquivos JSON...');
      const suppliersData = getAllSuppliersData();
      console.log(`${suppliersData.length} fornecedores carregados`);
      
      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliersData));
      
      setState(prev => ({
        ...prev,
        suppliers: suppliersData,
        loading: false,
        metrics: calculateMetrics(suppliersData)
      }));
      
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar fornecedores',
        loading: false
      }));
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...state.suppliers || []];
    
    if (state.currentFilter.states?.length) {
      filtered = filtered.filter(s => 
        state.currentFilter.states!.includes(s.location.state)
      );
    }
    
    if (state.currentFilter.cities?.length) {
      filtered = filtered.filter(s => 
        state.currentFilter.cities!.includes(s.location.city)
      );
    }
    
    if (state.currentFilter.verified !== undefined) {
      filtered = filtered.filter(s => s.verified === state.currentFilter.verified);
    }
    
    if (state.currentFilter.featured !== undefined) {
      filtered = filtered.filter(s => s.featured === state.currentFilter.featured);
    }
    
    if (state.currentFilter.rating) {
      filtered = filtered.filter(s => s.rating.overall >= state.currentFilter.rating!);
    }
    
    if (state.currentFilter.requiresCNPJ !== undefined) {
      filtered = filtered.filter(s => 
        s.businessInfo.requiresCNPJ === state.currentFilter.requiresCNPJ
      );
    }
    
    setState(prev => ({ ...prev, filteredSuppliers: filtered }));
  }, [state.suppliers, state.currentFilter]);

  const calculateMetrics = (suppliers: Supplier[]): SupplierMetrics => {
    const totalSuppliers = suppliers?.length;
    const verifiedSuppliers = suppliers?.filter(s => s.verified).length;
    const averageRating = suppliers?.reduce((sum, s) => sum + s.rating.overall, 0) / totalSuppliers;
    
    // Contar por estado
    const stateCount: Record<string, number> = {};
    suppliers?.forEach(s => {
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
    
    return {
      totalSuppliers,
      verifiedSuppliers,
      averageRating,
      topStates,
      topCategories: [],
      recentContacts: 0,
      activePartnerships: 0
    };
  };

  const setFilter = useCallback((filter: Partial<SupplierFilter>) => {
    setState(prev => ({
      ...prev,
      currentFilter: { ...prev.currentFilter, ...filter }
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, currentFilter: {} }));
  }, []);

  const refreshSuppliers = useCallback(() => {
    loadSuppliersFromJson();
  }, [loadSuppliersFromJson]);

  const getSupplierById = useCallback((id: string): Supplier | undefined => {
    return state.suppliers?.find(s => s.id === id);
  }, [state.suppliers]);

  const getSuppliersByState = useCallback((currentState: string): Supplier[] => {
    return state.suppliers?.filter(s => s.location.state === currentState);
  }, [state.suppliers]);

  const getFeaturedSuppliers = useCallback((): Supplier[] => {
    return state.suppliers?.filter(s => s.featured).slice(0, 6);
  }, [state.suppliers]);

  return {
    // Estado
    suppliers: state.filteredSuppliers,
    allSuppliers: state.suppliers,
    loading: state.loading,
    error: state.error,
    metrics: state.metrics,
    currentFilter: state.currentFilter,
    
    // Ações
    setFilter,
    clearFilters,
    refreshSuppliers,
    
    // Utilitários
    getSupplierById,
    getSuppliersByState,
    getFeaturedSuppliers
  };
};
