import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NavigationState {
  // Produto selecionado
  selectedProductId: string | null;
  
  // Histórico de navegação
  visitedProducts: string[];
  
  // Breadcrumbs dinâmicos
  breadcrumbs: Array<{
    label: string;
    path: string;
    isActive?: boolean;
  }>;
  
  // Estado da busca
  lastSearchTerm: string;
  lastSearchResults: any[];
  
  // Filtros aplicados na última busca
  lastAppliedFilters: Record<string, any>;
  
  // Páginas visitadas recentemente
  recentPages: Array<{
    path: string;
    title: string;
    timestamp: number;
  }>;
  
  // Modal/sidebar states
  isCartSidebarOpen: boolean;
  isFiltersSidebarOpen: boolean;
  isChatbotOpen: boolean;
}

interface NavigationActions {
  // Produto selecionado
  setSelectedProductId: (productId: string | null) => void;
  getSelectedProductId: () => string | null;
  clearSelectedProduct: () => void;
  
  // Histórico de produtos
  addToVisitedProducts: (productId: string) => void;
  getVisitedProducts: () => string[];
  clearVisitedProducts: () => void;
  
  // Breadcrumbs
  setBreadcrumbs: (breadcrumbs: NavigationState['breadcrumbs']) => void;
  addBreadcrumb: (breadcrumb: NavigationState['breadcrumbs'][0]) => void;
  clearBreadcrumbs: () => void;
  
  // Busca
  setLastSearch: (term: string, results: any[], filters: Record<string, any>) => void;
  getLastSearch: () => {
    term: string;
    results: any[];
    filters: Record<string, any>;
  };
  clearLastSearch: () => void;
  
  // Páginas recentes
  addRecentPage: (path: string, title: string) => void;
  getRecentPages: (limit?: number) => NavigationState['recentPages'];
  clearRecentPages: () => void;
  
  // Modal/sidebar controls
  setCartSidebarOpen: (open: boolean) => void;
  setFiltersSidebarOpen: (open: boolean) => void;
  setChatbotOpen: (open: boolean) => void;
  toggleCartSidebar: () => void;
  toggleFiltersSidebar: () => void;
  toggleChatbot: () => void;
  closeAllSidebars: () => void;
  
  // Utilitários
  resetNavigation: () => void;
  cleanupOldData: () => void;
}

type NavigationStore = NavigationState & NavigationActions;

