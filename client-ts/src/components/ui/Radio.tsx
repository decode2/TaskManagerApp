import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      animated = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const dotSizes = {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3'
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
              id={radioId}
              type="radio"
              className={`${sizeClasses[size]} text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 ${className}`}
              {...props}
            />
            {animated && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: props.checked ? 1 : 0,
                  opacity: props.checked ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div
                  className={`${dotSizes[size]} bg-blue-600 rounded-full`}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              htmlFor={radioId}
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

Radio.displayName = 'Radio';

export default Radio;
