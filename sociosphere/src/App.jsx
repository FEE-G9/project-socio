import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";

import Login from "./pages/public/Login";
import Landing from "./pages/public/Landing";

// Viewing portal for the citizen Report page:
import Report from "./pages/citizen/Report";
import ReportCrime from "./pages/citizen/ReportCrime";

import Home from "./pages/citizen/Home";

function App() {

  // return <Landing />;
  // To preview Report, comment the line above and uncomment:
  // return <Report />;
  // return <ReportCrime />;
  return <Home/>
  
import Profile from "./pages/citizen/Profile";
import Home from "./pages/citizen/Home";
import Dashboard from "./pages/citizen/Dashboard";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Citizen */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;