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
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                >
                  + Add Task
                </button>
              </div>
              {tasks.length === 0 ? (
                <p className="text-gray-300">No tasks yet. Add one to get started!</p>
              ) : (
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 flex justify-between items-center"
                    >
                      <div>
                        <span className={task.isCompleted ? "line-through text-green-400" : ""}>{task.title}</span>
                        <div className="text-sm opacity-70">{new Date(task.date).toLocaleString()}</div>
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
                    </li>
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