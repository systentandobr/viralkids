import { useEffect, useCallback, useState } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useFiltersStore } from '@/stores/filters.store';
import { useUserPreferencesStore } from '@/stores/user-preferences.store';
import { useProductsStore } from '@/stores/products.store';
import { useAuthStore } from '@/stores/auth.store';
import { useChatbotStore } from '@/stores/chatbot.store';
import { useAdminStore } from '@/stores/admin.store';

interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
  details: {
    cart: boolean;
    auth: boolean;
    chatbot: boolean;
    admin: boolean;
    preferences: boolean;
    filters: boolean;
    products: boolean;
  };
}

// Chaves antigas do localStorage que precisam ser migradas
const LEGACY_KEYS = {
  // Carrinho (já migrado)
  CART: 'viralkids_cart',
  
  // Autenticação
  TOKEN: 'viralkids_auth_token',
  REFRESH_TOKEN: 'viralkids_refresh_token',
  USER: 'viralkids_user_data',
  REMEMBER_ME: 'viralkids_remember_me',
  
  // Chatbot e Leads
  LEAD: 'viralkids_lead',
  CHATBOT_STATE: 'viralkids_chatbot_state',
  
  // Admin Dashboard
  ADMIN_LEADS: 'viralkids_admin_leads',
  ADMIN_DASHBOARD: 'viralkids_admin_dashboard',
  
  // Outras configurações
  FILTERS: 'viralkids_filters', 
  PREFERENCES: 'viralkids_preferences',
  PRODUCTS: 'viralkids_products',
  THEME: 'viralkids_theme',
  VIEW_MODE: 'viralkids_view_mode',
};

interface UseMigrationReturn {
  migrationStatus: 'pending' | 'completed' | 'error';
  migrateData: () => Promise<MigrationResult>;
  clearLegacyData: () => void;
  hasPendingMigration: () => boolean;
  migrationDetails: MigrationResult['details'] | null;
}

// Verificar se localStorage está disponível
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

