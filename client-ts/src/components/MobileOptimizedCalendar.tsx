import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth, 
  isSameDay, 
  isToday,
  eachDayOfInterval
} from 'date-fns';
import { es } from 'date-fns/locale';
import useDarkMode from '../hooks/useDarkMode';
import { Task, TaskPriority } from '../types/Task';

export type MobileCalendarView = 'week' | 'month' | 'agenda';

interface MobileOptimizedCalendarProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
  defaultView?: MobileCalendarView;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  tasks: Task[];
}

const MobileOptimizedCalendar: React.FC<MobileOptimizedCalendarProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = "",
  defaultView = 'week'
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<MobileCalendarView>(defaultView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Gestos de deslizamiento simples
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Calcular días del mes
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: CalendarDay[] = [];
    
    // Usar eachDayOfInterval para evitar warnings de loop
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    allDays.forEach((day) => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return isSameDay(taskDate, day);
      });

      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isToday(day),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
        tasks: dayTasks
      });
    });

    return days;
  }, [currentDate, tasks, selectedDate]);

  // Calcular días de la semana
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days: CalendarDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return isSameDay(taskDate, day);
      });

      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isToday(day),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
        tasks: dayTasks
      });
    }

    return days;
  }, [currentDate, tasks, selectedDate]);

  // Tareas del día seleccionado
  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return isSameDay(taskDate, selectedDate);
    });
  }, [tasks, selectedDate]);


  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (view === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else if (view === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (view === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else if (view === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect?.(day.date);
  };

  const handleViewChange = (newView: MobileCalendarView) => {
    setView(newView);
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

  const getPriorityName = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Low: return 'Baja';
      case TaskPriority.Medium: return 'Media';
      case TaskPriority.High: return 'Alta';
      case TaskPriority.Urgent: return 'Urgente';
      default: return 'Sin prioridad';
    }
  };

  const renderTaskIndicator = (task: Task) => (
    <div
      key={task.id}
      className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
      title={`${task.title} - ${getPriorityName(task.priority)}`}
    />
  );

  const renderTask = (task: Task) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-2 p-2 rounded-lg mb-1 cursor-pointer transition-colors ${
        isDark 
          ? 'bg-slate-700 hover:bg-slate-600' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={() => onTaskSelect?.(task)}
    >
      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
      <span className={`text-xs truncate ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
        {task.title}
      </span>
    </motion.div>
  );

  const renderWeekDay = (day: CalendarDay, index: number) => {
    const dayName = format(day.date, 'EEE', { locale: es });
    const dayNumber = format(day.date, 'd');
    
    return (
      <motion.div
        key={day.date.toISOString()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className={`flex flex-col items-center p-0 min-h-[35px] cursor-pointer rounded-md transition-all duration-200 ${
          day.isSelected
            ? isDark
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-blue-500 text-white shadow-lg'
            : day.isToday
            ? isDark
              ? 'bg-blue-900/30 border border-blue-700'
              : 'bg-blue-100 border border-blue-300'
            : isDark
            ? 'hover:bg-slate-700'
            : 'hover:bg-gray-100'
        } ${!day.isCurrentMonth ? 'opacity-40' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <span className={`text-xs font-medium mb-0 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {dayName}
        </span>
        <span className={`text-sm font-semibold mb-0 ${
          day.isSelected ? 'text-white' : isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          {dayNumber}
        </span>
        <div className="flex gap-0.5 justify-center">
          {day.tasks.slice(0, 2).map(renderTaskIndicator)}
          {day.tasks.length > 2 && (
            <div className={`w-1 h-1 rounded-full ${
              isDark ? 'bg-slate-500' : 'bg-gray-400'
            }`} />
          )}
        </div>
      </motion.div>
    );
  };

  const renderMonthDay = (day: CalendarDay) => {
    const dayNumber = format(day.date, 'd');
    
    return (
      <motion.div
        key={day.date.toISOString()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`aspect-square flex flex-col items-center justify-center p-0 cursor-pointer rounded-md transition-all duration-200 ${
          day.isSelected
            ? isDark
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-blue-500 text-white shadow-lg'
            : day.isToday
            ? isDark
              ? 'bg-blue-900/30 border border-blue-700'
              : 'bg-blue-100 border border-blue-300'
            : isDark
            ? 'hover:bg-slate-700'
            : 'hover:bg-gray-100'
        } ${!day.isCurrentMonth ? 'opacity-40' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <span className={`text-xs font-medium ${
          day.isSelected ? 'text-white' : isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          {dayNumber}
        </span>
        <div className="flex gap-0.5 justify-center mt-0.5">
          {day.tasks.slice(0, 2).map(renderTaskIndicator)}
        </div>
      </motion.div>
    );
  };

  const renderHeader = () => (
    <div className={`sticky top-0 z-10 ${isDark ? 'bg-slate-900' : 'bg-white'} border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
      {/* Navegación principal - más compacta */}
      <div className="flex items-center justify-between px-3 py-3">
        {/* Botón anterior */}
        <button
          onClick={handlePrevious}
          disabled={isTransitioning}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          } ${isTransitioning ? 'opacity-50' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Fecha actual - más compacta */}
        <div className="flex flex-col items-center min-w-0 flex-1 mx-2">
          <h2 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {view === 'week' 
              ? format(currentDate, 'dd MMM', { locale: es })
              : format(currentDate, 'MMM yyyy', { locale: es })
            }
          </h2>
          <button
            onClick={handleToday}
            className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Hoy
          </button>
        </div>

        {/* Botón siguiente */}
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          } ${isTransitioning ? 'opacity-50' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Selector de vista - más compacto y sin desbordamiento */}
      <div className="px-3 pb-2">
        <div className={`flex rounded-lg p-0.5 ${isDark ? 'bg-slate-800' : 'bg-gray-100'} w-full`}>
          {[
            { id: 'week', label: 'Sem', icon: '📅' },
            { id: 'month', label: 'Mes', icon: '🗓️' },
            { id: 'agenda', label: 'Pendientes', icon: '📋' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleViewChange(option.id as MobileCalendarView)}
              className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex-1 min-w-0 ${
                view === option.id
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-500 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-xs">{option.icon}</span>
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="p-1">
      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((day, index) => renderWeekDay(day, index))}
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="p-2">
      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div
            key={index}
            className={`text-center py-0.5 text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map(renderMonthDay)}
      </div>
    </div>
  );

  const renderAgendaView = () => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    // Filtrar tareas relevantes (solo pendientes)
    const relevantTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      const isPending = !task.isCompleted;
      const isOverdue = taskDate < today;
      const isThisWeek = taskDate >= today && taskDate <= nextWeek;
      
      return isPending && (isOverdue || isThisWeek);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Agrupar por estado
    const overdueTasks = relevantTasks.filter(task => new Date(task.date) < today);
    const todayTasks = relevantTasks.filter(task => isSameDay(new Date(task.date), today));
    const upcomingTasks = relevantTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate > today && taskDate <= nextWeek;
    });
    
    return (
      <div className="p-3">
        <div className="space-y-4">
          {relevantTasks.length > 0 ? (
            <AnimatePresence>
              {/* Tareas vencidas */}
              {overdueTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    <span className="text-lg">⚠️</span>
                    Vencidas ({overdueTasks.length})
                  </h3>
                  <div className="space-y-1">
                    {overdueTasks.map(renderTask)}
                  </div>
                </motion.div>
              )}

              {/* Tareas de hoy */}
              {todayTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    <span className="text-lg">📅</span>
                    Hoy ({todayTasks.length})
                  </h3>
                  <div className="space-y-1">
                    {todayTasks.map(renderTask)}
                  </div>
                </motion.div>
              )}

              {/* Próximas tareas */}
              {upcomingTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    <span className="text-lg">⏰</span>
                    Próximos 7 días ({upcomingTasks.length})
                  </h3>
                  <div className="space-y-1">
                    {upcomingTasks.map(renderTask)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              <div className="text-4xl mb-2">✅</div>
              <p className="text-sm">¡Todo al día!</p>
              <p className="text-xs mt-1">No hay tareas pendientes</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (view) {
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderWeekView();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className} ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {renderHeader()}
      
      <motion.div
        key={`${view}-${currentDate.toISOString()}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={view === 'month' ? 'min-h-[200px]' : 'min-h-[120px]'}
      >
        {renderContent()}
      </motion.div>

      {/* Tareas del día seleccionado (solo en vista semana/mes) */}
      {view !== 'agenda' && selectedDayTasks.length > 0 && (
        <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} p-3`}>
          <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {format(selectedDate!, 'dd MMM', { locale: es })}
          </h4>
          <div className="space-y-1">
            {selectedDayTasks.slice(0, 3).map(renderTask)}
            {selectedDayTasks.length > 3 && (
              <div className={`text-xs text-center py-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                +{selectedDayTasks.length - 3} tareas más
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedCalendar;
