import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types/Task';
import useDarkMode from '../hooks/useDarkMode';

interface FilterStatsProps {
  totalTasks: number;
  filteredTasks: number;
  tasks: Task[];
}

const FilterStats: React.FC<FilterStatsProps> = ({ totalTasks, filteredTasks, tasks }) => {
  const [isDark] = useDarkMode();

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const pendingCount = tasks.filter(task => !task.isCompleted).length;
  const archivedCount = tasks.filter(task => task.isArchived).length;

  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        isDark 
          ? 'bg-slate-800/40 border-slate-700/30' 
          : 'bg-white/60 border-slate-200/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Task Statistics
        </h3>
        {filteredTasks !== totalTasks && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {filteredTasks} of {totalTasks} shown
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Tasks */}
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {totalTasks}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Total
          </div>
        </div>

        {/* Completed */}
        <div className="text-center">
          <div className={`text-lg font-semibold text-green-600 dark:text-green-400`}>
            {completedCount}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Completed
          </div>
        </div>

        {/* Pending */}
        <div className="text-center">
          <div className={`text-lg font-semibold text-orange-600 dark:text-orange-400`}>
            {pendingCount}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Pending
          </div>
        </div>

        {/* Archived */}
        <div className="text-center">
          <div className={`text-lg font-semibold text-gray-600 dark:text-gray-400`}>
            {archivedCount}
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Archived
          </div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      {totalTasks > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Completion Rate
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {completionRate}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${
            isDark ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FilterStats;
