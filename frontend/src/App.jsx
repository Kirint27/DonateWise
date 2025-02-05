import React, { useState, useEffect } from "react";
import CharitySearch from "./containers/CharitySearch/CharitySearch";
import Dashboard from "./containers/Dashboard/Dashboard";
import Login from "./containers/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  

  
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
<Login />
            }
          />
  
          <Route
            path="/dashboard"
            element={
                <Dashboard  />
            }
          />
          <Route
            path="/CharitySearch"
            element={
                <CharitySearch />
            }
          />
      
        </Routes>

  </Router>

    
    );
  };
export default App