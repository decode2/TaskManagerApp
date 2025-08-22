import React from "react";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800 transition-colors">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Logged in as <strong className="text-gray-900 dark:text-white">{user.email}</strong>
      </span>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;