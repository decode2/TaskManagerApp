import React from 'react';
import { TaskPriority, TaskPriorityLabelMap } from '../../types/Task';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'outline' | 'minimal';
  animated?: boolean;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  size = 'md', 
  showIcon = true,
  variant = 'default',
  animated = true
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2.5 text-base';
      default:
        return 'px-3.5 py-1.5 text-sm';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200";
    const animationClasses = animated ? "hover:scale-105 hover:shadow-md" : "";
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} ${animationClasses} border-2 bg-transparent`;
      case 'minimal':
        return `${baseClasses} ${animationClasses} bg-transparent`;
      default:
        return `${baseClasses} ${animationClasses} shadow-sm`;
    }
  };

  const getPriorityStyles = () => {
    switch (priority) {
      case TaskPriority.Low:
        return {
          default: "text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 dark:text-emerald-300 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-700",
          outline: "text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-600",
          minimal: "text-emerald-600 dark:text-emerald-400"
        };
      case TaskPriority.Medium:
        return {
          default: "text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 dark:text-blue-300 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700",
          outline: "text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600",
          minimal: "text-blue-600 dark:text-blue-400"
        };
      case TaskPriority.High:
        return {
          default: "text-amber-700 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 dark:text-amber-300 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-700",
          outline: "text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-600",
          minimal: "text-amber-600 dark:text-amber-400"
        };
      case TaskPriority.Urgent:
        return {
          default: "text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:text-red-300 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700",
          outline: "text-red-600 border-red-300 dark:text-red-400 dark:border-red-600",
          minimal: "text-red-600 dark:text-red-400"
        };
      default:
        return {
          default: "text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:text-gray-300 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-700",
          outline: "text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600",
          minimal: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  const getPriorityIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch (priority) {
      case TaskPriority.Low:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      case TaskPriority.Medium:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V5l12 14-12-14z" />
          </svg>
        );
      case TaskPriority.High:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        );
      case TaskPriority.Urgent:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = getPriorityStyles();
  const currentStyle = styles[variant] || styles.default;

  return (
    <span 
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${currentStyle}
      `}
    >
      {showIcon && (
        <span className="flex items-center justify-center">
          {getPriorityIcon()}
        </span>
      )}
      <span className="font-semibold tracking-wide">
        {TaskPriorityLabelMap[priority]}
      </span>
    </span>
  );
};

export default PriorityBadge;
