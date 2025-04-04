import React, { createContext, useContext, useEffect, useState } from "react";
import { login, logout, register } from "../services/authService";
import { jwtDecode } from "jwt-decode";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface DecodedToken {
  email: string;
  userId: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({ email: decoded.email });
      } catch (err) {
        console.error("Invalid token:", err);
        setUser(null);
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const token = await login(email, password);
    const decoded = jwtDecode<DecodedToken>(token);
    setUser({ email: decoded.email });
  };

  const handleRegister = async (email: string, password: string) => {
    await register(email, password);
    await handleLogin(email, password); // log in right after register
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
