import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/modal.css";
import useDarkMode from "../hooks/useDarkMode";

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

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState<string>("None");
  const [interval, setInterval] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDark] = useDarkMode();

  const handleCloseModal = () => {
    const hasUserData = title !== "" || description !== "" || dueDate !== "" || recurrence !== "None" || interval !== 1 || count !== 1;
    if (hasUserData) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setRecurrence("None");
      setInterval(1);
      setCount(1);
      setShowConfirmDialog(false);
    }
  }, [open]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        const hasUserData = title !== "" || description !== "" || dueDate !== "" || recurrence !== "None" || interval !== 1 || count !== 1;
        if (hasUserData) {
          setShowConfirmDialog(true);
        } else {
          onClose();
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, title, description, dueDate, recurrence, interval, count, onClose]);

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  const recurrencePreview = () => {
    if (recurrence === "None") return "One-time task";
    if (recurrence === "Custom") {
      return `Every ${interval} ${interval === 1 ? "day" : "days"} for ${count} ${count === 1 ? "time" : "times"}`;
    }
    return `${recurrence} task`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        title,
        date: dueDate,
        recurrenceType: recurrence,
        recurrenceInterval: recurrence === "Custom" ? interval : null,
        recurrenceCount: recurrence === "Custom" ? count : null,
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
                 : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200/50"
             }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Modal Header */}
            <div              className={`p-6 border-b ${isDark ? "border-slate-600/30" : "border-gray-200/50"}`}>
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
                {/* Title Input */}
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
                        : "bg-white/50 border-gray-300/50 text-gray-900 placeholder-gray-500 hover:border-gray-400"
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
                        : "bg-white/50 border-gray-300/50 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                    }`}
                    placeholder="Enter task description..."
                  />
                </div>

                {/* Due Date Input */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500" 
                        : "bg-white/50 border-gray-300/50 text-gray-900 hover:border-gray-400"
                    }`}
                    required
                  />
                </div>

                {/* Recurrence Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Recurrence
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {recurrenceOptions.map((option) => {
                      const isSelected = recurrence === option.value;
                      const getColorClasses = (color: string, selected: boolean) => {
                        if (selected) {
                          switch (color) {
                            case "gray": return isDark ? "bg-gray-500/20 border-gray-400 text-gray-200" : "bg-gray-100 border-gray-500 text-gray-800";
                            case "blue": return isDark ? "bg-blue-500/20 border-blue-400 text-blue-200" : "bg-blue-100 border-blue-500 text-blue-800";
                            case "green": return isDark ? "bg-green-500/20 border-green-400 text-green-200" : "bg-green-100 border-green-600 text-green-800";
                            case "purple": return isDark ? "bg-purple-500/20 border-purple-400 text-purple-200" : "bg-purple-100 border-purple-500 text-purple-800";
                            case "orange": return isDark ? "bg-orange-500/20 border-orange-400 text-orange-200" : "bg-orange-100 border-orange-500 text-orange-800";
                            default: return isDark ? "bg-blue-500/20 border-blue-400 text-blue-200" : "bg-blue-100 border-blue-500 text-blue-800";
                          }
                        } else {
                          return isDark 
                            ? "bg-slate-800/50 border-slate-600/40 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50" 
                            : "bg-white/80 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50";
                        }
                      };

                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => setRecurrence(option.value)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 
                            rounded-full border transition-all duration-200 
                            text-xs font-medium overflow-hidden relative
                            ${getColorClasses(option.color, isSelected)}
                          `}
                          whileHover={{ 
                            scale: 1.03,
                            y: -1,
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                          }}
                          whileTap={{ 
                            scale: 0.96,
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                          }}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            transition: { 
                              type: "spring", 
                              stiffness: 300, 
                              damping: 20,
                              delay: recurrenceOptions.indexOf(option) * 0.05
                            }
                          }}
                          layout
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: `linear-gradient(135deg, ${
                                  option.color === "gray" ? "#9ca3af20" :
                                  option.color === "blue" ? "#3b82f620" :
                                  option.color === "green" ? "#22c55e20" :
                                  option.color === "purple" ? "#a855f720" :
                                  option.color === "orange" ? "#f97316 20" : "#3b82f620"
                                }, transparent)`
                              }}
                              layoutId="selectedPill"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          
                          <motion.span 
                            className="text-sm relative z-10"
                            animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            {option.icon}
                          </motion.span>
                          <span className="relative z-10">{option.shortLabel}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Interval Fields */}
                <AnimatePresence>
                  {recurrence === "Custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Interval (days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={interval}
                            onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                            className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark 
                                ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500" 
                                : "bg-white/50 border-gray-300/50 text-gray-900 hover:border-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Count
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                            className={`w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark 
                                ? "bg-slate-700/50 border-slate-600/50 text-white hover:border-slate-500" 
                                : "bg-white/50 border-gray-300/50 text-gray-900 hover:border-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task Preview */}
                <div                  className={`p-3 rounded-xl border-2 relative overflow-hidden ${
                   isDark 
                     ? "bg-gradient-to-r from-slate-700/30 to-slate-600/30 border-slate-600/30" 
                     : "bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-gray-200/30"
                 }`}>
                   <div className={`absolute inset-0 pointer-events-none ${
                     isDark 
                       ? "bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-slate-900/10" 
                       : "bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-white/30"
                   }`} />
                  <div className="relative">
                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      📋 Task Preview
                    </h4>
                    <div className={`text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <p><span className="font-medium">Title:</span> {title || "No title"}</p>
                      <p><span className="font-medium">Due:</span> {dueDate ? new Date(dueDate).toLocaleString() : "No date set"}</p>
                      <p><span className="font-medium">Recurrence:</span> {recurrencePreview()}</p>
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
                  onClick={handleCloseModal}
                                     className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 overflow-hidden ${
                     isDark
                       ? "bg-slate-700/50 hover:bg-slate-600/70 text-white border-slate-600/50 hover:border-slate-500"
                       : "bg-gray-100/50 hover:bg-gray-200/70 text-gray-700 border-gray-300/50 hover:border-gray-400"
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
                  className={`p-6 rounded-xl shadow-2xl max-w-sm w-full text-center border-2 backdrop-blur-sm ${
                    isDark 
                      ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-600/50 text-white" 
                      : "bg-gradient-to-br from-white to-gray-50 border-gray-200/50 text-gray-900"
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold mb-3">Discard Changes?</h3>
                  <p className={`mb-6 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                    You have unsaved changes. Are you sure you want to discard them?
                  </p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={handleCancelClose}
                                             className={`px-5 py-2 rounded-lg font-semibold transition-colors overflow-hidden ${
                         isDark
                           ? "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                           : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                       }`}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                    >
                      Keep Editing
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmClose}
                                             className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-semibold overflow-hidden"
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

