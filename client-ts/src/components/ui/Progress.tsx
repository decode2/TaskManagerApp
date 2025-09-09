import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
  striped?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'default',
      animated = true,
      showLabel = false,
      label,
      striped = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    const variantClasses = {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600',
      info: 'bg-cyan-600'
    };

    const baseClasses = 'w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden';
    const progressClasses = `${sizeClasses[size]} ${variantClasses[variant]} transition-all duration-300 ease-out`;
    
    const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

    const progressBar = (
      <div
        className="h-full bg-current rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      >
        {striped && (
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
        )}
      </div>
    );

    const content = (
      <div ref={ref} className={classes} {...props}>
        <div
          className={progressClasses}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${percentage.toFixed(0)}%`}
        >
          {animated ? (
            <motion.div
              className="h-full bg-current rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {striped && (
                <motion.div
                  className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
          ) : (
            progressBar
          )}
        </div>
        {showLabel && (
          <div className="mt-1 flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>{label || 'Progress'}</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
        )}
      </div>
    );

    return content;
  }
);

Progress.displayName = 'Progress';

// Circular Progress variant
export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
  strokeWidth?: number;
}

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'default',
      animated = true,
      showLabel = false,
      label,
      strokeWidth,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
      xl: 'h-20 w-20'
    };

    const strokeWidths = {
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5
    };

    const strokeWidthValue = strokeWidth || strokeWidths[size];
    const radius = (size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40) - strokeWidthValue;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variantClasses = {
      default: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      danger: 'text-red-600',
      info: 'text-cyan-600'
    };

    const content = (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={sizeClasses[size].split(' ')[0].split('-')[1] === '8' ? '32' : sizeClasses[size].split(' ')[0].split('-')[1] === '12' ? '48' : sizeClasses[size].split(' ')[0].split('-')[1] === '16' ? '64' : '80'}
          height={sizeClasses[size].split(' ')[0].split('-')[1] === '8' ? '32' : sizeClasses[size].split(' ')[0].split('-')[1] === '12' ? '48' : sizeClasses[size].split(' ')[0].split('-')[1] === '16' ? '64' : '80'}
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidthValue}
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidthValue}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={variantClasses[variant]}
            initial={animated ? { strokeDashoffset: circumference } : {}}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {label || `${percentage.toFixed(0)}%`}
            </span>
          </div>
        )}
      </div>
    );

    return content;
  }
);

CircularProgress.displayName = 'CircularProgress';

export default Progress;
