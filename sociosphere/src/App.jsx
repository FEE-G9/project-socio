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

function App() {

  // return <Landing />;
  // To preview Report, comment the line above and uncomment:
  // return <Report />;
  // return <ReportCrime />;
  return <Home/>
  
import Profile from "./pages/citizen/Profile";
import Home from "./pages/citizen/Home";
import Profile from "./pages/citizen/Profile";

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