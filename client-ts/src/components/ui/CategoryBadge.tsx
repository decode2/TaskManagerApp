import React from 'react';
import { TaskCategory, TaskCategoryLabelMap } from '../../types/Task';

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'outline' | 'minimal';
  animated?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
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
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full font-medium";
    // Removed CSS hover animations to prevent conflict with Framer Motion
    const animationClasses = animated ? "" : "";
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} ${animationClasses} border-2 bg-transparent`;
      case 'minimal':
        return `${baseClasses} ${animationClasses} bg-transparent`;
      default:
        return `${baseClasses} ${animationClasses} shadow-sm font-semibold`;
    }
  };

  const getCategoryStyles = () => {
    switch (category) {
      case TaskCategory.Personal:
        return {
          default: "text-purple-700 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 dark:text-purple-300 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700",
          outline: "text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-600",
          minimal: "text-purple-600 dark:text-purple-400"
        };
      case TaskCategory.Work:
        return {
          default: "text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 dark:text-blue-300 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700",
          outline: "text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600",
          minimal: "text-blue-600 dark:text-blue-400"
        };
      case TaskCategory.Health:
        return {
          default: "text-green-700 bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:text-green-300 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700",
          outline: "text-green-600 border-green-300 dark:text-green-400 dark:border-green-600",
          minimal: "text-green-600 dark:text-green-400"
        };
      case TaskCategory.Education:
        return {
          default: "text-indigo-700 bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200 dark:text-indigo-300 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:border-indigo-700",
          outline: "text-indigo-600 border-indigo-300 dark:text-indigo-400 dark:border-indigo-600",
          minimal: "text-indigo-600 dark:text-indigo-400"
        };
      case TaskCategory.Finance:
        return {
          default: "text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:text-yellow-300 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700",
          outline: "text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600",
          minimal: "text-yellow-600 dark:text-yellow-400"
        };
      case TaskCategory.Shopping:
        return {
          default: "text-pink-700 bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200 dark:text-pink-300 dark:from-pink-900/20 dark:to-pink-800/20 dark:border-pink-700",
          outline: "text-pink-600 border-pink-300 dark:text-pink-400 dark:border-pink-600",
          minimal: "text-pink-600 dark:text-pink-400"
        };
      case TaskCategory.Travel:
        return {
          default: "text-cyan-700 bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200 dark:text-cyan-300 dark:from-cyan-900/20 dark:to-cyan-800/20 dark:border-cyan-700",
          outline: "text-cyan-600 border-cyan-300 dark:text-cyan-400 dark:border-cyan-600",
          minimal: "text-cyan-600 dark:text-cyan-400"
        };
      case TaskCategory.Other:
        return {
          default: "text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:text-gray-300 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-700",
          outline: "text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600",
          minimal: "text-gray-600 dark:text-gray-400"
        };
      default:
        return {
          default: "text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:text-gray-300 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-700",
          outline: "text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600",
          minimal: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  const getCategoryIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch (category) {
      case TaskCategory.Personal:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case TaskCategory.Work:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v2a2 2 0 002 2h4a2 2 0 002-2V6" />
          </svg>
        );
      case TaskCategory.Health:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case TaskCategory.Education:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case TaskCategory.Finance:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case TaskCategory.Shopping:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        );
      case TaskCategory.Travel:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case TaskCategory.Other:
        return (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = getCategoryStyles();
  const currentStyle = styles[variant] || styles.default;

  return (
    <span 
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${currentStyle}
      `}
      style={{
        // Prevent text distortion during animations
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)'
      }}
    >
      {showIcon && (
        <span className="flex items-center justify-center">
          {getCategoryIcon()}
        </span>
      )}
      <span className="font-semibold tracking-wide" style={{ 
        // Additional text rendering optimization
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        {TaskCategoryLabelMap[category]}
      </span>
    </span>
  );
};

export default CategoryBadge;
