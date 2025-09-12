import React from 'react';
import { TaskPriority, TaskPriorityLabelMap, TaskPriorityColorMap } from '../../types/Task';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
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
    switch (priority) {
      case TaskPriority.Low:
        return '↓';
      case TaskPriority.Medium:
        return '→';
      case TaskPriority.High:
        return '↑';
      case TaskPriority.Urgent:
        return '⚠';
      default:
        return '';
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${getSizeClasses()}
        ${TaskPriorityColorMap[priority]}
      `}
    >
      {showIcon && (
        <span className="text-xs">
          {getIcon()}
        </span>
      )}
      {TaskPriorityLabelMap[priority]}
    </span>
  );
};

export default PriorityBadge;
