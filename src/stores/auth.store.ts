import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipos para autenticação
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'franchisee' | 'supplier' | 'support';
  avatar?: string;
  phone?: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    privacy: {
      shareData: boolean;
      allowAnalytics: boolean;
    };
  };
}

interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthState {
  // Estado de autenticação
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Configurações de sessão
  rememberMe: boolean;
  lastLoginAttempt: Date | null;
  sessionTimeout: number; // em minutos
}

interface AuthActions {
  // Ações principais
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setRememberMe: (rememberMe: boolean) => void;
  
  // Ações de autenticação
  login: (user: User, tokens: AuthTokens, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshTokens: (newTokens: AuthTokens) => void;
  
  // Verificações
  isTokenValid: () => boolean;
  isSessionExpired: () => boolean;
  shouldRefreshToken: () => boolean;
  
  // Utilitários
  hasRole: (role: User['role']) => boolean;
  hasPermission: (permission: string) => boolean;
  getAuthHeader: () => string | null;
  clearSession: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false,
  lastLoginAttempt: null,
  sessionTimeout: 60 * 24, // 24 horas em minutos
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters básicos
      setUser: (user) => set({ user }),
      setTokens: (tokens) => set({ tokens }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setRememberMe: (rememberMe) => set({ rememberMe }),

      // Login completo
      login: (user, tokens, rememberMe = false) => {
        set({
          user: { ...user, lastLogin: new Date() },
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          rememberMe,
          lastLoginAttempt: new Date(),
        });
      },

      // Logout completo
      logout: () => {
        set({
          ...initialState,
          // Manter algumas configurações mesmo após logout
          rememberMe: get().rememberMe,
        });
      },

      // Atualizar dados do usuário
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...userData,
              updatedAt: new Date(),
            },
          });
        }
      },

      // Renovar tokens
      refreshTokens: (newTokens) => {
        set({
          tokens: newTokens,
          error: null,
        });
      },

      // Verificar se token é válido
      isTokenValid: () => {
        const { tokens } = get();
        if (!tokens) return false;
        
        return Date.now() < tokens.expiresAt;
      },

      // Verificar se sessão expirou
      isSessionExpired: () => {
        const { lastLoginAttempt, sessionTimeout } = get();
        if (!lastLoginAttempt) return true;
        
        const sessionExpiry = lastLoginAttempt.getTime() + (sessionTimeout * 60 * 1000);
        return Date.now() > sessionExpiry;
      },

      // Verificar se deve renovar token
      shouldRefreshToken: () => {
        const { tokens } = get();
        if (!tokens) return false;
        
        // Renovar se restam menos de 5 minutos
        const timeLeft = tokens.expiresAt - Date.now();
        return timeLeft < (5 * 60 * 1000);
      },

      // Verificar role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      // Verificar permissão (implementação básica)
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        
        // Admin tem todas as permissões
        if (user.role === 'admin') return true;
        
        // Implementar lógica específica de permissões aqui
        const rolePermissions: Record<string, string[]> = {
          franchisee: ['dashboard:read', 'profile:update', 'tasks:read', 'suppliers:read'],
          supplier: ['profile:update', 'products:manage', 'orders:read'],
          support: ['leads:read', 'leads:update', 'support:manage'],
        };
        
        return rolePermissions[user.role]?.includes(permission) ?? false;
      },

      // Obter header de autorização
      getAuthHeader: () => {
        const { tokens } = get();
        return tokens ? `Bearer ${tokens.token}` : null;
      },

      // Limpar sessão (para casos de erro)
      clearSession: () => {
        set(initialState);
      },
    }),
    {
      name: 'viralkids-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Só persistir dados se rememberMe estiver ativo ou dados essenciais
      partialize: (state) => {
        // Sempre persistir configurações básicas
        const basicData = {
          rememberMe: state.rememberMe,
          sessionTimeout: state.sessionTimeout,
        };

        // Se rememberMe estiver ativo, persistir tudo
        if (state.rememberMe) {
          return {
            ...basicData,
            user: state.user,
            tokens: state.tokens,
            isAuthenticated: state.isAuthenticated,
            lastLoginAttempt: state.lastLoginAttempt,
          };
        }

        // Se não, apenas dados de sessão temporária
        if (state.isAuthenticated && state.tokens && !state.shouldRefreshToken()) {
          return {
            ...basicData,
            user: state.user,
            tokens: state.tokens,
            isAuthenticated: state.isAuthenticated,
            lastLoginAttempt: state.lastLoginAttempt,
          };
        }

        return basicData;
      },
      version: 1,
    }
  )
);
