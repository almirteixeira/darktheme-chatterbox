
import { useState, useEffect, useCallback } from 'react';

export interface SettingsType {
  aiApiKey: string;
  aiBaseUrl: string;
}

const SETTINGS_STORAGE_KEY = 'themechat-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsType>(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    } else {
      return {
        aiApiKey: '',
        aiBaseUrl: 'https://api.deepseek.com/v1',
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const saveSettings = useCallback((newSettings: Partial<SettingsType>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    saveSettings
  };
};
