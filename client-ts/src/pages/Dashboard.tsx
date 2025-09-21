import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import ModernCalendar from "../components/ModernCalendar";
import UnifiedCalendar from "../components/UnifiedCalendar";
import MobileOptimizedCalendar from "../components/MobileOptimizedCalendar";
import useDarkMode from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import { useCalendarSettings } from "../hooks/useCalendarSettings";
import { motion, AnimatePresence } from "framer-motion";
import TopNavigation from "../components/TopNavigation";

import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import CalendarSettingsModal from "../components/CalendarSettingsModal";
import AdvancedFilters from "../components/AdvancedFilters";
import FilterStats from "../components/FilterStats";
import { PriorityBadge, CategoryBadge } from "../components/ui";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDark, setIsDark] = useDarkMode();
  const [showModal, setShowModal] = useState(false);
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  // Calendar settings
  const { settings: calendarSettings, isLoaded: calendarSettingsLoaded } = useCalendarSettings();
  
  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch {
      toast.error("Failed to load tasks.", { autoClose: 1500 });
    }
  };

  // Removed handleLogout - now handled by TopNavigation component

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    } else if (user) {
      fetchTasks();
    }
  }, [user, loadingUser, navigate]);


  const handleTaskCreated = () => {
    fetchTasks();
    setShowModal(false);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setEditTask(null);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await api.delete(`/tasks/${taskToDelete.id}`);

      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const toggleCompletion = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted
      });

      fetchTasks();
    } catch {
      toast.error("Failed to update task status");
    }
  };

  const handleFilterChange = (newFilteredTasks: Task[]) => {
    // Ordenamiento inteligente: pendientes primero, completadas al final
    const sortedTasks = newFilteredTasks.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Pendientes primero, completadas al final
      if (!a.isCompleted && b.isCompleted) return -1;
      if (a.isCompleted && !b.isCompleted) return 1;

      // 2. Si ambas están completadas, ordenar por fecha descendente (más recientes primero)
      if (a.isCompleted && b.isCompleted) {
        return bDate.getTime() - aDate.getTime();
      }

      // 3. Si ambas están pendientes, ordenar por urgencia
      // 3.1. Vencidas primero
      const aIsOverdue = aDate < today;
      const bIsOverdue = bDate < today;
      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;

      // 3.2. Hoy
      const aIsToday = aDate.toDateString() === today.toDateString();
      const bIsToday = bDate.toDateString() === today.toDateString();
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;

      // 3.3. Próximos 7 días
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const aIsThisWeek = aDate >= today && aDate <= nextWeek;
      const bIsThisWeek = bDate >= today && bDate <= nextWeek;
      if (aIsThisWeek && !bIsThisWeek) return -1;
      if (!aIsThisWeek && bIsThisWeek) return 1;

      // 3.4. Por fecha ascendente para tareas futuras
      return aDate.getTime() - bDate.getTime();
    });

    setFilteredTasks(sortedTasks);
  };

  // Agrupar tareas para mostrar separadores visuales
  const groupTasks = (tasks: Task[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const groups = {
      overdue: [] as Task[],
      today: [] as Task[],
      thisWeek: [] as Task[],
      future: [] as Task[],
      completed: [] as Task[]
    };

    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      
      if (task.isCompleted) {
        groups.completed.push(task);
      } else if (taskDate < today) {
        groups.overdue.push(task);
      } else if (taskDate.toDateString() === today.toDateString()) {
        groups.today.push(task);
      } else if (taskDate <= nextWeek) {
        groups.thisWeek.push(task);
      } else {
        groups.future.push(task);
      }
    });

    return groups;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-tr from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-slate-900 text-slate-800 dark:text-white transition-all duration-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="w-full max-w-6xl relative" style={{ zIndex: 1 }}>
          {/* Top Navigation */}
          <TopNavigation 
            onThemeToggle={() => {
              if (typeof setIsDark === 'function') {
                setIsDark(!isDark);
              }
            }}
            isDark={isDark}
          />

          {/* Enlace temporal para ejemplos de calendario */}
          <div className="fixed top-20 right-4 z-50">
            <a
              href="/calendar-examples"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              📅 Ver Ejemplos
            </a>
          </div>

          {/* Main Content */}
          <div className="mt-4 sm:mt-8 px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 dark:text-white">📋 Task Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-xl border border-slate-200/50 dark:bg-white/10 dark:border-slate-700/30">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white">📋 Today's Tasks</h2>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => setShowModal(true)}
                    className="group relative text-sm px-4 sm:px-5 py-3 sm:py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 dark:from-green-600 dark:via-green-700 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-400/30 dark:border-green-500/40 overflow-hidden no-select w-full sm:w-auto min-h-[44px] touch-manipulation"
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <motion.div
                        animate={{ rotate: [0, 90, 0] }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="w-5 h-5 flex items-center justify-center no-select"
                      >
                        <svg className="w-4 h-4 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </motion.div>
                      <span>Add Task</span>
                    </div>
                    
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </div>

                {/* Advanced Filters */}
                <div className="mb-6">
                  <AdvancedFilters
                    tasks={tasks}
                    onFilterChange={handleFilterChange}
                  />
                </div>
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4 opacity-50">📝</div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      {tasks.length === 0 ? 'Create your first task to get started!' : 
                       'Try adjusting your filters to see more tasks.'}
                    </p>
                    {tasks.length === 0 && (
                      <motion.button
                        onClick={() => setShowModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Create First Task
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {(() => {
                      const groups = groupTasks(filteredTasks);
                      const pendingTasks = [...groups.overdue, ...groups.today, ...groups.thisWeek, ...groups.future];
                      
                      return (
                        <>
                          {/* Tareas Pendientes */}
                          {pendingTasks.length > 0 && (
                            <div className="space-y-3 sm:space-y-4">
                              {pendingTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        className={`group relative backdrop-blur-sm rounded-xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-lg ${
                          task.isCompleted 
                            ? "border-emerald-200/50 dark:border-emerald-700/30 bg-emerald-50/50 dark:bg-emerald-900/20" 
                            : "border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 hover:border-blue-300/50 dark:hover:border-blue-600/30 hover:bg-white dark:hover:bg-slate-800/80"
                        }`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
                        whileHover={{ y: -1 }}
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div
                            className="flex items-start gap-2 sm:gap-3 cursor-pointer no-select flex-1 active:scale-95 transition-transform duration-100 touch-manipulation min-h-[44px]"
                            onClick={() => toggleCompletion(task)}
                          >
                            {/* Checkbox */}
                            <div
                              className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center no-select mt-0.5 touch-manipulation ${
                                task.isCompleted ? "bg-emerald-500 border-emerald-500" : "border-slate-400 dark:border-slate-500"
                              }`}
                              style={{
                                // Prevent text distortion during animations
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden'
                              }}
                            >
                              {task.isCompleted && (
                                <motion.span
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="text-white text-sm font-bold no-select"
                                >
                                  ✓
                                </motion.span>
                              )}
                            </div>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`text-base sm:text-lg font-semibold mb-1 transition-opacity duration-300 ${
                                  task.isCompleted ? "line-through text-emerald-600 dark:text-green-400 opacity-70" : "text-slate-800 dark:text-white"
                                }`}
                              >
                                {task.title}
                              </h3>
                              
                              {/* Date */}
                              <div className="flex items-center gap-1 mb-2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                  {new Date(task.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              {/* Description */}
                              {task.description && (
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                                  {task.description}
                                </p>
                              )}

                              {/* Tags */}
                              {task.tags && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {task.tags.split(',').map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full"
                                    >
                                      #{tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Badges Row */}
                              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Priority:</span>
                                  <PriorityBadge priority={task.priority || 2} size="sm" variant="outline" animated={true} />
                                </div>
                                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Category:</span>
                                  <CategoryBadge category={task.category || 8} size="sm" variant="default" animated={true} />
                                </div>
                                
                                {/* Archive Badge */}
                                {task.isArchived && (
                                  <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-700 whitespace-nowrap">
                                    📦 Archived
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 sm:gap-1 ml-2">
                            <motion.button
                              onClick={() => setEditTask(task)}
                              className="p-3 sm:p-2 rounded-xl sm:rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setTaskToDelete(task);
                                setShowDeleteModal(true);
                              }}
                              className="p-3 sm:p-2 rounded-xl sm:rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                        </div>
                      </motion.div>
                    ))}
                            </div>
                          )}

                          {/* Separador visual entre tareas pendientes y completadas */}
                          {pendingTasks.length > 0 && groups.completed.length > 0 && (
                            <div className="relative my-6">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                              </div>
                              <div className="relative flex justify-center">
                                <button
                                  onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                    isDark
                                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                                      : 'bg-white text-slate-600 hover:bg-gray-50 border border-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>✅</span>
                                    <span>Completed ({groups.completed.length})</span>
                                    <motion.span
                                      animate={{ rotate: showCompletedTasks ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </motion.span>
                                  </div>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Tareas Completadas */}
                          {groups.completed.length > 0 && showCompletedTasks && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3 sm:space-y-4"
                            >
                              {groups.completed.map((task) => (
                                <motion.div
                                  key={task.id}
                                  layout
                                  className="group relative backdrop-blur-sm rounded-xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-lg border-emerald-200/50 dark:border-emerald-700/30 bg-emerald-50/50 dark:bg-emerald-900/20"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
                                  whileHover={{ y: -1 }}
                                >
                                  {/* Task Header */}
                                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                                    <div
                                      className="flex items-start gap-2 sm:gap-3 cursor-pointer no-select flex-1 active:scale-95 transition-transform duration-100 touch-manipulation min-h-[44px]"
                                      onClick={() => toggleCompletion(task)}
                                    >
                                      {/* Checkbox */}
                                      <div
                                        className="w-6 h-6 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center no-select mt-0.5 touch-manipulation bg-emerald-500 border-emerald-500"
                                        style={{
                                          transform: 'translateZ(0)',
                                          backfaceVisibility: 'hidden',
                                          WebkitBackfaceVisibility: 'hidden'
                                        }}
                                      >
                                        <motion.span
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0, opacity: 0 }}
                                          className="text-white text-sm font-bold no-select"
                                        >
                                          ✓
                                        </motion.span>
                                      </div>

                                      {/* Task Content */}
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold mb-1 transition-opacity duration-300 line-through text-emerald-600 dark:text-green-400 opacity-70">
                                          {task.title}
                                        </h3>
                                        
                                        {/* Date */}
                                        <div className="flex items-center gap-1 mb-2">
                                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 dark:text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                          <span className="text-xs sm:text-sm text-emerald-500 dark:text-emerald-400">
                                            {new Date(task.date).toLocaleDateString('en-US', {
                                              weekday: 'short',
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </span>
                                        </div>

                                        {/* Description */}
                                        {task.description && (
                                          <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-300 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                                            {task.description}
                                          </p>
                                        )}

                                        {/* Tags */}
                                        {task.tags && (
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {task.tags.split(',').map((tag, index) => (
                                              <span
                                                key={index}
                                                className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 rounded-full"
                                              >
                                                {tag.trim()}
                                              </span>
                                            ))}
                                          </div>
                                        )}

                                        {/* Priority and Category Badges */}
                                        <div className="flex flex-wrap gap-2">
                                          <PriorityBadge priority={task.priority} size="sm" />
                                          <CategoryBadge category={task.category} size="sm" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 sm:gap-1 ml-2">
                                      <motion.button
                                        onClick={() => setEditTask(task)}
                                        className="p-3 sm:p-2 rounded-xl sm:rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex items-center justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <svg className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </motion.button>
                                      <motion.button
                                        onClick={() => {
                                          setTaskToDelete(task);
                                          setShowDeleteModal(true);
                                        }}
                                        className="p-3 sm:p-2 rounded-xl sm:rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex items-center justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <svg className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Task Statistics */}
                <FilterStats 
                  totalTasks={tasks.length}
                  filteredTasks={filteredTasks.length}
                  tasks={tasks}
                />

                {/* Calendar */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-200/50 dark:bg-white/10 dark:border-slate-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">🗓️ Calendar</h2>
                    <motion.button
                      onClick={() => setShowCalendarSettings(true)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isDark 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Configurar calendario"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  {calendarSettingsLoaded ? (
                    isMobile ? (
                      <MobileOptimizedCalendar
                        tasks={tasks}
                        onDateSelect={(date) => console.log('Selected date:', date)}
                        onTaskSelect={(task) => setEditTask(task)}
                        className="w-full"
                        defaultView="week"
                      />
                    ) : (
                      calendarSettings.variant === 'current' ? (
                        <ModernCalendar 
                          tasks={tasks} 
                          onDateSelect={(date) => console.log('Selected date:', date)}
                          onTaskSelect={(task) => setEditTask(task)}
                          className="w-full"
                        />
                      ) : (
                        <UnifiedCalendar
                          tasks={tasks}
                          onDateSelect={(date) => console.log('Selected date:', date)}
                          onTaskSelect={(task) => setEditTask(task)}
                          className="w-full"
                          variant={calendarSettings.variant}
                          defaultView={calendarSettings.defaultView}
                        />
                      )
                    )
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {taskToDelete && (
              <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                taskTitle={taskToDelete.title}
              />
            )}
          </div>
        </div>

        <CreateTaskModal open={showModal} onClose={() => setShowModal(false)} onCreated={handleTaskCreated} />
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onUpdated={handleTaskUpdated} />
        <CalendarSettingsModal 
          isOpen={showCalendarSettings} 
          onClose={() => setShowCalendarSettings(false)} 
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
