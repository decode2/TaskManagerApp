import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';
import ModernCalendar from '../components/ModernCalendar';
import UnifiedCalendar from '../components/UnifiedCalendar';
import MobileOptimizedCalendar from '../components/MobileOptimizedCalendar';
import { Task, TaskPriority, TaskCategory } from '../types/Task';
import api from '../api';

// Datos de ejemplo para cuando no hay tareas reales
const fallbackTasks: Task[] = [
  {
    id: 1,
    userId: '1',
    title: 'Pagar alquiler',
    date: new Date().toISOString(),
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.High,
    category: TaskCategory.Finance,
    description: 'Pagar alquiler de casa',
    tags: 'finanzas,urgente',
    isArchived: false
  },
  {
    id: 2,
    userId: '1',
    title: 'Reunión equipo',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 días
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.Medium,
    category: TaskCategory.Work,
    description: 'Reunión semanal del equipo',
    tags: 'trabajo,equipo',
    isArchived: false
  },
  {
    id: 3,
    userId: '1',
    title: 'Comprar supermercado',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // +2 días
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.Low,
    category: TaskCategory.Shopping,
    description: 'Hacer compras del supermercado',
    tags: 'compras,casa',
    isArchived: false
  },
  {
    id: 4,
    userId: '1',
    title: 'Cita médica',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // +14 días
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.High,
    category: TaskCategory.Health,
    description: 'Revisión médica anual',
    tags: 'salud,medicina',
    isArchived: false
  },
  {
    id: 5,
    userId: '1',
    title: 'Estudiar React',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 días
    isCompleted: false,
    recurrenceType: 0,
    priority: TaskPriority.Medium,
    category: TaskCategory.Education,
    description: 'Estudiar hooks avanzados de React',
    tags: 'programación,react',
    isArchived: false
  }
];

type CalendarExample = 'current' | 'unified-current' | 'unified-collapsible' | 'mobile-optimized';

