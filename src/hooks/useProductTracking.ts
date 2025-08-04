import { useEffect } from 'react';
import { useNavigation } from '../stores/additional/navigation.store';

interface UseProductTrackingProps {
  productId: string;
  productName: string;
  currentPath: string;
}

export const useProductTracking = ({ 
  productId, 
  productName, 
  currentPath 
}: UseProductTrackingProps) => {
  const { 
    addToHistory, 
    addPage, 
    setBreadcrumbs,
    saveSearch 
  } = useNavigation();

  // Rastrear visualização do produto
  useEffect(() => {
    if (productId) {
      // Adicionar ao histórico de produtos visitados
      addToHistory(productId);
      
      // Adicionar página ao histórico de navegação
      addPage(currentPath, productName);
      
      // Configurar breadcrumbs dinâmicos
      setBreadcrumbs([
        { label: 'Home', path: '/', isActive: false },
        { label: 'Produtos', path: '/produtos', isActive: false },
        { label: productName, path: currentPath, isActive: true }
      ]);
    }
  }, [productId, productName, currentPath, addToHistory, addPage, setBreadcrumbs]);

  // Função para salvar busca relacionada
  const saveRelatedSearch = (searchTerm: string, results: any[], filters: Record<string, any>) => {
    saveSearch(searchTerm, results, filters);
  };

  return {
    saveRelatedSearch
  };
}; 