import { useCallback } from 'react';
import { useUserPreferencesStore } from '@/stores/user-preferences.store';

export const useUserPreferences = () => {
  // Usar as ações e estado da store
  const preferences = useUserPreferencesStore(state => state.preferences);
  const updatePreference = useUserPreferencesStore(state => state.updatePreference);
  const updateNestedPreference = useUserPreferencesStore(state => state.updateNestedPreference);
  const resetPreferences = useUserPreferencesStore(state => state.resetPreferences);
  const exportPreferences = useUserPreferencesStore(state => state.exportPreferences);
  const importPreferences = useUserPreferencesStore(state => state.importPreferences);

  // Helpers específicos
  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    updatePreference('theme', theme);
  }, [updatePreference]);

  const setLanguage = useCallback((language: 'pt' | 'en' | 'es') => {
    updatePreference('language', language);
  }, [updatePreference]);

  const setCurrency = useCallback((currency: 'BRL' | 'USD' | 'EUR') => {
    updatePreference('currency', currency);
  }, [updatePreference]);

  const setViewMode = useCallback((viewMode: 'grid' | 'list') => {
    updatePreference('viewMode', viewMode);
  }, [updatePreference]);

  const setProductsPerPage = useCallback((count: 12 | 24 | 48) => {
    updatePreference('productsPerPage', count);
  }, [updatePreference]);

  const toggleNotification = useCallback((type: 'email' | 'push' | 'sms') => {
    updateNestedPreference('notifications', type, !preferences.notifications[type]);
  }, [updateNestedPreference, preferences.notifications]);

  const togglePrivacySetting = useCallback((setting: 'analytics' | 'marketing' | 'personalizedAds') => {
    updateNestedPreference('privacy', setting, !preferences.privacy[setting]);
  }, [updateNestedPreference, preferences.privacy]);

  const setAccessibility = useCallback((setting: 'fontSize' | 'highContrast' | 'reduceMotion', value: any) => {
    updateNestedPreference('accessibility', setting, value);
  }, [updateNestedPreference]);

  return {
    preferences,
    updatePreference,
    updateNestedPreference,
    resetPreferences,
    exportPreferences,
    importPreferences,
    setTheme,
    setLanguage,
    setCurrency,
    setViewMode,
    setProductsPerPage,
    toggleNotification,
    togglePrivacySetting,
    setAccessibility,
  };
};
