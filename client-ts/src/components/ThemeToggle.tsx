import useDarkMode from "../hooks/useDarkMode";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="absolute top-4 right-4 px-4 py-2 text-sm border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {isDark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
