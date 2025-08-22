import { useState } from "react";
import Calendar from "react-calendar";
import { Task } from "../types/Task";
import { format } from "date-fns";
import useDarkMode from "../hooks/useDarkMode";

interface Props {
  tasks: Task[];
}

const CalendarView = ({ tasks }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDark] = useDarkMode();

  const getTasksForDate = (date: Date) =>
    tasks.filter(
      (task) => new Date(task.date).toDateString() === date.toDateString()
    );

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayTasks = getTasksForDate(date);
      return (
        <div className="mt-1 flex flex-col items-center space-y-0.5">
          {dayTasks.length > 0 && (
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              • {dayTasks.length}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-gray-800 dark:text-white transition-colors duration-300">
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) setSelectedDate(value);
        }}
        value={selectedDate}
        tileContent={tileContent}
        calendarType="iso8601"
        next2Label={null}
        prev2Label={null}
        className="rounded-lg shadow border border-gray-200 dark:border-slate-600 p-2 bg-white dark:bg-slate-800 dark:text-white"
      />

      {selectedDate && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-3" style={{ color: isDark ? '#ffffff' : '#1f2937' }}>
            Tasks for {format(selectedDate, "EEE MMM dd yyyy")}
          </h3>

          <ul className="space-y-2">
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                No tasks for this day.
              </p>
            ) : (
              getTasksForDate(selectedDate).map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm text-sm transition-all animate-sladeIn
                    ${
                      task.isCompleted
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-white"
                    }`}
                >
                  <span
                    className={`transition-transform duration-300 ${
                      task.isCompleted ? "scale-100" : "scale-90"
                    }`}
                  >
                    {task.isCompleted ? "✅" : "⬜"}
                  </span>
                  <span className={task.isCompleted ? "line-through" : ""}>
                    {task.title}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
