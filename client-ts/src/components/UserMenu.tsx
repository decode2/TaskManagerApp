import React from "react";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <span className="text-sm">Logged in as <strong>{user.email}</strong></span>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;