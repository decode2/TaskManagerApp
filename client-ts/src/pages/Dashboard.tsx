// --- src/pages/Dashboard.tsx ---
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import CalendarView from "../components/CalendarView";
import useDarkMode from "../hooks/useDarkMode";

const recurrenceOptions = [
  { label: "None", value: "None" },
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Custom Interval", value: "Custom" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [editedTaskId, setEditedTaskId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [isDark, setIsDark] = useDarkMode();
  const [newRecurrenceType, setNewRecurrenceType] = useState("None");
  const [newRecurrenceInterval, setNewRecurrenceInterval] = useState<number | undefined>();
  const [newRecurrenceCount, setNewRecurrenceCount] = useState<number | undefined>();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7044/api/tasksapi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch {
      toast.error("Failed to load tasks.", { autoClose: 1500 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-tr from-slate-900 via-purple-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-slate-900 text-white transition-all duration-700">
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
            <h2 className="text-2xl font-semibold mb-4">📋 Today's Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-300">No tasks yet. Add one to get started!</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 flex justify-between items-center"
                  >
                    <span className={task.isCompleted ? "line-through text-green-400" : ""}>{task.title}</span>
                    <span className="text-sm opacity-70">{new Date(task.date).toLocaleString()}</span>
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
      </div>
    </div>
  );
};

export default Dashboard;
