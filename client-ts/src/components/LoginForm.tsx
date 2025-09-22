import { useState } from "react";
import api from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CenteredFormLayout from "./layouts/CenteredFormLayout";
import useDarkMode from "../hooks/useDarkMode";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const darkMode = useDarkMode();
  const isDark = darkMode[0];
  const setIsDark = darkMode[1];

  const handleThemeToggle = () => {
    if (typeof setIsDark === 'function') {
      setIsDark(!isDark);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Axios error occurred
      
        // Identity-style array errors
        if (Array.isArray(err.response?.data)) {
          setError(err.response?.data?.[0]?.description || "Something went wrong.");
        }
        // ModelState-style errors
        else if (err.response?.data?.errors) {
          const errors = err.response.data.errors;
          const firstKey = Object.keys(errors)[0];
          setError(errors[firstKey][0]);
        }
        // Generic message
        else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong.");
        }
      }
      
    }
  };

  return (
    <CenteredFormLayout>

      <div className="flex justify-end mb-4">
        <button
                          onClick={handleThemeToggle}
          type="button"
          className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded shadow-sm hover:scale-105 transition"
        >
          {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">Sign In</h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-slate-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600 dark:text-gray-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-slate-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>

    </CenteredFormLayout>
  );
}
