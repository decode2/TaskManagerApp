import React, { useState, useMemo } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, isSameDay, isToday, addDays } from 'date-fns';
import { Task, TaskPriority } from '../types/Task';
import useDarkMode from '../hooks/useDarkMode';

interface CompactCalendarWeeklyProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

const CompactCalendarWeekly: React.FC<CompactCalendarWeeklyProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
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

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentWeek]);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });

  return (
    <div className={`w-full ${className}`}>
      {/* Header de semana */}
      <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
        {/* Navegación */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
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
            onClick={goToNextWeek}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Título de la semana */}
        <div className="text-center">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
        </div>

        {/* Leyenda de prioridades compacta */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Urg</span>
          </div>
        </div>
      </div>

      {/* Vista semanal */}
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
                <div className={`text-xs font-medium mb-1 ${
                  isDark ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-semibold ${
                  isCurrentDay
                    ? isDark
                      ? 'text-blue-400'
                      : 'text-blue-600'
                    : isDark
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  {format(day, 'MMM')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contenido de la semana */}
        <div className="grid grid-cols-7 min-h-[200px]">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={index}
                className={`p-2 border-r last:border-r-0 ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                } ${
                  isCurrentDay
                    ? isDark
                      ? 'bg-blue-900/20'
                      : 'bg-blue-50'
                    : ''
                }`}
              >
                {dayTasks.length > 0 ? (
                  <div className="space-y-1">
                    {dayTasks.slice(0, 4).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskSelect?.(task)}
                        className={`p-1.5 rounded text-xs cursor-pointer transition-colors ${
                          isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          <span className="truncate">{task.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 4 && (
                      <div className={`text-xs text-center ${
                        isDark ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        +{dayTasks.length - 4} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`text-xs text-center ${
                    isDark ? 'text-slate-500' : 'text-gray-400'
                  }`}>
                    No tasks
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompactCalendarWeekly;
