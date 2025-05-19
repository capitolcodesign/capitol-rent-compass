
import { useEffect } from 'react';
import { initializeTheme } from '@/components/admin/theme/ThemeSettingsService';

export const useThemeInitializer = () => {
  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme().catch(error => {
      console.error('Failed to initialize theme:', error);
    });
  }, []);
};
