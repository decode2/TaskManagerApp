import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Task, RecurrenceType } from "../types/Task";
import { toast } from "react-toastify";
import CalendarView from "../components/CalendarView";
import useDarkMode from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { CheckCircle, Circle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDark, setIsDark] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7044/api/tasksapi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch {
      toast.error("Failed to load tasks.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    } else if (user) {
      fetchTasks();
    }
  }, [user, loadingUser]);

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
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7044/api/tasksapi/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = localStorage.getItem("token");
      await axios.put(`https://localhost:7044/api/tasksapi/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted
      }, {
        headers: { Authorization: `Bearer ${token}` }
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
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-tr from-slate-900 via-purple-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-slate-900 text-white transition-all duration-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">🎯 Task Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-4 py-2 text-sm rounded bg-slate-700 hover:bg-slate-600"
              >
                {isDark ? "🌕 Light" : "🌙 Dark"}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">📋 Today's Tasks</h2>
                <div className="flex gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded"
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
              {filteredTasks.length === 0 ? (
                <p className="text-gray-300">No tasks to show with this filter.</p>
              ) : (
                <ul className="space-y-4">
                  {filteredTasks.map((task) => (
                    <motion.li
                      key={task.id}
                      className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 flex justify-between items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCompletion(task)}
                          className="focus:outline-none"
                          aria-label="Toggle task completion"
                        >
                          {task.isCompleted ? (
                            <CheckCircle className="text-green-400 w-6 h-6 transition-all duration-300" />
                          ) : (
                            <Circle className="text-white/70 w-6 h-6 hover:text-white transition-all duration-300" />
                          )}
                        </button>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className={task.isCompleted ? "line-through text-green-400" : ""}>{task.title}</span>
                          <div className="text-sm opacity-70">{new Date(task.date).toLocaleString()}</div>
                        </motion.div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                          onClick={() => setEditTask(task)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setTaskToDelete(task);
                            setShowDeleteModal(true);
                          }}
                          className="ml-2 text-sm px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">🗓️ Calendar</h2>
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

        <CreateTaskModal open={showModal} onClose={() => setShowModal(false)} onCreated={handleTaskCreated} />
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onUpdated={handleTaskUpdated} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
