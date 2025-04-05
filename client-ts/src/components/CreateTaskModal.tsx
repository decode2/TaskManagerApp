import React, { useState } from "react";
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
  const [recurrenceType, setRecurrenceType] = useState("None");
  const [interval, setInterval] = useState<number | "">("");
  const [count, setCount] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://localhost:7044/api/tasksapi",
        {
          title,
          date,
          recurrenceType,
          recurrenceInterval: recurrenceType === "Custom" ? interval : null,
          recurrenceCount: recurrenceType === "Custom" ? count : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onCreated();
    } catch {
      alert("Failed to create task.");
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
            className="bg-slate-800 text-white p-6 rounded-xl shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Create Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-700 text-white"
              />
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-700 text-white"
              />
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-700 text-white"
              >
                {recurrenceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {recurrenceType === "Custom" && (
                <>
                  <input
                    type="number"
                    placeholder="Interval (e.g., every X days)"
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-slate-700 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Count (how many repetitions)"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-slate-700 text-white"
                  />
                </>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
