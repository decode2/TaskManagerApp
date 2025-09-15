import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  animated?: boolean;
  onChange?: (value: string | number) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      fullWidth = false,
      animated = true,
      value,
      onChange,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | number | undefined>(
      Array.isArray(value) ? value[0] : value
    );
    const selectRef = useRef<HTMLDivElement>(null);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    useClickOutside(() => setIsOpen(false), { enabled: isOpen });

    useEffect(() => {
      setSelectedValue(Array.isArray(value) ? value[0] : value);
    }, [value]);

    const selectedOption = options.find(option => option.value === selectedValue);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      
      setSelectedValue(option.value);
      setIsOpen(false);
      onChange?.(option.value);
    };

    const baseClasses = 'relative block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm cursor-pointer';
    
    const stateClasses = error
      ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500';
    
    const backgroundClasses = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';
    
    const widthClasses = fullWidth ? 'w-full' : '';
    
    const selectClasses = `${baseClasses} ${stateClasses} ${backgroundClasses} ${widthClasses} ${className}`;

    const content = (
      <div className={widthClasses}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            {label}
          </label>
        )}
        <div ref={selectRef} className="relative">
          <motion.button
            type="button"
            className={selectClasses}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className={`block truncate ${!selectedOption ? 'text-slate-500 dark:text-slate-400' : ''}`}>
              {displayValue}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <motion.svg
                className="h-5 w-5 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </span>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200/50 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800/50"
              >
                {options.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 ${
                      option.disabled
                        ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700'
                    } ${
                      option.value === selectedValue
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : ''
                    }`}
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    whileHover={!option.disabled ? { backgroundColor: 'rgba(148, 163, 184, 0.1)' } : {}}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );

    return content;
  }
);

Select.displayName = 'Select';

export default Select;
