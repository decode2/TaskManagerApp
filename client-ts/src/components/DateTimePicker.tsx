import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import { format, setHours, setMinutes } from "date-fns";
import useDarkMode from "../hooks/useDarkMode";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date and time",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    if (value) {
      try {
        // Handle both ISO string and datetime-local format
        const date = new Date(value);
        return format(date, "HH:mm");
      } catch (error) {
        console.warn("Error parsing date value:", value, error);
        return "12:00";
      }
    }
    return "12:00";
  });
  const [isDark] = useDarkMode();
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Update value when date or time changes
  useEffect(() => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const dateTime = setMinutes(setHours(selectedDate, hours), minutes);
      
      // Format as local datetime string to avoid timezone issues
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, '0');
      const day = String(dateTime.getDate()).padStart(2, '0');
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      onChange(`${year}-${month}-${day}T${timeString}`);
    }
  }, [selectedDate, selectedTime, onChange]);

  // Initialize with current date if no value
  useEffect(() => {
    if (!value && !selectedDate) {
      const now = new Date();
      setSelectedDate(now);
      setSelectedTime(format(now, "HH:mm"));
    }
  }, [value, selectedDate]);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  };

  const displayValue = value 
    ? (() => {
        try {
          const date = new Date(value);
          return format(date, "MMM dd, yyyy 'at' HH:mm");
        } catch (error) {
          console.warn("Error formatting display value:", value, error);
          return placeholder;
        }
      })()
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input Display */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left ${
          isDark 
            ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 hover:border-slate-500" 
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <span className={value ? "" : "text-gray-500"}>
            {displayValue}
          </span>
          <motion.span 
            className="text-lg"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            📅
          </motion.span>
        </div>
      </motion.button>

      {/* Dropdown Picker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl shadow-2xl border-2 backdrop-blur-sm ${
              isDark 
                ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-600/50" 
                : "bg-gradient-to-br from-white via-gray-50 to-white border-gray-300/70"
            }`}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}>
                  📅 Select Date & Time
                </h3>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark 
                      ? "hover:bg-slate-700 text-gray-400 hover:text-gray-200" 
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Calendar */}
              <div className="mb-4">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  className={`w-full ${
                    isDark 
                      ? "bg-slate-800/50 text-white border-slate-600/50" 
                      : "bg-white text-gray-900 border-gray-200"
                  } rounded-lg border p-3`}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const baseClasses = isDark 
                        ? "text-slate-200 hover:bg-slate-700/70 rounded-lg transition-colors" 
                        : "text-gray-700 hover:bg-gray-100 rounded-lg transition-colors";
                      
                      // Highlight selected date
                      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                        return isDark 
                          ? "bg-blue-600 text-white hover:bg-blue-700 rounded-lg" 
                          : "bg-blue-500 text-white hover:bg-blue-600 rounded-lg";
                      }
                      
                      return baseClasses;
                    }
                    return "";
                  }}
                  navigationLabel={({ date }) => format(date, "MMMM yyyy")}
                  formatShortWeekday={(locale, date) => format(date, "EEE")}
                />
              </div>

              {/* Time Selector */}
              <div className="border-t pt-4">
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  ⏰ Select Time
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200/50 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800/50">
                  {generateTimeOptions().map((time) => (
                    <motion.button
                      key={time}
                      type="button"
                      onClick={() => handleTimeChange(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? isDark
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-500 text-white shadow-lg"
                          : isDark
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 border border-slate-600/30"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Time Buttons */}
              <div className="mt-4 pt-4 border-t">
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  ⚡ Quick Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Now", time: format(new Date(), "HH:mm"), icon: "⚡" },
                    { label: "00:30", time: "00:30", icon: "🌙" },
                    { label: "06:00", time: "06:00", icon: "🌅" },
                    { label: "12:00", time: "12:00", icon: "☀️" },
                    { label: "18:00", time: "18:00", icon: "🌆" },
                    { label: "23:00", time: "23:00", icon: "🌃" },
                  ].map(({ label, time, icon }) => (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => handleTimeChange(time)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                        selectedTime === time
                          ? isDark
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-500 text-white shadow-lg"
                          : isDark
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 border border-slate-600/30"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Done Button */}
              <div className="mt-4 pt-4 border-t">
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✅ Done
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateTimePicker;
