import { useCallback, useEffect, useMemo } from 'react';
import { useSuppliersStore } from '@/stores/suppliers.store';
import { Supplier, SupplierFilter, SupplierMetrics } from '../types';
import { getAllSuppliersData } from '../data/suppliersData';

interface UseSuppliersOptions {
  autoLoad?: boolean;
}

export const useSuppliers = ({ autoLoad = true }: UseSuppliersOptions = {}) => {
  // Estado da store - usando seletores simples para evitar loops
  const allSuppliers = useSuppliersStore(state => state.suppliers);
  const loading = useSuppliersStore(state => state.isLoading);
  const error = useSuppliersStore(state => state.error);
  const metrics = useSuppliersStore(state => state.metrics);
  const currentFilter = useSuppliersStore(state => state.currentFilter);
  
  // Cachear valores derivados para evitar re-renders desnecessários
  const suppliers = useMemo(() => useSuppliersStore.getState().filteredSuppliers, [allSuppliers, currentFilter]);
  
  // Ações da store
  const setSuppliers = useSuppliersStore(state => state.setSuppliers);
  const setFilter = useSuppliersStore(state => state.setFilter);
  const clearFilters = useSuppliersStore(state => state.clearFilters);
  const refreshData = useSuppliersStore(state => state.refreshData);
  const importFromJson = useSuppliersStore(state => state.importFromJson);
  const shouldRefresh = useSuppliersStore(state => state.shouldRefresh);
  const getSupplierById = useSuppliersStore(state => state.getSupplierById);
  const getSuppliersByState = useSuppliersStore(state => state.getSuppliersByState);
  const getFeaturedSuppliers = useSuppliersStore(state => state.getFeaturedSuppliers);

  const loadSuppliersFromJson = useCallback(async () => {
    if (allSuppliers.length > 0 && !shouldRefresh()) { return; }
    try {
      const suppliersData = getAllSuppliersData();
      importFromJson(suppliersData);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  }, [allSuppliers.length, shouldRefresh, importFromJson]);

  useEffect(() => {
    if (autoLoad) { loadSuppliersFromJson(); }
  }, [autoLoad, loadSuppliersFromJson]);

  return {
    suppliers, allSuppliers, loading, error, metrics, currentFilter,
    setFilter, clearFilters, refreshSuppliers: refreshData, getSupplierById, getSuppliersByState, getFeaturedSuppliers
  };
};
