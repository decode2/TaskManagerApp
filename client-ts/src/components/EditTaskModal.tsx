import React, { useEffect, useState } from "react";
import { Task, RecurrenceType, TaskPriority, TaskCategory } from "../types/Task";
import { Dialog } from "@headlessui/react";
import api from "../api";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
import DateTimePicker from "./DateTimePicker";
import { PrioritySelector, CategorySelector } from "./ui";

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTaskModal: React.FC<Props> = ({ task, onClose, onUpdated }) => {
  const [isDark] = useDarkMode();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.None);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number | undefined>(undefined);
  const [recurrenceCount, setRecurrenceCount] = useState<number | undefined>(undefined);
  
  // New properties
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.Other);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(task.date.slice(0, 16));
      setRecurrenceType(task.recurrenceType);
      setRecurrenceInterval(task.recurrenceInterval);
      setRecurrenceCount(task.recurrenceCount);
      
      // Load new properties
      setPriority(task.priority || TaskPriority.Medium);
      setCategory(task.category || TaskCategory.Other);
      setDescription(task.description || "");
      setTags(task.tags || "");
      setIsArchived(task.isArchived || false);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/tasks/${task?.id}`,
        {
          id: task?.id,
          title,
          date,
          recurrenceType,
          recurrenceInterval,
          recurrenceCount,
          priority,
          category,
          description,
          tags,
          isArchived,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Task updated successfully");
      onUpdated();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <AnimatePresence>
      {task && (
        <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-2xl z-50 w-full max-w-2xl relative border border-gray-200 dark:border-slate-700"
            >
              <Dialog.Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-500">✏️</span>
                Edit Task
              </Dialog.Title>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Date and Time */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Date & Time *
                  </label>
                  <DateTimePicker
                    value={date}
                    onChange={setDate}
                    placeholder="Select date and time"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="Enter task description..."
                  />
                </div>

                {/* Priority and Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <PrioritySelector
                    value={priority}
                    onChange={setPriority}
                    label="Priority"
                  />
                  <CategorySelector
                    value={category}
                    onChange={setCategory}
                    label="Category"
                  />
                </div>

                {/* Tags Input */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="work, urgent, project..."
                  />
                </div>

                {/* Archive Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isArchived"
                    checked={isArchived}
                    onChange={(e) => setIsArchived(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="isArchived" className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Archive this task
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isDark 
                        ? "bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-slate-600/70" 
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EditTaskModal;
