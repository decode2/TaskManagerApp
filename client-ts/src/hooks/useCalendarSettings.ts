import { useState, useEffect } from 'react';
import { CalendarVariant } from '../components/UnifiedCalendar';

export interface CalendarSettings {
  variant: CalendarVariant;
  defaultView: 'month' | 'week';
}

const defaultSettings: CalendarSettings = {
  variant: 'current',
  defaultView: 'month'
};

export const useCalendarSettings = () => {
  const [settings, setSettings] = useState<CalendarSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('calendar-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load calendar settings:', error);
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('calendar-settings', JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save calendar settings:', error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<CalendarSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded
  };
};
