import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import useDarkMode from '../hooks/useDarkMode';
import { Task, TaskPriority } from '../types/Task';
import { PriorityBadge } from './ui';

interface ModernCalendarProps {
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

const ModernCalendar: React.FC<ModernCalendarProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Obtener tareas para una fecha específica
  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.date), date)
    );
  }, [tasks]);

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes
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

  // Navegación
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

  // Manejar selección de fecha
  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect?.(day.date);
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority: TaskPriority): string => {
    const colors = {
      [TaskPriority.Low]: '#10b981',
      [TaskPriority.Medium]: '#f59e0b',
      [TaskPriority.High]: '#f97316',
      [TaskPriority.Urgent]: '#ef4444',
    };
    return colors[priority] || colors[TaskPriority.Medium];
  };

  // Renderizar tarea en el día
  const renderTask = (task: Task) => (
    <motion.div
      key={task.id}
      className="w-full h-1 rounded-full mb-1"
      style={{ backgroundColor: getPriorityColor(task.priority) }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        onTaskSelect?.(task);
      }}
      title={task.title}
    />
  );

  // Renderizar día del calendario
  const renderDay = (day: CalendarDay) => (
    <motion.button
      key={day.date.toISOString()}
      className={`
        relative w-full h-20 p-2 text-left transition-all duration-200
        ${day.isCurrentMonth 
          ? 'text-primary'
          : 'text-tertiary'
        }
        ${day.isToday 
          ? 'bg-accent-primary text-white font-semibold'
          : ''
        }
        ${day.isSelected && !day.isToday
          ? 'bg-secondary ring-2 ring-accent-primary'
          : ''
        }
        hover:bg-tertiary
        focus:outline-none focus:ring-2 focus:ring-accent-primary
      `}
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
      onClick={() => handleDateClick(day)}
      whileHover={{ scale: 1.02, transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] } }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex flex-col h-full">
        <div className="text-sm font-medium mb-1 text-center">
          {format(day.date, 'd')}
        </div>
        <div className="flex-1 flex flex-col justify-end">
          {day.tasks.slice(0, 3).map(renderTask)}
              {day.tasks.length > 3 && (
                <div className="text-xs text-center text-tertiary">
                  +{day.tasks.length - 3} more
                </div>
              )}
        </div>
      </div>
    </motion.button>
  );

  return (
    <motion.div
      className={`modern-calendar ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header con navegación */}
      <motion.div
        className="mb-6 p-4 rounded-xl shadow-sm bg-elevated border border-light"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header del calendario - Diseño Moderno y Profesional */}
        <div className="relative">
          {/* Barra superior con navegación */}
          <div className="flex items-center justify-between mb-6">
            {/* Navegación izquierda - Botones de flecha */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105 bg-secondary hover:bg-tertiary text-secondary hover:shadow-lg border border-light hover:border-medium"
                aria-label="Previous Month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNextMonth}
                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105 bg-secondary hover:bg-tertiary text-secondary hover:shadow-lg border border-light hover:border-medium"
                aria-label="Next Month"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          {/* Botón Today - Estilo destacado */}
          <motion.button
            onClick={goToToday}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/20"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.25), 0 10px 10px -5px rgba(59, 130, 246, 0.15)',
              transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Today
          </motion.button>
          </div>

          {/* Título del mes/año - Diseño centrado y elegante */}
          <div className="flex justify-center mb-4">
            <motion.button
              className="group relative px-6 py-4 rounded-2xl bg-secondary border border-light shadow-lg backdrop-blur-sm"
              onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)'
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Efecto de brillo sutil */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Contenido del título */}
              <div className="relative" style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}>
                {/* Versión móvil - Formato compacto */}
                <div className="block sm:hidden text-center">
                  <div className="text-lg font-bold tracking-tight text-primary">
                    {currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </div>
                  <div className="text-xs mt-1.5 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-200 text-secondary">
                    Tap to change
                  </div>
                </div>
                
                {/* Versión desktop - Formato completo */}
                <div className="hidden sm:block text-center">
                  <div className="text-2xl font-bold tracking-tight text-primary">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-sm mt-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-200 text-secondary">
                    Click to change
                  </div>
                </div>
              </div>

              {/* Indicador de interacción */}
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-400 group-hover:bg-blue-400' 
                  : 'bg-gray-400 group-hover:bg-blue-500'
              } opacity-60 group-hover:opacity-100`}></div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Selector de mes/año */}
      {showMonthYearPicker && (
        <motion.div
          className="mb-6 p-4 rounded-xl bg-elevated border border-light shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Selector de mes */}
            <div>
              <label className="block text-sm font-medium mb-2 text-secondary">
                Month
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const month = new Date(2024, i, 1);
                  return (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setCurrentDate(new Date(currentDate.getFullYear(), i, 1));
                        setShowMonthYearPicker(false);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                        currentDate.getMonth() === i
                          ? isDark 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {month.toLocaleDateString('en-US', { month: 'short' })}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Selector de año */}
            <div>
              <label className="block text-sm font-medium mb-2 text-secondary">
                Year
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <motion.button
                      key={year}
                      onClick={() => {
                        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                        setShowMonthYearPicker(false);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                        currentDate.getFullYear() === year
                          ? isDark 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : isDark 
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {year}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leyenda de prioridades compacta */}
      <motion.div
        className="mb-6 p-3 rounded-xl bg-elevated border border-light shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-medium text-secondary">
            Priorities:
          </span>
          {[
            { priority: TaskPriority.Low, label: 'Low', color: '#10b981' },
            { priority: TaskPriority.Medium, label: 'Medium', color: '#f59e0b' },
            { priority: TaskPriority.High, label: 'High', color: '#f97316' },
            { priority: TaskPriority.Urgent, label: 'Urgent', color: '#ef4444' }
          ].map((item) => (
            <div key={item.priority} className="flex items-center gap-1.5">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-secondary">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Calendario */}
      <motion.div
        className="rounded-xl overflow-hidden shadow-lg bg-elevated border border-light"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-tertiary">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-secondary"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7">
          <AnimatePresence>
            {calendarDays.map(renderDay)}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Detalles del día seleccionado */}
      {selectedDate && (
        <motion.div
          className="mt-6 p-4 rounded-xl bg-elevated border border-light shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-primary">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          {getTasksForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getTasksForDate(selectedDate).map((task) => (
                <motion.div
                  key={task.id}
                  className="p-3 rounded-lg cursor-pointer transition-all duration-200 bg-secondary hover:bg-tertiary"
                  onClick={() => onTaskSelect?.(task)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-primary">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm mt-1 text-secondary">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <PriorityBadge 
                      priority={task.priority} 
                      size="sm"
                      variant="minimal"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-tertiary">
              No tasks for this day
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModernCalendar;
