import React, { useEffect } from "react";
import CharitySearch from "./containers/CharitySearch/CharitySearch";
import Dashboard from "./containers/Dashboard/Dashboard";
import Login from "./containers/login/login";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import TaxReporting from "./containers/TaxReporting/TaxReporting";
import Account from "./containers/Account/Account";
import LearnMore from "./containers/LearnMore/LearnMore";
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import ResetPassword from "./containers/ResetPassword/ResetPassword";
import PrivacyPolicy from "./containers/PrivacyPolicy/PrivacyPolicy";
import UpdateAccount from "./containers/UpdateAccount/UpdateAccount";
import "./Styles/index.scss";


// index.js or App.jsx
import { AuthProvider } from "./containers/Context/authContext"; // ✅ import provider

const siteId = 6438849;
const hotjarVersion = 6;

function HotjarRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.hj) {
      window.hj("stateChange", location.pathname);
    }
  }, [location]);

  return null;
}

const App = () => {
  useEffect(() => {
    console.log("Hotjar init running");
    if (process.env.NODE_ENV === "production") {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);

  return (
    // ✅ Wrap everything inside AuthProvider
    <AuthProvider>
      <Router>
        <HotjarRouteTracker />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/update-account" element={<UpdateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/LearnMore" element={<LearnMore />} />
          <Route path="/register" element={<Account />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/CharitySearch" element={<PrivateRoute element={<CharitySearch />} />} />
          <Route path="/DonationHistory" element={<PrivateRoute element={<TaxReporting />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
