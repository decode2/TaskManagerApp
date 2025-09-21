import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import useDarkMode from '../hooks/useDarkMode';
import { Task, TaskPriority } from '../types/Task';
import { PriorityBadge } from './ui';

interface CompactCalendarCollapsibleTwoColumnProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  tasks: Task[];
}

const CompactCalendarCollapsibleTwoColumn: React.FC<CompactCalendarCollapsibleTwoColumnProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task =>
      isSameDay(new Date(task.date), date)
    );
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return days.map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      isToday: isToday(date),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      tasks: getTasksForDate(date)
    }));
  }, [currentDate, selectedDate, getTasksForDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect?.(day.date);
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

  const renderTaskIndicator = (task: Task) => (
    <div
      key={task.id}
      className="w-full h-1 rounded-full"
      style={{ backgroundColor: getPriorityColor(task.priority) }}
      title={task.title}
    />
  );

  const renderDay = (day: CalendarDay) => (
    <motion.button
      key={day.date.toISOString()}
      className={`
        relative w-full h-16 p-1 text-left transition-all duration-200 flex flex-col items-center justify-center
        ${day.isCurrentMonth
          ? isDark ? 'text-white' : 'text-gray-900'
          : isDark ? 'text-gray-600' : 'text-gray-400'
        }
        ${day.isToday
          ? isDark
            ? 'bg-blue-600 text-white font-semibold'
            : 'bg-blue-500 text-white font-semibold'
          : ''
        }
        ${day.isSelected && !day.isToday
          ? isDark
            ? 'bg-slate-700 ring-2 ring-blue-500'
            : 'bg-gray-100 ring-2 ring-blue-500'
          : ''
        }
        hover:${isDark ? 'bg-slate-700' : 'bg-gray-50'}
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
      onClick={() => handleDateClick(day)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-xs font-medium mb-1">
        {format(day.date, 'd')}
      </div>
      <div className="flex-1 flex flex-col justify-end w-full px-1">
        {day.tasks.slice(0, 2).map(renderTaskIndicator)}
        {day.tasks.length > 2 && (
          <div className={`text-[8px] text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            +{day.tasks.length - 2}
          </div>
        )}
      </div>
    </motion.button>
  );

  return (
    <motion.div
      className={`compact-calendar-collapsible-two-column grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Columna del Calendario */}
      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      } shadow-sm`}>
        {/* Header Colapsable */}
        <div className={`mb-4 p-3 rounded-lg ${
          isDark ? 'bg-slate-700 border border-slate-600' : 'bg-gray-100 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                onClick={goToPreviousMonth}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Mes anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Today
              </motion.button>
              
              <motion.button
                onClick={goToNextMonth}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Mes siguiente"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <motion.div
                className={`text-lg font-semibold px-3 py-1 rounded-lg transition-all duration-200 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {format(currentDate, 'MMMM yyyy')}
              </motion.div>
            </div>

            <motion.button
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isHeaderCollapsed ? "Expandir" : "Colapsar"}
            >
              <motion.svg
                animate={{ rotate: isHeaderCollapsed ? 180 : 0 }}
                className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>
          </div>

          <AnimatePresence>
            {!isHeaderCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className={`flex flex-wrap items-center justify-center gap-3 mt-3 pt-3 border-t ${
                  isDark ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Priorities:</span>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Días de la semana */}
        <div className={`grid grid-cols-7 gap-1 ${isDark ? 'bg-slate-700' : 'bg-gray-50'} rounded-t-lg`}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className={`p-2 text-center text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className={`grid grid-cols-7 gap-1 p-1 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-b-lg border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <AnimatePresence>
            {calendarDays.map(renderDay)}
          </AnimatePresence>
        </div>
      </div>

      {/* Columna de Tareas del Día Seleccionado */}
      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      } shadow-sm`}>
        <div className={`mb-4 p-3 rounded-lg ${
          isDark ? 'bg-slate-700 border border-slate-600' : 'bg-gray-100 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tasks for {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'No date selected'}
          </h3>
        </div>
        
        {selectedDate && getTasksForDate(selectedDate).length > 0 ? (
          <div className="space-y-2">
            {getTasksForDate(selectedDate).map((task) => (
              <motion.div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onTaskSelect?.(task)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
                <div className="flex-1">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                  {task.description && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                <PriorityBadge priority={task.priority} size="sm" variant="minimal" animated={false} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">
              {selectedDate ? 'No tasks for this day' : 'Select a date to view tasks'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompactCalendarCollapsibleTwoColumn;
