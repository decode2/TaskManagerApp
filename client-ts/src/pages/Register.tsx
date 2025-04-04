import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
  });

  useEffect(() => {
    setPasswordValidations({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(email, password);
      navigate("/success", { state: { message: "Account created!" } });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const messages = Object.values(errors).flat();
        setError(messages.join(" "));
      } else if (error.response?.status === 404) {
        setError("The registration service is currently unavailable. Please try again later.");
      } else if (error.response?.status === 500) {
        setError("Something went wrong on the server. Please try again later.");
      } else if (error.response?.status === 400) {
        setError("Invalid input. Please check your data and try again.");
      } else {
        setError("Failed to register. Please try again.");
      }
    }
    
  };

  const validationItem = (label: string, valid: boolean) => (
    <li className="flex items-center gap-2">
      <span className={`${valid ? "text-green-400 dark:text-green-300" : "text-red-400 dark:text-red-300"}`}>
        {valid ? "✓" : "✕"}
      </span>
      <span className={`${valid ? "text-green-400 dark:text-green-300" : "text-red-400 dark:text-red-300"}`}>
        {label}
      </span>
    </li>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900 dark:from-black dark:via-gray-800 dark:to-gray-900 transition-all duration-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create an Account
        </h1>

        <input
          className="border border-gray-300 dark:border-slate-600 rounded p-2 w-full mb-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 dark:border-slate-600 rounded p-2 w-full mb-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ul className="text-sm mb-4 space-y-1 p-4 rounded bg-slate-200 dark:bg-slate-700 shadow-inner">
          {validationItem("At least 8 characters", passwordValidations.length)}
          {validationItem("At least one uppercase letter", passwordValidations.uppercase)}
          {validationItem("At least one lowercase letter", passwordValidations.lowercase)}
          {validationItem("At least one number", passwordValidations.digit)}
        </ul>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
