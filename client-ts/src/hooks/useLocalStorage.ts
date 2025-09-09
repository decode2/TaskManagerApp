import { useState, useEffect, useCallback } from 'react';

export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
}

/**
 * Custom hook for managing localStorage with React state synchronization
 * 
 * @param key - The localStorage key
 * @param options - Configuration options
 * @returns Array with [value, setValue, removeValue]
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * 
 * // With custom serializer
 * const [user, setUser] = useLocalStorage('user', null, {
 *   serializer: {
 *     parse: JSON.parse,
 *     stringify: JSON.stringify
 *   }
 * });
 * 
 * // With default value
 * const [settings, setSettings] = useLocalStorage('settings', {
 *   notifications: true,
 *   language: 'en'
 * });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [T | null, (value: T | null) => void, () => void] {
  const { defaultValue = null, serializer = JSON } = options;

  // Get initial value from localStorage or use default
  const getInitialValue = useCallback((): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return serializer.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer]);

  const [storedValue, setStoredValue] = useState<T | null>(getInitialValue);

  // Update localStorage when state changes
  const setValue = useCallback((value: T | null) => {
    try {
      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serializer.stringify(value));
      }
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serializer]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Listen for changes to this localStorage key from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          const newValue = e.newValue === null ? defaultValue : serializer.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, serializer]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing localStorage with automatic JSON serialization
 * 
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Array with [value, setValue, removeValue]
 * 
 * @example
 * ```tsx
 * const [user, setUser] = useLocalStorageJson('user', null);
 * const [settings, setSettings] = useLocalStorageJson('settings', { theme: 'light' });
 * ```
 */
export function useLocalStorageJson<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] {
  return useLocalStorage(key, {
    defaultValue,
    serializer: JSON,
  }) as [T, (value: T) => void, () => void];
}

/**
 * Hook for managing localStorage with string values
 * 
 * @param key - The localStorage key
 * @param defaultValue - Default string value
 * @returns Array with [value, setValue, removeValue]
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorageString('theme', 'light');
 * const [language, setLanguage] = useLocalStorageString('language', 'en');
 * ```
 */
export function useLocalStorageString(
  key: string,
  defaultValue: string
): [string, (value: string) => void, () => void] {
  return useLocalStorage(key, {
    defaultValue,
    serializer: {
      parse: (value: string) => value,
      stringify: (value: string) => value,
    },
  }) as [string, (value: string) => void, () => void];
}
