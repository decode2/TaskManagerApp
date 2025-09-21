import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, isSameDay, isToday, addDays } from 'date-fns';
import useDarkMode from '../hooks/useDarkMode';
import { Task, TaskPriority } from '../types/Task';

interface CompactCalendarCurrentWeeklyProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

const CompactCalendarCurrentWeekly: React.FC<CompactCalendarCurrentWeeklyProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task =>
      isSameDay(new Date(task.date), date)
    );
  }, [tasks]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentWeek]);

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(today);
    setSelectedDate(today);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    const colors = {
      [TaskPriority.Low]: '#10b981',
      [TaskPriority.Medium]: '#f59e0b',
      [TaskPriority.High]: '#f97316',
      [TaskPriority.Urgent]: '#ef4444',
    };
    return colors[priority] || colors[TaskPriority.Medium];
  };

  const renderTask = (task: Task) => (
    <motion.div
      key={task.id}
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
        isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={() => onTaskSelect?.(task)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: getPriorityColor(task.priority) }}
      />
      <span className={`text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {task.title}
      </span>
    </motion.div>
  );

  return (
    <motion.div
      className={`compact-calendar-current-weekly ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Elegante con Navegación Semanal */}
      <div className={`mb-6 p-4 rounded-xl ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              onClick={goToPreviousWeek}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Semana anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              onClick={goToToday}
              className="px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>
            
            <motion.button
              onClick={goToNextWeek}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Semana siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Priorities:</span>
            {[
              { priority: TaskPriority.Low, label: 'Low', color: '#10b981' },
              { priority: TaskPriority.Medium, label: 'Medium', color: '#f59e0b' },
              { priority: TaskPriority.High, label: 'High', color: '#f97316' },
              { priority: TaskPriority.Urgent, label: 'Urgent', color: '#ef4444' }
            ].map((item) => (
              <div key={item.priority} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vista Semanal con Diseño Elegante */}
      <div className={`rounded-xl overflow-hidden ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
        {/* Días de la semana */}
        <div className={`grid grid-cols-7 border-b ${
          isDark ? 'border-slate-700' : 'border-gray-200'
        }`}>
          {weekDays.map((day, index) => {
            const isCurrentDay = isToday(day);
            
            return (
              <div key={index} className={`p-3 text-center border-r last:border-r-0 ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <div className={`text-xs font-semibold mb-1 ${
                  isCurrentDay ? 'text-blue-500' : isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-bold ${
                  isCurrentDay ? 'text-blue-500' : isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tareas por día */}
        <div className="grid grid-cols-7">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div key={index} className={`p-3 border-r last:border-r-0 min-h-[200px] ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              } ${isCurrentDay ? isDark ? 'bg-blue-900/20' : 'bg-blue-50' : ''}`}>
                <div className="space-y-2">
                  {dayTasks.length > 0 ? (
                    dayTasks.map(renderTask)
                  ) : (
                    <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default CompactCalendarCurrentWeekly;
