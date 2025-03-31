import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const getInitialTheme = (): boolean => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);
  
  // Sync React state with initial class (if user manually toggled theme before)
  useEffect(() => {
    const classDark = document.documentElement.classList.contains("dark");
    setIsDark(classDark);
  }, []);
  

  return [isDark, setIsDark] as const;
};

export default useDarkMode;
