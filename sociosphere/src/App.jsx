import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AuthorityLayout from "./components/layout/AuthorityLayout";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";

// Viewing portal for the citizen Report page:
import Report from "./pages/citizen/Report";
import ReportCrime from "./pages/citizen/ReportCrime";

import Home from "./pages/citizen/Home";
import Profile from "./pages/citizen/Profile";
import Dashboard from "./pages/citizen/Dashboard";
import Map from "./pages/citizen/Map";


function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= CITIZEN ================= */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map" element={<Map />} />
        <Route path="report" element={<Report />} />
        <Route path="report-crime" element={<ReportCrime />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ================= AUTHORITY ================= */}
      <Route path="/authority" element={<AuthorityLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;