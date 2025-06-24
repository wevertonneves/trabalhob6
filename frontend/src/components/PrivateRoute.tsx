import React from "react"; // IMPORTAÇÃO NECESSÁRIA
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
