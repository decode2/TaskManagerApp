import React from 'react';
import { motion } from 'framer-motion';
import { TaskPriority, TaskCategory } from '../../types/Task';
import useDarkMode from '../../hooks/useDarkMode';

interface FilterChipProps {
  label: string;
  value: string;
  icon?: string;
  color?: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, value, icon, color, onRemove }) => {
  const [isDark] = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        isDark 
          ? 'bg-slate-700/50 border border-slate-600/50 text-white' 
          : 'bg-blue-50 border border-blue-200 text-blue-700'
      }`}
      whileHover={{ scale: 1.05 }}
    >
      {icon && (
        <span className="text-base" style={{ color }}>
          {icon}
        </span>
      )}
      <span>{label}</span>
      <button
        onClick={onRemove}
        className={`ml-1 p-0.5 rounded-full transition-colors duration-200 hover:bg-black/10 ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-blue-500 hover:text-blue-700'
        }`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

interface FilterChipsProps {
  filters: {
    status: string;
    priority: string | number;
    category: string | number;
    search: string;
    dateRange: string;
  };
  onClearFilter: (filterType: string) => void;
  onClearAll: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onClearFilter, onClearAll }) => {
  const [isDark] = useDarkMode();
  
  const getFilterChips = () => {
    const chips = [];

    // Status filter
    if (filters.status !== 'all') {
      const statusLabels = {
        'completed': 'Completed',
        'pending': 'Pending',
        'archived': 'Archived'
      };
      chips.push({
        type: 'status',
        label: statusLabels[filters.status as keyof typeof statusLabels] || filters.status,
        icon: filters.status === 'completed' ? '✅' : 
              filters.status === 'pending' ? '⏳' : 
              filters.status === 'archived' ? '📦' : '📋',
        color: filters.status === 'completed' ? '#22c55e' : 
               filters.status === 'pending' ? '#f59e0b' : '#6b7280'
      });
    }

    // Priority filter
    if (filters.priority !== 'all') {
      const priorityLabels = {
        [TaskPriority.Low]: 'Low Priority',
        [TaskPriority.Medium]: 'Medium Priority',
        [TaskPriority.High]: 'High Priority',
        [TaskPriority.Urgent]: 'Urgent Priority'
      };
      const priorityValue = Number(filters.priority);
      chips.push({
        type: 'priority',
        label: priorityLabels[priorityValue as TaskPriority] || String(filters.priority),
        icon: '🎯',
        color: priorityValue === TaskPriority.Low ? '#22c55e' :
               priorityValue === TaskPriority.Medium ? '#f59e0b' :
               priorityValue === TaskPriority.High ? '#f97316' :
               priorityValue === TaskPriority.Urgent ? '#ef4444' : '#6b7280'
      });
    }

    // Category filter
    if (filters.category !== 'all') {
      const categoryLabels = {
        [TaskCategory.Personal]: 'Personal',
        [TaskCategory.Work]: 'Work',
        [TaskCategory.Health]: 'Health',
        [TaskCategory.Education]: 'Education',
        [TaskCategory.Finance]: 'Finance',
        [TaskCategory.Shopping]: 'Shopping',
        [TaskCategory.Travel]: 'Travel',
        [TaskCategory.Other]: 'Other'
      };
      const categoryIcons = {
        [TaskCategory.Personal]: '👤',
        [TaskCategory.Work]: '💼',
        [TaskCategory.Health]: '🏥',
        [TaskCategory.Education]: '📚',
        [TaskCategory.Finance]: '💰',
        [TaskCategory.Shopping]: '🛒',
        [TaskCategory.Travel]: '✈️',
        [TaskCategory.Other]: '📋'
      };
      const categoryValue = Number(filters.category);
      chips.push({
        type: 'category',
        label: categoryLabels[categoryValue as TaskCategory] || String(filters.category),
        icon: categoryIcons[categoryValue as TaskCategory] || '📂',
        color: '#6366f1'
      });
    }

    // Search filter
    if (filters.search) {
      chips.push({
        type: 'search',
        label: `"${filters.search}"`,
        icon: '🔍',
        color: '#8b5cf6'
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const dateRangeLabels = {
        'today': 'Today',
        'week': 'This Week',
        'month': 'This Month'
      };
      const dateRangeIcons = {
        'today': '🌅',
        'week': '📊',
        'month': '🗓️'
      };
      chips.push({
        type: 'dateRange',
        label: dateRangeLabels[filters.dateRange as keyof typeof dateRangeLabels] || filters.dateRange,
        icon: dateRangeIcons[filters.dateRange as keyof typeof dateRangeIcons] || '📅',
        color: '#06b6d4'
      });
    }

    return chips;
  };

  const activeChips = getFilterChips();

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border ${
        isDark 
          ? 'bg-slate-800/40 border-slate-700/30' 
          : 'bg-blue-50/50 border-blue-200/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Active Filters ({activeChips.length})
        </h4>
        <button
          onClick={onClearAll}
          className={`text-xs font-medium transition-colors duration-200 ${
            isDark 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-red-600 hover:text-red-700'
          }`}
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeChips.map((chip) => (
          <FilterChip
            key={chip.type}
            label={chip.label}
            value={chip.type}
            icon={chip.icon}
            color={chip.color}
            onRemove={() => onClearFilter(chip.type)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FilterChips;
