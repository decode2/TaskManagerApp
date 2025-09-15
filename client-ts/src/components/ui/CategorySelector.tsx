import React, { useState, useRef, useEffect } from 'react';
import { TaskCategory } from '../../types/Task';
import CategoryBadge from './CategoryBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface CategorySelectorProps {
  value: TaskCategory;
  onChange: (category: TaskCategory) => void;
  label?: string;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  label = "Category",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    TaskCategory.Personal,
    TaskCategory.Work,
    TaskCategory.Health,
    TaskCategory.Education,
    TaskCategory.Finance,
    TaskCategory.Shopping,
    TaskCategory.Travel,
    TaskCategory.Other
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (category: TaskCategory) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {/* Selected Value Display */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-all duration-200
          bg-white dark:bg-slate-700/50 border-gray-300 dark:border-slate-600/50 
          text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <CategoryBadge category={value} variant="minimal" animated={false} />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 dark:text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200/50 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800/50"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                type="button"
                onClick={() => handleSelect(category)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors duration-150
                  hover:bg-gray-50 dark:hover:bg-slate-700/70
                  ${value === category ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ x: 4 }}
              >
                <CategoryBadge category={category} variant="minimal" animated={false} />
                {value === category && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-blue-500 dark:text-blue-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySelector;
