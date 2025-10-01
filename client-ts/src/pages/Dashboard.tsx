import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Task } from '../types/Task';
import { useCalendarSettings } from '../hooks/useCalendarSettings';
import { useProjects } from '../hooks/useProjects';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import CalendarSettingsModal from '../components/CalendarSettingsModal';
import ModernCalendar from '../components/ModernCalendar';
import UnifiedCalendar from '../components/UnifiedCalendar';
import MobileOptimizedCalendar from '../components/MobileOptimizedCalendar';
import TaskCardWithProject from '../components/TaskCardWithProject';
import ProjectSidebar from '../components/ProjectSidebar';
import TopNavigation from '../components/TopNavigation';
import useDarkMode from '../hooks/useDarkMode';

const Dashboard = () => {
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const [isDark, toggleDarkMode] = useDarkMode();
  const { settings: calendarSettings } = useCalendarSettings();
  
  // Projects state
  const {
    projects,
    loading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
  } = useProjects();
  
  // Selected project state
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  // Wrapper function for theme toggle
  const handleThemeToggle = () => {
    toggleDarkMode(!isDark);
  };
  
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

  // Filter tasks by selected project
  const filteredTasks = useMemo(() => {
    if (selectedProjectId === null) {
      return tasks;
    }
    return tasks.filter(task => task.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  // Get selected project
  const selectedProject = useMemo(() => {
    if (selectedProjectId === null) return null;
    return projects.find(project => project.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Memoized calculations for better performance
  const taskStats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.isCompleted).length;
    const pending = total - completed;
    const highPriority = filteredTasks.filter(task => task.priority === 3 || task.priority === 4).length;
    
    return { total, completed, pending, highPriority };
  }, [filteredTasks]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-primary">
        {/* Top Navigation */}
        <TopNavigation onThemeToggle={handleThemeToggle} isDark={isDark} />
        
        {/* Main Layout */}
        <div className="flex min-h-[calc(100vh-64px)]">
          {/* Projects Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProjectSidebar
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={setSelectedProjectId}
              onProjectCreate={createProject}
              onProjectUpdate={updateProject}
              onProjectDelete={deleteProject}
              onProjectArchive={archiveProject}
              loading={projectsLoading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container mx-auto px-4 py-6 sm:py-8"
            >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary mb-3 tracking-tight">
                {selectedProject ? selectedProject.name : (new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening')}
              </h1>
              <p className="text-secondary text-base sm:text-lg">
                {selectedProject ? selectedProject.description || 'Project tasks' : new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <motion.button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div 
              className="bg-elevated rounded-xl p-6 border border-light transition-colors duration-200 hover:shadow-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary text-sm font-medium mb-1">Total Tasks</p>
                  <p className="text-3xl font-semibold text-primary">{taskStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-elevated rounded-xl p-6 border border-light transition-colors duration-200 hover:shadow-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">Completed</p>
                  <p className="text-3xl font-semibold text-green-600 dark:text-green-400">{taskStats.completed}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-elevated rounded-xl p-6 border border-light transition-colors duration-200 hover:shadow-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">Pending</p>
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">{taskStats.pending}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-elevated rounded-xl p-6 border border-light transition-colors duration-200 hover:shadow-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">High Priority</p>
                  <p className="text-3xl font-semibold text-red-600 dark:text-red-400">{taskStats.highPriority}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Tasks Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Tasks */}
                         <div className="bg-elevated rounded-xl shadow-medium border border-light overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                             <h2 className="text-xl sm:text-2xl font-bold text-primary">Today's Tasks</h2>
                </div>
                <div className="p-4 sm:p-6">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                        {selectedProject ? `No tasks in ${selectedProject.name}` : 'No tasks yet'}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        {selectedProject ? 'Create your first task for this project' : 'Create your first task to get started'}
                      </p>
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
                      {filteredTasks.map((task) => {
                        const taskProject = projects.find(p => p.id === task.projectId);
                        return (
                          <TaskCardWithProject
                            key={task.id}
                            task={task}
                            project={taskProject}
                            onToggleComplete={toggleCompletion}
                            onEdit={setEditTask}
                            onDelete={(task) => {
                              setTaskToDelete(task);
                              setShowDeleteModal(true);
                            }}
                            animated={true}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar and Stats Section */}
            <div className="space-y-6">
              {/* Calendar Section */}
                         <div className="bg-elevated rounded-xl shadow-medium border border-light overflow-hidden">
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

            </div>
          </div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <CreateTaskModal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onCreated={handleTaskCreated}
          projects={projects}
          selectedProjectId={selectedProjectId}
        />
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
      </div>
    </AnimatePresence>
  );
};

export default Dashboard;