const CalendarExamples: React.FC = () => {
  const [isDark] = useDarkMode();
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState<CalendarExample>('current');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Cargar tareas reales del usuario
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingTasks(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Si hay error, usar datos de ejemplo
      setTasks(fallbackTasks);
    } finally {
      setLoadingTasks(false);
    }
  }, [user]);

  // Verificar autenticación y cargar tareas
  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    } else if (user) {
      fetchTasks();
    }
  }, [user, loadingUser, navigate, fetchTasks]);

  const examples = [
    { 
      id: 'current', 
      name: 'Diseño Actual', 
      description: 'El diseño actual con header elegante (solo mensual)' 
    },
    { 
      id: 'unified-current', 
      name: 'Unificado Elegante', 
      description: 'Diseño elegante con cambio entre vista mensual/semanal' 
    },
    { 
      id: 'unified-collapsible', 
      name: 'Unificado Colapsable', 
      description: 'Header colapsable con cambio entre vistas' 
    },
    { 
      id: 'mobile-optimized', 
      name: '📱 Optimizado Móvil', 
      description: 'Diseño específico para pantallas pequeñas con gestos de deslizamiento' 
    }
  ] as const;

  // Usar tareas reales si están disponibles, sino usar datos de ejemplo
  const displayTasks = tasks.length > 0 ? tasks : fallbackTasks;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTaskSelect = (task: Task) => {
    console.log('Task selected:', task);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header de la página */}
      <div className={`p-6 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📅 Calendarios Unificados
          </h1>
          <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Explora los nuevos calendarios unificados con cambio entre vista mensual y semanal
          </p>
          <div className="flex items-center justify-between mt-3">
            {loadingTasks ? (
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                🔄 Cargando tus tareas...
              </div>
            ) : (
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                📊 Mostrando {tasks.length > 0 ? `${tasks.length} tareas reales` : 'tareas de ejemplo'} 
                {tasks.length === 0 && ' (crea algunas tareas para ver el contenido real)'}
              </div>
            )}
            {!loadingTasks && (
              <button
                onClick={fetchTasks}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                🔄 Actualizar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navegación entre ejemplos */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Selecciona un ejemplo:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example.id)}
                className={`p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedExample === example.id
                    ? isDark
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-lg'
                    : isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <h3 className="font-semibold mb-1">{example.name}</h3>
                <p className={`text-sm ${
                  selectedExample === example.id
                    ? 'text-blue-100'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-gray-500'
                }`}>
                  {example.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Contenedor del ejemplo seleccionado */}
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <div className="mb-4">
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {examples.find(e => e.id === selectedExample)?.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              {examples.find(e => e.id === selectedExample)?.description}
            </p>
          </div>

          {/* Renderizado del ejemplo seleccionado */}
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4">
            {selectedExample === 'current' && (
              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Diseño Actual (Solo Vista Mensual)
                </h4>
                <ModernCalendar
                  tasks={displayTasks}
                  onDateSelect={handleDateSelect}
                  onTaskSelect={handleTaskSelect}
                  className="w-full"
                />
              </div>
            )}

            {selectedExample === 'unified-current' && (
              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Calendario Unificado - Diseño Elegante
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Usa el botón "Week/Month" para cambiar entre vistas
                </p>
                <UnifiedCalendar
                  tasks={displayTasks}
                  onDateSelect={handleDateSelect}
                  onTaskSelect={handleTaskSelect}
                  className="w-full"
                  variant="current"
                  defaultView="month"
                />
              </div>
            )}

            {selectedExample === 'unified-collapsible' && (
              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Calendario Unificado - Header Colapsable
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Usa el botón "Week/Month" para cambiar entre vistas y el botón de colapso para ocultar la leyenda
                </p>
                <UnifiedCalendar
                  tasks={displayTasks}
                  onDateSelect={handleDateSelect}
                  onTaskSelect={handleTaskSelect}
                  className="w-full"
                  variant="collapsible"
                  defaultView="month"
                />
              </div>
            )}

            {selectedExample === 'mobile-optimized' && (
              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📱 Calendario Optimizado para Móvil
                </h4>
                <div className={`text-sm space-y-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  <p>Diseñado específicamente para pantallas pequeñas como iPhone SE y Galaxy S8+</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium mb-1">🎯 Características:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Gestos de deslizamiento horizontal/vertical</li>
                        <li>3 vistas: Semana, Mes, Lista</li>
                        <li>Botones táctiles optimizados</li>
                        <li>Animaciones suaves</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">📱 Compatibilidad:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>iPhone SE (4.7")</li>
                        <li>Galaxy S8+ (6.2")</li>
                        <li>Pantallas pequeñas</li>
                        <li>Modo oscuro/claro</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="max-w-sm mx-auto">
                  <MobileOptimizedCalendar
                    tasks={displayTasks}
                    onDateSelect={handleDateSelect}
                    onTaskSelect={handleTaskSelect}
                    className="w-full"
                    defaultView="week"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Información sobre las tareas mostradas */}
        {!loadingTasks && (
          <div className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📋 Tareas Mostradas
            </h3>
            <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {tasks.length > 0 ? (
                <div>
                  <p className="mb-2">Se están mostrando <strong>{tasks.length} tareas reales</strong> de tu cuenta:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tasks.slice(0, 6).map((task) => (
                      <div key={task.id} className={`p-2 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                        <span className="font-medium">{task.title}</span>
                        <span className={`ml-2 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {new Date(task.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {tasks.length > 6 && (
                      <div className={`p-2 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-50'} text-center`}>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          +{tasks.length - 6} tareas más...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-2">No tienes tareas creadas aún. Se están mostrando <strong>tareas de ejemplo</strong> para que puedas ver cómo se ven los calendarios con contenido.</p>
                  <p className="text-xs">💡 <strong>Tip:</strong> Ve al Dashboard y crea algunas tareas para ver el contenido real en estos calendarios.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💡 Características del Sistema Unificado
          </h3>
          <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            {selectedExample === 'current' && (
              <div>
                <p className="mb-2"><strong>Diseño Actual:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Header elegante con gradientes y efectos glassmorphism</li>
                  <li>Botones con animaciones suaves y sombras dinámicas</li>
                  <li>Layout en dos niveles (navegación + título)</li>
                  <li>Responsive design para móvil y desktop</li>
                  <li>Indicadores visuales y efectos de hover</li>
                  <li>Solo vista mensual (sin cambio de vista)</li>
                </ul>
              </div>
            )}
            {selectedExample === 'unified-current' && (
              <div>
                <p className="mb-2"><strong>Unificado Elegante:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Botón de cambio entre vista mensual y semanal</li>
                  <li>Header elegante con gradientes y efectos glassmorphism</li>
                  <li>Navegación intuitiva entre meses/semanas</li>
                  <li>Leyenda de prioridades siempre visible</li>
                  <li>Animaciones suaves al cambiar de vista</li>
                  <li>Responsive design para móvil y desktop</li>
                </ul>
              </div>
            )}
            {selectedExample === 'unified-collapsible' && (
              <div>
                <p className="mb-2"><strong>Unificado Colapsable:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Botón de cambio entre vista mensual y semanal</li>
                  <li>Header colapsable con animación suave</li>
                  <li>Leyenda de prioridades expandible/colapsable</li>
                  <li>Botón de colapso/expansión intuitivo</li>
                  <li>Ahorra espacio cuando está colapsado</li>
                  <li>Mantiene toda la funcionalidad visible</li>
                </ul>
              </div>
            )}
            {selectedExample === 'mobile-optimized' && (
              <div>
                <p className="mb-2"><strong>📱 Optimizado Móvil:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Diseñado específicamente para pantallas pequeñas (iPhone SE, Galaxy S8+)</li>
                  <li>Gestos de deslizamiento horizontal para navegar entre semanas/meses</li>
                  <li>Tres vistas optimizadas: Semana, Mes, Lista</li>
                  <li>Botones táctiles grandes (44px mínimo) siguiendo directrices de Apple</li>
                  <li>Animaciones suaves inspiradas en Material Design de Google</li>
                  <li>Indicadores visuales claros para tareas y prioridades</li>
                  <li>Header sticky para navegación rápida</li>
                  <li>Vista de lista para días con muchas tareas</li>
                  <li>Transiciones fluidas entre vistas</li>
                  <li>Optimizado para una sola mano en dispositivos pequeños</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Instrucciones de uso */}
        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
          <h4 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            🎯 Cómo usar los calendarios unificados:
          </h4>
          <ul className={`text-sm space-y-1 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
            <li>• <strong>Cambio de vista:</strong> Usa el botón "Week/Month" para alternar entre vista mensual y semanal</li>
            <li>• <strong>Navegación:</strong> Usa las flechas para navegar entre meses o semanas</li>
            <li>• <strong>Hoy:</strong> Haz clic en "Today" para volver a la fecha actual</li>
            <li>• <strong>Selección:</strong> Haz clic en cualquier día para ver las tareas de ese día</li>
            <li>• <strong>Colapso:</strong> En la variante colapsable, usa el botón de colapso para ocultar la leyenda</li>
            {selectedExample === 'mobile-optimized' && (
              <>
                <li>• <strong>📱 Gestos móviles:</strong> Desliza horizontalmente para cambiar de semana/mes</li>
                <li>• <strong>📱 Vista lista:</strong> Usa la vista "Lista" para días con muchas tareas</li>
                <li>• <strong>📱 Táctil:</strong> Todos los elementos son táctiles y optimizados para dedos</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarExamples;