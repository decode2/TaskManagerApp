import { useState, useMemo, useCallback } from "react";
import Calendar from "react-calendar";
import { Task, TaskPriority } from "../types/Task";
import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import useDarkMode from "../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";
import CalendarNavigation from "./CalendarNavigation";

interface ModernCalendarViewProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
  className?: string;
}

const ModernCalendarView: React.FC<ModernCalendarViewProps> = ({
  tasks,
  onDateSelect,
  selectedDate,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // Memoized task data for performance
  const taskData = useMemo(() => {
    const taskMap = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      const dateKey = format(new Date(task.date), 'yyyy-MM-dd');
      if (!taskMap.has(dateKey)) {
        taskMap.set(dateKey, []);
      }
      taskMap.get(dateKey)!.push(task);
    });
    
    return taskMap;
  }, [tasks]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date): Task[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return taskData.get(dateKey) || [];
  }, [taskData]);

  // Get priority color for visual indicators
  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Low: return 'bg-green-500';
      case TaskPriority.Medium: return 'bg-yellow-500';
      case TaskPriority.High: return 'bg-orange-500';
      case TaskPriority.Urgent: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Custom tile content with enhanced visual indicators
  const tileContent = ({ date, view: calendarView }: { date: Date; view: string }) => {
    if (calendarView !== 'month') return null;
    
    const dayTasks = getTasksForDate(date);
    const isCurrentDate = isToday(date);
    const hasTasks = dayTasks.length > 0;
    
    // Get unique priorities for this day
    const priorities = Array.from(new Set(dayTasks.map(task => task.priority)));
    const completedCount = dayTasks.filter(task => task.isCompleted).length;
    const totalCount = dayTasks.length;
    
    return (
      <motion.div 
        className="flex flex-col items-center space-y-1 mt-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Priority indicators */}
        {hasTasks && (
          <div className="flex space-x-1">
            {priorities.slice(0, 3).map((priority, index) => (
              <motion.div
                key={priority}
                className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
              />
            ))}
            {priorities.length > 3 && (
              <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center">
                <span className="text-[8px] text-white">+</span>
              </div>
            )}
          </div>
        )}
        
        {/* Task count */}
        {hasTasks && (
          <motion.div
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              isDark 
                ? 'bg-slate-700/50 text-slate-200' 
                : 'bg-slate-100 text-slate-700'
            }`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {completedCount}/{totalCount}
          </motion.div>
        )}
        
        {/* Today indicator */}
        {isCurrentDate && (
          <motion.div
            className="w-1 h-1 rounded-full bg-blue-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          />
        )}
      </motion.div>
    );
  };

  // Custom tile classes for enhanced styling
  const tileClassName = ({ date, view: calendarView }: { date: Date; view: string }) => {
    if (calendarView !== 'month') return '';
    
    const dayTasks = getTasksForDate(date);
    const isCurrentDate = isToday(date);
    const hasTasks = dayTasks.length > 0;
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    
    const baseClasses = "relative min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-start p-2 transition-all duration-200 cursor-pointer touch-manipulation";
    
    const stateClasses = isSelected 
      ? 'bg-blue-600 text-white shadow-lg scale-105' 
      : hasTasks 
        ? isDark 
          ? 'hover:bg-slate-700/50 hover:scale-102' 
          : 'hover:bg-slate-100 hover:scale-102'
        : isDark 
          ? 'hover:bg-slate-700/30' 
          : 'hover:bg-gray-50';
    
    const todayClasses = isCurrentDate && !isSelected 
      ? isDark 
        ? 'bg-blue-900/30 border border-blue-500/50' 
        : 'bg-blue-50 border border-blue-200'
      : '';
    
    return `${baseClasses} ${stateClasses} ${todayClasses}`;
  };

  // Handle date selection
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setCurrentDate(value);
      onDateSelect?.(value);
    }
  };

  // Handle navigation date change
  const handleNavigationDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Handle today click
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect?.(today);
  };

  // Custom weekday formatter
  const formatShortWeekday = (locale: string | undefined, date: Date) => {
    return format(date, "EEE", { locale: es });
  };

  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Navigation */}
      <CalendarNavigation
        currentDate={currentDate}
        onDateChange={handleNavigationDateChange}
        onTodayClick={handleTodayClick}
        className="mb-6"
      />

      {/* View Toggle and Legend */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setView(view === 'month' ? 'week' : 'month')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'month'
                ? isDark 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : isDark 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {view === 'month' ? 'Vista Mes' : 'Vista Semana'}
          </motion.button>
          
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Baja</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Media</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Alta</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Urgente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Component */}
      <motion.div
        className="relative"
        key={view} // Force re-render when view changes
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Calendar
          onChange={handleDateChange}
          value={currentDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          formatShortWeekday={formatShortWeekday}
          calendarType="iso8601"
          next2Label={null}
          prev2Label={null}
          prevLabel={null}
          nextLabel={null}
          showNeighboringMonth={false}
          className={`modern-calendar ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-200'
          } rounded-xl shadow-lg border p-4`}
          locale="es"
        />
      </motion.div>

      {/* Selected Date Tasks Preview */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <div className={`p-4 rounded-lg border ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>📅</span>
                Tareas para {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: es })}
              </h3>
              
              <div className="space-y-2">
                {getTasksForDate(selectedDate).length === 0 ? (
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No hay tareas programadas para este día
                  </p>
                ) : (
                  getTasksForDate(selectedDate).map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-white'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className={`text-sm ${task.isCompleted ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </span>
                      {task.isCompleted && <span className="text-green-500 text-xs">✓</span>}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModernCalendarView;
