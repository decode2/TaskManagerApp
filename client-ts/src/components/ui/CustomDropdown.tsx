import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDarkMode from '../../hooks/useDarkMode';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxHeight?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  disabled = false,
  searchable = false,
  maxHeight = "160px"
}) => {
  const [isDark] = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false), { enabled: isOpen });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string | number) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getOptionIcon = (option: DropdownOption) => {
    if (option.icon) {
      return (
        <span className="text-sm mr-1 flex-shrink-0">
          {option.icon}
        </span>
      );
    }
    return null;
  };


  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        {/* Dropdown Trigger */}
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 sm:px-3 py-3 sm:py-2.5 rounded-lg border-2 transition-all duration-200 text-left flex items-center justify-between group min-h-[44px] touch-manipulation ${
            isDark 
              ? 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/50' 
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          } ${isOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : ''} ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          whileHover={!disabled ? {} : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption ? (
              <>
                {getOptionIcon(selectedOption)}
                <span className={`text-sm sm:text-sm font-medium truncate ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedOption.label}
                </span>
              </>
            ) : (
              <span className={`text-sm truncate ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {placeholder}
              </span>
            )}
          </div>
          
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={`absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden ${
                isDark 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-gray-200'
              }`}
              style={{ maxHeight }}
            >
              {/* Search Input */}
              {searchable && (
                <div className={`p-2 border-b ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className={`w-full px-2 py-2 sm:py-1.5 rounded border text-sm sm:text-xs transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 touch-manipulation ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              )}

              {/* Options List */}
              <div className="max-h-36 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200/50 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800/50">
                {filteredOptions.length === 0 ? (
                  <div className={`p-2 text-center text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={`w-full px-3 py-3 sm:py-2 text-left flex items-center gap-2 transition-all duration-200 min-h-[44px] touch-manipulation ${
                        isDark 
                          ? 'text-white' 
                          : 'text-gray-900'
                      } ${
                        option.disabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer'
                      }`}
                      style={value === option.value ? { 
                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 246, 255, 1)',
                        borderLeft: '4px solid rgb(59, 130, 246)',
                        marginLeft: '-12px',
                        marginRight: '-12px',
                        paddingLeft: '12px',
                        paddingRight: '12px'
                      } : {}}
                      whileHover={!option.disabled && value !== option.value ? { 
                        backgroundColor: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(249, 250, 251, 0.8)' 
                      } : {}}
                      whileTap={!option.disabled ? { scale: 0.98 } : {}}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      {getOptionIcon(option)}
                      <span className="text-sm font-medium flex-1 truncate">
                        {option.label}
                      </span>
                      {value === option.value && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-blue-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomDropdown;
