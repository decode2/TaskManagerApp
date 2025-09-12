import React from 'react';
import { TaskCategory, TaskCategoryLabelMap, TaskCategoryColorMap } from '../../types/Task';

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'md', 
  showIcon = true 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getIcon = () => {
    switch (category) {
      case TaskCategory.Personal:
        return '👤';
      case TaskCategory.Work:
        return '💼';
      case TaskCategory.Health:
        return '🏥';
      case TaskCategory.Education:
        return '📚';
      case TaskCategory.Finance:
        return '💰';
      case TaskCategory.Shopping:
        return '🛒';
      case TaskCategory.Travel:
        return '✈️';
      case TaskCategory.Other:
        return '📋';
      default:
        return '';
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${getSizeClasses()}
        ${TaskCategoryColorMap[category]}
      `}
    >
      {showIcon && (
        <span className="text-xs">
          {getIcon()}
        </span>
      )}
      {TaskCategoryLabelMap[category]}
    </span>
  );
};

export default CategoryBadge;
