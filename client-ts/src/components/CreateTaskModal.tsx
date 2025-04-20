import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const recurrenceOptions = [
  { label: "None", value: "None" },
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Custom Interval", value: "Custom" },
];

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [hasTime, setHasTime] = useState(true);
  const [recurrenceType, setRecurrenceType] = useState("None");
  const [interval, setInterval] = useState<number | "">("");
  const [count, setCount] = useState<number | "">("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isCustom = recurrenceType === "Custom";
  const isIntervalValid = !isCustom || (typeof interval === "number" && interval > 0);
  const isCountValid = !isCustom || (typeof count === "number" && count > 0);
  const isFormValid = title && date && isIntervalValid && isCountValid;

  useEffect(() => {
    if (open && !date) {
      const now = new Date();
      const formatted = now.toISOString().slice(0, 16);
      setDate(formatted);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDate("");
      setInterval("");
      setCount("");
      setError("");
      setIsSuccess(false);
    }
  }, [open]);

  const recurrencePreview = () => {
    switch (recurrenceType) {
      case "None":
        return "This task will occur once and will not repeat.";
      case "Daily":
        return "This task will repeat every day indefinitely.";
      case "Weekly":
        return "This task will repeat once a week.";
      case "Monthly":
        return "This task will repeat monthly on the same date.";
      case "Custom":
        if (isIntervalValid && isCountValid) {
          return `This task will repeat every ${interval} day(s), ${count} times total.`;
        }
        return "Please enter a valid interval and count for custom recurrence.";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      let recurrenceInterval = null;
      let recurrenceCount = null;

      if (recurrenceType === "Custom") {
        recurrenceInterval = interval;
        recurrenceCount = count;
      }

      await axios.post(
        "https://localhost:7044/api/tasksapi",
        {
          title,
          date: hasTime ? date : date + "T00:00:00",
          recurrenceType,
          recurrenceInterval,
          recurrenceCount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        onCreated();
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Error creating task:", err);
      setError(err?.response?.data?.message || "Failed to create task.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layout
            className="bg-slate-800 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-600"
            transition={{ layout: { duration: 0.45, ease: [0.25, 0.8, 0.25, 1] } }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-300">📝 Create New Task</h2>
            <motion.div layout>
              <form onSubmit={handleSubmit} className="space-y-4">

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 text-center font-medium"
                  >
                    ✅ Task created!
                  </motion.div>
                )}

                <motion.div layout>
                  <label className="text-sm font-medium block mb-1 ml-1">Task Title</label>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </motion.div>

                <motion.div layout>
                  <label className="text-sm font-medium block mb-1 ml-1">Date</label>
                  <input
                    type={hasTime ? "datetime-local" : "date"}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </motion.div>

                <motion.div layout className="relative mt-2">
                  <div className="flex justify-between gap-2">
                    <motion.button
                      layout
                      type="button"
                      className={`w-full px-4 py-2 rounded-lg text-sm transition font-medium border ${
                        hasTime
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                      animate={{ scale: hasTime ? 1.05 : 1 }}
                      onClick={() => setHasTime(true)}
                    >
                      ⏰ Date & Time
                    </motion.button>
                    <motion.button
                      layout
                      type="button"
                      className={`w-full px-4 py-2 rounded-lg text-sm transition font-medium border ${
                        !hasTime
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                      animate={{ scale: !hasTime ? 1.05 : 1 }}
                      onClick={() => setHasTime(false)}
                    >
                      📅 Date Only
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div layout>
                  <label className="text-sm font-medium block mb-1 ml-1">Recurrence</label>
                  <select
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {recurrenceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <AnimatePresence mode="wait">
                  {isCustom && (
                    <motion.div
                      key="customFields"
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <input
                        type="number"
                        placeholder="Every X days"
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      {!isIntervalValid && (
                        <div className="text-red-400 text-sm">Interval must be a positive number</div>
                      )}
                      <input
                        type="number"
                        placeholder="Number of repetitions"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      {!isCountValid && (
                        <div className="text-red-400 text-sm">Count must be at least 1</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {recurrencePreview() && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-blue-300 bg-slate-700 p-3 rounded-lg shadow-inner border border-slate-600 overflow-hidden"
                    >
                      <strong className="block mb-1">📋 Task Preview</strong>
                      <div>{recurrencePreview()}</div>
                      {!hasTime && <p className="mt-2">• This task does not require a specific time.</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <motion.div layout className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition shadow"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Task"}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