// Constantes
const MAX_VISITED_PRODUCTS = 20;
const MAX_RECENT_PAGES = 10;
const CLEANUP_AFTER_DAYS = 30;

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      selectedProductId: null,
      visitedProducts: [],
      breadcrumbs: [],
      lastSearchTerm: '',
      lastSearchResults: [],
      lastAppliedFilters: {},
      recentPages: [],
      isCartSidebarOpen: false,
      isFiltersSidebarOpen: false,
      isChatbotOpen: false,

      // Produto selecionado
      setSelectedProductId: (productId: string | null) => {
        set({ selectedProductId: productId });
        
        // Adicionar ao histórico se não for null
        if (productId) {
          get().addToVisitedProducts(productId);
        }
      },

      getSelectedProductId: () => {
        return get().selectedProductId;
      },

      clearSelectedProduct: () => {
        set({ selectedProductId: null });
      },

      // Histórico de produtos visitados
      addToVisitedProducts: (productId: string) => {
        set(state => {
          const visited = [...state.visitedProducts];
          
          // Remove se já existe para colocar no início
          const existingIndex = visited.indexOf(productId);
          if (existingIndex > -1) {
            visited.splice(existingIndex, 1);
          }
          
          // Adiciona no início
          visited.unshift(productId);
          
          // Mantém apenas os últimos N produtos
          if (visited.length > MAX_VISITED_PRODUCTS) {
            visited.splice(MAX_VISITED_PRODUCTS);
          }
          
          return { visitedProducts: visited };
        });
      },

      getVisitedProducts: () => {
        return get().visitedProducts;
      },

      clearVisitedProducts: () => {
        set({ visitedProducts: [] });
      },

      // Breadcrumbs
      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },

      addBreadcrumb: (breadcrumb) => {
        set(state => ({
          breadcrumbs: [...state.breadcrumbs, breadcrumb]
        }));
      },

      clearBreadcrumbs: () => {
        set({ breadcrumbs: [] });
      },

      // Busca
      setLastSearch: (term: string, results: any[], filters: Record<string, any>) => {
        set({
          lastSearchTerm: term,
          lastSearchResults: results,
          lastAppliedFilters: filters
        });
      },

      getLastSearch: () => {
        const { lastSearchTerm, lastSearchResults, lastAppliedFilters } = get();
        return {
          term: lastSearchTerm,
          results: lastSearchResults,
          filters: lastAppliedFilters
        };
      },

      clearLastSearch: () => {
        set({
          lastSearchTerm: '',
          lastSearchResults: [],
          lastAppliedFilters: {}
        });
      },

      // Páginas recentes
      addRecentPage: (path: string, title: string) => {
        set(state => {
          const pages = [...state.recentPages];
          
          // Remove se já existe
          const existingIndex = pages.findIndex(p => p.path === path);
          if (existingIndex > -1) {
            pages.splice(existingIndex, 1);
          }
          
          // Adiciona no início
          pages.unshift({
            path,
            title,
            timestamp: Date.now()
          });
          
          // Mantém apenas as últimas N páginas
          if (pages.length > MAX_RECENT_PAGES) {
            pages.splice(MAX_RECENT_PAGES);
          }
          
          return { recentPages: pages };
        });
      },

      getRecentPages: (limit: number = 10) => {
        const { recentPages } = get();
        return recentPages.slice(0, limit);
      },

      clearRecentPages: () => {
        set({ recentPages: [] });
      },

      // Modal/sidebar controls
      setCartSidebarOpen: (open: boolean) => {
        set({ isCartSidebarOpen: open });
      },

      setFiltersSidebarOpen: (open: boolean) => {
        set({ isFiltersSidebarOpen: open });
      },

      setChatbotOpen: (open: boolean) => {
        set({ isChatbotOpen: open });
      },

      toggleCartSidebar: () => {
        set(state => ({ isCartSidebarOpen: !state.isCartSidebarOpen }));
      },

      toggleFiltersSidebar: () => {
        set(state => ({ isFiltersSidebarOpen: !state.isFiltersSidebarOpen }));
      },

      toggleChatbot: () => {
        set(state => ({ isChatbotOpen: !state.isChatbotOpen }));
      },

      closeAllSidebars: () => {
        set({
          isCartSidebarOpen: false,
          isFiltersSidebarOpen: false,
          isChatbotOpen: false
        });
      },

      // Reset completo
      resetNavigation: () => {
        set({
          selectedProductId: null,
          visitedProducts: [],
          breadcrumbs: [],
          lastSearchTerm: '',
          lastSearchResults: [],
          lastAppliedFilters: {},
          recentPages: [],
          isCartSidebarOpen: false,
          isFiltersSidebarOpen: false,
          isChatbotOpen: false
        });
      },

      // Limpeza de dados antigos
      cleanupOldData: () => {
        const cutoffTime = Date.now() - (CLEANUP_AFTER_DAYS * 24 * 60 * 60 * 1000);
        
        set(state => ({
          recentPages: state.recentPages.filter(page => page.timestamp > cutoffTime)
        }));
      }
    }),
    {
      name: 'viralkids-navigation-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedProductId: state.selectedProductId,
        visitedProducts: state.visitedProducts,
        lastSearchTerm: state.lastSearchTerm,
        lastAppliedFilters: state.lastAppliedFilters,
        recentPages: state.recentPages,
        isCartSidebarOpen: state.isCartSidebarOpen,
        isFiltersSidebarOpen: state.isFiltersSidebarOpen,
        isChatbotOpen: state.isChatbotOpen
      }),
      version: 1,
      // Executar limpeza automaticamente ao carregar
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Navigation store rehydration complete');
          // Executar limpeza de dados antigos
          state.cleanupOldData();
        }
      }
    }
  )
);

// Hook customizado para facilitar uso
export const useNavigation = () => {
  const store = useNavigationStore();

  return {
    // Estado
    selectedProductId: store.selectedProductId,
    visitedProducts: store.visitedProducts,
    breadcrumbs: store.breadcrumbs,
    lastSearch: store.getLastSearch(),
    lastSearchResults: store.lastSearchResults,
    lastAppliedFilters: store.lastAppliedFilters,
    recentPages: store.getRecentPages(),
    isCartSidebarOpen: store.isCartSidebarOpen,
    isFiltersSidebarOpen: store.isFiltersSidebarOpen,
    isChatbotOpen: store.isChatbotOpen,

    // Ações para produtos
    selectProduct: store.setSelectedProductId,
    clearSelectedProduct: store.clearSelectedProduct,
    getSelectedProduct: store.getSelectedProductId,

    // Ações para histórico
    addToHistory: store.addToVisitedProducts,
    clearHistory: store.clearVisitedProducts,

    // Ações para breadcrumbs
    setBreadcrumbs: store.setBreadcrumbs,
    addBreadcrumb: store.addBreadcrumb,
    clearBreadcrumbs: store.clearBreadcrumbs,

    // Ações para busca
    saveSearch: store.setLastSearch,
    clearSearch: store.clearLastSearch,

    // Ações para páginas
    addPage: store.addRecentPage,
    clearPages: store.clearRecentPages,

    // Controles de UI
    openCartSidebar: () => store.setCartSidebarOpen(true),
    closeCartSidebar: () => store.setCartSidebarOpen(false),
    toggleCartSidebar: store.toggleCartSidebar,

    openFiltersSidebar: () => store.setFiltersSidebarOpen(true),
    closeFiltersSidebar: () => store.setFiltersSidebarOpen(false),
    toggleFiltersSidebar: store.toggleFiltersSidebar,

    openChatbot: () => store.setChatbotOpen(true),
    closeChatbot: () => store.setChatbotOpen(false),
    setChatbotOpen: store.setChatbotOpen,
    toggleChatbot: store.toggleChatbot,

    closeAllSidebars: store.closeAllSidebars,

    // Utilitários
    reset: store.resetNavigation,
    cleanup: store.cleanupOldData
  };
};