import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store user info or null
  const [loading, setLoading] = useState(true);

  // Fetch user info on app load
  useEffect(() => {
    fetch("http://localhost:3001/api/auth-status", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setUser({ id: data.userId }); // or fetch more user details elsewhere
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    fetch("http://localhost:3001/api/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);