import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const url = `https://charitytrackr.onrender.com`;  // Directly concatenate the URL
    // Log this to check if it's being set correctly
  
    console.log("API URL:", url);  // Add this to ensure the URL is being set correctly
  
    fetch(`${url}/api/auth-status`, {
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

