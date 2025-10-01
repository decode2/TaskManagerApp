import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, addWeeks, subWeeks, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import useDarkMode from '../hooks/useDarkMode';
import { Task, TaskPriority } from '../types/Task';

export type CalendarView = 'month' | 'week';
export type CalendarVariant = 'current' | 'collapsible';

interface UnifiedCalendarProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
  variant?: CalendarVariant;
  defaultView?: CalendarView;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  tasks: Task[];
}

const UnifiedCalendar: React.FC<UnifiedCalendarProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = "",
  variant = 'current',
  defaultView = 'month'
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<CalendarView>(defaultView);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task =>
      isSameDay(new Date(task.date), date)
    );
  }, [tasks]);

  // Monthly view data
  const calendarDays = useMemo(() => {
    if (view !== 'month') return [];
    
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
  }, [currentDate, selectedDate, getTasksForDate, view]);

  // Weekly view data
  const weekDays = useMemo(() => {
    if (view !== 'week') return [];
    
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate, view]);

  const goToPrevious = () => {
    if (view === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else {
      setCurrentDate(prev => subWeeks(prev, 1));
    }
  };

  const goToNext = () => {
    if (view === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else {
      setCurrentDate(prev => addWeeks(prev, 1));
    }
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

  const handleWeekDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const toggleView = () => {
    setView(prev => prev === 'month' ? 'week' : 'month');
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

  const renderMonthDay = (day: CalendarDay) => (
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

  const renderWeekDay = (date: Date, index: number) => {
    const dayTasks = getTasksForDate(date);
    const isCurrentDay = isToday(date);
    const isSelectedDay = selectedDate ? isSameDay(date, selectedDate) : false;

    return (
      <div key={index} className={`p-3 border-r last:border-r-0 min-h-[200px] ${
        isDark ? 'border-slate-700' : 'border-gray-200'
      } ${isCurrentDay ? isDark ? 'bg-blue-900/20' : 'bg-blue-50' : ''}`}>
        <div className="text-center mb-3">
          <div className={`text-xs font-semibold mb-1 ${
            isCurrentDay ? 'text-blue-500' : isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            {format(date, 'EEE')}
          </div>
          <motion.button
            className={`text-lg font-bold rounded-lg w-8 h-8 flex items-center justify-center ${
              isCurrentDay ? 'text-blue-500' : isDark ? 'text-white' : 'text-gray-900'
            } ${isSelectedDay ? isDark ? 'bg-slate-700 ring-2 ring-blue-500' : 'bg-gray-100 ring-2 ring-blue-500' : ''}`}
            onClick={() => handleWeekDateClick(date)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {format(date, 'd')}
          </motion.button>
        </div>
        <div className="space-y-2">
          {dayTasks.length > 0 ? (
            dayTasks.slice(0, 3).map(renderTask)
          ) : (
            <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              No tasks
            </p>
          )}
          {dayTasks.length > 3 && (
            <p className={`text-xs text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              +{dayTasks.length - 3} more
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const isCollapsible = variant === 'collapsible';

    return (
      <div className={`mb-6 p-3 sm:p-4 rounded-xl ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
        {/* Top row - Navigation and Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <motion.button
              onClick={goToPrevious}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={view === 'month' ? "Mes anterior" : "Semana anterior"}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={goToToday}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium bg-blue-600 text-white text-xs sm:text-sm"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] } }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Today
            </motion.button>

            <motion.button
              onClick={goToNext}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={view === 'month' ? "Mes siguiente" : "Semana siguiente"}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          <div className="flex-1 flex items-center justify-center min-w-0">
            <div
              className={`text-sm sm:text-lg font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-center truncate ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            >
              {view === 'month' 
                ? format(currentDate, 'MMM yyyy')
                : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd, yyyy')}`
              }
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* View Toggle Button */}
            <motion.button
              onClick={toggleView}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {view === 'month' ? (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs sm:text-sm hidden sm:inline">Week</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-xs sm:text-sm hidden sm:inline">Month</span>
                </div>
              )}
            </motion.button>

            {/* Collapse Button */}
            {isCollapsible && (
              <motion.button
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isHeaderCollapsed ? "Expandir" : "Colapsar"}
              >
                <motion.svg
                  animate={{ rotate: isHeaderCollapsed ? 180 : 0 }}
                  className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* Priority Legend */}
        <AnimatePresence>
          {(!isCollapsible || !isHeaderCollapsed) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${
                isDark ? 'border-slate-600' : 'border-gray-200'
              }`}>
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Priorities:</span>
                {[
                  { priority: TaskPriority.Low, label: 'Low', color: '#10b981' },
                  { priority: TaskPriority.Medium, label: 'Medium', color: '#f59e0b' },
                  { priority: TaskPriority.High, label: 'High', color: '#f97316' },
                  { priority: TaskPriority.Urgent, label: 'Urgent', color: '#ef4444' }
                ].map((item) => (
                  <div key={item.priority} className="flex items-center gap-1 sm:gap-2">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderCalendarContent = () => {
    if (view === 'month') {
      return (
        <div className={`rounded-xl overflow-hidden ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        } shadow-sm`}>
          {/* Days of week */}
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

          {/* Calendar days */}
          <div className={`grid grid-cols-7 gap-1 p-1 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-b-lg border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <AnimatePresence>
              {calendarDays.map(renderMonthDay)}
            </AnimatePresence>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`rounded-xl overflow-hidden ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        } shadow-sm`}>
          {/* Days of week */}
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

          {/* Tasks by day */}
          <div className="grid grid-cols-7">
            {weekDays.map(renderWeekDay)}
          </div>
        </div>
      );
    }
  };

  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;

    return (
      <motion.div
        className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-xl ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        } shadow-sm`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className={`text-xs sm:text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Tasks for {format(selectedDate, 'MMM dd, yyyy')}
        </h3>
        {getTasksForDate(selectedDate).length > 0 ? (
          <div className="space-y-1">
            {getTasksForDate(selectedDate).map((task) => (
              <motion.div
                key={task.id}
                className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg cursor-pointer ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onTaskSelect?.(task)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
                <span className={`text-xs ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                  {task.title}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            No tasks for this day
          </p>
        )}
      </motion.div>
    );
  };


  return (
    <motion.div
      className={`unified-calendar ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {renderHeader()}
      {renderCalendarContent()}
      {renderSelectedDateDetails()}
    </motion.div>
  );
};

export default UnifiedCalendar;
