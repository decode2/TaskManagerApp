import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import useDarkMode from '../hooks/useDarkMode';
import { CalendarSettings, useCalendarSettings } from '../hooks/useCalendarSettings';
import { Task, TaskPriority, TaskCategory } from '../types/Task';

interface CalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data para los ejemplos en miniatura (no usado actualmente pero disponible para futuras mejoras)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockTasks: Task[] = [
  {
    id: 1,
    userId: '1',
    title: 'Meeting',
    date: new Date().toISOString(),
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.High,
    category: TaskCategory.Work,
    description: 'Team meeting',
    tags: 'work,meeting',
    isArchived: false
  },
  {
    id: 2,
    userId: '1',
    title: 'Gym',
    date: addDays(new Date(), 1).toISOString(),
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.Medium,
    category: TaskCategory.Health,
    description: 'Workout session',
    tags: 'health,fitness',
    isArchived: false
  }
];

const CalendarSettingsModal: React.FC<CalendarSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isDark] = useDarkMode();
  const { settings, updateSettings } = useCalendarSettings();
  const [tempSettings, setTempSettings] = useState<CalendarSettings>(settings);

  const calendarOptions = [
    {
      id: 'current' as const,
      name: 'Elegante',
      description: 'Diseño moderno con header elegante y gradientes',
      features: ['Header elegante', 'Gradientes modernos', 'Animaciones suaves', 'Leyenda visible']
    },
    {
      id: 'collapsible' as const,
      name: 'Colapsable',
      description: 'Header colapsable para ahorrar espacio',
      features: ['Header colapsable', 'Ahorro de espacio', 'Leyenda expandible', 'Funcionalidad completa']
    }
  ];

  const viewOptions = [
    {
      id: 'month' as const,
      name: 'Mensual',
      description: 'Vista mensual completa con todos los días',
      icon: '📅'
    },
    {
      id: 'week' as const,
      name: 'Semanal',
      description: 'Vista semanal enfocada en la semana actual',
      icon: '📊'
    }
  ];

  const handleSave = () => {
    updateSettings(tempSettings);
    onClose();
  };

  const handleCancel = () => {
    setTempSettings(settings);
    onClose();
  };

  const handleReset = () => {
    setTempSettings({
      variant: 'current',
      defaultView: 'month'
    });
  };

  // Mini calendar preview component
  const MiniCalendarPreview: React.FC<{ variant: 'current' | 'collapsible' }> = ({ variant }) => {
    const today = new Date();
    const currentMonth = format(today, 'MMM yyyy');
    
    return (
      <div className={`p-2 sm:p-3 rounded-lg border ${
        isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
      } shadow-sm`}>
        {/* Mini Header */}
        <div className={`flex items-center justify-between mb-2 p-1.5 sm:p-2 rounded ${
          isDark ? 'bg-slate-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}></div>
          </div>
          <div className={`text-xs font-medium ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            {currentMonth}
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
          </div>
        </div>

        {/* Mini Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className={`text-xs text-center p-1 ${
              isDark ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }, (_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate();
            const hasTask = i === 15 || i === 22; // Mock tasks
            
            return (
              <div key={i} className={`text-xs text-center p-1 rounded ${
                isToday 
                  ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <div className="relative">
                  {day}
                  {hasTask && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isDark ? 'bg-orange-400' : 'bg-orange-500'
                    }`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Priority Legend (only for current variant) */}
        {variant === 'current' && (
          <div className={`mt-2 pt-2 border-t ${
            isDark ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mini week view preview
  const MiniWeekPreview: React.FC = () => {
    const today = new Date();
    
    return (
      <div className={`p-3 rounded-lg border ${
        isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
      } shadow-sm`}>
        {/* Mini Week Header */}
        <div className={`flex items-center justify-between mb-2 p-2 rounded ${
          isDark ? 'bg-slate-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-4 h-4 rounded ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}></div>
          </div>
          <div className={`text-xs font-medium ${
            isDark ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Week View
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
            <div className={`w-4 h-4 rounded ${
              isDark ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
          </div>
        </div>

        {/* Mini Week Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayDate = addDays(today, i - today.getDay());
            const isToday = i === today.getDay();
            const hasTask = i === 1 || i === 3;
            
            return (
              <div key={i} className={`text-center p-2 rounded ${
                isToday 
                  ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : isDark ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div className={`text-xs font-semibold ${
                  isDark ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {format(dayDate, 'EEE')}
                </div>
                <div className="text-sm font-bold">
                  {format(dayDate, 'd')}
                </div>
                {hasTask && (
                  <div className={`w-full h-1 rounded mt-1 ${
                    isDark ? 'bg-orange-400' : 'bg-orange-500'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl ${
            isDark ? 'bg-slate-800' : 'bg-white'
          } shadow-2xl`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ⚙️ Configuración del Calendario
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Personaliza tu vista de calendario preferida
                </p>
              </div>
              <button
                onClick={handleCancel}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Calendar Style Selection */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🎨 Estilo del Calendario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calendarOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setTempSettings(prev => ({ ...prev, variant: option.id }))}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                      tempSettings.variant === option.id
                        ? isDark
                          ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-500'
                          : 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                        : isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <MiniCalendarPreview variant={option.id} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{option.name}</h4>
                        <p className={`text-sm mb-3 ${
                          tempSettings.variant === option.id
                            ? 'text-blue-100'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-gray-600'
                        }`}>
                          {option.description}
                        </p>
                        <div className="space-y-1">
                          {option.features.map((feature, index) => (
                            <div key={index} className={`text-xs flex items-center gap-2 ${
                              tempSettings.variant === option.id
                                ? 'text-blue-100'
                                : isDark
                                ? 'text-slate-400'
                                : 'text-gray-500'
                            }`}>
                              <div className={`w-1 h-1 rounded-full ${
                                tempSettings.variant === option.id
                                  ? 'bg-blue-200'
                                  : isDark
                                  ? 'bg-slate-500'
                                  : 'bg-gray-400'
                              }`}></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Default View Selection */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 Vista por Defecto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setTempSettings(prev => ({ ...prev, defaultView: option.id }))}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                      tempSettings.defaultView === option.id
                        ? isDark
                          ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-500'
                          : 'bg-green-500 text-white shadow-lg ring-2 ring-green-300'
                        : isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {option.id === 'month' ? (
                          <MiniCalendarPreview variant="current" />
                        ) : (
                          <MiniWeekPreview />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{option.icon}</span>
                          <h4 className="font-semibold">{option.name}</h4>
                        </div>
                        <p className={`text-sm ${
                          tempSettings.defaultView === option.id
                            ? 'text-green-100'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-gray-600'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className={`p-4 rounded-xl mb-6 ${
              isDark ? 'bg-slate-700 border border-slate-600' : 'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📋 Resumen de Configuración
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    Estilo:
                  </span>
                  <span className={`ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {calendarOptions.find(o => o.id === tempSettings.variant)?.name}
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    Vista por defecto:
                  </span>
                  <span className={`ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {viewOptions.find(o => o.id === tempSettings.defaultView)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          } flex items-center justify-between`}>
            <button
              onClick={handleReset}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              🔄 Restaurar por defecto
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                💾 Guardar Configuración
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CalendarSettingsModal;
