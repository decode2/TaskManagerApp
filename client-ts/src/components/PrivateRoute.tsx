import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  return <>{user ? children : <Navigate to="/login" replace />}</>;
};

export default PrivateRoute;