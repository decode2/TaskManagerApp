import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import CenteredFormLayout from "./components/layouts/CenteredFormLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen text-gray-900 dark:text-white transition-colors duration-300">

        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Auth routes inside CenteredFormLayout */}
            <Route
              path="/register"
              element={
                <CenteredFormLayout>
                  <RegisterForm />
                </CenteredFormLayout>
              }
            />
            <Route
              path="/login"
              element={
                <CenteredFormLayout>
                  <LoginForm />
                </CenteredFormLayout>
              }
            />

            {/* Protected Dashboard inside DashboardLayout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </ThemeProvider>
  );
}

export default App;
