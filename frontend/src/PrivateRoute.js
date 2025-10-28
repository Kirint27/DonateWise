import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./containers/Context/authContext";
 
const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Replace with spinner if you want
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
