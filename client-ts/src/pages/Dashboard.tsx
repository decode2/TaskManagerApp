import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Task } from '../types/Task';
// import useDarkMode from '../hooks/useDarkMode'; // Currently unused
import { useCalendarSettings } from '../hooks/useCalendarSettings';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CalendarSettingsModal from '../components/CalendarSettingsModal';
import ModernCalendar from '../components/ModernCalendar';
import UnifiedCalendar from '../components/UnifiedCalendar';
import MobileOptimizedCalendar from '../components/MobileOptimizedCalendar';
import PriorityBadge from '../components/ui/PriorityBadge';
import CategoryBadge from '../components/ui/CategoryBadge';

const Dashboard = () => {
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  // const [isDark] = useDarkMode(); // Currently unused
  const { settings: calendarSettings } = useCalendarSettings();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch {
      toast.error("Failed to load tasks.", { autoClose: 1500 });
    }
  }, []);

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    } else if (user) {
      fetchTasks();
    }
  }, [user, loadingUser, navigate, fetchTasks]);

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
    }
      setShowDeleteModal(false);
      setTaskToDelete(null);
  };

  const toggleCompletion = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}/toggle-completion`);
      fetchTasks();
      toast.success(`Task marked as ${task.isCompleted ? 'pending' : 'completed'}`);
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      >
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage your tasks and stay organized
              </p>
            </div>
            <motion.button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Create Task</span>
                <span className="sm:hidden">Add</span>
              </div>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Tasks Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Tasks */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Today's Tasks</h2>
                </div>
                <div className="p-4 sm:p-6">
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">No tasks yet</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first task to get started</p>
                      <motion.button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create Task
                      </motion.button>
              </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <motion.div
                      key={task.id}
                      layout
                          className="group relative backdrop-blur-sm rounded-xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-lg border-slate-200/50 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/50"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
                          whileHover={{ y: -1 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <PriorityBadge priority={task.priority} size="sm" />
                                <CategoryBadge category={task.category} size="sm" />
                              </div>
                              <h3 className="text-sm sm:text-base font-medium text-slate-800 dark:text-white line-clamp-2 mb-2">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{format(new Date(task.date), 'MMM d, yyyy')}</span>
                                <span className="mx-1">•</span>
                                <span>{format(new Date(task.date), 'h:mm a')}</span>
                              </div>
                              {task.tags && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {task.tags.split(',').map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-full"
                                    >
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <motion.button
                                onClick={() => toggleCompletion(task)}
                                className={`p-3 sm:p-2 rounded-xl sm:rounded-lg transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] min-w-[48px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex items-center justify-center ${
                                  task.isCompleted
                                    ? 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                                    : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  {task.isCompleted ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  )}
                                </svg>
                              </motion.button>
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
                    </div>
              )}
                </div>
              </div>
            </div>

            {/* Calendar and Stats Section */}
            <div className="space-y-6">
              {/* Calendar Section */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Calendar</h2>
                    <button
                      onClick={() => setShowCalendarSettings(true)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  {isMobile ? (
                    <MobileOptimizedCalendar
                      tasks={tasks}
                      onDateSelect={(date) => {
                        // Handle date selection for mobile
                      }}
                      onTaskSelect={(task) => setEditTask(task)}
                      defaultView="week"
                    />
                  ) : calendarSettings.variant === 'current' ? (
                    <ModernCalendar
                      tasks={tasks}
                      onDateSelect={(date) => {
                        // Handle date selection
                      }}
                      onTaskSelect={(task) => setEditTask(task)}
                    />
                  ) : (
                    <UnifiedCalendar
                      tasks={tasks}
                      onDateSelect={(date) => {
                        // Handle date selection
                      }}
                      onTaskSelect={(task) => setEditTask(task)}
                      variant={calendarSettings.variant}
                      defaultView={calendarSettings.defaultView}
                    />
                  )}
                </div>
              </div>

              {/* Statistics Section */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm sm:text-base">Total Tasks</p>
                      <p className="text-2xl sm:text-3xl font-bold">{tasks.length}</p>
                    </div>
                    <div className="p-3 bg-blue-400/20 rounded-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm sm:text-base">Completed</p>
                      <p className="text-2xl sm:text-3xl font-bold">{tasks.filter(task => task.isCompleted).length}</p>
                    </div>
                    <div className="p-3 bg-green-400/20 rounded-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm sm:text-base">Pending</p>
                      <p className="text-2xl sm:text-3xl font-bold">{tasks.filter(task => !task.isCompleted).length}</p>
                    </div>
                    <div className="p-3 bg-orange-400/20 rounded-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm sm:text-base">High Priority</p>
                      <p className="text-2xl sm:text-3xl font-bold">{tasks.filter(task => task.priority === 3 || task.priority === 4).length}</p>
                    </div>
                    <div className="p-3 bg-purple-400/20 rounded-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateTaskModal open={showModal} onClose={() => setShowModal(false)} onCreated={handleTaskCreated} />
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onUpdated={handleTaskUpdated} />
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          taskTitle={taskToDelete?.title || ''}
        />
        <CalendarSettingsModal
          isOpen={showCalendarSettings}
          onClose={() => setShowCalendarSettings(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;