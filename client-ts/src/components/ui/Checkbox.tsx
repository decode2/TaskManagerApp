import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      animated = true,
      indeterminate = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    const content = (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={`${sizeClasses[size]} text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 ${className}`}
              {...props}
            />
            {animated && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: props.checked || indeterminate ? 1 : 0,
                  opacity: props.checked || indeterminate ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {indeterminate ? (
                  <svg
                    className={`${iconSizes[size]} text-white`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className={`${iconSizes[size]} text-white`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              htmlFor={checkboxId}
              className={`font-medium ${
                error
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {label}
            </label>
            {helperText && !error && (
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {helperText}
              </p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 mt-1"
              >
                {error}
              </motion.p>
            )}
          </div>
        )}
      </div>
    );

    return content;
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
