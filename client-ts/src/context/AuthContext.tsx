// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { login, logout, register } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import rawApi from "../services/rawApi";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadingUser: boolean;
}

interface DecodedToken {
  email: string;
  userId: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired, try to refresh
          try {
            const res = await rawApi.post("/auth/refresh");
            const newToken = res.data.token;
            localStorage.setItem("token", newToken);
            
            const newDecoded = jwtDecode<DecodedToken>(newToken);
            setUser({ email: newDecoded.email });
            console.log("🔄 Access token refreshed on app load");
          } catch (refreshErr) {
            console.warn("🔒 Refresh failed, clearing localStorage token");
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          // Token is still valid
          setUser({ email: decoded.email });
          console.log("✅ Token is still valid");
        }
      } catch (err) {
        console.warn("🔒 Invalid token, clearing localStorage");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    initializeUser();
  }, []);
  

  const handleLogin = async (email: string, password: string) => {
    const token = await login(email, password);
    const decoded = jwtDecode<DecodedToken>(token);
    setUser({ email: decoded.email });
  };

  const handleRegister = async (email: string, password: string) => {
    await register(email, password);
    await handleLogin(email, password); // Auto-login after register
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout, loadingUser }}
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
