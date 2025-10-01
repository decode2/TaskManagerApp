import { useEffect, useState, useCallback } from 'react';

export type ThemeName = 'linear' | 'apple' | 'obsidian' | 'nord';

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  lightPreview: string;
  darkPreview: string;
  palette: string[]; // representative accent palette for preview swatches
}

export const availableThemes: Theme[] = [
  {
    name: 'linear',
    displayName: 'Linear',
    description: 'Modern and tech-focused, great for developers',
    lightPreview: '#fafbfc',
    darkPreview: '#0d1117',
    palette: ['#5E6AD2', '#1F6FEB', '#2DA44E', '#BF8700', '#D1242F']
  },
  {
    name: 'apple',
    displayName: 'Apple',
    description: 'Elegant and refined, premium feel',
    lightPreview: '#f5f5f7',
    darkPreview: '#000000',
    palette: ['#0A84FF', '#34C759', '#FF9500', '#FF2D55', '#5AC8FA']
  },
  {
    name: 'obsidian',
    displayName: 'Obsidian',
    description: 'Deep contrast and focused, perfect for note-taking',
    lightPreview: '#1f2227',
    darkPreview: '#0b0e12',
    palette: ['#7C3AED', '#22D3EE', '#10B981', '#F59E0B', '#F43F5E']
  },
  {
    name: 'nord',
    displayName: 'Nord',
    description: 'Calm arctic feel with balanced contrast',
    lightPreview: '#ECEFF4',
    darkPreview: '#2E3440',
    palette: ['#88C0D0', '#81A1C1', '#A3BE8C', '#EBCB8B', '#BF616A']
  }
];

// Global theme state (simplified)

export const useTheme = (): {
  currentTheme: ThemeName;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleDarkMode: () => void;
  availableThemes: Theme[];
} => {

  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeName) || 'notion';
  });
  
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const setTheme = useCallback((newTheme: ThemeName) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update DOM classes
    const root = document.documentElement;
    
    // Remove all theme classes
    availableThemes.forEach(t => {
      root.classList.remove(`theme-${t.name}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${newTheme}`);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Update DOM classes
    const root = document.documentElement;
    if (newDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Initialize DOM classes on mount
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    availableThemes.forEach(t => {
      root.classList.remove(`theme-${t.name}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${currentTheme}`);
    
    // Toggle dark mode
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentTheme, isDark]);

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleDarkMode,
    availableThemes
  };
};
