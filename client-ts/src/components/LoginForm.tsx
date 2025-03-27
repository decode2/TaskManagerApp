import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CenteredFormLayout from "./CenteredFormLayout";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7044/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response);
      
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">Sign In</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

        <div>
          <label className="block mb-1 font-medium text-gray-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
