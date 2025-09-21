import React, { useState, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Task, TaskPriority, TaskCategory } from '../types/Task';
import useDarkMode from '../hooks/useDarkMode';

interface CompactCalendarTwoColumnProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

const CompactCalendarTwoColumn: React.FC<CompactCalendarTwoColumnProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.date), date)
    );
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Low: return 'bg-green-500';
      case TaskPriority.Medium: return 'bg-yellow-500';
      case TaskPriority.High: return 'bg-orange-500';
      case TaskPriority.Urgent: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: TaskCategory): string => {
    switch (category) {
      case TaskCategory.Personal: return '👤';
      case TaskCategory.Work: return '💼';
      case TaskCategory.Health: return '🏥';
      case TaskCategory.Education: return '📚';
      case TaskCategory.Finance: return '💰';
      case TaskCategory.Shopping: return '🛒';
      case TaskCategory.Travel: return '✈️';
      default: return '📋';
    }
  };

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header compartido */}
      <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
        {/* Navegación */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToToday}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Today
          </button>
          
          <button
            onClick={goToNextMonth}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Título del mes */}
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>

        {/* Contador de tareas */}
        <div className={`text-sm ${
          isDark ? 'text-slate-400' : 'text-gray-500'
        }`}>
          {tasks.length} tasks
        </div>
      </div>

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1: Calendario */}
        <div className={`rounded-xl overflow-hidden ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        } shadow-sm`}>
          <div className="p-3 border-b border-slate-700 dark:border-gray-200">
            <h4 className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              📅 Calendar
            </h4>
          </div>
          
          {/* Días de la semana */}
          <div className={`grid grid-cols-7 border-b ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          }`}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center text-xs font-medium ${
                  isDark ? 'text-slate-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`relative p-2 min-h-[50px] text-sm transition-colors ${
                    isSelected
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isCurrentDay
                      ? isDark
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                      : isDark
                      ? 'hover:bg-slate-700 text-slate-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`font-medium ${isCurrentDay || isSelected ? 'font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Indicadores de tareas */}
                  {dayTasks.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority)}`}
                        />
                      ))}
                      {dayTasks.length > 2 && (
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          +{dayTasks.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna 2: Lista de tareas */}
        <div className={`rounded-xl overflow-hidden ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        } shadow-sm`}>
          <div className="p-3 border-b border-slate-700 dark:border-gray-200">
            <h4 className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              📋 Tasks {selectedDate ? `- ${format(selectedDate, 'MMM d, yyyy')}` : ''}
            </h4>
          </div>
          
          <div className="p-3 max-h-[400px] overflow-y-auto">
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-2">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskSelect?.(task)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isDark 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          {getCategoryIcon(task.category)} {TaskCategory[task.category]} • {format(new Date(task.date), 'h:mm a')}
                        </div>
                      </div>
                      <div className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {task.isCompleted ? '✅' : '⏳'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {selectedDate 
                  ? `No tasks for ${format(selectedDate, 'MMM d, yyyy')}`
                  : 'Select a date to view tasks'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactCalendarTwoColumn;
