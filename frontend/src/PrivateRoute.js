import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;  // Log this to check if it's being set correctly
  
    console.log("API URL:", apiUrl);  // Add this to ensure the URL is being set correctly
  
    fetch(`${apiUrl}/api/auth-status`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Auth status response:", data);
        setIsAuthenticated(data.authenticated);
      })
      .catch((error) => {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      });
  }, []);
  
  if (isAuthenticated === null) return <p>Loading...</p>; // ✅ Show loading state until check completes

  return isAuthenticated ? Component : <Navigate to="/" />;
};


 

export default PrivateRoute;

