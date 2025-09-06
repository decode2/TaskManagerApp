import { useEffect, useState, useCallback } from 'react';

// Global theme state to share between components
let globalThemeState: boolean;
let themeListeners: Set<(theme: boolean) => void> = new Set();

const useDarkMode = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const getInitialTheme = (): boolean => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Initialize global state if not set
  if (globalThemeState === undefined) {
    globalThemeState = getInitialTheme();
  }

  const [isDark, setIsDark] = useState<boolean>(globalThemeState);

  const setTheme = useCallback((newTheme: boolean | ((prev: boolean) => boolean)) => {
    const actualTheme = typeof newTheme === 'function' ? newTheme(globalThemeState) : newTheme;
    
    // Update global state
    globalThemeState = actualTheme;
    
    // Update local state
    setIsDark(actualTheme);
    
    // Notify all listeners
    themeListeners.forEach(listener => listener(actualTheme));
    
    // Update DOM and localStorage
    const root = document.documentElement;
    if (actualTheme) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  useEffect(() => {
    // Add this component as a listener
    const listener = (theme: boolean) => {
      setIsDark(theme);
    };
    themeListeners.add(listener);

    return () => {
      themeListeners.delete(listener);
    };
  }, []);

  // Listen for theme changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue === 'dark';
        setTheme(newTheme);
      }
    };

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [setTheme]);

  return [isDark, setTheme];
};

export default useDarkMode;
