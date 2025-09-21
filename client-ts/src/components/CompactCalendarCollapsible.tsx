import React, { useState, useMemo } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Task, TaskPriority } from '../types/Task';
import useDarkMode from '../hooks/useDarkMode';

interface CompactCalendarCollapsibleProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

const CompactCalendarCollapsible: React.FC<CompactCalendarCollapsibleProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
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

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <div className={`w-full ${className}`}>
      {/* Header colapsable */}
      <div className={`rounded-xl mb-4 overflow-hidden ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
        {/* Línea principal - siempre visible */}
        <div className="flex items-center justify-between p-3">
          {/* Navegación */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToToday}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Today
            </button>
            
            <button
              onClick={goToNextMonth}
              className={`p-1.5 rounded-lg transition-colors ${
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

          {/* Botón para colapsar/expandir */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Contenido colapsable */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'max-h-0' : 'max-h-32'
        }`}>
          <div className={`px-3 pb-3 border-t ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          }`}>
            {/* Leyenda de prioridades */}
            <div className="flex items-center justify-center gap-4 pt-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Urgent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className={`rounded-xl overflow-hidden ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      } shadow-sm`}>
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
            
            return (
              <button
                key={index}
                onClick={() => onDateSelect?.(day)}
                className={`relative p-2 min-h-[60px] text-sm transition-colors ${
                  isCurrentDay
                    ? isDark
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'bg-blue-100 text-blue-800'
                    : isDark
                    ? 'hover:bg-slate-700 text-slate-200'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`font-medium ${isCurrentDay ? 'font-bold' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                {/* Indicadores de tareas */}
                {dayTasks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 justify-center">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskSelect?.(task);
                        }}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        +{dayTasks.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompactCalendarCollapsible;
