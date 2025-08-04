// Export all stores
export { useCartStore } from './cart.store';
export { useFiltersStore } from './filters.store';
export { useUserPreferencesStore } from './user-preferences.store';
export { useProductsStore } from './products.store';
export { useAuthStore } from './auth.store';
export { useChatbotStore } from './chatbot.store';
export { useAdminStore } from './admin.store';

// Helper hook to reset all stores (útil para logout)
import { useCartStore } from './cart.store';
import { useFiltersStore } from './filters.store';
import { useUserPreferencesStore } from './user-preferences.store';
import { useChatbotStore } from './chatbot.store';
import { useAdminStore } from './admin.store';
import { useAuthStore } from './additional/auth.store';

export const useResetAllStores = () => {
  const clearCart = useCartStore(state => state.clearCart);
  const resetFilters = useFiltersStore(state => state.resetFilters);
  const resetPreferences = useUserPreferencesStore(state => state.resetPreferences);
  const logoutAuth = useAuthStore(state => state.logout);
  const clearChatbot = useChatbotStore(state => state.endSession);
  const clearAdminCache = useAdminStore(state => state.clearCache);
  
  return () => {
    clearCart();
    resetFilters();
    resetPreferences();
    logoutAuth();
    clearChatbot();
    clearAdminCache();
    // Products store não reseta para manter cache
  };
};

// Helper para verificar se stores estão carregadas (útil para SSR)
export const useStoresLoaded = () => {
  // No Zustand com persist, as stores são carregadas de forma assíncrona
  // Este hook pode ser útil para aguardar o carregamento completo
  return true; // Por enquanto sempre true, mas pode ser expandido
};

// Helper para limpar apenas dados sensíveis (mantém preferências)
export const useClearSensitiveData = () => {
  const clearCart = useCartStore(state => state.clearCart);
  const logoutAuth = useAuthStore(state => state.logout);
  const clearChatbot = useChatbotStore(state => state.endSession);
  
  return () => {
    clearCart();
    logoutAuth();
    clearChatbot();
    // Mantém preferências do usuário, filtros e cache de produtos
  };
};
