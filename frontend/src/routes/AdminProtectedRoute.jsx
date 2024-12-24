import React from "react";
import { Navigate } from "react-router-dom";
import useAdminAuth from "../hooks/useAdminAuth";

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to='/admin' />;
  }

  return children;
}
