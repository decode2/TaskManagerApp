import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const getInitialTheme = (): boolean => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;

    // Fallback: check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
};

export default useDarkMode;
