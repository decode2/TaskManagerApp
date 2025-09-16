import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskPriority, TaskCategory } from '../types/Task';
import useDarkMode from '../hooks/useDarkMode';
import { CustomDropdown, FilterChips } from './ui';

export interface FilterState {
  status: 'all' | 'completed' | 'pending' | 'archived';
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  search: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface AdvancedFiltersProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
  initialFilters?: Partial<FilterState>;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  tasks,
  onFilterChange,
  initialFilters = {}
}) => {
  const [isDark] = useDarkMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    dateRange: 'all',
    ...initialFilters
  });

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('taskFilters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved filters:', error);
      }
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskFilters', JSON.stringify(filters));
  }, [filters]);

  // Apply filters whenever filters or tasks change
  useEffect(() => {
    const filtered = applyFilters(tasks, filters);
    onFilterChange(filtered);
  }, [tasks, filters, onFilterChange]);

  const applyFilters = (taskList: Task[], filterState: FilterState): Task[] => {
    return taskList.filter(task => {
      // Status filter
      if (filterState.status === 'completed' && !task.isCompleted) return false;
      if (filterState.status === 'pending' && task.isCompleted) return false;
      if (filterState.status === 'archived' && !task.isArchived) return false;
      if (filterState.status === 'all' && task.isArchived) return false; // Hide archived by default

      // Priority filter
      if (filterState.priority !== 'all' && task.priority !== filterState.priority) return false;

      // Category filter
      if (filterState.category !== 'all' && task.category !== filterState.category) return false;

      // Search filter
      if (filterState.search) {
        const searchLower = filterState.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower) || false;
        const matchesTags = task.tags?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      // Date range filter
      if (filterState.dateRange !== 'all') {
        const taskDate = new Date(task.date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (filterState.dateRange) {
          case 'today':
            if (taskDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            if (taskDate < weekStart || taskDate > weekEnd) return false;
            break;
          case 'month':
            if (taskDate.getMonth() !== now.getMonth() || taskDate.getFullYear() !== now.getFullYear()) return false;
            break;
        }
      }

      return true;
    });
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
      search: '',
      dateRange: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.search) count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: '🎯' },
    { value: TaskPriority.Low, label: 'Low', icon: '🟢' },
    { value: TaskPriority.Medium, label: 'Medium', icon: '🟡' },
    { value: TaskPriority.High, label: 'High', icon: '🟠' },
    { value: TaskPriority.Urgent, label: 'Urgent', icon: '🔴' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: '📂' },
    { value: TaskCategory.Personal, label: 'Personal', icon: '👤' },
    { value: TaskCategory.Work, label: 'Work', icon: '💼' },
    { value: TaskCategory.Health, label: 'Health', icon: '🏥' },
    { value: TaskCategory.Education, label: 'Education', icon: '📚' },
    { value: TaskCategory.Finance, label: 'Finance', icon: '💰' },
    { value: TaskCategory.Shopping, label: 'Shopping', icon: '🛒' },
    { value: TaskCategory.Travel, label: 'Travel', icon: '✈️' },
    { value: TaskCategory.Other, label: 'Other', icon: '📋' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: '📋' },
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'completed', label: 'Completed', icon: '✅' },
    { value: 'archived', label: 'Archived', icon: '📦' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time', icon: '📅' },
    { value: 'today', label: 'Today', icon: '🌅' },
    { value: 'week', label: 'This Week', icon: '📊' },
    { value: 'month', label: 'This Month', icon: '🗓️' }
  ];

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
          isDark 
            ? 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600/50' 
            : 'bg-white/80 border-slate-200/50 hover:bg-white hover:border-slate-300/50'
        } ${activeFiltersCount > 0 ? 'ring-2 ring-blue-500/20' : ''}`}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Advanced Filters
            </span>
          </div>
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full font-medium"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </div>
        
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-5 h-5 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.25, 0.8, 0.25, 1],
              opacity: { duration: 0.15 },
              y: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className={`mt-4 p-4 rounded-xl border ${
              isDark 
                ? 'bg-slate-800/40 border-slate-700/30' 
                : 'bg-white/60 border-slate-200/30'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="lg:col-span-3">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search Tasks
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search by title, description, or tags..."
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Status Filter */}
              <CustomDropdown
                options={statusOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                  icon: option.icon
                }))}
                value={filters.status}
                onChange={(value) => updateFilter('status', value)}
                label="Status"
              />

              {/* Priority Filter */}
              <CustomDropdown
                options={priorityOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                  icon: option.icon,
                  color: option.value === 'all' ? undefined : 
                         option.value === TaskPriority.Low ? '#22c55e' :
                         option.value === TaskPriority.Medium ? '#f59e0b' :
                         option.value === TaskPriority.High ? '#f97316' :
                         option.value === TaskPriority.Urgent ? '#ef4444' : undefined
                }))}
                value={filters.priority}
                onChange={(value) => updateFilter('priority', value)}
                label="Priority"
              />

              {/* Category Filter */}
              <CustomDropdown
                options={categoryOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                  icon: option.icon
                }))}
                value={filters.category}
                onChange={(value) => updateFilter('category', value)}
                label="Category"
                searchable={true}
                maxHeight="180px"
              />

              {/* Date Range Filter */}
              <CustomDropdown
                options={dateRangeOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                  icon: option.icon
                }))}
                value={filters.dateRange}
                onChange={(value) => updateFilter('dateRange', value)}
                label="Date Range"
              />
            </div>

            {/* Active Filter Chips */}
            <div className="mt-4">
              <FilterChips
                filters={filters}
                onClearFilter={(filterType) => {
                  switch (filterType) {
                    case 'status':
                      updateFilter('status', 'all');
                      break;
                    case 'priority':
                      updateFilter('priority', 'all');
                      break;
                    case 'category':
                      updateFilter('category', 'all');
                      break;
                    case 'search':
                      updateFilter('search', '');
                      break;
                    case 'dateRange':
                      updateFilter('dateRange', 'all');
                      break;
                  }
                }}
                onClearAll={clearFilters}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
