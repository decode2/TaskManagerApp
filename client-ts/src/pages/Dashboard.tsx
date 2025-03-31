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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || new Date(newTaskDate) < new Date()) {
      toast.error("Invalid task data.", { autoClose: 1500 });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://localhost:7044/api/tasksapi",
        {
          title: newTaskTitle,
          isCompleted: false,
          date: newTaskDate,
          recurrenceType: newRecurrenceType,
          recurrenceInterval: newRecurrenceType === "Custom" ? newRecurrenceInterval : null,
          recurrenceCount: newRecurrenceType !== "None" ? newRecurrenceCount : null,
          recurrenceIndex: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) => [...prev, response.data]);
      setNewTaskTitle("");
      setNewTaskDate("");
      setNewRecurrenceType("None");
      setNewRecurrenceInterval(undefined);
      setNewRecurrenceCount(undefined);

      toast.success("✅ Task added successfully!", { autoClose: 1500 });
    } catch {
      toast.error("❌ Failed to create task.", { autoClose: 1500 });
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7044/api/tasksapi/${task.id}`,
        {
          ...task,
          isCompleted: !task.isCompleted,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
    } catch {
      toast.error("❌ Failed to update task.", { autoClose: 1500 });
    }
  };

  const startEditing = (task: Task) => {
    setEditedTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDate(task.date);
  };

  const saveTaskEdit = async (id: number) => {
    if (!editedTitle.trim() || new Date(editedDate) < new Date()) {
      toast.error("Invalid edit data.", { autoClose: 1500 });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7044/api/tasksapi/${id}`,
        {
          id,
          title: editedTitle,
          isCompleted: false,
          date: editedDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, title: editedTitle, date: editedDate } : task
        )
      );
      setEditedTaskId(null);
      toast.success("Task updated!", { autoClose: 1500 });
    } catch {
      toast.error("Failed to edit task.", { autoClose: 1500 });
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7044/api/tasksapi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("🗑️ Task deleted.", { autoClose: 1500 });
    } catch {
      toast.error("Failed to delete task.", { autoClose: 1500 });
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
    <div className={`min-h-screen transition duration-300 bg-slate-100 text-gray-800 dark:bg-slate-900 dark:text-white`}>
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-slate-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">🎯 Your Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-slate-700 dark:text-white rounded hover:scale-105 transition"
          >
            {isDark ? "🌕 Light" : "🌙 Dark"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition hover:scale-105"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          {/* Add Task */}
          <form onSubmit={handleCreateTask} className="mb-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">➕ Add a New Task</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="flex-grow px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder:text-gray-400"
              />
              <input
                type="datetime-local"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
              />
            </div>

            {/* Recurrence UI */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">Repeat</label>
                <select
                  value={newRecurrenceType}
                  onChange={(e) => setNewRecurrenceType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                >
                  {recurrenceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {newRecurrenceType === "Custom" && (
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">Interval (days)</label>
                  <input
                    type="number"
                    min={1}
                    value={newRecurrenceInterval ?? ""}
                    onChange={(e) => setNewRecurrenceInterval(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                  />
                </div>
              )}

              {newRecurrenceType !== "None" && (
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">Repeat Count</label>
                  <input
                    type="number"
                    min={1}
                    value={newRecurrenceCount ?? ""}
                    onChange={(e) => setNewRecurrenceCount(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-full md:w-fit px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              ➕ Add Task
            </button>
          </form>

          {/* Task List */}
          <h2 className="text-xl font-semibold mb-4">📋 Your Tasks</h2>
          
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-10 animate-fade-in">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-lg font-medium">No tasks yet</p>
                <p className="text-sm">Start by adding a new task above!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`group animate-slideIn flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border transition-shadow hover:shadow-md
                      ${editedTaskId === task.id
                        ? "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                        : task.isCompleted
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300 dark:border-green-700"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white border-gray-200 dark:border-slate-600"
                      }`}
                  >
                    <div className="flex items-start md:items-center gap-3 w-full">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTaskCompletion(task)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      {editedTaskId === task.id ? (
                        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-grow">
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                          />
                          <input
                            type="datetime-local"
                            value={editedDate}
                            onChange={(e) => setEditedDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                          />
                          <button onClick={() => saveTaskEdit(editedTaskId)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">Save</button>
                          <button onClick={() => setEditedTaskId(null)} className="bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-white px-4 py-1 rounded hover:bg-gray-400 dark:hover:bg-slate-500">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex-grow text-sm md:text-base flex items-center gap-2">
                          {task.isCompleted && <span className="text-green-500">✅</span>}
                          <span className={`${task.isCompleted ? "line-through text-green-700 dark:text-green-300" : ""} font-medium`}>
                            {task.title}
                          </span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">({new Date(task.date).toLocaleString()})</span>
                        </div>
                      )}
                    </div>
                    {editedTaskId !== task.id && (
                      <div className="flex gap-2 text-sm mt-2 md:mt-0">
                        <button onClick={() => startEditing(task)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
            )}
        </div>

        {/* Calendar Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg h-fit animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">🗓️ Calendar</h2>
          <CalendarView tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
