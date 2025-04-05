import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      await login(email, password);
      setShowSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2200);
    } catch (error) {
      setError("Invalid email or password.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900 dark:from-black dark:via-gray-800 dark:to-gray-900 transition-all duration-700">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-sm"
          >
            {error && (
              <div className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-300 px-4 py-2 rounded">
                {error}
              </div>
            )}
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Sign in to Task Manager
            </h1>
            <input
              className="border border-gray-300 dark:border-slate-600 rounded p-2 w-full mb-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border border-gray-300 dark:border-slate-600 rounded p-2 w-full mb-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center text-white text-3xl font-bold animate-pulse"
          >
            Welcome back! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
