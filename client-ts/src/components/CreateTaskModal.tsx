import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/modal.css";
import useDarkMode from "../hooks/useDarkMode";
import DateTimePicker from "./DateTimePicker";
import { TaskPriority, TaskCategory } from "../types/Task";
import { PrioritySelector, CategorySelector } from "./ui";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const recurrenceOptions = [
  { label: "None", value: "None", icon: "📅", color: "gray", shortLabel: "Once" },
  { label: "Daily", value: "Daily", icon: "🔄", color: "blue", shortLabel: "Daily" },
  { label: "Weekly", value: "Weekly", icon: "📆", color: "green", shortLabel: "Weekly" },
  { label: "Monthly", value: "Monthly", icon: "🗓️", color: "purple", shortLabel: "Monthly" },
  { label: "Custom", value: "Custom", icon: "⚙️", color: "orange", shortLabel: "Custom" },
];

// Note: Priority and Category options are now handled by the modern selector components

// Predefined custom recurrence options for better UX
const predefinedCustomOptions = [
  { label: "Every 2 days", interval: 2, unit: "days" },
  { label: "Every 3 days", interval: 3, unit: "days" },
  { label: "Every week", interval: 1, unit: "weeks" },
  { label: "Every 2 weeks", interval: 2, unit: "weeks" },
  { label: "Every month", interval: 1, unit: "months" },
  { label: "Every 3 months", interval: 3, unit: "months" },
];

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState<string>("None");
  const [interval, setInterval] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [customUnit, setCustomUnit] = useState<"days" | "weeks" | "months">("days");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDark] = useDarkMode();
  
  // Nuevos estados para categorías y prioridades
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.Other);
  const [tags, setTags] = useState<string>("");

  const handleCloseModal = useCallback(() => {
    // Check if user has actually entered any meaningful data
    const hasTitle = title.trim() !== "";
    const hasDescription = description.trim() !== "";
    const hasDueDate = dueDate !== "";
    const hasRecurrence = recurrence !== "None";
    const hasCustomSettings = recurrence === "Custom" && (interval !== 1 || count !== 1 || customUnit !== "days");
    
    const hasUserData = hasTitle || hasDescription || hasDueDate || hasRecurrence || hasCustomSettings;
    
    if (hasUserData) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  }, [title, description, dueDate, recurrence, interval, count, customUnit, onClose]);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setRecurrence("None");
      setInterval(1);
      setCount(1);
      setCustomUnit("days");
      setShowConfirmDialog(false);
    }
  }, [open]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleCloseModal]);

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  const handleCancelButton = () => {
    onClose();
  };

  const handlePredefinedOption = (option: typeof predefinedCustomOptions[0]) => {
    setInterval(option.interval);
    setCustomUnit(option.unit as "days" | "weeks" | "months");
  };

  const recurrencePreview = () => {
    if (recurrence === "None") return "One-time task";
    if (recurrence === "Custom") {
      const unitText = customUnit === "days" ? (interval === 1 ? "day" : "days") :
                      customUnit === "weeks" ? (interval === 1 ? "week" : "weeks") :
                      (interval === 1 ? "month" : "months");
      const countText = count === 1 ? "time" : "times";
      return `Every ${interval} ${unitText} for ${count} ${countText}`;
    }
    return `${recurrence} task`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        title,
        date: dueDate,
        description: description || null,
        recurrenceType: recurrence,
        recurrenceInterval: recurrence === "Custom" ? interval : null,
        recurrenceCount: recurrence === "Custom" ? count : null,
        priority,
        category,
        tags: tags || null,
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1,
        duration: 0.3 
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className={`relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden mx-auto ${
              isDark 
                ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/50" 
                : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-300/70"
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Modal Header */}
            <div className={`p-6 border-b ${isDark ? "border-slate-600/30" : "border-gray-200/50"}`}>
              <motion.h2 
                className={`text-2xl font-bold text-center bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark 
                    ? "from-blue-400 to-purple-400" 
                    : "from-blue-600 to-purple-600"
                }`}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                ✨ Create New Task
              </motion.h2>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6" style={{ paddingRight: '20px' }}>
              <motion.form
                id="task-form"
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Task Title Input */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 hover:border-slate-500" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                    }`}
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 hover:border-slate-500" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
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
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 hover:border-slate-500" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                    }`}
                    placeholder="e.g., urgent, meeting, project..."
                  />
                </div>

                {/* Due Date Input with Custom DateTimePicker */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Due Date
                  </label>
                  <DateTimePicker
                    value={dueDate}
                    onChange={setDueDate}
                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark
                        ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500"
                        : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                    }`}
                  />
                </div>

                {/* Recurrence Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Recurrence
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {recurrenceOptions.map((option, index) => {
                      const isSelected = recurrence === option.value;
                      const getColorClasses = (color: string, selected: boolean) => {
                        if (selected) {
                          switch (color) {
                            case "gray": return "bg-gray-500 text-white border-gray-500";
                            case "blue": return "bg-blue-500 text-white border-blue-500";
                            case "green": return "bg-green-500 text-white border-green-500";
                            case "purple": return "bg-purple-500 text-white border-purple-500";
                            case "orange": return "bg-orange-500 text-white border-orange-500";
                            default: return "bg-blue-500 text-white border-blue-500";
                          }
                        } else {
                          return isDark 
                            ? "bg-slate-700/50 text-gray-300 border-slate-600/50 hover:bg-slate-600/70"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
                        }
                      };

                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => setRecurrence(option.value)}
                          className={`px-3 py-1.5 rounded-full border-2 transition-all duration-200 font-medium text-sm flex items-center gap-1.5 ${getColorClasses(option.color, isSelected)}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
                          whileHover={{ scale: 1.02, transition: { duration: 0.2, type: "spring", stiffness: 200, damping: 20 } }}
                          whileTap={{ scale: 0.98, transition: { duration: 0.1, type: "spring", stiffness: 200, damping: 20 } }}
                        >
                          <span className="text-sm relative z-10">
                            {option.icon}
                          </span>
                          <span className="relative z-10 font-medium">{option.shortLabel}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Custom Recurrence Fields */}
                <AnimatePresence>
                  {recurrence === "Custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-4"
                    >
                      {/* Predefined Options */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          Quick Options
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {predefinedCustomOptions.map((option, index) => (
                            <motion.button
                              key={option.label}
                              type="button"
                              onClick={() => handlePredefinedOption(option)}
                              className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                interval === option.interval && customUnit === option.unit
                                  ? isDark 
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-blue-500 text-white border-blue-500"
                                  : isDark 
                                    ? "bg-slate-700/50 text-gray-300 border-slate-600/50 hover:bg-slate-600/70"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Configuration */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          Custom Configuration
                        </label>
                        <div className="space-y-3">
                          {/* Interval and Unit Selection */}
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                Every
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={interval}
                                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                                  className={`w-16 px-2 py-1.5 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center ${
                                    isDark 
                                      ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500" 
                                      : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                                  }`}
                                />
                                <select
                                  value={customUnit}
                                  onChange={(e) => setCustomUnit(e.target.value as "days" | "weeks" | "months")}
                                  className={`px-3 py-1.5 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    isDark 
                                      ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500" 
                                      : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                                  }`}
                                >
                                  <option value="days">day(s)</option>
                                  <option value="weeks">week(s)</option>
                                  <option value="months">month(s)</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Repeat Count */}
                            <div className="flex-1">
                              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                Repeat
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={count}
                                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                  className={`w-16 px-2 py-1.5 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center ${
                                    isDark 
                                      ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500" 
                                      : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                                  }`}
                                />
                                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  time(s)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Count Buttons */}
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              Quick Count
                            </label>
                            <div className="flex gap-1">
                              {[1, 3, 5, 10].map((num) => (
                                <motion.button
                                  key={num}
                                  type="button"
                                  onClick={() => setCount(num)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                                    count === num
                                      ? isDark 
                                        ? "bg-blue-500 text-white"
                                        : "bg-blue-500 text-white"
                                      : isDark 
                                        ? "bg-slate-600/50 text-gray-300 hover:bg-slate-600/70"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {num}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task Preview */}
                <div className={`p-4 rounded-xl border relative overflow-hidden ${
                   isDark 
                     ? "bg-gradient-to-r from-slate-700/20 to-slate-600/20 border-slate-600/30" 
                     : "bg-gradient-to-r from-gray-100 to-blue-100 border-gray-300"
                 }`}>
                   <div className={`absolute inset-0 pointer-events-none ${
                     isDark 
                       ? "bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-slate-900/5" 
                       : "bg-gradient-to-br from-blue-200/30 via-purple-200/20 to-white/60"
                   }`} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}>📋</span>
                      <h4 className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                        Task Preview
                      </h4>
                    </div>
                    <div className={`text-sm space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-500 min-w-[70px] text-xs uppercase tracking-wide">Title:</span>
                        <span className="font-medium">{title || "No title"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-500 min-w-[70px] text-xs uppercase tracking-wide">Due:</span>
                        <span className="font-medium">{dueDate ? new Date(dueDate).toLocaleString() : "No date set"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-500 min-w-[70px] text-xs uppercase tracking-wide">Repeat:</span>
                        <span className="font-medium">{recurrencePreview()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.form>
            </div>

            {/* Actions */}
            <div className={`p-4 border-t ${isDark ? "border-slate-600/30" : "border-gray-200/50"}`}>
              <div className="flex gap-4">
                <motion.button
                  type="button"
                  onClick={handleCancelButton}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 overflow-hidden ${
                    isDark
                      ? "bg-slate-700/50 hover:bg-slate-600/70 text-white border-slate-600/50 hover:border-slate-500"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  form="task-form"
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-xl overflow-hidden create-task-btn"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  ✨ Create Task
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirmDialog && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${
                    isDark 
                      ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50" 
                      : "bg-white border border-gray-200"
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className={`p-6 ${isDark ? "border-b border-slate-600/30" : "border-b border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
                        <span className="text-red-500 text-xl">⚠️</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          Discard Changes?
                        </h3>
                        <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          You have unsaved changes. Are you sure you want to close?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 flex gap-3 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
                    <motion.button
                      type="button"
                      onClick={handleCancelClose}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDark 
                          ? "bg-slate-700 hover:bg-slate-600 text-white" 
                          : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Keep Editing
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleConfirmClose}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Discard
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;

