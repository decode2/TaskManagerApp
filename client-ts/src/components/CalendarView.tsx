import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Task } from "../types/Task";
import { format } from "date-fns";

interface Props {
  tasks: Task[];
}

const CalendarView = ({ tasks }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) => new Date(task.date).toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayTasks = getTasksForDate(date);
      return (
        <div className="mt-1 flex flex-col items-center space-y-0.5">
          {dayTasks.length > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-300 font-semibold">
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
          if (value instanceof Date) {
            setSelectedDate(value);
          }
        }}
        value={selectedDate}
        tileContent={tileContent}
        calendarType="iso8601"
        next2Label={null}
        prev2Label={null}
        className="rounded-lg shadow border border-gray-200 dark:border-slate-600 p-2 dark:bg-slate-800 dark:text-white"
      />

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Tasks for {format(selectedDate, "EEE MMM dd yyyy")}
          </h3>
          <ul className="space-y-2">
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No tasks for this day.
              </p>
            ) : (
                getTasksForDate(selectedDate).map((task) => (
                    <li
                      key={task.id}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm text-sm transition-colors
                        ${task.isCompleted
                          ? "bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
                        }`}
                    >
                      <span className="text-lg">
                        {task.isCompleted ? "✅" : "⌛"}
                      </span>
                      <span className={`flex-1 ${task.isCompleted ? "line-through opacity-70" : "font-medium"}`}>
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
