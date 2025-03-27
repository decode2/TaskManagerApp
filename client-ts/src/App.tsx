import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
              
      <ToastContainer position="top-center" autoClose={3000} />          
    </>
  );
}

export default App;
