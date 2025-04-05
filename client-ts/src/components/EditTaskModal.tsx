import React, { useEffect, useState } from "react";
import { Task, RecurrenceType } from "../types/Task";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTaskModal: React.FC<Props> = ({ task, onClose, onUpdated }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.None);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number | undefined>(undefined);
  const [recurrenceCount, setRecurrenceCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(task.date.slice(0, 16));
      setRecurrenceType(task.recurrenceType);
      setRecurrenceInterval(task.recurrenceInterval);
      setRecurrenceCount(task.recurrenceCount);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7044/api/tasksapi/${task?.id}`,
        {
          id: task?.id,
          title,
          date,
          recurrenceType,
          recurrenceInterval,
          recurrenceCount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Task updated");
      onUpdated();
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <AnimatePresence>
      {task && (
        <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800 text-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md relative"
            >
              <Dialog.Title className="text-2xl font-bold mb-4">Edit Task</Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-700 placeholder-gray-400"
                  placeholder="Title"
                  required
                />
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-700"
                  required
                />
                <select
                  value={recurrenceType}
                  onChange={(e) => setRecurrenceType(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-700"
                >
                  {Object.entries(RecurrenceType)
                    .filter(([key, val]) => !isNaN(Number(val)))
                    .map(([key, val]) => (
                      <option key={val} value={val}>{key}</option>
                    ))}
                </select>
                {recurrenceType === RecurrenceType.Custom && (
                  <>
                    <input
                      type="number"
                      placeholder="Interval (e.g. every 3 days)"
                      value={recurrenceInterval ?? ""}
                      onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-slate-700"
                    />
                    <input
                      type="number"
                      placeholder="Count (number of recurrences)"
                      value={recurrenceCount ?? ""}
                      onChange={(e) => setRecurrenceCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-slate-700"
                    />
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                  >
                    Save
                  </button>
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
