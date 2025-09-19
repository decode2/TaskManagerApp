import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/professional-calendar.css';
import { motion } from 'framer-motion';
import useDarkMode from '../hooks/useDarkMode';
import { Task, TaskPriority } from '../types/Task';
import { PriorityBadge } from './ui';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

interface ProfessionalCalendarViewProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
  priority: TaskPriority;
}

const ProfessionalCalendarView: React.FC<ProfessionalCalendarViewProps> = ({
  tasks,
  onDateSelect,
  onTaskSelect,
  className = ""
}) => {
  const [isDark] = useDarkMode();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Convertir tareas a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.date),
      end: new Date(new Date(task.date).getTime() + 60 * 60 * 1000), // 1 hora de duración
      resource: task,
      priority: task.priority
    }));
  }, [tasks]);

  // Manejar selección de fecha
  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    onDateSelect?.(slotInfo.start);
  }, [onDateSelect]);

  // Manejar selección de evento
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    onTaskSelect?.(event.resource);
  }, [onTaskSelect]);

  // Obtener color del evento basado en prioridad
  const getEventStyle = (event: CalendarEvent) => {
    const priorityColors = {
      [TaskPriority.Low]: '#10b981',      // green-500
      [TaskPriority.Medium]: '#f59e0b',   // amber-500
      [TaskPriority.High]: '#f97316',     // orange-500
      [TaskPriority.Urgent]: '#ef4444',   // red-500
    };

    return {
      style: {
        backgroundColor: priorityColors[event.priority] || priorityColors[TaskPriority.Medium],
        borderColor: priorityColors[event.priority] || priorityColors[TaskPriority.Medium],
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        fontSize: '13px',
        fontWeight: '500',
      }
    };
  };

  // Componente personalizado para eventos
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <motion.div
      className="flex items-center gap-1 p-1"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 truncate text-xs font-medium">
        {event.title}
      </div>
      <PriorityBadge 
        priority={event.priority} 
        size="sm" 
        showIcon={false}
        variant="minimal"
      />
    </motion.div>
  );

  // Componente personalizado para la barra de herramientas
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const handleViewChange = (newView: View) => {
      toolbar.onView(newView);
      setView(newView);
    };

    return (
      <motion.div
        className={`flex items-center justify-between mb-6 p-4 rounded-xl ${
          isDark 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        } shadow-sm`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Navegación */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={goToBack}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Mes anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={goToCurrent}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hoy
          </motion.button>

          <motion.button
            onClick={goToNext}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Mes siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Título del mes/año */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {toolbar.label}
          </h2>
        </motion.div>

        {/* Selector de vista */}
        <div className="flex items-center gap-2">
          {[
            { key: Views.MONTH, label: 'Mes' },
            { key: Views.WEEK, label: 'Semana' },
            { key: Views.DAY, label: 'Día' },
            { key: Views.AGENDA, label: 'Agenda' }
          ].map((viewOption) => (
            <motion.button
              key={viewOption.key}
              onClick={() => handleViewChange(viewOption.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === viewOption.key
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
              {viewOption.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className={`professional-calendar ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Leyenda de prioridades */}
      <motion.div
        className={`flex items-center justify-center gap-6 mb-6 p-4 rounded-xl ${
          isDark 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        } shadow-sm`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className={`text-sm font-medium ${
          isDark ? 'text-slate-300' : 'text-gray-600'
        }`}>
          Prioridades:
        </span>
        {[
          { priority: TaskPriority.Low, label: 'Baja', color: '#10b981' },
          { priority: TaskPriority.Medium, label: 'Media', color: '#f59e0b' },
          { priority: TaskPriority.High, label: 'Alta', color: '#f97316' },
          { priority: TaskPriority.Urgent, label: 'Urgente', color: '#ef4444' }
        ].map((item) => (
          <div key={item.priority} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className={`text-xs ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Calendario */}
      <motion.div
        className={`rounded-xl overflow-hidden shadow-lg ${
          isDark 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          date={date}
          onNavigate={setDate}
          onView={setView}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          eventPropGetter={getEventStyle}
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay tareas en este rango de fechas',
            showMore: (total: number) => `+${total} más`,
          }}
          className={`${isDark ? 'dark-calendar' : 'light-calendar'}`}
        />
      </motion.div>

    </motion.div>
  );
};

export default ProfessionalCalendarView;
