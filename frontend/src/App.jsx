import React, { useState, useEffect } from "react";
import CharitySearch from "./containers/CharitySearch/CharitySearch";
import Dashboard from "./containers/Dashboard/Dashboard";
import login from "./containers/login/login"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import TaxReporting from "./containers/TaxReporting/TaxReporting";
import Account from "./containers/Account/Account";
import LearnMore from "./containers/LearnMore/LearnMore";
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import ResetPassword from "./containers/ResetPassword/ResetPassword";
import PrivacyPolicy from "./containers/PrivacyPolicy/PrivacyPolicy";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path ="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/register" element={<Account />} />     
           <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Updated private route handling */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/CharitySearch" element={<PrivateRoute element={<CharitySearch />} />} />
        <Route path="/tax-reporting" element={<PrivateRoute element={<TaxReporting />} />} />
      </Routes>
    </Router>
  );
};

export default App;
