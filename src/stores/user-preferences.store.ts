import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en' | 'es';
  currency: 'BRL' | 'USD' | 'EUR';
  viewMode: 'grid' | 'list';
  productsPerPage: 12 | 24 | 48;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
    personalizedAds: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

interface UserPreferencesState {
  preferences: UserPreferences;
}

interface UserPreferencesActions {
  updatePreference: <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => void;
  updateNestedPreference: <
    K extends keyof UserPreferences,
    NK extends keyof UserPreferences[K]
  >(
    category: K,
    key: NK,
    value: UserPreferences[K][NK]
  ) => void;
  resetPreferences: () => void;
  exportPreferences: () => UserPreferences;
  importPreferences: (preferences: Partial<UserPreferences>) => void;
}

type UserPreferencesStore = UserPreferencesState & UserPreferencesActions;

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt',
  currency: 'BRL',
  viewMode: 'grid',
  productsPerPage: 24,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  privacy: {
    analytics: true,
    marketing: false,
    personalizedAds: false,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
  },
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      preferences: defaultPreferences,

      // Ações
      updatePreference: <K extends keyof UserPreferences>(
        key: K, 
        value: UserPreferences[K]
      ) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value
          }
        }));
      },

      updateNestedPreference: <
        K extends keyof UserPreferences,
        NK extends keyof UserPreferences[K]
      >(
        category: K,
        key: NK,
        value: UserPreferences[K][NK]
      ) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [category]: {
              ...state.preferences[category],
              [key]: value
            }
          }
        }));
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      exportPreferences: () => {
        return get().preferences;
      },

      importPreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences
          }
        }));
      },
    }),
    {
      name: 'viralkids-user-preferences-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