export const useMigration = (): UseMigrationReturn => {
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'completed' | 'error'>('completed');
  const [migrationDetails, setMigrationDetails] = useState<MigrationResult['details'] | null>(null);

  // Obter as ações das stores
  const addToCart = useCartStore(state => state.addToCart);
  const updateFilter = useFiltersStore(state => state.updateFilter);
  const importPreferences = useUserPreferencesStore(state => state.importPreferences);
  const setProducts = useProductsStore(state => state.setProducts);
  
  // Novas stores
  const authLogin = useAuthStore(state => state.login);
  const authSetTokens = useAuthStore(state => state.setTokens);
  const authSetUser = useAuthStore(state => state.setUser);
  const authSetRememberMe = useAuthStore(state => state.setRememberMe);
  
  const chatbotImportLeads = useChatbotStore(state => state.importLeads);
  
  const adminSetLeads = useAdminStore(state => state.setLeads);
  const adminSetDashboard = useAdminStore(state => state.setDashboard);

  // Verificar se há dados para migrar
  const hasPendingMigration = useCallback((): boolean => {
    if (!isLocalStorageAvailable()) return false;
    
    return Object.values(LEGACY_KEYS).some(key => {
      try {
        return localStorage.getItem(key) !== null;
      } catch {
        return false;
      }
    });
  }, []);

  // Migrar dados do localStorage antigo
  const migrateData = useCallback(async (): Promise<MigrationResult> => {
    const result: MigrationResult = {
      success: true,
      migratedKeys: [],
      errors: [],
      details: {
        cart: false,
        auth: false,
        chatbot: false,
        admin: false,
        preferences: false,
        filters: false,
        products: false,
      }
    };

    if (!isLocalStorageAvailable()) {
      result.errors.push('localStorage não disponível');
      result.success = false;
      return result;
    }

    try {
      // 1. Migrar carrinho
      const cartData = localStorage.getItem(LEGACY_KEYS.CART);
      if (cartData) {
        try {
          const parsedCart = JSON.parse(cartData);
          if (Array.isArray(parsedCart)) {
            parsedCart.forEach(item => {
              if (item.product && typeof item.quantity === 'number') {
                addToCart(item.product, item.quantity, {
                  color: item.selectedColor,
                  size: item.selectedSize
                });
              }
            });
          }
          result.migratedKeys.push(LEGACY_KEYS.CART);
          result.details.cart = true;
        } catch (error) {
          result.errors.push(`Erro ao migrar carrinho: ${error}`);
        }
      }

      // 2. Migrar autenticação
      const token = localStorage.getItem(LEGACY_KEYS.TOKEN);
      const refreshToken = localStorage.getItem(LEGACY_KEYS.REFRESH_TOKEN);
      const userData = localStorage.getItem(LEGACY_KEYS.USER);
      const rememberMe = localStorage.getItem(LEGACY_KEYS.REMEMBER_ME) === 'true';

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const tokens = {
            token,
            refreshToken: refreshToken || '',
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24h
          };

          // Migrar para nova store de auth
          authLogin(user, tokens, rememberMe);
          
          result.migratedKeys.push(LEGACY_KEYS.TOKEN, LEGACY_KEYS.USER);
          if (refreshToken) result.migratedKeys.push(LEGACY_KEYS.REFRESH_TOKEN);
          if (rememberMe) result.migratedKeys.push(LEGACY_KEYS.REMEMBER_ME);
          result.details.auth = true;
        } catch (error) {
          result.errors.push(`Erro ao migrar autenticação: ${error}`);
        }
      }

      // 3. Migrar chatbot/leads
      const leadData = localStorage.getItem(LEGACY_KEYS.LEAD);
      if (leadData) {
        try {
          const lead = JSON.parse(leadData);
          if (lead && lead.email) {
            chatbotImportLeads([lead]);
          }
          result.migratedKeys.push(LEGACY_KEYS.LEAD);
          result.details.chatbot = true;
        } catch (error) {
          result.errors.push(`Erro ao migrar leads do chatbot: ${error}`);
        }
      }

      // 4. Migrar admin dashboard
      const adminLeadsData = localStorage.getItem(LEGACY_KEYS.ADMIN_LEADS);
      const adminDashboardData = localStorage.getItem(LEGACY_KEYS.ADMIN_DASHBOARD);
      
      if (adminLeadsData) {
        try {
          const leads = JSON.parse(adminLeadsData);
          if (Array.isArray(leads)) {
            // Converter datas string para Date objects
            const convertedLeads = leads.map(lead => ({
              ...lead,
              createdAt: new Date(lead.createdAt),
              updatedAt: new Date(lead.updatedAt),
            }));
            adminSetLeads(convertedLeads);
          }
          result.migratedKeys.push(LEGACY_KEYS.ADMIN_LEADS);
          result.details.admin = true;
        } catch (error) {
          result.errors.push(`Erro ao migrar leads admin: ${error}`);
        }
      }

      if (adminDashboardData) {
        try {
          const dashboard = JSON.parse(adminDashboardData);
          // Converter datas se necessário
          if (dashboard.recentActivity) {
            dashboard.recentActivity = dashboard.recentActivity.map((activity: any) => ({
              ...activity,
              timestamp: new Date(activity.timestamp),
            }));
          }
          adminSetDashboard(dashboard);
          result.migratedKeys.push(LEGACY_KEYS.ADMIN_DASHBOARD);
        } catch (error) {
          result.errors.push(`Erro ao migrar dashboard admin: ${error}`);
        }
      }

      // 5. Migrar tema e preferências
      const themeData = localStorage.getItem(LEGACY_KEYS.THEME);
      const viewModeData = localStorage.getItem(LEGACY_KEYS.VIEW_MODE);
      const preferencesData = localStorage.getItem(LEGACY_KEYS.PREFERENCES);

      if (themeData && ['light', 'dark', 'system'].includes(themeData)) {
        try {
          importPreferences({ theme: themeData as any });
          result.migratedKeys.push(LEGACY_KEYS.THEME);
          result.details.preferences = true;
        } catch (error) {
          result.errors.push(`Erro ao migrar tema: ${error}`);
        }
      }

      if (viewModeData && ['grid', 'list'].includes(viewModeData)) {
        try {
          importPreferences({ viewMode: viewModeData as any });
          result.migratedKeys.push(LEGACY_KEYS.VIEW_MODE);
        } catch (error) {
          result.errors.push(`Erro ao migrar modo de visualização: ${error}`);
        }
      }

      if (preferencesData) {
        try {
          const parsedPreferences = JSON.parse(preferencesData);
          if (typeof parsedPreferences === 'object' && parsedPreferences !== null) {
            importPreferences(parsedPreferences);
            result.migratedKeys.push(LEGACY_KEYS.PREFERENCES);
            result.details.preferences = true;
          }
        } catch (error) {
          result.errors.push(`Erro ao migrar preferências: ${error}`);
        }
      }

      // 6. Migrar filtros
      const filtersData = localStorage.getItem(LEGACY_KEYS.FILTERS);
      if (filtersData) {
        try {
          const parsedFilters = JSON.parse(filtersData);
          if (typeof parsedFilters === 'object' && parsedFilters !== null) {
            Object.keys(parsedFilters).forEach(key => {
              updateFilter(key as any, parsedFilters[key]);
            });
            result.migratedKeys.push(LEGACY_KEYS.FILTERS);
            result.details.filters = true;
          }
        } catch (error) {
          result.errors.push(`Erro ao migrar filtros: ${error}`);
        }
      }

      // 7. Migrar produtos (cache)
      const productsData = localStorage.getItem(LEGACY_KEYS.PRODUCTS);
      if (productsData) {
        try {
          const parsedProducts = JSON.parse(productsData);
          if (Array.isArray(parsedProducts)) {
            setProducts(parsedProducts);
            result.migratedKeys.push(LEGACY_KEYS.PRODUCTS);
            result.details.products = true;
          }
        } catch (error) {
          result.errors.push(`Erro ao migrar produtos: ${error}`);
        }
      }

      result.success = result.errors.length === 0;
      
      // Log da migração apenas no desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Migração concluída:', result);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Erro geral na migração: ${error}`);
    }

    setMigrationDetails(result.details);
    return result;
  }, [
    addToCart, updateFilter, importPreferences, setProducts,
    authLogin, authSetTokens, authSetUser, authSetRememberMe,
    chatbotImportLeads, adminSetLeads, adminSetDashboard
  ]);

  // Limpar dados antigos após migração bem-sucedida
  const clearLegacyData = useCallback(() => {
    if (!isLocalStorageAvailable()) return;

    Object.values(LEGACY_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Erro ao remover chave legacy ${key}:`, error);
      }
    });
    
    // Marcar migração como concluída
    try {
      localStorage.setItem('viralkids_migration_completed_v2', 'true');
    } catch (error) {
      console.warn('Erro ao marcar migração como concluída:', error);
    }
  }, []);

  // Verificar status inicial apenas no cliente
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setMigrationStatus('completed');
      return;
    }

    const migrationCompleted = localStorage.getItem('viralkids_migration_completed_v2') === 'true';
    const pendingMigration = hasPendingMigration();
    
    if (migrationCompleted) {
      setMigrationStatus('completed');
    } else if (pendingMigration) {
      setMigrationStatus('pending');
    } else {
      setMigrationStatus('completed');
    }
  }, [hasPendingMigration]);

  // Executar migração automaticamente na primeira carga se necessário
  useEffect(() => {
    const autoMigrate = async () => {
      if (migrationStatus === 'pending') {
        console.log('🚀 Iniciando migração automática completa...');
        const result = await migrateData();
        
        if (result.success) {
          clearLegacyData();
          setMigrationStatus('completed');
          console.log('✅ Migração automática concluída com sucesso');
          console.log('📊 Detalhes da migração:', result.details);
        } else {
          setMigrationStatus('error');
          console.warn('⚠️ Migração automática com erros:', result.errors);
        }
      }
    };

    autoMigrate();
  }, [migrationStatus, migrateData, clearLegacyData]);

  return {
    migrationStatus,
    migrateData,
    clearLegacyData,
    hasPendingMigration,
    migrationDetails,
  };
};
