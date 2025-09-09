import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ProfileModal from "./ProfileModalNew";

interface TopNavigationProps {
  onThemeToggle: () => void;
  isDark: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onThemeToggle, isDark }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map(part => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    setIsProfileModalOpen(true);
    setIsUserMenuOpen(false);
  };

  if (!user) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 dark:bg-slate-900/20 dark:border-slate-700/30 relative" style={{ zIndex: 1000 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white no-select">
              🎯 TaskManager
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-200 no-select"
              aria-label="Toggle theme"
            >
              <span className="text-lg no-select">
                {isDark ? "🌕" : "🌙"}
              </span>
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 no-select"
                aria-label="User menu"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium no-select">
                  {getUserInitials(user.email)}
                </div>
                
                {/* User Info */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-600/50 py-2 backdrop-blur-md user-dropdown"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {user.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-gray-300">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button 
                        onClick={handleProfileClick}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-gray-100 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors duration-150 no-select"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </div>
                      </button>


                      <button 
                        onClick={handleSettingsClick}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-gray-100 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors duration-150 no-select"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </div>
                      </button>

                      <button className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-gray-100 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors duration-150 no-select">
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Help & Support</span>
                        </div>
                      </button>
                    </div>

                    {/* Logout Separator */}
                    <div className="border-t border-gray-200/50 dark:border-slate-700/50 my-2"></div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-700 dark:text-red-300 hover:bg-red-50/80 dark:hover:bg-red-900/40 transition-colors duration-150 no-select"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 no-select" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign out</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </nav>
  );
};

export default TopNavigation;
