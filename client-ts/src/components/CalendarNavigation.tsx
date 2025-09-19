import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import useDarkMode from "../hooks/useDarkMode";
import { useSwipeGesture } from "../hooks/useSwipeGesture";

interface CalendarNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTodayClick: () => void;
  className?: string;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentDate,
  onDateChange,
  onTodayClick,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);

  // Generate months and years for picker
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));

  // Swipe gestures for mobile
  const { attachSwipeListeners } = useSwipeGesture({
    onSwipeLeft: () => handleNextMonth(),
    onSwipeRight: () => handlePreviousMonth(),
    threshold: 80
  });

  useEffect(() => {
    if (navigationRef.current) {
      attachSwipeListeners(navigationRef.current);
    }
  }, [attachSwipeListeners]);

  const handlePreviousMonth = useCallback(() => {
    const newDate = subMonths(currentDate, 1);
    onDateChange(newDate);
  }, [currentDate, onDateChange]);

  const handleNextMonth = useCallback(() => {
    const newDate = addMonths(currentDate, 1);
    onDateChange(newDate);
  }, [currentDate, onDateChange]);

  const handleMonthYearSelect = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    onDateChange(newDate);
    setShowMonthYearPicker(false);
  };

  const handleTodayClick = useCallback(() => {
    onTodayClick();
    setShowMonthYearPicker(false);
  }, [onTodayClick]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== navigationRef.current) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousMonth();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextMonth();
          break;
        case 'Home':
          e.preventDefault();
          handleTodayClick();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          setShowMonthYearPicker(!showMonthYearPicker);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMonthYearPicker, handlePreviousMonth, handleNextMonth, handleTodayClick]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Navigation */}
      <div 
        ref={navigationRef}
        className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700"
        role="toolbar"
        aria-label="Navegación del calendario"
        tabIndex={0}
      >
        {/* Previous Month Button */}
        <motion.button
          onClick={handlePreviousMonth}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Mes anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Month/Year Display and Today Button */}
        <div className="flex items-center gap-3">
          {/* Today Button */}
          <motion.button
            onClick={handleTodayClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Ir al día de hoy"
          >
            Hoy
          </motion.button>

          {/* Month/Year Selector */}
          <motion.button
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
            className={`px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
              isDark 
                ? 'hover:bg-slate-700 text-white' 
                : 'hover:bg-slate-100 text-slate-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Seleccionar mes y año. Actual: ${format(currentDate, "MMMM yyyy", { locale: es })}`}
            aria-expanded={showMonthYearPicker}
          >
            {format(currentDate, "MMMM yyyy", { locale: es })}
            <svg 
              className={`w-4 h-4 ml-2 inline transition-transform duration-200 ${
                showMonthYearPicker ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>

        {/* Next Month Button */}
        <motion.button
          onClick={handleNextMonth}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Mes siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Month/Year Picker Dropdown */}
      <AnimatePresence>
        {showMonthYearPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-lg shadow-lg border z-50 ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-200'
            }`}
            role="dialog"
            aria-label="Selector de mes y año"
          >
            {/* Years Row */}
            <div className="mb-4">
              <h3 className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Año
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {years.map((year) => (
                  <motion.button
                    key={year}
                    onClick={() => handleMonthYearSelect(currentDate.getMonth(), year)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      year === currentDate.getFullYear()
                        ? isDark 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : isDark 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {year}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Months Row */}
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Mes
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleMonthYearSelect(index, currentDate.getFullYear())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      index === currentDate.getMonth()
                        ? isDark 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : isDark 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {format(month, "MMM", { locale: es })}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleMonthYearSelect(new Date().getMonth(), new Date().getFullYear())}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Mes Actual
                </motion.button>
                <motion.button
                  onClick={() => setShowMonthYearPicker(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-600 hover:bg-slate-500 text-slate-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Indicator (Mobile) */}
      <div className="mt-2 text-center sm:hidden">
        <p className={`text-xs ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Desliza ← → para cambiar de mes
        </p>
      </div>

      {/* Keyboard Shortcuts Hint (Desktop) */}
      <div className="hidden sm:block mt-2 text-center">
        <p className={`text-xs ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Usa ← → para navegar, Home para hoy, Enter para seleccionar
        </p>
      </div>
    </div>
  );
};

export default CalendarNavigation;
