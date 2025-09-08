import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import CalendarView from "../components/CalendarView";
import useDarkMode from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import TopNavigation from "../components/TopNavigation";

import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDark, setIsDark] = useDarkMode();
  const [showModal, setShowModal] = useState(false);

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isFilterFocused, setIsFilterFocused] = useState(false);
  const [previousFilter, setPreviousFilter] = useState<'all' | 'completed' | 'pending'>('all');

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

  // Handle filter dropdown state
  useEffect(() => {
    if (filter !== previousFilter) {
      // Filter changed, close dropdown after a short delay
      setTimeout(() => {
        setIsFilterFocused(false);
      }, 100);
      setPreviousFilter(filter);
    }
  }, [filter, previousFilter]);

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

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.isCompleted;
    if (filter === 'pending') return !t.isCompleted;
    return true;
  });

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

          {/* Main Content */}
          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">📋 Task Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-200/50 dark:bg-white/10 dark:border-slate-700/30">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">📋 Today's Tasks</h2>
                  <div className="flex gap-3">
                    <div className="relative group">
                      <div className="relative">
                        <select
                          value={filter}
                          onChange={(e) => {
                            const newValue = e.target.value as any;
                            setFilter(newValue);
                            // Close dropdown immediately when selection changes
                            setTimeout(() => setIsFilterFocused(false), 50);
                          }}
                          onFocus={() => setIsFilterFocused(true)}
                          onBlur={() => {
                            // Add a small delay to allow for click events to process
                            setTimeout(() => setIsFilterFocused(false), 100);
                          }}
                          onMouseDown={() => {
                            // Toggle dropdown state on mouse down
                            setIsFilterFocused(prev => !prev);
                          }}
                          className={`custom-select appearance-none text-sm px-4 py-2.5 pr-8 rounded-lg border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${
                            isFilterFocused 
                              ? 'bg-white dark:bg-slate-600 shadow-md border-blue-500/50' 
                              : 'bg-white/80 hover:bg-white dark:bg-slate-700 dark:hover:bg-slate-600 border-slate-200/60 dark:border-slate-600/60 shadow-sm hover:shadow-md'
                          } text-slate-700 dark:text-white no-select`}
                          style={{ 
                            backgroundImage: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                          }}
                        >
                          <option value="all">All Tasks</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                        </select>
                        
                        {/* Custom dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <motion.svg
                          animate={{ rotate: isFilterFocused ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-4 h-4 text-slate-500 dark:text-slate-400 transition-colors duration-200 no-select"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                        </div>
                        
                        {/* Hover effect overlay - only when not focused */}
                        <div className={`absolute inset-0 rounded-lg bg-blue-500/5 transition-opacity duration-200 pointer-events-none ${
                          isFilterFocused ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                        }`}></div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      onClick={() => setShowModal(true)}
                      className="group relative text-sm px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 dark:from-green-600 dark:via-green-700 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:via-green-800 dark:hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-400/30 dark:border-green-500/40 overflow-hidden no-select"
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
                </div>
                {filteredTasks.length === 0 ? (
                  <p className="text-slate-600 dark:text-gray-300">No tasks to show with this filter.</p>
                ) : (
                  <ul className="space-y-4">
                    {filteredTasks.map((task) => (
                      <motion.li
                        key={task.id}
                        layout
                        className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 flex justify-between items-center border border-slate-200/50 dark:bg-white/10 dark:border-slate-700/30"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
                      >
                        <motion.div
                          className="flex items-center gap-3 cursor-pointer no-select"
                          onClick={() => toggleCompletion(task)}
                          whileTap={{ scale: 0.96 }}
                        >
                          <motion.div
                            layout
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center no-select ${
                              task.isCompleted ? "bg-emerald-500 border-emerald-500" : "border-slate-400 dark:border-slate-500"
                            }`}
                            animate={{
                              scale: task.isCompleted ? 1.2 : 1,
                              backgroundColor: task.isCompleted ? "#10b981" : "transparent",
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                          </motion.div>

                          <motion.div
                            layout
                            className={`flex flex-col ${
                              task.isCompleted ? "line-through text-emerald-600 dark:text-green-400" : "text-slate-700 dark:text-white"
                            }`}
                            animate={{ opacity: task.isCompleted ? 0.6 : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span>{task.title}</span>
                            <span className="text-xs opacity-60 text-slate-500 dark:text-gray-400">{new Date(task.date).toLocaleString()}</span>
                          </motion.div>
                        </motion.div>

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="group relative text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg text-white font-medium transition-all duration-200 border border-blue-400/20 dark:border-blue-500/30 no-select"
                            onClick={() => setEditTask(task)}
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 transition-all duration-200 group-hover:scale-110 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </div>
                            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={() => {
                              setTaskToDelete(task);
                              setShowDeleteModal(true);
                            }}
                            className="group relative text-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 rounded-lg shadow-md hover:shadow-lg text-white font-medium transition-all duration-200 border border-red-400/20 dark:border-red-500/30 no-select"
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 transition-all duration-200 group-hover:scale-110 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </div>
                            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}

                  </ul>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-200/50 dark:bg-white/10 dark:border-slate-700/30">
                <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">🗓️ Calendar</h2>
                <CalendarView tasks={tasks} />
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
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
