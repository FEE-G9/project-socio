import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BackToTop from "./components/ui/BackToTop";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AuthorityLayout from "./components/layout/AuthorityLayout";

import Landing from "./pages/public/Landing";
import SignUp from "./pages/public/Sign_up";
import Login from "./pages/public/Login";

// Viewing portal for the citizen Report page:
import Report from "./pages/citizen/Report";
import ReportCrime from "./pages/citizen/ReportCrime";

import Home from "./pages/citizen/Home";
import Profile from "./pages/citizen/Profile";
import Settings from "./pages/citizen/Settings";
import Dashboard from "./pages/citizen/Dashboard";
// import Map from "./pages/citizen/Map";
import Announcements from "./pages/citizen/Announcements";
import Maintenance from "./pages/citizen/Maintenance";

import AdminHome from "./pages/authority/Admin";
import Analytics from "./pages/authority/Analytics";
import Issues from "./pages/authority/Issues";
import Crimes from "./pages/authority/Crimes";
import Members from "./pages/authority/Members";
import ManageFees from "./pages/authority/ManageFees";
import PostAnnouncement from "./pages/authority/PostAnnouncement";
import AuthorityProfile from "./pages/authority/AuthorityProfile";

function App() {
  return (
    <>
      <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= CITIZEN ================= */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Navigate to="/login" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* <Route path="map" element={<Map />} /> */}
        <Route path="report" element={<Report />} />
        <Route path="report-crime" element={<ReportCrime />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="fees" element={<Maintenance />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>

      {/* ================= AUTHORITY ================= */}
      <Route path="/authority" element={<AuthorityLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="issues" element={<Issues />} />
        <Route path="crimes" element={<Crimes />} />
        <Route path="members" element={<Members />} />
        <Route path="fees" element={<ManageFees />} />
        <Route path="announcements" element={<PostAnnouncement />} />
        <Route path="profile" element={<AuthorityProfile />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
      </Routes>
      <BackToTop />
    </>
  );
}

export default App;
