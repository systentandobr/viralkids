// Teste simples das stores para verificar compatibilidade
import { useCartStore } from './cart.store';
import { useFiltersStore } from './filters.store';
import { useProductsStore } from './products.store';
import { useUserPreferencesStore } from './user-preferences.store';

// Função de teste simples
export const testStores = () => {
  console.log('Testando stores...');
  
  // Testar se as stores podem ser acessadas
  try {
    const cartState = useCartStore.getState();
    const filtersState = useFiltersStore.getState();
    const productsState = useProductsStore.getState();
    const preferencesState = useUserPreferencesStore.getState();
    
    console.log('Stores carregadas com sucesso:', {
      cart: !!cartState,
      filters: !!filtersState,
      products: !!productsState,
      preferences: !!preferencesState,
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao carregar stores:', error);
    return false;
  }
};
